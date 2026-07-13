// Live phase generation for the eval harness (used by `npm run eval`, never
// offline). Assembles prompts via the real engine code paths (engine-adapter →
// prompts.ts) and calls the model with the SAME per-phase model defaults the
// production engine uses, so eval scores reflect what a paying customer would get.

import { callMessages, extractJson } from "./anthropic.ts";
import {
  assembleClarify,
  assembleExperiment,
  assembleLeverageFullBarriers,
  assembleLeverageFullSystems,
  assembleLeverageTeaser,
  type ScoredPhase,
} from "./engine-adapter.ts";
import type { Fixture } from "./fixtures/index.ts";
import type {
  ClarifyOutput,
  ExperimentOutput,
  LeverageFull,
  LeverageFullBarriers,
  LeverageFullSystems,
  LeverageTeaser,
} from "../supabase/functions/_shared/clear/types.ts";

/** Mirror LiveClearEngine's env reads + Sonnet defaults so the eval prices/uses the same model. */
function modelFor(phase: ScoredPhase): string {
  const env = (k: string) => process.env[k];
  switch (phase) {
    case "clarify":
      return env("CLARIFY_MODEL") ?? "claude-sonnet-4-6";
    case "leverage_teaser":
    case "leverage_full":
      return env("LEVERAGE_MODEL") ?? "claude-sonnet-4-6";
    case "experiment":
      return env("EXPERIMENT_MODEL") ?? "claude-sonnet-4-6";
  }
}

export interface GeneratedPhase {
  phase: ScoredPhase;
  model: string;
  output: unknown;
  tokens: number;
}

/** Accumulated prior outputs, threaded through a fixture's phase sequence. */
export interface GenState {
  clarify?: ClarifyOutput;
  teaser?: LeverageTeaser;
  full?: LeverageFull;
}

async function run<T>(model: string, p: { system: string; user: string; maxTokens: number; temperature?: number }) {
  const res = await callMessages({ model, ...p });
  if (res.stopReason === "max_tokens") {
    throw new Error(`Generation truncated at ${p.maxTokens} tokens before returning complete JSON.`);
  }
  return { output: extractJson<T>(res.text), tokens: res.inputTokens + res.outputTokens };
}

/**
 * Generate one phase, given the prior outputs already in `state`. Mutates `state`
 * so the next phase in the sequence can build on it. leverage_full runs the two
 * sub-passes and reassembles into a LeverageFull, exactly like the engine caller.
 */
export async function generatePhase(
  phase: ScoredPhase,
  fixture: Fixture,
  state: GenState,
): Promise<GeneratedPhase> {
  const model = modelFor(phase);
  const { intake, envelope } = fixture;

  if (phase === "clarify") {
    const { output, tokens } = await run<ClarifyOutput>(model, assembleClarify(intake));
    state.clarify = output;
    return { phase, model, output, tokens };
  }
  if (phase === "leverage_teaser") {
    if (!state.clarify) throw new Error("leverage_teaser needs clarify output first");
    const { output, tokens } = await run<LeverageTeaser>(model, assembleLeverageTeaser(intake, state.clarify));
    state.teaser = output;
    return { phase, model, output, tokens };
  }
  if (phase === "leverage_full") {
    if (!state.clarify || !state.teaser) throw new Error("leverage_full needs clarify + teaser first");
    const pass1 = await run<LeverageFullSystems>(
      model,
      assembleLeverageFullSystems(intake, state.clarify, state.teaser),
    );
    const pass2 = await run<LeverageFullBarriers>(
      model,
      assembleLeverageFullBarriers(intake, state.clarify, state.teaser, pass1.output),
    );
    const full: LeverageFull = { ...state.teaser, ...pass1.output, ...pass2.output };
    state.full = full;
    return { phase, model, output: full, tokens: pass1.tokens + pass2.tokens };
  }
  // experiment
  if (!state.clarify || !state.full) throw new Error("experiment needs clarify + leverage_full first");
  const { output, tokens } = await run<ExperimentOutput>(
    model,
    assembleExperiment(intake, state.clarify, state.full, envelope),
  );
  return { phase, model, output, tokens };
}
