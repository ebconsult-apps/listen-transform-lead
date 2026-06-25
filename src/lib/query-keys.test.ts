import { describe, it, expect } from "vitest";
import { qk } from "./query-keys";

// The query-key factory is the single source that keeps a query and its
// invalidation in lockstep, so lock its shapes down. Node-env, matches the
// repo's vitest setup.
describe("query-keys", () => {
  it("projects() is a stable top-level key", () => {
    expect(qk.projects()).toEqual(["projects"]);
  });

  it("assumptionGaps(id) scopes by projectId", () => {
    expect(qk.assumptionGaps("p1")).toEqual(["assumptionGaps", "p1"]);
    // Distinct projects must produce distinct keys (no cross-project cache bleed).
    expect(qk.assumptionGaps("p1")).not.toEqual(qk.assumptionGaps("p2"));
  });
});
