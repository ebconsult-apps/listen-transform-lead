# CLEAR — Legal & Compliance Readiness Assessment

> **DRAFT — NOT LEGAL ADVICE.** This assessment was prepared by reviewing the source code in
> this repository. It identifies *known, evidenced* gaps and gives counsel a starting point. It is
> **not legal advice** and does not certify compliance. A qualified EU/Swedish-law practitioner
> must review it — and the EU AI Act classification in particular — before launch.
> Assessment date: 2026-06-25. Baseline: **EU/EEA — GDPR, ePrivacy, EU consumer law, EU AI Act.**

---

## 1. Executive summary

CLEAR is a B2B SaaS that runs AI behavioural-change analysis on customer-supplied briefs and
documents. The engineering foundation for compliance is **better than average for a pre-launch
product**: tenant isolation via Row-Level Security, hashed respondent tokens, server-side secrets,
an EU-pinned database, a privacy-acceptance gate, and Google Consent Mode v2 defaulting to *denied*.

However, the product is **not yet ready to be sold to EU users**. The blocking issues are
**documentary and procedural**, not architectural:

- The **Privacy Policy is an explicit placeholder** (`src/content/privacy-policy.tsx:5-7`).
- There is **no Terms of Service, DPA, Acceptable Use Policy, refund policy, or subprocessor list**.
- **Data-subject rights cannot be fulfilled** — there is no export or erasure path in the code, yet
  the policy promises these rights.
- **No signed Data Processing Agreements** are on record with the five subprocessors, and the
  **US transfer to Anthropic** has no documented SCC/transfer basis — which sits in tension with
  the public "processed in the EU" promise.
- Billing has **no refund/cancellation policy** and a **currency/VAT display defect** ($ shown,
  EUR charged).

This assessment lists every finding with its evidence and the document or change that resolves it.
The companion **REMEDIATION-CHECKLIST.md** sequences the work; the `drafts/` folder contains
counsel-ready document drafts that close most of the documentary gaps.

**Readiness verdict:** *Do not open paid EU sign-ups until the Critical items in §3 are closed.*

---

## 2. Scope & method

- **Reviewed:** the application source (React/Vite front end), the Supabase backend (Postgres
  schema + migrations, Edge Functions, storage), billing/AI/email integrations, analytics setup,
  and dependency manifests. Findings cite specific files.
- **In scope:** GDPR, the ePrivacy/cookie regime, EU consumer-protection law, and the EU AI Act
  (deployer perspective), plus software-licensing hygiene for selling a proprietary product.
- **Out of scope:** non-EU regimes (US CCPA/CPRA, UK GDPR, Canada PIPEDA — a short "if you expand"
  note only); the PHP marketing form handlers (referenced in `src/hooks/use-form-submit.ts`, not in
  this repo) — high-level note only; any certification (SOC 2, ISO 27001).
- **Severity scale:** **Critical** = launch blocker · **High** = fix before scaling / first paying
  EU customer · **Medium** = fix soon after launch · **Low** = hygiene / watch-item.

---

## 3. Risk register

Each item: **severity · evidence · requirement · recommended fix · owner.** Owner tags:
**[Legal]** counsel/policy, **[Eng]** engineering, **[Ops]** business operations.

