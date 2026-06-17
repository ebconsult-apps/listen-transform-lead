import { requireSupabase } from "@/lib/supabase";
import {
  getProject,
  getProjectInput,
  listDocuments,
  listRuns,
  setProjectStatus,
} from "@/lib/db";
import { listContributions, listReactions, summarizeRespondentInput } from "@/lib/collab";
import { apeaseParked, getExperimentDesign } from "@/lib/experiment";
import { AI_MODE, getClearEngine } from "./index";
import type {
  ClarifyOutput,
  GapFlag,
  IntakeInput,
  InterventionCandidate,
  LeverageFull,
  LeverageTeaser,
  RunPhase,
} from "./types";

async function buildIntake(projectId: string): Promise<IntakeInput> {
  const [project, input, docs, contributions, reactions] = await Promise.all([
    getProject(projectId),
    getProjectInput(projectId),
    listDocuments(projectId),
    listContributions(projectId),
    listReactions(projectId),
  ]);
  const documents = docs
    .filter((d) => d.extracted_text)
    .map((d) => ({ filename: d.filename, text: d.extracted_text! }));

  // Fold submitted respondent input (text answers + reaction summary) into intake.
  // Respondent documents already arrive via listDocuments (same project_id).
  const respondentInput = summarizeRespondentInput(contributions, reactions);
  if (respondentInput) {
    documents.push({ filename: "Respondent contributions", text: respondentInput });
  }

  return {
    challenge: input?.challenge ?? "",
    stakeholders: input?.stakeholders ?? [],
    timeline: input?.timeline ?? undefined,
    targetGroup: project.target_group ?? undefined,
    useCase: project.use_case ?? undefined,
    documents,
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
 * Seed a phase's gapLog flags into the persistent cross-phase assumptions/gaps
 * log. Idempotent: skips flags already recorded for the same phase + content.
 */
async function seedGapLog(projectId: string, phase: RunPhase, flags?: GapFlag[]) {
  if (!flags?.length) return;
  const sb = requireSupabase();
  const { data: existing } = await sb
    .from("assumption_gaps")
    .select("content")
    .eq("project_id", projectId)
    .eq("phase", phase);
  const seen = new Set((existing ?? []).map((r: { content: string }) => r.content));
  const rows = flags
    .filter((f) => !seen.has(f.content))
    .map((f) => ({
      project_id: projectId,
      phase,
      flag_type: f.type,
      content: f.content,
      source: f.source ?? null,
    }));
  if (rows.length) await sb.from("assumption_gaps").insert(rows);
}

/**
 * Seed AI-proposed intervention candidates as editable rows. Idempotent: if the
 * project already has candidates (the owner may have edited them), do nothing.
 */
async function seedCandidates(projectId: string, candidates: InterventionCandidate[]) {
  const sb = requireSupabase();
  const { data: existing } = await sb
    .from("intervention_candidates")
    .select("id")
    .eq("project_id", projectId)
    .limit(1);
  if (existing && existing.length) return;
  const rows = candidates.map((c) => ({
    project_id: projectId,
    leverage_point_rank: c.leveragePointRank ?? null,
    barrier: c.barrier ?? null,
    title: c.title,
    description: c.description ?? null,
    apease: c.apease,
    parked: apeaseParked(c.apease),
  }));
  if (rows.length) await sb.from("intervention_candidates").insert(rows);
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
    await seedGapLog(projectId, "clarify", clarify.output.gapLog);
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
    await seedGapLog(projectId, "leverage_full", full.output.gapLog);
    await setProjectStatus(projectId, "full_ready");
  } catch (e) {
    await setProjectStatus(projectId, "error");
    throw e;
  }
}

/**
 * Generate EXPERIMENT candidates from the full report + the owner's resource
 * envelope. Post-paywall (same entitlement gate as the full report). Seeds the
 * editable candidate rows + gap log, then parks at `experiment_design`.
 */
export async function runExperiment(projectId: string): Promise<void> {
  if (AI_MODE === "live") {
    const sb = requireSupabase();
    const { error } = await sb.functions.invoke("project-run", {
      body: { projectId, phase: "experiment" },
    });
    if (error) throw error;
    return;
  }

  await setProjectStatus(projectId, "running");
  try {
    const intake = await buildIntake(projectId);
    const runs = await listRuns(projectId);
    const clarify = latestOutput<ClarifyOutput>(runs, "clarify");
    const teaser = latestOutput<LeverageTeaser>(runs, "leverage_teaser");
    const full = latestOutput<LeverageFull>(runs, "leverage_full");
    if (!clarify || !teaser || !full) {
      throw new Error("Generate the full report before designing experiments.");
    }
    const design = await getExperimentDesign(projectId);
    const engine = getClearEngine();
    const exp = await engine.runExperiment(intake, clarify, teaser, full, design?.envelope ?? {});
    await persistRun(projectId, "experiment", exp.output, exp.tokens, exp.costUsd);
    await seedCandidates(projectId, exp.output.interventionCandidates);
    await seedGapLog(projectId, "experiment", exp.output.gapLog);
    await setProjectStatus(projectId, "experiment_design");
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
