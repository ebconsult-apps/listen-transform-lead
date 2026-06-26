/**
 * In-memory mock data layer for dev/QA mode. Each data-lib function has a
 * one-line `if (DEV_CAP && devActive()) return mockStore.X()` guard that lands here. Reads
 * return seeded fixtures; writes mutate the in-memory arrays so navigation and
 * phase transitions work within a session. State resets on reload (module-level)
 * and on scenario/dataset change (`resetMockDb`).
 *
 * Imports are deliberately one-directional: this module imports only seed +
 * fixtures + util + config(getDevState) + ERASED `import type`s from the data
 * libs. It must never value-import db.ts / clarify.ts / experiment.ts / … (those
 * import THIS module), which would create a runtime cycle.
 */
import type {
  AssumptionGapRow,
  DocumentRow,
  Entitlement,
  ExperimentDesign,
  InterventionCandidateRow,
  KnowledgeEntryRow,
  LeverageReaction,
  Profile,
  Project,
  ProjectContribution,
  ProjectInput,
  ProjectInvitation,
  ProjectUnlock,
  ResearchFindingRow,
  ResearchFindingStatus,
  ResearchQuestionRow,
  Run,
  TestCardRow,
  Workspace,
} from "@/lib/db";
import type {
  Apease,
  ClarifyOutput,
  GapFlag,
  ProjectStatus,
  ResourceEnvelope,
  RunPhase,
} from "@/lib/clear/types";
import type { InviteResult } from "@/lib/collab";
import type { PromotePreview, ResearchRunStatus } from "@/lib/research";
import { buildDataset, type MockDb } from "./seed";
import {
  CLARIFY,
  EXPERIMENT,
  FULL,
  RESEARCH,
  TEASER,
  candidateRows,
  findingRows,
  gapRows,
  questionRows,
} from "./fixtures";
import { delay, nowIso, uid } from "./util";
import { MOCK_USER_ID } from "./mock-session";
import { PRIVACY_POLICY_VERSION } from "@/content/privacy-policy";

const READ_MS = 200;
const RUN_MS = 900;

// Initialized with a fully side-effect-free initializer (a literal default, NOT
// getDevState()) and marked @__PURE__ so the bundler can drop this — and with it
// the whole mock graph (seed + fixtures) — when every dev guard folds to false in
// a production build. Mock data resets to the default dataset on reload by design;
// the DevPanel re-seeds via resetMockDb() when a different dataset is chosen.
let db: MockDb = /* @__PURE__ */ buildDataset("seeded");

/** Rebuild the store from a named dataset (called when the dev dataset changes). */
export function resetMockDb(datasetId: string) {
  db = buildDataset(datasetId);
}

// ── helpers ───────────────────────────────────────────────────────────────────
const clone = <T>(v: T): T => (v == null ? v : (JSON.parse(JSON.stringify(v)) as T));

function requireProject(id: string): Project {
  const p = db.projects.find((x) => x.id === id);
  if (!p) throw new Error("Project not found."); // mirror .single() throwing on miss
  return p;
}

function latestOutput<T>(projectId: string, phase: RunPhase): T | null {
  const matching = (db.runs[projectId] ?? []).filter((r) => r.phase === phase);
  return matching.length ? (matching[matching.length - 1].output as T) : null;
}

function approvedClarify(projectId: string): ClarifyOutput | null {
  return db.approvals[projectId] ?? latestOutput<ClarifyOutput>(projectId, "clarify");
}

/** Idempotent gap-log seed: skip flags already recorded for the same phase+content. */
function seedGaps(projectId: string, phase: RunPhase, flags: GapFlag[] | undefined) {
  if (!flags?.length) return;
  const existing = db.assumptionGaps[projectId] ?? [];
  const seen = new Set(existing.filter((g) => g.phase === phase).map((g) => g.content));
  const fresh = gapRows(projectId, phase, flags.filter((f) => !seen.has(f.content)));
  db.assumptionGaps[projectId] = [...existing, ...fresh];
}

