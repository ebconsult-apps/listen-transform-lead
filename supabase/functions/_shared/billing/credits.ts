// Report-credit allotment + per-project research cap — pure decision logic (no
// npm:/Deno imports), so it's unit-testable in vitest exactly like cost-cap.ts.
//
// A "credit" is ONE whole-project unlock: spending it unlocks a project's full
// report (leverage-full + experiment) AND unlimited research runs on that project,
// bounded only by the per-project research cap below and the per-tier $ spend cap
// (cost-cap.ts) underneath. Paid tiers get a fixed monthly allotment; consumption
// is recorded as origin='credit' rows in project_unlocks (see project-run).
//
// Remaining is DERIVED — allotment(tier) − consumed-this-month — so there is no
// balance to store, grant, or reset: an active tier implies its allotment, and a
// new calendar month resets consumption automatically (mirrors the spend-cap
// window). Caps are env-overridable so they can be tuned without a deploy.

export type Tier = "free" | "solo" | "team" | "business";

export interface CreditAllotment {
  free: number;
  solo: number;
  team: number;
  business: number;
}

/**
 * Default monthly report-credit allotment per tier. Free earns credits only via a
 * one-off Report Pass (origin='pass', which sits OUTSIDE this allotment). business
 * is legacy — retired from the public ladder but kept generous for existing
 * subscribers. Keep these in sync with CREDIT_ALLOTMENT in src/config/billing.ts.
 */
export const DEFAULT_CREDIT_ALLOTMENT: CreditAllotment = {
  free: 0,
  solo: 5,
  team: 20,
  business: 50,
};

/**
 * Hard ceiling on research runs per project — the abuse bound on the otherwise
 * unlimited-within-an-unlocked-project research phase. Below this, the $ spend cap
 * is the only limit; this gives a predictable, count-based ceiling on top.
 */
export const DEFAULT_MAX_RESEARCH_RUNS_PER_PROJECT = 10;

/**
 * Minimum monthly $ budget for runs on an UNLOCKED project. A Report Pass on a
 * free workspace would otherwise starve at the $1 free cap after ~2 research runs;
 * once a project is unlocked (credit or pass), its runs get at least this budget.
 */
export const DEFAULT_UNLOCKED_PROJECT_BUDGET_USD = 5;

/** The monthly credit allotment for a tier; unknown/null tiers are treated as free. */
export function allotmentForTier(
  tier: string | null | undefined,
  allotment: CreditAllotment = DEFAULT_CREDIT_ALLOTMENT,
): number {
  switch (tier) {
    case "solo":
      return allotment.solo;
    case "team":
      return allotment.team;
    case "business":
      return allotment.business;
    default:
      return allotment.free;
  }
}

/** Credits left this month = allotment − consumed (never negative). */
export function remainingCredits(
  tier: string | null | undefined,
  consumedThisMonth: number,
  allotment: CreditAllotment = DEFAULT_CREDIT_ALLOTMENT,
): number {
  return Math.max(0, allotmentForTier(tier, allotment) - Math.max(0, consumedThisMonth));
}

/** Does this workspace have a monthly credit left to unlock another project? */
export function hasCreditAvailable(args: {
  tier: string | null | undefined;
  consumedThisMonth: number;
  allotment?: CreditAllotment;
}): boolean {
  return remainingCredits(args.tier, args.consumedThisMonth, args.allotment) > 0;
}

/**
 * Build the allotment table from environment, falling back to defaults. Takes an
 * env accessor (e.g. `(k) => Deno.env.get(k)`) so it stays pure and testable.
 */
export function loadCreditAllotment(getEnv: (key: string) => string | undefined): CreditAllotment {
  const num = (key: string, fallback: number): number => {
    const raw = getEnv(key);
    const n = raw === undefined || raw === null || raw === "" ? NaN : Number(raw);
    return Number.isFinite(n) && n >= 0 ? n : fallback;
  };
  return {
    free: num("FREE_REPORT_CREDITS", DEFAULT_CREDIT_ALLOTMENT.free),
    solo: num("SOLO_REPORT_CREDITS", DEFAULT_CREDIT_ALLOTMENT.solo),
    team: num("TEAM_REPORT_CREDITS", DEFAULT_CREDIT_ALLOTMENT.team),
    business: num("BUSINESS_REPORT_CREDITS", DEFAULT_CREDIT_ALLOTMENT.business),
  };
}

export function loadMaxResearchRuns(getEnv: (key: string) => string | undefined): number {
  const raw = getEnv("MAX_RESEARCH_RUNS_PER_PROJECT");
  const n = raw === undefined || raw === null || raw === "" ? NaN : Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : DEFAULT_MAX_RESEARCH_RUNS_PER_PROJECT;
}

export function loadUnlockedProjectBudgetUsd(getEnv: (key: string) => string | undefined): number {
  const raw = getEnv("UNLOCKED_PROJECT_BUDGET_USD");
  const n = raw === undefined || raw === null || raw === "" ? NaN : Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : DEFAULT_UNLOCKED_PROJECT_BUDGET_USD;
}

/** Has a project hit its hard research-run ceiling? (count is at/over the cap.) */
export function exceedsResearchRunCap(args: {
  projectResearchRunCount: number;
  cap: number;
}): boolean {
  return args.projectResearchRunCount >= args.cap;
}
