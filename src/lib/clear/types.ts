/**
 * CLEAR AI-orchestration contract (spec §9). One interface, two implementations
 * (stub | live) selected by AI_MODE. Callers and UI never change between modes.
 *
 * These types are the single source of truth for both the client (rendering
 * teaser/full reports) and the `project-run` edge function (which mirrors them).
 */

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
}

export interface KeyResult {
  kr: string;
  baseline?: string;
  target?: string;
  confidence?: Level;
}

export interface ClarifyOutput {
  whyItMatters: string;
  objective: string;
  keyResults: KeyResult[];
  assumptions: string[];
  gaps: string[];
}

export interface LeveragePoint {
  rank: number;
  point: string;
  currentState: string;
  impact: Level;
  ease: Level;
  /** 0–100 confidence */
  confidence: number;
}

export interface LeverageTeaser {
  systemsMapSummary: string;
  topLeveragePoints: LeveragePoint[];
  headline: string;
}

export interface CombCell {
  /** COM-B factor: Capability | Opportunity | Motivation (+ sub-type) */
  factor: string;
  barrier: string;
  evidence?: string;
}

export interface LeverageFull extends LeverageTeaser {
  comb: CombCell[];
  barrierNarratives: { point: string; narrative: string }[];
  gapLog: string[];
  discoveryActivities: string[];
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
  runLeverageFull(
    input: IntakeInput,
    clarify: ClarifyOutput,
    teaser: LeverageTeaser,
  ): Promise<EngineResult<LeverageFull>>;
}

export type RunPhase = "clarify" | "leverage_teaser" | "leverage_full";

export type ProjectStatus =
  | "draft"
  | "running"
  | "teaser_ready"
  | "paid"
  | "full_ready"
  | "error";
