/**
 * Tier ladder (spec §10).
 *
 * ⚠️ LAUNCH EXPERIMENT — not validated pricing. These prices/packages are the
 * best ex-ante model from market analogues, not proven WTP. The canonical value
 * metric is the *report credit*; seats are secondary. Rationale, the falsifiable
 * hypotheses, and the telemetry that must confirm/kill each boundary live in
 * docs/research/self-serve-pricing.md. Treat the exact numbers as a measured
 * test, not the answer.
 *
 * Stripe Price IDs are read from env so the same build works across test/prod.
 * NOTE: changing a price string here does NOT change what Stripe charges — new
 * amounts require new Stripe Prices + updated VITE_STRIPE_PRICE_* at deploy.
 */
import type { Entitlement, ProjectUnlock } from "@/lib/db";

export type Tier = "free" | "solo" | "team" | "business";

export interface Plan {
  id: Tier | "unlock" | "enterprise";
  name: string;
  price: string;
  cadence: string;
  highlight?: boolean;
  features: string[];
  cta: string;
  /** Stripe Price ID env var name (subscription/one-off). Empty for free/enterprise. */
  priceEnv?: string;
}

export const BILLING_ENABLED =
  (import.meta.env.VITE_BILLING_ENABLED as string | undefined) !== "false";

/**
 * Stripe Price IDs. Accessed statically (Vite only inlines literal
 * `import.meta.env.VITE_*` references — dynamic indexing is not replaced).
 */
export const PRICE_IDS = {
  solo: import.meta.env.VITE_STRIPE_PRICE_SOLO as string | undefined,
  team: import.meta.env.VITE_STRIPE_PRICE_TEAM as string | undefined,
  business: import.meta.env.VITE_STRIPE_PRICE_BUSINESS as string | undefined,
  unlock: import.meta.env.VITE_STRIPE_PRICE_UNLOCK as string | undefined,
} as const;

/**
 * Monthly report-credit allotment per tier — 1 credit = one whole-project unlock
 * (leverage-full + experiment + research on that project). Mirrors
 * DEFAULT_CREDIT_ALLOTMENT in supabase/functions/_shared/billing/credits.ts (the
 * server-authoritative copy) — keep the two in sync. Free earns credits only via a
 * one-off Report Pass; business is legacy.
 */
export const CREDIT_ALLOTMENT: Record<Tier, number> = {
  free: 0,
  solo: 5,
  team: 20,
  business: 50,
};

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    cadence: "forever",
    // Demonstrative, not productive: enough to prove CLEAR finds something true,
    // not enough to use as a workflow. Run cap enforced in cost-cap.ts.
    features: ["1 teaser project", "Up to 3 runs to explore", "No export or sharing"],
    cta: "Start free",
  },
  {
    id: "solo",
    name: "Solo",
    price: "$79",
    cadence: "/mo",
    highlight: true,
    features: [
      `${CREDIT_ALLOTMENT.solo} report credits / month`,
      "Full reports + PDF / Markdown export",
      "Saved history",
    ],
    cta: "Choose Solo",
    priceEnv: "VITE_STRIPE_PRICE_SOLO",
  },
  {
    id: "team",
    name: "Team",
    price: "$249",
    cadence: "/mo",
    features: [
      `${CREDIT_ALLOTMENT.team} pooled report credits / month`,
      "3 seats + workspace sharing",
      "All report sections",
    ],
    cta: "Choose Team",
    priceEnv: "VITE_STRIPE_PRICE_TEAM",
  },
];
// Public $999 Business tier retired — self-serve tops out at Team; larger needs
// route to Enterprise ("Contact us"). The `business` tier still exists in the
// type/PRICE_IDS so existing subscribers and the webhook/portal mapping resolve.
// Agency ($499) is intentionally deferred until repeat client-delivery evidence.

/**
 * The premium first-paid "front door" — one full report, no subscription. Priced
 * to be an easy first purchase that feeds subscriptions, not a tollbooth, and
 * creditable toward a first subscription for 14 days (recorded in report_passes by
 * the Stripe webhook; applied as Stripe account credit by stripe-checkout).
 */
export const UNLOCK_PLAN: Plan = {
  id: "unlock",
  name: "Report Pass",
  price: "$99",
  cadence: "one-off",
  features: [
    "One full report, unlocked",
    "Creditable toward a subscription for 14 days",
    "PDF + Markdown export",
  ],
  cta: "Get a Report Pass",
  priceEnv: "VITE_STRIPE_PRICE_UNLOCK",
};

/**
 * Server-authoritative gate is enforced in the edge functions; this mirrors it for
 * the client view. A project is viewable once it's UNLOCKED — by a spent monthly
 * credit (origin='credit') or a one-off Report Pass (origin='pass'). Paid tier
 * alone no longer unlocks every project: a credit is spent per project (the unlock
 * is created server-side in project-run). `entitlement` is retained in the
 * signature for callers/back-compat.
 */
export function canViewFull(
  _entitlement: Entitlement | null,
  unlock: ProjectUnlock | null,
): boolean {
  return Boolean(unlock?.unlocked);
}
