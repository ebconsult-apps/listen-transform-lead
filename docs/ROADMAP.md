# CLEAR — Product Roadmap

**Purpose:** the single sequencing document for CLEAR (the self-serve app) and its supporting
surfaces. It says what we build next, why, in what order, and how we know it worked.
**Last updated:** 2026-07-02 · **Owner:** product (Erik) · **Maintained by:** whoever ships —
usually a Claude Code session.

> **Direction (decided 2026-07):** CLEAR product first — the consulting site remains a lead
> funnel, not a roadmap track of its own. Current state: deployed, **pre-launch**, no real paying
> customers. The 6-month goal is **product depth & quality**: make CLEAR genuinely excellent
> before pushing sales.

## How to maintain this document

- **Item IDs are stable.** `A1`, `B2`, … are never renumbered. New items take the next free
  number in their track. Completed items keep their ID and move to the changelog at the bottom.
- **Link, don't duplicate.** Three sub-backlogs live elsewhere and stay authoritative:
  [`docs/ui-audit/`](./ui-audit/README.md) (design findings),
  [`legal/REMEDIATION-CHECKLIST.md`](../legal/REMEDIATION-CHECKLIST.md) (compliance punch-list),
  [`docs/research/self-serve-pricing.md`](./research/self-serve-pricing.md) (pricing hypotheses).
  This file only carries the engineering-shaped slices of those, with pointers.
- **Gates, not dates.** Sequencing is expressed as decision gates (below). With a solo founder +
  Claude sessions as the workforce, calendar promises rot; gate conditions don't.
- **Statuses:** `todo` · `in progress` · `done` · `parked`. Update the status when a session
  ships an item; add a line to the changelog.

**Owner legend:**
**[C]** a Claude Code session can execute end-to-end ·
**[E]** Erik/ops (credentials, counsel, Stripe dashboard, or a business decision) ·
**[C+E]** code by Claude, activation/decision by Erik.
**Size:** S ≈ under half a session · M ≈ one session · L ≈ multiple sessions (split before starting).

---

## 1. Product north star — what "CLEAR genuinely excellent" means

Four pillars. Each has a measure, because "quality" without measurement decays into taste.

### 1.1 The loop closes
A user can run the whole promise: Clarify → Leverage → Experiment → **Analyse** (log what
happened against the test cards, get an AI synthesis of what the experiment showed) → **Refine**
(feed confirmed learnings back into an updated leverage map and the next experiment). Today the
pipeline dead-ends at Experiment: `Pipeline.tsx` marks Analyse/Refine "Later" and
`ExperimentTab.tsx` locks experiments with "results go in Analyse (coming next)". Closing the
loop is also what makes monthly credits *recurring* value rather than a one-shot unlock.
**Measure:** % of fully-unlocked projects that record experiment results; % that start a second
loop iteration.

### 1.2 Reports are genuinely good
Paid phases run the model matrix the economics were written for (`docs/unit-economics.md`
assumes Sonnet-class for paid phases; the engine now **defaults** every analytical phase to
Sonnet-class — `claude-sonnet-4-6` — per A3.1 below, with env-var overrides preserved so ops
can still pin a phase). Prompt/model changes are gated by a rubric-scored eval harness
(grounding in the intake, specificity, actionability, no invented stakeholders). Uploaded PDFs
and DOCX actually contribute to intake (today binary extraction is a stub).
**Measure:** eval rubric score per phase on the fixture set, tracked in-repo; run failure rate
< 2%; cost per run inside the unit-economics envelope.

### 1.3 The money path is boring
No path exists to reset quotas or double-grant value: webhooks are idempotent, credit spends are
atomic, usage counters live on tamper-proof tables — and users can *see* their credit/run
balance before they hit a wall, with an upgrade moment instead of a raw error.
**Measure:** invariant check (credit unlocks per workspace-month ≤ allotment) never fires;
replaying any Stripe event produces zero state change; every 402 in the app renders an upsell,
not an error toast.

### 1.4 It's observable
Errors reach an error tracker (SPA + edge functions), the activation/paywall funnel emits
product analytics, and the research worker can't wedge silently. The pricing memo's hypotheses
H1–H4 are answerable from real event data, not anecdotes.
**Measure:** the H1–H4 dashboard queries return data from a staging walkthrough; wedged research
runs alert within minutes, not on the next user poll.

---

