// POST /project-run  { projectId, phase: "clarify" | "leverage" | "full" | "experiment" }
// Runs the CLEAR phases (stub or live by AI_MODE), persists runs, and updates
// project status. CLARIFY pauses for owner review/approval; LEVERAGE/FULL consume
// the owner-approved Clarify. Membership + entitlement are enforced here
// server-side; the client gate in ProjectDetail is UX only.
import { createClient } from "npm:@supabase/supabase-js@^2";
import { corsHeaders, json } from "../_shared/cors.ts";
import { getClearEngine } from "../_shared/clear/index.ts";
import type {
  GapFlag,
  IntakeInput,
  InterventionCandidate,
  ResourceEnvelope,
} from "../_shared/clear/types.ts";
import {
  capForTier,
  exceedsCostCap,
  exceedsFreeRunQuota,
  isPaidTier,
  loadFreeRunQuota,
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

const admin = createClient(SUPABASE_URL, SERVICE_KEY);

interface Contribution {
  invitation_id: string;
  respondent_name: string | null;
  answers: Record<string, string> | null;
  status: string;
}
interface Reaction {
  invitation_id: string;
  point_rank: number;
  reaction: string;
  note: string | null;
}

/**
 * Render submitted respondent input (text answers + reaction summary) as one intake
 * document. Mirrors summarizeRespondentInput in src/lib/collab.ts. Returns null when
 * nothing submitted.
 */
function summarizeRespondentInput(contributions: Contribution[], reactions: Reaction[]): string | null {
  const submitted = contributions.filter((c) => c.status === "submitted");
  if (submitted.length === 0) return null;
  const submittedIds = new Set(submitted.map((c) => c.invitation_id));
  const parts: string[] = [];

  for (const c of submitted) {
    const answers = Object.values(c.answers ?? {})
      .map((v) => String(v).trim())
      .filter(Boolean);
    if (answers.length === 0) continue;
    const who = c.respondent_name?.trim() || "Anonymous respondent";
    parts.push(`Respondent: ${who}\n${answers.map((a) => `- ${a}`).join("\n")}`);
  }

  const relevant = reactions.filter((r) => submittedIds.has(r.invitation_id));
  if (relevant.length) {
    const byRank = new Map<number, Reaction[]>();
    for (const r of relevant) {
      const arr = byRank.get(r.point_rank) ?? [];
      arr.push(r);
      byRank.set(r.point_rank, arr);
    }
    const lines: string[] = [];
    for (const rank of [...byRank.keys()].sort((a, b) => a - b)) {
      const rs = byRank.get(rank)!;
      const counts: Record<string, number> = { resonates: 0, unsure: 0, missing: 0 };
      const notes: string[] = [];
      for (const r of rs) {
        counts[r.reaction] = (counts[r.reaction] ?? 0) + 1;
        if (r.note?.trim()) notes.push(r.note.trim());
      }
      const summary = Object.entries(counts)
        .filter(([, n]) => n > 0)
        .map(([k, n]) => `${n} ${k}`)
        .join(", ");
      lines.push(
        `- Leverage point #${rank}: ${summary}${notes.length ? `. Notes: ${notes.map((n) => `"${n}"`).join("; ")}` : ""}`,
      );
    }
    parts.push(`Stakeholder reactions to the current leverage map:\n${lines.join("\n")}`);
  }

  return parts.length ? `[Respondent contributions]\n\n${parts.join("\n\n")}` : null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  let projectId: string | undefined;
  try {
    const jwt = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!jwt) return json({ error: "Unauthorized" }, 401);
    const { data: userData } = await admin.auth.getUser(jwt);
    const user = userData.user;
    if (!user) return json({ error: "Unauthorized" }, 401);

    const body = await req.json();
    projectId = body.projectId;
    const phase = body.phase;
    if (!projectId || !["clarify", "leverage", "full", "experiment"].includes(phase)) {
      return json({ error: "Bad request" }, 400);
    }

    const { data: project } = await admin.from("projects").select("*").eq("id", projectId).single();
    if (!project) return json({ error: "Not found" }, 404);

    // Membership check
    const { data: membership } = await admin
      .from("memberships")
      .select("user_id")
      .eq("workspace_id", project.workspace_id)
      .eq("user_id", user.id)
      .maybeSingle();
    if (!membership) return json({ error: "Forbidden" }, 403);

    // Workspace tier — drives the per-tier cost cap below and the paid-feature
    // gate further down (fetched once, reused).
    const { data: ent } = await admin
      .from("entitlements")
      .select("tier")
      .eq("workspace_id", project.workspace_id)
      .maybeSingle();
    const tier = ent?.tier ?? "free";

    // Build intake
    const [{ data: input }, { data: docs }, { data: contributions }, { data: reactions }, { data: findings }] =
      await Promise.all([
        admin.from("project_inputs").select("*").eq("project_id", projectId).maybeSingle(),
        admin.from("documents").select("*").eq("project_id", projectId),
        admin.from("project_contributions").select("*").eq("project_id", projectId),
        admin.from("leverage_reactions").select("*").eq("project_id", projectId),
        admin
          .from("research_findings")
          .select("*")
          .eq("project_id", projectId)
          .in("status", ["accepted", "promoted"]),
      ]);
    const documents = (docs ?? [])
      .filter((d: { extracted_text: string | null }) => d.extracted_text)
      .map((d: { filename: string; extracted_text: string }) => ({
        filename: d.filename,
        text: d.extracted_text,
      }));

    // Fold submitted respondent input (text answers + reaction summary) into intake.
    // Respondent documents already arrive via the documents query (same project_id).
    const respondentInput = summarizeRespondentInput(contributions ?? [], reactions ?? []);
    if (respondentInput) {
      documents.push({ filename: "Respondent contributions", text: respondentInput });
    }

    // Owner-accepted research findings flow in as cited "Verified" evidence.
    const research = (findings ?? []).map((f: {
      phase_target: "clarify" | "leverage";
      claim: string;
      detail: string | null;
      source_kind: "web" | "knowledge_base" | "dialogue";
      citations: { title: string; url?: string; note?: string }[] | null;
      evidence_flag: "V" | "A" | "G" | "NA";
      confidence: number | null;
      tags: Record<string, unknown> | null;
    }) => ({
      phaseTarget: f.phase_target,
      claim: f.claim,
      detail: f.detail ?? undefined,
      sourceKind: f.source_kind,
      citations: f.citations ?? [],
      evidenceFlag: f.evidence_flag,
      confidence: f.confidence ?? 0,
      tags: f.tags ?? {},
    }));

    const intake: IntakeInput = {
      challenge: input?.challenge ?? "",
      stakeholders: input?.stakeholders ?? [],
      timeline: input?.timeline ?? undefined,
      targetGroup: project.target_group ?? undefined,
      useCase: project.use_case ?? undefined,
      documents,
      research,
    };

    // Spend + input guards (live only): bound a single run (input budget +
    // projected cost) and the calendar month (per-tier cap + free-tier quota).
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

      // Free tier is also capped by a monthly generation quota.
      if (
        exceedsFreeRunQuota({
          tier,
          monthRunCount: spend?.length ?? 0,
          quota: loadFreeRunQuota((k) => Deno.env.get(k)),
        })
      ) {
        return json(
          { error: "Free plan monthly limit reached — upgrade to run more reports." },
          402,
        );
      }

      // Pre-emptive cap: reject if THIS run's projected cost would breach the cap.
      const price = priceFor(modelForPhase(phase, (k) => Deno.env.get(k)));
      const inputTokens = estimateIntakeInputTokens(intake.challenge, documents);
      const projectedUsd = projectedCostUsd(inputTokens, PHASE_MAX_OUTPUT[phase] ?? 6000, price);
      if (exceedsCostCap({ monthSpendUsd, projectedUsd, cap })) {
        return json({ error: "Monthly cost cap reached for this workspace." }, 402);
      }
    }

    const engine = getClearEngine();

    const persist = async (
      runPhase: "clarify" | "leverage_teaser" | "leverage_full" | "experiment",
      output: unknown,
      tokens?: number,
      costUsd?: number,
    ) => {
      await admin.from("runs").insert({
        project_id: projectId,
        phase: runPhase,
        status: "done",
        ai_mode: AI_MODE,
        output,
        tokens_used: tokens ?? 0,
        cost_usd: costUsd ?? 0,
      });
    };

    // Seed a phase's gapLog flags into the persistent cross-phase log (idempotent).
    const seedGapLog = async (runPhase: string, flags: GapFlag[] | undefined) => {
      if (!flags?.length) return;
      const { data: existing } = await admin
        .from("assumption_gaps")
        .select("content")
        .eq("project_id", projectId)
        .eq("phase", runPhase);
      const seen = new Set((existing ?? []).map((r: { content: string }) => r.content));
      const rows = flags
        .filter((f) => !seen.has(f.content))
        .map((f) => ({
          project_id: projectId,
          phase: runPhase,
          flag_type: f.type,
          content: f.content,
          source: f.source ?? null,
        }));
      if (rows.length) await admin.from("assumption_gaps").insert(rows);
    };

    // Seed AI-proposed intervention candidates as editable rows (idempotent).
    const seedCandidates = async (candidates: InterventionCandidate[]) => {
      const { data: existing } = await admin
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
        parked:
          c.apease.acceptability === "fail" ||
          c.apease.safety === "fail" ||
          c.apease.equity === "fail",
      }));
      if (rows.length) await admin.from("intervention_candidates").insert(rows);
    };

    // Owner-approved (possibly edited) Clarify for downstream phases. Falls back to
    // the latest generated clarify run unless an explicit approval is required.
    const loadClarify = async (requireApproval: boolean) => {
      const { data: approval } = await admin
        .from("phase_approvals")
        .select("output")
        .eq("project_id", projectId)
        .eq("phase", "clarify")
        .maybeSingle();
      if (approval?.output) return approval.output as Parameters<typeof engine.runLeverageTeaser>[1];
      if (requireApproval) return null;
      const { data: runsC } = await admin
        .from("runs")
        .select("output, created_at")
        .eq("project_id", projectId)
        .eq("phase", "clarify")
        .order("created_at", { ascending: true });
      return runsC && runsC.length
        ? (runsC[runsC.length - 1].output as Parameters<typeof engine.runLeverageTeaser>[1])
        : null;
    };

    if (phase === "clarify") {
      await admin.from("projects").update({ status: "running" }).eq("id", projectId);
      const clarify = await engine.runClarify(intake);
      await persist("clarify", clarify.output, clarify.tokens, clarify.costUsd);
      await seedGapLog("clarify", clarify.output.gapLog);
      await admin.from("projects").update({ status: "clarify_ready" }).eq("id", projectId);
      return json({ ok: true, status: "clarify_ready" });
    }

    if (phase === "leverage") {
      const clarify = await loadClarify(true);
      if (!clarify) return json({ error: "Approve Clarify before generating Leverage." }, 409);
      await admin.from("projects").update({ status: "running" }).eq("id", projectId);
      const teaser = await engine.runLeverageTeaser(intake, clarify);
      await persist("leverage_teaser", teaser.output, teaser.tokens, teaser.costUsd);
      await admin.from("projects").update({ status: "teaser_ready" }).eq("id", projectId);
      return json({ ok: true, status: "teaser_ready" });
    }

    // phase === "full" | "experiment" — both require entitlement server-side.
    // Tier was fetched above; only the per-project unlock remains to check.
    const { data: unlock } = await admin
      .from("project_unlocks")
      .select("unlocked")
      .eq("project_id", projectId)
      .maybeSingle();
    if (!isPaidTier(tier) && !unlock?.unlocked) {
      return json({ error: "Payment required" }, 402);
    }

    if (phase === "full") {
      const clarify = await loadClarify(false);
      if (!clarify) {
        return json({ error: "Approve Clarify before generating the full report." }, 409);
      }
      await admin.from("projects").update({ status: "running" }).eq("id", projectId);
      // Reuse the teaser already generated during the Leverage phase instead of
      // regenerating it. The full report is a slow model call on its own; running
      // the teaser first too made "full" two sequential calls that blew past the
      // edge runtime's wall-clock limit — the worker was killed mid-run (500)
      // before the catch could fire, leaving the project stuck on "running".
      // Fall back to generating the teaser only if none was persisted yet (the
      // normal flow always reaches teaser_ready before full).
      const { data: teaserRuns } = await admin
        .from("runs")
        .select("output, created_at")
        .eq("project_id", projectId)
        .eq("phase", "leverage_teaser")
        .order("created_at", { ascending: true });
      let teaserOutput =
        teaserRuns && teaserRuns.length
          ? (teaserRuns[teaserRuns.length - 1].output as Parameters<typeof engine.runLeverageFull>[2])
          : null;
      if (!teaserOutput) {
        const teaser = await engine.runLeverageTeaser(intake, clarify);
        await persist("leverage_teaser", teaser.output, teaser.tokens, teaser.costUsd);
        teaserOutput = teaser.output;
      }
      const full = await engine.runLeverageFull(intake, clarify, teaserOutput);
      await persist("leverage_full", full.output, full.tokens, full.costUsd);
      await seedGapLog("leverage_full", full.output.gapLog);
      await admin.from("projects").update({ status: "full_ready" }).eq("id", projectId);
      return json({ ok: true, status: "full_ready" });
    }

    // phase === "experiment" — design APEASE candidates from the latest full report.
    const { data: priorRuns } = await admin
      .from("runs")
      .select("phase, output, created_at")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });
    const latest = <T,>(p: string): T | null => {
      const matching = (priorRuns ?? []).filter((r: { phase: string }) => r.phase === p);
      return matching.length ? (matching[matching.length - 1].output as T) : null;
    };
    const clarifyOut = (await loadClarify(false)) as Parameters<typeof engine.runExperiment>[1] | null;
    const teaserOut = latest<Parameters<typeof engine.runExperiment>[2]>("leverage_teaser");
    const fullOut = latest<Parameters<typeof engine.runExperiment>[3]>("leverage_full");
    if (!clarifyOut || !teaserOut || !fullOut) {
      return json({ error: "Generate the full report before designing experiments." }, 409);
    }
    const { data: design } = await admin
      .from("experiment_designs")
      .select("envelope")
      .eq("project_id", projectId)
      .maybeSingle();
    const envelope: ResourceEnvelope = (design?.envelope as ResourceEnvelope) ?? {};

    await admin.from("projects").update({ status: "running" }).eq("id", projectId);
    const exp = await engine.runExperiment(intake, clarifyOut, teaserOut, fullOut, envelope);
    await persist("experiment", exp.output, exp.tokens, exp.costUsd);
    await seedCandidates(exp.output.interventionCandidates);
    await seedGapLog("experiment", exp.output.gapLog);
    await admin.from("projects").update({ status: "experiment_design" }).eq("id", projectId);
    return json({ ok: true, status: "experiment_design" });
  } catch (e) {
    // A run threw partway through (e.g. model/JSON error) — don't leave the project
    // stuck on "running". Mark it "error" so the UI can surface it and allow re-run.
    if (projectId) {
      try {
        await admin.from("projects").update({ status: "error" }).eq("id", projectId);
      } catch { /* best-effort */ }
    }
    return json({ error: (e as Error).message }, 500);
  }
});
