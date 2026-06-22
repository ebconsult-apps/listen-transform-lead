// Per-tier spend caps + free-tier run quota — pure decision logic (no npm:/Deno
// imports), so it's unit-testable in vitest. The edge functions (project-run,
// project-research) do the DB month-sum query and feed the totals into these
// pure checks.
//
// Why per-tier: a single global cap (the old WORKSPACE_MONTHLY_COST_CAP_USD) is
// simultaneously too generous for Free ($0 payers could burn the whole cap) and
// too restrictive for Business (a "$25" cap contradicts an "unlimited" plan).
// These caps are env-overridable so they can be tuned without a deploy.

export type Tier = "free" | "solo" | "team" | "business";

export interface TierCaps {
  free: number;
  solo: number;
  team: number;
  business: number;
}

/**
 * Default monthly compute ceilings (USD). A typical full project costs
 * ~$0.30–0.40, so these leave generous headroom while bounding abuse:
 *   free $1   → trial only; kills the $25 free-burn vector
 *   solo $20  → ~50+ projects/mo; ≈59% worst-case margin floor on $49
 *   team $60  → ~150+ projects/mo; ≈80% floor on $299
 *   business $200 → the "high finite fair-use cap" backing "unlimited";
 *                   ~500+ projects/mo; ≈80% floor on $999
 */
export const DEFAULT_TIER_CAPS: TierCaps = {
  free: 1,
  solo: 20,
  team: 60,
  business: 200,
};

/** Free-tier generations (run rows) allowed per calendar month. */
export const DEFAULT_FREE_RUN_QUOTA = 10;

const PAID_TIERS = ["solo", "team", "business"] as const;

export function isPaidTier(tier: string | null | undefined): boolean {
  return (PAID_TIERS as readonly string[]).includes(tier ?? "");
}

/** The monthly USD cap for a tier; unknown/null tiers are treated as free. */
export function capForTier(
  tier: string | null | undefined,
  caps: TierCaps = DEFAULT_TIER_CAPS,
): number {
  switch (tier) {
    case "solo":
      return caps.solo;
    case "team":
      return caps.team;
    case "business":
      return caps.business;
    default:
      return caps.free;
  }
}

/**
 * Build the cap table from environment, falling back to defaults. Takes an env
 * accessor (e.g. `(k) => Deno.env.get(k)`) so it stays pure and testable.
 */
export function loadTierCaps(getEnv: (key: string) => string | undefined): TierCaps {
  const num = (key: string, fallback: number): number => {
    const raw = getEnv(key);
    const n = raw === undefined || raw === null || raw === "" ? NaN : Number(raw);
    return Number.isFinite(n) && n >= 0 ? n : fallback;
  };
  return {
    free: num("FREE_MONTHLY_COST_CAP_USD", DEFAULT_TIER_CAPS.free),
    solo: num("SOLO_MONTHLY_COST_CAP_USD", DEFAULT_TIER_CAPS.solo),
    team: num("TEAM_MONTHLY_COST_CAP_USD", DEFAULT_TIER_CAPS.team),
    business: num("BUSINESS_MONTHLY_COST_CAP_USD", DEFAULT_TIER_CAPS.business),
  };
}

export function loadFreeRunQuota(getEnv: (key: string) => string | undefined): number {
  const raw = getEnv("FREE_MONTHLY_RUN_QUOTA");
  const n = raw === undefined || raw === null || raw === "" ? NaN : Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : DEFAULT_FREE_RUN_QUOTA;
}

/**
 * Would a run costing `projectedUsd` push this month's spend over the tier cap?
 * Pre-emptive (projected), so a single large run can't overshoot the cap.
 */
export function exceedsCostCap(args: {
  monthSpendUsd: number;
  projectedUsd: number;
  cap: number;
}): boolean {
  return args.monthSpendUsd + args.projectedUsd > args.cap;
}

/** Has a free-tier workspace used up its monthly generation quota? */
export function exceedsFreeRunQuota(args: {
  tier: string | null | undefined;
  monthRunCount: number;
  quota: number;
}): boolean {
  return !isPaidTier(args.tier) && args.monthRunCount >= args.quota;
}
