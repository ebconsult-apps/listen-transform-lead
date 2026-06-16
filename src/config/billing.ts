/**
 * Tier ladder (spec §10). Prices are hypotheses — validate before going live.
 * Stripe Price IDs are read from env so the same build works across test/prod.
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
    features: ["1 project", "Teaser report only", "No export"],
    cta: "Start free",
  },
  {
    id: "solo",
    name: "Solo",
    price: "$49",
    cadence: "/mo",
    highlight: true,
    features: ["Full reports", "PDF + Markdown export", "A few projects / month"],
    cta: "Choose Solo",
    priceEnv: "VITE_STRIPE_PRICE_SOLO",
  },
  {
    id: "team",
    name: "Team",
    price: "$299",
    cadence: "/mo",
    features: ["Several reports / month", "All report sections", "Workspace billing"],
    cta: "Choose Team",
    priceEnv: "VITE_STRIPE_PRICE_TEAM",
  },
  {
    id: "business",
    name: "Business",
    price: "$999",
    cadence: "/mo",
    features: ["Unlimited reports", "Priority processing", "Workspace billing"],
    cta: "Choose Business",
    priceEnv: "VITE_STRIPE_PRICE_BUSINESS",
  },
];

export const UNLOCK_PLAN: Plan = {
  id: "unlock",
  name: "Single report unlock",
  price: "$200+",
  cadence: "one-off",
  features: ["Unlock one full report", "Per-deliverable, no subscription", "PDF + Markdown export"],
  cta: "Unlock this report",
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
