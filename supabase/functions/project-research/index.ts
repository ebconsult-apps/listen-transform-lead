// POST /project-research
//   { action: "run", projectId }                  → gather cited evidence + questions
//   { action: "promote-preview", findingId }       → de-identified, generalised draft
//   { action: "promote-confirm", findingId, entry } → write the draft to knowledge_base
//
// Mirrors project-run: membership + cost cap enforced server-side. The research
// RUN seeds proposed findings/questions the owner curates on the client. PROMOTE
// is the only path client data reaches the global knowledge_base, and it is
// gated twice — an AI de-identification pass (preview) then the owner's confirm.
import { createClient } from "npm:@supabase/supabase-js@^2";
import Anthropic from "npm:@anthropic-ai/sdk@^0.32";
import { corsHeaders, json } from "../_shared/cors.ts";
import { getClearEngine } from "../_shared/clear/index.ts";
import {
  buildResearchIntake,
  fetchKnowledgeEntries,
  seedResearchOutputs,
} from "../_shared/clear/research-io.ts";
import { NEVER_FABRICATE_BANNER } from "../_shared/clear/prompts.ts";
import type { GapFlag, IntakeInput, ResearchFocusGap } from "../_shared/clear/types.ts";
import {
  capForTier,
  exceedsCostCap,
  isPaidTier,
  loadTierCaps,
} from "../_shared/billing/cost-cap.ts";
import {
  checkIntakeBudget,
  estimateIntakeInputTokens,
  projectedCostUsd,
} from "../_shared/clear/intake-budget.ts";
import { modelForPhase, PHASE_MAX_OUTPUT, priceFor } from "../_shared/clear/pricing.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const AI_MODE = Deno.env.get("AI_MODE") ?? "stub";
// When set, only this workspace may promote into the shared library; others read it.
const OPERATOR_WORKSPACE_ID = Deno.env.get("OPERATOR_WORKSPACE_ID") ?? "";
const DEIDENTIFY_MODEL = Deno.env.get("DEIDENTIFY_MODEL") ?? "claude-haiku-4-5";

const admin = createClient(SUPABASE_URL, SERVICE_KEY);

// GitHub Actions worker that runs research OFF the 150s edge wall clock. The edge
// fn triggers it via the REST API (workflow_dispatch) using a fine-grained PAT.
const GITHUB_WORKER_TOKEN = Deno.env.get("GITHUB_WORKER_TOKEN") ?? "";
const GITHUB_WORKER_REPO = Deno.env.get("GITHUB_WORKER_REPO") ?? "";
const GITHUB_WORKER_WORKFLOW = Deno.env.get("GITHUB_WORKER_WORKFLOW") ?? "research-worker.yml";
const GITHUB_WORKER_REF = Deno.env.get("GITHUB_WORKER_REF") ?? "main";

