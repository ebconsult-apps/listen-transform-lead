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
import { NEVER_FABRICATE_BANNER } from "../_shared/clear/prompts.ts";
import type { GapFlag, IntakeInput } from "../_shared/clear/types.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const COST_CAP = Number(Deno.env.get("WORKSPACE_MONTHLY_COST_CAP_USD") ?? "25");
const AI_MODE = Deno.env.get("AI_MODE") ?? "stub";
// When set, only this workspace may promote into the shared library; others read it.
const OPERATOR_WORKSPACE_ID = Deno.env.get("OPERATOR_WORKSPACE_ID") ?? "";
const DEIDENTIFY_MODEL = Deno.env.get("DEIDENTIFY_MODEL") ?? "claude-haiku-4-5";

const admin = createClient(SUPABASE_URL, SERVICE_KEY);

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

    // ── run ──────────────────────────────────────────────────────────────────
    if (action !== "run") return json({ error: "Bad request" }, 400);
    const projectId = body.projectId as string | undefined;
    if (!projectId) return json({ error: "Bad request" }, 400);
    const gate = await getMemberWorkspace(jwt, projectId);
    if (gate.error) return gate.error;
    const project = gate.project;

    // Entitlement gate — research is a paid feature (mirrors the full/experiment
    // gate in project-run). Free-tier workspaces without a project unlock can't run it.
    const [{ data: ent }, { data: unlock }] = await Promise.all([
      admin.from("entitlements").select("tier").eq("workspace_id", project.workspace_id).maybeSingle(),
      admin.from("project_unlocks").select("unlocked").eq("project_id", projectId).maybeSingle(),
    ]);
    const paidTier = ent && ["solo", "team", "business"].includes(ent.tier);
    if (!paidTier && !unlock?.unlocked) {
      return json({ error: "Payment required" }, 402);
    }

    // Cost cap (live only): sum this calendar month's spend for the workspace.
    if (AI_MODE === "live") {
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
      const { data: spend } = await admin
        .from("runs")
        .select("cost_usd, projects!inner(workspace_id)")
        .gte("created_at", monthStart)
        .eq("projects.workspace_id", project.workspace_id);
      const total = (spend ?? []).reduce(
        (s: number, r: { cost_usd: number | null }) => s + (r.cost_usd ?? 0),
        0,
      );
      if (total >= COST_CAP) {
        return json({ error: "Monthly cost cap reached for this workspace." }, 402);
      }
    }

    // Build intake (challenge + documents).
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
    const res = await engine.runResearch(intake, { knowledgeEntries });
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

    // Seed proposed findings + open questions (idempotent: skip if any exist).
    const { data: existingF } = await admin
      .from("research_findings").select("id").eq("project_id", projectId).limit(1);
    if (!(existingF && existingF.length) && out.findings?.length) {
      await admin.from("research_findings").insert(
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
        })),
      );
    }
    const { data: existingQ } = await admin
      .from("research_questions").select("id").eq("project_id", projectId).limit(1);
    if (!(existingQ && existingQ.length) && out.questions?.length) {
      await admin.from("research_questions").insert(
        out.questions.map((q) => ({
          project_id: projectId,
          question: q.question,
          rationale: q.rationale ?? null,
        })),
      );
    }

    // Seed gap flags into the persistent cross-phase log (idempotent on content).
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

    return json({ ok: true });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
