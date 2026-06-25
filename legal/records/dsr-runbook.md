> **DRAFT — NOT LEGAL ADVICE.** Prepared as a product-specific starting point. It **must be
> reviewed and finalized by qualified legal counsel (EU / Swedish law)** before publication or
> use. Items in `[brackets]` require confirmation. Draft date: 2026-06-25.

# Data-Subject Request (DSR) Runbook — INTERIM MANUAL PROCESS

**Product:** CLEAR — B2B SaaS behavioural-analysis platform
**Operator:** CLEAR / Erik Bohjort / EB Consulting (`eb-consulting.se`)
**Privacy contact:** `[privacy contact email]` (current verified sender: `erik@eb-consulting.se`)
**Supervisory authority:** **IMY — Integritetsskyddsmyndigheten** (Sweden)
**Status:** DRAFT — internal compliance record · **Version:** `[0.1]` · **Updated:** 2026-06-25

> **INTERIM NOTICE.** The CLEAR application currently has **no self-service export or erasure
> feature**. Until automated endpoints exist, **all data-subject requests are handled manually** using
> this runbook. **Building automated DSR tooling (export + erasure across all tables and the
> `documents` storage bucket, plus a deletion-from-subprocessor workflow) is a strongly recommended
> follow-up** and should be tracked as a roadmap item.

---

## 1. Scope — the rights covered

This runbook covers the data-subject rights under GDPR:

| Right | Article | Summary |
|---|---|---|
| Access | Art. 15 | Confirmation + copy of personal data + information about the processing. |
| Rectification | Art. 16 | Correct inaccurate / complete incomplete data. |
| Erasure ("right to be forgotten") | Art. 17 | Delete data where grounds apply. |
| Restriction | Art. 18 | Temporarily limit processing (e.g. while accuracy is contested). |
| Portability | Art. 20 | Provide data the subject gave us, in a structured, machine-readable format. |
| Objection | Art. 21 | Object to processing based on legitimate interests / direct marketing. |
| Withdraw consent | Art. 7(3) | Withdraw consent (e.g. analytics cookies) as easily as it was given. |
| (Related) Automated decisions | Art. 22 | CLEAR does **not** make solely-automated decisions with legal/similar effect `[confirm]`; AI outputs are editable and human-reviewed. |

---

## 2. The most important rule first — Controller vs Processor routing

CLEAR has a **dual role** (see ROPA / Privacy Policy):

- **CLEAR is the CONTROLLER** for: **account, authentication, billing, website-analytics** data.
  → CLEAR **handles the request directly**.
- **CLEAR is a PROCESSOR** for: **customer project content** (briefs, documents, target-group data)
  and **respondent contributions**. The **customer organization is the controller**.
  → CLEAR **must NOT unilaterally action** access/erasure/etc. on this data. Instead:
  1. **Forward** the request to the relevant **customer (controller)** without undue delay.
  2. **Assist** the controller in responding (Art. 28(3)(e)) — locate, extract, correct or delete the
     data **on the controller's documented instruction**.
  3. Do **not** disclose another controller's data to a requester directly.

**Routing decision (do this first for every request):**

```
Is the requested data account / auth / billing / website-analytics data?
   → YES: CLEAR is controller → handle directly (Sections 4–11).
   → NO (it is project content / documents / respondent contributions):
        CLEAR is processor → forward to the customer-controller + assist (Section 3).
   → MIXED: split the request — handle the controller part directly,
            forward the processor part. Document both.
```

**Special case — respondents.** A respondent contributes to a **customer's** project via
`/respond/<token>`. Their contribution data is **processor data** (customer is controller). Their
**invite email/name** held to deliver the invite is processed on the customer's instruction too.
Route respondent requests to the **project-owner customer** and assist, unless counsel advises CLEAR
holds an independent controller relationship `[confirm]`.

**TODO (owner/counsel):** Confirm the exact controller/processor line for the respondent invite email,
and confirm DPA wording obliging customers to relay/cooperate on DSRs.

---

## 3. Processor path — forwarding & assisting the customer-controller

1. Acknowledge to the requester that CLEAR processes the data **on behalf of a customer** and that the
   request is being routed to the controller (do not reveal customer identity if that itself would
   disclose personal data inappropriately — `[confirm wording with counsel]`).
2. Identify the controlling customer (by workspace/project).
3. Notify the customer's account owner / privacy contact **without undue delay**, with the request
   details and the statutory clock.
4. On the customer's **documented instruction**, perform the technical action (extract / correct /
   delete / restrict) using the data-location map in Section 12.
