import Anthropic from "npm:@anthropic-ai/sdk@^0.32";
import type {
  ClarifyOutput,
  ClearEngine,
  EngineResult,
  IntakeInput,
  LeverageFull,
  LeverageTeaser,
} from "./types.ts";
import { CLARIFY_PROMPT, LEVERAGE_PROMPT, renderIntake } from "./prompts.ts";

// Rough per-million-token prices (USD) for cost logging. Update alongside model
// choices; these are only used for the cost cap + reporting, not billing.
const PRICE: Record<string, { in: number; out: number }> = {
  "claude-haiku-4-5": { in: 1, out: 5 },
  "claude-sonnet-4-6": { in: 3, out: 15 },
};

function priceFor(model: string) {
  return PRICE[model] ?? { in: 3, out: 15 };
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
 * upgraded without code changes. Clarify uses a cheap model (challenge +
 * stakeholders only); Leverage adds document context on a deeper model.
 */
export class LiveClearEngine implements ClearEngine {
  private client = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY")! });
  private clarifyModel = Deno.env.get("CLARIFY_MODEL") ?? "claude-haiku-4-5";
  private leverageModel = Deno.env.get("LEVERAGE_MODEL") ?? "claude-sonnet-4-6";

  private async call<T>(
    model: string,
    system: string,
    user: string,
    maxTokens: number,
  ): Promise<EngineResult<T>> {
    const res = await this.client.messages.create({
      model,
      system,
      max_tokens: maxTokens,
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
    // Clarify: challenge + stakeholders only — no documents.
    const user = renderIntake({ ...input, documents: [] });
    return this.call<ClarifyOutput>(this.clarifyModel, CLARIFY_PROMPT, user, 2000);
  }

  runLeverageTeaser(input: IntakeInput, clarify: ClarifyOutput) {
    const user = `${renderIntake(input)}\n\nCLARIFY OUTPUT:\n${JSON.stringify(clarify)}\n\nReturn the TEASER JSON.`;
    return this.call<LeverageTeaser>(this.leverageModel, LEVERAGE_PROMPT, user, 2000);
  }

  runLeverageFull(input: IntakeInput, clarify: ClarifyOutput, teaser: LeverageTeaser) {
    const user = `${renderIntake(input)}\n\nCLARIFY OUTPUT:\n${JSON.stringify(clarify)}\n\nTEASER OUTPUT:\n${JSON.stringify(teaser)}\n\nReturn the FULL JSON (teaser fields + comb, barrierNarratives, gapLog, discoveryActivities).`;
    return this.call<LeverageFull>(this.leverageModel, LEVERAGE_PROMPT, user, 4000);
  }
}
