import type {
  ClarifyOutput,
  ClearEngine,
  EngineResult,
  IntakeInput,
  LeverageFull,
  LeverageTeaser,
} from "./types";
import clarifyFixture from "./fixtures/clarify.json";
import teaserFixture from "./fixtures/leverage-teaser.json";
import fullFixture from "./fixtures/leverage-full.json";

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
}
