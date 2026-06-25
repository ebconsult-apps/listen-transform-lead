> **DRAFT — NOT LEGAL ADVICE.** Prepared as a product-specific starting point. It **must be
> reviewed and finalized by qualified legal counsel (EU / Swedish law)** before publication or
> use. Items in `[brackets]` require confirmation. Draft date: 2026-06-25.

# Data Protection Impact Assessment (DPIA) — Outline & Working Draft

**Product:** CLEAR — B2B SaaS behavioural-analysis platform (CLEAR Change Framework)
**Operator / data controller (for in-scope processing):** CLEAR, operated by Erik Bohjort / EB Consulting (`eb-consulting.se`)
**Legal entity / registration / registered address:** `[Legal entity name]` / `[company registration number]` / `[registered address]`
**DPIA owner:** `[Name + role — e.g. Founder / acting DPO]`
**Privacy contact:** `[privacy contact email]` (current verified sender: `erik@eb-consulting.se`)
**DPO appointed?** `[Yes/No — confirm whether Art. 37 mandatory appointment is triggered; if no DPO, name the responsible privacy lead]`
**Status:** DRAFT — internal compliance record
**Legal basis for this document:** GDPR Article 35 (Data Protection Impact Assessment)
**Document version:** `[0.1]`
**Last updated:** 2026-06-25

> **TODO (owner):** This is a scaffold pre-filled from known product facts. Complete every `[bracket]`
> and `TODO` prompt, validate the data-flow description against the live system, and have counsel /
> DPO review before sign-off. Re-run the screening if the product or subprocessor set changes.

---

## 1. Why a DPIA is warranted

A DPIA is required under GDPR Art. 35(1) where processing is "likely to result in a high risk to the
rights and freedoms of natural persons", in particular where new technologies are used. Art. 35(3)
and the EDPB/WP29 guidance (WP248) list criteria; meeting **two or more** strongly indicates a DPIA
is required. CLEAR's processing meets several:

| WP29 / Art. 35(3) criterion | Met? | Why (CLEAR-specific) |
|---|---|---|
| Innovative use / new technology | **Yes** | AI (LLM) analysis engine — Anthropic Claude — applied to free-text and document content. |
| Evaluation / scoring | **Partial** | AI produces structured behavioural analysis (COM-B barriers, APEASE screening, intervention candidates). Not automated decisions about individuals, but evaluative outputs that could reference identifiable people named in inputs. |
| Sensitive / special-category data, or data of a highly personal nature | **Yes (likely)** | Free-text challenge briefs, stakeholder lists and **uploaded documents** may contain special categories (e.g. health, trade-union, etc.) and data about employees/customers/third parties. |
| Data processed on a large scale | `[Assess]` | Depends on customer base and volume. **TODO:** estimate number of data subjects, records, geographic scope, duration. |
| Matching / combining datasets | **Yes** | A **shared `knowledge_base`** reuses de-identified research findings **across projects/customers** — combining/repurposing beyond the original collection context. |
| Data concerning vulnerable data subjects | `[Assess]` | Respondents contribute without an account; employees described in customer documents may be in an imbalance-of-power relationship with the controller-customer. |
| Data about people who are not the user ("other people's data") | **Yes** | Project inputs and documents describe third parties (stakeholders, employees, customers); respondents are external individuals. |
| International transfer to a third country | **Yes** | Content is sent to **Anthropic (US)** for inference. |

**Conclusion (pre-fill):** A DPIA is warranted. The principal high-risk drivers are: (a) AI processing
of (b) other people's free-text/document data that (c) may include special categories, combined with
(d) a cross-project shared knowledge base and (e) a third-country (US) transfer.
**TODO (owner/counsel):** Confirm this conclusion and the "large scale" assessment.

---

## 2. Systematic description of the processing and data flows (Art. 35(7)(a))

### 2.1 Nature, scope, context and purposes

- **Nature:** Collection of a challenge brief + supporting documents + optional respondent input;
  AI-assisted analysis; storage of structured outputs; optional de-identified promotion to a shared
  knowledge base; optional Research agent web search/fetch.
