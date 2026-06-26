/**
 * Data access + small pure helpers for the EXPERIMENT phase records
 * (experiment_designs, intervention_candidates, test_cards, assumption_gaps).
 * All four tables are project-member read+write under RLS, so these run on the
 * client Supabase session — no edge function required for the editing surface.
 */
import { requireSupabase } from "./supabase";
import { devActive } from "@/lib/dev/config";
import * as mockStore from "@/lib/dev/mock-store";
const DEV_CAP = import.meta.env.DEV || __DEV_BYPASS__;
import type {
  AssumptionGapRow,
  ExperimentDesign,
  InterventionCandidateRow,
  TestCardRow,
} from "./db";
import type { Apease, GapFlag, ResourceEnvelope } from "./clear/types";

// ── APEASE helpers (methodology: any FAIL parks; scores sum 3–15) ─────────────
export function apeaseSum(a: Apease): number {
  return (a.effectiveness ?? 0) + (a.practicability ?? 0) + (a.affordability ?? 0);
}

/** A candidate is parked if any veto gate FAILs, regardless of its scored sum. */
export function apeaseParked(a: Apease): boolean {
  return a.acceptability === "fail" || a.safety === "fail" || a.equity === "fail";
}

export function apeaseFlagged(a: Apease): boolean {
  return a.acceptability === "flag" || a.safety === "flag" || a.equity === "flag";
}

// ── experiment_designs ───────────────────────────────────────────────────────
export async function getExperimentDesign(projectId: string): Promise<ExperimentDesign | null> {
  if (DEV_CAP && devActive()) return mockStore.getExperimentDesign(projectId);
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("experiment_designs")
    .select("*")
    .eq("project_id", projectId)
    .maybeSingle();
  if (error) throw error;
  return (data as ExperimentDesign) ?? null;
}

export async function upsertExperimentDesign(
  projectId: string,
  envelope: ResourceEnvelope,
  status: "design" | "active" = "design",
): Promise<void> {
  if (DEV_CAP && devActive()) return mockStore.upsertExperimentDesign(projectId, envelope, status);
  const sb = requireSupabase();
  const { error } = await sb.from("experiment_designs").upsert({
    project_id: projectId,
    envelope,
    status,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export async function setExperimentDesignStatus(
  projectId: string,
  status: "design" | "active",
): Promise<void> {
  if (DEV_CAP && devActive()) return mockStore.setExperimentDesignStatus(projectId, status);
  const sb = requireSupabase();
  const { error } = await sb
    .from("experiment_designs")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("project_id", projectId);
  if (error) throw error;
}

// ── intervention_candidates ──────────────────────────────────────────────────
export async function listCandidates(projectId: string): Promise<InterventionCandidateRow[]> {
  if (DEV_CAP && devActive()) return mockStore.listCandidates(projectId);
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("intervention_candidates")
    .select("*")
    .eq("project_id", projectId)
    .order("leverage_point_rank", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as InterventionCandidateRow[];
}

export async function updateCandidate(
  id: string,
  patch: Partial<Pick<InterventionCandidateRow, "apease" | "parked" | "title" | "description" | "barrier">>,
): Promise<void> {
  if (DEV_CAP && devActive()) return mockStore.updateCandidate(id, patch);
  const sb = requireSupabase();
  const { error } = await sb
    .from("intervention_candidates")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

/** Persist an edited APEASE screen, recomputing the parked flag from the gates. */
export async function saveCandidateApease(id: string, apease: Apease): Promise<void> {
  await updateCandidate(id, { apease, parked: apeaseParked(apease) });
}

// ── test_cards ───────────────────────────────────────────────────────────────
export async function listTestCards(projectId: string): Promise<TestCardRow[]> {
  if (DEV_CAP && devActive()) return mockStore.listTestCards(projectId);
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("test_cards")
    .select("*")
    .eq("project_id", projectId)
    .order("calendar_week", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as TestCardRow[];
}

export async function createTestCard(
  projectId: string,
  card: Partial<Omit<TestCardRow, "id" | "project_id" | "created_at" | "updated_at">>,
): Promise<TestCardRow> {
  if (DEV_CAP && devActive()) return mockStore.createTestCard(projectId, card);
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("test_cards")
    .insert({ project_id: projectId, ...card })
    .select("*")
    .single();
  if (error) throw error;
  return data as TestCardRow;
}

export async function updateTestCard(
  id: string,
  patch: Partial<Omit<TestCardRow, "id" | "project_id" | "created_at" | "updated_at">>,
): Promise<void> {
  if (DEV_CAP && devActive()) return mockStore.updateTestCard(id, patch);
  const sb = requireSupabase();
  const { error } = await sb
    .from("test_cards")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteTestCard(id: string): Promise<void> {
  if (DEV_CAP && devActive()) return mockStore.deleteTestCard(id);
  const sb = requireSupabase();
  const { error } = await sb.from("test_cards").delete().eq("id", id);
  if (error) throw error;
}

// ── assumption_gaps (persistent, cross-phase log) ────────────────────────────
export async function listAssumptionGaps(projectId: string): Promise<AssumptionGapRow[]> {
  if (DEV_CAP && devActive()) return mockStore.listAssumptionGaps(projectId);
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("assumption_gaps")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as AssumptionGapRow[];
}

export async function addAssumptionGap(
  projectId: string,
  flag: GapFlag & { phase?: string },
): Promise<void> {
  if (DEV_CAP && devActive()) return mockStore.addAssumptionGap(projectId, flag);
  const sb = requireSupabase();
  const { error } = await sb.from("assumption_gaps").insert({
    project_id: projectId,
    phase: flag.phase ?? null,
    flag_type: flag.type,
    content: flag.content,
    source: flag.source ?? null,
  });
  if (error) throw error;
}

export async function setAssumptionGapStatus(
  id: string,
  status: "open" | "resolved" | "carried",
): Promise<void> {
  if (DEV_CAP && devActive()) return mockStore.setAssumptionGapStatus(id, status);
  const sb = requireSupabase();
  const { error } = await sb
    .from("assumption_gaps")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteAssumptionGap(id: string): Promise<void> {
  if (DEV_CAP && devActive()) return mockStore.deleteAssumptionGap(id);
  const sb = requireSupabase();
  const { error } = await sb.from("assumption_gaps").delete().eq("id", id);
  if (error) throw error;
}

/**
 * Save the owner's answer / documentation note for a gap. Mirrors
 * answerQuestion: a non-empty answer marks the item resolved, clearing it reopens.
 */
export async function respondAssumptionGap(id: string, response: string): Promise<void> {
  if (DEV_CAP && devActive()) return mockStore.respondAssumptionGap(id, response);
  const sb = requireSupabase();
  const { error } = await sb
    .from("assumption_gaps")
    .update({
      response,
      status: response.trim() ? "resolved" : "open",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw error;
}