// ── db.ts ──────────────────────────────────────────────────────────────────────
export async function getMyWorkspace(): Promise<Workspace> {
  await delay(READ_MS);
  return clone(db.workspace);
}

export async function getMyProfile(): Promise<Profile | null> {
  await delay(READ_MS);
  // Mock mode treats the Privacy Policy as already accepted, so the New Project
  // flow never gates the QA walkthrough behind the consent checkbox (and never
  // makes a real `profiles` query on a fake session).
  return {
    id: MOCK_USER_ID,
    full_name: "Dev User",
    created_at: nowIso(),
    privacy_accepted_at: nowIso(),
    privacy_policy_version: PRIVACY_POLICY_VERSION,
  };
}

export async function listProjects(): Promise<Project[]> {
  await delay(READ_MS);
  return clone(
    [...db.projects].sort((a, b) => b.created_at.localeCompare(a.created_at)),
  );
}

export async function getProject(id: string): Promise<Project> {
  await delay(READ_MS);
  return clone(requireProject(id));
}

export async function getProjectInput(id: string): Promise<ProjectInput | null> {
  await delay(READ_MS);
  return clone(db.inputs[id] ?? null);
}

export async function listDocuments(projectId: string): Promise<DocumentRow[]> {
  await delay(READ_MS);
  return clone(db.documents[projectId] ?? []);
}

export async function uploadDocument(
  projectId: string,
  file: File,
  opts?: { assumptionGapId?: string },
): Promise<DocumentRow> {
  // Mock mode has no storage/extraction: record a row so the file shows up in the
  // attachment list and counts toward intake, with no extracted text.
  const row: DocumentRow = {
    id: uid("doc"),
    project_id: projectId,
    storage_path: `dev/${projectId}/${file.name}`,
    filename: file.name,
    mime: file.type || null,
    bytes: file.size,
    status: "uploaded",
    extracted_text: null,
    assumption_gap_id: opts?.assumptionGapId ?? null,
    created_at: nowIso(),
  };
  db.documents[projectId] = [...(db.documents[projectId] ?? []), row];
  return clone(row);
}

export async function deleteDocument(id: string): Promise<void> {
  for (const list of Object.values(db.documents)) {
    const idx = list.findIndex((d) => d.id === id);
    if (idx >= 0) {
      list.splice(idx, 1);
      return;
    }
  }
}

export async function listRuns(projectId: string): Promise<Run[]> {
  await delay(READ_MS);
  return clone(
    [...(db.runs[projectId] ?? [])].sort((a, b) => a.created_at.localeCompare(b.created_at)),
  );
}

export async function getEntitlement(_workspaceId: string): Promise<Entitlement | null> {
  await delay(READ_MS);
  return clone(db.entitlement);
}

export async function getUnlock(projectId: string): Promise<ProjectUnlock | null> {
  await delay(READ_MS);
  return clone(db.unlocks[projectId] ?? null);
}

export async function setProjectStatus(id: string, status: ProjectStatus): Promise<void> {
  requireProject(id).status = status;
}

// ── clarify.ts ──────────────────────────────────────────────────────────────────
export async function getClarifyApproval(projectId: string): Promise<ClarifyOutput | null> {
  await delay(READ_MS);
  return clone(db.approvals[projectId] ?? null);
}

export async function getClarifyApprovedAt(projectId: string): Promise<string | null> {
  await delay(READ_MS);
  // Mock mode tracks no separate approval timestamp; treat approval as happening with
  // the latest clarify run. Null when never approved, so the downstream staleness
  // check (isStale) safely no-ops.
  if (!db.approvals[projectId]) return null;
  const clarifyRuns = (db.runs[projectId] ?? []).filter((r) => r.phase === "clarify");
  return clarifyRuns.length ? clarifyRuns[clarifyRuns.length - 1].created_at : null;
}

export async function approveClarify(projectId: string, output: ClarifyOutput): Promise<void> {
  db.approvals[projectId] = clone(output);
  await setProjectStatus(projectId, "clarify_approved");
}

