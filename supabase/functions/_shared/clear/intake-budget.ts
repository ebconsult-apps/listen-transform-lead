// Per-run input budget + cost projection. Pure module (no npm:/Deno imports) so
// it is shared by the edge runtime AND unit-testable in vitest.
//
// Why: every CLEAR phase re-sends the whole intake (all documents + respondent
// text) to the model, and renderIntake slices each document to 20k chars but
// does NOT cap the number of documents. Without a ceiling a single run can fan a
// project out to hundreds of thousands of input tokens. These limits bound the
// worst-case cost of any one run; the monthly tier cap (cost-cap.ts) bounds the
// aggregate.

/** Hard ceilings for a single run's combined document input. Env-overridable. */
export const MAX_INTAKE_CHARS = 80_000; // ≈ 20k tokens of document text
export const MAX_DOCUMENTS = 15;

/** renderIntake() slices each document to this many chars; mirror it here. */
export const PER_DOCUMENT_CHAR_SLICE = 20_000;

/** Fixed overhead (tokens) covering the system prompt + prior-phase JSON fed
 * back into later phases. Conservative so the projection never under-counts the
 * non-document part of the prompt. */
export const OVERHEAD_INPUT_TOKENS = 6_000;

/** ~4 chars per token is a good rule of thumb for English/JSON prompt text. */
export const CHARS_PER_TOKEN = 4;

export interface IntakeDoc {
  filename: string;
  text: string;
}

export interface IntakeBudgetResult {
  ok: boolean;
  docCount: number;
  totalChars: number;
  /** Present only when ok === false; safe to surface to the user. */
  reason?: string;
}

/**
 * Reject an intake that is too large to run safely. Counts the FULL text length
 * (not the sliced length) for the document-count and total-size gates, so a user
 * can't smuggle huge inputs past the per-document slice by stacking many docs.
 */
export function checkIntakeBudget(
  documents: IntakeDoc[],
  opts: { maxChars?: number; maxDocs?: number } = {},
): IntakeBudgetResult {
  const maxChars = opts.maxChars ?? MAX_INTAKE_CHARS;
  const maxDocs = opts.maxDocs ?? MAX_DOCUMENTS;
  const docCount = documents.length;
  const totalChars = documents.reduce((sum, d) => sum + (d.text?.length ?? 0), 0);

  if (docCount > maxDocs) {
    return {
      ok: false,
      docCount,
      totalChars,
      reason:
        `Too many documents for one run (${docCount}; max ${maxDocs}). ` +
        `Keep only the most relevant files.`,
    };
  }
  if (totalChars > maxChars) {
    return {
      ok: false,
      docCount,
      totalChars,
      reason:
        `Inputs are too large for one run (${totalChars.toLocaleString()} characters; ` +
        `max ${maxChars.toLocaleString()}). Trim or split your documents.`,
    };
  }
  return { ok: true, docCount, totalChars };
}

export function estimateTokens(chars: number): number {
  return Math.ceil(Math.max(0, chars) / CHARS_PER_TOKEN);
}

/**
 * Estimate the input-token count for a phase, mirroring renderIntake's
 * per-document slicing and adding a fixed system/prior-output overhead.
 */
export function estimateIntakeInputTokens(
  challenge: string,
  documents: IntakeDoc[],
  overheadTokens: number = OVERHEAD_INPUT_TOKENS,
): number {
  let chars = challenge?.length ?? 0;
  for (const d of documents) {
    chars += Math.min(d.text?.length ?? 0, PER_DOCUMENT_CHAR_SLICE);
  }
  return estimateTokens(chars) + overheadTokens;
}

/** Worst-case projected USD cost of a run: estimated input + full output cap. */
export function projectedCostUsd(
  inputTokens: number,
  maxOutputTokens: number,
  price: { in: number; out: number },
): number {
  return (inputTokens * price.in + maxOutputTokens * price.out) / 1_000_000;
}
