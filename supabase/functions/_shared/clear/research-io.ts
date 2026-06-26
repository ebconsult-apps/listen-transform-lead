// Shared research I/O — the DB-facing halves of a research run, factored out of
// project-research/index.ts so the edge function AND the off-edge worker
// (supabase/functions/_shared/research-worker) run ONE implementation. Pure data
// helpers (no HTTP/Deno.serve): the caller passes a service-role client in.
//
// Mirrors the pattern of the other shared engine modules (intake-budget.ts,
// pricing.ts): imported by both edge functions, never importing them back.
import type { SupabaseClient } from "npm:@supabase/supabase-js@^2";
import type { GapFlag, IntakeInput, KnowledgeEntry, ResearchOutput } from "./types.ts";

/** The project columns the research intake needs (the rest comes from project_inputs). */
interface ProjectRow {
  target_group: string | null;
  use_case: string | null;
}

/**
 * Rebuild the research intake (challenge + stakeholders + parsed documents +
 * target/use-case) from the DB. Deliberately research-shaped: it does NOT fold in
 * accepted findings/contributions the way the CLARIFY/LEVERAGE intake does — this
 * is the input TO research, not a downstream report.
 */
export async function buildResearchIntake(
  admin: SupabaseClient,
  projectId: string,
  project: ProjectRow,
): Promise<IntakeInput> {
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
  return {
    challenge: input?.challenge ?? "",
    stakeholders: input?.stakeholders ?? [],
    timeline: input?.timeline ?? undefined,
    targetGroup: project.target_group ?? undefined,
    useCase: project.use_case ?? undefined,
    documents,
  };
}

/** Retrieve curated/promoted knowledge as candidate evidence (v1: simple fetch). */
export async function fetchKnowledgeEntries(admin: SupabaseClient): Promise<KnowledgeEntry[]> {
  const { data: kb } = await admin
    .from("knowledge_base")
    .select("id, kind, title, summary, tags, citations")
    .eq("review_status", "approved")
    .order("kind", { ascending: true })
    .limit(12);
  // deno-lint-ignore no-explicit-any
  return (kb ?? []).map((e: any) => ({
    id: e.id,
    kind: e.kind,
    title: e.title,
    summary: e.summary,
    tags: e.tags ?? {},
    citations: e.citations ?? [],
  }));
}

/**
 * Seed the proposed findings, follow-up questions, and gap flags from a research
 * run. Idempotent and curation-preserving — re-running never overwrites the
 * owner's edits:
 *  - findings/questions: skip entirely if the project already has any row
 *  - gap flags: insert only flags whose content isn't already logged for research
 */
export async function seedResearchOutputs(
  admin: SupabaseClient,
  projectId: string,
  out: ResearchOutput,
): Promise<void> {
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
