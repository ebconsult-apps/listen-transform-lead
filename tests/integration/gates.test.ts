import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { STACK, createUser, callFn, cleanupAll, type TestUser } from "./helpers";

/**
 * Edge-function gate behavior (project-run / project-research) against a local
 * stack with AI_MODE=stub. Asserts the auth / entitlement / sequencing status
 * codes — the security boundary unit tests can't reach.
 */
describe.skipIf(!STACK)("project-run gates", () => {
  let outsider: TestUser; // member of a different workspace

  beforeAll(async () => {
    outsider = await createUser();
  });
  afterAll(async () => {
    await cleanupAll();
  });

  it("401 — no Authorization header", async () => {
    const free = await createUser();
    const { status } = await callFn(null, "project-run", { projectId: free.projectId, phase: "clarify" });
    expect(status).toBe(401);
  });

  it("403 — a non-member cannot run another workspace's project", async () => {
    const owner = await createUser();
    const { status } = await callFn(outsider.token, "project-run", { projectId: owner.projectId, phase: "clarify" });
    expect(status).toBe(403);
  });

  it("400 — unknown phase", async () => {
    const u = await createUser();
    const { status } = await callFn(u.token, "project-run", { projectId: u.projectId, phase: "bogus" });
    expect(status).toBe(400);
  });

  it("402 — free workspace cannot generate the full report or experiment", async () => {
    const free = await createUser();
    const fullRes = await callFn(free.token, "project-run", { projectId: free.projectId, phase: "full" });
    expect(fullRes.status).toBe(402);
    const expRes = await callFn(free.token, "project-run", { projectId: free.projectId, phase: "experiment" });
    expect(expRes.status).toBe(402);
  });

  it("409 — Leverage before an approved Clarify is rejected", async () => {
    const u = await createUser();
    const { status } = await callFn(u.token, "project-run", { projectId: u.projectId, phase: "leverage" });
    expect(status).toBe(409);
  });

  it("409 — paid: Full before approval, and Experiment before the full report", async () => {
    const paid = await createUser({ paid: true });
    const fullRes = await callFn(paid.token, "project-run", { projectId: paid.projectId, phase: "full" });
    expect(fullRes.status).toBe(409);
    const expRes = await callFn(paid.token, "project-run", { projectId: paid.projectId, phase: "experiment" });
    expect(expRes.status).toBe(409);
  });

  it("200 — Clarify → approve → Leverage opens the gate", async () => {
    const u = await createUser();

    const clarify = await callFn(u.token, "project-run", { projectId: u.projectId, phase: "clarify" });
    expect(clarify.status).toBe(200);
    expect(clarify.json?.status).toBe("clarify_ready");

    // Approve Clarify via the member client (RLS read+write on phase_approvals).
    const { error } = await u.client.from("phase_approvals").upsert({
      project_id: u.projectId,
      phase: "clarify",
      output: { whyItMatters: "x", objective: "y", keyResults: [{ kr: "z" }], gapLog: [] },
    });
    expect(error).toBeNull();

    const leverage = await callFn(u.token, "project-run", { projectId: u.projectId, phase: "leverage" });
    expect(leverage.status).toBe(200);
    expect(leverage.json?.status).toBe("teaser_ready");
  });
});

describe.skipIf(!STACK)("project-research gate", () => {
  afterAll(async () => {
    await cleanupAll();
  });

  it("402 — free workspace cannot run the research agent", async () => {
    const free = await createUser();
    const { status } = await callFn(free.token, "project-research", { action: "run", projectId: free.projectId });
    expect(status).toBe(402);
  });
});