/** Trigger the research worker via GitHub's workflow_dispatch (204 = accepted). */
async function dispatchResearchWorker(
  projectId: string,
  runId: string,
  nonce: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!GITHUB_WORKER_TOKEN || !GITHUB_WORKER_REPO) {
    return {
      ok: false,
      error: "Research worker is not configured (set GITHUB_WORKER_TOKEN and GITHUB_WORKER_REPO).",
    };
  }
  const url =
    `https://api.github.com/repos/${GITHUB_WORKER_REPO}/actions/workflows/${GITHUB_WORKER_WORKFLOW}/dispatches`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GITHUB_WORKER_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
        "User-Agent": "clear-project-research",
      },
      body: JSON.stringify({ ref: GITHUB_WORKER_REF, inputs: { projectId, runId, nonce } }),
    });
    if (res.status === 204) return { ok: true };
    const text = await res.text().catch(() => "");
    return { ok: false, error: `Worker dispatch failed (HTTP ${res.status}).${text ? " " + text : ""}` };
  } catch (e) {
    return { ok: false, error: `Worker dispatch error: ${(e as Error).message}` };
/** A guard failure with a specific HTTP status, mapped to a JSON response below. */
class HttpError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// deno-lint-ignore no-explicit-any
async function getMemberWorkspace(jwt: string, projectId: string): Promise<any> {
  const { data: userData } = await admin.auth.getUser(jwt);
  const user = userData.user;
  if (!user) return { error: json({ error: "Unauthorized" }, 401) };
  const { data: project } = await admin.from("projects").select("*").eq("id", projectId).single();
  if (!project) return { error: json({ error: "Not found" }, 404) };
  const { data: membership } = await admin
    .from("memberships")
    .select("user_id")
    .eq("workspace_id", project.workspace_id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!membership) return { error: json({ error: "Forbidden" }, 403) };
  return { user, project };
}

function extractJson<T>(text: string): T {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Model did not return JSON");
  return JSON.parse(text.slice(start, end + 1)) as T;
}

interface PromoteEntry {
  title: string;
  summary: string;
  tags: Record<string, unknown>;
  citations: { title: string; url?: string; note?: string }[];
}

const DEIDENTIFY_PROMPT = `${NEVER_FABRICATE_BANNER}

You de-identify a single research finding so it can be safely reused across unrelated customers in a shared knowledge library. Remove ALL client-identifying specifics — company/product/people names, proprietary figures, anything that could identify the source customer — and rewrite it as a GENERAL, reusable insight that preserves the underlying evidence and its citations. Do not add new claims or invent sources.

Return ONLY a JSON object:
{ "title": string, "summary": string, "tags": { "useCase"?: string, "targetGroup"?: string, "topic"?: string, "comBComponent"?: string }, "citations": [ { "title": string, "url"?: string, "note"?: string } ] }`;

// deno-lint-ignore no-explicit-any
async function deidentify(finding: any): Promise<PromoteEntry> {
  const fallback: PromoteEntry = {
    title: String(finding.claim ?? "Research finding").slice(0, 120),
    summary: finding.detail ? `${finding.claim} — ${finding.detail}` : String(finding.claim ?? ""),
    tags: finding.tags ?? {},
    citations: finding.citations ?? [],
  };
  if (AI_MODE !== "live") return fallback;

  const client = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY")! });
  const user = [
    `Finding (${finding.phase_target}): ${finding.claim}`,
    finding.detail ? `Detail: ${finding.detail}` : "",
    `Evidence flag: ${finding.evidence_flag}`,
    `Citations: ${JSON.stringify(finding.citations ?? [])}`,
    `Tags: ${JSON.stringify(finding.tags ?? {})}`,
  ].filter(Boolean).join("\n");
  const res = await client.messages.create({
    model: DEIDENTIFY_MODEL,
    max_tokens: 1200,
    system: DEIDENTIFY_PROMPT,
    messages: [{ role: "user", content: user }],
  });
  const text = res.content
    .filter((b) => b.type === "text")
    // deno-lint-ignore no-explicit-any
    .map((b) => (b as any).text)
    .join("");
  try {
    return extractJson<PromoteEntry>(text);
  } catch {
    return fallback;
  }
}

/**
 * Entitlement gate — research is a paid feature (mirrors the full/experiment gate
 * in project-run). Free-tier workspaces without a project unlock can't run it.
 * This is `canViewFull(entitlement, unlock)` enforced server-side. Returns the tier.
 */
// deno-lint-ignore no-explicit-any
async function requireResearchEntitlement(project: any, projectId: string): Promise<string> {
  const [{ data: ent }, { data: unlock }] = await Promise.all([
    admin.from("entitlements").select("tier").eq("workspace_id", project.workspace_id).maybeSingle(),
    admin.from("project_unlocks").select("unlocked").eq("project_id", projectId).maybeSingle(),
  ]);
  const tier = ent?.tier ?? "free";
  if (!isPaidTier(tier) && !unlock?.unlocked) throw new HttpError("Payment required", 402);
  return tier;
}

/**
 * Gather cited evidence via the engine and persist it. Shared by the broad `run`
 * action and the targeted `research-gaps` action; the only differences:
 *  - broad run (linkGapIds = null): seed findings/questions/gaps idempotently
 *    (skip when the project already has any) and re-seed the research gapLog.
 *  - targeted run (linkGapIds = ids): ALWAYS append the findings, stamped with
 *    source_gap_ids so they link back to the selected gaps; don't re-seed gaps
 *    (the run researches gaps that already exist).
 */
async function gatherAndPersistEvidence(
  // deno-lint-ignore no-explicit-any
  project: any,
  projectId: string,
  tier: string,
  opts: { focusGaps?: ResearchFocusGap[]; linkGapIds?: string[] | null },
): Promise<{ findingIds: string[] }> {
  const focusGaps = opts.focusGaps ?? [];
  const linkGapIds = opts.linkGapIds ?? null;
  const targeted = linkGapIds !== null;

  // Build intake (challenge + documents) — needed by the input/spend guards.
  const [{ data: input }, { data: docs }] = await Promise.all([
    admin.from("project_inputs").select("*").eq("project_id", projectId).maybeSingle(),
    admin.from("documents").select("*").eq("project_id", projectId),
  ]);
  const documents = (docs ?? [])
    .filter((d: { extracted_text: string | null }) => d.extracted_text)
    .map((d: { filename: string; extracted_text: string }) => ({
      filename: d.filename,
      text: d.extracted_text,
    }));
  const intake: IntakeInput = {
    challenge: input?.challenge ?? "",
    stakeholders: input?.stakeholders ?? [],
    timeline: input?.timeline ?? undefined,
    targetGroup: project.target_group ?? undefined,
    useCase: project.use_case ?? undefined,
    documents,
  };

  // Spend + input guards (live only): bound a single run (input budget +
  // projected cost) and the calendar month (per-tier cap). Web-search/fetch
  // fees are folded into each run's cost_usd by the engine.
  if (AI_MODE === "live") {
    const budget = checkIntakeBudget(documents);
    if (!budget.ok) throw new HttpError(budget.reason, 413);

    const cap = capForTier(tier, loadTierCaps((k) => Deno.env.get(k)));
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
    const { data: spend } = await admin
      .from("runs")
      .select("cost_usd, projects!inner(workspace_id)")
      .gte("created_at", monthStart)
      .eq("projects.workspace_id", project.workspace_id);
    const monthSpendUsd = (spend ?? []).reduce(
      (s: number, r: { cost_usd: number | null }) => s + (r.cost_usd ?? 0),
      0,
    );
    const price = priceFor(modelForPhase("research", (k) => Deno.env.get(k)));
    const inputTokens = estimateIntakeInputTokens(intake.challenge, documents);
    const projectedUsd = projectedCostUsd(inputTokens, PHASE_MAX_OUTPUT.research, price);
    if (exceedsCostCap({ monthSpendUsd, projectedUsd, cap })) {
      throw new HttpError("Monthly cost cap reached for this workspace.", 402);
    }
  }

  // Retrieve curated/promoted knowledge as candidate evidence (v1: simple fetch).
  const { data: kb } = await admin
    .from("knowledge_base")
    .select("id, kind, title, summary, tags, citations")
    .eq("review_status", "approved")
    .order("kind", { ascending: true })
    .limit(12);
  // deno-lint-ignore no-explicit-any
  const knowledgeEntries = (kb ?? []).map((e: any) => ({
    id: e.id,
    kind: e.kind,
    title: e.title,
    summary: e.summary,
    tags: e.tags ?? {},
    citations: e.citations ?? [],
  }));

  const engine = getClearEngine();
  const res = await engine.runResearch(intake, { knowledgeEntries, focusGaps });
  const out = res.output;

  // Persist the raw run (uniform token/cost accounting + monthly cap).
  await admin.from("runs").insert({
    project_id: projectId,
    phase: "research",
    status: "done",
    ai_mode: AI_MODE,
    output: out,
    tokens_used: res.tokens ?? 0,
    cost_usd: res.costUsd ?? 0,
  });

  // Findings. Broad run seeds once (idempotent); targeted run always appends and
  // links each finding to the selected gap(s) via source_gap_ids.
  const findingIds: string[] = [];
  if (out.findings?.length) {
    let insertFindings = true;
    if (!targeted) {
      const { data: existingF } = await admin
        .from("research_findings").select("id").eq("project_id", projectId).limit(1);
      insertFindings = !(existingF && existingF.length);
    }
    if (insertFindings) {
      const { data: inserted } = await admin
        .from("research_findings")
        .insert(
          out.findings.map((f) => ({
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
            source_gap_ids: targeted
              ? (Array.isArray(f.sourceGapIds) && f.sourceGapIds.length ? f.sourceGapIds : linkGapIds)
              : [],
          })),
        )
        .select("id");
      for (const r of inserted ?? []) findingIds.push(r.id);
    }
  }

  // Follow-up questions (same idempotency rule as findings).
  if (out.questions?.length) {
    let insertQuestions = true;
    if (!targeted) {
      const { data: existingQ } = await admin
        .from("research_questions").select("id").eq("project_id", projectId).limit(1);
      insertQuestions = !(existingQ && existingQ.length);
    }
    if (insertQuestions) {
      await admin.from("research_questions").insert(
        out.questions.map((q) => ({
          project_id: projectId,
          question: q.question,
          rationale: q.rationale ?? null,
        })),
      );
    }
  }

  // Seed gap flags into the persistent cross-phase log (broad run only — a
  // targeted run researches gaps that already exist). Idempotent on content.
  if (!targeted) {
    const flags: GapFlag[] = out.gapLog ?? [];
    if (flags.length) {
      const { data: existing } = await admin
        .from("assumption_gaps").select("content").eq("project_id", projectId).eq("phase", "research");
      const seen = new Set((existing ?? []).map((r: { content: string }) => r.content));
      const rows = flags
        .filter((f) => !seen.has(f.content))
        .map((f) => ({
          project_id: projectId,
          phase: "research",
          flag_type: f.type,
          content: f.content,
          source: f.source ?? null,
        }));
      if (rows.length) await admin.from("assumption_gaps").insert(rows);
    }
  }

  return { findingIds };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const jwt = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!jwt) return json({ error: "Unauthorized" }, 401);

    const body = await req.json();
    const action = body.action;

    // ── promote-preview / promote-confirm ────────────────────────────────────
    if (action === "promote-preview" || action === "promote-confirm") {
      const findingId = body.findingId as string | undefined;
      if (!findingId) return json({ error: "Bad request" }, 400);
      const { data: finding } = await admin
        .from("research_findings")
        .select("*")
        .eq("id", findingId)
        .single();
      if (!finding) return json({ error: "Not found" }, 404);
      const gate = await getMemberWorkspace(jwt, finding.project_id);
      if (gate.error) return gate.error;

      if (action === "promote-preview") {
        const entry = await deidentify(finding);
        return json(entry);
      }

      // promote-confirm
      if (OPERATOR_WORKSPACE_ID && gate.project.workspace_id !== OPERATOR_WORKSPACE_ID) {
        return json(
          { error: "Promotion to the shared library is limited to the operator workspace." },
          403,
        );
      }
      const entry = body.entry as PromoteEntry | undefined;
      if (!entry?.title || !entry?.summary) return json({ error: "Bad request" }, 400);
      const { data: inserted, error: insErr } = await admin
        .from("knowledge_base")
        .insert({
          kind: "promoted",
          title: entry.title,
          summary: entry.summary,
          tags: entry.tags ?? {},
          citations: entry.citations ?? [],
          evidence_strength: finding.evidence_flag === "V" ? "moderate" : "weak",
          origin_note: "Promoted from a project research finding (de-identified).",
          created_by: gate.user.id,
          review_status: "approved",
        })
        .select("id")
        .single();
      if (insErr) return json({ error: insErr.message }, 500);
      await admin
        .from("research_findings")
        .update({ status: "promoted", shared_finding_id: inserted.id, updated_at: new Date().toISOString() })
        .eq("id", findingId);
      return json({ ok: true, sharedFindingId: inserted.id });
    }

    // ── research-gaps (targeted, MECE) ────────────────────────────────────────
    // Research one OR several owner-selected open questions together and link the
    // findings back to those assumption_gaps. Reuses the same membership +
    // entitlement + spend gates as the broad run.
    if (action === "research-gaps") {
      const projectId = body.projectId as string | undefined;
      const gapIds = body.gapIds as string[] | undefined;
      if (!projectId || !Array.isArray(gapIds) || !gapIds.length) {
        return json({ error: "Bad request" }, 400);
      }
      const gate = await getMemberWorkspace(jwt, projectId);
      if (gate.error) return gate.error;
      const project = gate.project;
      const tier = await requireResearchEntitlement(project, projectId);

      // Resolve the selected gaps (scoped to this project) into focus context.
      const { data: gapRows } = await admin
        .from("assumption_gaps")
        .select("id, flag_type, content, source")
        .eq("project_id", projectId)
        .in("id", gapIds);
      if (!gapRows?.length) return json({ error: "No matching open questions." }, 400);
      const focusGaps: ResearchFocusGap[] = gapRows.map(
        (g: { id: string; flag_type: string; content: string; source: string | null }) => ({
          id: g.id,
          flagType: g.flag_type,
          content: g.content,
          source: g.source,
        }),
      );

      const { findingIds } = await gatherAndPersistEvidence(project, projectId, tier, {
        focusGaps,
        linkGapIds: focusGaps.map((g) => g.id),
      });
      return json({ ok: true, findingIds });
    }

    // ── run (broad) ───────────────────────────────────────────────────────────
    if (action !== "run") return json({ error: "Bad request" }, 400);
    const projectId = body.projectId as string | undefined;
    if (!projectId) return json({ error: "Bad request" }, 400);
    const gate = await getMemberWorkspace(jwt, projectId);
    if (gate.error) return gate.error;
    const project = gate.project;
    const tier = await requireResearchEntitlement(project, projectId);

    // Build intake (challenge + documents) via the shared helper — the off-edge
    // worker rebuilds it identically. `documents` feeds the input/spend guards.
    const intake = await buildResearchIntake(admin, projectId, project);
    const documents = intake.documents;

    // Spend + input guards (live only): bound a single run (input budget +
    // projected cost) and the calendar month (per-tier cap). Web-search/fetch
    // fees are folded into each run's cost_usd by the engine.
    if (AI_MODE === "live") {
      const budget = checkIntakeBudget(documents);
      if (!budget.ok) return json({ error: budget.reason }, 413);

      const cap = capForTier(tier, loadTierCaps((k) => Deno.env.get(k)));
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
      const { data: spend } = await admin
        .from("runs")
        .select("cost_usd, projects!inner(workspace_id)")
        .gte("created_at", monthStart)
        .eq("projects.workspace_id", project.workspace_id);
      const monthSpendUsd = (spend ?? []).reduce(
        (s: number, r: { cost_usd: number | null }) => s + (r.cost_usd ?? 0),
        0,
      );
      const price = priceFor(modelForPhase("research", (k) => Deno.env.get(k)));
      const inputTokens = estimateIntakeInputTokens(intake.challenge, documents);
      const projectedUsd = projectedCostUsd(inputTokens, PHASE_MAX_OUTPUT.research, price);
      if (exceedsCostCap({ monthSpendUsd, projectedUsd, cap })) {
        return json({ error: "Monthly cost cap reached for this workspace." }, 402);
      }
    }

    // Stub / non-live deploy: run synchronously in-process (no worker needed).
    if (AI_MODE !== "live") {
      const knowledgeEntries = await fetchKnowledgeEntries(admin);
      const engine = getClearEngine();
      const res = await engine.runResearch(intake, { knowledgeEntries });
      await admin.from("runs").insert({
        project_id: projectId,
        phase: "research",
        status: "done",
        ai_mode: AI_MODE,
        output: res.output,
        tokens_used: res.tokens ?? 0,
        cost_usd: res.costUsd ?? 0,
      });
      await seedResearchOutputs(admin, projectId, res.output);
      return json({ ok: true });
    }

    // Live: the research web loop exceeds the edge runtime's 150s wall clock, so
    // run it OFF the edge in a GitHub Actions worker. Pre-create the run row,
    // dispatch the worker, and return immediately — the client polls the run
    // status until the worker flips it to done/error.
    //
    // GC any stale running row first (a prior worker that died without finishing),
    // so a re-run isn't permanently wedged in "running".
    await admin
      .from("runs")
      .delete()
      .eq("project_id", projectId)
      .eq("phase", "research")
      .eq("status", "running");

    const nonce = crypto.randomUUID();
    const { data: runRow, error: insErr } = await admin
      .from("runs")
      .insert({
        project_id: projectId,
        phase: "research",
        status: "running",
        ai_mode: AI_MODE,
        output: { kickoff: { nonce } },
        tokens_used: 0,
        cost_usd: 0,
      })
      .select("id")
      .single();
    if (insErr || !runRow) {
      return json({ error: insErr?.message ?? "Could not start research." }, 500);
    }

    const dispatched = await dispatchResearchWorker(projectId, runRow.id, nonce);
    if (!dispatched.ok) {
      await admin
        .from("runs")
        .update({ status: "error", output: { error: dispatched.error } })
        .eq("id", runRow.id);
      return json({ error: dispatched.error }, 502);
    }

    return json({ ok: true, status: "running", runId: runRow.id });
  } catch (e) {
    if (e instanceof HttpError) return json({ error: e.message }, e.status);
    return json({ error: (e as Error).message }, 500);
  }
});
