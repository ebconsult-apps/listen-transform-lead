// Pure billing decision logic — no `npm:`/Deno imports, so it's unit-testable in
// vitest. The stripe-webhook handler verifies the signature, normalizes the Stripe
// event into `NormalizedEvent`, then calls `planForEvent` to decide the DB mutation.

export type Tier = "solo" | "team" | "business";

const PAID: Tier[] = ["solo", "team", "business"];

/** Server price-id env → tier, for following a Billing-Portal plan change. */
export interface PriceMap {
  solo?: string;
  team?: string;
  business?: string;
}

/** A Stripe event flattened to just the fields the decision needs. */
export interface NormalizedEvent {
  type: string;
  mode?: string | null; // checkout session mode: "payment" | "subscription"
  metadata?: Record<string, string> | null;
  customerId?: string | null;
  subscriptionId?: string | null;
  paymentIntent?: string | null;
  subStatus?: string | null; // subscription status
  periodEnd?: number | null; // unix seconds
  priceId?: string | null; // the subscription's current price
  amountTotal?: number | null; // checkout total, minor units (for the Report Pass credit)
  currency?: string | null; // checkout currency (for the Report Pass credit)
}

/** A Report Pass is creditable toward a first subscription for this many days. */
export const PASS_CREDIT_WINDOW_DAYS = 14;

/** When a Report Pass purchased at `purchasedAtMs` stops being creditable (ms). */
export function passExpiresAtMs(purchasedAtMs: number): number {
  return purchasedAtMs + PASS_CREDIT_WINDOW_DAYS * 24 * 60 * 60 * 1000;
}

/** Is a Report Pass purchased at `purchasedAtMs` still creditable at `nowMs`? */
export function isPassCreditable(purchasedAtMs: number, nowMs: number): boolean {
  return nowMs <= passExpiresAtMs(purchasedAtMs);
}

export interface EntitlementPatch {
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  tier?: string;
  status?: string;
  current_period_end?: string;
}

export type Plan =
  | {
      kind: "unlock";
      projectId: string;
      paymentIntent: string | null;
      // Pass-credit bookkeeping: who bought it + how much, so the webhook can record
      // a creditable Report Pass alongside the project unlock.
      workspaceId: string | null;
      amountCents: number;
      currency: string;
    }
  | { kind: "entitlement"; workspaceId: string | null; byCustomer: string | null; patch: EntitlementPatch }
  | null;

export function tierFromMetadata(meta: Record<string, string> | null | undefined): Tier | null {
  const t = meta?.tier;
  return t && (PAID as string[]).includes(t) ? (t as Tier) : null;
}

export function tierFromPriceId(priceId: string | null | undefined, prices: PriceMap): Tier | null {
  if (!priceId) return null;
  if (prices.solo && priceId === prices.solo) return "solo";
  if (prices.team && priceId === prices.team) return "team";
  if (prices.business && priceId === prices.business) return "business";
  return null;
}

/**
 * Decide the DB mutation for a Stripe event. Returns null for events we ignore.
 * `prices` lets a portal plan change map the new price → tier; if unmapped, the
 * tier is left unchanged (status still syncs).
 */
export function planForEvent(e: NormalizedEvent, prices: PriceMap = {}): Plan {
  switch (e.type) {
    case "checkout.session.completed": {
      const meta = e.metadata ?? {};
      if (e.mode === "payment" && meta.project_id) {
        // One-off Report Pass: unlock the project AND record a creditable pass.
        return {
          kind: "unlock",
          projectId: meta.project_id,
          paymentIntent: e.paymentIntent ?? null,
          workspaceId: meta.workspace_id ?? null,
          amountCents: e.amountTotal ?? 0,
          currency: e.currency ?? "usd",
        };
      }
      if (e.mode === "subscription" && meta.workspace_id) {
        return {
          kind: "entitlement",
          workspaceId: meta.workspace_id,
          byCustomer: null,
          patch: {
            stripe_customer_id: e.customerId ?? undefined,
            stripe_subscription_id: e.subscriptionId ?? undefined,
            tier: tierFromMetadata(meta) ?? "solo",
            status: "active",
          },
        };
      }
      return null;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const active = e.subStatus === "active" || e.subStatus === "trialing";
      const mappedTier = tierFromPriceId(e.priceId, prices);
      const patch: EntitlementPatch = {
        status: e.subStatus ?? undefined,
        stripe_subscription_id: e.subscriptionId ?? undefined,
        current_period_end: e.periodEnd ? new Date(e.periodEnd * 1000).toISOString() : undefined,
      };
      if (!active) patch.tier = "free";
      else if (mappedTier) patch.tier = mappedTier; // portal plan change → follow the new price
      return { kind: "entitlement", workspaceId: null, byCustomer: e.customerId ?? null, patch };
    }

    default:
      return null;
  }
}