// ── clear/run.ts (mock engine: reuse fixtures, mirror the stub orchestration) ────
export async function runClarify(projectId: string): Promise<void> {
  await setProjectStatus(projectId, "running");
  await delay(RUN_MS);
  db.runs[projectId] = [...(db.runs[projectId] ?? []), mkRun(projectId, "clarify", CLARIFY)];
  seedGaps(projectId, "clarify", CLARIFY.gapLog);
  await setProjectStatus(projectId, "clarify_ready");
}

export async function runLeverage(projectId: string): Promise<void> {
  if (!approvedClarify(projectId)) throw new Error("Approve Clarify before generating Leverage.");
  await setProjectStatus(projectId, "running");
  await delay(RUN_MS);
  db.runs[projectId] = [...(db.runs[projectId] ?? []), mkRun(projectId, "leverage_teaser", TEASER)];
  await setProjectStatus(projectId, "teaser_ready");
}

export async function runFull(projectId: string): Promise<void> {
  if (!approvedClarify(projectId)) {
    throw new Error("Approve Clarify before generating the full report.");
  }
  await setProjectStatus(projectId, "running");
  await delay(RUN_MS);
  db.runs[projectId] = [...(db.runs[projectId] ?? []), mkRun(projectId, "leverage_full", FULL)];
  seedGaps(projectId, "leverage_full", FULL.gapLog);
  await setProjectStatus(projectId, "full_ready");
}

export async function runExperiment(projectId: string): Promise<void> {
  const clarify = approvedClarify(projectId);
  const teaser = latestOutput(projectId, "leverage_teaser");
  const full = latestOutput(projectId, "leverage_full");
  if (!clarify || !teaser || !full) {
    throw new Error("Generate the full report before designing experiments.");
  }
  await setProjectStatus(projectId, "running");
  await delay(RUN_MS);
  db.runs[projectId] = [...(db.runs[projectId] ?? []), mkRun(projectId, "experiment", EXPERIMENT)];
  if (!(db.candidates[projectId]?.length)) db.candidates[projectId] = candidateRows(projectId);
  seedGaps(projectId, "experiment", EXPERIMENT.gapLog);
  await setProjectStatus(projectId, "experiment_design");
}

export async function runResearch(projectId: string): Promise<void> {
  await delay(RUN_MS);
  db.runs[projectId] = [...(db.runs[projectId] ?? []), mkRun(projectId, "research", RESEARCH)];
  if (!(db.findings[projectId]?.length)) db.findings[projectId] = findingRows(projectId);
  if (!(db.questions[projectId]?.length)) db.questions[projectId] = questionRows(projectId);
  seedGaps(projectId, "research", RESEARCH.gapLog);
}

// Mock research completes synchronously (mkRun → status "done"), so the latest
// research run reads "done" right after runResearch — no polling loop needed.
export async function getResearchRunStatus(projectId: string): Promise<ResearchRunStatus> {
  await delay(READ_MS);
  const runs = (db.runs[projectId] ?? []).filter((r) => r.phase === "research");
  if (!runs.length) return { status: null };
  const latest = runs[runs.length - 1];
  return {
    status: latest.status,
    error:
      latest.status === "error"
        ? ((latest.output as { error?: string } | null)?.error ?? "Research failed.")
        : undefined,
  };
}

function mkRun(projectId: string, phase: RunPhase, output: unknown): Run {
  return {
    id: uid("run"),
    project_id: projectId,
    phase,
    status: "done",
    ai_mode: "stub",
    output: clone(output),
    tokens_used: 0,
    cost_usd: 0,
    created_at: nowIso(),
  };
}

// ── collab.ts ────────────────────────────────────────────────────────────────────
export async function listInvitations(projectId: string): Promise<ProjectInvitation[]> {
  await delay(READ_MS);
  return clone(
    [...(db.invitations[projectId] ?? [])].sort((a, b) => a.created_at.localeCompare(b.created_at)),
  );
}

export async function listContributions(projectId: string): Promise<ProjectContribution[]> {
  await delay(READ_MS);
  return clone(
    [...(db.contributions[projectId] ?? [])].sort((a, b) =>
      b.updated_at.localeCompare(a.updated_at),
    ),
  );
}

