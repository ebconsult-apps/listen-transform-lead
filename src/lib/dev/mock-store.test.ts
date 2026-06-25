import { beforeEach, describe, expect, it } from "vitest";
import * as store from "./mock-store";
import { PRIVACY_POLICY_VERSION } from "@/content/privacy-policy";

beforeEach(() => store.resetMockDb("seeded"));

describe("mock-store seeded dataset", () => {
  it("seeds projects covering every state", async () => {
    const ids = (await store.listProjects()).map((p) => p.id);
    expect(ids).toContain("proj-draft");
    expect(ids).toContain("proj-full");
    expect(ids).toContain("proj-experiment");
    expect(ids.length).toBeGreaterThanOrEqual(8);
  });

  it("throws on a missing project (mirrors .single())", async () => {
    await expect(store.getProject("does-not-exist")).rejects.toThrow();
  });

  it("drives the paywall via per-project unlocks", async () => {
    expect((await store.getUnlock("proj-full"))?.unlocked).toBe(true);
    expect(await store.getUnlock("proj-teaser")).toBeNull();
  });

  it("seeds experiment candidates including an APEASE-parked one", async () => {
    const cands = await store.listCandidates("proj-experiment");
    expect(cands.length).toBeGreaterThan(0);
    expect(cands.some((c) => c.parked)).toBe(true);
  });

  it("runs Clarify on a draft: advances status and appends a run", async () => {
    await store.runClarify("proj-draft");
    expect((await store.getProject("proj-draft")).status).toBe("clarify_ready");
    const runs = await store.listRuns("proj-draft");
    expect(runs.some((r) => r.phase === "clarify")).toBe(true);
  });

  it("the empty dataset has no projects", async () => {
    store.resetMockDb("empty");
    expect(await store.listProjects()).toEqual([]);
  });

  it("reports the Privacy Policy as already accepted (so dev/QA New Project isn't gated)", async () => {
    const profile = await store.getMyProfile();
    expect(profile?.privacy_accepted_at).not.toBeNull();
    expect(profile?.privacy_policy_version).toBe(PRIVACY_POLICY_VERSION);
  });
});

// Clarify-stage collaboration: invites + contributions can land before any leverage
// map exists, so the Collaborate pane is reachable from the Clarify step. This guards
// the data contract that drives that flow (see seed.ts "proj-collab-clarify").
describe("mock-store Clarify-stage collaboration seed", () => {
  const ID = "proj-collab-clarify";

  it("lands on the un-approved ClarifyReview surface (clarify run, no approval, no teaser)", async () => {
    expect((await store.getProject(ID)).status).toBe("clarify_ready");
    expect(await store.getClarifyApproval(ID)).toBeNull();
    const runs = await store.listRuns(ID);
    expect(runs.some((r) => r.phase === "clarify")).toBe(true);
    expect(runs.some((r) => r.phase === "leverage_teaser")).toBe(false);
  });

  it("has invitations and exactly one submitted contribution before any map", async () => {
    const invitations = await store.listInvitations(ID);
    expect(invitations.length).toBeGreaterThanOrEqual(2);
    expect(invitations.some((i) => i.status === "submitted")).toBe(true);

    const submitted = (await store.listContributions(ID)).filter((c) => c.status === "submitted");
    expect(submitted).toHaveLength(1);
  });

  it("submitted contribution postdates the clarify run, so the re-run CTA shows", async () => {
    const clarifyRun = (await store.listRuns(ID)).find((r) => r.phase === "clarify")!;
    const submitted = (await store.listContributions(ID)).find((c) => c.status === "submitted")!;
    // newSinceRun counts contributions submitted after the last clarify run.
    expect(submitted.submitted_at).not.toBeNull();
    expect(submitted.submitted_at! > clarifyRun.created_at).toBe(true);
  });

  it("has no leverage-map reactions yet, so the reaction summary stays hidden", async () => {
    expect(await store.listReactions(ID)).toEqual([]);
  });
});
