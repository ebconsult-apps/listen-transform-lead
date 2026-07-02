import SEO from "@/components/SEO";
import { PrivacyPolicyContent } from "@/content/privacy-policy";

/**
 * Standalone, indexable privacy-policy page — the same canonical content the
 * in-app acceptance dialog shows (src/content/privacy-policy.tsx renders its own
 * effective-date/version line). Linked from the marketing and product footers.
 */
const PrivacyPolicy = () => (
  <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <SEO
      title="Privacy Policy: CLEAR"
      description="How CLEAR and EB Consulting collect, use, and protect personal data — GDPR-first, EU-hosted."
      path="/privacy"
    />
    <h1 className="heading-lg mb-8">Privacy Policy</h1>
    <PrivacyPolicyContent />
  </div>
);

export default PrivacyPolicy;
