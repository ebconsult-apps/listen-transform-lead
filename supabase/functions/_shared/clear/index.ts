import type { ClearEngine } from "./types.ts";
import { StubClearEngine } from "./stub-engine.ts";
import { LiveClearEngine } from "./live-engine.ts";

/** Engine selector (spec §9). One line is the entire stub→live swap. */
export function getClearEngine(): ClearEngine {
  return Deno.env.get("AI_MODE") === "live"
    ? new LiveClearEngine()
    : new StubClearEngine();
}

export * from "./types.ts";
