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
} from "./types";
import clarifyFixture from "./fixtures/clarify.json";
import teaserFixture from "./fixtures/leverage-teaser.json";
import fullFixture from "./fixtures/leverage-full.json";
import experimentFixture from "./fixtures/experiment.json";
import researchFixture from "./fixtures/research.json";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * StubClearEngine — returns authored fixtures with a small artificial delay so
 * the "running" UX feels real. Swappable for LiveClearEngine (Claude) with zero
 * UI changes; both satisfy the same `ClearEngine` contract. Inputs are ignored
 * by design in stub mode.
 */
export class StubClearEngine implements ClearEngine {
  async runClarify(_input: IntakeInput): Promise<EngineResult<ClarifyOutput>> {
    await delay(1200);
    return { output: clarifyFixture as ClarifyOutput, tokens: 0, costUsd: 0 };
  }

  async runLeverageTeaser(
    _input: IntakeInput,
    _clarify: ClarifyOutput,
  ): Promise<EngineResult<LeverageTeaser>> {
    await delay(1500);
    return { output: teaserFixture as LeverageTeaser, tokens: 0, costUsd: 0 };
  }

  async runLeverageFull(
    _input: IntakeInput,
    _clarify: ClarifyOutput,
    _teaser: LeverageTeaser,
  ): Promise<EngineResult<LeverageFull>> {
    await delay(1800);
    return { output: fullFixture as LeverageFull, tokens: 0, costUsd: 0 };
  }

  async runExperiment(
    _input: IntakeInput,
    _clarify: ClarifyOutput,
    _teaser: LeverageTeaser,
    _full: LeverageFull,
    _envelope: ResourceEnvelope,
  ): Promise<EngineResult<ExperimentOutput>> {
    await delay(1500);
    return { output: experimentFixture as ExperimentOutput, tokens: 0, costUsd: 0 };
  }

  async runResearch(
    _input: IntakeInput,
    ctx: ResearchContext,
  ): Promise<EngineResult<ResearchOutput>> {
    await delay(1600);
    const fixture = researchFixture as ResearchOutput;
    if (ctx.focusGaps?.length) {
      const ids = ctx.focusGaps.map((g) => g.id);
      const findings = fixture.findings
        .slice(0, Math.max(1, ids.length))
        .map((f) => ({ ...f, sourceGapIds: ids }));
      return { output: { findings, questions: [], gapLog: [] }, tokens: 0, costUsd: 0 };
    }
    return { output: fixture, tokens: 0, costUsd: 0 };
  }
}
