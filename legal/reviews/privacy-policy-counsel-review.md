> **NOT LEGAL ADVICE — STRUCTURED REVIEW.** This is an AI-assisted, counsel-style review prepared to
> help the qualified **EU / Swedish-law** practitioner who must finalize the policy. It does **not**
> certify compliance, is **not** a substitute for licensed legal advice, and does not by itself make
> any representation binding on CLEAR. Review date: 2026-06-25.

# CLEAR — Privacy Policy: Counsel Review & Gold-Standard Benchmark

## What was reviewed

- **Focus document:** `legal/drafts/privacy-policy.md` (blob `d74a918`; byte-identical on
  `claude/charming-allen-ywpkxa` and `claude/cool-franklin-iz1g22`).
- **Cross-checked against:** the app's actual data flows (Supabase schema/migrations, Edge
  Functions, billing/AI/email integrations, analytics) and the rest of the legal pack — `ToS`,
  `DPA`, `AUP`, `cookie-policy`, `subprocessors`, `refund-cancellation-policy`,
  `proprietary-notice`, `records/ropa`, `records/dpia-outline`, `records/dsr-runbook`,
  `ASSESSMENT.md`, `REMEDIATION-CHECKLIST.md`.
- **Benchmarked against ~18 peers:** Dovetail, Maze, Hotjar, UserTesting, Amplitude (research/
  behavioural-analytics); Notion, Intercom, Anthropic, OpenAI, Fireflies, tl;dv (AI-on-customer-
  data); Basecamp/37signals, Mozilla, Linear, Proton, GitHub (plain-language/structure); Stripe,
  Supabase (same-stack processors).

## Contents

