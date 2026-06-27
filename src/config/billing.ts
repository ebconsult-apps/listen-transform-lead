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
    features: ["5 report credits / month", "Full reports + PDF / Markdown export", "Saved history"],
    cta: "Choose Solo",
    priceEnv: "VITE_STRIPE_PRICE_SOLO",
  },
  {
    id: "team",
    name: "Team",
    price: "$249",
    cadence: "/mo",
    features: ["20 pooled report credits / month", "3 seats + workspace sharing", "All report sections"],
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
 * to be an easy first purchase that feeds subscriptions, not a tollbooth.
 * FOLLOW-UP (not built; see memo): make the Report Pass creditable toward the
 * first subscription within 14 days. Until that mechanic ships, do NOT advertise
 * "creditable toward a subscription" anywhere in live UI.
 */
export const UNLOCK_PLAN: Plan = {
  id: "unlock",
  name: "Report Pass",
  price: "$99",
  cadence: "one-off",
  features: ["One full report, unlocked", "Premium one-off — no subscription", "PDF + Markdown export"],
  cta: "Get a Report Pass",
  priceEnv: "VITE_STRIPE_PRICE_UNLOCK",
};

const PAID_TIERS: Tier[] = ["solo", "team", "business"];

/**
 * Server-authoritative gate is enforced in the edge function; this mirrors it
 * for the client view. canViewFull = paid tier OR this project is unlocked.
 */
export function canViewFull(
  entitlement: Entitlement | null,
  unlock: ProjectUnlock | null,
): boolean {
  if (entitlement && PAID_TIERS.includes(entitlement.tier)) return true;
  if (unlock?.unlocked) return true;
  return false;
}
