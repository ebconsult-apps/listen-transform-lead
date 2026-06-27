# Self-serve pricing — decision memo

**Status:** launch experiment, not validated pricing · **Owner:** product
**Source of truth for prices:** `src/config/billing.ts` (this memo explains the *why*)
**Last reviewed:** 2026-06

---

## TL;DR

CLEAR's self-serve ladder shipped as an explicit, untested hypothesis
(`src/config/billing.ts` — *"prices are hypotheses, validate before going live"*). Two independent
research passes — a deep-research harness run and a separate market-anchor study — converge on the
same conclusion: the **pricing architecture** was more wrong than the buyer is sophisticated. We are
adopting the defensible architecture now and treating the exact numbers as a measured test.

> **Decision.** Adopt **report credits** as the canonical value metric. Replace the **$200+ unlock
> with a $99 Report Pass**. **Remove the public $999** tier. **Raise Solo $49 → $79.** **Tighten the
> free tier** so it demonstrates value rather than functions as a workflow. Keep **Team/Agency
> boundaries experimental** until real buyer behavior confirms them.

This is the best ex-ante model from market analogues — **not** proven willingness-to-pay. The exact
prices and the Team/Agency boundaries must be validated with primary pricing research before they are
treated as settled.

---

## 1. Recommended model

**Canonical value metric: the report credit.** What this market rewards is not more logins, but more
decision-relevant analyses within a comprehensible scope. Comparable self-serve insight tools meter
on reports/sites, with seats as a *secondary* upgrade driver (see §6). "Runs" is an internal
cost/orchestration metric and reads as arbitrary to a buyer; **credits** map to how a customer thinks
(a new project, a deep update, an alternative analysis, an export-ready final report) while CLEAR
keeps internal control of true cost via the underlying orchestration.

**Launch ladder** (3 public tiers + first-paid + contact-us — on the ~3.2-tier industry norm):

| SKU | Was | Launch | Notes |
|---|---|---|---|
| **Free** | 1 proj, teaser, 10 runs, $1 cap | 1 teaser project, **3 runs**, no export/share/history | demonstrative, not productive |
| **Report Pass** (first paid) | $200+ one-off unlock | **$99** one-off full report | premium front door, not a tollbooth |
| **Solo** | $49/mo | **$79/mo**, 5 report credits | under the 3-digit cliff; signals "real tool" |
| **Team** | $299/mo | **$249/mo**, 20 pooled credits, 3 seats, collab | public, but boundaries are a hypothesis |
| ~~Business~~ | $999/mo public | **removed** | larger needs → Enterprise |
| **Agency** | — | **deferred** ($499, not public at launch) | promote only on repeat client-delivery evidence |
| **Enterprise** | — | **"Contact us"** (SSO/API/security/volume) | sales-led, not a swipe-a-card tier |

---

## 2. What changes now (this PR)

Config, packaging, copy, and the free-tier cap only:

1. **Report Pass $99** replaces the $200+ unlock (`UNLOCK_PLAN` in `src/config/billing.ts`).
2. **Public $999 Business tier removed** from `PLANS`; Enterprise "Contact us" already renders on the
   pricing page. The `business` tier remains in the type / `PRICE_IDS` so existing subscribers and the
   Stripe webhook/portal mapping still resolve.
3. **Solo $49 → $79**, **Team $299 → $249**, both relabeled in **credits** language.
4. **Free tightened**: monthly run quota 10 → 3 in
   `supabase/functions/_shared/billing/cost-cap.ts` (`DEFAULT_FREE_RUN_QUOTA`); the $1 monthly spend
   cap stays as the hard abuse backstop. Both are env-overridable, so tunable without a deploy.
5. **Credits framing** in the pricing surface (`Pricing.tsx`, `Billing.tsx`) and grid layout fixes for
   the new tier count.

---

## 3. What remains hypothesis (do not treat as settled)

- **Exact WTP per segment.** The price points are market-anchored, not measured against CLEAR's own
  buyers. $79 Solo / $249 Team / $99 Pass are launch bets.
- **The Team vs Agency boundary.** $249 Team is a normal market price (Delve Agency $299, SparkToro
  Agency $300, Semrush Guru $249.95), but it is a *dead zone* if the package is just "more usage." It
  only works with real team affordances (≥3 seats, pooled credits, sharing, history, workspaces).
- **Whether Agency ($499) should ever be public.** Deferred until there is evidence of repeat
  client-delivery usage; until then larger buyers route to Enterprise.

---

## 4. What telemetry must prove (falsifiable hypotheses)

