// Minimal Anthropic Messages API client for the eval harness.
//
// Deliberately dependency-free: a plain `fetch` against the Messages API instead
// of pulling @anthropic-ai/sdk into the repo. The harness is dev/eval-only, so a
// ~40-line wrapper keeps package.json untouched and the offline path importable
// without any network stack. The edge engine (Deno) uses the real SDK; this
// client only mirrors the request shape the harness needs.

const API_URL =
  (process.env.ANTHROPIC_BASE_URL?.replace(/\/$/, "") ?? "https://api.anthropic.com") +
  "/v1/messages";
const API_VERSION = "2023-06-01";

/** True when a live run is possible (an API key is present in the environment). */
export function hasApiKey(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export interface MessagesRequest {
  model: string;
  system: string;
  user: string;
  maxTokens: number;
  temperature?: number;
  tools?: unknown[];
}

export interface MessagesResult {
  text: string;
  inputTokens: number;
  outputTokens: number;
  stopReason: string | null;
}

interface AnthropicRequestBody {
  model: string;
  max_tokens: number;
  system: string;
  messages: { role: "user"; content: string }[];
  temperature?: number;
  tools?: unknown[];
}

interface AnthropicResponseBody {
  content?: { type: string; text?: string }[];
  usage?: { input_tokens?: number; output_tokens?: number };
  stop_reason?: string | null;
}

/**
 * Call the Messages API and return the concatenated text blocks. Throws a clear,
 * actionable error when the key is missing (so the runner can fall back to / demand
 * the offline path) or the request fails.
 */
export async function callMessages(req: MessagesRequest): Promise<MessagesResult> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set — the live eval path needs it. Run `npm run eval:offline` " +
        "to exercise the harness without an API key, or export ANTHROPIC_API_KEY and re-run.",
    );
  }
  const isOpus = req.model.includes("opus");
  const body: AnthropicRequestBody = {
    model: req.model,
    max_tokens: req.maxTokens,
    system: req.system,
    messages: [{ role: "user", content: req.user }],
  };
  // Opus self-regulates temperature and 400s if one is sent; gate it like the engine.
  if (req.temperature !== undefined && !isOpus) body.temperature = req.temperature;
  if (req.tools) body.tools = req.tools;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": API_VERSION,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Anthropic API ${res.status}: ${detail.slice(0, 500)}`);
  }
  const data = (await res.json()) as AnthropicResponseBody;
  const text = (data.content ?? [])
    .filter((b) => b.type === "text")
    .map((b) => b.text ?? "")
    .join("");
  return {
    text,
    inputTokens: data.usage?.input_tokens ?? 0,
    outputTokens: data.usage?.output_tokens ?? 0,
    stopReason: data.stop_reason ?? null,
  };
}

/** Tolerate fencing/prose around a JSON object — mirrors live-engine's extractJson. */
export function extractJson<T>(text: string): T {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Model did not return JSON");
  return JSON.parse(text.slice(start, end + 1)) as T;
}
