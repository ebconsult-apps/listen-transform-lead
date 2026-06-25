/**
 * Dev/QA access mode — capability flag + reactive runtime store.
 *
 * This module is the single gate for a fully-mocked, no-backend developer/QA
 * mode: a fake session + an in-memory data layer let anyone walk the whole
 * self-serve product (every project state) without Supabase, login, or Stripe.
 *
 * It is deliberately dependency-free (only React, for the hook) so non-React
 * data code (`db.ts`, `clear/run.ts`, …) can read `devActive()` as a plain
 * function call. It must NOT import the mock store / seed — keeping the import
 * graph one-directional (data libs → config, data libs → mock-store) avoids
 * cycles, and lets the whole `dev/` tree tree-shake out of production.
 *
 * Production safety: `DEV_ACCESS_ENABLED` is a build-time literal. `import.meta
 * .env.DEV` is false for any `vite build`, and with `VITE_DEV_BYPASS` unset the
 * flag folds to literal `false` — every `devActive()` collapses, every guarded
 * branch dies, and this module + the mock layer drop from the bundle.
 */
import { useSyncExternalStore } from "react";

/** Build-time capability gate. True only in `vite dev` or with an explicit opt-in. */
export const DEV_ACCESS_ENABLED = import.meta.env.DEV || __DEV_BYPASS__;

/** Env default AI mode, inlined here (not imported from clear/index) to avoid a cycle. */
const ENV_AI_MODE: "stub" | "live" =
  (import.meta.env.VITE_AI_MODE as "stub" | "live") ?? "stub";

export type AiMode = "stub" | "live";
/** Seeded fixture sets the dashboard can load. "seeded" = all states as projects. */
export type DatasetId = "seeded" | "empty";

export interface DevState {
  /** Whether the mock session + data layer are currently intercepting. */
  active: boolean;
  /** Runtime AI toggle (only meaningful for a real backend; see DevPanel). */
  aiMode: AiMode;
  /** Which seeded dataset the mock store is built from. */
  dataset: DatasetId;
}

const LS_KEY = "clear.dev";
const DEFAULT: DevState = { active: false, aiMode: "stub", dataset: "seeded" };

function load(): DevState {
  if (!DEV_ACCESS_ENABLED) return DEFAULT;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return DEFAULT;
    return { ...DEFAULT, ...(JSON.parse(raw) as Partial<DevState>) };
  } catch {
    return DEFAULT;
  }
}

let state: DevState = load();
const listeners = new Set<() => void>();

function persist() {
  try {
    // Persist only the toggles, not the dataset: the mock store initializes to the
    // default dataset on every load (data resets on reload by design), so persisting
    // a different dataset would leave the picker and the store out of sync.
    const { active, aiMode } = state;
    localStorage.setItem(LS_KEY, JSON.stringify({ active, aiMode }));
  } catch {
    /* ignore (private mode / SSR) */
  }
}

function emit() {
  for (const l of listeners) l();
}

function set(patch: Partial<DevState>) {
  if (!DEV_ACCESS_ENABLED) return;
  state = { ...state, ...patch };
  persist();
  emit();
}

export function getDevState(): DevState {
  return state;
}

export function subscribeDev(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function enterDevMode(dataset?: DatasetId) {
  set({ active: true, ...(dataset ? { dataset } : {}) });
}

export function exitDevMode() {
  set({ active: false });
}

export function setDevAiMode(aiMode: AiMode) {
  set({ aiMode });
}

export function setDevDataset(dataset: DatasetId) {
  set({ dataset });
}

/** True only when the build allows dev access AND the user has turned it on. */
export function devActive(): boolean {
  return DEV_ACCESS_ENABLED && state.active;
}

/**
 * The AI mode that should actually be used right now: the in-app dev toggle when
 * dev mode is active, otherwise the build-time env default. Read by `clear/run`.
 */
export function effectiveAiMode(): AiMode {
  return devActive() ? state.aiMode : ENV_AI_MODE;
}

/** React binding for the dev store (DevPanel, useAuth). */
export function useDevState(): DevState {
  return useSyncExternalStore(subscribeDev, getDevState, getDevState);
}
