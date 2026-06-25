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

  it("getClarifyApprovedAt: null until approved, an ISO timestamp once approved", async () => {
    // a clarify run exists but no approval yet → null
    expect(await store.getClarifyApprovedAt("proj-clarify-ready")).toBeNull();
    // a seeded approved project → a valid ISO timestamp
    const seededAt = await store.getClarifyApprovedAt("proj-clarify-approved");
    expect(seededAt).toBeTruthy();
    expect(() => new Date(seededAt as string).toISOString()).not.toThrow();
    // write path: approving a freshly-run draft makes it report a timestamp
    await store.runClarify("proj-draft");
    await store.approveClarify("proj-draft", {
      whyItMatters: "w",
      objective: "o",
      keyResults: [{ kr: "k" }],
      gapLog: [],
    });
    expect(await store.getClarifyApprovedAt("proj-draft")).toBeTruthy();
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
