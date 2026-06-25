# LEVERAGE Evidence — Self-Serve CLEAR Go-to-Market

**Purpose:** diagnose the barriers and enablers around the behaviour *"a target customer discovers the product, signs up, runs a real project, and pays"* — not solve them yet.
**Prepared:** 2026-06-25. Tags: **Verified** (documented in code/config/live data), **Assumption** (a plausible founder hypothesis with no research behind it), **Gap** (not known and not in the material). Because there is **zero customer research**, every claim about *customer psychology* is an Assumption or Gap; only product, pricing, and channel *mechanics* are Verified.

---

## The system and its actors

A small, early-stage system with one human at the centre:

- **The target user / buyer** — inferred as an HR / OD / change leader (or founder) at a mid-market organisation in transformation. The product's use-cases are "Customer churn, Onboarding adoption, Compliance, Policy uptake" (`src/pages/product/ProductLanding.tsx`); the closest written ICP is consulting's: organisations in "restructuring, merger, culture shift, scaling" where "the human side… is being underserved" (`content/referral-email-template.md`). *Whether that consulting ICP is the same person who self-serves a $49 tool is unknown — Assumption.*
- **The founder (Erik)** — solo operator, licensed psychologist, supported by an AI assistant for content/build. The go-to-market plan assigns nearly every task to "Erik" (`content/next-steps-plan.md`).
- **The product** — a Supabase + Claude pipeline that runs CLEAR phases; free tier delivers Clarify + a Leverage *teaser*, with Leverage-full, Experiment, and Research gated to paid/unlock (`docs/unit-economics.md`).
- **Acquisition channels** — Google Ads (Germany), LinkedIn organic, referrals, and a free assessment — all currently configured for the **consulting** funnel (`content/next-steps-plan.md`).
- **Payment** — Stripe subscriptions and one-off unlocks (`src/config/billing.ts`).

The intended path: **discover → sign up free → upload a challenge + docs → run free Clarify + Leverage teaser → hit the paywall → unlock ($200) or subscribe ($49–$999) → export.** (`src/pages/product/ProductLanding.tsx`, `docs/unit-economics.md`.)

---

## Observable behaviours that drive the outcome

**Customer behaviours (currently hypothetical — no real users yet → Assumption/Gap):**
- Lands on `/product` or `/pricing` from a channel — *frequency unknown, no traffic data (Gap)*.
- Signs up for the free tier.
- Uploads a behaviour-change challenge + up to 15 docs / 80k chars (`docs/unit-economics.md`) and runs Clarify + the Leverage teaser.
- At the paywall, either unlocks one report, subscribes, or leaves.
- (Later) returns to run a second project — *retention behaviour, no data (Gap)*.

**Founder behaviours (documented as planned → Verified-as-planned):**
- Publishes 5 LinkedIn posts across 2 weeks, ~30 min each (`content/next-steps-plan.md`, `content/linkedin-posts.md`).
- Sends 20 personalised referral emails, ~2 hours total (`content/next-steps-plan.md`, `content/referral-email-template.md`).
- Runs Google Ads at €50/day (€700 over 2 weeks) in Germany (`content/next-steps-plan.md`).

The asymmetry is the core diagnostic: **founder acquisition effort is well specified, but every downstream customer behaviour is unobserved** because instrumentation isn't live and there are no real users.

---

## COM-B barriers and enablers

