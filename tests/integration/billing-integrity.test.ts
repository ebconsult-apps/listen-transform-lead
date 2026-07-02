import { describe, it, expect, afterAll } from "vitest";
import { STACK, admin, createUser, cleanupAll } from "./helpers";

/**
 * Billing & data integrity (migration 20260701120000_billing_integrity):
 * the runs table can no longer be used to reset usage accounting, the Stripe
 * dedup constraints hold at the DB layer, and the atomic credit-spend RPC
 * grants exactly one unlock per remaining credit — even under concurrency.
 */

const MONTH_START = new Date(
  new Date().getFullYear(),
  new Date().getMonth(),
  1,
).toISOString();

async function createProject(workspaceId: string, userId: string): Promise<string> {
  const { data, error } = await admin
    .from("projects")
    .insert({ workspace_id: workspaceId, name: "IT extra project", created_by: userId })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

function spendCredit(projectId: string, workspaceId: string, allotment: number) {
  return admin.rpc("spend_report_credit", {
    p_project_id: projectId,
    p_workspace_id: workspaceId,
    p_allotment: allotment,
    p_month_start: MONTH_START,
  });
}

describe.skipIf(!STACK)("runs table tamper-proofing", () => {
  afterAll(async () => {
    await cleanupAll();
  });

  it("a member can still insert runs (stub mode writes from the client)", async () => {
    const u = await createUser();
    const { error } = await u.client.from("runs").insert({
      project_id: u.projectId,
      phase: "clarify",
      status: "done",
      ai_mode: "stub",
      output: {},
    });
    expect(error).toBeNull();
  });

  it("a member cannot UPDATE or DELETE their own runs (quota/spend counters are derived from them)", async () => {
    const u = await createUser();
    const { data: run, error: insErr } = await admin
      .from("runs")
      .insert({
        project_id: u.projectId,
        phase: "clarify",
        status: "done",
        ai_mode: "live",
        output: {},
        cost_usd: 0.5,
      })
      .select("id")
      .single();
    expect(insErr).toBeNull();

    // RLS silently filters rows the policy doesn't grant: assert 0 rows affected.
    const upd = await u.client
      .from("runs")
      .update({ cost_usd: 0 })
      .eq("id", run!.id)
      .select("id");
    expect(upd.data ?? []).toHaveLength(0);

    const del = await u.client.from("runs").delete().eq("id", run!.id).select("id");
    expect(del.data ?? []).toHaveLength(0);

    // The accounting row survives untouched.
    const { data: after } = await admin.from("runs").select("cost_usd").eq("id", run!.id).single();
    expect(after?.cost_usd).toBe(0.5);
  });

  it("a member cannot DELETE a project (cascade would erase the runs + credit unlocks accounting counts)", async () => {
    const u = await createUser({ paid: true });
    const spent = await spendCredit(u.projectId, u.workspaceId, 1);
    expect(spent.data).toBe(true);

    const del = await u.client.from("projects").delete().eq("id", u.projectId).select("id");
    expect(del.data ?? []).toHaveLength(0);

    // Project, its unlock, and therefore the consumed-credit count all survive.
    const { data: project } = await admin.from("projects").select("id").eq("id", u.projectId);
    expect(project).toHaveLength(1);
    const { data: unlock } = await admin
      .from("project_unlocks")
      .select("origin")
      .eq("project_id", u.projectId)
      .single();
    expect(unlock?.origin).toBe("credit");
  });

  it("a member can still create and update projects (the client's real writes)", async () => {
    const u = await createUser();
    const { data: created, error: insErr } = await u.client
      .from("projects")
      .insert({ workspace_id: u.workspaceId, name: "member-created", created_by: u.userId })
      .select("id")
      .single();
    expect(insErr).toBeNull();

    const upd = await u.client
      .from("projects")
      .update({ status: "running" })
      .eq("id", created!.id)
      .select("id");
    expect(upd.error).toBeNull();
    expect(upd.data).toHaveLength(1);
  });
});

describe.skipIf(!STACK)("Stripe dedup constraints", () => {
  const EVT_ID = `evt_it_${Date.now()}`;
  const PI_ID = `pi_it_${Date.now()}`;

  afterAll(async () => {
    await admin.from("stripe_events").delete().eq("id", EVT_ID);
    await cleanupAll();
  });

  it("a Stripe event id can be recorded only once (replay ledger)", async () => {
    const first = await admin.from("stripe_events").insert({ id: EVT_ID, type: "checkout.session.completed" });
    expect(first.error).toBeNull();
    const replay = await admin.from("stripe_events").insert({ id: EVT_ID, type: "checkout.session.completed" });
    expect(replay.error?.code).toBe("23505");
  });

  it("a payment intent can mint only one report pass", async () => {
    const u = await createUser();
    const expires = new Date(Date.now() + 14 * 86_400_000).toISOString();
    const row = {
      workspace_id: u.workspaceId,
      stripe_payment_intent: PI_ID,
      amount_cents: 9900,
      expires_at: expires,
    };
    const first = await admin.from("report_passes").insert(row);
    expect(first.error).toBeNull();
    const dupe = await admin.from("report_passes").insert(row);
    expect(dupe.error?.code).toBe("23505");
  });

  it("the webhook's exact upsert shape works: on_conflict dedupes instead of erroring", async () => {
    // Guards against the unique index becoming an invalid ON CONFLICT arbiter
    // (e.g. a partial index → 42P10 on every insert through PostgREST).
    const u = await createUser();
    const pi = `pi_it_upsert_${Date.now()}`;
    const expires = new Date(Date.now() + 14 * 86_400_000).toISOString();
    const row = {
      workspace_id: u.workspaceId,
      stripe_payment_intent: pi,
      amount_cents: 9900,
      expires_at: expires,
    };
    const opts = { onConflict: "stripe_payment_intent", ignoreDuplicates: true } as const;
    const first = await admin.from("report_passes").upsert(row, opts);
    expect(first.error).toBeNull();
    const replay = await admin.from("report_passes").upsert(row, opts);
    expect(replay.error).toBeNull();
    const { data: rows } = await admin
      .from("report_passes")
      .select("id")
      .eq("stripe_payment_intent", pi);
    expect(rows).toHaveLength(1);
  });

  it("null payment intents don't collide (unique index is NULLS DISTINCT)", async () => {
    const u = await createUser();
    const expires = new Date(Date.now() + 14 * 86_400_000).toISOString();
    const row = { workspace_id: u.workspaceId, stripe_payment_intent: null, amount_cents: 0, expires_at: expires };
    const one = await admin.from("report_passes").insert(row);
    const two = await admin.from("report_passes").insert(row);
    expect(one.error).toBeNull();
    expect(two.error).toBeNull();
  });
});

describe.skipIf(!STACK)("spend_report_credit RPC", () => {
  afterAll(async () => {
    await cleanupAll();
  });

  it("spends within the allotment, rejects beyond it, and is idempotent per project", async () => {
    const u = await createUser({ paid: true });
    const second = await createProject(u.workspaceId, u.userId);

    const a = await spendCredit(u.projectId, u.workspaceId, 1);
    expect(a.error).toBeNull();
    expect(a.data).toBe(true);

    // Allotment exhausted → the next project is refused.
    const b = await spendCredit(second, u.workspaceId, 1);
    expect(b.error).toBeNull();
    expect(b.data).toBe(false);

    // Re-spending on an already-unlocked project succeeds without a new credit.
    const again = await spendCredit(u.projectId, u.workspaceId, 1);
    expect(again.data).toBe(true);

    const { data: unlocks } = await admin
      .from("project_unlocks")
      .select("project_id, origin")
      .in("project_id", [u.projectId, second]);
    expect(unlocks).toHaveLength(1);
    expect(unlocks?.[0]).toMatchObject({ project_id: u.projectId, origin: "credit" });
  });

  it("grants exactly one unlock under concurrency with one credit left", async () => {
    const u = await createUser({ paid: true });
    const projects = [u.projectId];
    for (let i = 0; i < 4; i++) projects.push(await createProject(u.workspaceId, u.userId));

    const results = await Promise.all(projects.map((p) => spendCredit(p, u.workspaceId, 1)));
    for (const r of results) expect(r.error).toBeNull();
    const granted = results.filter((r) => r.data === true);
    expect(granted).toHaveLength(1);

    const { data: unlocks } = await admin
      .from("project_unlocks")
      .select("project_id")
      .in("project_id", projects);
    expect(unlocks).toHaveLength(1);
  });

  it("is service-role only — an authenticated client cannot call it", async () => {
    const u = await createUser({ paid: true });
    const { error } = await u.client.rpc("spend_report_credit", {
      p_project_id: u.projectId,
      p_workspace_id: u.workspaceId,
      p_allotment: 999,
      p_month_start: MONTH_START,
    });
    expect(error).not.toBeNull();
  });
});
