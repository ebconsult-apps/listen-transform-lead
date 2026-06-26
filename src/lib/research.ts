/**
 * Data access + edge-function invokers for the RESEARCH agent
 * (research_findings, research_questions, knowledge_base).
 *
 * The two per-project tables are project-member read+write under RLS, so reads
 * and the owner's accept/dismiss/answer edits run on the client session. The
 * research RUN and the de-identified PROMOTE both go through the project-research
 * edge function — the run holds the Anthropic key + cost cap, and knowledge_base
 * has no client write policy (the only way client data reaches the shared library
 * is the owner-confirmed, de-identified promotion path).
 */
import { requireSupabase } from "./supabase";
import { devActive } from "@/lib/dev/config";
import * as mockStore from "@/lib/dev/mock-store";
const DEV_CAP = import.meta.env.DEV || __DEV_BYPASS__;
import type {
  KnowledgeEntryRow,
  ResearchFindingRow,
  ResearchFindingStatus,
  ResearchQuestionRow,
} from "./db";
import type { ResearchFinding } from "./clear/types";

// ── research_findings ─────────────────────────────────────────────────────────
export async function listFindings(projectId: string): Promise<ResearchFindingRow[]> {
  if (DEV_CAP && devActive()) return mockStore.listFindings(projectId);
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("research_findings")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as ResearchFindingRow[];
}

export async function updateFinding(
  id: string,
  patch: Partial<
    Pick<ResearchFindingRow, "status" | "claim" | "detail" | "evidence_flag" | "phase_target">
  >,
): Promise<void> {
  if (DEV_CAP && devActive()) return mockStore.updateFinding(id, patch);
  const sb = requireSupabase();
  const { error } = await sb
    .from("research_findings")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export const setFindingStatus = (id: string, status: ResearchFindingStatus) =>
  updateFinding(id, { status });

/** Accepted (and already-promoted) findings, mapped to engine intake shape. */
export async function listAcceptedResearch(projectId: string): Promise<ResearchFinding[]> {
  const rows = await listFindings(projectId);
  return rows
    .filter((r) => r.status === "accepted" || r.status === "promoted")
    .map((r) => ({
      phaseTarget: r.phase_target,
      claim: r.claim,
      detail: r.detail ?? undefined,
      sourceKind: r.source_kind,
      citations: r.citations ?? [],
      evidenceFlag: r.evidence_flag,
      confidence: r.confidence ?? 0,
      tags: r.tags as ResearchFinding["tags"],
    }));
}

// ── research_questions ────────────────────────────────────────────────────────
export async function listQuestions(projectId: string): Promise<ResearchQuestionRow[]> {
  if (DEV_CAP && devActive()) return mockStore.listQuestions(projectId);
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("research_questions")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as ResearchQuestionRow[];
}

export async function answerQuestion(id: string, answer: string): Promise<void> {
  if (DEV_CAP && devActive()) return mockStore.answerQuestion(id, answer);
  const sb = requireSupabase();
  const { error } = await sb
    .from("research_questions")
    .update({
      answer,
      status: answer.trim() ? "answered" : "open",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw error;
}

export async function dismissQuestion(id: string): Promise<void> {
  if (DEV_CAP && devActive()) return mockStore.dismissQuestion(id);
  const sb = requireSupabase();
  const { error } = await sb
    .from("research_questions")
    .update({ status: "dismissed", updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

// ── research run status (async run lifecycle) ─────────────────────────────────
// Live research runs OFF the edge wall clock (a GitHub Actions worker), so the run
// is asynchronous: the edge fn inserts a `running` run row and the worker flips it
// to `done`/`error`. The client polls this to know when findings are ready. In
// stub/mock mode the run completes synchronously, so the latest row is `done`.
export type ResearchRunState = "pending" | "running" | "done" | "error";
export interface ResearchRunStatus {
  /** Latest research run's status, or null if research has never run. */
  status: ResearchRunState | null;
  /** Failure message when `status === "error"`. */
  error?: string;
}

export async function getResearchRunStatus(projectId: string): Promise<ResearchRunStatus> {
  if (DEV_CAP && devActive()) return mockStore.getResearchRunStatus(projectId);
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("runs")
    .select("status, output, created_at")
    .eq("project_id", projectId)
    .eq("phase", "research")
    .order("created_at", { ascending: false })
    .limit(1);
  if (error) throw error;
  const row = data?.[0];
  if (!row) return { status: null };
  const status = row.status as ResearchRunState;
  const err =
    status === "error"
      ? ((row.output as { error?: string } | null)?.error ?? "Research failed.")
      : undefined;
  return { status, error: err };
}

// ── knowledge_base (shared, de-identified library) ────────────────────────────
export async function listKnowledgeBase(): Promise<KnowledgeEntryRow[]> {
  if (DEV_CAP && devActive()) return mockStore.listKnowledgeBase();
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("knowledge_base")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as KnowledgeEntryRow[];
}

// ── Promotion to the shared library (two-gate: AI de-identify → owner confirm) ─
export interface PromotePreview {
  title: string;
  summary: string;
  tags: Record<string, unknown>;
  citations: { title: string; url?: string; note?: string }[];
}

/** Gate 1 — ask the edge function for a de-identified, generalised version. */
export async function previewPromotion(findingId: string): Promise<PromotePreview> {
  if (DEV_CAP && devActive()) return mockStore.previewPromotion(findingId);
  const sb = requireSupabase();
  const { data, error } = await sb.functions.invoke("project-research", {
    body: { action: "promote-preview", findingId },
  });
  if (error) throw error;
  return data as PromotePreview;
}

/** Gate 2 — owner confirms the de-identified text → write it to the shared library. */
export async function confirmPromotion(findingId: string, entry: PromotePreview): Promise<void> {
  if (DEV_CAP && devActive()) return mockStore.confirmPromotion(findingId, entry);
  const sb = requireSupabase();
  const { error } = await sb.functions.invoke("project-research", {
    body: { action: "promote-confirm", findingId, entry },
  });
  if (error) throw error;
}
