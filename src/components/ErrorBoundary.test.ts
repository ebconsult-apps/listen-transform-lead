import { describe, it, expect, vi } from "vitest";
import { ErrorBoundary } from "./ErrorBoundary";

// Node-env tests (matching the repo's vitest setup): exercise the boundary's
// pure catch contract without rendering. React guarantees these are invoked on a
// child throw; here we assert they map the error to fallback state and log it.
describe("ErrorBoundary", () => {
  it("getDerivedStateFromError flips hasError and captures the error", () => {
    const error = new Error("kaboom");
    expect(ErrorBoundary.getDerivedStateFromError(error)).toEqual({
      hasError: true,
      error,
    });
  });

  it("componentDidCatch logs the error without rethrowing", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const boundary = new ErrorBoundary({ children: null });
    expect(() =>
      boundary.componentDidCatch(new Error("kaboom"), {
        componentStack: "\n    at Boom",
      }),
    ).not.toThrow();
    expect(spy).toHaveBeenCalledOnce();
    spy.mockRestore();
  });
});