export async function listReactions(projectId: string): Promise<LeverageReaction[]> {
  await delay(READ_MS);
  return clone(db.reactions[projectId] ?? []);
}

export async function inviteRespondents(
  projectId: string,
  emails: string[],
  note?: string,
): Promise<InviteResult[]> {
  const list = db.invitations[projectId] ?? (db.invitations[projectId] = []);
  return emails.map((email) => {
    const inv: ProjectInvitation = {
      id: uid("inv"),
      project_id: projectId,
      email,
      status: "pending",
      invited_by: db.workspace.owner_id,
      note: note ?? null,
      created_at: nowIso(),
      expires_at: null,
      last_sent_at: nowIso(),
    };
    list.push(inv);
    return { email, status: "sent", invitationId: inv.id };
  });
}

function findInvitation(invitationId: string): ProjectInvitation | undefined {
  for (const list of Object.values(db.invitations)) {
    const inv = list.find((i) => i.id === invitationId);
    if (inv) return inv;
  }
  return undefined;
}

export async function resendInvitation(invitationId: string): Promise<void> {
  const inv = findInvitation(invitationId);
  if (inv) inv.last_sent_at = nowIso();
}

export async function revokeInvitation(invitationId: string): Promise<void> {
  const inv = findInvitation(invitationId);
  if (inv) inv.status = "revoked";
}

// ── experiment.ts ────────────────────────────────────────────────────────────────
export async function getExperimentDesign(projectId: string): Promise<ExperimentDesign | null> {
  await delay(READ_MS);
  return clone(db.experimentDesigns[projectId] ?? null);
}

export async function upsertExperimentDesign(
  projectId: string,
  envelope: ResourceEnvelope,
  status: "design" | "active" = "design",
): Promise<void> {
  db.experimentDesigns[projectId] = {
    project_id: projectId,
    envelope: clone(envelope),
    status,
    updated_at: nowIso(),
  };
}

export async function setExperimentDesignStatus(
  projectId: string,
  status: "design" | "active",
): Promise<void> {
  const d = db.experimentDesigns[projectId];
  if (d) {
    d.status = status;
    d.updated_at = nowIso();
  } else {
    db.experimentDesigns[projectId] = {
      project_id: projectId,
      envelope: {},
      status,
      updated_at: nowIso(),
    };
  }
}

export async function listCandidates(projectId: string): Promise<InterventionCandidateRow[]> {
  await delay(READ_MS);
  return clone(
    [...(db.candidates[projectId] ?? [])].sort((a, b) => {
      const ra = a.leverage_point_rank ?? Number.MAX_SAFE_INTEGER;
      const rb = b.leverage_point_rank ?? Number.MAX_SAFE_INTEGER;
      return ra - rb || a.created_at.localeCompare(b.created_at);
    }),
  );
}

function findCandidate(id: string): InterventionCandidateRow | undefined {
  for (const list of Object.values(db.candidates)) {
    const c = list.find((x) => x.id === id);
    if (c) return c;
  }
  return undefined;
}

export async function updateCandidate(
  id: string,
  patch: Partial<Pick<InterventionCandidateRow, "apease" | "parked" | "title" | "description" | "barrier">>,
): Promise<void> {
  const c = findCandidate(id);
  if (c) Object.assign(c, clone(patch), { updated_at: nowIso() });
}

export async function listTestCards(projectId: string): Promise<TestCardRow[]> {
  await delay(READ_MS);
  return clone(
    [...(db.testCards[projectId] ?? [])].sort((a, b) => {
      const wa = a.calendar_week ?? Number.MAX_SAFE_INTEGER;
      const wb = b.calendar_week ?? Number.MAX_SAFE_INTEGER;
      return wa - wb || a.created_at.localeCompare(b.created_at);
    }),
  );
}

