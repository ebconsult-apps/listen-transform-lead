import { describe, it, expect } from "vitest";
import { buildProgress, FULL_REPORT_STEPS, type BuildStep } from "./report-loader";

const last = FULL_REPORT_STEPS.length - 1;

describe("buildProgress", () => {
  it("starts on the first step at 0ms, nothing done, bar below the cap", () => {
    const { current, pct, done } = buildProgress(FULL_REPORT_STEPS, 0);
    expect(current).toBe(0);
    expect(done(0)).toBe(false);
    expect(pct).toBeLessThan(90);
  });

  it("advances to a later step and marks earlier steps done as time elapses", () => {
    const { current, done } = buildProgress(FULL_REPORT_STEPS, 7000); // past the 6s first step
    expect(current).toBeGreaterThan(0);
    expect(done(0)).toBe(true);
  });

  it("never marks the terminal step done and caps pct at 90, even far past the timeline", () => {
    const r = buildProgress(FULL_REPORT_STEPS, 10 * 60 * 1000);
    expect(r.current).toBe(last); // parks on the terminal step
    expect(r.done(last)).toBe(false); // terminal step is never "done"
    expect(r.pct).toBe(90); // bar never reaches 100
  });

  it("monotonically increases pct toward the cap", () => {
    const a = buildProgress(FULL_REPORT_STEPS, 5000).pct;
    const b = buildProgress(FULL_REPORT_STEPS, 20000).pct;
    expect(b).toBeGreaterThanOrEqual(a);
    expect(b).toBeLessThanOrEqual(90);
  });

  it("handles a single terminal-only step without dividing by zero", () => {
    const steps: BuildStep[] = [{ label: "Working", seconds: 0 }];
    const r = buildProgress(steps, 1234);
    expect(r.current).toBe(0);
    expect(r.done(0)).toBe(false);
    expect(Number.isFinite(r.pct)).toBe(true);
  });
});
