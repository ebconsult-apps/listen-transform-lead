> **DRAFT — NOT LEGAL ADVICE.** Prepared as a product-specific starting point. It **must be
> reviewed and finalized by qualified legal counsel (EU / Swedish law)** before publication or
> use. Items in `[brackets]` require confirmation. Draft date: 2026-06-25.

# Record of Processing Activities (ROPA) — GDPR Article 30

**Product:** CLEAR — B2B SaaS behavioural-analysis platform (CLEAR Change Framework)
**Organisation:** CLEAR, operated by Erik Bohjort / EB Consulting (`eb-consulting.se`)
**Legal entity / registration / registered address:** `[Legal entity name]` / `[company registration number]` / `[registered address]`
**Controller/processor contact:** `[privacy contact email]` (current verified sender: `erik@eb-consulting.se`)
**DPO / privacy lead:** `[Name + contact, or "no DPO appointed — responsible lead: …"]`
**EU/EEA representative (if applicable, Art. 27):** `[N/A if established in the EU — confirm]`
**Status:** DRAFT — internal compliance record
**Document version:** `[0.1]` · **Last updated:** 2026-06-25

> **How to read this record.** CLEAR has a **dual role** (see Privacy Policy / DPA split):
> - **Record A — CLEAR as CONTROLLER** (Art. 30(1)): account, authentication, billing, website analytics.
> - **Record B — CLEAR as PROCESSOR** (Art. 30(2)): customer project content, target-group data,
>   respondent contributions — the **customer organization is the controller**.
>
> **Storage map referenced below.** Primary store = **Supabase** (Postgres + Auth + Edge Functions +
> private Storage), EU region (eu-central-1 / eu-west-1) `[confirm DPA + EU residency]`. Document files
> live in a **private Supabase Storage bucket `documents`** at path
> `{workspace_id}/{project_id}/{uuid}-{filename}`. Tables: `profiles, workspaces, memberships,
> projects, project_inputs, documents, runs, entitlements, project_unlocks, project_invitations,
> project_contributions, leverage_reactions, experiment_designs, intervention_candidates,
> research_findings, research_questions, knowledge_base`. External: **Stripe** (billing),
> **Brevo** (email), **Google** (analytics), **Anthropic** (AI inference, US).
>
> **TODO (owner):** Validate every legal basis, retention period and recipient with counsel.
> Confirm all subprocessor DPAs and transfer safeguards. Replace `[brackets]`.

---

## RECORD A — CLEAR as CONTROLLER (GDPR Art. 30(1))

**Controller:** CLEAR / `[Legal entity name]`, `[registered address]`, `[privacy contact email]`.
**Joint controllers (if any):** `[None / specify]`.

