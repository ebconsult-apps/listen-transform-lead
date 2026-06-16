import type {
  ClarifyOutput,
  ClearEngine,
  EngineResult,
  IntakeInput,
  LeverageFull,
  LeverageTeaser,
} from "./types.ts";
import { CLARIFY_FIXTURE, FULL_FIXTURE, TEASER_FIXTURE } from "./fixtures.ts";

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
}
