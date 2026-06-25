import { beforeEach, describe, expect, it } from "vitest";
import * as store from "./mock-store";

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
});
