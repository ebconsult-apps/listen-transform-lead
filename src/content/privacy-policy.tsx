// ─────────────────────────────────────────────────────────────────────────────
// Privacy Policy — single source of truth for the version string and the body
// shown in the in-app acceptance modal (PrivacyPolicyDialog) during project setup.
//
// This is a user-facing rendering of the canonical draft in
// `legal/drafts/privacy-policy.md`; keep the two consistent. The legal draft is the
// authoritative text and still carries items for counsel to confirm (legal entity
// details, exact retention periods, Anthropic retention config, AI Act class). When
// the copy here changes, bump PRIVACY_POLICY_VERSION so acceptance is re-prompted, and
// keep the published version string in sync with the legal draft.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Current policy version. Stored on `profiles.privacy_policy_version` when a user
 * accepts, so we can detect (in future) that an older version was accepted.
 * Bump this string whenever the copy in <PrivacyPolicyContent/> changes.
 */
export const PRIVACY_POLICY_VERSION = "2026-06-25";

/** Human-readable effective date, shown at the top of the policy body. */
export const PRIVACY_POLICY_EFFECTIVE_DATE = "25 June 2026";

const CONTACT_EMAIL = "erik@eb-consulting.se";

/** The Privacy Policy body rendered inside the acceptance modal. */
export function PrivacyPolicyContent() {
  return (
    <div className="space-y-6 text-sm leading-relaxed text-foreground/80">
      <p className="text-foreground/60">
        Effective date: {PRIVACY_POLICY_EFFECTIVE_DATE} · Version {PRIVACY_POLICY_VERSION}
      </p>

      <p>
        This Privacy Policy explains how personal data is collected and processed in
        connection with <strong>CLEAR</strong>, a self-serve platform that helps
        organizations analyze behaviour-change challenges. It is written to the EU/EEA
        baseline (the GDPR, the ePrivacy rules on cookies, and the EU AI Act).
      </p>

      <Section title="1. Who we are">
        <p>
          CLEAR is operated by <strong>Erik Bohjort</strong>, trading as{" "}
          <strong>EB Consulting</strong> (eb-consulting.se), a psychology-led consultancy
          based in <strong>Stockholm, Sweden</strong>. For personal data where we decide
          the purposes and means of processing, we are the <strong>data controller</strong>.
          You can reach us about any privacy matter at{" "}
          <a className="text-primary underline hover:no-underline" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          .
        </p>
        <p>
          <strong>Controller vs. processor.</strong> We are the controller for data about
          our account holders and our website (account &amp; identity, authentication,
          billing, and consent-based website analytics). For the content a customer puts
          into the platform to obtain an analysis — project briefs, stakeholder details,
          uploaded documents, and respondent contributions — the{" "}
          <strong>customer organization is the controller</strong> and{" "}
          <strong>we act as their processor</strong>, handling it only to provide the
          service on their instructions. The customer is responsible for having a lawful
          basis and for informing the people concerned; the terms of that relationship are
          set out in a Data Processing Agreement (available on request).
        </p>
      </Section>

      <Section title="2. The personal data we process">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Account &amp; identity.</strong> Your name and email address,
            authentication identifiers, and the timestamp and version of your acceptance
            of this policy.
          </li>
          <li>
            <strong>Project content.</strong> The behaviour-change challenge you describe,
            target group and use case, timeline, stakeholder names and roles, and any
            documents you upload (PDF, DOCX, XLSX, MD, TXT, CSV) plus the text extracted
            from them. Free-text and documents may contain personal data about third
            parties, chosen by the customer.
          </li>
          <li>
            <strong>Voice dictation (transcript only).</strong> If you use the optional
            in-browser dictation, the Web Speech API runs in your browser and only the
            resulting <em>text</em> reaches our servers — no audio file is recorded or sent.
          </li>
          <li>
            <strong>Respondent contributions.</strong> An invited respondent&rsquo;s email,
            optional name, free-text answers, reactions/notes, and any optional uploads.
          </li>
          <li>
            <strong>AI outputs.</strong> The structured analysis generated for a project,
            stored on the customer&rsquo;s behalf.
          </li>
          <li>
            <strong>Billing.</strong> Your Stripe customer and subscription identifiers,
            plan tier and status. Card details are handled by Stripe and never reach our
            servers.
          </li>
          <li>
            <strong>Enquiry &amp; marketing data.</strong> When you submit a contact,
            consultation, assessment, book, or whitepaper form, the details you provide —
            typically name, email, organisation, role, and message.
          </li>
          <li>
            <strong>Website analytics.</strong> Where you consent, pseudonymous usage
            events, page views, and a transient (truncated) IP address.
          </li>
        </ul>
        <p>We do not buy personal data about you, and we do not sell your personal data.</p>
      </Section>

      <Section title="3. Why we process it, and our legal bases">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>To provide the service</strong> — create and secure your account, run
            the CLEAR analysis you request, store your projects, and enable respondent
            collaboration. Legal basis: <em>performance of a contract</em> (and{" "}
            <em>legitimate interests</em> for security).
          </li>
          <li>
            <strong>To take payment</strong> and keep accounting records. Legal basis:{" "}
            <em>contract</em> and <em>legal obligation</em> (Swedish bookkeeping law).
          </li>
          <li>
            <strong>To respond to enquiries</strong> and send updates you ask for. Legal
            basis: <em>consent</em> or our <em>legitimate interest</em> in answering you.
          </li>
          <li>
            <strong>To secure and improve the service</strong> and prevent abuse. Legal
            basis: <em>legitimate interests</em>, balanced against your rights.
          </li>
          <li>
            <strong>Website analytics and advertising measurement.</strong> Legal basis:{" "}
            <em>consent</em> — no non-essential tracker loads until you opt in.
          </li>
        </ul>
        <p>
          For third-party personal data inside customer content, the customer is the
          controller and relies on its own legal basis; we process it as a processor on
          the customer&rsquo;s instructions. We do not make solely-automated decisions that
          produce legal or similarly significant effects about you.
        </p>
      </Section>

      <Section title="4. Special-category data">
        <p>
          CLEAR is a tool for organizational strategy and behaviour change and{" "}
          <strong>does not require special-category data</strong> (such as data about
          health, ethnicity, political opinions, religion, trade-union membership, or
          biometric data). Please do not upload or enter special-category data unless you
          have your own valid lawful basis under GDPR Art. 9 and instruct us accordingly;
          any such processing is performed by us strictly as a processor on your documented
          instructions.
        </p>
      </Section>

      <Section title="5. How we use AI">
        <p>
          The CLEAR analysis is produced with Anthropic&rsquo;s Claude models, used for
          inference only. The project details, extracted document text, and respondent
          contributions relevant to a run are sent to Anthropic server-side to generate
          your report; under Anthropic&rsquo;s commercial terms this content is{" "}
          <strong>not used to train its models</strong>. Where you enable the optional
          research feature, search queries derived from your project may be sent to web
          search and content providers.
        </p>
        <p>
          <strong>AI transparency.</strong> CLEAR outputs are AI-generated and may be
          inaccurate or incomplete. They are decision-support — not professional, legal,
          medical, or financial advice — and should be reviewed and validated by a
          competent person before being acted upon. No solely-automated decision with a
          legal or similarly significant effect is made about any individual.
        </p>
      </Section>

      <Section title="6. Who we share data with">
        <p>
          We do not sell your data. We share it only with vetted service providers
          (&ldquo;subprocessors&rdquo;) who process it on our behalf under appropriate
          data-processing terms, and where required by law:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li><strong>Supabase</strong> — database, authentication, and document storage hosting.</li>
          <li><strong>Anthropic</strong> — AI inference that generates your analysis (see section 5).</li>
          <li><strong>Stripe</strong> — payment processing for paid plans.</li>
          <li><strong>Brevo</strong> — transactional and requested email.</li>
          <li><strong>Google</strong> — website analytics and advertising measurement, where you consent.</li>
          <li><strong>Microsoft (Bookings)</strong> — scheduling discovery calls when you book one.</li>
        </ul>
      </Section>

      <Section title="7. International transfers">
        <p>
          We aim to keep application data hosted and processed within the{" "}
          <strong>EU/EEA</strong>: our hosting, database, authentication and document
          storage run in an EU region, and our email provider is EU-based. The main
          exception is AI inference: <strong>Anthropic is established in the United
          States</strong>, so content sent for analysis is transferred to the US under the
          EU <strong>Standard Contractual Clauses (SCCs)</strong> and Anthropic&rsquo;s data
          processing terms. Other US-based providers (such as payments and website
          analytics) likewise rely on SCCs or equivalent EU data-processing terms. You can
          request a copy of the relevant safeguards.
        </p>
      </Section>

      <Section title="8. Cookies and analytics">
        <p>
          Our website uses strictly-necessary cookies to run the site and remember your
          consent choice. Analytics (Google Analytics 4) and advertising (Google Ads)
          trackers are non-essential and load <strong>only after you consent</strong>. We
          use Google Consent Mode v2, which defaults all analytics and advertising signals
          to &ldquo;denied&rdquo; until you opt in; you can change or withdraw consent at
          any time.
        </p>
      </Section>

      <Section title="9. How long we keep data">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Account &amp; project data</strong> — kept for the life of your account
            and deleted within <strong>30 days</strong> of account closure; backups are
            purged within <strong>90 days</strong>.
          </li>
          <li>
            <strong>Uploaded documents &amp; AI outputs</strong> — share their
            project&rsquo;s lifecycle and are deletable per-project by the owner at any time.
          </li>
          <li>
            <strong>Respondent invitations</strong> — invite tokens expire after{" "}
            <strong>30 days</strong>; contributions are retained with the project and
            deletable by the owner.
          </li>
          <li>
            <strong>Website analytics</strong> — retained for around <strong>14 months</strong>.
          </li>
          <li>
            <strong>Billing &amp; accounting records</strong> — kept for{" "}
            <strong>7 years</strong>, as required by the Swedish Bookkeeping Act
            (<em>Bokföringslagen</em>), even after account closure.
          </li>
        </ul>
        <p>When a retention period ends, data is deleted or irreversibly anonymized.</p>
      </Section>

      <Section title="10. Your rights">
        <p>
          Where we are the controller (account, authentication, billing, website
          analytics), you have the right to request: access to your personal data;
          rectification of inaccurate data; erasure; restriction of processing; data
          portability; and to object to processing based on legitimate interests or to
          direct marketing. Where we rely on consent, you can withdraw it at any time
          without affecting prior processing.
        </p>
        <p>
          To exercise any of these rights, email us at{" "}
          <a className="text-primary underline hover:no-underline" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          . We may need to verify your identity, and we aim to respond within one month. If
          your data was provided to CLEAR by one of our customers (for example as an invited
          respondent), we will refer your request to that customer as the controller.
        </p>
        <p>
          You also have the right to lodge a complaint with the Swedish Authority for
          Privacy Protection (Integritetsskyddsmyndigheten, IMY), Box 8114, 104 20
          Stockholm, Sweden — imy@imy.se · www.imy.se — or with your local EU/EEA
          supervisory authority.
        </p>
      </Section>

      <Section title="11. Security">
        <p>
          We use appropriate technical and organizational measures, including encryption in
          transit (TLS) and at rest, tenant isolation via database row-level security,
          SHA-256-hashed respondent invite tokens (never stored in clear text), JWT-based
          session authentication, and server-side secret management. No method of
          transmission or storage is completely secure, but we work to safeguard your data
          and to address any incident promptly.
        </p>
      </Section>

      <Section title="12. Children">
        <p>
          CLEAR is a business service intended for organizations and their staff. It is not
          directed to children and is intended for users aged 18 or over. We do not
          knowingly collect personal data from children.
        </p>
      </Section>

      <Section title="13. Changes &amp; versioning">
        <p>
          We may update this policy from time to time. The version and effective date
          appear at the top, and the current version is recorded in the app
          (PRIVACY_POLICY_VERSION) against your acceptance, so we can detect when a newer
          version requires re-acceptance. When we make material changes we will take
          reasonable steps to inform you and, where appropriate, re-prompt acceptance.
        </p>
      </Section>

      <Section title="14. Contact">
        <p>
          For any privacy question or request, contact Erik Bohjort, EB Consulting,
          Stockholm, Sweden, at{" "}
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
