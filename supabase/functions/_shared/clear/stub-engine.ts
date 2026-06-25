import type {
  ClarifyOutput,
  ClearEngine,
  EngineResult,
  ExperimentOutput,
  IntakeInput,
  LeverageFull,
  LeverageTeaser,
  ResearchContext,
  ResearchOutput,
  ResourceEnvelope,
} from "./types.ts";
import {
  CLARIFY_FIXTURE,
  EXPERIMENT_FIXTURE,
  FULL_FIXTURE,
  RESEARCH_FIXTURE,
  TEASER_FIXTURE,
} from "./fixtures.ts";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Server-side stub — returns fixtures with a small delay. Mirrors the client. */
export class StubClearEngine implements ClearEngine {
  async runClarify(_input: IntakeInput): Promise<EngineResult<ClarifyOutput>> {
    await delay(800);
    return { output: CLARIFY_FIXTURE, tokens: 0, costUsd: 0 };
  }
  async runLeverageTeaser(
    _input: IntakeInput,
    _clarify: ClarifyOutput,
  ): Promise<EngineResult<LeverageTeaser>> {
    await delay(900);
    return { output: TEASER_FIXTURE, tokens: 0, costUsd: 0 };
  }
  async runLeverageFull(
    _input: IntakeInput,
    _clarify: ClarifyOutput,
    _teaser: LeverageTeaser,
  ): Promise<EngineResult<LeverageFull>> {
    await delay(1000);
    return { output: FULL_FIXTURE, tokens: 0, costUsd: 0 };
  }
  async runExperiment(
    _input: IntakeInput,
    _clarify: ClarifyOutput,
    _teaser: LeverageTeaser,
    _full: LeverageFull,
    _envelope: ResourceEnvelope,
  ): Promise<EngineResult<ExperimentOutput>> {
    await delay(1000);
    return { output: EXPERIMENT_FIXTURE, tokens: 0, costUsd: 0 };
  }
  async runResearch(
    _input: IntakeInput,
    ctx: ResearchContext,
  ): Promise<EngineResult<ResearchOutput>> {
    await delay(1000);
    if (ctx.focusGaps?.length) {
      const ids = ctx.focusGaps.map((g) => g.id);
      const findings = RESEARCH_FIXTURE.findings
        .slice(0, Math.max(1, ids.length))
        .map((f) => ({ ...f, sourceGapIds: ids }));
      return { output: { findings, questions: [], gapLog: [] }, tokens: 0, costUsd: 0 };
    }
    return { output: RESEARCH_FIXTURE, tokens: 0, costUsd: 0 };
  }
}
