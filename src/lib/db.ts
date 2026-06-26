import { requireSupabase } from "./supabase";
import { devActive } from "@/lib/dev/config";
import * as mockStore from "@/lib/dev/mock-store";
// Build-time gate, inlined so Vite/Rollup fold these guards in a normal production
// build. When it folds to false the mock layer is unreferenced and the whole mock
// graph (mock-store + seed) tree-shakes out (mock-store's only top-level is a
// @__PURE__ initializer, so nothing keeps it alive).
const DEV_CAP = import.meta.env.DEV || __DEV_BYPASS__;
import { extractText } from "./extract-text";
import type { Apease, ProjectStatus, ResourceEnvelope, RunPhase } from "./clear/types";

/** Row shapes mirror supabase/migrations/<timestamp>_init.sql. */
export interface Profile {
  id: string;
  full_name: string | null;
  created_at: string;
  /** Set when the user accepts the Privacy Policy in the setup flow (null = not yet). */
  privacy_accepted_at: string | null;
  /** The PRIVACY_POLICY_VERSION the user accepted. */
  privacy_policy_version: string | null;
}

export interface Workspace {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
}

export interface Project {
  id: string;
  workspace_id: string;
  name: string;
  target_group: string | null;
  use_case: string | null;
  status: ProjectStatus;
  created_by: string;
  created_at: string;
}

export interface ProjectInput {
  project_id: string;
  challenge: string;
  stakeholders: { name?: string; role: string }[];
  timeline: string | null;
}

/** Owner-approved (possibly edited) phase output — mirror 20260617160000_clarify_approval.sql. */
export interface PhaseApproval {
  project_id: string;
  phase: string;
  output: unknown;
  approved_at: string | null;
  updated_at: string | null;
}

export interface DocumentRow {
  id: string;
  project_id: string;
  storage_path: string;
  filename: string;
  mime: string | null;
  bytes: number | null;
  status: "uploaded" | "parsed" | "failed";
  extracted_text: string | null;
  /** When set, this document is attached to a specific assumption_gaps item. */
  assumption_gap_id?: string | null;
  created_at: string;
}

export interface Run {
  id: string;
  project_id: string;
  phase: RunPhase;
  status: "pending" | "running" | "done" | "error";
  ai_mode: string;
  output: unknown;
  tokens_used: number | null;
  cost_usd: number | null;
  created_at: string;
}

export interface Entitlement {
  workspace_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  tier: "free" | "solo" | "team" | "business";
  status: string | null;
  current_period_end: string | null;
}

export interface ProjectUnlock {
  project_id: string;
  unlocked: boolean;
  stripe_payment_intent: string | null;
  unlocked_at: string | null;
}

export type InvitationStatus = "pending" | "opened" | "submitted" | "revoked";

export interface ProjectInvitation {
  id: string;
  project_id: string;
  email: string;
  status: InvitationStatus;
  invited_by: string;
  note: string | null;
  created_at: string;
  expires_at: string | null;
  last_sent_at: string | null;
}

export interface ProjectContribution {
  id: string;
  project_id: string;
  invitation_id: string;
  respondent_name: string | null;
  answers: Record<string, string>;
  status: "draft" | "submitted";
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
}

export type ReactionValue = "resonates" | "unsure" | "missing";

export interface LeverageReaction {
  id: string;
  project_id: string;
  invitation_id: string;
  run_id: string;
  point_rank: number;
  reaction: ReactionValue;
  note: string | null;
}

// ── EXPERIMENT phase rows (mirror 20260617120000_experiment_phase.sql) ────────
export interface ExperimentDesign {
  project_id: string;
  envelope: ResourceEnvelope;
  status: "design" | "active";
  updated_at: string | null;
}

export interface InterventionCandidateRow {
  id: string;
  project_id: string;
  leverage_point_rank: number | null;
  barrier: string | null;
  title: string;
  description: string | null;
  apease: Apease;
  parked: boolean;
  created_at: string;
  updated_at: string;
}

export type TestCardStatus = "planned" | "running" | "done" | "archived";