| COM-B component | Current state | Evidence (quote) | Source | Tag |
|---|---|---|---|---|
| **Capability — Physical** | Product makes the analysis itself near-effortless; upload is browser-native and free | "get a clear objective, a systems map, and the highest-leverage points to act on, **in minutes, not months**"; "Document text extraction and dictation are browser-native and cost nothing" | `ProductLanding.tsx`; `docs/unit-economics.md` | Verified |
| **Capability — Physical** | Unknown whether a first-time user can frame a "behaviour-change challenge" well enough to get a useful result | — (no research; blank-page/first-run friction unmeasured) | — | Gap |
| **Capability — Psychological** | The interpretive payoff (COM-B barriers with evidence) sits *behind* the paywall, so free users may not grasp the value before being asked to pay | "Unlock the full report — COM-B barriers with evidence, gap log, and discovery activities" | `ProductLanding.tsx` | Verified (gate) / Assumption (effect on comprehension) |
| **Capability — Psychological** | Problem-awareness is asserted via an unsourced statistic; buyers may not accept the premise | "**70% of change initiatives fail.**" (no citation given in the material) | `content/linkedin-posts.md` | Assumption / Gap (source not provided) |
| **Opportunity — Physical** | Low-cost entry exists: a permanently free teaser plus a one-off unlock as an alternative to subscribing | "**The teaser is always free.** Unlock a single report one-off, or subscribe for unlimited." | `ProductLanding.tsx`; `src/config/billing.ts` | Verified (mechanism) / Assumption (price is right — "hypotheses") |
| **Opportunity — Physical** | No dedicated self-serve distribution — paid spend targets German *consulting* keywords and consulting landing pages, not `/product` | ad group "[change management consulting]…" → "Landing page: …/lp/change-management" | `content/next-steps-plan.md` | Verified |
| **Opportunity — Physical** | EU data residency is a real enabler for EU/regulated buyers | "Your documents are **processed in the EU and never used to train models**." | `ProductLanding.tsx` | Verified |
| **Opportunity — Social** | No social proof yet — testimonials and case studies are a *future* task, not live assets | "Ask 3-5 clients for testimonials (named if possible…)" (listed under later sprints) | `content/next-steps-plan.md` | Verified (absence) |
| **Opportunity — Social** | The one warm channel (referrals) sells *consulting*, not the product | "I'm currently taking on **new consulting engagements**… is there anyone in your network who might benefit?" | `content/referral-email-template.md` | Verified |
| **Motivation — Reflective** | Strong value framing against an expensive alternative | "Move your target group's behavior… **without a six-figure consultancy**" | `ProductLanding.tsx` | Verified (claim) / Assumption (buyer believes it) |
| **Motivation — Reflective** | Unknown whether buyers see a $49–$999 self-serve tool as credible for serious change work vs. a psychologist's bespoke engagement | — (no research; pricing is "hypotheses — validate before going live") | `src/config/billing.ts` | Assumption |
| **Motivation — Automatic** | The free Clarify + Leverage teaser is *designed* as the "aha" that pulls users toward unlocking — but whether it actually triggers payment is untested | STEPS: "Clarify + Leverage" → "**Unlock the full report**" | `ProductLanding.tsx` | Verified (design intent) / Assumption (effect) |

---

## The 3–5 strongest barriers, and where the leverage is

1. **No dedicated self-serve acquisition** *(Opportunity — Physical).* Every channel and euro points at the consulting funnel; the product has no on-ramp of its own. **Impact: high** (without traffic, nothing else can happen). **Ease: medium** — repointing one ad group or assessment CTA is cheap and reversible.
2. **No trust / social proof for a brand-new AI product** *(Opportunity — Social + Capability — Psychological).* A first-time buyer has no testimonials, named cases, or visible track record to lean on. **Impact: high.** **Ease: medium** — a sample report already exists (`/product/sample`), and past consulting clients are a testimonial source.
3. **Unvalidated pricing / willingness-to-pay** *(Opportunity — Physical + Motivation — Reflective).* Prices are explicit hypotheses and 0 customers have paid. **Impact: high.** **Ease: easy** — presentation of the $200 unlock vs. subscription can be tested without re-pricing.
4. **Unproven activation "aha"** *(Motivation — Automatic + Capability — Physical).* The free teaser is *assumed* to create desire to unlock; there's no evidence it does, or that users even reach it. **Impact: high.** **Ease: medium** — needs real users plus instrumentation.
5. **Instrumentation not live** *(enabler / Gap).* Google Ads conversion labels are placeholders and the GA4 baseline table is blank (`content/next-steps-plan.md` l.11, l.58–67), so none of the above can currently be measured. **Impact: high (gates all learning).** **Ease: easy** — it's Sprint 0 work.

**Highest-impact leverage:** self-serve *acquisition* and *trust*. **Easiest to change:** *instrumentation*, *pricing presentation*, and *publishing the existing sample report / proof*. The pragmatic sequence is to fix the easy enablers (instrumentation, proof, pricing presentation) first so the harder bets (acquisition, activation) become measurable.

---

## Gaps & unknowns — discovery still needed

- **Zero customer research.** No interviews, surveys, or session data from real target users — so all motivation/capability claims above are assumptions.
- **No funnel analytics.** Signup, activation, and free→paid rates are unmeasured; drop-off points are unknown.
- **ICP not separated.** It's unconfirmed that the self-serve buyer is the same person as the consulting ICP (`referral-email-template.md`); the self-serve buyer may be a smaller team or individual practitioner.
- **Willingness-to-pay untested** at every price point (0 paid conversions).
- **The "70% fail" premise is unsourced** in the material and may not persuade a sceptical buyer.
- **Activation "aha" unproven** — no evidence the free teaser converts interest into payment, or that users reach it at all.
