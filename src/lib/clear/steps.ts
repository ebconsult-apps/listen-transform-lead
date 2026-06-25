/**
 * Pure step-model helpers for the project workflow stepper. Kept dependency-free
 * (no React, no backend) so they can be unit-tested — see steps.test.ts. The UI in
 * ProjectDetail.tsx wires these to component state; WorkflowStepper.tsx renders them.
 */
export type StepId = "clarify" | "leverage" | "full" | "experiment";

export interface StepDef {
  id: StepId;
  label: string;
  token: string;
}

/** The derived booleans ProjectDetail already computes, packaged for the step model. */
export interface StepFlags {
  isApproved: boolean;
  hasTeaser: boolean;
  showFull: boolean;
  canExperiment: boolean;
  hasExperiment: boolean;
}

/** Whether each phase has produced its deliverable. */
export function stepDoneMap(f: StepFlags): Record<StepId, boolean> {
  return {
    clarify: f.isApproved,
    leverage: f.hasTeaser,
    full: f.showFull,
    experiment: f.hasExperiment,
  };
}

/**
 * Whether each phase is reachable. `full` is viewable once a teaser exists (it shows
 * the report when unlocked, or the paywall otherwise) — distinct from being *done*.
 */
export function stepUnlockedMap(f: StepFlags): Record<StepId, boolean> {
  return {
    clarify: true,
    leverage: f.isApproved,
    full: f.hasTeaser,
    experiment: f.canExperiment,
  };
}

/** The deepest step the user has reached — the natural cursor when nothing is pinned. */
export function furthestStep(
  done: Record<StepId, boolean>,
  unlocked: Record<StepId, boolean>,
): StepId {
  if (done.experiment) return "experiment";
  if (unlocked.full) return "full";
  if (unlocked.leverage) return "leverage";
  return "clarify";
}

/**
 * True when a downstream phase is outdated: it was produced (`downstreamAt`) before
 * the upstream phase it depends on was last (re)produced (`upstreamAt`). Null on either
 * side means "can't be stale" (the phase doesn't exist yet).
 */
export function isStale(upstreamAt: string | null, downstreamAt: string | null): boolean {
  return Boolean(
    upstreamAt && downstreamAt && new Date(upstreamAt).getTime() > new Date(downstreamAt).getTime(),
  );
}
