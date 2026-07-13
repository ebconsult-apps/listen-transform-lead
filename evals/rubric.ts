// The CLEAR report-quality rubric.
//
// A paying customer must be *happy* about a ~EUR 100-200 report. "Happy" decomposes
// into five observable properties of a phase output, each scored 1-5 by a judge
// (an LLM judge in `npm run eval`, a deterministic heuristic judge offline). The
// first four are named directly by ROADMAP A3.2; `gap_honesty` is the dimension the
// phase prompts themselves imply — every CLEAR prompt opens with the never-fabricate
// banner and carries a GAP_LOG_SPEC, so "flag the unknown instead of inventing it"
// is a scored quality, not an afterthought.

export const SCALE_MIN = 1;
export const SCALE_MAX = 5;

/** Per-dimension floor for a "pass". Fabrication is the cardinal sin — held higher. */
export const PASS_THRESHOLD = 3;
export const NO_FABRICATION_FLOOR = 4;

export interface RubricDimension {
  key: string;
  title: string;
  /** What a 5 looks like — used verbatim in the judge prompt. */
  description: string;
  /** Anchors so both the LLM and the human reader calibrate the same way. */
  anchors: { "1": string; "3": string; "5": string };
}

export const RUBRIC: RubricDimension[] = [
  {
    key: "grounding",
    title: "Grounding in the intake",
    description:
      "Every substantive claim traces to something the intake actually states — the challenge, target group, stakeholders, uploaded documents, or owner-accepted research. Nothing is asserted that the intake could not support.",
    anchors: {
      "1": "Claims float free of the intake; reads like it was written for a different org.",
      "3": "Mostly grounded, but a few claims assume facts the intake never states.",
      "5": "Every claim is traceable to the intake; assumptions are labelled as such.",
    },
  },
  {
    key: "specificity",
    title: "Specificity to this org",
    description:
      "References the org's actual stated context — its challenge in its own terms, its target group, its roles, its numbers — rather than generic behavioural-science advice that would fit any organisation. 'Raise awareness' / 'communicate more' / 'follow best practice' are generic tells.",
    anchors: {
      "1": "Boilerplate that would apply unchanged to any org; no concrete detail from the intake.",
      "3": "Some org-specific detail, but padded with generic advice.",
      "5": "Reads unmistakably about THIS org: its behaviours, actors, and constraints, named concretely.",
    },
  },
  {
    key: "actionability",
    title: "Actionability",
    description:
      "Offers concrete, testable next steps: measurable key results, named COM-B barriers, smallest-reversible experiments, or specific discovery activities — not abstract aspirations. A reader could act on it Monday.",
    anchors: {
      "1": "Abstract aspirations with no testable step.",
      "3": "Directionally useful but several items are vague or unmeasurable.",
      "5": "Concrete, prioritised, testable steps a team could run immediately.",
    },
  },
  {
    key: "no_fabrication",
    title: "No fabricated entities",
    description:
      "No invented stakeholders, metrics, quotes, citations, dates, or named entities. A number, name, or quote appears ONLY if the intake contains it (or it is explicitly derived from intake figures). Anything unknown is flagged, never asserted as fact.",
    anchors: {
      "1": "Invents figures, names, or quotes presented as real.",
      "3": "One or two unsupported specifics slip through as if factual.",
      "5": "Zero fabricated specifics; every hard fact is intake-backed or flagged.",
    },
  },
  {
    key: "gap_honesty",
    title: "Gap honesty",
    description:
      "Unknowns are surfaced in the gapLog with a valid flag type (assumption / gap / input_needed / …) rather than papered over. Missing baselines, unowned steps, and untested assumptions are named. (Implied by every CLEAR prompt's never-fabricate banner + gapLog spec.)",
    anchors: {
      "1": "Confident throughout; no gaps acknowledged even where the intake is silent.",
      "3": "A gapLog exists but misses obvious unknowns, or over-flags to avoid analysis.",
      "5": "The real unknowns are named and correctly typed; flagging is proportionate.",
    },
  },
];

export interface DimensionScore {
  dimension: string;
  score: number;
  notes?: string;
}

export interface RubricScore {
  phase: string;
  fixture?: string;
  judge: "llm" | "offline";
  model?: string;
  dimensions: DimensionScore[];
  /** Mean across dimensions. */
  overall: number;
  /** Lowest single dimension — the binding constraint on quality. */
  min: number;
  pass: boolean;
  /** Specific, quotable problems the judge found (untraceable claims, invented entities…). */
  failures: string[];
}

const round2 = (n: number) => Math.round(n * 100) / 100;
const clamp = (n: number) => Math.max(SCALE_MIN, Math.min(SCALE_MAX, n));

