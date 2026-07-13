// Prompt-assembly adapter for the eval harness.
//
// The live engine (supabase/functions/_shared/clear/live-engine.ts) imports the
// Deno SDK and reads Deno.env, so it can't be imported under Node/vite-node. But
// the *prompt assembly it does* is pure and lives in prompts.ts — the same
// renderIntake() + phase-prompt constants the production run uses. This adapter
// reuses those real code paths and mirrors, line for line, the tiny per-phase
// concatenation live-engine does inline (the "CLARIFY OUTPUT:\n{json}\n\nReturn
// the TEASER JSON." glue). If live-engine's assembly changes, mirror it here.

import {
  CLARIFY_PROMPT,
  EXPERIMENT_PROMPT,
  LEVERAGE_FULL_BARRIERS_PROMPT,
  LEVERAGE_FULL_SYSTEMS_PROMPT,
  LEVERAGE_PROMPT,
  renderEnvelope,
  renderIntake,
} from "../supabase/functions/_shared/clear/prompts.ts";
import type {
  ClarifyOutput,
  IntakeInput,
  LeverageFull,
  LeverageFullSystems,
  LeverageTeaser,
  ResourceEnvelope,
} from "../supabase/functions/_shared/clear/types.ts";

/** The self-contained phases the harness generates + scores (research is live/edge-only). */
export const SCORED_PHASES = [
  "clarify",
  "leverage_teaser",
  "leverage_full",
  "experiment",
] as const;
export type ScoredPhase = (typeof SCORED_PHASES)[number];

export interface AssembledPrompt {
  system: string;
  user: string;
  maxTokens: number;
  temperature?: number;
}

/** The prior-phase outputs a later phase's assembly needs. */
export interface Priors {
  clarify?: ClarifyOutput;
  teaser?: LeverageTeaser;
  systems?: LeverageFullSystems;
  full?: LeverageFull;
  envelope?: ResourceEnvelope;
}

/** Render just the intake block the way every phase sees it (for the judge prompt). */
export function intakeText(input: IntakeInput): string {
  return renderIntake(input);
}

/**
 * The ground-truth corpus the judge scores an output against — everything the
 * model was actually given for that phase. Only the EXPERIMENT phase is shown the
 * resource envelope, so only its corpus includes it (otherwise a Clarify report
 * would look "grounded" in facts it never saw).
 */
export function judgeGroundTruth(
  input: IntakeInput,
  phase: string,
  envelope?: ResourceEnvelope,
): string {
  const base = renderIntake(input);
  return phase === "experiment" && envelope ? `${base}\n\n${renderEnvelope(envelope)}` : base;
}

export function assembleClarify(input: IntakeInput): AssembledPrompt {
  return { system: CLARIFY_PROMPT, user: renderIntake(input), maxTokens: 3000, temperature: 0.4 };
}

export function assembleLeverageTeaser(input: IntakeInput, clarify: ClarifyOutput): AssembledPrompt {
  return {
    system: LEVERAGE_PROMPT,
    user: `${renderIntake(input)}\n\nCLARIFY OUTPUT:\n${JSON.stringify(clarify)}\n\nReturn the TEASER JSON.`,
    maxTokens: 2500,
    temperature: 0.5,
  };
}

export function assembleLeverageFullSystems(
  input: IntakeInput,
  clarify: ClarifyOutput,
  teaser: LeverageTeaser,
): AssembledPrompt {
  return {
    system: LEVERAGE_FULL_SYSTEMS_PROMPT,
    user: `${renderIntake(input)}\n\nCLARIFY OUTPUT:\n${JSON.stringify(clarify)}\n\nTEASER OUTPUT:\n${JSON.stringify(teaser)}\n\nReturn PASS 1 JSON (topLeveragePoints with 5-10 ranked points, behaviors, behaviorPriorities, keyActors, causeEffect, loops).`,
    maxTokens: 8000,
    temperature: 0.5,
  };
}

export function assembleLeverageFullBarriers(
  input: IntakeInput,
  clarify: ClarifyOutput,
  teaser: LeverageTeaser,
  systems: LeverageFullSystems,
): AssembledPrompt {
  // Mirror live-engine: drop raw documents and pass only the lean leverage-points +
  // behaviours the COM-B analysis needs (keeps the request under the wall clock).
  const lean = { topLeveragePoints: systems.topLeveragePoints, behaviors: systems.behaviors };
  return {
    system: LEVERAGE_FULL_BARRIERS_PROMPT,
    user: `${renderIntake({ ...input, documents: [] })}\n\nCLARIFY OUTPUT:\n${JSON.stringify(clarify)}\n\nTEASER OUTPUT:\n${JSON.stringify(teaser)}\n\nPASS 1 (LEVERAGE POINTS & BEHAVIOURS) OUTPUT:\n${JSON.stringify(lean)}\n\nReturn PASS 2 JSON (comb across all six COM-B components, strongestBarriers, barrierNarratives, gapLog, discoveryActivities).`,
    maxTokens: 7000,
    temperature: 0.5,
  };
}

export function assembleExperiment(
  input: IntakeInput,
  clarify: ClarifyOutput,
  full: LeverageFull,
  envelope: ResourceEnvelope,
): AssembledPrompt {
  return {
    system: EXPERIMENT_PROMPT,
    user: `${renderIntake(input)}\n\n${renderEnvelope(envelope)}\n\nCLARIFY OUTPUT:\n${JSON.stringify(clarify)}\n\nLEVERAGE FULL OUTPUT:\n${JSON.stringify(full)}\n\nReturn the EXPERIMENT JSON.`,
    maxTokens: 4000,
    temperature: 0.5,
  };
}