### 3.1 Privacy Policy is a placeholder — **Critical** · [Legal][Eng]
- **Evidence:** `src/content/privacy-policy.tsx:5-7,21-24` ("PLACEHOLDER COPY … replace before
  production"); shown in the acceptance modal during project creation (`src/pages/app/NewProject.tsx`).
- **Requirement:** GDPR Arts. 12–14 require a complete, accurate, accessible privacy notice before
  collecting personal data.
- **Fix:** finalize `drafts/privacy-policy.md` with counsel; wire the approved text into
  `privacy-policy.tsx` and bump `PRIVACY_POLICY_VERSION` to force re-acceptance. *(Wiring is the
  separate engineering follow-up.)*

### 3.2 No Terms of Service / user agreement — **Critical** · [Legal]
- **Evidence:** none present anywhere in the repo (confirmed); Stripe billing is already wired
  (`src/config/billing.ts`, `supabase/functions/stripe-webhook/index.ts`).
- **Requirement:** a binding contract is needed to take payment, limit liability, disclaim AI
  output, and set IP/data ownership.
- **Fix:** adopt `drafts/terms-of-service.md`; present an "I agree" gate at signup and a versioned
  record (mirror the existing privacy-acceptance pattern). **Selling without a ToS is the single
  largest commercial-legal exposure.**

### 3.3 Data-subject rights cannot be fulfilled — **Critical** · [Eng][Ops]
- **Evidence:** no export/erasure/rectification endpoint or UI exists in the codebase; the
  placeholder policy nonetheless promises access, correction, deletion, and withdrawal
  (`src/content/privacy-policy.tsx:55-59`).
- **Requirement:** GDPR Arts. 15–22 — fulfil access, rectification, erasure, restriction,
  portability, objection within one month.
- **Fix (interim):** adopt the **manual** `records/dsr-runbook.md` so requests can be honoured at
  launch. **Fix (follow-up):** build self-service export + account/project deletion endpoints.

### 3.4 No Data Processing Agreements with subprocessors — **Critical** · [Legal][Ops]
- **Evidence:** five subprocessors are integrated — Supabase, Anthropic, Stripe, Brevo, Google
  (`.env.example`, `supabase/functions/_shared/clear/live-engine.ts`, `.../email.ts`,
  `src/utils/analytics.ts`) — with no DPA on record.
- **Requirement:** GDPR Art. 28 requires a written DPA with every processor.
- **Fix:** execute each vendor's DPA; maintain `drafts/subprocessors.md`; offer customers
  `drafts/data-processing-agreement.md` (CLEAR as processor).

### 3.5 US transfer to Anthropic vs. "processed in the EU" claim — **Critical** · [Legal][Eng]
- **Evidence:** project briefs, stakeholders, document text, and respondent contributions are sent
  to Anthropic for inference (`supabase/functions/_shared/clear/live-engine.ts`); the optional
  Research agent egresses web-search/fetch queries; marketing states "processed in the EU and never
  used to train models."
- **Requirement:** GDPR Ch. V — a valid transfer mechanism (SCCs + transfer-impact assessment) for
  US processing, and **accurate** public statements (mis-stating data flows is itself a consumer/
  advertising risk).
- **Fix:** put SCCs/DPA in place with Anthropic; confirm retention/zero-retention configuration;
  **reconcile the marketing copy** to reflect that AI inference occurs at Anthropic (US) under
  SCCs — or move to an EU-resident inference option if required. Document in the DPIA.

### 3.6 Free-text & documents may carry special-category data — **High** · [Legal][Eng]
- **Evidence:** `project_inputs.challenge`, `stakeholders`, document `extracted_text`, and
  respondent `answers` are free-form (`supabase/migrations/20260616184600_init.sql`,
  `...20260616210000_respondent_collaboration.sql`) and may contain employee, health, or other
  Art. 9 data.
- **Requirement:** GDPR Art. 9 needs an explicit basis; processing others' data needs the controller
  (customer) to have one.
- **Fix:** contractually require customers not to upload special-category data without their own
  lawful basis (DPA + AUP warranties); add an upload-time notice; record in the DPIA. Consider
  light input minimization guidance in-product (follow-up).

### 3.7 EU AI Act — classification & transparency unconfirmed — **High** · [Legal][Eng]
- **Evidence:** the product is an AI decision-support system over personal/organizational data
  (`live-engine.ts`); de-identified findings can be promoted into a **shared** `knowledge_base`
  reused across customers (`supabase/migrations/20260617150000_research_agent.sql`).
- **Requirement:** confirm risk classification (likely **not** Annex III high-risk, but counsel must
  confirm); meet **Art. 50 transparency** (tell users/respondents outputs are AI-generated); CLEAR
  is a **deployer** of a GPAI model, not its provider.
- **Fix:** counsel sign-off on classification (see `records/dpia-outline.md`); add an AI-generated
  label in the UI (follow-up) and the AI disclaimer in the ToS/Privacy Policy.

### 3.8 No data retention / deletion lifecycle — **High** · [Eng][Legal]
- **Evidence:** no TTL/purge logic anywhere; respondent **invites** expire at 30 days
  (`supabase/migrations/20260616210000_respondent_collaboration.sql`) but **contributions persist
  indefinitely**; documents and `runs.output` are kept indefinitely.
- **Requirement:** GDPR Art. 5(1)(e) storage limitation — defined, enforced retention.
- **Fix:** publish retention periods (in `drafts/privacy-policy.md`); implement purge jobs and
  per-project/account deletion (follow-up). Note the **7-year** accounting retention for billing
  records (Bokföringslagen) is a lawful exception.

### 3.9 Cookie consent is all-or-nothing — **High** · [Eng][Legal]
- **Evidence:** `src/components/CookieConsent.tsx` offers only Accept/Decline and stores a single
  flag in localStorage; GA4 + Google Ads load via Consent Mode v2 (`index.html`,
  `src/utils/analytics.ts`).
- **Requirement:** ePrivacy + GDPR — granular, freely-given consent; equal-weight accept/reject;
  no non-essential trackers before consent (the Consent Mode default-denied setup is a good start).
- **Fix:** add granular categories (analytics vs advertising) and publish `drafts/cookie-policy.md`;
  verify nothing non-essential fires pre-consent (follow-up).

### 3.10 No refund/cancellation policy; currency & VAT display defect — **High** · [Legal][Eng][Ops]
- **Evidence:** prices render with `$` in `src/config/billing.ts` while EUR is tracked for
  conversions (`src/utils/analytics.ts`); no refund/cancellation terms exist.
- **Requirement:** EU Consumer Rights Directive (right of withdrawal; digital-content rules), price
  transparency (VAT-inclusive display to consumers), and EU VAT/OSS for cross-border digital
  services.
- **Fix:** publish `drafts/refund-cancellation-policy.md`; correct prices to **EUR, VAT-inclusive**;
  confirm VAT/OSS registration and Stripe Tax configuration with an accountant.

### 3.11 Respondent portal has no privacy notice — **High** · [Legal][Eng]
- **Evidence:** the token portal collects name, free-text answers, and uploads with no notice
  (`supabase/functions/respondent/index.ts`, `supabase/functions/invite-respondents/index.ts`).
- **Requirement:** GDPR Art. 13 — inform data subjects at the point of collection.
- **Fix:** show a just-in-time privacy notice on `/respond/<token>` linking the Privacy Policy
  (follow-up); covered descriptively in `drafts/privacy-policy.md`.

### 3.12 No DPIA or Records of Processing (Art. 30) — **Medium** · [Legal]
- **Evidence:** none present; processing involves AI + potentially sensitive data on others'
  behalf at scale.
- **Requirement:** GDPR Art. 35 (DPIA likely warranted) and Art. 30 (RoPA mandatory in practice).
- **Fix:** complete `records/dpia-outline.md` and `records/ropa.md`.

### 3.13 No documented breach-notification process — **Medium** · [Ops][Legal]
- **Evidence:** no incident/breach procedure in the repo.
- **Requirement:** GDPR Arts. 33–34 — controller notifies the supervisory authority within 72h;
  processors notify the controller without undue delay.
- **Fix:** adopt the breach section of `records/dsr-runbook.md`/DPA; define an on-call contact.

### 3.14 No application-level audit logging — **Medium** · [Eng]
- **Evidence:** RLS and DB logs exist, but no business-action audit trail.
- **Requirement:** supports GDPR Art. 5(2) accountability and breach investigation.
- **Fix:** add an append-only audit log for sensitive actions (follow-up).

### 3.15 Marketing & professional-credential claims — **Medium** · [Legal][Ops]
- **Evidence:** "licensed psychologist," "backed by science," psychometric assessments, and the
  out-of-repo PHP lead/newsletter forms (`src/hooks/use-form-submit.ts`, `src/config/site.ts`).
- **Requirement:** EU consumer/advertising law — claims must be substantiable; marketing email
  needs an ePrivacy basis (opt-in / soft opt-in) and an unsubscribe path.
- **Fix:** keep evidence for scientific/credential claims; confirm the PHP handlers capture consent
  and honour opt-out; add a marketing-privacy note.

### 3.16 No proprietary LICENSE / NOTICE at repo root — **Low** · [Eng][Legal]
- **Evidence:** no root `LICENSE`; only a font licence (`public/fonts/satoshi/LICENSE.txt`).
- **Requirement:** declare proprietary rights to sell closed-source software and clarify
  third-party component licences.
- **Fix:** add the text from `drafts/proprietary-notice.md` as `/LICENSE` or `/NOTICE`.

### 3.17 Accessibility (European Accessibility Act) — **Low / watch** · [Eng]
- **Evidence:** consumer-facing web UI.
- **Requirement:** the EAA (effective June 2025) covers consumer e-commerce services.
- **Fix:** run a WCAG 2.1 AA pass if any B2C exposure is intended (follow-up).

---

## 4. What is already in good shape

- **Tenant isolation:** Row-Level Security across all user tables
  (`supabase/migrations/20260616184600_init.sql`).
- **Respondent tokens hashed** (SHA-256) rather than stored raw
  (`supabase/migrations/20260616210000_respondent_collaboration.sql`).
- **Secrets server-side only**; service-role key never in the client bundle (`.env.example`).
- **EU data residency** for the database is documented (`supabase/README.md`).
- **Consent Mode v2 default-denied** for analytics/ads (`index.html`, `src/utils/analytics.ts`).
- **Privacy-acceptance audit trail** already exists
  (`supabase/migrations/20260625120000_privacy_acceptance.sql`, `src/lib/db.ts`).
- **Voice dictation is local-only** (Web Speech API; transcript text only, no audio stored —
  `src/hooks/useDictation.ts`), which largely avoids recording/wiretap exposure.
- **Dependency licences are clean** — all permissive (MIT/BSD/Apache); **no GPL/AGPL copyleft**;
  no barrier to selling a proprietary product.

---

## 5. Subprocessor risk summary

| Subprocessor | Data | Transfer | Priority action |
|---|---|---|---|
| **Supabase** | All app data, documents | EU region | Confirm DPA + EU residency in writing |
| **Anthropic** | Briefs, documents, respondent input → AI | **US** | SCCs/DPA + retention config; reconcile "EU" claim (§3.5) |
| **Stripe** | Billing identifiers | SCCs | Confirm DPA; enable Stripe Tax/VAT |
| **Brevo** | Recipient email, name, content | EU | Confirm DPA |
| **Google (GA4/Ads)** | Pseudonymous, consent-gated | SCCs | Confirm Google data terms; granular consent (§3.9) |
| **Microsoft Bookings** | Scheduling contact (marketing only) | [confirm] | Note in subprocessor list |

---

## 6. Evidence index (key files)

`src/content/privacy-policy.tsx` · `src/components/CookieConsent.tsx` · `src/config/billing.ts` ·
`src/utils/analytics.ts` · `index.html` · `src/config/site.ts` · `src/hooks/useDictation.ts` ·
`src/hooks/use-form-submit.ts` · `src/lib/db.ts` · `src/pages/app/NewProject.tsx` ·
`supabase/migrations/20260616184600_init.sql` ·
`supabase/migrations/20260616210000_respondent_collaboration.sql` ·
`supabase/migrations/20260617150000_research_agent.sql` ·
`supabase/migrations/20260625120000_privacy_acceptance.sql` ·
`supabase/functions/_shared/clear/live-engine.ts` · `supabase/functions/_shared/email.ts` ·
`supabase/functions/respondent/index.ts` · `supabase/functions/invite-respondents/index.ts` ·
`supabase/functions/stripe-webhook/index.ts` · `supabase/README.md` · `.env.example`.
