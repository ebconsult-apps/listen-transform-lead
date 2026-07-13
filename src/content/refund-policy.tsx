// ─────────────────────────────────────────────────────────────────────────────
// Refund & Cancellation Policy — user-facing rendering of the canonical draft in
// `legal/drafts/refund-cancellation-policy.md`; keep the two consistent. The legal
// draft is authoritative and still carries items for counsel (refund stance,
// digital-content consent capture at checkout, VAT treatment of refunds). Version
// carries a `-draft` suffix until counsel signs off (G2 / REMEDIATION-CHECKLIST
// Tier 0 §3.10). Prices/refunds are in EUR; billing runs through Stripe.
// ─────────────────────────────────────────────────────────────────────────────

/** Bump when the copy below changes. Recorded nowhere yet (informational page). */
export const REFUND_POLICY_VERSION = "2026-07-13-draft";

/** Human-readable effective date, shown at the top of the policy body. */
export const REFUND_POLICY_EFFECTIVE_DATE = "13 July 2026";

const CONTACT_EMAIL = "erik@eb-consulting.se";

/** The Refund & Cancellation Policy body — shared by the standalone page. */
export function RefundPolicyContent() {
  return (
    <div className="space-y-6 text-sm leading-relaxed text-foreground/80">
      <p className="text-foreground/60">
        Effective date: {REFUND_POLICY_EFFECTIVE_DATE} · Version {REFUND_POLICY_VERSION}
      </p>

      <p className="text-foreground/60">
        This policy is provided in good faith and is being finalized with legal counsel;
        the version in force at the time of your purchase governs that purchase.
      </p>

      <p>
        This Refund &amp; Cancellation Policy explains how to cancel, our refund stance, and
        the special rules for digital content under EU consumer law. It forms part of, and is
        incorporated into, the{" "}
        <a className="text-primary underline hover:no-underline" href="/terms">
          Terms of Service
        </a>
        . Prices and any refunds are in <strong>EUR</strong>; payments and self-service billing
        management are handled through <strong>Stripe</strong>.
      </p>

      <Section title="Who we are">
        <p>
          CLEAR is operated by <strong>Erik Bohjort</strong> under the{" "}
          <strong>EB Consulting</strong> brand (eb-consulting.se); the contracting legal entity
          is <strong>Erik Bohjort Consulting AB</strong>, registered in <strong>Sweden (Täby)</strong>.
          Questions about cancellations, refunds, or billing:{" "}
          <a className="text-primary underline hover:no-underline" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </Section>

      <Section title="1. Overview">
        <p>CLEAR is sold primarily to organizations (B2B). We offer:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li><strong>Subscriptions</strong> — Free, Solo, and Team tiers (recurring, billed via Stripe).</li>
          <li><strong>One-off report unlocks</strong> — single purchases of digital content delivered immediately.</li>
          <li><strong>Enterprise</strong> — handled under a separate contract.</li>
        </ul>
        <p>
          Where a user qualifies as a <strong>consumer</strong> under mandatory EU/EEA or Swedish
          law, the consumer-specific provisions in sections 4 and 7 apply and prevail over any
          conflicting term.
        </p>
      </Section>

      <Section title="2. Subscription cancellation">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>How to cancel.</strong> You can cancel a subscription at any time on a
            self-service basis from your{" "}
            <a className="text-primary underline hover:no-underline" href="/account/billing">
              account billing settings
            </a>{" "}
            (Stripe Billing Portal), or by contacting{" "}
            <a className="text-primary underline hover:no-underline" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
            .
          </li>
          <li>
            <strong>When it takes effect.</strong> Cancellation takes effect at the end of the
            current billing period. Your plan stays active until then, after which it does not
            renew and access reverts to the Free tier (or ceases, as applicable).
          </li>
          <li>
            <strong>No auto-renewal after cancellation.</strong> Once cancelled, you will not be
            charged for subsequent periods.
          </li>
          <li>
            <strong>Effect on data.</strong> Cancellation does not by itself delete your data.
            Export anything you need before closing your account; deletion is governed by the
            Terms and the Privacy Policy.
          </li>
        </ul>
      </Section>

      <Section title="3. One-off report unlocks (digital content)">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Nature.</strong> A one-off unlock is digital content not supplied on a
            tangible medium, delivered immediately to your workspace on successful payment.
          </li>
          <li>
            <strong>Immediate performance and consent (consumers).</strong> For digital content
            delivered immediately, before completing the purchase you will be asked to expressly
            consent to immediate provision and to acknowledge that, by doing so, you lose your
            14-day right of withdrawal once delivery has begun (Article 16(m) of the Consumer
            Rights Directive 2011/83/EU).
          </li>
          <li>
            <strong>Business purchases.</strong> Where you purchase as a business, the statutory
            consumer right of withdrawal does not apply, and the unlock is final on delivery,
            subject to section 5 (billing errors).
          </li>
        </ul>
      </Section>

      <Section title="4. EU right of withdrawal (consumers only)">
        <p>
          If you are a consumer in the EU/EEA entering into a distance contract, you generally
          have <strong>14 days</strong> to withdraw from a purchase without giving a reason.
          For immediately delivered digital content, this right is lost once you have consented
          to immediate performance and delivery has begun (section 3). Where a valid withdrawal
          right still applies, contact{" "}
          <a className="text-primary underline hover:no-underline" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>{" "}
          within the 14-day period; we reimburse payments received using the same payment method
          without undue delay and within the statutory period.
        </p>
      </Section>

      <Section title="5. Refund stance">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>General rule.</strong> Except where required by mandatory law (including the
            consumer rights above) or expressly stated otherwise, fees are non-refundable, and no
            partial refunds are given for the unused portion of a subscription period after a
            charge has been made.
          </li>
          <li>
            <strong>Cancellation is not a refund.</strong> Cancelling stops future renewals but
            does not refund the current period; you keep access until the end of that period.
          </li>
          <li>
            <strong>One-off unlocks</strong> are generally non-refundable once delivered, subject
            to the consumer rules above.
          </li>
          <li>
            <strong>Discretionary refunds.</strong> We may, at our discretion, offer a refund or
            credit in individual cases (for example, a verified service fault). Any such
            accommodation is not a waiver of this policy.
          </li>
          <li>
            <strong>Currency and taxes.</strong> Refunds, where given, are made in EUR to the
            original payment method and account for applicable VAT as required.
          </li>
        </ul>
      </Section>

      <Section title="6. Billing errors and failed payments">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Billing errors.</strong> If you believe you have been charged in error,
            contact{" "}
            <a className="text-primary underline hover:no-underline" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>{" "}
            within 30 days of the charge. Where an error is confirmed, we correct it (including a
            refund or credit as appropriate).
          </li>
          <li>
            <strong>Failed payments.</strong> If a payment fails, we (via Stripe) may retry the
            charge and may suspend or downgrade the service until payment succeeds.
          </li>
          <li>
            <strong>Invoices and records.</strong> Billing and accounting records are retained for
            7 years under the Swedish Bookkeeping Act (Bokföringslagen). VAT receipts are available
            via Stripe or on request.
          </li>
        </ul>
      </Section>

      <Section title="7. Chargebacks">
        <p>
          If you have a billing concern, please contact us first so we can resolve it. Initiating
          a chargeback or payment dispute without first contacting us may result in suspension or
          termination of the service pending resolution. This section does not limit the
          non-waivable rights of any user who is a consumer.
        </p>
      </Section>

      <Section title="8. Enterprise">
        <p>
          Enterprise purchases (including bespoke pricing, invoicing, and committed terms) are
          governed by the applicable Enterprise Agreement or order form, which sets out the
          relevant cancellation and refund terms and controls where it conflicts with this policy.
        </p>
      </Section>

      <Section title="9. Changes to this policy">
        <p>
          We may update this policy in line with the Terms of Service. Material changes will be
          notified with reasonable advance notice, and the version in force at the time of your
          purchase governs that purchase.
        </p>
      </Section>

      <Section title="10. Contact">
        <p>
          Questions about cancellations, refunds, or billing: contact Erik Bohjort, EB Consulting,
          Sweden, at{" "}
          <a className="text-primary underline hover:no-underline" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h3 className="font-semibold text-foreground">{title}</h3>
      {children}
    </section>
  );
}