| # | Processing activity | Purpose | Legal basis (Art. 6 / 9) | Categories of data subjects | Categories of personal data | Systems / tables | Recipients / subprocessors | International transfers + safeguards | Retention | Security measures (Art. 32) |
|---|---|---|---|---|---|---|---|---|---|---|
| A1 | **Account creation & management** | Provide and administer the service; create workspaces and manage members | Art. 6(1)(b) contract `[confirm]` | Account owners, workspace members | Name, email, auth identifiers, privacy-acceptance timestamp + version, role/membership | `profiles`, `workspaces`, `memberships` (Supabase, EU) | Supabase (hosting) | None beyond EU `[confirm Supabase EU residency + DPA]` | Life of account; deleted within `[30]` days of closure; backups purged within `[90]` days | TLS; encryption at rest (Supabase default); RLS tenant isolation; JWT auth; server-side secrets |
| A2 | **Authentication & access security** | Authenticate users; secure access | Art. 6(1)(b) `[and 6(1)(f) for security — confirm]` | Account owners, workspace members | Auth identifiers, session/JWT data, `[login metadata]` | `profiles` + Supabase Auth | Supabase Auth | None beyond EU `[confirm]` | `[Session/token lifetime; auth logs retention — confirm]` | JWT auth; TLS; server-side secrets; `[no application-level audit log — known gap]` |
| A3 | **Billing & subscription management** | Take payment for subscriptions and one-off unlocks; manage plan/tier; self-service via Billing Portal | Art. 6(1)(b) contract; Art. 6(1)(c) legal obligation (accounting) | Paying customers / billing contacts | Billing contact name/email, Stripe customer ID, subscription ID, plan tier, status, payment metadata (**card data handled by Stripe; never on CLEAR servers**) | Billing identifiers in Supabase (`entitlements`, `project_unlocks`, `profiles`/`workspaces`) + **Stripe** | **Stripe** (payments); Supabase | **Stripe** — SCCs + Stripe DPA; PCI-DSS handled by Stripe | **Billing/accounting records: 7 years** (Swedish Bookkeeping Act / Bokföringslagen). Operational billing state: life of account `[confirm]` | TLS; tokenized/externalized card data at Stripe; RLS; access control |
| A4 | **Website analytics & ad-conversion measurement** | Measure website usage and ad conversions (marketing site) | **Art. 6(1)(a) consent** (+ ePrivacy/PECR consent for cookies/trackers) | Website visitors | Pseudonymous usage events, page views, transient IP, `[hashed email for Google enhanced conversions]` — **all consent-gated** (Consent Mode v2, default denied) | Browser → **Google Analytics 4 + Google Ads** | **Google** (GA4, Ads) | **Google** — SCCs / Google Ads Data Processing Terms (US transfer) | GA4 retention `[14 months]`; consent records `[confirm]` | Consent gating before any non-essential cookie; TLS; IP handling per GA config `[confirm IP anonymization]` |
| A5 | **Transactional / account email** | Send account and service emails (not respondent invites — see B-record) | Art. 6(1)(b) contract; Art. 6(1)(f) legitimate interest `[for service notices — confirm]` | Account owners, workspace members | Recipient email, name, message content | Triggered from app → **Brevo** | **Brevo (Sendinblue)** | Brevo **EU-based (France)** `[confirm Brevo DPA]` | `[Email logs retention at Brevo — confirm]`; tied to account lifecycle | TLS; access control; minimised content |
| A6 | **Discovery-call scheduling (marketing site only)** | Let visitors book a discovery call | Art. 6(1)(b)/(f) `[confirm]`; consent for any associated cookies | Website visitors booking a call | Name, email, scheduling info entered by visitor | **Microsoft Bookings** (marketing site; not core app) | **Microsoft Bookings** | `[Confirm Microsoft terms + transfer basis]` | `[Booking record retention — confirm]` | TLS; vendor-managed |
| A7 | **Marketing-site form handling (high-level)** | Contact / whitepaper / lead / assessment forms | Art. 6(1)(a)/(f) `[confirm]`; consent for non-essential cookies | Website visitors / leads | `[Name, email, message — confirm fields]` | **PHP form handlers live OUTSIDE this repo** — assessed at high level only | `[Confirm downstream recipients]` | `[Confirm transfer basis]` | `[Confirm retention]` | `[Assessed only at high level — confirm controls]` |
| A8 | **Handling data-subject requests & compliance records** | Respond to DSRs; maintain accountability records | Art. 6(1)(c) legal obligation | Any data subject who contacts CLEAR | Identity-verification data, request correspondence | `[DSR log — see dsr-runbook.md]` | `[Internal; counsel if needed]` | None intended `[confirm]` | `[Retain DSR records per accountability needs — e.g. duration of statute of limitations; confirm]` | Access-restricted; minimised |

**Notes for Record A:**
- **Special categories (Art. 9):** Not intentionally processed in controller activities.
- **Voice dictation:** browser-local Web Speech API; only transcript text captured; **no audio sent
  to CLEAR** — captured into project inputs (see Record B), not a standalone controller activity.
- **TODO (owner/counsel):** Confirm legal basis choices (esp. A2 security, A4 consent records, A5/A6
  legitimate-interest balancing). Confirm whether any LIA (legitimate-interest assessment) is needed.

