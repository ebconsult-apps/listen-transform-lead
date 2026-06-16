import { useState } from "react";
import { Lock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { startCheckout } from "@/lib/billing";
import { BILLING_ENABLED, PRICE_IDS, UNLOCK_PLAN } from "@/config/billing";
import { toast } from "sonner";

/**
 * Paywall shown over blurred locked sections. Primary CTA is the per-project
 * one-off unlock (the per-deliverable lever); subscriptions live on /pricing.
 * In dev, a clearly-labelled preview button reveals the full report without
 * Stripe so the stub flow is demoable end-to-end.
 */
const Paywall = ({
  projectId,
  onDevPreview,
}: {
  projectId: string;
  onDevPreview?: () => void;
}) => {
  const [loading, setLoading] = useState(false);

  const unlock = async () => {
    setLoading(true);
    try {
      await startCheckout({
        mode: "payment",
        priceId: PRICE_IDS.unlock,
        projectId,
      });
    } catch (e) {
      toast.error(
        BILLING_ENABLED
          ? "Couldn't start checkout. Is the stripe-checkout function deployed?"
          : "Billing is disabled.",
      );
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-8 text-center border-primary/20 bg-primary/5">
      <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Lock className="h-5 w-5 text-primary" />
      </div>
      <h3 className="heading-md mb-2">Unlock the full report</h3>
      <p className="body-md max-w-md mx-auto mb-6">
        See the full leverage map, COM-B barrier analysis with evidence, the gap
        log, and recommended discovery activities — plus PDF & Markdown export.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button onClick={unlock} disabled={loading} className="btn-primary">
          {loading ? "Starting checkout…" : `Unlock this report — ${UNLOCK_PLAN.price}`}
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
        <Link to="/pricing" className="btn-secondary">
          Or subscribe
        </Link>
      </div>
      {import.meta.env.DEV && onDevPreview && (
        <button
          onClick={onDevPreview}
          className="mt-5 text-xs text-foreground/40 hover:text-foreground/70 underline"
        >
          Preview full report (dev only — bypasses payment)
        </button>
      )}
    </div>
  );
};

export default Paywall;
