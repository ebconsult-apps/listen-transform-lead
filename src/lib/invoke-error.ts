// Unwrap supabase-js edge-function invoke errors. FunctionsHttpError hides the
// server's response behind `.context` (a fetch Response) and its own `.message`
// is the useless "Edge Function returned a non-2xx status code" — so callers
// that rethrow it verbatim lose both the status and the server's message (the
// 402 paywall/quota copy, 409 sequencing hints, …).
//
// Pure module: no data-lib or Deno imports, so the dev mock-store may import it
// (its imports must stay one-directional, see CLAUDE.md).

/** Structural view of FunctionsHttpError.context — enough of a fetch Response. */
interface InvokeContext {
  status?: number;
  json?: () => Promise<unknown>;
}

/**
 * A run/invoke failure with the HTTP status preserved, so UI code can branch
 * (402 → upsell moment) instead of pattern-matching message strings.
 */
export class RunError extends Error {
  readonly status: number | null;

  constructor(message: string, status: number | null = null) {
    super(message);
    this.name = "RunError";
    this.status = status;
  }
}

/**
 * Pull the server's `{ error }` message and HTTP status out of an invoke error.
 * Falls back to the error's own message, then to `fallback`. Note a Response
 * body is one-shot — unwrap each error exactly once.
 */
export async function unwrapInvokeError(
  error: unknown,
  fallback: string,
): Promise<{ message: string; status: number | null }> {
  const ctx = (error as { context?: InvokeContext } | null)?.context;
  const status = typeof ctx?.status === "number" ? ctx.status : null;
  if (ctx && typeof ctx.json === "function") {
    try {
      const body = (await ctx.json()) as { error?: unknown } | null;
      if (body?.error) return { message: String(body.error), status };
    } catch {
      /* non-JSON or already-consumed body — fall through */
    }
  }
  const message = (error as Error | null)?.message || fallback;
  return { message, status };
}

/** Convert any invoke error into a RunError (idempotent on RunError inputs). */
export async function toRunError(error: unknown, fallback: string): Promise<RunError> {
  if (error instanceof RunError) return error;
  const { message, status } = await unwrapInvokeError(error, fallback);
  return new RunError(message, status);
}