export interface TestCardRow {
  id: string;
  project_id: string;
  candidate_id: string | null;
  leverage_point: string | null;
  hypothesis: string | null;
  action: string | null;
  metric: string | null;
  threshold: string | null;
  duration: string | null;
  risk_level: string | null;
  kr_ref: string | null;
  ethics_notes: string | null;
  calendar_week: number | null;
  owner_role: string | null;
  status: TestCardStatus;
  results: unknown | null;
  created_at: string;
  updated_at: string;
}

export type AssumptionGapStatus = "open" | "resolved" | "carried";

export interface AssumptionGapRow {
  id: string;
  project_id: string;
  phase: string | null;
  flag_type:
    | "assumption"
    | "gap"
    | "input_needed"
    | "user_input"
    | "needs_input"
    | "requires_confirmation";
  content: string;
  source: string | null;
  status: AssumptionGapStatus;
  /** Owner's answer / supporting note for this item (mirrors research_questions.answer). */
  response: string | null;
  /** Importance for the Open-questions focus flow; higher = surfaced first. */
  priority: number;
  created_at: string;
  updated_at: string;
}

// ── RESEARCH agent rows (mirror 20260617150000_research_agent.sql) ────────────
export type ResearchFindingStatus = "proposed" | "accepted" | "dismissed" | "promoted";

export interface ResearchFindingRow {
  id: string;
  project_id: string;
  phase_target: "clarify" | "leverage";
  claim: string;
  detail: string | null;
  source_kind: "web" | "knowledge_base" | "dialogue";
  citations: { title: string; url?: string; note?: string }[];
  evidence_flag: "V" | "A" | "G" | "NA";
  confidence: number | null;
  tags: Record<string, unknown>;
  status: ResearchFindingStatus;
  shared_finding_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResearchQuestionRow {
  id: string;
  project_id: string;
  question: string;
  rationale: string | null;
  answer: string | null;
  status: "open" | "answered" | "dismissed";
  created_at: string;
  updated_at: string;
}

export interface KnowledgeEntryRow {
  id: string;
  kind: "curated" | "promoted";
  title: string;
  summary: string;
  tags: Record<string, unknown>;
  citations: { title: string; url?: string; note?: string }[];
  evidence_strength: string | null;
  origin_note: string | null;
  created_by: string | null;
  review_status: "approved" | "pending";
  created_at: string;
  updated_at: string;
}

/** The first workspace the signed-in user belongs to (their personal one). */
export async function getMyWorkspace(): Promise<Workspace> {
  if (DEV_CAP && devActive()) return mockStore.getMyWorkspace();
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("workspaces")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .single();
  if (error) throw error;
  return data as Workspace;
}

/** The signed-in user's profile row. RLS returns only their own, so no filter is needed. */
export async function getMyProfile(): Promise<Profile | null> {
  if (DEV_CAP && devActive()) return mockStore.getMyProfile();
  const sb = requireSupabase();
  const { data, error } = await sb.from("profiles").select("*").maybeSingle();
  if (error) throw error;
  return (data as Profile) ?? null;
}

/** Update the signed-in user's profile (display name). RLS scopes the write to their row. */
export async function updateMyProfile(patch: { full_name: string }): Promise<void> {
  if (DEV_CAP && devActive()) return mockStore.updateMyProfile(patch);
  const sb = requireSupabase();
  const { data: auth } = await sb.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) throw new Error("Not signed in.");
  const { error } = await sb.from("profiles").update({ full_name: patch.full_name }).eq("id", userId);
  if (error) throw error;
}

/** Record the current user's acceptance of the given Privacy Policy version. */
export async function recordPrivacyAcceptance(version: string): Promise<void> {
  const sb = requireSupabase();
  const { data: auth } = await sb.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) throw new Error("Not signed in.");
  const { error } = await sb
    .from("profiles")
    .update({
      privacy_accepted_at: new Date().toISOString(),
      privacy_policy_version: version,
    })
    .eq("id", userId);
  if (error) throw error;
}

export async function listProjects(): Promise<Project[]> {
  if (DEV_CAP && devActive()) return mockStore.listProjects();
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Project[];
}

