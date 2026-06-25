# EXPERIMENT Options — Self-Serve CLEAR Go-to-Market

**Purpose:** the smallest, preferably reversible tests that could move the behaviour *"discover → sign up → run a real project → pay"* — not a rollout.
**Prepared:** 2026-06-25. Every figure cites its source. APEASE scores are **structured judgement to validate**, not measured facts.

---

## Resource envelope

Grounded in `content/next-steps-plan.md`, `docs/unit-economics.md`, and the live accounts:

- **People:** one founder (Erik), with an AI assistant for content/build. The plan assigns nearly every task to "Erik"; "Claude" is listed for writing and page-building (`content/next-steps-plan.md`).
- **Budget:** Google Ads **€50/day (€700 over 2 weeks)** in Germany; a possible Nordics campaign at **€300/mo**; a possible LinkedIn Ads test at **€1,500 for 2 weeks** (future, only "if LinkedIn works"); Brevo on the **free plan (298 send credits)**. Product compute is **~$0.30–0.40 per project** (`docs/unit-economics.md`), so in-product tests are nearly free to run.
- **Time:** organised in **2-week sprints**; ~30 min per LinkedIn post (5 posts/2 weeks); ~2 hours for 20 referral emails; a weekly ~1-hour review and a biweekly 15-minute learning loop (`content/next-steps-plan.md`).
- **Flag (Gap):** this envelope is documented for the **consulting** go-to-market. There is **no self-serve-specific budget or time allocation** in the material — any spend redirected to the product is an assumption to confirm.

---

## Interventions by leverage point

Each is small and reversible, and names the COM-B barrier it addresses (from the Leverage brief).

**Leverage point A — Self-serve acquisition** *(Opportunity — Physical: no dedicated distribution)*
- **A1.** Repoint **one** existing Google Ads ad group's landing page from the consulting LP to `/product`; measure signups. *Reversible — swap the URL back.*
- **A2.** Add a self-serve CTA ("run your own analysis") on the free **assessment results** page, linking to `/signup`. *Reversible — remove the CTA.*
- **A3.** Make **one** of the five Sprint-1 LinkedIn posts product-led (link to `/product/sample` + signup) instead of consulting. *Reversible — it's a single post.*

**Leverage point B — Trust / social proof** *(Opportunity — Social + Capability — Psychological)*
- **B1.** Feature the **existing** sample report (`/product/sample`) prominently at signup and at the paywall. *Reversible.*
- **B2.** Surface the existing EU-privacy line — "processed in the EU and never used to train models" (`src/pages/product/ProductLanding.tsx`) — next to the signup/payment step. *Reversible.*
- **B3.** Collect **3–5 testimonials** from past consulting clients (already a planned task in `content/next-steps-plan.md`) and show them on the product page. *Reversible — depends on client consent.*

**Leverage point C — Monetisation / pricing presentation** *(Opportunity — Physical price + Motivation — Reflective)*
- **C1.** Present the **$200 one-off unlock** as the primary paywall CTA, with subscription secondary (both already exist — `src/config/billing.ts`). *Reversible — copy change.*
- **C2.** A/B the paywall message shown at the Leverage-teaser moment. *Reversible.*
- **C3.** Offer time-boxed **founder-assisted ("concierge") onboarding** to the first ~10 signups to learn willingness-to-pay directly. *Reversible — stop offering it.*

**Leverage point D — Activation "aha"** *(Motivation — Automatic + Capability — Physical)*
- **D1.** Pre-fill an **example challenge / template** to remove blank-page friction on the first run. *Reversible — behind a flag.*
- **D2.** Add a first-run guided prompt/checklist. *Reversible.*

**Leverage point E — Instrumentation (enabler that gates all learning)**
- **E1.** Complete Sprint-0 setup: replace the Google Ads conversion-label placeholders in `src/config/site.ts`, mark the `lead_*` GA4 events as key events, and record baselines (`content/next-steps-plan.md` l.11, l.53–68). *Prerequisite for measuring everything else.*

---

## APEASE screen

Score **Effectiveness / Practicability / Affordability** 1–5 (5 = best). Gate **Acceptability / Side-effects & Safety / Equity** as pass / flag / fail — **any fail parks the idea regardless of score.** P and A are anchored to the real envelope above (a URL or copy change is cheap and fast → high P/A; founder-time-heavy work → lower P).

