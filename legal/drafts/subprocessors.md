> **DRAFT — NOT LEGAL ADVICE.** Prepared as a product-specific starting point. It **must be
> reviewed and finalized by qualified legal counsel (EU / Swedish law)** before publication or
> use. Items in `[brackets]` require confirmation. Draft date: 2026-06-25.

# CLEAR — Subprocessor List

This page lists the third parties ("subprocessors") that **CLEAR** (operated by
**Erik Bohjort / EB Consulting**) engages to process personal data on behalf of its customers in
connection with the CLEAR platform. It is referenced by, and forms part of, the
[CLEAR Privacy Policy](./privacy-policy.md) and the
[Data Processing Agreement (DPA)](./data-processing-agreement.md).

- **Effective date:** 2026-06-25
- **Maintained by:** CLEAR / EB Consulting — contact `[privacy contact email]` (current verified
  sender: `erik@eb-consulting.se`)
- **Legal entity:** `[Legal entity name]`, `[company registration number]`, `[registered address]`,
  Stockholm, Sweden.

---

## 1. How we notify customers of changes

CLEAR's customers have given **general written authorization** for CLEAR to use subprocessors,
subject to the following:

1. **Advance notice.** Before adding a new subprocessor, or replacing an existing one in a way that
   results in the processing of customer personal data, CLEAR will give affected controllers
   **at least `[30]` days' advance notice** by updating this page and/or by email to the account
   owner's notification address. Customers are encouraged to subscribe to updates via
   `[subscription / RSS / email-list mechanism — to confirm]`.
2. **Right to object.** A customer that reasonably objects to a new subprocessor on
   data-protection grounds may notify CLEAR in writing within the notice period at
   `[privacy contact email]`. The parties will work in good faith to address the objection. If no
   resolution is reached, the customer may, as its **sole and exclusive remedy**, terminate the
   affected subscription in accordance with the [DPA](./data-processing-agreement.md) and the
   [Terms of Service].
3. **Flow-down of obligations.** CLEAR imposes on each subprocessor, by written contract, data
   protection obligations **substantially equivalent** to those in the DPA, including appropriate
   technical and organizational measures and, where the subprocessor processes data outside the
   EEA, an appropriate transfer mechanism (Article 46 GDPR Standard Contractual Clauses or an
   adequacy decision). CLEAR remains **fully liable** to the customer for the performance of each
   subprocessor's obligations.

> This list reflects the current state of CLEAR's processing. The exact data-residency regions,
> retention configuration, and contract references marked `[brackets]` below must be confirmed
> against each provider's executed agreement before publication.

---

## 2. Core-app subprocessors

These subprocessors process personal data submitted to, or generated within, the **CLEAR
application** (accounts, projects, documents, respondent contributions, AI outputs, billing). For
this data, the **customer organization is the controller** and CLEAR acts as **processor**.

| Subprocessor | Service / purpose | Personal data processed | Location | Transfer mechanism | DPA / privacy link |
|---|---|---|---|---|---|
| **Supabase** (Supabase Inc.) | Primary hosting platform: Postgres database, Auth, serverless Edge Functions, private document storage. Stores substantially all application data. | All application data: account/identity data, project inputs (challenge, stakeholders, timeline, target group, use case), uploaded documents + server-extracted text, respondent contributions, AI outputs, billing identifiers. | EU region (`eu-central-1` / `eu-west-1`). `[Confirm EU residency + Supabase DPA]` | Within EEA (intended). SCCs if any onward transfer outside the EEA. `[Confirm]` | `[Supabase DPA / Privacy Policy URL]` |
| **Anthropic** (Anthropic PBC — Claude API) | AI analysis engine — inference only. Receives project content to generate the structured CLEAR analysis. Optional Research agent may run web search / web fetch (server-side only). | Project brief, stakeholders, timeline, document-extracted text, respondent contributions sent for analysis; generated outputs returned. | **United States.** | **SCCs** + Anthropic commercial terms & DPA. API inputs/outputs are **not used to train models**; retention limited `[confirm zero / limited retention config]`. | `[Anthropic Commercial Terms / DPA / Privacy URL]` |
| **Stripe** (Stripe, Inc. / Stripe Payments Europe) | Payment processing — subscriptions and one-off report unlocks; Billing Portal for self-service management. | Billing contact, Stripe customer ID, subscription ID, plan tier/status, payment metadata. **Card data is handled by Stripe and never touches CLEAR servers.** | EU / US. `[Confirm contracting entity + region]` | **SCCs** + Stripe DPA. PCI-DSS handled by Stripe. | `[Stripe DPA / Privacy URL]` |
| **Brevo** (Sendinblue SAS) | Transactional email — respondent invitations and account/service email. | Recipient email address, optional name, message content. | **EU (France).** `[Confirm Brevo DPA]` | Within EEA (intended). SCCs if any onward transfer outside the EEA. `[Confirm]` | `[Brevo DPA / Privacy URL]` |

---

## 3. Marketing-site subprocessors

These subprocessors operate on the **CLEAR / EB Consulting marketing website only** and do **not**
process customer project content inside the core application. For most of this data CLEAR acts as
**controller** (see the Privacy Policy); they are listed here for transparency.

| Subprocessor | Service / purpose | Personal data processed | Location | Transfer mechanism | DPA / privacy link |
|---|---|---|---|---|---|
| **Google** (Google Ireland Ltd. — Analytics 4 + Google Ads) | Website analytics and ad-conversion measurement. **Consent-gated** (Consent Mode v2, default denied); no non-essential cookie or tracker fires before consent. | Pseudonymous usage events, page views, transient IP, `[hashed email for enhanced conversions]`. | EU / US. | **SCCs** / Google Ads Data Processing Terms. Consent required before any non-essential cookie or tracker. | `[Google Ads DPT / Privacy URL]` |
| **Microsoft Bookings** (Microsoft Corporation) | Discovery-call scheduling on the marketing site only — **not part of the core CLEAR application**. | Name, email, scheduling information entered by the visitor. | `[Confirm region]` | `[Confirm Microsoft terms / DPA / transfer mechanism]` | `[Microsoft DPA / Privacy URL]` |

> **Note on marketing form handlers.** The PHP marketing form handlers (contact / whitepaper /
> lead / assessment) run **outside the CLEAR application repository** and are assessed only at a
> high level. Any personal data they process is covered by the Privacy Policy; confirm their hosting
> and any additional subprocessors with counsel.

---

## 4. Distinguishing core-app from marketing-site processors

- **Core-app subprocessors** (Section 2) process the **customer's controlled data** — project
  content, documents, respondent contributions and AI outputs — and are governed by the
  [DPA](./data-processing-agreement.md), including its subprocessor and international-transfer terms.
- **Marketing-site subprocessors** (Section 3) process **website-visitor and analytics data** for
  which CLEAR is generally the **controller**. They are listed here for transparency but are not
  subprocessors of customer-controlled application data.

---

*Last updated: 2026-06-25. For questions about this list, contact `[privacy contact email]`.*