export async function getProject(id: string): Promise<Project> {
  if (DEV_CAP && devActive()) return mockStore.getProject(id);
  const sb = requireSupabase();
  const { data, error } = await sb.from("projects").select("*").eq("id", id).single();
  if (error) throw error;
  return data as Project;
}

export async function getProjectInput(id: string): Promise<ProjectInput | null> {
  if (DEV_CAP && devActive()) return mockStore.getProjectInput(id);
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("project_inputs")
    .select("*")
    .eq("project_id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as ProjectInput) ?? null;
}

export async function listDocuments(projectId: string): Promise<DocumentRow[]> {
  if (DEV_CAP && devActive()) return mockStore.listDocuments(projectId);
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("documents")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as DocumentRow[];
}

/**
 * Supabase Storage keys reject non-ASCII characters (e.g. "förändra"), so
 * transliterate accents and replace anything else with "_". The real filename is
 * preserved in documents.filename for display.
 */
function storageSafeName(name: string): string {
  return (
    name
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-zA-Z0-9.\-_]/g, "_")
      .replace(/_{2,}/g, "_")
      .replace(/^_+|_+$/g, "") || "file"
  );
}

/**
 * Upload one file to the project's storage area, extract its text (best-effort,
 * so an unreadable file just contributes no text), and record a documents row.
 * `opts.assumptionGapId` attaches it to a specific assumption/gap item. Shared by
 * the New Project flow and the Open-questions attachments.
 */
export async function uploadDocument(
  projectId: string,
  file: File,
  opts?: { assumptionGapId?: string },
): Promise<DocumentRow> {
  if (DEV_CAP && devActive()) return mockStore.uploadDocument(projectId, file, opts);
  const sb = requireSupabase();
  const ws = await getMyWorkspace();
  const path = `${ws.id}/${projectId}/${crypto.randomUUID()}-${storageSafeName(file.name)}`;
  const { error: upErr } = await sb.storage.from("documents").upload(path, file);
  if (upErr) throw upErr;
  const extracted = await extractText(file);
  const { data, error } = await sb
    .from("documents")
    .insert({
      project_id: projectId,
      storage_path: path,
      filename: file.name,
      mime: file.type || null,
      bytes: file.size,
      extracted_text: extracted,
      status: "uploaded",
      assumption_gap_id: opts?.assumptionGapId ?? null,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as DocumentRow;
}

/** Remove a document row and its storage object (storage delete is best-effort). */
export async function deleteDocument(id: string): Promise<void> {
  if (DEV_CAP && devActive()) return mockStore.deleteDocument(id);
  const sb = requireSupabase();
  const { data: row } = await sb.from("documents").select("storage_path").eq("id", id).maybeSingle();
  if (row?.storage_path) {
    await sb.storage.from("documents").remove([row.storage_path]);
  }
  const { error } = await sb.from("documents").delete().eq("id", id);
  if (error) throw error;
}

export async function listRuns(projectId: string): Promise<Run[]> {
  if (DEV_CAP && devActive()) return mockStore.listRuns(projectId);
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("runs")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Run[];
}

export async function getEntitlement(workspaceId: string): Promise<Entitlement | null> {
  if (DEV_CAP && devActive()) return mockStore.getEntitlement(workspaceId);
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("entitlements")
    .select("*")
    .eq("workspace_id", workspaceId)
    .maybeSingle();
  if (error) throw error;
  return (data as Entitlement) ?? null;
}

export async function getUnlock(projectId: string): Promise<ProjectUnlock | null> {
  if (DEV_CAP && devActive()) return mockStore.getUnlock(projectId);
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("project_unlocks")
    .select("*")
    .eq("project_id", projectId)
    .maybeSingle();
  if (error) throw error;
  return (data as ProjectUnlock) ?? null;
}

export async function setProjectStatus(id: string, status: ProjectStatus): Promise<void> {
  if (DEV_CAP && devActive()) return mockStore.setProjectStatus(id, status);
  const sb = requireSupabase();
  const { error } = await sb.from("projects").update({ status }).eq("id", id);
  if (error) throw error;
}
