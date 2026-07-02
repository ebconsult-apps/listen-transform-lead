import { describe, it, expect } from "vitest";
import { RunError, toRunError, unwrapInvokeError } from "./invoke-error";

const QUOTA_MSG = "Free plan monthly limit reached — upgrade to run more reports.";

/** Shape of a supabase-js FunctionsHttpError: generic message + context Response. */
function httpError(status: number, body: unknown) {
  const e = new Error("Edge Function returned a non-2xx status code");
  (e as unknown as { context: unknown }).context = {
    status,
    json: async () => body,
  };
  return e;
}

describe("unwrapInvokeError", () => {
  it("pulls the server message and status out of the context Response", async () => {
    const result = await unwrapInvokeError(httpError(402, { error: QUOTA_MSG }), "fallback");
    expect(result).toEqual({ message: QUOTA_MSG, status: 402 });
  });

  it("keeps the status but falls back to the error message when the body has no error", async () => {
    const result = await unwrapInvokeError(httpError(500, {}), "fallback");
    expect(result.status).toBe(500);
    expect(result.message).toBe("Edge Function returned a non-2xx status code");
  });

  it("survives a json() that throws (non-JSON / consumed body)", async () => {
    const e = new Error("boom");
    (e as unknown as { context: unknown }).context = {
      status: 402,
      json: async () => {
        throw new Error("body consumed");
      },
    };
    const result = await unwrapInvokeError(e, "fallback");
    expect(result).toEqual({ message: "boom", status: 402 });
  });

  it("handles errors without context (relay/fetch errors) — status null", async () => {
    const result = await unwrapInvokeError(new Error("network down"), "fallback");
    expect(result).toEqual({ message: "network down", status: null });
  });

  it("uses the fallback for non-Error throwables with no message", async () => {
    expect(await unwrapInvokeError(null, "fallback")).toEqual({ message: "fallback", status: null });
    expect(await unwrapInvokeError({}, "fallback")).toEqual({ message: "fallback", status: null });
  });
});

describe("toRunError", () => {
  it("produces a RunError carrying the server message and status", async () => {
    const err = await toRunError(httpError(402, { error: QUOTA_MSG }), "Clarify failed.");
    expect(err).toBeInstanceOf(RunError);
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe("RunError");
    expect(err.message).toBe(QUOTA_MSG);
    expect(err.status).toBe(402);
  });

  it("passes an existing RunError through untouched", async () => {
    const original = new RunError(QUOTA_MSG, 402);
    expect(await toRunError(original, "fallback")).toBe(original);
  });

  it("defaults status to null when unknown", async () => {
    const err = await toRunError(new Error("x"), "fallback");
    expect(err.status).toBeNull();
  });
});
