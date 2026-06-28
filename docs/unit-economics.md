# CLEAR — Unit Economics & Token Usage

_Last updated: 2026-06-27. Owner: product. This is an operating doc — update the
numbers when prompts, models, prices, or plan tiers change. Pricing rationale and
the launch-experiment caveat live in `docs/research/self-serve-pricing.md`._

## TL;DR

- Every plan is **profitable per unit**. A full 5-phase project costs
  **~$0.30–0.40** in Claude tokens at typical input sizes; a Solo seat is $79/mo.
- The product's real risk was never average cost — it was **abuse** (a single
  user running up unbounded spend). That is now bounded by **per-tier monthly
  caps, a per-run input ceiling, a pre-emptive cost check, a free-tier run
  quota, and web-search fee metering** (see _Guardrails_).
- The repo's token prices are **confirmed accurate** against current Anthropic
  pricing, so `runs.cost_usd` is trustworthy — now including web-tool fees.

## What CLEAR spends money on

All inference is Anthropic Claude, server-side in Supabase Edge Functions
(`supabase/functions/_shared/clear/live-engine.ts`). A _project_ runs up to five
phases plus an optional de-identify step. Document text extraction and dictation
are browser-native and cost nothing.

| Phase | Default model | `max_tokens` | Gate |
|---|---|---|---|
| Clarify | Sonnet 4.6 | 3,000 | any member |
| Leverage teaser | Sonnet 4.6 | 2,500 | any member (free hook) |
| Leverage **full** | Sonnet 4.6 | 6,000 (+ teaser 2,500) | paid / unlock |
| Experiment | Sonnet 4.6 | 4,000 | paid / unlock |
| Research | Sonnet 4.6 | 8,000 + web tools | paid / unlock |
| De-identify (on promote) | Haiku 4.5 | 1,200 | owner, optional |

**Prices (per 1M tokens, confirmed accurate):** Haiku `$1 / $5` · Sonnet
`$3 / $15` · Opus `$5 / $25`. Source of truth: `_shared/clear/pricing.ts`.

## Cost per phase (typical project)

Typical = a one-page challenge + two modest documents (~3.7k input tokens of
intake). Every phase re-sends the full intake; later phases also re-send prior
phases' JSON output.

| Phase | ≈ input tok | ≈ output tok | ≈ cost (Sonnet) |
|---|--:|--:|--:|
| Clarify | 4,550 | 1,200 | **$0.03** |
| Leverage teaser | 6,400 | 700 | **$0.03** |
| Leverage full _(teaser + full)_ | 7,100 | 3,500 | **$0.10** |
| Experiment | 9,550 | 2,000 | **$0.06** |
| Research _(tokens only)_ | 5,850 | 2,000 | **$0.05** |
| Research _(+ web fees + multi-hop)_ | — | — | **$0.10–0.30** |
| De-identify (per finding, Haiku) | 900 | 300 | **$0.004** |

**Per project, end-to-end:**

| Scenario | Phases | ≈ cost |
|---|---|--:|
| Light | Clarify + teaser, tiny docs | **~$0.06** |
| Typical | all 5 phases, 2 docs | **~$0.30–0.40** |
| Heavy | all 5 phases, near the 15-doc / 80k-char input ceiling, multi-hop research | **~$1–3** |

> Research is the swing factor: its `pause_turn` loop re-sends accumulated
> context up to 6× and its web-search/fetch calls carry per-request fees. Both
> are now metered into `cost_usd` and bounded by the per-run input ceiling.

## Per-plan unit economics

Plans (`src/config/billing.ts`): Free $0 · Solo $79/mo · Team $249/mo · Report
Pass $99 one-off. Public Business ($999) is retired (→ Enterprise "Contact us");
Agency ($499) is deferred. The **monthly compute cap** per tier is the abuse
backstop (env-tunable; defaults in `_shared/billing/cost-cap.ts`). These prices
are a **launch experiment** — see `docs/research/self-serve-pricing.md`.

