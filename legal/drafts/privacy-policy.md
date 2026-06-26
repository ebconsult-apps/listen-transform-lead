> **DRAFT — NOT LEGAL ADVICE.** Prepared as a product-specific starting point. It **must be
> reviewed and finalized by qualified legal counsel (EU / Swedish law)** before publication or
> use. Items in `[brackets]` require confirmation. Draft date: 2026-06-25 · counsel-review fill-in
> pass: 2026-06-26 (proposed defaults filled; true business/legal facts still bracketed).

# CLEAR — Privacy Policy

**Effective date:** `[set on publication]` — this draft prepared **26 June 2026**
**Version:** `2026-06-26` (kept in sync with `PRIVACY_POLICY_VERSION` in the app)

This Privacy Policy explains how personal data is collected and processed in connection with
**CLEAR**, a self-serve B2B behavioral-analysis platform that helps organizations diagnose and
design behaviour-change interventions using the CLEAR Change Framework
(Clarify → Leverage → Experiment → Analysis → Refinement).

It is written to the EU/EEA baseline (the **GDPR**, the ePrivacy rules on cookies and similar
technologies, EU consumer law, and the EU AI Act). For other regions (e.g. UK, US, Canada),
**expand with counsel** before relying on this policy.

---

## At a glance

> A short, plain-language summary to orient you. **It does not replace the full policy below and has
> no separate legal effect.**
>
> - **Two roles.** We are the **controller** for your *account, log-in and billing* data and our
>   *website analytics*. We are a **processor** for the *content you put into a project* — there your
>   organization is the controller and decides what happens to that data (Section 2).
> - **AI.** Your project content is analyzed by **Anthropic's Claude** for **inference only**. It is
>   **not used to train AI models**, and we send the model only what is needed (Section 6).
> - **Where your data lives.** Application data is **hosted in the EU/EEA**; the **AI-inference step
>   runs in the US** under EU Standard Contractual Clauses (Section 8).
> - **Your choices.** Non-essential cookies load **only if you consent**, and you can withdraw consent
>   at any time (Section 9). You can exercise your GDPR rights with us, or — for project content —
>   with the customer that controls it (Section 11).
> - **No sale.** We do **not** buy or sell your personal data.

## Contents

