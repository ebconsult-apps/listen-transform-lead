// Safe error mapping for edge-function catch-alls. Unexpected errors used to be
// echoed to clients verbatim (`(e as Error).message`), leaking internal details
// (SQL, Stripe, upstream API text). Log the real error server-side — Supabase
// function logs are the debugging surface — and return a generic message.
//
// Intentional, user-facing errors (quota/paywall/sequencing 4xx responses) are
// returned BEFORE the catch-all and are not routed through this helper.
//
// Pure (no Deno/npm imports) so vitest can unit-test it like the billing modules.

export const GENERIC_ERROR_MESSAGE = "Internal error";

/**
 * Log the original error under a per-function context tag and return the safe,
 * client-facing message.
 */
export function safeErrorMessage(e: unknown, context: string): string {
  console.error(`${context}: unhandled error`, e);
  return GENERIC_ERROR_MESSAGE;
}
