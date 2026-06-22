import { describe, it, expect } from "vitest";
import {
  capForTier,
  DEFAULT_FREE_RUN_QUOTA,
  DEFAULT_TIER_CAPS,
  exceedsCostCap,
  exceedsFreeRunQuota,
  isPaidTier,
  loadFreeRunQuota,
  loadTierCaps,
} from "./cost-cap.ts";

const envOf = (map: Record<string, string>) => (k: string) => map[k];

describe("isPaidTier", () => {
  it("only solo/team/business are paid", () => {
    expect(isPaidTier("solo")).toBe(true);
    expect(isPaidTier("team")).toBe(true);
    expect(isPaidTier("business")).toBe(true);
    expect(isPaidTier("free")).toBe(false);
    expect(isPaidTier(null)).toBe(false);
    expect(isPaidTier(undefined)).toBe(false);
  });
});

describe("capForTier", () => {
  it("returns the per-tier cap, treating unknown/null as free", () => {
    expect(capForTier("business")).toBe(DEFAULT_TIER_CAPS.business);
    expect(capForTier("solo")).toBe(DEFAULT_TIER_CAPS.solo);
    expect(capForTier("free")).toBe(DEFAULT_TIER_CAPS.free);
    expect(capForTier("nonsense")).toBe(DEFAULT_TIER_CAPS.free);
    expect(capForTier(null)).toBe(DEFAULT_TIER_CAPS.free);
  });

  it("honours an explicit caps table", () => {
    expect(capForTier("team", { free: 1, solo: 2, team: 3, business: 4 })).toBe(3);
  });
});

describe("loadTierCaps", () => {
  it("falls back to defaults when env is unset/blank/invalid", () => {
    expect(loadTierCaps(envOf({}))).toEqual(DEFAULT_TIER_CAPS);
    expect(loadTierCaps(envOf({ SOLO_MONTHLY_COST_CAP_USD: "" })).solo).toBe(
      DEFAULT_TIER_CAPS.solo,
    );
    expect(loadTierCaps(envOf({ TEAM_MONTHLY_COST_CAP_USD: "-5" })).team).toBe(
      DEFAULT_TIER_CAPS.team,
    );
    expect(loadTierCaps(envOf({ FREE_MONTHLY_COST_CAP_USD: "abc" })).free).toBe(
      DEFAULT_TIER_CAPS.free,
    );
  });

  it("reads overrides from env", () => {
    const caps = loadTierCaps(
      envOf({
        FREE_MONTHLY_COST_CAP_USD: "2",
        SOLO_MONTHLY_COST_CAP_USD: "30",
        TEAM_MONTHLY_COST_CAP_USD: "80",
        BUSINESS_MONTHLY_COST_CAP_USD: "300",
      }),
    );
    expect(caps).toEqual({ free: 2, solo: 30, team: 80, business: 300 });
  });
});

describe("loadFreeRunQuota", () => {
  it("defaults when unset, reads a valid override", () => {
    expect(loadFreeRunQuota(envOf({}))).toBe(DEFAULT_FREE_RUN_QUOTA);
    expect(loadFreeRunQuota(envOf({ FREE_MONTHLY_RUN_QUOTA: "3" }))).toBe(3);
    expect(loadFreeRunQuota(envOf({ FREE_MONTHLY_RUN_QUOTA: "oops" }))).toBe(
      DEFAULT_FREE_RUN_QUOTA,
    );
  });
});

describe("exceedsCostCap", () => {
  it("is pre-emptive: blocks when month + projected would breach the cap", () => {
    expect(exceedsCostCap({ monthSpendUsd: 19.95, projectedUsd: 0.1, cap: 20 })).toBe(true);
    expect(exceedsCostCap({ monthSpendUsd: 19.5, projectedUsd: 0.1, cap: 20 })).toBe(false);
    // Exactly at the cap is allowed; strictly over is blocked.
    expect(exceedsCostCap({ monthSpendUsd: 0, projectedUsd: 20, cap: 20 })).toBe(false);
    expect(exceedsCostCap({ monthSpendUsd: 0, projectedUsd: 20.01, cap: 20 })).toBe(true);
  });
});

describe("exceedsFreeRunQuota", () => {
  it("applies only to free/unknown tiers, at or above the quota", () => {
    expect(exceedsFreeRunQuota({ tier: "free", monthRunCount: 10, quota: 10 })).toBe(true);
    expect(exceedsFreeRunQuota({ tier: "free", monthRunCount: 9, quota: 10 })).toBe(false);
    // Paid tiers are never quota-limited.
    expect(exceedsFreeRunQuota({ tier: "solo", monthRunCount: 999, quota: 10 })).toBe(false);
    expect(exceedsFreeRunQuota({ tier: "business", monthRunCount: 999, quota: 10 })).toBe(false);
  });
});