---

## RECORD B — CLEAR as PROCESSOR (GDPR Art. 30(2))

**Processor:** CLEAR / `[Legal entity name]`.
**Controller(s):** **Each customer organization** that creates a workspace/projects. CLEAR processes
this data **only on the customer's documented instructions** (the service agreement / DPA).
**Categories of processing carried out on behalf of each controller:** storage; AI-assisted analysis
(inference); generation and storage of structured outputs; optional de-identified promotion to a
shared knowledge base; respondent collection; transactional respondent email.

| # | Processing activity | Controller's instruction / purpose | Categories of data subjects | Categories of personal data | Systems / tables / storage | Subprocessors / recipients | International transfers + safeguards | Retention | Security measures (Art. 32) |
|---|---|---|---|---|---|---|---|---|---|
| B1 | **Store project brief / inputs** | Process challenge brief to enable analysis, per customer instruction | Customer's staff; **third parties named in free text** (stakeholders, employees, customers) | Project name, target group, use case, **free-text challenge**, stakeholders (names + roles), timeline. *Free text may contain third-party personal data.* | `projects`, `project_inputs` (Supabase, EU) | Supabase | None beyond EU `[confirm Supabase EU residency + DPA]` | Life of project; deletable per-project by owner; deleted within `[30]` days of account closure; backups `[90]` days | TLS; encryption at rest; RLS tenant isolation; JWT auth |
| B2 | **Store uploaded documents + extracted text** | Process supporting documents to enable analysis | Third parties described in documents (employees, customers, etc.) | Files (PDF/DOCX/XLSX/MD/TXT/CSV) + server-extracted text. **May contain employee/customer/financial/health data — controller is the customer.** | `documents` table + **private Storage bucket `documents`** at `{workspace_id}/{project_id}/{uuid}-{filename}` | Supabase Storage | None beyond EU `[confirm]` | Same lifecycle as project; deletable per-project | TLS; private bucket; RLS; encryption at rest; `[no field-level encryption beyond defaults — known gap]` |
| B3 | **AI analysis (inference)** | Generate structured analysis on customer instruction | Customer staff; third parties named in inputs/documents; respondents | Brief, stakeholders, timeline, document extracted text, respondent contributions **sent to AI**; AI outputs returned | `runs`, `experiment_designs`, `intervention_candidates`, `research_findings`, `research_questions` (outputs) | **Anthropic (Claude API)**; Supabase | **Anthropic — US.** **SCCs / Anthropic commercial terms + DPA.** Inputs/outputs **not used to train models**; retention limited `[confirm zero/limited retention config]` | Outputs: life of project; deletable per-project | TLS in transit; server-side only (never client-side); minimised content sent `[confirm]` |
| B4 | **De-identify & maintain shared knowledge base** | Reuse **de-identified** findings across projects to improve analysis | Indirectly, individuals referenced in source findings (intended de-identified) | **De-identified** research findings (intended to contain **no** identifiers post-processing) | `knowledge_base` (Supabase); de-identification via **Anthropic Haiku 4.5** | Anthropic (de-id step); Supabase | **Anthropic — US**, SCCs + DPA (de-id step) | `[Knowledge-base retention — confirm; consider separate lifecycle from source project]` | De-identification before promotion; `[validate de-id quality]`; RLS `[confirm scope of cross-project access]` |
| B5 | **Respondent invitations** | Invite external stakeholders to contribute, per customer instruction | Respondents (external individuals, **no account**) | Invite email, optional name, message content | `project_invitations` (token hashed SHA-256) → **Brevo** for delivery | **Brevo (Sendinblue)**; Supabase | Brevo **EU (France)** `[confirm DPA]` | **Token expires after 30 days**; invitation record retained with project | TLS; **hashed invite tokens (SHA-256)**; tokenized link `/respond/<token>`; RLS |
| B6 | **Collect respondent contributions** | Process respondent input for the analysis | Respondents | Free-text answers, reactions/notes, optional uploads | `project_contributions`, `leverage_reactions` + Storage bucket `documents` (for uploads) | Supabase; (content may flow to Anthropic via B3) | None beyond EU for storage; **US via Anthropic** when analysed (B3) | Retained with the project; deletable by project owner | TLS; RLS; private storage; respondent privacy notice `[confirm]` |
| B7 | **Entitlement / unlock state tied to project content** | Gate reports behind tier / one-off unlock | Customer staff | Plan/tier, unlock state, links to project | `entitlements`, `project_unlocks` | Supabase (billing identifiers also at Stripe — see A3) | None beyond EU `[confirm]` | Life of account / project `[confirm]` | RLS; access control |
| B8 | **Optional Research agent (web search/fetch)** | Enrich analysis via public web, on customer instruction `[confirm opt-in]` | Individuals whose data may appear in egressed queries / fetched content | Query terms (may derive from inputs); fetched public content | `research_questions`, `research_findings` | **Public web / third-party sites** (egress); Anthropic | **Egress to public web (various jurisdictions)** — `[assess + minimise; allow disabling]` | With project | TLS; server-side only; `[curate/limit egressed terms]` |