export async function createTestCard(
  projectId: string,
  card: Partial<Omit<TestCardRow, "id" | "project_id" | "created_at" | "updated_at">>,
): Promise<TestCardRow> {
  const row: TestCardRow = {
    id: uid("card"),
    project_id: projectId,
    candidate_id: null,
    leverage_point: null,
    hypothesis: null,
    action: null,
    metric: null,
    threshold: null,
    duration: null,
    risk_level: null,
    kr_ref: null,
    ethics_notes: null,
    calendar_week: null,
    owner_role: null,
    status: "planned",
    results: null,
    ...clone(card),
    created_at: nowIso(),
    updated_at: nowIso(),
  };
  db.testCards[projectId] = [...(db.testCards[projectId] ?? []), row];
  return clone(row);
}

function findTestCard(id: string): { list: TestCardRow[]; idx: number } | undefined {
  for (const list of Object.values(db.testCards)) {
    const idx = list.findIndex((x) => x.id === id);
    if (idx >= 0) return { list, idx };
  }
  return undefined;
}

export async function updateTestCard(
  id: string,
  patch: Partial<Omit<TestCardRow, "id" | "project_id" | "created_at" | "updated_at">>,
): Promise<void> {
  const found = findTestCard(id);
  if (found) Object.assign(found.list[found.idx], clone(patch), { updated_at: nowIso() });
}

export async function deleteTestCard(id: string): Promise<void> {
  const found = findTestCard(id);
  if (found) found.list.splice(found.idx, 1);
}

export async function listAssumptionGaps(projectId: string): Promise<AssumptionGapRow[]> {
  await delay(READ_MS);
  return clone(
    [...(db.assumptionGaps[projectId] ?? [])].sort((a, b) =>
      a.created_at.localeCompare(b.created_at),
    ),
  );
}

export async function addAssumptionGap(
  projectId: string,
  flag: GapFlag & { phase?: string },
): Promise<void> {
  const row: AssumptionGapRow = {
    id: uid("gap"),
    project_id: projectId,
    phase: flag.phase ?? null,
    flag_type: flag.type,
    content: flag.content,
    source: flag.source ?? null,
    status: "open",
    response: null,
    created_at: nowIso(),
    updated_at: nowIso(),
  };
  db.assumptionGaps[projectId] = [...(db.assumptionGaps[projectId] ?? []), row];
}

function findGap(id: string): { list: AssumptionGapRow[]; idx: number } | undefined {
  for (const list of Object.values(db.assumptionGaps)) {
    const idx = list.findIndex((x) => x.id === id);
    if (idx >= 0) return { list, idx };
  }
  return undefined;
}

export async function setAssumptionGapStatus(
  id: string,
  status: "open" | "resolved" | "carried",
): Promise<void> {
  const found = findGap(id);
  if (found) Object.assign(found.list[found.idx], { status, updated_at: nowIso() });
}

export async function respondAssumptionGap(id: string, response: string): Promise<void> {
  const found = findGap(id);
  if (found) {
    Object.assign(found.list[found.idx], {
      response,
      status: response.trim() ? "resolved" : "open",
      updated_at: nowIso(),
    });
  }
}

export async function deleteAssumptionGap(id: string): Promise<void> {
  const found = findGap(id);
  if (found) found.list.splice(found.idx, 1);
}

// ── research.ts ──────────────────────────────────────────────────────────────────
export async function listFindings(projectId: string): Promise<ResearchFindingRow[]> {
  await delay(READ_MS);
  return clone(
    [...(db.findings[projectId] ?? [])].sort((a, b) => a.created_at.localeCompare(b.created_at)),
  );
}

function findFinding(id: string): ResearchFindingRow | undefined {
  for (const list of Object.values(db.findings)) {
    const f = list.find((x) => x.id === id);
    if (f) return f;
  }
  return undefined;
}

export async function updateFinding(
  id: string,
  patch: Partial<Pick<ResearchFindingRow, "status" | "claim" | "detail" | "evidence_flag" | "phase_target">>,
): Promise<void> {
  const f = findFinding(id);
  if (f) Object.assign(f, clone(patch), { updated_at: nowIso() });
}

export async function listQuestions(projectId: string): Promise<ResearchQuestionRow[]> {
  await delay(READ_MS);
  return clone(
    [...(db.questions[projectId] ?? [])].sort((a, b) => a.created_at.localeCompare(b.created_at)),
  );
}

