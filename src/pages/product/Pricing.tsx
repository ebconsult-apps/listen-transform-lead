import { Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";
import { PLANS, UNLOCK_PLAN } from "@/config/billing";
import { useAuth } from "@/hooks/useAuth";

const Pricing = () => {
  const { session } = useAuth();
  const dest = session ? "/account/billing" : "/signup";

  return (
    <div className="bg-background">
      <SEO
        title="Pricing: CLEAR self-serve"
        description="Start free, unlock a single full report one-off, or subscribe for unlimited behavioral analysis reports."
        path="/pricing"
      />

      <section className="section-container text-center">
        <h1 className="heading-xl mb-4">Simple, productized pricing</h1>
        <p className="body-lg max-w-2xl mx-auto">
          The teaser is always free. Pay per-report or subscribe, whichever fits
          how often you ship change.
        </p>
      </section>

      <section className="section-container pt-0">
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`glass-card p-6 flex flex-col ${
                plan.highlight ? "ring-2 ring-primary" : ""
              }`}
            >
              <div className="mb-3 h-6">
                {plan.highlight && <span className="tag">Most popular</span>}
              </div>
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <div className="mt-2 mb-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-foreground/50 text-sm"> {plan.cadence}</span>
              </div>
              <ul className="space-y-2 mb-6 flex-grow">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground/80">
                    <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to={plan.id === "free" ? "/signup" : dest}
                className={plan.highlight ? "btn-primary w-full" : "btn-outline w-full"}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* One-off unlock + enterprise */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="glass-card p-6 flex flex-col bg-primary/5">
            <h3 className="text-lg font-semibold">{UNLOCK_PLAN.name}</h3>
            <p className="text-3xl font-bold mt-2 mb-4">
              {UNLOCK_PLAN.price}{" "}
              <span className="text-sm font-normal text-foreground/50">{UNLOCK_PLAN.cadence}</span>
            </p>
            <p className="text-sm text-foreground/70 mb-4 flex-grow">
              A premium one-off: unlock one full report when you need it — no
              subscription required.
            </p>
            <Link to={dest} className="btn-outline w-full mt-auto">
              {UNLOCK_PLAN.cta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <div className="glass-card p-6 flex flex-col">
            <h3 className="text-lg font-semibold">Enterprise</h3>
            <p className="text-3xl font-bold mt-2 mb-4">Custom</p>
            <p className="text-sm text-foreground/70 mb-4 flex-grow">
              EU data residency guarantees, SSO, and volume pricing for
              organizations rolling out change at scale.
            </p>
            <Link to="/contact" className="btn-outline w-full mt-auto">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