5. Log everything (Section 13). Provide the customer evidence of completion.
6. Do not respond substantively to the data subject on the controller's behalf unless the controller
   asks CLEAR to.

---

## 4. Identity verification (do this before actioning ANY request)

Verify the requester is who they claim to be, **proportionately** (Art. 12(6)); do not collect
excessive new data just to verify.

- **Account holder / workspace member:** require the request to come from, or be confirmed via, the
  **registered account email** (e.g. send a confirmation link/code to the address on file in
  `profiles`). Prefer verifying control of the account email over collecting ID documents.
- **Respondent (no account):** verify control of the **invite email** used for the contribution;
  match against `project_invitations`. Note tokens expire after 30 days.
- **Website visitor (analytics/consent):** typically self-served via consent controls; for GA data,
  verification is limited — `[document approach; much analytics data is pseudonymous and may not be
  identifiable to a named person without additional info (Art. 11)]`.
- **If identity cannot be verified** and there is reasonable doubt, you may request additional info
  (Art. 12(6)); if still unverified, you may refuse and must explain (record the reason).
- **Avoid over-collection:** delete verification artefacts (e.g. ID copies, if ever used) once
  verification is complete `[confirm policy]`.

**TODO (owner/counsel):** Approve the exact verification standard, especially whether/when any ID
document is acceptable, and the GA/consent verification approach.

---

## 5. Statutory timeline (applies to every request)

- **Respond within 1 month** of receipt (Art. 12(3)).
- **Extendable by a further 2 months** where complex or numerous — but you must **inform the requester
  of the extension and the reasons within the first month**.
- **Acknowledge promptly** (best practice: within `[72 hours]`).
- **No fee** normally (Art. 12(5)); a reasonable fee or refusal is possible only for **manifestly
  unfounded or excessive** requests — document the justification.
- If you do **not** act on a request, inform the requester **within 1 month**, with reasons and their
  right to complain to **IMY** and to a judicial remedy.

**Clock starts** at receipt (or, where identity verification is needed, `[on receipt — confirm whether
clock pauses pending verification; default: treat as running and verify promptly]`).

---

## 6. Right of access (Art. 15)

1. Route (Section 2) + verify (Section 4).
2. **Controller data:** compile a copy of the person's account/auth/billing data and the Art. 15(1)
   information (purposes, categories, recipients/subprocessors, retention, rights, source, transfers
   incl. **Anthropic US** safeguards). Use the location map (Section 12).
3. **Processor data:** forward to the customer-controller and assist (Section 3).
4. Provide the copy securely (e.g. to the verified account email) in a commonly used electronic form.
5. **Do not disclose other people's personal data** — redact third parties named in free text /
   documents (Art. 15(4)).
6. Log (Section 13) and respond within the timeline (Section 5).

---

## 7. Right to rectification (Art. 16)

1. Route + verify.
2. **Controller data:** correct fields in `profiles` / `workspaces` / billing identifiers; if the
   error originated at Stripe/Brevo, correct there too.
3. **Processor data (project inputs/documents/respondent input):** forward to / instruct by the
   customer-controller; on instruction, edit `project_inputs`, replace/annotate `documents`, or
   correct `project_contributions`.
4. **AI outputs:** outputs are **editable** — correct the stored analysis where it contains inaccurate
   personal data; note that historical AI text is generated and may be regenerated.
5. Where feasible, **notify recipients** of the correction (Art. 19).
6. Log + respond.

---

## 8. Right to erasure (Art. 17)

1. Route + verify. Check for **exemptions** before deleting (Art. 17(3)): e.g. **billing/accounting
   records must be kept 7 years** (Swedish Bookkeeping Act) — these are **retained, not erased**;
   legal claims; etc.
2. **Controller data:** delete account/identity data per the location map; honour proposed timelines
   (delete within `[30]` days; backups purged within `[90]` days).
3. **Processor data:** **do not unilaterally delete** — forward to the customer-controller and delete
   **on their instruction** (or note the project owner can already delete projects/documents
   themselves). Respondent contributions are deletable by the project owner.
4. **Across systems (see Section 12):** delete from Supabase tables **and** the `documents` Storage
   bucket; trigger deletion at **Brevo** (email logs/contacts) and request deletion/closure at
   **Stripe** subject to the 7-year retention; for **Anthropic**, content is processed transiently
   for inference and **not retained for training** — `[confirm zero/limited retention so no separate
   deletion is required; if any retention exists, raise a deletion request per Anthropic's process]`;
   for **Google**, remove/reset analytics identifiers as far as supported and rely on consent
   withdrawal + GA retention controls.