function findQuestion(id: string): ResearchQuestionRow | undefined {
  for (const list of Object.values(db.questions)) {
    const q = list.find((x) => x.id === id);
    if (q) return q;
  }
  return undefined;
}

export async function answerQuestion(id: string, answer: string): Promise<void> {
  const q = findQuestion(id);
  if (q) {
    q.answer = answer;
    q.status = answer.trim() ? "answered" : "open";
    q.updated_at = nowIso();
  }
}

export async function dismissQuestion(id: string): Promise<void> {
  const q = findQuestion(id);
  if (q) {
    q.status = "dismissed";
    q.updated_at = nowIso();
  }
}

export async function listKnowledgeBase(): Promise<KnowledgeEntryRow[]> {
  await delay(READ_MS);
  return clone(
    [...db.knowledgeBase].sort((a, b) => b.created_at.localeCompare(a.created_at)),
  );
}

export async function previewPromotion(findingId: string): Promise<PromotePreview> {
  await delay(RUN_MS);
  const f = findFinding(findingId);
  return {
    title: f ? f.claim.slice(0, 80) : "Promoted finding",
    summary: f?.detail ?? f?.claim ?? "",
    tags: (f?.tags as Record<string, unknown>) ?? {},
    citations: f?.citations ?? [],
  };
}

export async function confirmPromotion(findingId: string, entry: PromotePreview): Promise<void> {
  const f = findFinding(findingId);
  const kb: KnowledgeEntryRow = {
    id: uid("kb"),
    kind: "promoted",
    title: entry.title,
    summary: entry.summary,
    tags: entry.tags ?? {},
    citations: entry.citations ?? [],
    evidence_strength: f?.evidence_flag ?? null,
    origin_note: "Promoted from a project finding (dev mock).",
    created_by: db.workspace.owner_id,
    review_status: "approved",
    created_at: nowIso(),
    updated_at: nowIso(),
  };
  db.knowledgeBase = [kb, ...db.knowledgeBase];
  if (f) {
    f.status = "promoted" as ResearchFindingStatus;
    f.shared_finding_id = kb.id;
    f.updated_at = nowIso();
  }
}

// ── billing.ts (no Stripe — simulate the entitlement/unlock change) ──────────────
export function simulateCheckout(opts: { tier?: string; projectId?: string }): void {
  if (opts.projectId) {
    db.unlocks[opts.projectId] = {
      project_id: opts.projectId,
      unlocked: true,
      stripe_payment_intent: "pi_dev_simulated",
      unlocked_at: nowIso(),
    };
  }
  if (opts.tier && ["free", "solo", "team", "business"].includes(opts.tier)) {
    db.entitlement.tier = opts.tier as Entitlement["tier"];
  }
}

// ── NewProject (page-level insert; no createProject exists in db.ts) ─────────────
export interface CreateProjectArgs {
  name: string;
  targetGroup: string;
  useCase: string;
  challenge: string;
  stakeholders: { name?: string; role: string }[];
  timeline: string | null;
  documents?: { filename: string; mime: string | null; bytes: number | null }[];
}

export function createProject(args: CreateProjectArgs): string {
  const id = uid("proj");
  db.projects.push({
    id,
    workspace_id: db.workspace.id,
    name: args.name || "Untitled project",
    target_group: args.targetGroup,
    use_case: args.useCase,
    status: "draft",
    created_by: db.workspace.owner_id,
    created_at: nowIso(),
  });
  db.inputs[id] = {
    project_id: id,
    challenge: args.challenge,
    stakeholders: args.stakeholders.filter((s) => s.role.trim()),
    timeline: args.timeline,
  };
  if (args.documents?.length) {
    db.documents[id] = args.documents.map((d) => ({
      id: uid("doc"),
      project_id: id,
      storage_path: `dev/${id}/${d.filename}`,
      filename: d.filename,
      mime: d.mime,
      bytes: d.bytes,
      status: "uploaded",
      extracted_text: null,
      assumption_gap_id: null,
      created_at: nowIso(),
    }));
  }
  return id;
}
