# CLARITY Brief — Self-Serve CLEAR Go-to-Market

**Behaviour in focus:** a target customer discovers the self-serve CLEAR app, signs up, runs a real project, and pays for the full report.
**Target group:** self-serve SaaS users (not the founder-led consulting business).
**Prepared:** 2026-06-25. Every figure cites its source file. Fields the source doesn't support are left blank and logged under *Gaps*.

---

## Why this matters

The product exists and works. A self-serve CLEAR project is profitable per unit — a full 5-phase run costs **~$0.30–0.40 in Claude tokens**, against plan prices of **$49–$999/mo** and worst-case gross margins of **56–99%** (`docs/unit-economics.md`). The pitch is sharp: move behaviour "**without a six-figure consultancy**… get a clear objective, a systems map, and the highest-leverage points to act on, **in minutes, not months**" (`src/pages/product/ProductLanding.tsx`).

But it is **pre-revenue and pre-traction**. As of 2026-06-25 the live Supabase project (`Auto-CLEAR`, created 2026-06-16) holds **2 profiles** (founder + a test account), **0 paid unlocks**, and **9 projects that are all seeded QA fixtures** (`src/lib/dev/seed.ts`). The Brevo marketing account is on the free plan with **1 subscriber** and no campaigns sent. Pricing is explicitly provisional — "**Prices are hypotheses — validate before going live**" (`src/config/billing.ts`).

So the question isn't "how do we scale?" It's "**is this viable at all?**" — proven by getting the first real organisations to run a real analysis and choose to pay. That is the only thing that converts a built product into a business, and it is what these OKRs make measurable.

---

## Overarching objective

> **Go from zero to a validated base of paying early users: real organisations that run their own CLEAR analysis end-to-end and choose to unlock the full report.**

This is deliberately about *customer behaviour and outcomes* (real runs, real payments), not about shipping features or running campaigns. Hitting it answers the founder's actual question — whether anyone wants this enough to pay.

---

## Key results

Owner for all KRs is the **Founder (Erik)** — the go-to-market plan assigns nearly every action to "Erik," with an AI assistant for content/build (`content/next-steps-plan.md`). Where a field is unsupported by the material it is left as "—" and explained under *Gaps*.

### KR1 — Activation
- **Metric:** number of *real* (non-seed) workspaces that complete a first Clarify + Leverage run.
- **Baseline:** ~0 real workspaces (live data: 2 profiles, both founder/test; all 9 projects are seeded fixtures — `src/lib/dev/seed.ts`).
- **Target:** — *(no activation target exists in the material — see Gaps)*.
- **Timeline:** Sprint 1, the first 2-week launch window (`content/next-steps-plan.md`).
- **Owner:** Founder.

### KR2 — First monetisation
- **Metric:** paid conversions = subscription starts **or** $200 one-off report unlocks.
- **Baseline:** **0** (live `project_unlocks` table = 0 rows; all entitlements on the free tier).
- **Target:** — *(none set; the implicit milestone is "first paid conversion," but no number exists in the material — see Gaps)*.
- **Timeline:** Weeks 1–8 (Sprints 1–4, `content/next-steps-plan.md`).
- **Owner:** Founder.

### KR3 — Acquisition efficiency
- **Metric:** cost per acquired signup.
- **Baseline:** — *(no spend or traffic recorded yet; the GA4 baseline table in `content/next-steps-plan.md` lines 58–67 is blank)*.
- **Target:** documented thresholds are **< €150 cost-per-lead** (scale) and **< €200/lead** (experiment goal) — **but these are written for the consulting lead → discovery-call funnel, not self-serve signups** (`content/next-steps-plan.md`). Reuse for self-serve is *to be confirmed*, not a given.
- **Timeline:** the 2-week, €700 Google Ads test in Germany (€50/day) (`content/next-steps-plan.md`).
- **Owner:** Founder.

### KR4 — Top-of-funnel engagement (free assessment bridge)
- **Metric:** assessment email-gate conversion = completions ÷ page views.
- **Baseline:** — *(not recorded; blank in the GA4 table, `content/next-steps-plan.md`)*.
- **Target:** **> 8%** to scale, **< 3%** to kill (`content/next-steps-plan.md`). **Flag:** the assessment currently routes to a consulting discovery call, *not* to a self-serve signup; using it as a product on-ramp is a bridge that doesn't exist yet (see Gaps).
- **Timeline:** 2 weeks of data (`content/next-steps-plan.md`).
- **Owner:** Founder.

> KR3 and KR4 are the only KRs with grounded targets, and both targets are borrowed from the **consulting** funnel. They are included so the founder can decide whether to adopt them for self-serve — not presented as already-valid self-serve goals.

---

## Gaps & unknowns

- **No self-serve targets exist.** Activation (KR1) and first-paid (KR2) have no numeric target in any document. These need the founder to set them — ideally as simple "first N" milestones rather than rates, given zero baseline.
- **Baselines for the self-serve funnel are unrecorded.** Traffic, signup rate, signup→activation, and free→paid conversion all read "—" because the GA4 baseline table is empty and no analytics are flowing yet.
- **Instrumentation isn't live.** Google Ads conversion labels are still placeholders in `src/config/site.ts` — "no events fire until they're replaced" (`content/next-steps-plan.md` l.11). Until Sprint 0 is done, KR3/KR4 can't actually be measured.
- **The documented funnel is the consulting funnel.** Every target, channel, and budget in `content/next-steps-plan.md` is framed as "EB Consulting Go-to-Market" (lead → discovery call → proposal). The self-serve product has no dedicated acquisition plan yet; reusing consulting targets is an assumption to validate.
- **Pricing is unvalidated.** $49 / $299 / $999 / $200-unlock are "hypotheses — validate before going live" (`src/config/billing.ts`). Willingness-to-pay is untested (0 paid conversions).
- **"Team/owner" is effectively one person.** All KRs are owned by the Founder; there is no separate growth or product owner in the material.
- **No customer evidence.** There are zero interviews, surveys, or usage logs from real target customers, so the *why* behind any conversion or drop-off is unknown (carried into the Leverage brief as Assumptions/Gaps).