**Subprocessor list (Record B + shared):** Supabase (hosting, EU), Anthropic (AI inference, US),
Brevo (email, EU/France), Stripe (billing — primarily a Record A subprocessor). **TODO (owner):**
Maintain and publish a current subprocessor list; ensure each has a DPA and (for US) SCCs; give
customers advance notice of subprocessor changes per the DPA.

**Processor obligations to reflect (Art. 28):** act only on documented instructions; confidentiality;
Art. 32 security; subprocessor flow-down + authorization; assist with DSRs (see DSR runbook) and with
Art. 32–36; delete/return data at end of contract; provide audit/inspection support. `[Confirm these
appear in the customer DPA.]`

---

## Cross-cutting security measures (Art. 32) — both records

- **In transit:** TLS.
- **At rest:** Postgres encryption at rest (Supabase default).
- **Tenant isolation:** Row-Level Security (RLS) across all tables.
- **Tokens:** respondent invite tokens stored **hashed (SHA-256)**; 30-day expiry.
- **Secrets:** held server-side in Supabase Edge Function secrets.
- **Auth:** JWT-based authentication.
- **AI:** server-side inference only (never client-side); Anthropic inputs/outputs not used for
  training; retention limited `[confirm]`.
- **Known gaps (do not advertise as present):** no application-level audit log; no documented
  field-level encryption beyond Supabase defaults.

---

## International transfers — summary

| Recipient | Role | Country | Safeguard |
|---|---|---|---|
| Supabase | Hosting / DB / storage / auth | EU (eu-central-1 / eu-west-1) `[confirm]` | EU residency + DPA `[confirm]` |
| Anthropic | AI inference (incl. de-id step) | **US** | **SCCs + commercial terms/DPA**; not used for training; limited retention `[confirm]`; TIA `[recommended]` |
| Stripe | Payments | US `[+ EU ops]` | SCCs + Stripe DPA; PCI-DSS |
| Brevo | Transactional email | EU (France) | `[Brevo DPA]` |
| Google | Analytics / Ads | US | SCCs / Google Ads DPT; consent-gated |
| Microsoft Bookings | Scheduling (marketing) | `[Confirm]` | `[Confirm Microsoft terms]` |

---

## Review & change log

- **Review at least every** `[12 months]` and on any material change (new subprocessor, new data
  category, new transfer, role change).
- **Next review:** `[date]`.

| Date | Version | Change | Author |
|---|---|---|---|
| 2026-06-25 | `[0.1]` | Initial DRAFT scaffold | `[ ]` |

> Cross-references: see `dpia-outline.md` (Art. 35) and `dsr-runbook.md` (DSR handling).
> *Expand with counsel for non-EU regions if the market expands beyond EU/EEA.*