| # | Hypothesis | Confirms it | Kills it |
|---|---|---|---|
| **H1** | Primary self-serve buyer is the solo consultant / PMM / small agency — not enterprise procurement. | Majority of first-paid from 1-seat accounts, consultant/agency domains, marketing-strategy-product titles. | First revenue needs purchasing process / multiple users / security review early → the ladder is mis-derived. |
| **H2** | The Report Pass is a front door, not the destination — it feeds subscriptions. | A reasonable share of Pass buyers convert to Solo/Team; Pass cohort lifts first-paid conversion. | Pass buyers rarely upgrade *and* their 90-day revenue trails pure-sub cohorts without better first-paid conversion. |
| **H3** | Team is a dead zone *only* if it lacks team affordances. | Conversion/expansion materially better with collab + pooled credits + seats at the same price. | Even a well-packaged Team badly underperforms Solo → the segment is genuinely weaker than assumed. |
| **H4** | The current free/teaser line gives away too much of the "aha" (or the wrong parts). | Tighter free (1 teaser project, 3 runs) + sample reports + upgrade copy holds activation while lifting paid conversion. | Activation collapses without better paid conversion → free was too stingy. |

---

## 5. What code changes are allowed before validation

**Allowed now (this PR):** pricing config, package copy, credits *language*, free-tier caps, layout.

**Gated follow-ups (each needs its own work + validation, NOT in this PR):**
- **Report-credit ledger + enforcement** — meter runs as credits in
  `supabase/functions/project-run/index.ts`. Until built, the advertised credit counts (5 / 20) are
  packaging targets, *not* hard-enforced limits (the live guardrail is still the per-tier spend cap +
  free run quota). This under-enforces in the customer's favor; it must be reconciled before credits
  are marketed as a hard cap.
- **"Report Pass creditable toward first subscription within 14 days"** — a Stripe/entitlements
  mechanic. **Do not advertise "creditable toward a subscription" in live UI until it exists** — a
  refund promise we cannot honor burns trust. The intent is recorded here and as a code comment on
  `UNLOCK_PLAN`.
- **New Stripe Prices + env** — see §8.
- **Making Agency $499 public** — deferred (§3).

---

## 6. Market anchors (spot-checked)

| Tool | Metering | Public price bands | Confidence |
|---|---|---|---|
| **SparkToro** | reports/month (seats secondary) | Free 5 reports · Personal $50 · Business $150 · Agency $300 | verified |
| **Delve AI** (Website Persona) | sites/personas | Free 1 persona · Business from $89 · Agency from $299 | verified |
| **Semrush** (SEO toolkit) | capacity/workspace | $139.95 · $249.95 · $499.95 | verified |
| **Similarweb** | use-case packages | now sales-led ("Talk to sales" + trial + self-service for individuals/small teams); older $125/$333 figures **not** re-confirmed | weak — do not cite as a hard comp |
| **Wynter** | pay-as-you-go vs subscription | PAYG priced ~50% over subscription; ~90% of customers pick the recurring plan | directional precedent for Report-Pass-as-premium |

**Read-through:** public self-serve in this category tops out around **$300–$500**; anything above
that expects a sales motion (security, integrations, premium data). A public $999 is far more likely
to function as an enterprise anchor than an effective self-serve price — hence its removal. The dense
cluster under $150 on the first paid rungs is why **$49 Solo reads as underpriced** for a full
decision report, and why **$200 as a first paid step looks aggressive** relative to ongoing access
available for $50–$150/mo elsewhere — the Report Pass at $99 resolves both.

> The deep-research harness independently confirmed (high confidence) that 4 public tiers sits above
> the ~3.2-tier norm, and (medium confidence) that metering on a usage/consumption unit rather than
> seats is the rising direction (usage-based elements in ~43–56% of SaaS; per-seat-as-primary eroding
> 64% → 57% YoY). It could **not** verify specific competitor price points or WTP — those come from
> the market-anchor study above and remain point-in-time claims.

---

## 7. Validation plan (cheapest first)

1. **Fake-door pricing test on the paywall.** Show real prices; measure click → email at **$79 vs
   $99** (Solo) and Report Pass at **$99 vs $129**. Cheapest signal on first-paid WTP before
   committing Stripe Prices.
2. **Van Westendorp / Gabor-Granger micro-survey** to a small list of *target buyers* (not the team)
   to find acceptable price ranges and the optimum per segment — closes the H1 WTP gap.
3. **Wynter-style price-perception test** — does the buyer understand the price, see the value, and
   find the levels reasonable?
4. **Team-affordance A/B** (H3): same $249 with vs without collab/pooled credits/seats.

Margins do not constrain these decisions: at ~$0.30–0.40 LLM cost/report plus Stripe fees (EEA
≈1.5% + €0.25; UK higher), the variable margin on every proposed tier is very high. The 60–80% gross
target is bounded by support, failed runs, infra, abuse, refunds, dev cost, and free-COGS — **not**
LLM spend. Optimize price to WTP and conversion, not to fear of token burn.

---

## 8. Go-live dependency (read before deploy)

**Changing a price string in `billing.ts` does not change what Stripe charges.** Actual amounts come
from Stripe **Price IDs** via `VITE_STRIPE_PRICE_*` (see `.env.example` and `supabase/README.md` §4).
New numbers (Solo $79, Team $249, Report Pass $99) require **creating new Stripe Prices** and updating
those env vars at deploy. Until then the displayed prices and the charged prices can diverge. Provision
the new Prices, point `VITE_STRIPE_PRICE_SOLO/TEAM/UNLOCK` at them, and verify a test checkout before
enabling billing in production.