- **Scope:** Categories of data and data subjects listed in §3; subprocessors in §2.3.
- **Context:** B2B SaaS, EU/EEA-first market, English/Swedish. Users are organizations/teams;
  respondents are external stakeholders invited by tokenized link (no account).
- **Purposes:** Diagnose and design behaviour-change interventions for the customer organization;
  account/auth; billing; (separately, as controller) website analytics.

### 2.2 Roles

- **CLEAR as controller:** account, authentication, billing, website-analytics data.
- **CLEAR as processor:** customer project content, target-group personal data, respondent
  contributions — the **customer organization is the controller**. (See ROPA for the split.)

### 2.3 Data flows and storage map

Primary store is **Supabase** (Postgres + Auth + Edge Functions + private Storage), EU region
(eu-central-1 / eu-west-1) `[confirm Supabase DPA + EU residency]`.

| Stage | Where data lives (tables / storage) | Notes |
|---|---|---|
| Account / identity | `profiles`, `workspaces`, `memberships` | Name, email, auth identifiers, privacy-acceptance timestamp + version. |
| Project setup | `projects`, `project_inputs` | Project name, target group, use case, free-text challenge, stakeholders (names+roles), timeline. **Free text may contain third-party personal data.** |
| Documents | `documents` table + private Storage bucket `documents` at `{workspace_id}/{project_id}/{uuid}-{filename}` | Uploaded files + server-extracted text (PDF/DOCX/XLSX/MD/TXT/CSV). May contain employee/customer/financial/health data — customer is controller. |
| Respondent flow | `project_invitations`, `project_contributions`, `leverage_reactions` | Invite email, optional name, free-text answers, reactions/notes, optional uploads. Tokenized link `/respond/<token>`, token expires after 30 days, stored hashed (SHA-256). |
| AI analysis run | `runs`, `experiment_designs`, `intervention_candidates`, `research_findings`, `research_questions` | Inputs sent to Anthropic; structured outputs stored. |
| Shared knowledge | `knowledge_base` | **De-identified** research findings promoted for reuse **across projects** (Haiku 4.5 de-identification step). |
| Entitlements / unlocks | `entitlements`, `project_unlocks` | Plan/tier and one-off report unlock state (links to billing). |
| Billing | Stripe (external) + billing identifiers stored in Supabase | Stripe customer/subscription IDs, plan tier, status. Card data never touches CLEAR servers. |
| Email | Brevo (external) | Respondent invitations + account email: recipient email, name, message content. |
| Analytics | Google Analytics 4 + Google Ads (external) | Pseudonymous events/page views, transient IP, `[hashed email for enhanced conversions]` — **consent-gated** (Consent Mode v2, default denied). |
| AI inference | Anthropic Claude API (external, US) | Brief, stakeholders, timeline, extracted text, respondent contributions sent for analysis; outputs returned. Not used to train models; retention limited `[confirm zero/limited retention config]`. |
| Optional web research | Research agent → public web (web search / fetch) | Egresses queries to the web. Server-side only. `[Assess data minimization of egressed queries]`. |

**TODO (owner):** Insert / attach a data-flow diagram. Confirm exact field lists per table against
the live schema. Confirm whether `research_findings` and `experiment_designs` can contain identifiers
before de-identification into `knowledge_base`.

### 2.4 AI engine specifics

- Engine: Anthropic Claude — **Sonnet 4.6** default (optionally **Opus 4.8**); **Haiku 4.5** used to
  **de-identify** findings before promotion into the shared `knowledge_base`.
- **Inference only; not used to train models** (per Anthropic commercial terms). Server-side only;
  never client-side.
- **EU AI Act:** CLEAR is a **deployer** of a general-purpose AI model (not the provider). Likely
  **not** an Annex III high-risk system (organizational strategy support; not biometric ID, nor
  individual employment/credit decisions) — `[counsel to confirm classification]`. **Art. 50
  transparency** applies: users and respondents should be told outputs are AI-generated.
- Voice dictation: optional browser-local Web Speech API on input fields — only the **transcript
  text** is captured; no audio file recorded or sent to CLEAR servers.

---

## 3. Categories of data and data subjects

**Data subjects:** account holders / workspace members; named third parties inside free-text and
documents (stakeholders, employees, customers); respondents; website visitors.

