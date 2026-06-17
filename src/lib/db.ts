import { requireSupabase } from "./supabase";
import type { Apease, ProjectStatus, ResourceEnvelope, RunPhase } from "./clear/types";

/** Row shapes mirror supabase/migrations/<timestamp>_init.sql. */
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

export interface DocumentRow {
  id: string;
  project_id: string;
  storage_path: string;
  filename: string;
  mime: string | null;
  bytes: number | null;
  status: "uploaded" | "parsed" | "failed";
  extracted_text: string | null;
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
  created_at: string;
  updated_at: string;
}

/** The first workspace the signed-in user belongs to (their personal one). */
export async function getMyWorkspace(): Promise<Workspace> {
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

export async function listProjects(): Promise<Project[]> {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Project[];
}

export async function getProject(id: string): Promise<Project> {
  const sb = requireSupabase();
  const { data, error } = await sb.from("projects").select("*").eq("id", id).single();
  if (error) throw error;
  return data as Project;
}

export async function getProjectInput(id: string): Promise<ProjectInput | null> {
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
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("documents")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as DocumentRow[];
}

export async function listRuns(projectId: string): Promise<Run[]> {
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
  const sb = requireSupabase();
  const { error } = await sb.from("projects").update({ status }).eq("id", id);
  if (error) throw error;
}
