# CLEAR — Legal & Compliance Pack

> **DRAFT — NOT LEGAL ADVICE.** Everything in this folder is a *starting point* prepared by
> reviewing the codebase. It must be reviewed and finalized by **qualified legal counsel (EU /
> Swedish law)** before publication or reliance. Nothing here certifies compliance. Date: 2026-06-25.

This pack answers one question: **what do we need to do, legally, to sell CLEAR and let users use
it?** Baseline jurisdiction is **EU/EEA** (GDPR, ePrivacy, EU consumer law, EU AI Act), matching the
product's EU data residency, EUR pricing, and Stockholm base.

It is **documents-only** — no application code was changed. Recommended code changes are listed as a
*separate engineering follow-up* in `REMEDIATION-CHECKLIST.md`.

---

## Start here

1. **Read `ASSESSMENT.md`** — the gap analysis and risk register (every finding cites a file you
   can open and verify).
2. **Work `REMEDIATION-CHECKLIST.md`** — the prioritized punch-list (Tier 0 = launch blockers).
3. **Send the `drafts/` to counsel** — finalize, then publish / wire in.
4. **Hand `records/` to whoever owns privacy/DPO duties** — internal compliance records to complete.

**By audience:** Founder/Ops → `ASSESSMENT.md` §1 + `REMEDIATION-CHECKLIST.md`. Counsel → `drafts/`
+ `ASSESSMENT.md`. Engineering → the "Separate engineering follow-up" section of the checklist.

---

## File index

| File | Purpose | Status |
|---|---|---|
| `ASSESSMENT.md` | Gap analysis + risk register (evidence-cited) | Ready to read |
| `REMEDIATION-CHECKLIST.md` | Prioritized actions, owner-tagged, with sign-off tracker | Ready to use |
| `drafts/privacy-policy.md` | Full GDPR privacy policy (replaces the placeholder) | Draft → counsel |
| `drafts/terms-of-service.md` | B2B SaaS Terms of Service | Draft → counsel |
| `drafts/data-processing-agreement.md` | Art. 28 DPA (CLEAR as processor) | Draft → counsel |
| `drafts/subprocessors.md` | Public subprocessor list | Draft → ops/counsel |
| `drafts/acceptable-use-policy.md` | Acceptable Use Policy | Draft → counsel |
| `drafts/cookie-policy.md` | Cookie & tracker policy | Draft → counsel |
| `drafts/refund-cancellation-policy.md` | Refund / cancellation terms | Draft → counsel |
| `drafts/proprietary-notice.md` | Proprietary LICENSE/NOTICE text | Draft → add to repo root |
| `records/dpia-outline.md` | Art. 35 DPIA scaffold | Internal — complete it |
| `records/ropa.md` | Art. 30 Records of Processing | Internal — complete it |
| `records/dsr-runbook.md` | Manual data-subject-request runbook | Internal — operationalize now |

---

## Coverage map — EU obligation → where it is addressed

| Obligation | Addressed by |
|---|---|
| Transparency / privacy notice (GDPR Arts. 12–14) | `drafts/privacy-policy.md`; §3.1, §3.11 |
| Lawful basis & special categories (Arts. 6, 9) | `drafts/privacy-policy.md`, `drafts/acceptable-use-policy.md`, DPA; §3.6 |
| Data-subject rights (Arts. 15–22) | `records/dsr-runbook.md`; §3.3 (+ code follow-up) |
| Processor terms (Art. 28) | `drafts/data-processing-agreement.md`, `drafts/subprocessors.md`; §3.4 |
| International transfers (Ch. V) | DPA + privacy policy (SCCs, Anthropic/US); §3.5 |
| Storage limitation / retention (Art. 5(1)(e)) | Privacy policy retention section; §3.8 (+ code follow-up) |
| Security of processing (Art. 32) | DPA Annex II; §3.14; "what's already in good shape" |
| DPIA (Art. 35) | `records/dpia-outline.md`; §3.12 |
| Records of processing (Art. 30) | `records/ropa.md`; §3.12 |
| Breach notification (Arts. 33–34) | DPA + runbook; §3.13 |
| ePrivacy / cookies | `drafts/cookie-policy.md`; §3.9 (+ granular-consent follow-up) |
| EU AI Act (deployer, Art. 50 transparency) | ToS/privacy AI disclaimer + DPIA; §3.7 (+ UI label follow-up) |
| EU consumer law (withdrawal, price/VAT) | `drafts/refund-cancellation-policy.md`, ToS; §3.10 |
| Marketing / advertising claims | §3.15 |
| Software licensing (sell proprietary) | `drafts/proprietary-notice.md`; §3.16 (dependencies confirmed clean) |
| Accessibility (EAA) | §3.17 (watch-item) |

---

## Maintaining this pack

- **`[bracketed]` items** mark facts only the business/counsel can supply (legal entity name,
  registration number, registered address, privacy/DPO contact, final prices, confirmed vendor
  terms, retention numbers). Search each file for `[` to find them.
- **Versioning:** keep the published Privacy Policy version in sync with `PRIVACY_POLICY_VERSION`
  in `src/content/privacy-policy.tsx` (currently `2026-06-25`). Re-prompt acceptance whenever it
  changes.
- **Re-run the assessment** when data flows change — a new subprocessor, a new data type, a new
  region, or a change to how AI outputs are used.
