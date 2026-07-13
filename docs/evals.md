# CLEAR report-quality eval harness

_Owner: product. Lives in [`/evals`](../evals). Gates ROADMAP A3.2: "prompt/model
changes are gated by a rubric-scored eval harness." Last updated 2026-07-13._

A paying customer must be **happy** about a EUR 100-200 report. "Happy" is not a
vibe — it decomposes into five measurable properties of each phase output. This
harness generates phase outputs from fixed intake fixtures using the **real engine
prompt-assembly code paths**, then scores them against a rubric with an LLM judge,
so a prompt tweak or a model swap that quietly degrades quality shows up as a
number before it reaches a customer.

## The rubric

Five dimensions, each scored **1-5** (defined in [`evals/rubric.ts`](../evals/rubric.ts)):

| Dimension | A 5 looks like |
|---|---|
| **grounding** | Every substantive claim traces to something the intake states (challenge, target group, stakeholders, documents, accepted research). Nothing asserted the intake can't support. |
| **specificity** | Reads unmistakably about *this* org — its behaviours, actors, numbers — not generic advice ("raise awareness", "communicate more") that fits anyone. |
| **actionability** | Concrete, testable next steps: measurable KRs, named COM-B barriers, smallest-reversible experiments, specific discovery activities. |
| **no_fabrication** | Zero invented stakeholders, metrics, quotes, citations, or dates. A hard fact appears only if it's intake-backed or explicitly flagged. |
| **gap_honesty** | Unknowns are surfaced in `gapLog` with a valid flag type, not papered over. *(The dimension the phase prompts themselves imply — every CLEAR prompt opens with the never-fabricate banner and carries a gapLog spec.)* |

The first four are named directly by ROADMAP A3.2; `gap_honesty` was added because the
prompts treat "flag the unknown instead of inventing it" as a first-class rule.

### Pass rule

A phase **passes** when every dimension is `>= 3` **and** `no_fabrication >= 4`.
Fabrication is the cardinal sin, so a beautifully specific, actionable report that
invents one statistic still fails — that's deliberate (`aggregate()` in `rubric.ts`).

## Running it

```sh
# Offline — deterministic heuristic judge over pre-recorded outputs. No API key,
# no network. This is the CI-safe smoke that proves the harness plumbing works.
npm run eval:offline

# Live — generate each phase with the real prompts + production models, then score
# with a strong LLM judge (Opus by default). Needs ANTHROPIC_API_KEY.
npm run eval

# Useful flags (after `--`):
npm run eval -- --fixture=saas-churn --phase=clarify   # scope to one cell
npm run eval -- --record                               # save generated outputs to evals/recorded/
npm run eval:offline -- --no-fail                      # report without a non-zero exit
node_modules/.bin/vite-node evals/run-eval.ts -- --list # list fixtures + phases
```

Results are written to `evals/results/<mode>-<timestamp>.json` (git-ignored) and a
human-readable table is printed. The runner exits non-zero if any phase fails the
pass rule (unless `--no-fail`), so it can back a manual gate.

### Two judges, on purpose

- **LLM judge** (`npm run eval`) — the real quality signal. A strong model reads the
  intake + output and scores each dimension with a justification and a list of
  specific failures (untraceable claims, invented entities). Judge model defaults to
  `claude-opus-4-8`; override with `EVAL_JUDGE_MODEL`.
- **Offline heuristic judge** (`npm run eval:offline`, and the CI test) — a
  deterministic, network-free scorer. It is **crude by design**: it checks that the
  numbers/entities in an output actually appear in the intake, that the output echoes
  distinctive intake vocabulary, that the structure carries testable items, and that
  the gapLog is real and well-typed. Its job is to (a) exercise the whole pipeline
  without a key and (b) catch *blatant* fabrication — **not** to replace the LLM
  judge's nuance. Treat offline scores as a smoke signal; treat LLM scores as the
  quality bar. (Known crudeness: the offline judge counts 0-100 confidence scores as
  "claim numbers", so grounding on the leverage phases reads a touch low — the LLM
  judge doesn't make that mistake.)

## Fixtures

Three diverse intake sets ([`evals/fixtures`](../evals/fixtures)), chosen so a report
that reaches for generic SaaS/nudge boilerplate visibly fails specificity on the
non-SaaS ones:

- `saas-churn` — B2B SaaS trial-to-paid churn (digital funnel, hard numbers).
- `hospital-hand-hygiene` — clinical infection-prevention compliance (non-digital).
- `manufacturing-safety` — near-miss under-reporting (the good report treats rising
  reports as a *leading indicator*, and must not invent injury stats).

Each fixture embeds concrete baseline numbers in its intake so grounding/no_fabrication
are testable, and a resource envelope for the EXPERIMENT phase (APEASE needs one).

### Recorded outputs (offline fixtures)

`evals/recorded/<fixture>.<phase>.json` are checked-in phase outputs the offline path
and the CI test score without a network call. The repo ships a **hand-crafted,
grounded** set for `saas-churn` across all four phases (no API key was available when
the harness was built, so the offline path is the proven one). To refresh or extend
them from live generations once a key is available:

```sh
ANTHROPIC_API_KEY=sk-ant-... npm run eval -- --record          # all fixtures/phases
ANTHROPIC_API_KEY=sk-ant-... npm run eval -- --fixture=hospital-hand-hygiene --record
```

Phases scored: `clarify`, `leverage_teaser`, `leverage_full`, `experiment`. **Research
is out of harness scope** — its quality is dominated by live web-search/fetch citations
driven by the edge function's tool loop, which the harness can't fairly reproduce; it
stays gated by the same rubric conceptually via the edge path.

## When a change requires a re-run

Re-run `npm run eval` (live) and compare to the previous `evals/results` before
merging when you change **any** of:

- a phase system prompt or the intake/envelope rendering in
  `supabase/functions/_shared/clear/prompts.ts`;
- a phase's default **model** or `max_tokens` in `live-engine.ts` / `pricing.ts`
  (e.g. the A3.1 Sonnet flip — re-run to confirm quality held/improved);
- the engine's per-phase user-message assembly (mirror the change in
  [`evals/engine-adapter.ts`](../evals/engine-adapter.ts), then re-run);
- the rubric or judge itself (then also re-baseline the recorded fixtures).

`npm run eval:offline` runs with no key and no network, and the plumbing (rubric
parsing, score aggregation, fixture loading, offline scoring) is covered by
`evals/harness.test.ts` under `npm test` — so CI validates the harness on every push
even without secrets. The live rubric run is the gate a human reads before shipping a
prompt/model change.

## How to read a result

```
[PASS] saas-churn / clarify   overall 4.6  min 4  (llm claude-opus-4-8)
    5  grounding        ...
    4  specificity      ...
    ✗ "target of 40% activation is asserted without an intake baseline for it"
```

- **overall** = mean across dimensions; **min** = the binding constraint (fix this
  first). **PASS/FAIL** applies the pass rule above.
- The `✗` lines are the judge's specific, quotable failures — the actionable part.
  A dropping `min` on `grounding`/`no_fabrication` between runs is the early warning
  that a prompt/model change started letting the model invent; investigate before
  merging.
