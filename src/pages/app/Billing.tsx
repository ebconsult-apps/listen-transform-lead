import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SEO from "@/components/SEO";
import { getMyWorkspace, getEntitlement, type Entitlement } from "@/lib/db";
import { openBillingPortal, startCheckout } from "@/lib/billing";
import { BILLING_ENABLED, PLANS, PRICE_IDS } from "@/config/billing";
import { toast } from "sonner";
import { LoadingState } from "@/components/ui/data-states";

type PaidTier = "solo" | "team" | "business";

const Billing = () => {
  const [entitlement, setEntitlement] = useState<Entitlement | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const ws = await getMyWorkspace();
      setEntitlement(await getEntitlement(ws.id));
    })()
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

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
    if (!BILLING_ENABLED || !priceId) {
      toast.error("Billing isn't configured yet.");
      return;
    }
    setBusy(true);
    try {
      await startCheckout({ mode: "subscription", priceId, tier: planId });
    } catch {
      toast.error("Couldn't start checkout. Is the stripe-checkout function deployed?");
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

          {/* Free users: subscribe inline (the actual subscription checkout). */}
          {!isPaid && (
            <div className="glass-card p-8">
              <h2 className="heading-md mb-1">Subscribe</h2>
              <p className="body-md mb-6">
                Unlock full reports across your projects. Or grab a one-off unlock from any project's paywall.
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                {paidPlans.map((plan) => (
                  <div key={plan.id} className="border border-border rounded-xl p-4 flex flex-col">
                    <p className="font-semibold">{plan.name}</p>
                    <p className="text-2xl font-bold mt-1 mb-3">
                      {plan.price}
                      <span className="text-sm font-normal text-foreground/50"> {plan.cadence}</span>
                    </p>
                    <button
                      onClick={() => subscribe(plan.id as PaidTier)}
                      disabled={busy || !PRICE_IDS[plan.id as PaidTier]}
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
