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
import {
  priceFor,
  WEB_FETCH_REQUEST_FEE_USD,
  WEB_SEARCH_REQUEST_FEE_USD,
} from "./pricing.ts";

// Per-request fees for Anthropic's server-side web tools (USD). These are billed
// separately from tokens, so the Research phase under-reports its true cost
// without them. Defaults live in pricing.ts; override per-deploy via env.
// Confirm current rates at platform.claude.com/docs/pricing.
const WEB_SEARCH_FEE_USD = Number(
  Deno.env.get("WEB_SEARCH_REQUEST_FEE_USD") ?? WEB_SEARCH_REQUEST_FEE_USD,
);
const WEB_FETCH_FEE_USD = Number(
  Deno.env.get("WEB_FETCH_REQUEST_FEE_USD") ?? WEB_FETCH_REQUEST_FEE_USD,
);

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
  private researchModel = Deno.env.get("RESEARCH_MODEL") ?? "claude-sonnet-4-6";

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
   * the trailing server_tool_use block. Token counts are summed across hops, and
   * each web_search / web_fetch request adds its per-request fee to costUsd so
   * the monthly cost cap reflects true spend (not just tokens).
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
    let webSearches = 0;
    let webFetches = 0;
    // deno-lint-ignore no-explicit-any
    let res: any;
    let guard = 0;
    do {
      res = await this.client.messages.create(req);
      inTok += res.usage?.input_tokens ?? 0;
      outTok += res.usage?.output_tokens ?? 0;
      // Tally server-side tool calls across hops so their per-request fees are
      // billed (web search/fetch cost is not in the token usage figures).
      for (const b of res.content ?? []) {
        if (b?.type === "server_tool_use") {
          if (b.name === "web_search") webSearches++;
          else if (b.name === "web_fetch") webFetches++;
        }
      }
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
    const toolFeesUsd =
      webSearches * WEB_SEARCH_FEE_USD + webFetches * WEB_FETCH_FEE_USD;
    const costUsd = (inTok * p.in + outTok * p.out) / 1_000_000 + toolFeesUsd;
    return { output: extractJson<T>(text), tokens: inTok + outTok, costUsd };
  }
}
