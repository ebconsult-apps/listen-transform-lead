import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { STACK, createUser, cleanupAll, type TestUser } from "./helpers";

/**
 * RLS tenant-isolation: a member of workspace B must not read or write workspace
 * A's project-scoped data, the shared knowledge_base is global-read but not
 * client-writable, and service-role-only tables reject client writes.
 */
describe.skipIf(!STACK)("RLS isolation", () => {
  let a: TestUser;
  let b: TestUser;

  beforeAll(async () => {
    a = await createUser();
    b = await createUser();
  });
  afterAll(async () => {
    await cleanupAll();
  });

  it("a member can read their own project", async () => {
    const { data, error } = await a.client.from("projects").select("id").eq("id", a.projectId);
    expect(error).toBeNull();
    expect(data).toHaveLength(1);
  });

  it("B cannot read A's project (RLS filters it out)", async () => {
    const { data, error } = await b.client.from("projects").select("id").eq("id", a.projectId);
    expect(error).toBeNull();
    expect(data ?? []).toHaveLength(0);
  });

  it("B cannot read A's project_inputs / runs", async () => {
    const inputs = await b.client.from("project_inputs").select("project_id").eq("project_id", a.projectId);
    expect(inputs.data ?? []).toHaveLength(0);
    const runs = await b.client.from("runs").select("id").eq("project_id", a.projectId);
    expect(runs.data ?? []).toHaveLength(0);
  });

  it("B cannot write into A's project scope", async () => {
    const run = await b.client.from("runs").insert({
      project_id: a.projectId,
      phase: "clarify",
      status: "done",
      ai_mode: "stub",
      output: {},
    });
    expect(run.error).not.toBeNull();

    const card = await b.client.from("test_cards").insert({ project_id: a.projectId, hypothesis: "x" });
    expect(card.error).not.toBeNull();

    const approval = await b.client.from("phase_approvals").insert({ project_id: a.projectId, phase: "clarify", output: {} });
    expect(approval.error).not.toBeNull();

    const finding = await b.client.from("research_findings").insert({ project_id: a.projectId, claim: "x" });
    expect(finding.error).not.toBeNull();

    const gap = await b.client.from("assumption_gaps").insert({ project_id: a.projectId, flag_type: "gap", content: "x" });
    expect(gap.error).not.toBeNull();
  });

  it("A can write into A's own project scope", async () => {
    const { error } = await a.client.from("assumption_gaps").insert({
      project_id: a.projectId,
      flag_type: "gap",
      content: "own write ok",
    });
    expect(error).toBeNull();
  });

  it("knowledge_base is global-read but not client-writable", async () => {
    const read = await a.client.from("knowledge_base").select("id").limit(1);
    expect(read.error).toBeNull();
    const write = await b.client.from("knowledge_base").insert({ title: "x", summary: "y" });
    expect(write.error).not.toBeNull();
  });

  it("service-role-only tables reject client writes (even for own workspace)", async () => {
    const ent = await a.client.from("entitlements").insert({ workspace_id: a.workspaceId, tier: "business" });
    expect(ent.error).not.toBeNull();
    const unlock = await a.client.from("project_unlocks").insert({ project_id: a.projectId, unlocked: true });
    expect(unlock.error).not.toBeNull();
    const mem = await a.client.from("memberships").insert({ workspace_id: b.workspaceId, user_id: a.userId });
    expect(mem.error).not.toBeNull();
  });
});
