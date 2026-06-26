import { requireSupabase } from "@/lib/supabase";
import {
  getProject,
  getProjectInput,
  listDocuments,
  listRuns,
  setProjectStatus,
} from "@/lib/db";
import { listContributions, listReactions, summarizeRespondentInput } from "@/lib/collab";
import { apeaseParked, getExperimentDesign, listAssumptionGaps } from "@/lib/experiment";
import { getClarifyApproval, pickClarify } from "@/lib/clarify";
import { listAcceptedResearch } from "@/lib/research";
import { getClearEngine } from "./index";
import { devActive, effectiveAiMode } from "@/lib/dev/config";
import * as mockStore from "@/lib/dev/mock-store";
const DEV_CAP = import.meta.env.DEV || __DEV_BYPASS__;
import type {
  ClarifyOutput,
  GapFlag,
  IntakeInput,
  InterventionCandidate,
  LeverageFull,
  LeverageTeaser,
  ResearchFinding,
  ResearchQuestion,
  RunPhase,
} from "./types";

/**
 * Live AI can't run on a mock session: the edge function needs a real JWT, and
 * offline there is no function at all. Fail loudly instead of as a silent 401 so
 * the dev/QA AI toggle is honest (the DevPanel also disables "live" accordingly).
 */
const LIVE_IN_MOCK =
  "Live AI is unavailable in dev/mock mode — log in normally to use real Claude.";

function guardLiveInMock() {
  if (effectiveAiMode() === "live") throw new Error(LIVE_IN_MOCK);
}