| Plan | Price/mo | Compute cap | Typical projects to hit cap | Worst-case gross margin¹ |
|---|--:|--:|--:|--:|
| Free | $0 | **$1** + 3 runs/mo | ~3 free teasers | trial cost ≤ $1 (bounded) |
| Solo | $79 | **$20** | ~50 projects | **~$56 (71%)** |
| Team | $249 | **$60** | ~150 projects | **~$181 (73%)** |
| Report Pass | $99 one-off | (tier cap applies) | one report (~$0.40) | **~$95 (96%)** |

Business ($999) is retired from the public ladder but the tier and its **$200**
cap remain for existing subscribers (see `cost-cap.ts`).

¹ Worst case = plan price − full compute cap − Stripe fee (~2.9% + $0.30); i.e.
the floor if a customer somehow maxes the cap every month. Typical margins are
**>95%** because real usage is far below the cap. Caps sit well above each
plan's stated allowance ("a few" / "several" / "unlimited" projects).

**Legacy Business "unlimited":** the public $999 tier is retired (larger needs
route to Enterprise), but existing subscribers keep the tier, backed by a high
but finite **$200/mo fair-use cap** (~500 typical projects) — still ~77% margin
at the ceiling. Raise `BUSINESS_MONTHLY_COST_CAP_USD` for genuine outliers.

## Abuse vectors (ranked) → mitigation

| # | Vector | Before | Now |
|---|---|---|---|
| 1 | One global $25 cap for all tiers | Free could burn $25; Business blocked at $25 | **Per-tier caps** (`cost-cap.ts`) |
| 2 | Unlimited document fan-out (every phase re-sends all docs) — a 100-doc project ≈ $1.50+/run | no per-run ceiling | **Per-run input cap**: ≤15 docs, ≤80k chars → HTTP 413 (`intake-budget.ts`) |
| 3 | Research under-metering (web fees uncounted; multi-hop compounds input) | `cost_usd` too low → cap leaks | **Web-search/fetch fees folded into `cost_usd`** (`live-engine.ts`) |
| 4 | Free tier has no server-side run/project quota | "1 project" was marketing only | **Free-tier run quota** (3 generations/mo) |
| 5 | Cap checked only after spend | a single run could overshoot | **Pre-emptive projection**: reject a run that _would_ breach the cap |

## Guardrails shipped

All env-tunable, no DB migration required. Pure decision logic lives in
`_shared/billing/cost-cap.ts` and `_shared/clear/intake-budget.ts` (unit-tested);
the edge functions `project-run` and `project-research` do the DB month-sum and
call the pure checks.

- **Per-tier monthly caps** — `FREE/SOLO/TEAM/BUSINESS_MONTHLY_COST_CAP_USD`
  (defaults $1 / $20 / $60 / $200).
- **Free-tier run quota** — `FREE_MONTHLY_RUN_QUOTA` (default 3).
- **Per-run input ceiling** — `MAX_DOCUMENTS` (15) / `MAX_INTAKE_CHARS` (80k).
- **Pre-emptive cost check** — a run is rejected if `monthSpend + projectedCost`
  would exceed the tier cap.
- **Web-tool fee metering** — `WEB_SEARCH_REQUEST_FEE_USD` /
  `WEB_FETCH_REQUEST_FEE_USD` (default $0.01 each) added to each Research run.

## Residual risks / to confirm

- **Multi-account farming** of the free tier (one free workspace per signup, via
  the `handle_new_user` trigger) is bounded per-account by the $1 cap + 3-run
  quota, but not across many throwaway accounts. Mitigation is signup friction
  (email verification / abuse monitoring) — outside this codebase.
- **Report Pass on a free workspace** shares the $1 free cap. A single
  unlocked report (~$0.40) fits comfortably; for heavy unlock usage, put the
  workspace on a paid tier or raise `FREE_MONTHLY_COST_CAP_USD`.
- **Web-tool fee figure** ($0.01/request) is the historical default — confirm
  against current pricing at platform.claude.com/docs/pricing and override the
  env vars if it has changed.
- **"1 project" free claim** is enforced by cost (quota + cap), not by a hard
  project-row limit. Add a `before insert` trigger on `projects` if the literal
  claim must be enforced.