5. **Backups:** flag the deletion for the next backup-purge cycle (`[90]` days) — document that data
   in immutable backups is isolated and purged on schedule.
6. **knowledge_base:** if any identifiable trace of the person could remain post-de-identification,
   locate and remove it `[confirm de-id removes identifiers; otherwise search and purge]`.
7. Notify recipients where feasible (Art. 19). Log + respond.

---

## 9. Right to restriction (Art. 18)

1. Route + verify.
2. Implement restriction by **marking the records** so they are stored but not further processed
   (e.g. flag the project/contribution; suspend inclusion in new AI runs and in `knowledge_base`).
   `[No native "restrict" flag exists yet — interim: document a manual hold; recommended follow-up:
   add a restriction flag.]`
3. **Processor data:** action on the customer-controller's instruction.
4. Inform the requester **before** lifting any restriction (Art. 18(3)).
5. Log + respond.

---

## 10. Right to data portability (Art. 20)

1. Route + verify. Applies to data the **subject provided** and processed by **consent or contract**
   by **automated means**.
2. **Controller data:** export the person's provided account data in a **structured, machine-readable
   format** (e.g. JSON/CSV).
3. **Processor data:** the customer-controller owns the portability obligation; assist on instruction.
4. Where technically feasible, transmit directly to another controller (Art. 20(2)) `[confirm
   feasibility — currently manual]`.
5. Log + respond.

---

## 11. Objection (Art. 21) & withdrawal of consent (Art. 7(3))

- **Objection (Art. 21):** Where CLEAR relies on **legitimate interests**, stop that processing unless
  compelling legitimate grounds override (document the balancing). For **direct marketing**, the
  objection is **absolute** — stop immediately and suppress.
- **Withdraw consent (Art. 7(3)):** Where processing relied on **consent** (notably **website
  analytics / GA4 / Ads**, Consent Mode v2), honour withdrawal and make it **as easy as giving it**:
  update the consent state so trackers are denied; stop the consent-based processing going forward
  (no retroactive effect on prior lawful processing).
- **Processor data:** route objections about project/respondent data to the customer-controller.
- Log + respond.

---

## 12. Data-location map — where to find / extract / delete a person's data

> Use this to locate, export, correct, restrict or delete. **Primary store: Supabase (EU).** Match on
> the person's email / name / IDs. Mind **third-party data inside free text and documents** — redact
> for access, and remember most of this is **processor data** (action only on the customer's
> instruction).

| Data about the person | Where it lives | Match on | Action notes |
|---|---|---|---|
| Account / identity | `profiles` | email, user ID | Controller data: export/correct/delete directly. |
| Workspace & membership | `workspaces`, `memberships` | user ID, workspace ID | Controller data. Consider impact on shared workspace before deletion. |
| Project briefs / inputs (may name them in free text) | `project_inputs`, `projects` | free-text / stakeholder name search | **Processor data** — instruct via customer. Redact third parties for access. |
| Uploaded documents + extracted text | `documents` table **+ Storage bucket `documents`** at `{workspace_id}/{project_id}/{uuid}-{filename}` | filename, workspace/project ID, content search | **Processor data.** Delete the **storage object AND the DB row**. May contain special-category data. |
| AI analysis outputs | `runs`, `experiment_designs`, `intervention_candidates`, `research_findings`, `research_questions` | project ID; content search for the name | Editable; correct/delete on instruction. |
| Shared knowledge base | `knowledge_base` | content search | Intended **de-identified**; search for any residual identifiers and purge `[confirm]`. |
| Respondent invitations | `project_invitations` | invite email (token is hashed) | **Processor data.** Tokens expire after 30 days. |
| Respondent contributions | `project_contributions`, `leverage_reactions` (+ uploads in `documents` bucket) | invite email, project ID | **Processor data** — deletable by project owner; action on instruction. |
| Entitlements / unlocks | `entitlements`, `project_unlocks` | user/workspace ID | Controller-side billing state. |
| Billing | **Stripe** (customer/subscription IDs, payment metadata) + IDs mirrored in Supabase | Stripe customer ID, email | **Retain 7 years** (Bookkeeping Act) — restrict/anonymize rather than delete where retention applies. |
| Email | **Brevo** (recipient email, name, message content) | email | Delete/suppress contact + logs per Brevo controls `[confirm]`. |
| Website analytics | **Google** (GA4 / Ads) — pseudonymous events, transient IP, `[hashed email]` | GA identifiers (limited) | Mostly pseudonymous (Art. 11). Honour consent withdrawal; use GA retention/delete controls. |
| AI inference content | **Anthropic (US)** | n/a (transient) | **Not retained for training**; `[confirm zero/limited retention → no separate deletion needed; else raise deletion per Anthropic process]`. |
| Voice dictation | Only **transcript text** lands in `project_inputs` etc.; **no audio** stored or sent to CLEAR | as per inputs | Treat as project input; no separate audio store. |