1. [Who we are (data controller)](#1-who-we-are-data-controller)
2. [Controller vs processor](#2-controller-vs-processor--who-decides-what-happens-to-your-data)
3. [Categories of personal data we process](#3-categories-of-personal-data-we-process)
4. [Why we process it, and our legal bases](#4-why-we-process-it-and-our-legal-bases-gdpr-art-6)
5. [Special categories of personal data](#5-special-categories-of-personal-data-gdpr-art-9)
6. [How we use AI](#6-how-we-use-ai)
7. [Subprocessors](#7-subprocessors)
8. [International data transfers](#8-international-data-transfers)
9. [Cookies, analytics and consent](#9-cookies-analytics-and-consent)
10. [How long we keep data (retention)](#10-how-long-we-keep-data-retention)
11. [Your rights](#11-your-rights)
12. [Respondents](#12-respondents)
13. [Security](#13-security-gdpr-art-32)
14. [Children](#14-children)
15. [Changes to this policy & versioning](#15-changes-to-this-policy--versioning)
16. [Contact / how to make a privacy request](#16-contact--how-to-make-a-privacy-request)

---

## 1. Who we are (data controller)

CLEAR is operated by **Erik Bohjort**, trading as **EB Consulting** (`eb-consulting.se`), a
psychology-led consultancy based in **Stockholm, Sweden**.

| Field | Detail |
|---|---|
| Service / trading name | CLEAR |
| Operator | Erik Bohjort / EB Consulting |
| Legal entity name | `[legal entity name — to confirm]` |
| Company registration number | `[company registration / org. number — to confirm]` |
| Registered address | `[registered address — to confirm]` |
| Privacy / contact email | `erik@eb-consulting.se` (verified sender) `[a dedicated `privacy@eb-consulting.se` alias is recommended]` |
| Website | `eb-consulting.se` `[confirm CLEAR product domain]` |

**Data Protection Officer (DPO):** We have **not appointed a DPO**. A DPO is not mandatory for
CLEAR's processing under GDPR Art. 37 (our core activity is not large-scale systematic monitoring,
nor large-scale processing of special-category data). For any privacy matter, contact us at the
email above. `[Counsel to confirm a DPO is not required given the scale and nature of processing.]`

**EU/EEA representative:** **Not required** — the operator is established in the EU/EEA (Sweden); an
Art. 27 representative is only relevant for controllers established outside the EU/EEA.

Throughout this policy, **"we", "us", "CLEAR"** refer to the operator above; **"you"** refers to
the individual whose personal data is processed; **"customer"** refers to the organization that
holds a CLEAR account.

---

## 2. Controller vs processor — who decides what happens to your data

CLEAR plays **two different roles** depending on the data, and this matters for your rights and
for who is responsible.

- **CLEAR is the _controller_** (we decide the purposes and means) for:
  - **Account & identity data** — the people who sign up and use CLEAR;
  - **Authentication data** — log-in and session security;
  - **Billing data** — subscriptions and one-off purchases;
  - **Website analytics** — consent-based measurement of how our site is used.

  For this data, **this Privacy Policy is the controlling notice** and you can exercise your
  rights directly against us (Section 11).

- **CLEAR is a _processor_** (we act on the customer's instructions) for the **content a customer
  puts into the platform** to obtain an analysis, namely:
  - the customer's **project content** (challenge brief, stakeholders, timeline, use case, free-text inputs);
  - **target-group personal data** contained in that content or in uploaded documents;
  - **respondent contributions** collected via invited respondents.

  Here, the **customer organization is the controller** of that data and decides why and how it is
  processed. CLEAR processes it **only to provide the service** and on the customer's documented
  instructions. The customer's own privacy notice — not this one — governs how that data is used,
  and data-subject requests about that content should be directed to the **customer** (we will
  assist the customer as their processor). The terms of this processor relationship are set out in
  a **Data Processing Agreement (DPA)** between CLEAR and the customer (GDPR Art. 28) — see the
  **[Data Processing Agreement](./data-processing-agreement.md)**. `[Finalize the DPA before relying on it.]`

In plain terms: **we control the data about _our customers and our website_; our customers control
the data they _bring into their projects_, and we just process it for them.**

---

## 3. Categories of personal data we process

| Category | Examples | Our role |
|---|---|---|
| **Account / identity** | Name, email address, authentication identifiers, and the timestamp + version of your acceptance of this Privacy Policy | Controller |
| **Project inputs** | Project name, target group, use case, free-text **challenge** description, **stakeholders** (names + roles), timeline. *Free-text fields may contain personal data about third parties.* | Processor (customer is controller) |
| **Uploaded documents & extracted text** | Files you upload (PDF, DOCX, XLSX, MD, TXT, CSV) and the text our server extracts from them. *These may contain employee, customer, financial or health-related information chosen by the customer.* | Processor (customer is controller) |
| **Respondent data** | A respondent's invite email, optional name, free-text answers, reactions/notes, and any optional uploads they provide | Processor (customer is controller) |
| **AI outputs** | The structured analysis generated for a project (objectives, systems maps, COM-B/APEASE analysis, intervention candidates, experiment designs) | Processor (stored on the customer's behalf) |
| **Voice dictation (transcript only)** | If you use the optional in-browser dictation on input fields, **only the resulting transcript text** is captured into the field. The Web Speech API runs in your browser; **no audio file is recorded or sent to CLEAR servers.** | Same role as the field being filled |
| **Billing** | Stripe customer ID, subscription ID, plan tier and status, billing contact. *Card/payment details are handled by Stripe and never reach CLEAR servers.* | Controller |
| **Enquiry / marketing** | When you submit a contact, consultation, assessment, booking or whitepaper form on our website: the details you provide — typically name, email, organisation, role and message. | Controller |
| **Website analytics** | Pseudonymous usage events and page views, transient IP address. *If/when Google Ads goes live, a hashed email may be sent for "enhanced conversions" — **not active today** (the Google Ads tag is not yet configured; see the Cookie Policy).* **All consent-gated.** | Controller |

We do not buy personal data about you, and we do not sell your personal data.

---

## 4. Why we process it, and our legal bases (GDPR Art. 6)

| Processing | Purpose | Legal basis (Art. 6(1)) |
|---|---|---|
| Creating and operating your account; authentication | Provide the service you signed up for; keep your account secure | **(b) Contract** (and **(f) legitimate interests** for security) |
| Running CLEAR analyses on the content you submit | Deliver the core product feature you request | **(b) Contract** with the customer. *For personal data of third parties inside that content, the **customer** is the controller and relies on its own legal basis; CLEAR acts as processor on the customer's instructions.* |
| Collecting respondent contributions | Let invited respondents contribute to a project | The **customer (controller)** relies on its own basis — typically **(f) legitimate interests** or **(a) consent** of the respondent. CLEAR processes as processor. |
| Billing, subscriptions and one-off unlocks | Take payment and manage your plan | **(b) Contract** |
| Keeping accounting/billing records | Comply with statutory bookkeeping duties | **(c) Legal obligation** (Swedish Bookkeeping Act / *Bokföringslagen*) |
| Service emails (account, respondent invitations sent on the customer's behalf) | Operate the service and deliver transactional messages | **(b) Contract** and/or **(f) legitimate interests** |
| Responding to website enquiries / sending updates you request | Answer your contact, consultation, assessment, booking or whitepaper request | **(a) Consent** and/or **(f) legitimate interests** in responding to you |
| Security, abuse prevention, service improvement, defending legal claims | Protect users and the platform; run the business | **(f) Legitimate interests** (balanced against your rights) |
| **Website analytics and advertising measurement** (GA4, Google Ads) | Understand site usage and measure ad effectiveness | **(a) Consent** — see Section 9 of this policy and the **Cookie Policy**. No non-essential cookie or tracker loads until you consent. |

Where we rely on **legitimate interests (f)**, you can ask for our balancing assessment and you
have the right to object (Section 11). Where we rely on **consent (a)**, you can withdraw it at any
time without affecting processing already carried out.

---

## 5. Special categories of personal data (GDPR Art. 9)

CLEAR is a tool for **organizational strategy and behaviour change**. **We do not intend or require
the processing of special-category data** (e.g. data revealing health, racial or ethnic origin,
political opinions, religious beliefs, trade-union membership, genetic or biometric data, or data
concerning sex life or sexual orientation), and we do not ask for it.

- **Customers must not upload or enter special-category data** into project briefs, documents,
  free-text fields or respondent flows **unless they have their own valid lawful basis** under
  GDPR Art. 9 **and** instruct us accordingly. Any such processing is performed by CLEAR strictly
  as a **processor on the customer's documented instructions**.
- Under our terms / DPA, the **customer warrants** that it has a lawful basis for all personal data
  (including any special categories) that it introduces into the platform, and that it has provided
  all required notices to, and obtained any required consents from, the relevant individuals. This
  warranty is set out in the **[DPA](./data-processing-agreement.md)** (§13) and the
  **[Acceptable Use Policy](./acceptable-use-policy.md)** (§3). `[Counsel to confirm final wording.]`

If you believe special-category data has been entered without a proper basis, contact the relevant
customer (controller) or us (Section 11).

---

## 6. How we use AI

CLEAR's analysis is produced with the help of **Anthropic's Claude** large-language models, used
for **inference only**.

- **Models:** Claude **Sonnet** by default, with **Opus** optionally available; **Claude Haiku** is
  used to **de-identify** research findings before any of them are promoted into a **shared
  knowledge base** that can be reused across projects. Promotion is **not automatic**: a project
  owner reviews and approves each finding, and the de-identification step is **designed to** strip
  personal identifiers before content is reused beyond its original project. Because de-identification
  is performed by an automated model, we apply this owner-review step as a safeguard but **cannot
  guarantee** that every identifier is removed in every case.
  `[Confirm the de-identification scope and the owner-review step, and validate de-identification
  quality so that no directly identifying data reaches the shared knowledge base.]`
- **No model training on your data.** Under Anthropic's commercial terms, the inputs we send and
  the outputs returned are **not used to train Anthropic's models**, and retention by Anthropic is
  limited. `[Confirm zero/limited-retention configuration with Anthropic.]`
- **What is sent for analysis:** the relevant project brief, stakeholders, timeline, document
  extracted text and respondent contributions are sent to the model to generate the analysis;
  outputs are stored against the project. This processing is **server-side only** — never from your
  browser.
- **Optional web research.** A project owner can enable a Research agent that performs **web search
  / web fetch**. When enabled, search queries (which may include text derived from your project)
  are **egressed to the public web / third-party search and content providers**. This is optional
  and server-side only. `[Confirm which search/fetch providers are used and disclose them in
  ./subprocessors.md.]`

### AI transparency (EU AI Act, Art. 50)

CLEAR is a **deployer** of a general-purpose AI model (we are not the model's provider). To the
best of our current assessment, CLEAR is **likely not** an Annex III "high-risk" AI system — it
supports organizational strategy and does not perform biometric identification or make automated
individual decisions about employment, creditworthiness or similar.
`[Counsel to confirm AI Act classification.]`

**You should know:**

- **Outputs are AI-generated.** Analyses, recommendations and experiment designs are produced by an
  automated system.
- **They may be inaccurate or incomplete** and can reflect the limitations or biases of the
  underlying model.
- **Human review is required.** CLEAR outputs are decision-support, not professional, legal,
  medical or financial advice, and should be **reviewed and validated by a competent person**
  before being acted upon.
- **No solely-automated decisions with legal/significant effect** are made about individuals by
  CLEAR (GDPR Art. 22). `[Confirm this remains true for any future features.]`

Respondents are given an equivalent AI-transparency notice at the point of contribution
(Section 12).

---

## 7. Subprocessors

To run CLEAR we use a small number of vetted **subprocessors** (service providers that may process
personal data on our behalf), each under appropriate data-processing terms. They include our
hosting/database/auth provider, the AI inference provider, the payments provider, the transactional
email provider, and (for our website only) analytics/advertising and scheduling providers.

A current, itemized list — with each provider's role, the data it processes, its location and the
transfer safeguard — is maintained in **[Subprocessors](./subprocessors.md)**.
`[Keep ./subprocessors.md in sync; notify customers of material changes per the DPA.]`

---

## 8. International data transfers

We aim to keep application data **hosted and processed within the EU/EEA**. Our primary hosting,
database, authentication and document storage run in an **EU region**, and our transactional email
provider is **EU-based**.

The most significant transfer outside the EU/EEA concerns AI inference: our AI inference provider,
**Anthropic, is established in the United States**, so the content sent for analysis (Section 6) is
**transferred to the US**. That transfer
is protected by the **EU Standard Contractual Clauses (SCCs)** together with Anthropic's commercial
terms and Data Processing Agreement, plus supplementary measures as appropriate.
`[Confirm SCCs/DPA on file; complete a transfer-impact assessment.]` Where the optional web-research
feature is used, queries may also reach search/content providers outside the EU/EEA under
appropriate safeguards. `[Confirm.]`

**Reconciling our "processed in the EU" statement:** our *storage and core processing* are in the
EU/EEA; the **AI inference step is the exception**, performed in the US under SCCs. We describe it
this way so the position is accurate and not over-stated. Other subprocessors that are US-based
(e.g. payments, website analytics/advertising) likewise rely on **SCCs / EU data-processing terms**
— see **[Subprocessors](./subprocessors.md)**. You can request a copy of the relevant safeguards
(Section 11).

---

## 9. Cookies, analytics and consent

Our website uses cookies and similar technologies. **Strictly-necessary** cookies/storage are used
to run the site and remember your consent choice. **Analytics (Google Analytics 4)** and
**advertising (Google Ads)** trackers are **non-essential** and load **only after you consent**.

We use **Google Consent Mode v2**, which **defaults all analytics and advertising signals to
"denied"** until you opt in. You can change or withdraw consent at any time — **withdrawing is as
easy as giving it** — using the **"Cookie settings"** control in the site/app footer, which reopens
the consent banner.

Full details — categories, the specific trackers, durations, and how to change your choice — are in
the separate **[Cookie Policy](./cookie-policy.md)**.

---

## 10. How long we keep data (retention)

The periods below are **proposed defaults** and are subject to confirmation.

| Data | Retention | Notes |
|---|---|---|
| Account + project data | Kept for the life of the account; deleted within **30 days** of account closure | Backups purged within **90 days** |
| Uploaded documents + AI outputs | Same lifecycle as their project | Deletable per-project by the project owner at any time |
| Respondent invitations | **Invite token expires after 30 days** | Contributions are retained with the project and are deletable by the project owner |
| Website analytics (GA4) | **14 months** | See the Cookie Policy |
| Billing / accounting records | **7 years** | Required by the Swedish Bookkeeping Act (*Bokföringslagen*) — applies even after account closure |

When a retention period ends, data is deleted or irreversibly anonymized. For customer project
content, the **customer (controller)** may set shorter or different periods in its own instructions.
`[Confirm all periods with counsel and the business.]`

---

## 11. Your rights

Where CLEAR is the **controller** (account, authentication, billing, website analytics), you have
the following rights under the GDPR, which you can exercise against us directly:

- **Access** — get confirmation of, and a copy of, your personal data;
- **Rectification** — correct inaccurate or incomplete data;
- **Erasure** ("right to be forgotten") — have your data deleted where the conditions apply;
- **Restriction** — limit how we process your data in certain cases;
- **Data portability** — receive data you provided in a structured, commonly used, machine-readable
  format, and have it transmitted to another controller where technically feasible;
- **Objection** — object to processing based on legitimate interests, and to any direct marketing;
- **Withdraw consent** — where we rely on consent (e.g. analytics/advertising), withdraw it at any
  time without affecting prior lawful processing.

Where CLEAR is a **processor** (customer project content, target-group data, respondent
contributions), please direct your request to the **customer organization that controls that data**;
we will support that customer in responding, as required by our DPA.

**How to exercise your rights.** Contact us at **`erik@eb-consulting.se`** (Section 16). We may
need to verify your identity. We aim to respond **within one month** of receiving a valid request
(extendable by two further months for complex requests, with notice), as provided by the GDPR.
There is normally no fee. `[Internal: assign an owner + intake address and operationalize the
data-subject-request process (see the DSR runbook) before launch.]`

**Right to complain.** If you are unhappy with how your personal data is handled, you can lodge a
complaint with your local supervisory authority. In Sweden this is the **Swedish Authority for
Privacy Protection (IMY — Integritetsskyddsmyndigheten)**:

> IMY — Integritetsskyddsmyndigheten
> Box 8114, 104 20 Stockholm, Sweden
> `imy@imy.se` · `www.imy.se`

You may also complain to the supervisory authority in your EU/EEA country of residence or work.

---

## 12. Respondents

Respondents are external stakeholders invited by a project owner via a **tokenized link**
(`/respond/<token>`). Respondents contribute **without creating an account**; invite tokens
**expire after 30 days**.

- The **customer (project owner) is the controller** of respondent data; CLEAR processes it as a
  **processor**. The respondent's relationship is primarily with the inviting organization.
- We process a respondent's **invite email, optional name, free-text answers, reactions/notes and
  any optional uploads** solely to record their contribution to the project and to produce the
  analysis (Section 6).
- **Just-in-time notice.** The respondent portal **presents** a short notice **at the point of
  contribution** explaining: who is collecting the data (the inviting organization) and that CLEAR
  processes it on their behalf; what is collected and why; that an **AI system** is used to analyze
  contributions and that **outputs are AI-generated and human-reviewed**; how long data is kept; and
  how to exercise rights or object.
- Respondents can exercise their rights (Section 11) primarily with the **inviting organization**;
  CLEAR will assist as processor.

---

## 13. Security (GDPR Art. 32)

We take appropriate technical and organizational measures to protect personal data, including:

- **Encryption in transit** (TLS) and **encryption at rest** for the database (provider default);
- **Tenant isolation** via database **Row-Level Security** across application tables;
- **Hashed respondent invite tokens** (SHA-256) rather than storing them in clear text;
- **Server-side secret management** (secrets held in serverless function secrets, not in client code);
- **JWT-based authentication** for sessions.

We continually review our measures. `[Note for internal roadmap, not for publication as a present
feature: there is currently no application-level audit log and no documented field-level encryption
beyond the hosting provider's defaults. Do not advertise these as in place.]`

No method of transmission or storage is completely secure; we cannot guarantee absolute security.
We maintain processes to detect and respond to personal-data breaches and will notify the
supervisory authority and affected individuals where the GDPR requires. `[Confirm breach-response
process and notification responsibilities between CLEAR and customers in the DPA.]`

---

## 14. Children

CLEAR is a **B2B service intended for organizations and their staff**. It is **not directed to
children** and is intended for users aged **18+** (as stated in the
**[Terms of Service](./terms-of-service.md)** §1). We do not knowingly collect personal data
from children. Customers must not use CLEAR to process children's personal data without their own
appropriate lawful basis and safeguards. `[B2B service with no technical age-gate — counsel to confirm acceptable.]`

---

## 15. Changes to this policy & versioning

We may update this Privacy Policy from time to time. The **version** and **effective date** appear
at the top. When we make material changes, we will take reasonable steps to inform you (for example,
in-app notice or email) and, where appropriate, **re-prompt acceptance**.

The current policy version is recorded in the application (`PRIVACY_POLICY_VERSION`) and the
**timestamp + version** of your acceptance is stored on your profile, so we can detect when a newer
version requires re-acceptance. `[Keep the published version string and the in-app version in
sync.]`

### Version history

| Version | Effective date | Summary of changes |
|---|---|---|
| `2026-06-25` | — (unpublished draft) | Initial draft. |
| `2026-06-26` | `[set on publication]` | Counsel-review pass: added the at-a-glance summary, table of contents and this version history; clarified the AI de-identification / shared-knowledge-base wording, the international-transfer statement and cookie-consent withdrawal; added the enquiry/marketing data category; filled the retention (30 / 90 days, 14 months) and age (18+) defaults. |

`[Add a new row each time the policy materially changes, and keep the latest version string in sync
with `PRIVACY_POLICY_VERSION` in the app.]`

---

## 16. Contact / how to make a privacy request

For any privacy question or to exercise your rights:

- **Email:** `erik@eb-consulting.se` (verified sender)
- **Operator:** Erik Bohjort / EB Consulting, Stockholm, Sweden
- **Postal address:** `[registered address — to confirm]`
- **DPO:** None appointed — see Section 1; contact us at the email above.

You can also lodge a complaint with the Swedish DPA (**IMY**) or your local EU/EEA supervisory
authority (Section 11).

---

*Related documents:* **[Subprocessors](./subprocessors.md)** · **[Cookie Policy](./cookie-policy.md)** · **[Data Processing Agreement](./data-processing-agreement.md)** · **[Terms of Service](./terms-of-service.md)**