1. [Bottom line](#1-bottom-line)
2. [What's strong](#2-whats-strong)
3. [Substantive findings — privacy policy](#3-substantive-findings--privacy-policy)
4. [Accuracy vs. the product (code cross-check)](#4-accuracy-vs-the-product-code-cross-check)
5. [Internal consistency across the pack](#5-internal-consistency-across-the-pack)
6. [Whole-pack review (per-document)](#6-whole-pack-review-per-document)
7. [Gold-standard benchmark](#7-gold-standard-benchmark)
8. [The bracketed-items punch list](#8-the-bracketed-items-punch-list)
9. [Redlines applied in this pass](#9-redlines-applied-in-this-pass)
10. [Prioritized action list](#10-prioritized-action-list)
11. [Sources](#11-sources)

---

## 1. Bottom line

This is a **strong, sophisticated draft** — well above the norm for a pre-launch product, and
materially better than several of the commercial peers benchmarked. It already nails the hard parts:
a clear **controller/processor dual-role** split, **EU AI Act Art. 50** transparency, an **honest
SCC/transfer reconciliation**, a **retention table**, and **version-pinning** to the app
(`PRIVACY_POLICY_VERSION`). It is also **accurate against the code** — the data audit found no claim
that the implementation contradicts.

The issues are therefore not structural rewrites but **three tractable themes**:

1. **Representation-vs-capability gaps** — the policy promises rights and lifecycles the code cannot
   yet deliver (self-evident DSR fulfilment, 30-day deletion, a respondent notice that isn't built).
   These are defensible *only* if the manual backstops genuinely operate. (Findings F1–F3.)
2. **A few claims that need backing or softening** — the "no training / limited retention" promise,
   the absolute de-identification claim, the enhanced-conversions line. (F4–F6.)
3. **Structural polish the best peers have and this draft lacks** — a TL;DR, a table of contents, a
   version-history log, and an easy consent-withdrawal control. (Applied in this pass — §9.)

**Verdict:** *Not yet publishable* — but the blockers are the **`[bracketed]` business/legal facts
and the operational backstops**, not the drafting. Close the Tier-0 items in §10 and this is a
publish-ready policy.

---

## 2. What's strong

- **Dual-role framing done right (§2).** Most consumer policies blur this; CLEAR states it up front,
  maps which data sits in which role, and gives a plain-language summary ("we control the data about
  *our customers and our website*; our customers control the data they *bring into their projects*").
  This matches the gold standard set by Maze, Dovetail and UserTesting and beats most.
- **AI transparency (§6).** Names the provider (Anthropic), states inference-only, "no training,"
  server-side-only, and includes an **Art. 50** deployer assessment with the human-review caveat —
  ahead of the EU AI Act's 2 Aug 2026 transparency deadline.
- **Honest transfer reconciliation (§8).** Rather than over-claim "EU-only," it explicitly carves out
  the US inference step under SCCs. Regulators reward this candour; many peers fudge it.
- **Retention table (§10)** and **legal-bases table (§4)** — concrete, auditable, mapped to Art. 6.
- **Security section that refuses to over-claim (§13)** — the internal note *not* to advertise an
  audit log or field-level encryption that don't exist is exactly the discipline that keeps a
  security section truthful.
- **Versioning tied to the app.** Acceptance timestamp + version stored on the profile; re-prompt on
  change. This is a differentiator most SaaS policies lack.

---

## 3. Substantive findings — privacy policy

Severity scale matches `ASSESSMENT.md`: **Critical** = publish-blocker · **High** = fix before first
paying EU customer · **Medium** = fix soon · **Low** = polish. "Status" notes whether this pass
already redlined it or it needs business/counsel/eng action.

| # | Finding | Risk | Severity | Recommendation | Status |
|---|---|---|---|---|---|
| **F1** | **§11 promises DSR rights, but no export/erasure/rectification/restriction exists in code** — only the manual `dsr-runbook.md`. | Promising rights you cannot operationally honour within one month is itself a GDPR Art. 12 failure and a misrepresentation. | **Critical** | Operationalize the runbook *now*: name an owner + intake address; confirm the one-month clock can be met manually. The policy wording is fine (it doesn't promise self-service) — the **backstop** must exist. Build export/erasure endpoints as the eng follow-up. | Counsel/Ops/Eng |
| **F2** | **§10 retention promises (30-day deletion, 90-day backup purge) are not enforced** — no TTL/purge job; only cascade deletes if a row is removed. | Stating a retention period you cannot enforce is an accuracy/accountability risk (Art. 5(1)(e), 5(2)). | **High** | Keep the numbers `[bracketed]` until a purge job exists, or implement the purge before publishing the figure. Note the 7-year billing exception is correctly a *lawful* carve-out. | Eng/Counsel |
| **F3** | **§12 / §6 described a respondent just-in-time notice in the present tense, but the portal notice isn't built** (`ASSESSMENT §3.11`). | Describing a live safeguard that doesn't exist is a transparency misstatement (Art. 13). | **High** | **Redlined** to future tense ("will present"/"will be given"); **build the `/respond/<token>` notice before launch** and switch back to present tense. | Redlined + Eng |
| **F4** | **§6 "no directly identifying data reaches the shared knowledge base"** rested on **probabilistic LLM (Haiku) de-identification**. | If de-id misses an identifier, customer A's personal data can surface in customer B's analysis — a confidentiality + GDPR breach. This is the DPIA's top risk (R1). | **High** | **Redlined** to add the owner-review safeguard and a "cannot guarantee" hedge. Substantively: **test de-id quality**, and decide whether knowledge-base reuse should be **opt-in**. | Redlined + Eng/Counsel |
| **F5** | **"No model training / limited retention" (§6) + SCCs (§8) are asserted but `[bracketed]`-unconfirmed** against Anthropic's actual commercial terms/config. | A strong public promise unbacked by the executed agreement/config is the highest-exposure representation in the policy. | **Critical** | Confirm Anthropic Commercial Terms (no-training) + the **zero/limited-retention** API config + SCC module on file; complete a Transfer-Impact Assessment. Anthropic's public posture (API logs 7 days, no training on commercial/API) supports the claim — but verify *your* configuration. | Counsel/Ops |
| **F6** | **§3 listed a hashed-email "enhanced conversions" flow** while the cookie policy says Google Ads **isn't live**. | Over-disclosure (describing collection that isn't happening) is as inaccurate as under-disclosure. | **Medium** | **Redlined** to mark it "not active today." Re-enable the wording only when the Ads tag goes live and consent/Google Ads data terms cover it. | Redlined |
| **F7** | **§8 said "one important exception"** for US transfers, while Stripe and Google are also US. | Minor over-simplification could read as understating transfers. | **Low** | **Redlined** to "the most significant transfer… concerns AI inference"; the section already lists the other US subprocessors. | Redlined |
| **F8** | **§4 legitimate-interest bases** invite the reader to "ask for our balancing assessment." | The text presupposes an **LIA** exists; if asked and none is on file, that's an accountability gap. | **Medium** | Produce and file an LIA for the (f) bases (security, abuse-prevention, service improvement, defending claims) before relying on the line. | Counsel |
| **F9** | **Consent withdrawal (§9)** must be as easy as granting (ePrivacy), but the banner only reappears if storage is cleared. | No persistent "Cookie settings" control = withdrawal harder than consent = ePrivacy non-compliance. | **High** | **Redlined** to reference a persistent "Cookie settings" control + flag. **Build the footer control** (also tracked in `cookie-policy.md` §5/§6). | Redlined + Eng |
| **F10** | **§14 asserts 18+ with no age-gating** in code. | Low for a true B2B tool, but "intended for 18+" ≠ enforced. | **Low** | Defensible for B2B; state the age in the **ToS** (already does, §1.3) rather than gate. Keep as-is. | Counsel (confirm) |
| **F11** | **CLEAR acronym** — the legal pack uniformly expands it "…Experiment → **Analysis → Refinement**", but the product engine (`runs.phase`) and `CLAUDE.md` use "…→ **Research**". | Public framework description diverging from the product is a (minor) misleading-description and reader-confusion risk. | **Medium** | **Not** a policy-only redline (changing one doc would break pack consistency). Business decision: reconcile the **public framework name** with the product/marketing, then align all docs together. | Business/Counsel |

---

## 4. Accuracy vs. the product (code cross-check)

The data-practices audit confirmed the policy is unusually faithful to the implementation. Key
claims and their code reality:

| Policy claim | Code reality | Status |
|---|---|---|
| Controller for account/auth/billing/analytics; processor for project content | `profiles`, `entitlements` vs `project_inputs`, `documents`, `project_contributions` under RLS | ✅ Accurate |
| Claude inference (Sonnet/Opus); Haiku de-identifies before knowledge-base promotion | `project-run` + `project-research` Edge Functions; `DEIDENTIFY_PROMPT` via Haiku; owner promote-confirm | ✅ Accurate (de-id quality unverified — F4) |
| Voice dictation transcript-only, no audio leaves the browser | `useDictation.ts` (Web Speech API) | ✅ Accurate |
| Card data never reaches CLEAR; only Stripe IDs stored | `stripe-checkout`/`stripe-webhook`; `entitlements.stripe_*` | ✅ Accurate |
| Hashed invite tokens (SHA-256), 30-day expiry | `project_invitations.token_hash`; `expires_at` | ✅ Accurate |
| RLS tenant isolation; server-side secrets; JWT auth | RLS on all tables; `Deno.env` secrets; JWT-gated functions | ✅ Accurate |
| "No application-level audit log / field-level encryption" not advertised | Confirmed absent; correctly *not* claimed | ✅ Honest |
| DSR rights exercisable; 30-day deletion | **No export/erasure/purge code** | ⚠️ Gap (F1, F2) |
| Respondent JIT notice "presents" | **Not implemented** | ⚠️ Gap (F3 — redlined) |
| Enhanced-conversions hashed email | **Google Ads tag not configured** | ⚠️ Gap (F6 — redlined) |

---

## 5. Internal consistency across the pack

**Bottom line: no material cross-document conflicts.** A full digest confirmed the pack is unusually
well-coordinated — retention (30 / 90 days / 7-year billing), the subprocessor list (Supabase,
Anthropic/US, Stripe, Brevo, Google, Microsoft Bookings), the controller/processor split, the
no-training claim, invite-token expiry, age (18+), special-category warranties, and Art. 50
transparency all line up across ToS, DPA, AUP, refund, DPIA, ROPA and the DSR runbook.

The only consistency items worth noting:

- **Acronym pack-vs-product** (F11) — internal to the pack it's consistent; it diverges from the
  product engine. Reconcile at the business level.
- **Respondent JIT notice** is referenced as a control across the policy, AUP §4.2 and DPIA §4 but
  **isn't built** — fix once, in all places, when the portal notice ships (F3).
- **`subprocessors.md`** had an **unresolved `[CLEAR Privacy Policy]` link** — **fixed in this pass.**
- **`ASSESSMENT.md` §3.1** still calls the in-app policy a "placeholder," but
  `src/content/privacy-policy.tsx` now renders the drafted text — that finding is **stale** (noting
  here rather than rewriting a dated point-in-time assessment).
- **ToS §1 / §16.5** reference the Privacy Policy via a `[bracketed]` link — finalize the path when
  the policy is published.

---

## 6. Whole-pack review (per-document)

Each pack document is a strong, counsel-ready draft; the common blocker is the shared set of
`[bracketed]` facts (see §8) plus a handful of doc-specific items below.

- **Terms of Service** — Robust: clear role split (§7.6), strong AI disclaimer + Art. 50 (§8),
  conditional EU-consumer note (§24), defined order of precedence (DPA prevails on data matters).
  *Gaps:* liability-cap amounts, support/security emails, the `$`→EUR currency-display bug it itself
  flags (§6.3), publicity-consent default, governing-law brackets. *Add:* an explicit requirement to
  show a respondent privacy notice at `/respond/<token>`.
- **DPA (Art. 28)** — Comprehensive: documented-instructions, Art. 32 TOMs (with gaps disclosed),
  subprocessor notice-and-objection (§11.2), SCCs (§12), deletion/return (§15). *Gaps:* SCC module
  selection + docking annex unfilled; Anthropic zero/limited-retention unconfirmed; breach-notice to
  the customer says "without undue delay" — **add a concrete window** (e.g. ≤24–48h); cross-link the
  DSR runbook's routing.
- **Acceptable Use Policy** — Clear special-category prohibition (§3.3), Art. 50 (§6), "not the sole
  basis for decisions about individuals" (§3.4). *Add:* mandate the respondent privacy-notice display;
  finalize AI-Act-classification bracket.
- **Refund & Cancellation** — Correctly implements the EU digital-content withdrawal-right waiver
  (CRD Art. 16(m)) and the 14-day consumer window. *Gaps:* unlock-scope (perpetual vs project-life)
  is a **product decision**; VAT/OSS treatment; goodwill-refund window; currency ($→EUR).
- **Proprietary Notice** — Clear proprietary claim + third-party attribution scaffold. *Gaps:* the
  **dependency/license manifest (SBOM) is unfilled**; confirm `/LICENSE` vs `/NOTICE` path; fill
  identity fields.
- **Cookie Policy** — Honest about the **all-or-nothing banner vs the intended granular model** (§6)
  and the not-yet-live Ads tag. *Gaps:* persistent "Cookie settings" link (ties to F9); confirm GA4
  cookie names/durations via a live cookie audit; GA4 14-month retention.
- **Subprocessors** — Good structure (core-app vs marketing-site split, transfer mechanisms).
  Broken privacy-policy link **fixed in this pass**; confirm regions/DPAs and the optional
  web-research providers (the policy's §6 promises to disclose them here).
- **DPIA outline** — Strong WP29 justification + a 10-risk register (R1 re-identification and R7
  cross-tenant RLS are the ones to watch). *Status:* risk ratings, residual-risk and the Art. 36
  prior-consultation decision are all **TODO** — must be completed and signed off.
- **ROPA (Art. 30)** — Complete dual-record scaffold (controller + processor) consistent with the
  policy. *Status:* validate every legal basis/retention with counsel; confirm Supabase EU residency.
- **DSR runbook** — Excellent: a crisp controller/processor routing tree, a 16-row data-location map,
  proportionate identity verification, response templates. *Gaps:* clarify whether the one-month clock
  starts on receipt or on ID-verification; no **Art. 18 restriction** flag exists (interim manual
  hold); confirm Brevo/Stripe/Anthropic deletion procedures; address **Art. 14** notice for
  third-parties named in inputs.

---

## 7. Gold-standard benchmark

### 7.1 How CLEAR compares

| Gold-standard feature | Exemplars | CLEAR today |
|---|---|---|
| Controller/processor split stated up front | Maze, Dovetail, UserTesting, GitHub | ✅ **Already strong** (§2) |
| Explicit "no training on your data" + name the model provider | Notion, Anthropic, Intercom, Proton | ✅ Present (§6) — *confirm config (F5)* |
| Living subprocessor page + change-notification | Amplitude, GitHub, Stripe, Fireflies | ◐ Page exists; **add an email-subscription / 30-day notice mechanism** |
| Just-in-time respondent/participant notice | UserTesting, Sprig, Hotjar | ◐ Described — **not yet built (F3)** |
| Retention table | (GDPR best practice) | ✅ Present (§10) |
| SCCs / transfer mechanism stated | Dovetail, Supabase, Stripe | ✅ Present (§8) |
| DSR mechanism + response SLA | Dovetail (30-day DSAR page) | ◐ Stated; **operationalize the runbook (F1)** |
| **TL;DR / "big picture" summary** | Mozilla, Proton | ✅ **Added this pass** |
| **Table of contents** | GitHub, Linear | ✅ **Added this pass** |
| **Version history / changelog** | 37signals (Git-versioned), Linear | ✅ **Added this pass** |
| Easy consent withdrawal control | (ePrivacy requirement) | ◐ **Flagged + redlined (F9)** — build the control |
| Trust center / security overview page | Linear, Fireflies, Vercel, GitHub | ✗ Differentiator — consider post-launch |
| Plain-language tone | Mozilla, Proton, 37signals | ✅ Good already ("in plain terms") |

### 7.2 Prioritized checklist (table-stakes vs differentiators)

**Table-stakes (have or must close before publishing):** controller/processor split ✅ · no-training
line ✅ (confirm config) · subprocessor list ✅ (add change-notification) · retention table ✅ ·
SCCs ✅ · DSR mechanism ◐ · respondent JIT notice ◐ · Art. 50 disclosure ✅ · plain language ✅.

**Differentiators (adopt to lead the category):** TL;DR ✅ (added) · TOC ✅ (added) · changelog ✅
(added) · **trust center** with certifications/encryption/breach-SLA (peers: Linear, Fireflies) ·
**email-subscribe to subprocessor changes** (Amplitude) · **Git-versioned, optionally CC-BY policies**
(37signals) · **regional addenda** (CCPA/UK) if/when the market expands.

### 7.3 The AI bar is rising — and CLEAR is close to it

The strongest AI peers now compete on **retention numbers**: Anthropic (API logs 7 days, no training
on commercial/API), Notion (Enterprise zero-retention; else ≤30 days), Intercom & Fireflies
(zero/0-day vendor retention). CLEAR's §6 "no training + limited retention" is the right shape — the
differentiator is to **state the actual Anthropic retention figure** once confirmed (F5), which would
put it alongside the best. **Diarize the EU AI Act Art. 50 transparency date: 2 August 2026.**

---

## 8. The `[bracketed]` punch list

### 8.1 Only the business / counsel can supply

Legal entity name · company registration (org.) number · registered/postal address · privacy-contact
email · DPO decision (Art. 37) · final **retention numbers** (30/90 days, GA4 14 months) · confirmed
**Anthropic** terms + retention config + SCC module · **Stripe** contracting entity/region · Supabase
EU-residency + DPA · Brevo DPA · Microsoft Bookings region/terms · VAT/OSS treatment · **AI-Act
classification** sign-off · IMY contact verification · effective date.

### 8.2 Where I can propose a sensible default (for counsel to accept/adjust)

- **Effective date:** set to the **publication date**, and set `Version` = that date to match the
  `PRIVACY_POLICY_VERSION` convention.
- **DPO line:** if no DPO, state plainly: *"We have not appointed a Data Protection Officer; a DPO is
  not mandatory for our processing under GDPR Art. 37. For any privacy matter contact [privacy
  email]."*
- **Art. 27 representative:** keep "not required — operator established in the EU/EEA (Sweden)."
- **Retention defaults:** 30-day deletion / 90-day backup purge are reasonable and match the rest of
  the pack — adopt **once the purge job exists** (F2).
- **Web-research providers (§6/§8):** enumerate the actual search/fetch providers in
  `subprocessors.md` and reference them, or state the feature is disabled by default.

---

## 9. Redlines applied in this pass

**`legal/drafts/privacy-policy.md`:**

1. Added an **"## At a glance"** plain-language TL;DR (Mozilla/Proton pattern), explicitly marked as
   having no separate legal effect.
2. Added a **"## Contents"** table of contents with anchor links.
3. **§3** — marked the enhanced-conversions hashed-email as **not active today** (F6).
4. **§6** — added the **owner-review** safeguard and softened the de-identification claim to
   "designed to" / "cannot guarantee" (F4).
5. **§6 & §12** — respondent AI/JIT notice moved to **future tense** to stop describing an unbuilt
   feature as live (F3).
6. **§8** — "one important exception" → "the most significant transfer… concerns AI inference" (F7).
7. **§9** — added an easy-withdrawal **"Cookie settings"** reference + implementation flag (F9).
8. **§15** — added a **Version history** table.

**`legal/drafts/subprocessors.md`:** fixed the unresolved `[CLEAR Privacy Policy]` link.

**Deliberately *not* changed (and why):**

- **The CLEAR acronym** (F11) — editing one doc would break pack consistency; this is a business
  reconciliation across product + all docs.
- **`src/content/privacy-policy.tsx` + `PRIVACY_POLICY_VERSION`** — kept this a **documents-only**
  pass (matching the pack's own convention that code changes are a separate engineering follow-up).
  Bumping the version now would force all users to **re-accept a still-bracketed draft**. **Action:**
  when the policy is finalized, mirror the user-facing changes into `privacy-policy.tsx` and bump the
  version to re-prompt acceptance.
- **All `[bracketed]` legal facts** — left for the business/counsel to supply (§8); no facts invented.

---

## 10. Prioritized action list

**Tier 0 — before opening paid EU sign-ups (publish-blockers):**
1. Fill the entity/registration/contact/DPO `[brackets]` (§8.1) across the pack.
2. Confirm **Anthropic** no-training + retention config + SCC module; do a Transfer-Impact Assessment
   (F5).
3. **Operationalize the DSR runbook** — owner + intake address — so §11 rights are real (F1).
4. Execute **subprocessor DPAs** (Supabase, Anthropic, Stripe, Brevo, Google).
5. Finalize the Privacy Policy `[link]` referenced by ToS, and the effective date/version.

**Tier 1 — before the first significant paying customer:**
6. Build the **respondent JIT notice** and a persistent **"Cookie settings"** control; then revert
   F3/F9 wording to present tense (F3, F9).
7. Implement **retention purge** + **export/erasure** endpoints; then commit to the §10 numbers (F1, F2).
8. **Test knowledge-base de-identification**; decide opt-in vs default (F4).
9. File the **LIA** for the legitimate-interest bases (F8); complete the **DPIA** risk/residual-risk
   sign-off and the Art. 36 decision.
10. Obtain counsel **AI-Act-classification** sign-off.

**Polish / differentiators:**
11. Reconcile the **CLEAR acronym** product-wide (F11).
12. Add subprocessor-change **email subscription**; consider a **trust center** page.
13. Fix the `$`→EUR currency-display bug and confirm VAT/OSS (also a ToS/refund item).

---

## 11. Sources

**Behavioural-analytics / research peers:** Dovetail (DSAR + DPA + GDPR pages,
`dovetail.com/privacy/`), Maze (`maze.co/data-processing-addendum/`; AI-privacy help), Hotjar
(`hotjar.com/legal/policies/privacy/`), Amplitude (`amplitude.com/subprocessor-list`,
`amplitude.com/dpa`), UserTesting (study-respondent privacy policy). **AI-on-customer-data:** Notion
(`notion.com/help/notion-ai-security-practices`), Intercom
(`intercom.com/blog/data-privacy-security-ai-chatbots/`), Anthropic (`privacy.claude.com`), OpenAI
(`openai.com/enterprise-privacy/`), Fireflies (`trust.fireflies.ai/subprocessors`), tl;dv
(`tldv.io/privacy/`). **Plain-language / structure:** Basecamp/37signals
(`github.com/basecamp/policies`, CC BY 4.0), Mozilla (`mozilla.org/privacy/firefox/`), Linear
(`trust.linear.app`, `linear.app/privacy`), Proton (`proton.me/legal/privacy`), GitHub
(`docs.github.com/en/site-policy/privacy-policies/github-subprocessors`). **Same-stack:** Stripe
(`stripe.com/legal/service-providers`, `/dpa`), Supabase (`supabase.com/privacy`, `/legal/dpa`).
**Regulatory:** EU AI Act Art. 50 transparency (in force 2 Aug 2026).

---

*Prepared to accompany `legal/drafts/privacy-policy.md`. Related: [`ASSESSMENT.md`](../ASSESSMENT.md)
· [`REMEDIATION-CHECKLIST.md`](../REMEDIATION-CHECKLIST.md) ·
[Privacy Policy](../drafts/privacy-policy.md) · [Subprocessors](../drafts/subprocessors.md) ·
[Cookie Policy](../drafts/cookie-policy.md).*
