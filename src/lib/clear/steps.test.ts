import { describe, it, expect } from "vitest";
import { stepDoneMap, stepUnlockedMap, furthestStep, isStale, type StepFlags } from "./steps";

const flags = (over: Partial<StepFlags> = {}): StepFlags => ({
  isApproved: false,
  hasTeaser: false,
  showFull: false,
  canExperiment: false,
  hasExperiment: false,
  ...over,
});

// Convenience: the furthest-reached step for a given set of flags.
const furthestFor = (over: Partial<StepFlags> = {}) => {
  const f = flags(over);
  return furthestStep(stepDoneMap(f), stepUnlockedMap(f));
};

describe("stepDoneMap", () => {
  it("marks Clarify done only once approved", () => {
    expect(stepDoneMap(flags()).clarify).toBe(false);
    expect(stepDoneMap(flags({ isApproved: true })).clarify).toBe(true);
  });
  it("marks Full done only when it is actually shown (unlocked + built)", () => {
    expect(stepDoneMap(flags({ hasTeaser: true })).full).toBe(false);
    expect(stepDoneMap(flags({ hasTeaser: true, showFull: true })).full).toBe(true);
  });
  it("marks Experiment done when an experiment output exists", () => {
    expect(stepDoneMap(flags({ hasExperiment: true })).experiment).toBe(true);
  });
});

describe("stepUnlockedMap", () => {
  it("always unlocks Clarify", () => {
    expect(stepUnlockedMap(flags()).clarify).toBe(true);
  });
  it("unlocks Leverage only after Clarify is approved", () => {
    expect(stepUnlockedMap(flags()).leverage).toBe(false);
    expect(stepUnlockedMap(flags({ isApproved: true })).leverage).toBe(true);
  });
  it("unlocks Full once a teaser exists, even before payment (it shows the paywall)", () => {
    expect(stepUnlockedMap(flags({ hasTeaser: true, showFull: false })).full).toBe(true);
  });
  it("unlocks Experiment only when the full report is available", () => {
    expect(stepUnlockedMap(flags({ hasTeaser: true })).experiment).toBe(false);
    expect(stepUnlockedMap(flags({ canExperiment: true })).experiment).toBe(true);
  });
});

describe("furthestStep", () => {
  it("starts at Clarify for a fresh project", () => {
    expect(furthestFor()).toBe("clarify");
  });
  it("advances to Leverage once Clarify is approved but no teaser yet", () => {
    expect(furthestFor({ isApproved: true })).toBe("leverage");
  });
  it("advances to Full once a teaser exists (paywall lands here for unpaid users)", () => {
    expect(furthestFor({ isApproved: true, hasTeaser: true })).toBe("full");
  });
  it("stays at Full after the report is built until an experiment is generated", () => {
    expect(
      furthestFor({ isApproved: true, hasTeaser: true, showFull: true, canExperiment: true }),
    ).toBe("full");
  });
  it("advances to Experiment once an experiment output exists", () => {
    expect(
      furthestFor({
        isApproved: true,
        hasTeaser: true,
        showFull: true,
        canExperiment: true,
        hasExperiment: true,
      }),
    ).toBe("experiment");
  });
});

describe("isStale", () => {
  it("is false when either side is missing", () => {
    expect(isStale(null, "2026-06-01T00:00:00Z")).toBe(false);
    expect(isStale("2026-06-01T00:00:00Z", null)).toBe(false);
    expect(isStale(null, null)).toBe(false);
  });
  it("is true when the upstream phase was produced after the downstream one", () => {
    expect(isStale("2026-06-02T00:00:00Z", "2026-06-01T00:00:00Z")).toBe(true);
  });
  it("is false when the downstream phase is newer", () => {
    expect(isStale("2026-06-01T00:00:00Z", "2026-06-02T00:00:00Z")).toBe(false);
  });
  it("is false for the same instant across differing ISO offset formats", () => {
    // Approval writes `…Z`; DB run timestamps may serialize as `…+00:00`. Compared as
    // instants (not lexicographically) these are equal → not stale.
    expect(isStale("2026-06-17T16:00:00.000Z", "2026-06-17T16:00:00.000000+00:00")).toBe(false);
  });
});
