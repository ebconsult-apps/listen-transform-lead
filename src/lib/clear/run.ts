import { requireSupabase } from "@/lib/supabase";
import {
  getProject,
  getProjectInput,
  listDocuments,
  setProjectStatus,
} from "@/lib/db";
import { AI_MODE, getClearEngine } from "./index";
import type {
  ClarifyOutput,
  IntakeInput,
  LeverageTeaser,
  RunPhase,
} from "./types";

async function buildIntake(projectId: string): Promise<IntakeInput> {
  const [project, input, docs] = await Promise.all([
    getProject(projectId),
    getProjectInput(projectId),
    listDocuments(projectId),
  ]);
  return {
    challenge: input?.challenge ?? "",
    stakeholders: input?.stakeholders ?? [],
    timeline: input?.timeline ?? undefined,
    targetGroup: project.target_group ?? undefined,
    useCase: project.use_case ?? undefined,
    documents: docs
      .filter((d) => d.extracted_text)
      .map((d) => ({ filename: d.filename, text: d.extracted_text! })),
  };
}

async function persistRun(
  projectId: string,
  phase: RunPhase,
  output: unknown,
  tokens?: number,
  costUsd?: number,
) {
  const sb = requireSupabase();
  const { error } = await sb.from("runs").insert({
    project_id: projectId,
    phase,
    status: "done",
    ai_mode: AI_MODE,
    output,
    tokens_used: tokens ?? 0,
    cost_usd: costUsd ?? 0,
  });
  if (error) throw error;
}

/**
 * Kick off CLARIFY + partial LEVERAGE (the free teaser).
 *
 * - stub mode: run the engine in-browser and write `runs` rows directly (RLS
 *   lets workspace members insert). Fully demoable without any deployed backend.
 * - live mode: delegate to the `project-run` edge function, which holds the
 *   Anthropic key and enforces the per-workspace cost cap server-side.
 */
export async function runTeaser(projectId: string): Promise<void> {
  if (AI_MODE === "live") {
    const sb = requireSupabase();
    const { error } = await sb.functions.invoke("project-run", {
      body: { projectId, phase: "teaser" },
    });
    if (error) throw error;
    return;
  }

  await setProjectStatus(projectId, "running");
  try {
    const intake = await buildIntake(projectId);
    const engine = getClearEngine();
    const clarify = await engine.runClarify(intake);
    await persistRun(projectId, "clarify", clarify.output, clarify.tokens, clarify.costUsd);
    const teaser = await engine.runLeverageTeaser(intake, clarify.output);
    await persistRun(projectId, "leverage_teaser", teaser.output, teaser.tokens, teaser.costUsd);
    await setProjectStatus(projectId, "teaser_ready");
  } catch (e) {
    await setProjectStatus(projectId, "error");
    throw e;
  }
}

/** Generate the full report after the paywall is cleared. */
export async function runFull(projectId: string): Promise<void> {
  if (AI_MODE === "live") {
    const sb = requireSupabase();
    const { error } = await sb.functions.invoke("project-run", {
      body: { projectId, phase: "full" },
    });
    if (error) throw error;
    return;
  }

  await setProjectStatus(projectId, "running");
  try {
    const intake = await buildIntake(projectId);
    const engine = getClearEngine();
    const clarify = await engine.runClarify(intake);
    const teaser = await engine.runLeverageTeaser(intake, clarify.output);
    const full = await engine.runLeverageFull(intake, clarify.output, teaser.output);
    await persistRun(projectId, "leverage_full", full.output, full.tokens, full.costUsd);
    await setProjectStatus(projectId, "full_ready");
  } catch (e) {
    await setProjectStatus(projectId, "error");
    throw e;
  }
}

/** Convenience accessors used by the report views. */
export function latestOutput<T>(
  runs: { phase: RunPhase; output: unknown; created_at: string }[],
  phase: RunPhase,
): T | null {
  const matching = runs.filter((r) => r.phase === phase);
  if (matching.length === 0) return null;
  return matching[matching.length - 1].output as T;
}

export type { ClarifyOutput, LeverageTeaser };