/**
 * Aggregate per-dimension scores into an overall/min/pass verdict. A phase passes
 * only when every dimension clears PASS_THRESHOLD *and* no_fabrication clears its
 * higher floor — a beautifully specific report that invents a statistic still fails.
 */
export function aggregate(
  phase: string,
  dimensions: DimensionScore[],
  opts: { fixture?: string; judge: "llm" | "offline"; model?: string; failures?: string[] },
): RubricScore {
  if (dimensions.length === 0) throw new Error("aggregate() needs at least one dimension score");
  const scores = dimensions.map((d) => clamp(d.score));
  const overall = round2(scores.reduce((a, b) => a + b, 0) / scores.length);
  const min = Math.min(...scores);
  const fab = dimensions.find((d) => d.dimension === "no_fabrication");
  const fabOk = fab === undefined || clamp(fab.score) >= NO_FABRICATION_FLOOR;
  const pass = min >= PASS_THRESHOLD && fabOk;
  return {
    phase,
    fixture: opts.fixture,
    judge: opts.judge,
    model: opts.model,
    dimensions: dimensions.map((d) => ({ ...d, score: clamp(d.score) })),
    overall,
    min,
    pass,
    failures: opts.failures ?? [],
  };
}

/** Build the system+user prompt pair the LLM judge scores against. */
export function buildJudgePrompt(
  phase: string,
  intakeText: string,
  outputJson: string,
): { system: string; user: string } {
  const dims = RUBRIC.map(
    (d) =>
      `- "${d.key}" (${d.title}): ${d.description}\n    1 = ${d.anchors["1"]}\n    3 = ${d.anchors["3"]}\n    5 = ${d.anchors["5"]}`,
  ).join("\n");
  const system = `You are a strict, fair quality judge for CLEAR, a behavioural-science change-report product. A paying customer spent EUR 100-200 on this report. Score ONE phase output against the rubric. Reward reports that are grounded, specific to this exact organisation, actionable, and free of invented facts; punish generic filler and any fabricated stakeholder, metric, quote, or citation.

You will be given (a) the INTAKE the report was generated from and (b) the phase OUTPUT (JSON). Judge ONLY whether the OUTPUT is supported by the INTAKE. Treat any name, number, percentage, quote, date, or citation in the OUTPUT that is absent from the INTAKE and not flagged as an assumption/gap as a fabrication.

Score each dimension ${SCALE_MIN}-${SCALE_MAX} using the anchors. Return ONLY JSON:
{
  "dimensions": [ { "dimension": "<key>", "score": <int ${SCALE_MIN}-${SCALE_MAX}>, "notes": "<one line>" } ],
  "failures": [ "<specific quotable problem: an untraceable claim, an invented entity, a generic-filler passage>" ]
}
Include every rubric dimension key exactly once. "failures" may be empty. No prose outside the JSON.`;
  const user = `RUBRIC DIMENSIONS:\n${dims}\n\nPHASE: ${phase}\n\n=== INTAKE (the only ground truth) ===\n${intakeText}\n\n=== PHASE OUTPUT (JSON) ===\n${outputJson}\n\nScore the OUTPUT against the rubric now. Return ONLY the JSON object.`;
  return { system, user };
}

/**
 * Parse an LLM judge's JSON response into per-dimension scores. Missing dimensions
 * are surfaced as an error (a judge that skips a dimension is a harness bug, not a
 * silent zero); unknown dimensions are ignored.
 */
export function parseJudgeResponse(
  raw: { dimensions?: unknown; failures?: unknown } | null | undefined,
): { dimensions: DimensionScore[]; failures: string[] } {
  if (!raw || typeof raw !== "object" || !Array.isArray(raw.dimensions)) {
    throw new Error("Judge response missing a `dimensions` array");
  }
  const byKey = new Map<string, DimensionScore>();
  for (const d of raw.dimensions as unknown[]) {
    if (!d || typeof d !== "object") continue;
    const rec = d as { dimension?: unknown; score?: unknown; notes?: unknown };
    if (typeof rec.dimension !== "string" || typeof rec.score !== "number") continue;
    byKey.set(rec.dimension, {
      dimension: rec.dimension,
      score: clamp(rec.score),
      notes: typeof rec.notes === "string" ? rec.notes : undefined,
    });
  }
  const dimensions: DimensionScore[] = [];
  const missing: string[] = [];
  for (const d of RUBRIC) {
    const found = byKey.get(d.key);
    if (found) dimensions.push(found);
    else missing.push(d.key);
  }
  if (missing.length) {
    throw new Error(`Judge response missing dimension(s): ${missing.join(", ")}`);
  }
  const failures = Array.isArray(raw.failures)
    ? (raw.failures as unknown[]).filter((f): f is string => typeof f === "string")
    : [];
  return { dimensions, failures };
}
