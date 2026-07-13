// Judges score a phase output against the rubric and return a RubricScore.
//
// - llmJudge   : the real scorer used by `npm run eval` — a strong model (Opus by
//                default) reads the intake + output and scores each dimension.
// - offlineJudge: a deterministic, network-free heuristic scorer used by
//                `npm run eval:offline` and the CI test. It is crude by design —
//                its job is to exercise the whole pipeline (extraction →
//                per-dimension scoring → aggregation → pass/fail) without an API
//                key, and to catch blatant fabrication — NOT to replace the LLM
//                judge's nuance. Treat offline scores as a smoke signal.
// - stubJudge  : fixed scores, for unit-testing aggregation/parsing.

import { callMessages, extractJson } from "./anthropic.ts";
import {
  aggregate,
  buildJudgePrompt,
  type DimensionScore,
  parseJudgeResponse,
  RUBRIC,
  type RubricScore,
} from "./rubric.ts";

export interface JudgeInput {
  phase: string;
  fixture?: string;
  intakeText: string;
  /** The parsed phase output (object). */
  output: unknown;
}

export type Judge = (input: JudgeInput) => Promise<RubricScore>;

// ── LLM judge ────────────────────────────────────────────────────────────────

export function llmJudge(opts: { model?: string } = {}): Judge {
  const model = opts.model ?? process.env.EVAL_JUDGE_MODEL ?? "claude-opus-4-8";
  return async ({ phase, fixture, intakeText, output }) => {
    const { system, user } = buildJudgePrompt(phase, intakeText, JSON.stringify(output, null, 2));
    const res = await callMessages({ system, user, model, maxTokens: 1500 });
    if (res.stopReason === "max_tokens") {
      throw new Error(`Judge output truncated at max_tokens for phase ${phase}`);
    }
    const raw = extractJson<{ dimensions?: unknown; failures?: unknown }>(res.text);
    const { dimensions, failures } = parseJudgeResponse(raw);
    return aggregate(phase, dimensions, { fixture, judge: "llm", model, failures });
  };
}

// ── Offline heuristic judge ──────────────────────────────────────────────────

/** 2+ digit or percentage tokens — the "claim-like" numbers worth grounding. */
function claimNumbers(s: string): string[] {
  const out: string[] = [];
  for (const m of s.matchAll(/\d[\d,]*(?:\.\d+)?%?/g)) {
    const raw = m[0];
    const digits = raw.replace(/[^\d]/g, "");
    if (raw.includes("%") || digits.length >= 2) out.push(raw.replace(/,/g, ""));
  }
  return out;
}

const DOMAIN_ALLOW = new Set(
  [
    "Key Results",
    "COM-B",
    "APEASE",
    "CLEAR",
    "High",
    "Medium",
    "Low",
    "Pass",
    "Flag",
    "Fail",
    "Capability",
    "Opportunity",
    "Motivation",
  ].map((s) => s.toLowerCase()),
);

/** Multi-word Capitalised phrases that look like invented org/person/product names. */
function candidateNames(s: string): string[] {
  const out: string[] = [];
  for (const m of s.matchAll(/[A-Z][a-zA-Z0-9&.'-]+(?:\s+[A-Z][a-zA-Z0-9&.'-]+){1,3}/g)) {
    const phrase = m[0].trim();
    if (!DOMAIN_ALLOW.has(phrase.toLowerCase())) out.push(phrase);
  }
  return out;
}

const GENERIC_FILLER = [
  "raise awareness",
  "communicate more",
  "best practice",
  "best practices",
  "stakeholder buy-in",
  "synergy",
  "synergies",
  "think outside the box",
  "low-hanging fruit",
  "move the needle",
  "world-class",
];

const round2 = (n: number) => Math.round(n * 100) / 100;
const clamp15 = (n: number) => Math.max(1, Math.min(5, n));
const ratioToScore = (r: number) => clamp15(Math.round(1 + r * 4));

