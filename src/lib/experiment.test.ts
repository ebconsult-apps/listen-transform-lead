import { describe, it, expect } from "vitest";
import { apeaseSum, apeaseParked, apeaseFlagged } from "./experiment";
import type { Apease } from "./clear/types";

/**
 * APEASE is the load-bearing rule of the EXPERIMENT phase: three 1–5 scores rank
 * ideas, but the three veto gates are never averaged — any FAIL parks the idea
 * regardless of how high its scored sum is.
 */

const allPass: Apease = {
  effectiveness: 5,
  practicability: 4,
  affordability: 3,
  acceptability: "pass",
  safety: "pass",
  equity: "pass",
};

describe("apeaseSum", () => {
  it("sums the three 1–5 scores (range 3–15)", () => {
    expect(apeaseSum(allPass)).toBe(12);
    expect(apeaseSum({ ...allPass, effectiveness: 1, practicability: 1, affordability: 1 })).toBe(3);
  });
});

describe("apeaseParked — any FAIL parks regardless of score", () => {
  it("does not park when every gate passes", () => {
    expect(apeaseParked(allPass)).toBe(false);
  });

  it.each(["acceptability", "safety", "equity"] as const)(
    "parks when the %s gate FAILs",
    (gate) => {
      expect(apeaseParked({ ...allPass, [gate]: "fail" })).toBe(true);
    },
  );

  it("parks a maxed-out (15/15) idea if any gate FAILs — points cannot win", () => {
    const brilliantButUnsafe: Apease = {
      effectiveness: 5,
      practicability: 5,
      affordability: 5,
      acceptability: "pass",
      safety: "pass",
      equity: "fail",
    };
    expect(apeaseSum(brilliantButUnsafe)).toBe(15);
    expect(apeaseParked(brilliantButUnsafe)).toBe(true);
  });

  it("does not park on a FLAG (flags are mitigations, not vetoes)", () => {
    expect(apeaseParked({ ...allPass, safety: "flag" })).toBe(false);
  });
});

describe("apeaseFlagged", () => {
  it("is true when any gate is FLAG", () => {
    expect(apeaseFlagged({ ...allPass, acceptability: "flag" })).toBe(true);
  });
  it("is false when no gate is FLAG", () => {
    expect(apeaseFlagged(allPass)).toBe(false);
    expect(apeaseFlagged({ ...allPass, equity: "fail" })).toBe(false);
  });
});
