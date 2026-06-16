import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SEO from "@/components/SEO";
import { getMyWorkspace, getEntitlement, type Entitlement } from "@/lib/db";
import { openBillingPortal } from "@/lib/billing";
import { toast } from "sonner";

const Billing = () => {
  const [entitlement, setEntitlement] = useState<Entitlement | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <SEO title="Billing — CLEAR" description="Manage your CLEAR subscription." path="/account/billing" noindex />
      <Link to="/app" className="inline-flex items-center text-sm text-foreground/50 hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to projects
      </Link>
      <h1 className="heading-lg mb-6">Billing</h1>

      {loading ? (
        <div className="animate-pulse text-foreground/50">Loading…</div>
      ) : (
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

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            {isPaid ? (
              <button onClick={portal} className="btn-primary">
                Manage subscription
              </button>
            ) : (
              <Link to="/pricing" className="btn-primary">
                Upgrade
              </Link>
            )}
            <Link to="/pricing" className="btn-secondary">
              See plans
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;
