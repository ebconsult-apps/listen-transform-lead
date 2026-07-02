import { describe, it, expect, vi, afterEach } from "vitest";
import { GENERIC_ERROR_MESSAGE, safeErrorMessage } from "./errors";

describe("safeErrorMessage", () => {
  afterEach(() => vi.restoreAllMocks());

  it("returns the generic message, never the original error text", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const internal = new Error('insert into "report_passes" violates unique constraint');
    expect(safeErrorMessage(internal, "stripe-webhook")).toBe(GENERIC_ERROR_MESSAGE);
    expect(safeErrorMessage(internal, "stripe-webhook")).not.toContain("report_passes");
    expect(spy).toHaveBeenCalled();
  });

  it("logs the original error under the context tag", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const boom = new Error("boom");
    safeErrorMessage(boom, "project-run");
    expect(spy).toHaveBeenCalledWith("project-run: unhandled error", boom);
  });

  it("handles non-Error throwables", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(safeErrorMessage("raw string failure", "respondent")).toBe(GENERIC_ERROR_MESSAGE);
    expect(safeErrorMessage(undefined, "respondent")).toBe(GENERIC_ERROR_MESSAGE);
  });
});
