import Anthropic from "npm:@anthropic-ai/sdk@^0.32";
import type {
  ClarifyOutput,
  ClearEngine,
  EngineResult,
  ExperimentOutput,
  IntakeInput,
  LeverageFull,
  LeverageTeaser,
  ResourceEnvelope,
} from "./types.ts";
import {
  CLARIFY_PROMPT,
  EXPERIMENT_PROMPT,
  LEVERAGE_PROMPT,
  renderEnvelope,
  renderIntake,
} from "./prompts.ts";

// Rough per-million-token prices (USD) for cost logging. Update alongside model
// choices; these are only used for the cost cap + reporting, not billing.
const PRICE: Record<string, { in: number; out: number }> = {
  "claude-haiku-4-5": { in: 1, out: 5 },
  "claude-sonnet-4-6": { in: 3, out: 15 },
  "claude-opus-4-8": { in: 5, out: 25 },
};

function priceFor(model: string) {
  return PRICE[model] ?? { in: 3, out: 15 };
}

// Opus 4.8 rejects an explicit `temperature` (it self-regulates via adaptive
// thinking); Sonnet/Haiku accept one. Gate it so a flagship Opus run can't 400.
function isOpus(model: string) {
  return model.includes("opus");
}

function extractJson<T>(text: string): T {
  // Tolerate occasional fencing/prose around the JSON object.
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Model did not return JSON");
  return JSON.parse(text.slice(start, end + 1)) as T;
}

/**
 * LiveClearEngine — real Claude calls. Model ids come from env so they can be
 * upgraded without code changes. Every phase defaults to a deeper model worthy
 * of the methodology (Clarify defines the whole engagement, so it gets the
 * documents and a Sonnet floor); set LEVERAGE_MODEL=claude-opus-4-8 for a
 * flagship run. Temperature is applied to non-Opus models only (see isOpus).
 */
export class LiveClearEngine implements ClearEngine {
  private client = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY")! });
  private clarifyModel = Deno.env.get("CLARIFY_MODEL") ?? "claude-sonnet-4-6";
  private leverageModel = Deno.env.get("LEVERAGE_MODEL") ?? "claude-sonnet-4-6";
  private experimentModel = Deno.env.get("EXPERIMENT_MODEL") ?? "claude-sonnet-4-6";

  private async call<T>(
    model: string,
    system: string,
    user: string,
    maxTokens: number,
    temperature?: number,
  ): Promise<EngineResult<T>> {
    // These reports are analytical prose, not extraction — a little warmth reads
    // less flat. Opus omits temperature entirely (it would 400).
    const sampling =
      temperature === undefined || isOpus(model) ? {} : { temperature };
    const res = await this.client.messages.create({
      model,
      system,
      max_tokens: maxTokens,
      ...sampling,
      messages: [{ role: "user", content: user }],
    });
    const text = res.content
      .filter((b) => b.type === "text")
      // deno-lint-ignore no-explicit-any
      .map((b) => (b as any).text)
      .join("");
    const tokens = (res.usage?.input_tokens ?? 0) + (res.usage?.output_tokens ?? 0);
    const p = priceFor(model);
    const costUsd =
      ((res.usage?.input_tokens ?? 0) * p.in + (res.usage?.output_tokens ?? 0) * p.out) / 1_000_000;
    return { output: extractJson<T>(text), tokens, costUsd };
  }

  runClarify(input: IntakeInput) {
    // Clarify defines the whole engagement, so it now sees the uploaded
    // documents too (it was previously starved of that context).
    const user = renderIntake(input);
    return this.call<ClarifyOutput>(this.clarifyModel, CLARIFY_PROMPT, user, 3000, 0.4);
  }

  runLeverageTeaser(input: IntakeInput, clarify: ClarifyOutput) {
    const user = `${renderIntake(input)}\n\nCLARIFY OUTPUT:\n${JSON.stringify(clarify)}\n\nReturn the TEASER JSON.`;
    return this.call<LeverageTeaser>(this.leverageModel, LEVERAGE_PROMPT, user, 2500, 0.5);
  }

  runLeverageFull(input: IntakeInput, clarify: ClarifyOutput, teaser: LeverageTeaser) {
    const user = `${renderIntake(input)}\n\nCLARIFY OUTPUT:\n${JSON.stringify(clarify)}\n\nTEASER OUTPUT:\n${JSON.stringify(teaser)}\n\nReturn the FULL JSON (teaser fields with 5-10 ranked points, plus behaviors, behaviorPriorities, keyActors, causeEffect, loops, comb, strongestBarriers, barrierNarratives, gapLog, discoveryActivities).`;
    return this.call<LeverageFull>(this.leverageModel, LEVERAGE_PROMPT, user, 6000, 0.5);
  }

  runExperiment(
    input: IntakeInput,
    clarify: ClarifyOutput,
    _teaser: LeverageTeaser,
    full: LeverageFull,
    envelope: ResourceEnvelope,
  ) {
    const user = `${renderIntake(input)}\n\n${renderEnvelope(envelope)}\n\nCLARIFY OUTPUT:\n${JSON.stringify(clarify)}\n\nLEVERAGE FULL OUTPUT:\n${JSON.stringify(full)}\n\nReturn the EXPERIMENT JSON.`;
    return this.call<ExperimentOutput>(this.experimentModel, EXPERIMENT_PROMPT, user, 4000, 0.5);
  }
}
