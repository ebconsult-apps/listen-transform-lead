/**
 * Pure timing model for the "building your report" loader. Kept free of React /
 * the DOM (mirrors `steps.ts`) so the advance-and-cap logic is unit-testable under
 * the node-only vitest harness.
 *
 * The full report has no real sub-phase progress to poll (generation only flips
 * `running` → `full_ready`), so the loader fakes a sense of construction on a
 * client-side timer. Two invariants keep it honest: the percentage never reaches
 * 100, and the final step is never marked done — the real result swapping the
 * loader out is the only thing that signals completion.
 */

export interface BuildStep {
  label: string;
  /**
   * Seconds to dwell on this step before advancing. The LAST step's value is
   * ignored — it stays "in progress" until the component unmounts.
   */
  seconds: number;
}

export interface BuildProgress {
  /** Index of the currently-active step. */
  current: number;
  /** Filled percentage for the bar, hard-capped at 90 (never "done"). */
  pct: number;
  /** Whether step `i` has completed (true only for steps before `current`). */
  done: (i: number) => boolean;
}

// Step labels map to what `runFull` actually produces, and their dwell times track
// the real run: the report is generated in TWO model passes (systems/behaviours,
// then COM-B barriers/actions), each its own ~75-85s request, so the checklist
// reads as truthful work (~190s total) rather than a single fast spinner.
export const FULL_REPORT_STEPS: BuildStep[] = [
  { label: "Reviewing your inputs and approved target", seconds: 8 },
  { label: "Pass 1 · mapping the system, behaviours and leverage points", seconds: 85 },
  { label: "Pass 2 · analysing COM-B barriers and the evidence", seconds: 75 },
  { label: "Drafting barrier narratives and discovery activities", seconds: 20 },
  // Terminal step — spins until the real report arrives. `seconds` is unused.
  { label: "Compiling your report", seconds: 0 },
];

/**
 * Map elapsed time to loader state. `current` walks the cumulative dwell timeline
 * and parks on the terminal step once the timeline is exhausted; `pct` is capped
 * at 90 so the bar never claims completion.
 */
export function buildProgress(steps: BuildStep[], elapsedMs: number): BuildProgress {
  const dwell = steps.slice(0, -1).map((s) => s.seconds * 1000);
  const total = dwell.reduce((a, b) => a + b, 0) || 1;

  let acc = 0;
  let current = steps.length - 1; // default: park on the terminal step
  for (let i = 0; i < dwell.length; i++) {
    if (elapsedMs < acc + dwell[i]) {
      current = i;
      break;
    }
    acc += dwell[i];
  }

  const pct = Math.min(90, Math.round((Math.min(elapsedMs, total) / total) * 90));

  return { current, pct, done: (i: number) => i < current };
}
