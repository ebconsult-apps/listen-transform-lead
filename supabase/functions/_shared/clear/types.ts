// CLEAR contract (spec §9) — mirror of src/lib/clear/types.ts for the Deno edge
// runtime. Keep the two in sync; this is the server-side source of truth for runs.

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
  confidence: number;
}

export interface LeverageTeaser {
  systemsMapSummary: string;
  topLeveragePoints: LeveragePoint[];
  headline: string;
}

export interface CombCell {
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
