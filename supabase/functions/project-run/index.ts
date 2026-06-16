// POST /project-run  { projectId, phase: "teaser" | "full" }
// Runs CLARIFY + LEVERAGE (stub or live by AI_MODE), persists runs, and updates
// project status. Membership + entitlement are enforced here server-side; the
// client gate in ProjectDetail is UX only.
import { createClient } from "npm:@supabase/supabase-js@^2";
import { corsHeaders, json } from "../_shared/cors.ts";
import { getClearEngine } from "../_shared/clear/index.ts";
import type { IntakeInput } from "../_shared/clear/types.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const COST_CAP = Number(Deno.env.get("WORKSPACE_MONTHLY_COST_CAP_USD") ?? "25");
const AI_MODE = Deno.env.get("AI_MODE") ?? "stub";

const admin = createClient(SUPABASE_URL, SERVICE_KEY);

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
    if (!projectId || !["teaser", "full"].includes(phase)) {
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

    // Build intake
    const [{ data: input }, { data: docs }] = await Promise.all([
      admin.from("project_inputs").select("*").eq("project_id", projectId).maybeSingle(),
      admin.from("documents").select("*").eq("project_id", projectId),
    ]);
    const intake: IntakeInput = {
      challenge: input?.challenge ?? "",
      stakeholders: input?.stakeholders ?? [],
      timeline: input?.timeline ?? undefined,
      targetGroup: project.target_group ?? undefined,
      useCase: project.use_case ?? undefined,
      documents: (docs ?? [])
        .filter((d: { extracted_text: string | null }) => d.extracted_text)
        .map((d: { filename: string; extracted_text: string }) => ({
          filename: d.filename,
          text: d.extracted_text,
        })),
    };

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

    const engine = getClearEngine();

    const persist = async (
      runPhase: "clarify" | "leverage_teaser" | "leverage_full",
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

    if (phase === "teaser") {
      await admin.from("projects").update({ status: "running" }).eq("id", projectId);
      const clarify = await engine.runClarify(intake);
      await persist("clarify", clarify.output, clarify.tokens, clarify.costUsd);
      const teaser = await engine.runLeverageTeaser(intake, clarify.output);
      await persist("leverage_teaser", teaser.output, teaser.tokens, teaser.costUsd);
      await admin.from("projects").update({ status: "teaser_ready" }).eq("id", projectId);
      return json({ ok: true, status: "teaser_ready" });
    }

    // phase === "full" — enforce entitlement server-side
    const [{ data: ent }, { data: unlock }] = await Promise.all([
      admin.from("entitlements").select("tier").eq("workspace_id", project.workspace_id).maybeSingle(),
      admin.from("project_unlocks").select("unlocked").eq("project_id", projectId).maybeSingle(),
    ]);
    const paidTier = ent && ["solo", "team", "business"].includes(ent.tier);
    if (!paidTier && !unlock?.unlocked) {
      return json({ error: "Payment required" }, 402);
    }

    await admin.from("projects").update({ status: "running" }).eq("id", projectId);
    const clarify = await engine.runClarify(intake);
    const teaser = await engine.runLeverageTeaser(intake, clarify.output);
    const full = await engine.runLeverageFull(intake, clarify.output, teaser.output);
    await persist("leverage_full", full.output, full.tokens, full.costUsd);
    await admin.from("projects").update({ status: "full_ready" }).eq("id", projectId);
    return json({ ok: true, status: "full_ready" });
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