function contains(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

/** Salient lowercase words from the intake, for the specificity echo check. */
function intakeTerms(intake: string): Set<string> {
  const stop = new Set(
    "the a an and or of to in on for with our we you your they their this that is are be as at by from it its will can may not no more most less than then into over under about".split(
      /\s+/,
    ),
  );
  const terms = new Set<string>();
  for (const w of intake.toLowerCase().match(/[a-z][a-z-]{4,}/g) ?? []) {
    if (!stop.has(w)) terms.add(w);
  }
  return terms;
}

function scoreGrounding(intake: string, out: string): DimensionScore {
  const nums = claimNumbers(out);
  if (nums.length === 0) {
    return { dimension: "grounding", score: 4, notes: "No claim-like numbers to trace; scored neutral-high." };
  }
  const supported = nums.filter((n) => intake.includes(n)).length;
  const ratio = supported / nums.length;
  return {
    dimension: "grounding",
    score: ratioToScore(ratio),
    notes: `${supported}/${nums.length} claim-numbers appear in the intake.`,
  };
}

function scoreNoFabrication(intake: string, out: string, hasGapLog: boolean): DimensionScore {
  const nums = claimNumbers(out);
  const unsupportedNums = nums.filter((n) => !intake.includes(n));
  const names = candidateNames(out);
  const unsupportedNames = names.filter((n) => !contains(intake, n));
  const total = nums.length + names.length;
  const problems = unsupportedNums.length + unsupportedNames.length;
  // Rate-based, not count-based: a well-grounded report that introduces a few
  // legitimate *targets* (new numbers by nature) should not be punished like one
  // that is mostly invented. A gapLog (flagging instead of asserting) earns a small
  // benefit of the doubt. A small output that is mostly unsupported specifics tanks.
  const rate = total ? problems / total : 0;
  let score = 5 - rate * 5 + (hasGapLog ? 0.5 : 0);
  score = clamp15(Math.round(score));
  const notes =
    problems === 0
      ? "No unsupported numbers or invented-looking names."
      : `${problems}/${total} specifics unsupported: ${[...unsupportedNums, ...unsupportedNames].slice(0, 4).join(", ")}`;
  return { dimension: "no_fabrication", score, notes };
}

function scoreSpecificity(intake: string, out: string): DimensionScore {
  const terms = intakeTerms(intake);
  const outLc = out.toLowerCase();
  let echoed = 0;
  for (const t of terms) if (outLc.includes(t)) echoed++;
  const coverage = terms.size ? echoed / terms.size : 0;
  const filler = GENERIC_FILLER.filter((f) => outLc.includes(f)).length;
  // Coverage of distinctive intake terms drives the score; generic filler drags it down.
  let score = 1 + Math.min(1, coverage / 0.35) * 4 - filler;
  score = clamp15(Math.round(score));
  return {
    dimension: "specificity",
    score,
    notes: `Echoes ${echoed} distinctive intake terms; ${filler} generic-filler phrase(s).`,
  };
}

/** Loose view of a phase output — the harness scores arbitrary model JSON. */
interface PhaseOutputShape {
  keyResults?: unknown;
  topLeveragePoints?: unknown;
  headline?: unknown;
  systemsMapSummary?: unknown;
  strongestBarriers?: unknown;
  discoveryActivities?: unknown;
  interventionCandidates?: unknown;
  gapLog?: unknown;
}

const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const rec = (v: unknown): Record<string, unknown> =>
  v && typeof v === "object" ? (v as Record<string, unknown>) : {};

function scoreActionability(phase: string, output: unknown): DimensionScore {
  const o = rec(output) as PhaseOutputShape;
  let score = 3;
  let notes = "";
  if (phase === "clarify") {
    const krs = arr(o.keyResults);
    const measured = krs.filter((k) => {
      const kr = rec(k);
      return Boolean(kr.metric || kr.target || kr.baseline);
    }).length;
    const inRange = krs.length >= 3 && krs.length <= 5;
    score = clamp15((inRange ? 3 : 2) + Math.round((measured / Math.max(1, krs.length)) * 2));
    notes = `${krs.length} KRs, ${measured} with a metric/target/baseline.`;
  } else if (phase === "leverage_teaser") {
    const pts = arr(o.topLeveragePoints);
    score = clamp15((pts.length === 3 ? 3 : 2) + (o.headline ? 1 : 0) + (o.systemsMapSummary ? 1 : 0));
    notes = `${pts.length} leverage points; headline ${o.headline ? "present" : "missing"}.`;
  } else if (phase === "leverage_full") {
    const pts = arr(o.topLeveragePoints);
    const strong = arr(o.strongestBarriers);
    const disc = arr(o.discoveryActivities);
    score = clamp15(
      (pts.length >= 5 ? 2 : 1) + (strong.length >= 3 ? 2 : 1) + (disc.length >= 1 ? 1 : 0),
    );
    notes = `${pts.length} points, ${strong.length} strongest barriers, ${disc.length} discovery activities.`;
  } else if (phase === "experiment") {
    const cands = arr(o.interventionCandidates);
    const described = cands.filter((c) => {
      const cc = rec(c);
      return Boolean(cc.description && cc.apease && cc.barrier);
    }).length;
    // Discrimination: a good APEASE screen parks at least one idea on a veto gate.
    const parked = cands.some((c) => {
      const apease = rec(rec(c).apease);
      return [apease.acceptability, apease.safety, apease.equity].includes("fail");
    });
    score = clamp15((described >= 2 ? 3 : 1) + (parked ? 1 : 0) + (cands.length >= 3 ? 1 : 0));
    notes = `${cands.length} candidates, ${described} fully specified; ${parked ? "≥1 vetoed" : "none vetoed"}.`;
  } else {
    return { dimension: "actionability", score: 3, notes: "Unknown phase; default actionability 3." };
  }
  return { dimension: "actionability", score, notes };
}

function scoreGapHonesty(phase: string, output: unknown): DimensionScore {
  const o = rec(output) as PhaseOutputShape;
  const valid = new Set([
    "assumption",
    "gap",
    "input_needed",
    "user_input",
    "needs_input",
    "requires_confirmation",
  ]);
  // The teaser schema carries no gapLog; credit its assumption flags instead.
  if (phase === "leverage_teaser") {
    const flagged = arr(o.topLeveragePoints).some((p) => Boolean(rec(p).assumptionBased));
    return {
      dimension: "gap_honesty",
      score: flagged ? 4 : 3,
      notes: flagged
        ? "Flags at least one assumption-based leverage point."
        : "No explicit assumption flags (teaser has no gapLog).",
    };
  }
  const log = arr(o.gapLog);
  if (log.length === 0) {
    return { dimension: "gap_honesty", score: 1, notes: "No gapLog — unknowns not surfaced." };
  }
  const wellTyped = log.filter((g) => {
    const gg = rec(g);
    return (
      typeof gg.type === "string" &&
      valid.has(gg.type) &&
      typeof gg.content === "string" &&
      gg.content.length > 8
    );
  }).length;
  const ratio = wellTyped / log.length;
  // Reward a real, well-typed gapLog; lightly penalise a giant catch-all list.
  const size = log.length > 10 ? -1 : 0;
  const score = clamp15(Math.round(2 + ratio * 3 + size));
  return {
    dimension: "gap_honesty",
    score,
    notes: `${wellTyped}/${log.length} gap entries well-typed.`,
  };
}

/**
 * Deterministic, network-free scorer. Returns the same RubricScore shape as the
 * LLM judge so downstream aggregation/reporting is identical.
 */
export const offlineJudge: Judge = async ({ phase, fixture, intakeText, output }) => {
  const outStr = JSON.stringify(output ?? {});
  const hasGapLog = arr(rec(output).gapLog).length > 0;
  const dims: DimensionScore[] = [
    scoreGrounding(intakeText, outStr),
    scoreSpecificity(intakeText, outStr),
    scoreActionability(phase, output),
    scoreNoFabrication(intakeText, outStr, hasGapLog),
    scoreGapHonesty(phase, output),
  ];
  // Guard: dims must cover the rubric (keeps offline + llm judges in lockstep).
  const covered = new Set(dims.map((d) => d.dimension));
  for (const d of RUBRIC) {
    if (!covered.has(d.key)) dims.push({ dimension: d.key, score: 3, notes: "not scored offline" });
  }
  const failures = dims.filter((d) => d.score <= 2).map((d) => `${d.dimension}: ${d.notes ?? "low"}`);
  const score = aggregate(phase, dims, { fixture, judge: "offline", failures });
  // aggregate already rounds; expose a stable overall.
  score.overall = round2(score.overall);
  return score;
};

// ── Stub judge (tests) ───────────────────────────────────────────────────────

/** A fixed-score judge for unit tests — no heuristics, no network. */
export function stubJudge(scores: Record<string, number>, failures: string[] = []): Judge {
  return async ({ phase, fixture }) => {
    const dims: DimensionScore[] = RUBRIC.map((d) => ({
      dimension: d.key,
      score: scores[d.key] ?? 4,
    }));
    return aggregate(phase, dims, { fixture, judge: "offline", failures });
  };
}
