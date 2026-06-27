import { useState } from "react";
import { Lock, ArrowRight, Check } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { startCheckout } from "@/lib/billing";
import { BILLING_ENABLED, PRICE_IDS, UNLOCK_PLAN } from "@/config/billing";
import { devActive, DEV_ACCESS_ENABLED } from "@/lib/dev/config";
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
  objective,
}: {
  projectId: string;
  onDevPreview?: () => void;
  /** The project's Clarify objective, used to frame the unlock around the
   *  user's own result. Falls back to generic copy when absent/empty. */
  objective?: string;
}) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const trimmedObjective = objective?.trim();
  const personalObjective =
    trimmedObjective && trimmedObjective.length <= 160 ? trimmedObjective : undefined;

  const unlock = async () => {
    setLoading(true);
    try {
      await startCheckout({
        mode: "payment",
        priceId: PRICE_IDS.unlock,
        projectId,
      });
      if (devActive()) {
        // Mock checkout unlocked the report in-memory; re-trigger the project's
        // post-checkout reload (no real Stripe redirect happens in dev mode).
        setLoading(false);
        navigate(`${location.pathname}?checkout=success`, { replace: true });
      }
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
    <div className="glass-card p-8 text-center border-primary/20">
      <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Lock className="h-5 w-5 text-primary" />
      </div>
      <h3 className="heading-md mb-2">Unlock the full report</h3>
      {personalObjective && (
        <p className="body-md max-w-md mx-auto mb-3">
          You've set your objective:{" "}
          <span className="font-medium text-foreground/90">“{personalObjective}”</span>. The full
          report shows exactly how to hit it.
        </p>
      )}
      <p className="body-md max-w-md mx-auto mb-4">
        The teaser shows you <span className="font-medium text-foreground/90">where</span> the
        leverage is. The full report gives you the{" "}
        <span className="font-medium text-foreground/90">evidence-based, ready-to-implement
        plan</span>{" "}
        to act on it — what to do, why it works, and how to prove it.
      </p>
      <ul className="text-left max-w-md mx-auto mb-5 space-y-2.5 text-sm">
        {[
          {
            title: "Act on evidence, not hunches",
            body: "the COM-B barrier analysis, each cell flagged Verified, Assumption, or Gap, so you know what's solid before you spend.",
          },
          {
            title: "See exactly what's still unverified",
            body: "the gap log separates what's confirmed from what's still an assumption, so nothing reads as fact without provenance.",
          },
          {
            title: "Know exactly what to implement next",
            body: "concrete, evidence-based actions — discovery activities, interviews, audits, surveys — you can put into practice this week to close those gaps.",
          },
          {
            title: "Unlock Research & Experiment",
            body: "gather cited evidence and turn leverage points into testable interventions. Both stay locked until you unlock here.",
          },
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <span className="text-foreground/70">
              <span className="font-medium text-foreground/90">{item.title}</span> — {item.body}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-sm text-foreground/50 mb-6">Plus PDF & Markdown export.</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button onClick={unlock} disabled={loading} className="btn-primary">
          {loading ? "Starting checkout…" : `Unlock this report: ${UNLOCK_PLAN.price}`}
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
        <Link to="/pricing" className="btn-secondary">
          Or subscribe
        </Link>
      </div>
      {DEV_ACCESS_ENABLED && onDevPreview && (
        <button
          onClick={onDevPreview}
          className="mt-5 text-xs text-foreground/40 hover:text-foreground/70 underline"
        >
          Preview full report (dev only: bypasses payment)
        </button>
      )}
    </div>
  );
};

export default Paywall;