| Intervention | Barrier | E | P | A | Acceptability | Side-effects/Safety | Equity | Verdict |
|---|---|:-:|:-:|:-:|---|---|---|---|
| **E1** Complete instrumentation | enabler | 5 | 5 | 5 | pass | pass | pass | **Run first (keystone)** |
| **A1** Repoint 1 ad group → /product | Opp-Phys | 4 | 4 | 5 | pass | flag (consulting-intent clicks may bounce → wasted spend) | pass | Run, watch bounce |
| **A2** Self-serve CTA on assessment | Opp-Phys | 3 | 4 | 5 | pass | flag (may divert from consulting call CTA) | pass | Run |
| **A3** One product-led LinkedIn post | Opp-Phys | 3 | 5 | 5 | pass | pass | pass | Run |
| **B1** Feature sample report | Opp-Soc/Cap-Psy | 4 | 5 | 5 | pass | pass | pass | **Run (cheap, high value)** |
| **B2** EU-privacy line at signup | Opp-Soc | 3 | 5 | 5 | pass | pass | pass | Run |
| **B3** Past-client testimonials | Opp-Soc | 4 | 3 | 5 | pass | flag (needs consent; confidentiality) | pass | Run with opt-in |
| **C1** $200 unlock as primary CTA | Opp-Phys/Mot-Ref | 4 | 5 | 5 | pass | flag (may anchor low / suppress subs) | pass | Run as A/B |
| **C2** A/B paywall framing | Mot-Auto | 3 | 4 | 5 | pass | pass | pass | Run once traffic exists |
| **C3** Concierge onboarding (first ~10) | Cap/Mot (diagnostic) | 5 | 3 | 4 | pass | flag (not scalable; may not generalise) | flag (hand-picked access → selection bias) | Run as *learning*, not rollout |
| **D1** Pre-filled example challenge | Mot-Auto/Cap-Phys | 3 | 4 | 5 | pass | pass | pass | Run after users exist |
| **D2** First-run guided prompt | Cap-Phys | 3 | 4 | 5 | pass | pass | pass | Run after users exist |

No idea hits a hard **fail**, so none are auto-parked. The flags matter: **C3 (concierge)** carries both a side-effects and an equity flag, so it stays a *diagnostic* to learn willingness-to-pay — not something to scale. **C1** needs monitoring so a cheap one-off doesn't cannibalise subscriptions.

---

## Testable hypotheses

Form: *If we change X for customers, then Y, because Z* — plus how to measure it.

1. **Acquisition.** *If we repoint one Google Ads ad group's landing page to the self-serve `/product` instead of the consulting LP, then we generate the first self-serve signups, because some change-management search traffic would rather self-serve than book a call.* **Measure:** signups attributed to that ad group (UTM + GA4) and cost-per-signup vs. the consulting LP. *(Barrier: Opportunity — Physical.)*
2. **Trust → activation.** *If we feature the existing free sample report and EU-privacy line at signup/paywall, then signup→first-run rises, because first-time users of a new AI tool need proof before investing effort.* **Measure:** signup→first-run (activation) rate before vs. after. *(Opportunity — Social / Capability — Psychological.)*
3. **Monetisation.** *If we present the $200 one-off unlock as the primary paywall CTA, then we reach the first paid conversion sooner, because a one-off is a lower-commitment first purchase than a subscription.* **Measure:** paywall→unlock rate and the date of the first paid conversion (`project_unlocks`, baseline 0). *(Opportunity — Physical / Motivation — Reflective.)*
4. **Funnel bridge.** *If we add a self-serve CTA to the free assessment results page, then assessment completers convert into product signups, because they've just experienced a taste of the method.* **Measure:** assessment→signup click-through and resulting signups. *(Opportunity — Physical.)*
5. **Learning / WTP.** *If we offer concierge onboarding to the first ~10 signups, then we learn the real activation barriers and willingness-to-pay, because direct observation substitutes for the customer research we don't have.* **Measure:** a qualitative barrier log + how many of the 10 pay. *(Diagnostic for the Leverage Gaps.)*
6. **Enabler.** *If we complete Sprint-0 instrumentation, then every later test becomes measurable, because we currently can't see where users drop.* **Measure:** `lead_*` events firing in GA4 and conversions registering in Google Ads. *(Instrumentation Gap.)*

---

## Gaps & unknowns

- **No baseline rates to size tests.** With ~0 traffic and 0 conversions, early reads are directional only — proper sample sizes/power can't be computed yet.
- **APEASE scores are judgement, not data.** Revisit Effectiveness once real traffic and conversions exist.
- **Willingness-to-pay is unknown** until a price-presentation test (C1) runs against real traffic; prices remain "hypotheses" (`src/config/billing.ts`).
- **In-product activation tests (D1–D2) need real users first** — no signal until people are running projects.
- **Concierge (C3) introduces selection bias and isn't scalable** — equity flag noted; treat strictly as learning.
- **Sequencing constraint:** several tests assume traffic the product doesn't yet have. **E1 (instrumentation) and A1/A2 (acquisition) must come before** trust, pricing, and activation tests can be read.
- **Self-serve budget is undefined** — all spend in the material is allocated to the consulting funnel.
