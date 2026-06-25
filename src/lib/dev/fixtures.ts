/**
 * Typed access to the authored CLEAR fixtures + the mappers that turn a phase
 * output into the editable DB rows the app reads. These are the SAME fixtures
 * the StubClearEngine returns, so mock runs and real stub runs produce identical
 * content. Pure and import-cycle-free (types are erased `import type`s).
 */
import type {
  AssumptionGapRow,
  InterventionCandidateRow,
  ResearchFindingRow,
  ResearchQuestionRow,
} from "@/lib/db";
import type {
  Apease,
  ClarifyOutput,
  ExperimentOutput,
  GapFlag,
  LeverageFull,
  LeverageTeaser,
  ResearchOutput,
  RunPhase,
} from "@/lib/clear/types";
import clarifyFixture from "@/lib/clear/fixtures/clarify.json";
import teaserFixture from "@/lib/clear/fixtures/leverage-teaser.json";
import fullFixture from "@/lib/clear/fixtures/leverage-full.json";
import experimentFixture from "@/lib/clear/fixtures/experiment.json";
import researchFixture from "@/lib/clear/fixtures/research.json";
import { daysAgoIso, uid } from "./util";

export const CLARIFY = clarifyFixture as unknown as ClarifyOutput;
export const TEASER = teaserFixture as unknown as LeverageTeaser;
export const FULL = fullFixture as unknown as LeverageFull;
export const EXPERIMENT = experimentFixture as unknown as ExperimentOutput;
export const RESEARCH = researchFixture as unknown as ResearchOutput;

/** Mirror of experiment.ts `apeaseParked` (inlined to avoid importing the guarded lib). */
export function isParked(a: Apease): boolean {
  return a.acceptability === "fail" || a.safety === "fail" || a.equity === "fail";
}

export function candidateRows(
  projectId: string,
  createdDaysAgo = 0,
): InterventionCandidateRow[] {
  const ts = daysAgoIso(createdDaysAgo);
  return EXPERIMENT.interventionCandidates.map((c) => ({
    id: uid("cand"),
    project_id: projectId,
    leverage_point_rank: c.leveragePointRank ?? null,
    barrier: c.barrier ?? null,
    title: c.title,
    description: c.description ?? null,
    apease: c.apease,
    parked: isParked(c.apease),
    created_at: ts,
    updated_at: ts,
  }));
}

export function findingRows(
  projectId: string,
  createdDaysAgo = 0,
): ResearchFindingRow[] {
  const ts = daysAgoIso(createdDaysAgo);
  return RESEARCH.findings.map((f) => ({
    id: uid("find"),
    project_id: projectId,
    phase_target: f.phaseTarget,
    claim: f.claim,
    detail: f.detail ?? null,
    source_kind: f.sourceKind,
    citations: f.citations ?? [],
    evidence_flag: f.evidenceFlag,
    confidence: f.confidence ?? null,
    tags: (f.tags ?? {}) as Record<string, unknown>,
    status: "proposed",
    shared_finding_id: null,
    created_at: ts,
    updated_at: ts,
  }));
}

export function questionRows(
  projectId: string,
  createdDaysAgo = 0,
): ResearchQuestionRow[] {
  const ts = daysAgoIso(createdDaysAgo);
  return RESEARCH.questions.map((q) => ({
    id: uid("q"),
    project_id: projectId,
    question: q.question,
    rationale: q.rationale ?? null,
    answer: null,
    status: "open",
    created_at: ts,
    updated_at: ts,
  }));
}

/** Map a phase's gap log into persistent assumption_gaps rows. */
export function gapRows(
  projectId: string,
  phase: RunPhase,
  flags: GapFlag[] | undefined,
  createdDaysAgo = 0,
): AssumptionGapRow[] {
  if (!flags?.length) return [];
  const ts = daysAgoIso(createdDaysAgo);
  return flags.map((f) => ({
    id: uid("gap"),
    project_id: projectId,
    phase,
    flag_type: f.type,
    content: f.content,
    source: f.source ?? null,
    status: "open",
    created_at: ts,
    updated_at: ts,
  }));
}