**Personal-data categories:**
- Account/identity: name, email, auth identifiers, privacy-acceptance timestamp + version.
- Project inputs: project name, target group, use case, free-text challenge, stakeholders, timeline
  (free text may include third parties' data).
- Uploaded documents + extracted text: may include employee/customer/financial/health-related data.
- Respondent data: invite email, optional name, free-text answers, reactions/notes, optional uploads.
- AI outputs: stored generated analysis.
- Billing: Stripe customer/subscription IDs, plan tier, status.
- Analytics: pseudonymous events/page views (consent-gated), transient IP; `[hashed email for
  Google enhanced conversions, consent-gated]`.

**Special categories (Art. 9) / criminal data (Art. 10):** Not intentionally collected, but **may
arrive incidentally** via free text or uploaded documents. **TODO (owner/counsel):** decide policy —
prohibit in AUP, instruct customers not to upload special-category data unless they have an Art. 9
basis, and document the controller-customer's responsibility for it.

---

## 4. Assessment of necessity and proportionality (Art. 35(7)(b))

**TODO (owner/counsel):** Complete each row with a reasoned justification.

| Principle (Art. 5) | How CLEAR meets it (pre-fill) | Gap / TODO |
|---|---|---|
| Lawfulness, fairness, transparency | Privacy Policy + Art. 50 AI-transparency notices to users and respondents; respondent notice at `/respond/<token>`. | `[Confirm respondent-facing notice content + AI disclosure copy]` |
| Purpose limitation | Inputs used to produce the analysis for that project; knowledge_base reuse is limited to **de-identified** findings. | `[Confirm de-identification is sufficient to treat knowledge_base reuse as compatible/aggregated — see §5]` |
| Data minimisation | Free-text and document upload are inherently broad. Mitigation: instruct/limit what to provide; de-identify before sharing. | **Over-collection risk via free text — see §5.** `[Add guidance/UI prompts to discourage unnecessary personal data]` |
| Accuracy | Customer controls input accuracy; AI outputs are **editable**; respondents provide their own input. | AI may produce inaccurate statements about individuals — see §5. `[Define correction path]` |
| Storage limitation | Proposed retention (see §6). | Confirm bracketed periods; build deletion tooling. |
| Integrity & confidentiality | TLS in transit; encryption at rest (Supabase default); Row-Level Security tenant isolation; hashed invite tokens (SHA-256); secrets in Edge Function secrets; JWT auth. | Known gaps: **no application-level audit log**; **no field-level encryption beyond Supabase defaults**. |
| Accountability | This DPIA, ROPA, DSR runbook, DPA with customers, subprocessor list. | `[Confirm customer-facing DPA executed; subprocessor list published]` |

**Lawful basis (for CLEAR-as-controller processing):** see ROPA. For processor processing, lawful
basis is the **customer's** responsibility under their controller role.

**Necessity test (pre-fill):** Each processing operation should be the least-intrusive means to deliver
the analysis. AI inference of free text is core to the product's purpose; the **shared knowledge_base**
is an enhancement, not strictly necessary to deliver a single project — **TODO:** justify its necessity
or treat its data use as opt-in / strictly de-identified.

---

## 5. Risk identification — risks to data subjects (Art. 35(7)(c))

Scoring: **Likelihood** (Low/Med/High) × **Severity** (Low/Med/High) → **Inherent risk** (before
mitigation). **TODO (owner/counsel):** validate each rating.

| # | Risk to data subjects | Source | Inherent likelihood | Inherent severity | Inherent risk |
|---|---|---|---|---|---|
| R1 | **Re-identification via the shared `knowledge_base`** — de-identification (Haiku 4.5) is incomplete or reversible, exposing individuals across unrelated projects/customers. | Cross-project reuse of findings | `[Med]` | `[High]` | `[High]` |
| R2 | **Special-category leakage** — health/union/etc. data enters via free text or uploaded documents without an Art. 9 basis, and is processed / stored / sent to the AI. | Free text + `documents` bucket | `[Med]` | `[High]` | `[High]` |
| R3 | **Third-country transfer to Anthropic (US)** — exposure to US access regimes; transfer lawfulness depends on safeguards. | AI inference egress | `[Med]` | `[Med]` | `[Med]` |
| R4 | **Over-collection via free text** — broad inputs collect more personal data than needed (data-minimisation breach). | `project_inputs`, documents | `[High]` | `[Med]` | `[Med]` |
| R5 | **Respondent data exposure** — invite link mis-shared, token reuse, or contributions visible beyond intended scope. | `project_invitations`, `project_contributions` | `[Low/Med]` | `[Med]` | `[Med]` |
| R6 | **AI inaccuracy affecting individuals** — outputs make inaccurate/unfair statements about named people, influencing organizational decisions. | `runs` / AI outputs | `[Med]` | `[Med]` | `[Med]` |
| R7 | **Cross-tenant data exposure** — RLS misconfiguration leaks one workspace's data to another. | All tables | `[Low]` | `[High]` | `[Med/High]` |
| R8 | **Web-research egress** — Research agent leaks identifiable query terms to the public web/third parties. | Research agent | `[Low/Med]` | `[Med]` | `[Med]` |
| R9 | **No audit log** — inability to detect/prove unauthorized access or to answer "who accessed my data". | Security gap | `[Med]` | `[Med]` | `[Med]` |
| R10 | **Transparency gap** — data subjects (esp. third parties named by the customer, and respondents) unaware their data is processed / AI-analysed (Art. 13/14, Art. 50). | Notice gaps | `[Med]` | `[Med]` | `[Med]` |

**TODO (owner):** Add any further risks (e.g. backup retention, vendor sub-subprocessors, voice-dictation
transcript handling). Confirm whether Art. 14 (data not obtained from the data subject) notice
obligations fall to CLEAR or to the controller-customer for third parties named in inputs.

---

## 6. Mitigations / measures to address the risks (Art. 35(7)(d))

| Risk | Mitigation (pre-fill) | Owner | Status |
|---|---|---|---|
| R1 | De-identify before any promotion to `knowledge_base` (Haiku 4.5 step); validate de-identification quality; consider human review of promoted items; make knowledge-base reuse opt-in or contractually scoped; periodic re-identification testing. | `[ ]` | `[Open]` |
| R2 | AUP/instructions prohibiting upload of special-category data without a lawful basis; UI warnings; option for customer to flag/exclude; ensure DPA places Art. 9 responsibility on controller-customer; consider content scanning. `[Confirm]` | `[ ]` | `[Open]` |
| R3 | **SCCs + Anthropic DPA**; confirm **zero/limited retention** config; transfer impact assessment (TIA); confirm not used for training; minimize content sent. `[Confirm SCC module + TIA on file]` | `[ ]` | `[Open]` |
| R4 | Data-minimisation guidance + UI prompts; per-field help text; encourage de-identified inputs; retention limits; deletion tooling. | `[ ]` | `[Open]` |
| R5 | 30-day token expiry; hashed tokens (SHA-256); RLS scoping of contributions; respondent privacy notice; rate-limit/abuse controls `[confirm]`. | `[ ]` | `[Open]` |
| R6 | Outputs **editable** + human review before action; Art. 50 disclosure that content is AI-generated and may be inaccurate; rectification path (see DSR runbook). | `[ ]` | `[Open]` |
| R7 | RLS on all tables; tenant-isolation tests; `[add automated RLS test coverage]`. | `[ ]` | `[Open]` |
| R8 | Restrict/curate Research-agent queries; server-side only; `[assess and document what is egressed; allow disabling]`. | `[ ]` | `[Open]` |
| R9 | **Recommended follow-up:** implement application-level audit logging. | `[ ]` | `[Recommended]` |
| R10 | Privacy Policy; Art. 50 AI notices to users + respondents; respondent-facing notice at invite; support customer's Art. 14 obligations for third parties. | `[ ]` | `[Open]` |

**Cross-cutting measures already present (Art. 32):** TLS in transit; Postgres encryption at rest
(Supabase default); Row-Level Security; hashed invite tokens (SHA-256); server-side secrets;
JWT auth; EU data residency `[confirm]`. **Known gaps:** no application-level audit log; no documented
field-level encryption beyond Supabase defaults.

---

## 7. Residual-risk assessment

For each risk, record the residual rating **after** mitigations and whether it is acceptable.

| # | Inherent risk | Key mitigation | Residual risk | Acceptable? | Notes |
|---|---|---|---|---|---|
| R1 | `[High]` | De-id + review + opt-in | `[TODO]` | `[TODO]` | |
| R2 | `[High]` | AUP + DPA allocation + warnings | `[TODO]` | `[TODO]` | |
| R3 | `[Med]` | SCCs + DPA + limited retention + TIA | `[TODO]` | `[TODO]` | |
| R4 | `[Med]` | Minimisation guidance + retention | `[TODO]` | `[TODO]` | |
| R5 | `[Med]` | Token expiry + hashing + RLS | `[TODO]` | `[TODO]` | |
| R6 | `[Med]` | Editable outputs + human review | `[TODO]` | `[TODO]` | |
| R7 | `[Med/High]` | RLS + tests | `[TODO]` | `[TODO]` | |
| R8 | `[Med]` | Query curation | `[TODO]` | `[TODO]` | |
| R9 | `[Med]` | Audit logging (follow-up) | `[TODO]` | `[TODO]` | |
| R10 | `[Med]` | Notices + AI transparency | `[TODO]` | `[TODO]` | |

**Overall residual risk (pre-fill):** `[TODO — Low / Medium / High]`.
**Prior-consultation trigger (Art. 36):** If, after mitigation, residual risk remains **high**, CLEAR
must consult the supervisory authority (**IMY — Integritetsskyddsmyndigheten**, Sweden) **before**
processing. **TODO (owner/counsel):** confirm whether Art. 36 consultation is required.

---

## 8. Consultation and sign-off (Art. 35(2), 35(9), 36)

- **DPO advice sought (Art. 35(2)):** `[Yes/No — record DPO opinion, or note no DPO appointed and why]`.
- **Views of data subjects (Art. 35(9)):** `[Sought? If not, record justification]`.
- **Subprocessor due diligence reviewed:** Supabase, Anthropic, Stripe, Brevo, Google `[+ Microsoft
  Bookings for marketing site]` — `[confirm DPAs on file]`.
- **Supervisory authority consultation (Art. 36):** `[Required? Date if applicable]`.

| Role | Name | Decision | Date | Signature |
|---|---|---|---|---|
| DPIA owner | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| DPO / privacy lead | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| Legal counsel (EU/SE) | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| Approver (business owner) | `[ ]` | `[ ]` | `[ ]` | `[ ]` |

**Decision (pre-fill):** `[Proceed / Proceed with conditions / Do not proceed]` — record conditions.

---

## 9. Review cadence

- **Review at least every** `[12 months]`, and **whenever** there is a material change: new
  subprocessor, new data category, new AI model/capability, change to the shared knowledge base,
  a new transfer destination, or a relevant personal-data breach.
- **Next scheduled review:** `[date]`.
- **Change log:** maintain below.

| Date | Version | Change | Author |
|---|---|---|---|
| 2026-06-25 | `[0.1]` | Initial DRAFT scaffold | `[ ]` |

---

## 10. Open items checklist (for the owner)

- [ ] Confirm legal entity, registration number, registered address, privacy contact email.
- [ ] Confirm DPO appointment status and Art. 35(2) advice.
- [ ] Estimate scale (data subjects / records / geography / duration) for the Art. 35 trigger.
- [ ] Validate the data-flow description and field lists against the live schema; attach a diagram.
- [ ] Confirm Supabase EU residency + DPA; Anthropic SCCs + DPA + limited/zero retention + TIA.
- [ ] Decide and document special-category-data policy (AUP, DPA allocation, warnings).
- [ ] Validate de-identification quality for `knowledge_base`; decide opt-in vs default.
- [ ] Finalize residual ratings and the Art. 36 prior-consultation decision.
- [ ] Confirm EU AI Act classification (deployer; Annex III high-risk: no `[confirm]`) + Art. 50 notices.
- [ ] Obtain sign-offs; set next review date.

> Cross-references: see `ropa.md` (Art. 30 records) and `dsr-runbook.md` (data-subject-request handling).
> *Expand with counsel for non-EU regions if the market expands beyond EU/EEA.*