async function buildIntake(projectId: string): Promise<IntakeInput> {
  const [project, input, docs, contributions, reactions, research, gaps] = await Promise.all([
    getProject(projectId),
    getProjectInput(projectId),
    listDocuments(projectId),
    listContributions(projectId),
    listReactions(projectId),
    listAcceptedResearch(projectId),
    listAssumptionGaps(projectId),
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

  // Fold the owner's answers to flagged assumptions/gaps into intake so a re-run
  // accounts for them. Attached files already arrive via listDocuments.
  const answered = gaps.filter((g) => g.response && g.response.trim());
  if (answered.length) {
    const text = answered
      .map((g) => `- ${g.content}${g.phase ? ` (${g.phase})` : ""}\n  Answer: ${g.response!.trim()}`)
      .join("\n");
    documents.push({
      filename: "Resolved assumptions & answers",
      text: `[Owner answers to flagged assumptions/gaps]\n\n${text}`,
    });
  }

  return {
    challenge: input?.challenge ?? "",
    stakeholders: input?.stakeholders ?? [],
    timeline: input?.timeline ?? undefined,
    targetGroup: project.target_group ?? undefined,
    useCase: project.use_case ?? undefined,
    documents,
    // Owner-accepted research findings flow in as cited "Verified" evidence.
    research,
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
    ai_mode: effectiveAiMode(),
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

/** The Clarify downstream phases should use: owner-approved wins, else latest run. */
async function approvedClarify(projectId: string): Promise<ClarifyOutput | null> {
  const [approval, runs] = await Promise.all([
    getClarifyApproval(projectId),
    listRuns(projectId),
  ]);
  return pickClarify(approval, latestOutput<ClarifyOutput>(runs, "clarify"));
}

/**
 * Step 1 — CLARIFY only. Runs Clarify, then PAUSES at `clarify_ready` so the owner
 * can review, edit, and approve the OKRs before any Leverage work.
 *
 * - stub mode: run the engine in-browser and write `runs` rows directly (RLS
 *   lets workspace members insert). Fully demoable without any deployed backend.
 * - live mode: delegate to the `project-run` edge function, which holds the
 *   Anthropic key and enforces the per-workspace cost cap server-side.
 */
export async function runClarify(projectId: string): Promise<void> {
  if (DEV_CAP && devActive()) {
    guardLiveInMock();
    return mockStore.runClarify(projectId);
  }
  if (effectiveAiMode() === "live") {
    const sb = requireSupabase();
    const { error } = await sb.functions.invoke("project-run", {
      body: { projectId, phase: "clarify" },
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
    await setProjectStatus(projectId, "clarify_ready");
  } catch (e) {
    await setProjectStatus(projectId, "error");
    throw e;
  }
}

/**
 * Step 2 — LEVERAGE teaser, gated on an approved Clarify. Consumes the approved
 * (possibly owner-edited) Clarify rather than regenerating it.
 */
export async function runLeverage(projectId: string): Promise<void> {
  if (DEV_CAP && devActive()) {
    guardLiveInMock();
    return mockStore.runLeverage(projectId);
  }
  if (effectiveAiMode() === "live") {
    const sb = requireSupabase();
    const { error } = await sb.functions.invoke("project-run", {
      body: { projectId, phase: "leverage" },
    });
    if (error) throw error;
    return;
  }

  await setProjectStatus(projectId, "running");
  try {
    const clarify = await approvedClarify(projectId);
    if (!clarify) throw new Error("Approve Clarify before generating Leverage.");
    const intake = await buildIntake(projectId);
    const engine = getClearEngine();
    const teaser = await engine.runLeverageTeaser(intake, clarify);
    await persistRun(projectId, "leverage_teaser", teaser.output, teaser.tokens, teaser.costUsd);
    await setProjectStatus(projectId, "teaser_ready");
  } catch (e) {
    await setProjectStatus(projectId, "error");
    throw e;
  }
}

/** Generate the full report after the paywall is cleared (uses the approved Clarify). */
export async function runFull(projectId: string): Promise<void> {
  if (DEV_CAP && devActive()) {
    guardLiveInMock();
    return mockStore.runFull(projectId);
  }
  if (effectiveAiMode() === "live") {
    const sb = requireSupabase();
    // The full report is generated in two passes, each its own request, so
    // neither model call hits the edge runtime's wall-clock limit. Pass 1 persists
    // its output server-side; pass 2 reads it back and assembles (see project-run),
    // so the report survives this tab closing between the two calls.
    const { error } = await sb.functions.invoke("project-run", {
      body: { projectId, phase: "full", part: 1 },
    });
    if (error) throw error;
    const { error: error2 } = await sb.functions.invoke("project-run", {
      body: { projectId, phase: "full", part: 2 },
    });
    if (error2) throw error2;
    return;
  }

  await setProjectStatus(projectId, "running");
  try {
    const clarify = await approvedClarify(projectId);
    if (!clarify) throw new Error("Approve Clarify before generating the full report.");
    const intake = await buildIntake(projectId);
    const engine = getClearEngine();
    // Reuse the teaser from the Leverage phase rather than regenerating it (see
    // project-run/index.ts: two sequential model calls time out the live run).
    const runs = await listRuns(projectId);
    let teaser = latestOutput<LeverageTeaser>(runs, "leverage_teaser");
    if (!teaser) {
      const t = await engine.runLeverageTeaser(intake, clarify);
      await persistRun(projectId, "leverage_teaser", t.output, t.tokens, t.costUsd);
      teaser = t.output;
    }
    // Two passes (mirrors the edge function), assembled into one LeverageFull.
    const systems = await engine.runLeverageFullSystems(intake, clarify, teaser);
    const barriers = await engine.runLeverageFullBarriers(intake, clarify, teaser, systems.output);
    const full: LeverageFull = { ...teaser, ...systems.output, ...barriers.output };
    const tokens = (systems.tokens ?? 0) + (barriers.tokens ?? 0);
    const costUsd = (systems.costUsd ?? 0) + (barriers.costUsd ?? 0);
    await persistRun(projectId, "leverage_full", full, tokens, costUsd);
    await seedGapLog(projectId, "leverage_full", full.gapLog);
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
  if (DEV_CAP && devActive()) {
    guardLiveInMock();
    return mockStore.runExperiment(projectId);
  }
  if (effectiveAiMode() === "live") {
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
    const clarify = pickClarify(
      await getClarifyApproval(projectId),
      latestOutput<ClarifyOutput>(runs, "clarify"),
    );
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

/** Seed AI-proposed research findings as editable rows. Idempotent: skip if the
 *  project already has findings (the owner may have curated them). */
async function seedFindings(projectId: string, findings: ResearchFinding[]) {
  if (!findings?.length) return;
  const sb = requireSupabase();
  const { data: existing } = await sb
    .from("research_findings")
    .select("id")
    .eq("project_id", projectId)
    .limit(1);
  if (existing && existing.length) return;
  const rows = findings.map((f) => ({
    project_id: projectId,
    phase_target: f.phaseTarget ?? "leverage",
    claim: f.claim,
    detail: f.detail ?? null,
    source_kind: f.sourceKind ?? "web",
    citations: f.citations ?? [],
    evidence_flag: f.evidenceFlag ?? "A",
    confidence: f.confidence ?? null,
    tags: f.tags ?? {},
    status: "proposed",
  }));
  const { error } = await sb.from("research_findings").insert(rows);
  if (error) throw error;
}

/** Seed the agent's follow-up questions. Idempotent like seedFindings. */
async function seedQuestions(projectId: string, questions: ResearchQuestion[]) {
  if (!questions?.length) return;
  const sb = requireSupabase();
  const { data: existing } = await sb
    .from("research_questions")
    .select("id")
    .eq("project_id", projectId)
    .limit(1);
  if (existing && existing.length) return;
  const rows = questions.map((q) => ({
    project_id: projectId,
    question: q.question,
    rationale: q.rationale ?? null,
  }));
  const { error } = await sb.from("research_questions").insert(rows);
  if (error) throw error;
}

/**
 * Gather cited external evidence to strengthen CLARIFY/LEVERAGE. Owner-triggered
 * enrichment, NOT a gating phase — it seeds proposed findings + follow-up
 * questions for the owner to curate, and does not change project.status.
 *
 * - live: delegate to the project-research edge function (Anthropic key, web
 *   search tools, cost cap, and knowledge-base retrieval all run server-side).
 * - stub: run the engine in-browser and write rows directly (member RLS).
 */
export async function runResearch(projectId: string): Promise<void> {
  if (DEV_CAP && devActive()) {
    guardLiveInMock();
    return mockStore.runResearch(projectId);
  }
  if (effectiveAiMode() === "live") {
    const sb = requireSupabase();
    const { error } = await sb.functions.invoke("project-research", {
      body: { action: "run", projectId },
    });
    if (error) throw error;
    return;
  }

  const intake = await buildIntake(projectId);
  const engine = getClearEngine();
  const research = await engine.runResearch(intake, {});
  await persistRun(projectId, "research", research.output, research.tokens, research.costUsd);
  await seedFindings(projectId, research.output.findings);
  await seedQuestions(projectId, research.output.questions);
  await seedGapLog(projectId, "research", research.output.gapLog);
}

/**
 * Seed targeted-research findings, ALWAYS appending and linking each to the
 * selected gap(s) via source_gap_ids. Unlike seedFindings, it never skips when
 * findings already exist — a targeted run *adds* evidence rather than seeding the
 * project's findings once. Prefers the model's own per-finding attribution
 * (sourceGapIds) and falls back to stamping the whole selected bundle.
 */
async function seedFindingsLinked(
  projectId: string,
  findings: ResearchFinding[],
  gapIds: string[],
) {
  if (!findings?.length) return;
  const sb = requireSupabase();
  const rows = findings.map((f) => ({
    project_id: projectId,
    phase_target: f.phaseTarget ?? "leverage",
    claim: f.claim,
    detail: f.detail ?? null,
    source_kind: f.sourceKind ?? "web",
    citations: f.citations ?? [],
    evidence_flag: f.evidenceFlag ?? "A",
    confidence: f.confidence ?? null,
    tags: f.tags ?? {},
    status: "proposed",
    source_gap_ids: f.sourceGapIds?.length ? f.sourceGapIds : gapIds,
  }));
  const { error } = await sb.from("research_findings").insert(rows);
  if (error) throw error;
}

/**
 * Targeted research: gather cited evidence to close one OR several owner-selected
 * open questions together (MECE) and link the findings back to those
 * assumption_gaps. The "Research these open questions" on-ramp from any
 * assumptions/gaps surface.
 *
 * - live: delegate to the project-research edge function (action "research-gaps"),
 *   which reuses the same entitlement + cost gates as the broad run.
 * - stub: run the engine in-browser scoped to the selected gaps, then persist the
 *   findings linked via source_gap_ids (member RLS).
 */
export async function runResearchGaps(projectId: string, gapIds: string[]): Promise<void> {
  if (DEV_CAP && devActive()) {
    guardLiveInMock();
    return mockStore.researchGaps(projectId, gapIds);
  }
  if (effectiveAiMode() === "live") {
    const sb = requireSupabase();
    const { error } = await sb.functions.invoke("project-research", {
      body: { action: "research-gaps", projectId, gapIds },
    });
    if (error) throw error;
    return;
  }

  const [intake, gaps] = await Promise.all([
    buildIntake(projectId),
    listAssumptionGaps(projectId),
  ]);
  const focusGaps = gaps
    .filter((g) => gapIds.includes(g.id))
    .map((g) => ({ id: g.id, flagType: g.flag_type, content: g.content, source: g.source }));
  const engine = getClearEngine();
  const research = await engine.runResearch(intake, { focusGaps });
  await persistRun(projectId, "research", research.output, research.tokens, research.costUsd);
  await seedFindingsLinked(projectId, research.output.findings, gapIds);
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
