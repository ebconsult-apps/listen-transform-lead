import Anthropic from "npm:@anthropic-ai/sdk@^0.32";
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
  CLARIFY_PROMPT,
  EXPERIMENT_PROMPT,
  LEVERAGE_PROMPT,
  renderEnvelope,
  renderIntake,
  renderKnowledge,
  RESEARCH_PROMPT,
} from "./prompts.ts";

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
  private experimentModel = Deno.env.get("EXPERIMENT_MODEL") ?? "claude-sonnet-4-6";
  private researchModel = Deno.env.get("RESEARCH_MODEL") ?? "claude-sonnet-4-6";

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
    return this.call<ClarifyOutput>(this.clarifyModel, CLARIFY_PROMPT, user, 3000);
  }

  runLeverageTeaser(input: IntakeInput, clarify: ClarifyOutput) {
    const user = `${renderIntake(input)}\n\nCLARIFY OUTPUT:\n${JSON.stringify(clarify)}\n\nReturn the TEASER JSON.`;
    return this.call<LeverageTeaser>(this.leverageModel, LEVERAGE_PROMPT, user, 2500);
  }

  runLeverageFull(input: IntakeInput, clarify: ClarifyOutput, teaser: LeverageTeaser) {
    const user = `${renderIntake(input)}\n\nCLARIFY OUTPUT:\n${JSON.stringify(clarify)}\n\nTEASER OUTPUT:\n${JSON.stringify(teaser)}\n\nReturn the FULL JSON (teaser fields with 5-10 ranked points, plus behaviors, behaviorPriorities, keyActors, causeEffect, loops, comb, strongestBarriers, barrierNarratives, gapLog, discoveryActivities).`;
    return this.call<LeverageFull>(this.leverageModel, LEVERAGE_PROMPT, user, 6000);
  }

  runExperiment(
    input: IntakeInput,
    clarify: ClarifyOutput,
    _teaser: LeverageTeaser,
    full: LeverageFull,
    envelope: ResourceEnvelope,
  ) {
    const user = `${renderIntake(input)}\n\n${renderEnvelope(envelope)}\n\nCLARIFY OUTPUT:\n${JSON.stringify(clarify)}\n\nLEVERAGE FULL OUTPUT:\n${JSON.stringify(full)}\n\nReturn the EXPERIMENT JSON.`;
    return this.call<ExperimentOutput>(this.experimentModel, EXPERIMENT_PROMPT, user, 4000);
  }

  runResearch(input: IntakeInput, ctx: ResearchContext) {
    const user = [
      renderIntake(input),
      "",
      "CURATED KNOWLEDGE-BASE ENTRIES (cite by title where you use them):",
      renderKnowledge(ctx.knowledgeEntries ?? []),
      "",
      "Use the web search and web fetch tools to find and CITE external evidence, then return the RESEARCH JSON.",
    ].join("\n");
    return this.callWithTools<ResearchOutput>(this.researchModel, RESEARCH_PROMPT, user, 8000);
  }

  /**
   * Like call(), but enables Anthropic's server-side web search + fetch tools so
   * the model can gather and cite real evidence. The server runs its own tool
   * loop; when it pauses (stop_reason "pause_turn") we re-send the accumulated
   * turn until it finishes — no extra "continue" message, the API resumes from
   * the trailing server_tool_use block. Token counts are summed across hops.
   * Web search also has a per-search cost not reflected here; the monthly
   * workspace cost cap is the backstop.
   */
  private async callWithTools<T>(
    model: string,
    system: string,
    user: string,
    maxTokens: number,
  ): Promise<EngineResult<T>> {
    // The web-search/fetch tools and the multi-hop request shape are newer than
    // the pinned SDK's types but valid at the API level — build loosely and cast.
    // deno-lint-ignore no-explicit-any
    const req: any = {
      model,
      max_tokens: maxTokens,
      system,
      tools: [
        { type: "web_search_20260209", name: "web_search", max_uses: 6 },
        { type: "web_fetch_20260209", name: "web_fetch", max_uses: 6 },
      ],
      messages: [{ role: "user", content: user }],
    };
    let inTok = 0;
    let outTok = 0;
    // deno-lint-ignore no-explicit-any
    let res: any;
    let guard = 0;
    do {
      res = await this.client.messages.create(req);
      inTok += res.usage?.input_tokens ?? 0;
      outTok += res.usage?.output_tokens ?? 0;
      if (res.stop_reason === "pause_turn") {
        req.messages.push({ role: "assistant", content: res.content });
        guard++;
      }
    } while (res.stop_reason === "pause_turn" && guard < 6);
    const text = (res.content ?? [])
      .filter((b: { type: string }) => b.type === "text")
      .map((b: { text?: string }) => b.text ?? "")
      .join("");
    const p = priceFor(model);
    const costUsd = (inTok * p.in + outTok * p.out) / 1_000_000;
    return { output: extractJson<T>(text), tokens: inTok + outTok, costUsd };
  }
}