**TODO (owner):** Validate this map against the live schema; confirm exact Brevo/Stripe/Google
deletion procedures and Anthropic retention configuration; confirm backup-purge mechanics.

---

## 13. Logging / record-keeping (every request)

Maintain a DSR log (accountability, Art. 5(2)). For each request record:

| Field | Example |
|---|---|
| Request ID / date received | `[ ]` |
| Requester + role (account holder / respondent / visitor) | `[ ]` |
| Right(s) invoked | `[ ]` |
| Controller or processor path (+ customer notified, date) | `[ ]` |
| Identity-verification method + outcome | `[ ]` |
| Systems searched + actions taken (tables, `documents` bucket, Stripe/Brevo/Google/Anthropic) | `[ ]` |
| Third-party redactions applied (access requests) | `[ ]` |
| Extension used? (date informed, reason) | `[ ]` |
| Date completed + response sent | `[ ]` |
| Refusal? (legal ground + complaint-rights notice given) | `[ ]` |

Retain DSR records for `[retention period — e.g. duration of relevant limitation period; confirm]`.
Store access-restricted. Do **not** keep more identity-verification data than necessary.

---

## 14. Response-letter templates (short)

> Adapt and have counsel approve. Replace `[brackets]`. Send to the **verified** address.

**14.1 Acknowledgement**
> Subject: Your data request — acknowledgement
> Hello `[name]`, we have received your request dated `[date]` regarding your personal data. We will
> respond within one month. If the request is complex we may extend by up to two further months and
> will tell you why within the first month. We may need to verify your identity first.
> — CLEAR, `[privacy contact email]`

**14.2 Identity verification needed**
> To protect your data, please confirm your identity by `[clicking the link sent to your account
> email / replying from the email address on file]`. We cannot action the request until verification
> is complete.

**14.3 Access — fulfilment (controller data)**
> Attached is a copy of the personal data we hold about you as a controller, with information about how
> we process it, the recipients/subprocessors (including transfer safeguards for our US AI provider),
> retention, and your rights. We have redacted information relating to other people. You may complain
> to the Swedish authority (IMY).

**14.4 Processor routing**
> The data you have asked about is processed by CLEAR **on behalf of `[customer organization]`**, which
> is the data controller. We have forwarded your request to them and will assist them in responding.
> Please also contact `[customer]` directly.

**14.5 Erasure — fulfilment / partial**
> We have deleted the personal data we hold about you as a controller, except `[billing/accounting
> records we must retain for 7 years under Swedish law]`, which we have restricted from other use.
> `[Where applicable: project/respondent data was handled by the controller-customer.]`

**14.6 Extension notice**
> Your request is complex/numerous, so we are extending our response time by up to `[two months]`. The
> reason is `[reason]`. We expect to respond by `[date]`.

**14.7 Refusal / no action**
> We are unable to `[action]` because `[manifestly unfounded/excessive / exemption applies / identity
> unverified]`. You may complain to **IMY (Integritetsskyddsmyndigheten)** and seek a judicial remedy.

---

## 15. Interim status & recommended follow-up

- This is an **interim manual process**; the app has **no automated export/erasure** today.
- **Recommended follow-up (track as roadmap):**
  1. Automated **data export** (access/portability) across all tables + `documents` bucket.
  2. Automated **erasure** across tables, Storage, and subprocessor deletion workflow (Stripe/Brevo/
     Google), with backup-purge handling.
  3. A **restriction flag** on projects/contributions.
  4. An **application-level audit log** (currently a known gap) to evidence DSR actions.
  5. Self-service **consent management** surface for analytics withdrawal.

| Date | Version | Change | Author |
|---|---|---|---|
| 2026-06-25 | `[0.1]` | Initial DRAFT scaffold | `[ ]` |

> Cross-references: see `ropa.md` (Art. 30 records) and `dpia-outline.md` (Art. 35).
> *Expand with counsel for non-EU regions if the market expands beyond EU/EEA.*
