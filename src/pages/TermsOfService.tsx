import SEO from "@/components/SEO";
import { TermsOfServiceContent } from "@/content/terms-of-service";

/**
 * Standalone, indexable Terms of Service page — the same canonical content whose
 * version is recorded against a user's acceptance at signup (see TERMS_VERSION in
 * src/content/terms-of-service.tsx). Linked from the marketing and product footers
 * and from the signup acceptance checkbox.
 */
const TermsOfService = () => (
  <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <SEO
      title="Terms of Service: CLEAR"
      description="The terms governing use of CLEAR, the self-serve behavioral-analysis platform — B2B SaaS user agreement."
      path="/terms"
    />
    <h1 className="heading-lg mb-8">Terms of Service</h1>
    <TermsOfServiceContent />
  </div>
);

export default TermsOfService;
