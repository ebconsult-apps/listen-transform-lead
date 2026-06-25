// ─────────────────────────────────────────────────────────────────────────────
// Privacy Policy — single source of truth for the version string and the body
// shown in the in-app acceptance modal (PrivacyPolicyDialog) during project setup.
//
// ⚠️  PLACEHOLDER COPY. Replace <PrivacyPolicyContent/> below with the final,
//     reviewed Privacy Policy before shipping to production. Whenever the policy
//     text changes, bump PRIVACY_POLICY_VERSION so acceptance can be re-prompted.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Current policy version. Stored on `profiles.privacy_policy_version` when a user
 * accepts, so we can detect (in future) that an older version was accepted.
 * Bump this string whenever the copy in <PrivacyPolicyContent/> changes.
 */
export const PRIVACY_POLICY_VERSION = "2026-06-25";

/** The Privacy Policy body rendered inside the acceptance modal. */
export function PrivacyPolicyContent() {
  return (
    <div className="space-y-4 text-sm leading-relaxed text-foreground/80">
      <p className="rounded-md bg-muted/60 px-3 py-2 text-foreground/60">
        Placeholder text — replace with the final, reviewed Privacy Policy before
        production.
      </p>

      <section className="space-y-2">
        <h3 className="font-semibold text-foreground">1. Who we are</h3>
        <p>
          This policy explains how we process personal data when you use the CLEAR
          application to analyze behaviour-change challenges. You are the controller
          of any personal data you provide about your target group; we process it on
          your behalf to produce your analysis.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="font-semibold text-foreground">2. What we collect</h3>
        <p>
          Account details (your name and email), the project information you enter
          (challenge, stakeholders, timeline), and the documents you upload for
          analysis. We also collect basic usage analytics where you have consented.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="font-semibold text-foreground">3. How we use it</h3>
        <p>
          To run the CLEAR analysis you request, to operate and secure the service,
          and to communicate with you about your account. We do not sell your data.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="font-semibold text-foreground">4. Retention &amp; your rights</h3>
        <p>
          We retain project data for as long as your account is active or as needed
          to provide the service. You may request access, correction, or deletion of
          your data, and may withdraw consent at any time.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="font-semibold text-foreground">5. Contact</h3>
        <p>
          For any privacy request or question, contact us at the address listed on
          our website.
        </p>
      </section>
    </div>
  );
}
