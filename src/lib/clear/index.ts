import type { ClearEngine } from "./types";
import { StubClearEngine } from "./stub-engine";

export * from "./types";

/**
 * Engine selector (spec §9). On the client we only ever construct the stub —
 * live Claude calls run inside the `project-run` edge function (which holds the
 * API key). `runProject` in ./run.ts routes to the edge function when live.
 */
export function getClearEngine(): ClearEngine {
  return new StubClearEngine();
}

export const AI_MODE: "stub" | "live" =
  (import.meta.env.VITE_AI_MODE as "stub" | "live") ?? "stub";
