// Pricing + cost constants for the CLEAR engine. Pure module (no npm:/Deno
// imports) so it is shared by the Deno edge runtime AND unit-testable in vitest.
// Per-million-token prices are verified against current Anthropic pricing; keep
// them here as the single source of truth (live-engine + the cost-cap guard both
// import from this file rather than redefining the table).

/** Per-million-token prices (USD). Update alongside model choices. */
export const PRICE: Record<string, { in: number; out: number }> = {
  "claude-haiku-4-5": { in: 1, out: 5 },
  "claude-sonnet-4-6": { in: 3, out: 15 },
  "claude-opus-4-8": { in: 5, out: 25 },
};

/** Price for a model id, falling back to the Sonnet floor for anything unknown. */
export function priceFor(model: string): { in: number; out: number } {
  return PRICE[model] ?? { in: 3, out: 15 };
}

// Anthropic server-side tool fees (USD per request) — billed SEPARATELY from
// tokens, so the Research phase under-reports cost without these. These are the
// historical defaults; CONFIRM against current pricing at
// platform.claude.com/docs/pricing and override per-deploy via the
// WEB_SEARCH_REQUEST_FEE_USD / WEB_FETCH_REQUEST_FEE_USD env vars (live-engine).
export const WEB_SEARCH_REQUEST_FEE_USD = 0.01;
export const WEB_FETCH_REQUEST_FEE_USD = 0.01;

/**
 * Worst-case output tokens per run action (mirrors the max_tokens passed in
 * live-engine). Used by the pre-run cost estimate, which runs PER REQUEST. The
 * "full" report is generated in two passes (two requests), each capped at 8000
 * output tokens — so 8000 is the right per-request estimate for either pass.
 */
export const PHASE_MAX_OUTPUT: Record<string, number> = {
  clarify: 3000,
  leverage: 2500,
  full: 8000,
  experiment: 4000,
  research: 8000,
};

/**
 * Resolve which model a phase will use, mirroring LiveClearEngine's env reads so
 * the pre-run estimate prices the same model the run will actually use. Defaults
 * to the Sonnet floor when the env var is unset.
 */
export function modelForPhase(
  phase: string,
  getEnv: (key: string) => string | undefined,
): string {
  const v = (key: string) => getEnv(key) ?? "claude-sonnet-4-6";
  switch (phase) {
    case "clarify":
      return v("CLARIFY_MODEL");
    case "leverage":
    case "full":
      return v("LEVERAGE_MODEL");
    case "experiment":
      return v("EXPERIMENT_MODEL");
    case "research":
      return v("RESEARCH_MODEL");
    default:
      return "claude-sonnet-4-6";
  }
}
