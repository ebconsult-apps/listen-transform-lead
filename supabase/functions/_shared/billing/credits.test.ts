import { describe, it, expect } from "vitest";
import {
  allotmentForTier,
  DEFAULT_CREDIT_ALLOTMENT,
  DEFAULT_MAX_RESEARCH_RUNS_PER_PROJECT,
  exceedsResearchRunCap,
  hasCreditAvailable,
  loadCreditAllotment,
  loadMaxResearchRuns,
  loadUnlockedProjectBudgetUsd,
  remainingCredits,
} from "./credits.ts";

const envOf = (map: Record<string, string>) => (k: string) => map[k];

describe("allotmentForTier", () => {
  it("returns the per-tier allotment, treating unknown/null as free", () => {
    expect(allotmentForTier("solo")).toBe(DEFAULT_CREDIT_ALLOTMENT.solo);
    expect(allotmentForTier("team")).toBe(DEFAULT_CREDIT_ALLOTMENT.team);
    expect(allotmentForTier("business")).toBe(DEFAULT_CREDIT_ALLOTMENT.business);
    expect(allotmentForTier("free")).toBe(0);
    expect(allotmentForTier("nonsense")).toBe(0);
    expect(allotmentForTier(null)).toBe(0);
  });

  it("honours an explicit allotment table", () => {
    expect(allotmentForTier("team", { free: 0, solo: 1, team: 2, business: 3 })).toBe(2);
  });
});

describe("remainingCredits", () => {
  it("is allotment minus consumed, clamped at zero", () => {
    expect(remainingCredits("solo", 0)).toBe(5);
    expect(remainingCredits("solo", 3)).toBe(2);
    expect(remainingCredits("solo", 5)).toBe(0);
    expect(remainingCredits("solo", 99)).toBe(0); // never negative
    expect(remainingCredits("free", 0)).toBe(0); // free earns credits only via Report Pass
  });

  it("ignores negative consumed counts", () => {
    expect(remainingCredits("team", -4)).toBe(20);
  });
});

describe("hasCreditAvailable", () => {
  it("true while under allotment, false at/over it", () => {
    expect(hasCreditAvailable({ tier: "solo", consumedThisMonth: 4 })).toBe(true);
    expect(hasCreditAvailable({ tier: "solo", consumedThisMonth: 5 })).toBe(false);
    expect(hasCreditAvailable({ tier: "team", consumedThisMonth: 19 })).toBe(true);
    // Free never has a monthly credit (Report Pass is a separate origin).
    expect(hasCreditAvailable({ tier: "free", consumedThisMonth: 0 })).toBe(false);
  });
});

describe("loadCreditAllotment", () => {
  it("falls back to defaults when env is unset/blank/invalid", () => {
    expect(loadCreditAllotment(envOf({}))).toEqual(DEFAULT_CREDIT_ALLOTMENT);
    expect(loadCreditAllotment(envOf({ SOLO_REPORT_CREDITS: "" })).solo).toBe(
      DEFAULT_CREDIT_ALLOTMENT.solo,
    );
    expect(loadCreditAllotment(envOf({ TEAM_REPORT_CREDITS: "-5" })).team).toBe(
      DEFAULT_CREDIT_ALLOTMENT.team,
    );
  });

  it("reads overrides from env", () => {
    const a = loadCreditAllotment(
      envOf({
        FREE_REPORT_CREDITS: "1",
        SOLO_REPORT_CREDITS: "10",
        TEAM_REPORT_CREDITS: "40",
        BUSINESS_REPORT_CREDITS: "100",
      }),
    );
    expect(a).toEqual({ free: 1, solo: 10, team: 40, business: 100 });
  });
});

describe("loadMaxResearchRuns / loadUnlockedProjectBudgetUsd", () => {
  it("default when unset, valid override otherwise", () => {
    expect(loadMaxResearchRuns(envOf({}))).toBe(DEFAULT_MAX_RESEARCH_RUNS_PER_PROJECT);
    expect(loadMaxResearchRuns(envOf({ MAX_RESEARCH_RUNS_PER_PROJECT: "4" }))).toBe(4);
    expect(loadMaxResearchRuns(envOf({ MAX_RESEARCH_RUNS_PER_PROJECT: "oops" }))).toBe(
      DEFAULT_MAX_RESEARCH_RUNS_PER_PROJECT,
    );
    expect(loadUnlockedProjectBudgetUsd(envOf({ UNLOCKED_PROJECT_BUDGET_USD: "8" }))).toBe(8);
  });
});

describe("exceedsResearchRunCap", () => {
  it("blocks at or above the cap", () => {
    expect(exceedsResearchRunCap({ projectResearchRunCount: 9, cap: 10 })).toBe(false);
    expect(exceedsResearchRunCap({ projectResearchRunCount: 10, cap: 10 })).toBe(true);
    expect(exceedsResearchRunCap({ projectResearchRunCount: 11, cap: 10 })).toBe(true);
  });
});
