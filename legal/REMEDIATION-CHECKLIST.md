# CLEAR — Compliance Remediation Checklist

> **DRAFT — NOT LEGAL ADVICE.** A working punch-list derived from `ASSESSMENT.md`. Have counsel
> confirm scope and priorities. Owner tags: **[Legal]** counsel/policy · **[Eng]** engineering ·
> **[Ops]** business operations. Each item links to its assessment finding (§) and the deliverable
> that resolves it. Date: 2026-06-25.

**How to use:** work top to bottom. Tier 0 must be done before opening paid EU sign-ups. Tier 1
before scaling / your first significant paying customer. Tier 2 is fast-follow. The legal `drafts/`
are starting points — **finalize each with counsel, then publish/wire in.**

---

## Tier 0 — Launch blockers (must close before selling to EU users)

- [ ] **Finalize & publish the Privacy Policy.** *(§3.1, [Legal][Eng])* Counsel-review
      `drafts/privacy-policy.md` → wire approved text into `src/content/privacy-policy.tsx` → bump
      `PRIVACY_POLICY_VERSION`.
- [ ] **Adopt a Terms of Service + signup acceptance gate.** *(§3.2, [Legal][Eng])* Finalize
      `drafts/terms-of-service.md`; add a versioned "I agree" record at signup (mirror the
      privacy-acceptance pattern in `src/lib/db.ts`).
- [ ] **Stand up a data-subject-request process.** *(§3.3, [Eng][Ops])* Put the manual
      `records/dsr-runbook.md` into operation now; name a responsible owner and an intake address.
- [ ] **Execute DPAs with all subprocessors.** *(§3.4, [Legal][Ops])* Supabase, Anthropic, Stripe,
      Brevo, Google. Track in `drafts/subprocessors.md`.
- [ ] **Fix the Anthropic transfer + reconcile the "EU" claim.** *(§3.5, [Legal][Eng])* Put
      SCCs/DPA + retention config in place; correct any marketing copy that overstates EU-only
      processing; record in `records/dpia-outline.md`.
- [ ] **Publish a refund/cancellation policy and fix price display.** *(§3.10, [Legal][Eng][Ops])*
      Finalize `drafts/refund-cancellation-policy.md`; change `src/config/billing.ts` to **EUR,
      VAT-inclusive**; confirm VAT/OSS + Stripe Tax with an accountant.
- [ ] **Offer customers a DPA (CLEAR as processor).** *(§3.4, [Legal])* Finalize
      `drafts/data-processing-agreement.md` for B2B/enterprise customers.
- [ ] **Add a respondent-portal privacy notice.** *(§3.11, [Legal][Eng])* Just-in-time notice on
      `/respond/<token>` linking the Privacy Policy.

## Tier 1 — Before scaling / first significant paying customer

- [ ] **Confirm EU AI Act position.** *(§3.7, [Legal])* Counsel sign-off on risk classification;
      add an "AI-generated" label in the UI (Art. 50); keep the AI disclaimer in ToS/Privacy Policy.
- [ ] **Define & enforce data retention.** *(§3.8, [Eng][Legal])* Publish periods (done in the
      Privacy Policy); build purge jobs + per-project/account deletion.
- [ ] **Special-category-data controls.** *(§3.6, [Legal][Eng])* DPA/AUP warranties + an upload-time
      notice discouraging Art. 9 data without a basis.
- [ ] **Granular cookie consent.** *(§3.9, [Eng][Legal])* Separate analytics vs advertising; add a
      persistent "Cookie settings" control; publish `drafts/cookie-policy.md`; verify nothing
      non-essential fires pre-consent.
- [ ] **Complete DPIA + RoPA.** *(§3.12, [Legal])* Finish `records/dpia-outline.md` and
      `records/ropa.md`; have counsel/DPO sign off.
- [ ] **Document the breach-notification process.** *(§3.13, [Ops][Legal])* 72h authority
      notification; processor→controller path; on-call owner.

## Tier 2 — Fast-follow (hygiene & accountability)

- [ ] **Application audit logging** for sensitive actions. *(§3.14, [Eng])*
- [ ] **Substantiate marketing & credential claims**; confirm the PHP lead/newsletter forms capture
      consent + offer unsubscribe. *(§3.15, [Legal][Ops])*
- [ ] **Add a proprietary `LICENSE`/`NOTICE`** at the repo root from `drafts/proprietary-notice.md`.
      *(§3.16, [Eng][Legal])*
- [ ] **Accessibility (EAA) pass** to WCAG 2.1 AA if any B2C exposure. *(§3.17, [Eng])*

---

## Separate engineering follow-up (explicitly NOT done in this assessment)

This assessment is documents-only. The following **code** changes are recommended next, in a
separate task, and are referenced above:

1. Wire the finalized Privacy Policy text into `src/content/privacy-policy.tsx` + bump the version.
2. ToS acceptance gate + versioned record at signup.
3. Data-subject-request endpoints: self-service **export** and account/project **erasure**.
4. Retention **purge jobs** + per-project/account deletion.
5. **Granular** cookie-consent UI + persistent settings control.
6. Respondent-portal just-in-time **privacy notice**.
7. "AI-generated" **transparency label** in report UI (EU AI Act Art. 50).
8. Correct **EUR/VAT** price display in `src/config/billing.ts`.
9. Application **audit log**.

---

## Counsel / sign-off tracker

| Item | Owner | Reviewed by counsel | Date | Status |
|---|---|---|---|---|
| Privacy Policy | [Legal] | [ ] | | |
| Terms of Service | [Legal] | [ ] | | |
| DPA (customer-facing) | [Legal] | [ ] | | |
| Subprocessor list | [Ops] | [ ] | | |
| Refund/cancellation policy | [Legal] | [ ] | | |
| Acceptable Use Policy | [Legal] | [ ] | | |
| Cookie Policy | [Legal] | [ ] | | |
| DPIA | [Legal/DPO] | [ ] | | |
| RoPA | [Legal/DPO] | [ ] | | |
| EU AI Act classification | [Legal] | [ ] | | |
| VAT/OSS setup | [Ops/Accountant] | [ ] | | |
| Vendor DPAs executed | [Ops] | [ ] | | |
