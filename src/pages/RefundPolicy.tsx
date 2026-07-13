import SEO from "@/components/SEO";
import { RefundPolicyContent } from "@/content/refund-policy";

/**
 * Standalone, indexable Refund & Cancellation Policy page. Linked from the
 * marketing and product footers and from the pricing/paywall surfaces. Content
 * lives in src/content/refund-policy.tsx (its own version/effective-date line).
 */
const RefundPolicy = () => (
  <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <SEO
      title="Refund & Cancellation Policy: CLEAR"
      description="How to cancel, our refund stance, and EU digital-content consumer rules for CLEAR subscriptions and one-off report unlocks."
      path="/refund"
    />
    <h1 className="heading-lg mb-8">Refund &amp; Cancellation Policy</h1>
    <RefundPolicyContent />
  </div>
);

export default RefundPolicy;
