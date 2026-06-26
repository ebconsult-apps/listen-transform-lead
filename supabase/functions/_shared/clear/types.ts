// CLEAR contract (spec §9) — mirror of src/lib/clear/types.ts for the Deno edge
// runtime. Keep the two in sync; this is the server-side source of truth for runs.
//
// The output shapes implement the CLEAR change-cycle methodology (ccc/docs):
// CLARIFY = full OKR, LEVERAGE = the behaviors → prioritization → COM-B → ranked
// leverage-points chain, EXPERIMENT = APEASE-screened interventions + test cards.

export type Level = "High" | "Medium" | "Low";

export interface ParsedDocument {
  filename: string;
  text: string;
}

export interface IntakeInput {
  challenge: string;
  stakeholders: { name?: string; role: string }[];
  timeline?: string;
  targetGroup?: string;
  useCase?: string;
  documents: ParsedDocument[];
  /**
   * Owner-accepted research findings, folded in as cited "Verified" evidence so
   * CLARIFY/LEVERAGE can ground claims in real sources (see renderResearch).
   */
  research?: ResearchFinding[];
}

// ── Never-fabricate flag taxonomy (orchestration.md) ─────────────────────────
// Every phase emits a gap log of these; the orchestrator routes them into the
// persistent cross-phase assumptions_gaps log.
export type FlagType =
  | "assumption"
  | "gap"
  | "input_needed"
  | "user_input"
  | "needs_input"
  | "requires_confirmation";

export interface GapFlag {
  type: FlagType;
  content: string;
  /** Where the claim/placeholder came from, when relevant. */
  source?: string;
}

// ── CLARIFY (full OKR) ───────────────────────────────────────────────────────
export interface KeyResult {
  kr: string;
  metric?: string;
  baseline?: string;
  target?: string;
  timeline?: string;
  owner?: string;
  confidence?: Level;
}

export interface ClarifyOutput {
  whyItMatters: string;
  objective: string;
  keyResults: KeyResult[];
  gapLog: GapFlag[];
}

// ── LEVERAGE (full chain) ────────────────────────────────────────────────────
export type Genre =
  | "seek_information"
  | "compare"
  | "decide"
  | "carry_out_process"
  | "register"
  | "social";

/** An observable behavior — verb-led, with the six parameters where known. */
export interface Behavior {
  id: string;
  description: string;
  who?: string;
  doesWhat?: string;
  when?: string;
  where?: string;
  howOften?: string;
  withWhom?: string;
  level?: "high" | "detail";
  genre?: Genre;
}

/** Relative 1–5 scores used to filter behaviors (not to crown a winner). */
export interface BehaviorPriority {
  behaviorId: string;
  effect: number;
  ease: number;
  centrality: number;
  measurability: number;
}

export type ComBComponent =
  | "capability_physical"
  | "capability_psychological"
  | "opportunity_physical"
  | "opportunity_social"
  | "motivation_reflective"
  | "motivation_automatic";

/** Evidence provenance per COM-B cell: Verified | Assumption | Gap | not-applicable. */
export type EvidenceFlag = "V" | "A" | "G" | "NA";

export interface CombBarrier {
  component: ComBComponent;
  barrier: string;
  significance?: string;
  impact: Level;
  changeability: Level;
  evidenceFlag: EvidenceFlag;
  source?: string;
}

export interface StrongestBarrier {
  barrier: string;
  component: ComBComponent;
  rationale: string;
}

export interface CauseEffectEdge {
  from: string;
  to: string;
  polarity?: "+" | "-";
  note?: string;
}

export interface KeyActor {
  actor: string;
  behavior: string;
}

export interface LeveragePoint {
  rank: number;
  point: string;
  currentState: string;
  /** Propagated impact through the system (Propagated Impact × Ease ranking). */
  impact: Level;
  ease: Level;
  /** 0–100 confidence */
  confidence: number;
  /** Node rests on unverified assumptions. */
  assumptionBased?: boolean;
}

export interface LeverageTeaser {
  systemsMapSummary: string;
  topLeveragePoints: LeveragePoint[];
  headline: string;
}

export interface LeverageFull extends LeverageTeaser {
  behaviors: Behavior[];
  behaviorPriorities: BehaviorPriority[];
  keyActors: KeyActor[];
  causeEffect: CauseEffectEdge[];
  loops?: string[];
  comb: CombBarrier[];
  strongestBarriers: StrongestBarrier[];
  barrierNarratives: { point: string; narrative: string }[];
  gapLog: GapFlag[];
  discoveryActivities: string[];
}

/**
 * The FULL report is generated in two passes so each model call stays under the
 * edge runtime's wall-clock limit (the whole report in one call truncated). Pass
 * 1 is the systems map + behaviours; Pass 2 is the COM-B barriers + actions. The
 * two passes plus the teaser reassemble into a complete `LeverageFull`
 * (`{ ...teaser, ...systems, ...barriers }`).
 */
export type LeverageFullSystems = Pick<
  LeverageFull,
  "topLeveragePoints" | "behaviors" | "behaviorPriorities" | "keyActors" | "causeEffect" | "loops"
>;

export type LeverageFullBarriers = Pick<
  LeverageFull,
  "comb" | "strongestBarriers" | "barrierNarratives" | "discoveryActivities" | "gapLog"
>;

// ── EXPERIMENT (APEASE-screened interventions) ───────────────────────────────
export interface ResourceEnvelope {
  budget?: string;
  people?: string;
  time?: string;
}

