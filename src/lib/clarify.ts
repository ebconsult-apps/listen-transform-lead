/**
 * Clarify approval: Clarify is its own review/edit/approve step. The owner can
 * edit the generated OKRs and approve them; Leverage (and Full/Experiment) then
 * consume the approved version. The approval lives in `phase_approvals`, separate
 * from the raw AI `runs`, so re-running the model never clobbers an owner's edits.
 */
import { requireSupabase } from "./supabase";
import { setProjectStatus } from "./db";
import type { ClarifyOutput } from "./clear/types";

export async function getClarifyApproval(projectId: string): Promise<ClarifyOutput | null> {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("phase_approvals")
    .select("output")
    .eq("project_id", projectId)
    .eq("phase", "clarify")
    .maybeSingle();
  if (error) throw error;
  return (data?.output as ClarifyOutput) ?? null;
}

/**
 * When Clarify was last approved (ISO string), or null if never. Used to flag
 * downstream phases (Leverage/Full/Experiment) as outdated when they were generated
 * before the latest approval — without clobbering anything.
 */
export async function getClarifyApprovedAt(projectId: string): Promise<string | null> {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("phase_approvals")
    .select("approved_at")
    .eq("project_id", projectId)
    .eq("phase", "clarify")
    .maybeSingle();
  if (error) throw error;
  return (data?.approved_at as string | null) ?? null;
}

/** Persist the owner-approved (possibly edited) Clarify and mark the project approved. */
export async function approveClarify(projectId: string, output: ClarifyOutput): Promise<void> {
  const sb = requireSupabase();
  const now = new Date().toISOString();
  const { error } = await sb
    .from("phase_approvals")
    .upsert({ project_id: projectId, phase: "clarify", output, approved_at: now, updated_at: now });
  if (error) throw error;
  await setProjectStatus(projectId, "clarify_approved");
}

/**
 * The Clarify that downstream phases should use: the owner-approved output wins;
 * otherwise fall back to the latest generated run (keeps pre-approval projects
 * and older data working). Pure — unit-tested.
 */
export function pickClarify(
  approval: ClarifyOutput | null,
  latestRun: ClarifyOutput | null,
): ClarifyOutput | null {
  return approval ?? latestRun;
}
