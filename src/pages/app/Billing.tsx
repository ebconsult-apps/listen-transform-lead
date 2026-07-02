import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SEO from "@/components/SEO";
import {
  getMyWorkspace,
  getEntitlement,
  getCreditUsage,
  type Entitlement,
  type CreditUsage,
} from "@/lib/db";
import { openBillingPortal, startCheckout } from "@/lib/billing";
import { BILLING_ENABLED, PLANS, PRICE_IDS } from "@/config/billing";
import { DEV_ACCESS_ENABLED, devActive } from "@/lib/dev/config";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/query-keys";
import { LoadingState } from "@/components/ui/data-states";

type PaidTier = "solo" | "team" | "business";

const Billing = () => {
  const [entitlement, setEntitlement] = useState<Entitlement | null>(null);
  const [credit, setCredit] = useState<CreditUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  useEffect(() => {
    (async () => {
      const ws = await getMyWorkspace();
      const [ent, usage] = await Promise.all([getEntitlement(ws.id), getCreditUsage(ws.id)]);
      setEntitlement(ent);
      setCredit(usage);
    })()
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [reloadKey]);

  // Back from a real Stripe checkout — the tier just changed, so the cached
  // usage (header pill, dashboard strip) must not serve the stale plan.
  useEffect(() => {
    if (searchParams.get("checkout") === "success") {
      queryClient.invalidateQueries({ queryKey: qk.usage() });
      setReloadKey((k) => k + 1);
    }
  }, [searchParams, queryClient]);

  const tier = entitlement?.tier ?? "free";
  const isPaid = tier !== "free";

  const portal = async () => {
    try {
      await openBillingPortal();
    } catch {
      toast.error("Couldn't open the billing portal. Is Stripe configured?");
    }
  };

  const subscribe = async (planId: PaidTier) => {
    const priceId = PRICE_IDS[planId];
    const devSimulated = DEV_ACCESS_ENABLED && devActive();
    // In dev/QA mock mode startCheckout simulates the purchase — a missing
    // Stripe Price ID must not block the paid-state walkthrough.
    if (!devSimulated && (!BILLING_ENABLED || !priceId)) {
      toast.error("Billing isn't configured yet.");
      return;
    }
    setBusy(true);
    try {
      await startCheckout({ mode: "subscription", priceId, tier: planId });
      // Live checkout navigates away; the dev-simulated one resolves here — make
      // this page and the shared usage counters reflect the new plan immediately.
      queryClient.invalidateQueries({ queryKey: qk.usage() });
      setReloadKey((k) => k + 1);
    } catch {
      toast.error("Couldn't start checkout. Is the stripe-checkout function deployed?");
    } finally {
      setBusy(false);
    }
  };

  const paidPlans = PLANS.filter((p) => p.id !== "free" && p.id !== "enterprise");

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <SEO title="Billing: CLEAR" description="Manage your CLEAR subscription." path="/account/billing" noindex />
      <Link to="/app" className="inline-flex items-center text-sm text-foreground/50 hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to projects
      </Link>
      <h1 className="heading-lg mb-6">Billing</h1>

      {loading ? (
        <LoadingState />
      ) : (
        <div className="space-y-6">
          <div className="glass-card p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/50">Current plan</p>
                <p className="text-2xl font-bold capitalize">{tier}</p>
              </div>
              <span className={`tag ${isPaid ? "" : "opacity-60"}`}>
                {entitlement?.status ?? "active"}
              </span>
            </div>

            {entitlement?.current_period_end && (
              <p className="text-sm text-foreground/60 mt-4">
                Renews {new Date(entitlement.current_period_end).toLocaleDateString()}.
              </p>
            )}

            {isPaid && (
              <div className="mt-6">
                <button onClick={portal} className="btn-primary">
                  Manage subscription
                </button>
              </div>
            )}
          </div>

          {/* Report credits — the monthly allotment that unlocks full reports. */}
          {isPaid && credit && (
            <div className="glass-card p-8">
              <p className="text-sm text-foreground/50">Report credits this month</p>
              <p className="text-2xl font-bold mt-1">
                {credit.remaining}{" "}
                <span className="text-base font-normal text-foreground/50">
                  of {credit.allotment} left
                </span>
              </p>
              <p className="text-sm text-foreground/60 mt-3">
                Each credit unlocks one project's full report — leverage, experiment, and unlimited
                research on it. Credits reset at the start of each month; a one-off Report Pass adds
                one without using your allotment.
              </p>
            </div>
          )}

          {/* Free users: subscribe inline (the actual subscription checkout). */}
          {!isPaid && (
            <div className="glass-card p-8">
              <h2 className="heading-md mb-1">Subscribe</h2>
              <p className="body-md mb-6">
                Unlock full reports across your projects. Or grab a one-off unlock from any project's paywall.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {paidPlans.map((plan) => (
                  <div key={plan.id} className="border border-border rounded-xl p-4 flex flex-col">
                    <p className="font-semibold">{plan.name}</p>
                    <p className="text-2xl font-bold mt-1 mb-3">
                      {plan.price}
                      <span className="text-sm font-normal text-foreground/50"> {plan.cadence}</span>
                    </p>
                    <button
                      onClick={() => subscribe(plan.id as PaidTier)}
                      // In dev/QA mock mode startCheckout simulates the purchase, so a
                      // missing Stripe Price ID must not disable the paid-state walkthrough.
                      disabled={busy || (!PRICE_IDS[plan.id as PaidTier] && !(DEV_ACCESS_ENABLED && devActive()))}
                      className="btn-primary w-full mt-auto disabled:opacity-50"
                    >
                      {busy ? "…" : "Subscribe"}
                    </button>
                  </div>
                ))}
              </div>
              <Link to="/pricing" className="inline-block text-sm text-primary hover:underline mt-4">
                Compare plans →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Billing;