/** APEASE veto gate — never averaged; a FAIL parks the idea outright. */
export type Gate = "pass" | "flag" | "fail";

export interface Apease {
  /** 1–5; plausibly shifts the behavior by addressing a named COM-B barrier. */
  effectiveness: number;
  /** 1–5; deliverable with available time/skills/systems in ~3–6 months. */
  practicability: number;
  /** 1–5; fits the money/resource envelope. */
  affordability: number;
  acceptability: Gate;
  safety: Gate;
  equity: Gate;
  notes?: string;
}

export interface InterventionCandidate {
  leveragePointRank: number;
  /** The named COM-B barrier this intervention addresses. */
  barrier: string;
  title: string;
  description: string;
  apease: Apease;
}

export interface ExperimentOutput {
  interventionCandidates: InterventionCandidate[];
  faq: { q: string; a: string }[];
  gapLog: GapFlag[];
}

// ── RESEARCH (cited evidence enrichment for CLARIFY & LEVERAGE) ───────────────
// Not a CLEAR phase — a cross-cutting enrichment step. Findings reuse the same
// evidence-provenance vocabulary the reports already render (V/A/G/NA + source).

/** A single source backing a research finding. Never empty for a "V" finding. */
export interface Citation {
  title: string;
  url?: string;
  note?: string;
}

/** Which phase a finding is meant to strengthen. */
export type ResearchPhaseTarget = "clarify" | "leverage";

/** Where a finding came from: live web, the curated/shared library, or owner dialogue. */
export type ResearchSourceKind = "web" | "knowledge_base" | "dialogue";

/** Free-form-ish classification used for shared-library retrieval and reuse. */
export interface ResearchTags {
  useCase?: string;
  targetGroup?: string;
  topic?: string;
  comBComponent?: ComBComponent;
}

/**
 * A cited piece of evidence the research agent gathered. Never fabricated: a
 * claim with no citation must be flagged "G" (gap) or turned into a follow-up
 * question, not invented.
 */
export interface ResearchFinding {
  phaseTarget: ResearchPhaseTarget;
  claim: string;
  detail?: string;
  sourceKind: ResearchSourceKind;
  citations: Citation[];
  evidenceFlag: EvidenceFlag;
  /** 0–100 */
  confidence: number;
  tags?: ResearchTags;
  /** When this finding came from a targeted run, the selected gap id(s) it closes. */
  sourceGapIds?: string[];
}

/** A targeted follow-up question the agent needs answered to close a gap. */
export interface ResearchQuestion {
  question: string;
  rationale: string;
}

export interface ResearchOutput {
  findings: ResearchFinding[];
  questions: ResearchQuestion[];
  gapLog: GapFlag[];
}

/** A reusable, de-identified entry from the shared knowledge library. */
export interface KnowledgeEntry {
  id: string;
  kind: "curated" | "promoted";
  title: string;
  summary: string;
  tags?: ResearchTags;
  citations?: Citation[];
}

/** An owner-selected open question a targeted research run must close. */
export interface ResearchFocusGap {
  id: string;
  flagType: string;
  content: string;
  source?: string | null;
}

/** Extra context passed to the research engine beyond the intake. */
export interface ResearchContext {
  /** Curated/shared knowledge-base entries retrieved as candidate evidence. */
  knowledgeEntries?: KnowledgeEntry[];
  /**
   * Owner-selected gaps a targeted run must close, MECE (each covered by ≥1
   * finding, no overlap). Empty/absent = a broad run over the whole project.
   */
  focusGaps?: ResearchFocusGap[];
}

/** Standard envelope so every phase can report cost/usage uniformly. */
export interface EngineResult<T> {
  output: T;
  tokens?: number;
  costUsd?: number;
}

export interface ClearEngine {
  runClarify(input: IntakeInput): Promise<EngineResult<ClarifyOutput>>;
  runLeverageTeaser(
    input: IntakeInput,
    clarify: ClarifyOutput,
  ): Promise<EngineResult<LeverageTeaser>>;
  // The FULL report is generated in two passes (each kept under the edge
  // runtime's wall-clock limit); the caller reassembles them with the teaser
  // into a LeverageFull. Pass 2 receives Pass 1's output for COM-B context.
  runLeverageFullSystems(
    input: IntakeInput,
    clarify: ClarifyOutput,
    teaser: LeverageTeaser,
  ): Promise<EngineResult<LeverageFullSystems>>;
  runLeverageFullBarriers(
    input: IntakeInput,
    clarify: ClarifyOutput,
    teaser: LeverageTeaser,
    systems: LeverageFullSystems,
  ): Promise<EngineResult<LeverageFullBarriers>>;
  runExperiment(
    input: IntakeInput,
    clarify: ClarifyOutput,
    teaser: LeverageTeaser,
    full: LeverageFull,
    envelope: ResourceEnvelope,
  ): Promise<EngineResult<ExperimentOutput>>;
  runResearch(
    input: IntakeInput,
    ctx: ResearchContext,
  ): Promise<EngineResult<ResearchOutput>>;
}

export type RunPhase =
  | "clarify"
  | "leverage_teaser"
  | "leverage_full"
  | "experiment"
  | "research";

export type ProjectStatus =
  | "draft"
  | "running"
  | "clarify_ready"
  | "clarify_approved"
  | "teaser_ready"
  | "paid"
  | "full_ready"
  | "experiment_design"
  | "experiment_active"
  | "error";