## 2. Decision gates (the sequencing spine)

| Gate | Condition | What it unblocks |
|---|---|---|
| **G1 — Money-path integrity** | Track item B1 merged & deployed (runs-table tamper-proofing, Stripe idempotency, atomic credit spend) | Any real-money go-live; pricing experiments |
| **G2 — Legal Tier-0** | All Tier-0 boxes in [`legal/REMEDIATION-CHECKLIST.md`](../legal/REMEDIATION-CHECKLIST.md) checked (ToS gate, DPAs, DSR process, refund policy, EUR/VAT display, Anthropic-transfer reconciliation) | **Opening paid EU sign-ups.** Hard rule: *no paid EU sign-up until G1 + G2, regardless of product readiness.* |
| **G3 — Observability live** | B5 shipped (error tracking + product analytics emitting the funnel events) | Pricing validation (D2), funnel-wiring ROI claims (D1 can ship earlier, but can't be evaluated) |
| **G4 — Loop closed** | A1 (Analyse) + A2 (Refine v1) shipped | Shifting the center of gravity from product depth to growth/GTM spend |

---

## 3. Horizons at a glance

| Horizon | Focus | Items |
|---|---|---|
| **Now** (≈ 0–6 weeks) | Integrity + start the loop | B1 (this PR), A4, A5, A1a, C1, C2 |
| **Next** (≈ 6 weeks–3 months) | Close the loop, see clearly | A1b, A1c, A2, A3, B5, B2, C3, C5 |
| **Later** (≈ 3–6 months) | Hardening + first growth moves | B3, B4, C4, D1, D3, D2 (after G3) |
| **Horizon 2** (6–12 months) | Compounding value | team-workspace depth, knowledge-base flywheel, doc-extraction v2, self-service DSR export/erasure, Agency tier (pending D2 evidence) |

---

## 4. Track A — Product depth (the priority track)

### A1 — Analyse phase (epic — split; do not attempt in one session) `[C, L]` · `todo`
The single biggest gap between what CLEAR promises and what it does.

- **A1a — Schema + engine.** `experiment_results` table (one row per test card: observed
  outcome, metric value, status met/partial/missed/abandoned, notes), new `analyse` run phase in
  `project-run`, engine prompt + fixture + stub output, mock-store entries per the CLAUDE.md
  data-seam rule. *DoD:* `project-run` accepts `phase:"analyse"` (409 until results exist); unit
  tests for prompt assembly; fixtures render.
- **A1b — UI.** Results-entry on `ExperimentTab` test cards; an Analyse view rendering the
  synthesis (what was learned; which `assumption_gaps` were confirmed/refuted — write
  resolutions back to the gap log); `Pipeline.tsx`/`WorkflowStepper` unlock the step. *DoD:*
  dev-mock walkthrough shows a seeded project reaching an analysed state.
- **A1c — Loop plumbing.** Analyse output folds into intake on subsequent runs (same pattern as
  accepted research findings in `project-run`). *DoD:* integration gate test; re-run visibly
  incorporates learnings.

### A2 — Refine v1 `[C, M]` · `todo`
A guided re-run: carry confirmed learnings forward, regenerate the leverage map, and show a
**diff against the previous map** (what rose, what fell, what's new). Billing decision (recorded
here so it doesn't reopen): a refine re-run on an unlocked project consumes **no** new credit —
the project unlock already covers it, matching current `project_unlocks` semantics.

### A3 — Report quality `[C+E, M]` · `in progress`
1. **Model matrix flip** — **`done (code) 2026-07-13`.** The engine's code DEFAULTS now match
   the documented Sonnet matrix (`claude-sonnet-4-6` for Clarify/Leverage/Experiment/Research;
   Haiku 4.5 for De-identify) — `live-engine.ts`, `pricing.ts` (`modelForPhase`),
   `research-worker.yml`. Env overrides (`CLARIFY_MODEL`, …) are preserved. **[E] remaining:**
   **unset** any per-phase Supabase secret still pinned to `claude-haiku-4-5` from the
   e2e-verification period so the Sonnet default applies (see `supabase/README.md` §3), and set
   the GitHub Actions `RESEARCH_MODEL` variable to `claude-sonnet-4-6` (or leave unset — the
   workflow now falls back to Sonnet). Cost impact is within the `docs/unit-economics.md`
   envelope (that table already assumed Sonnet).
2. **Eval harness** — **`done 2026-07-13`.** Rubric-scored harness in `evals/` (grounding,
   specificity, actionability, no fabricated entities, gap-honesty) over 3 fixture intakes;
   `npm run eval` (live, LLM judge) / `npm run eval:offline` (deterministic, no network);
   plumbing gated in CI by `evals/harness.test.ts` under `npm test`. Docs: `docs/evals.md`.
3. **Real document extraction [C]:** PDF/DOCX/XLSX already extract **browser-native** on both
   the owner and respondent upload paths (`src/lib/extract-text.ts`, reused by `db.ts` and
   `collab.ts`) and flow into intake — the `DOC_EXTRACT_MODE=live` server-side extractor from
   the collaboration design spec was never built. Residual gap = a **server-side fallback** (for
   clients that can't/won't extract) which also removes the B4 "trust client `extractedText`"
   surface. File-level plan + effort estimate: `docs/doc-extraction-plan.md`.

### A4 — Credits & caps become visible `[C, M]` · `done (2026-07-02)`
Dashboard shows runs/credits remaining (`getUsageSummary()` in `src/lib/db.ts` — with its
sibling reads, not billing.ts — + mock-store entry per the data seam); hitting a cap renders the
UpsellDialog with the server's message instead of a raw error toast (run.ts now unwraps invoke
errors via `src/lib/invoke-error.ts`); credit pill in the product header. *DoD met:* free-tier
cap hit in mock mode (empty dataset) opens the upsell modal — Playwright-verified.

### A5 — Dead-end sweep `[C, S]` · `done (2026-07-02)`
Remove the set-password UI from `Account.tsx` (login is passwordless-only); dedupe the two
sample surfaces (`src/pages/product/Sample.tsx` vs `src/pages/app/SampleProject.tsx`);
`Pricing.tsx` "Start free" should route authed users to `/app`; fix the marketing footer's dead
`href="#"` Privacy/Terms links (`src/components/Layout.tsx`) to the real legal pages (overlaps C-track).

---

## 5. Track B — Trust & reliability

### B1 — Billing & data integrity pack `[C, M]` · `done (PR #87, merged 2026-07-02)`
Closes the four verified money-path holes: members could DELETE their own `runs` rows and reset
quota/spend accounting (RLS was `for all`); Stripe webhook had no event dedup (replays create
duplicate `report_passes`); pass-credit application was read-then-write (double-apply race);
credit spend was count-then-upsert (concurrent over-grant). Adds the missing hot-path indexes
and stops echoing raw internal error messages from edge functions. *DoD:* integration tests
prove members can't update/delete runs, duplicate events/passes are rejected, concurrent spends
grant exactly one credit.

### B2 — Research pipeline reliability `[C, M]` · `todo`
The async research worker (GitHub Actions via `workflow_dispatch`) is fire-and-forget: add a
stale-run sweeper (fail runs stuck `running` past a TTL and surface them), a PAT-expiry canary,
and pin the worker checkout to the deployed ref instead of `main` (version skew). *DoD:* killing
a worker mid-run leaves the project recoverable without user action.

### B3 — Rate limiting `[C, M]` · `todo`
Per-token bucket on the public `respondent` function; per-user limits on `project-run` /
`project-research`. A simple Postgres counter table is enough — no new infra.

### B4 — Respondent input hardening `[C, M]` · `todo`
Server-side size/MIME gate on `upload-url`; stop trusting client-supplied `extractedText` for
binary types; wrap all untrusted intake (respondent text, uploaded doc text) in explicit
delimiters with an instruction that it is data, not instructions (prompt-injection surface into
the owner's report).

### B5 — Observability + product analytics `[C+E, M]` · `todo` · **gate G3**
Error tracking for SPA (+ edge functions): `ErrorBoundary.componentDidCatch` is the documented
single wiring point. Product analytics (EU-friendly vendor or self-hosted) emitting the funnel:
signup → first project → clarify approved → teaser viewed → paywall viewed/clicked → unlock
(credit vs pass) → experiment locked → analyse completed. The event taxonomy is dictated by the
pricing memo's H1–H4. [E]: vendor choice + DSN/keys.

---

## 6. Track C — Launch readiness (EU)

Authoritative list: [`legal/REMEDIATION-CHECKLIST.md`](../legal/REMEDIATION-CHECKLIST.md).
Only the engineering-shaped items get IDs here. **Gate G2 blocks paid EU sign-ups.**

- **C1 — ToS acceptance gate** `[C, M]` · `todo` — versioned "I agree" at signup; mirror the
  privacy-acceptance pattern (`src/lib/db.ts`, migration `20260625120000_privacy_acceptance.sql`).
- **C2 — EUR, VAT-inclusive price display + refund policy page** `[C+E, M]` · `todo` — pricing
  surfaces show EUR incl. VAT (today: `$` shown, EUR charged); publish the refund/cancellation
  policy; Stripe Tax settings are [E].
- **C3 — "AI-generated" transparency label** on report surfaces (EU AI Act Art. 50) `[C, S]` · `todo`.
- **C4 — Data retention/purge + DSR** `[C+E, M]` · `todo` — retention TTLs + purge jobs,
  per-project/account deletion; doubles as the DSR-erasure capability. Self-service export is
  Horizon 2.
- **C5 — Stripe production go-live** `[E+C, S]` · `todo` · **gated on G1+G2** — run the updated
  `scripts/stripe-setup.mjs` (new ladder), set `VITE_STRIPE_PRICE_*` + edge secrets, live
  webhook endpoint, one real end-to-end purchase and refund. Until then displayed and charged
  prices can diverge (see pricing memo §8).

Non-engineering Tier-0 items (vendor DPAs, counsel sign-offs, DSR intake address) are **[E]**
and tracked only in the checklist.

---

## 7. Track D — Growth & validation (ship after G4, measure after G3)

- **D1 — Marketing → product funnel wiring** `[C, M]` · `todo` — today the consulting site links
  to the CLEAR app **nowhere** (grep-verified). Add product nav/CTAs to the marketing
  header/footer; route assessment-quiz results into a "run this through CLEAR" on-ramp; point
  whitepaper thank-you pages at the sample report.
- **D2 — Pricing validation** `[C+E, M]` · `todo` · **needs G3** — instrument and read H1–H4
  from [`docs/research/self-serve-pricing.md`](./research/self-serve-pricing.md) §4/§7 (fake-door
  price test, Pass→subscription conversion, Team-affordance A/B, Agency fake-door). Review
  cadence is [E].
- **D3 — UI polish** `[C]` · `todo` — first the ~7 global fixes from
  [`docs/ui-audit/`](./ui-audit/README.md) (real display font, single accent color, button
  `:active`/`:focus-visible`, em-dash sweep, WCAG-AA contrast, the broken hero gradient in
  `Hero.tsx`, the JS-gated `opacity:0` reveal), then the tiered sweeps. The audit stays the
  sub-backlog; don't copy its 433 findings here.
- **D4 — GTM owner track** `[E]` · `todo` — the consulting go-to-market sprints live in
  [`content/next-steps-plan.md`](../content/next-steps-plan.md). Only code dependency: real
  Google Ads conversion labels in `src/config/site.ts`.

---

## 8. Explicitly parked (decisions, not neglect)

- **Dark mode** — `darkMode: ['class']` is wired but no `.dark{}` block exists; decide only if
  users ask. Until then it's dead config, not a bug.
- **Agency tier ($499)** — deferred by the pricing memo until repeat client-delivery evidence
  (D2 fake-door first).
- **Voice dictation on the respondent portal** — stub stays until demand.
- **Consulting-site redesign** — the site converts as a funnel; only D1 touches it.
- **Business tier ($999)** — retired from the public ladder; legacy subscribers only.

---

## 9. Changelog

- **2026-07-02** — A4 + A5 shipped: usage strip on the Dashboard, header credit pill,
  UpsellDialog on 402 (server message preserved end-to-end via `invoke-error.ts`), free-run
  quota mirror, mock-mode quota enforcement on the empty dataset; dead-end sweep (set-password
  UI removed, samples deduped via `SampleReport`, authed Pricing CTA, `/privacy` page + footer
  links, dead Terms anchor removed pending C1).
- **2026-07-01** — Roadmap created. B1 (billing & data integrity pack) implemented in the same
  PR: runs-table RLS tightened to insert-only, hot-path indexes, `stripe_events` idempotency
  ledger, `report_passes` payment-intent dedup, atomic `spend_report_credit` RPC, safe edge
  error messages, Stripe setup script + `.env.example` drift fixes.
