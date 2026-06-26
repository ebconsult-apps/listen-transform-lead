// Research worker — runs the research agent OFF the edge-function 150s wall clock.
//
// project-research's web-search/fetch loop (callWithTools) routinely exceeds the
// edge runtime's 150s limit (error 546). Instead of running it in the edge fn, the
// edge fn pre-creates a `runs` row (phase=research, status=running) and dispatches
// this script as a GitHub Actions job (denoland/setup-deno), which has a multi-hour
// budget. The script reuses the EXACT same engine + DB helpers as the edge fn — it
// just runs them somewhere without a wall clock — then flips the run row to
// done/error so the client's poll can pick up the result.
//
// Invocation: deno run --allow-net --allow-env main.ts <projectId> <runId> <nonce>
// Env (from the workflow): AI_MODE=live, ANTHROPIC_API_KEY, SUPABASE_URL,
//   SUPABASE_SERVICE_ROLE_KEY, plus the model/web-fee envs the engine reads.
import { createClient } from "npm:@supabase/supabase-js@^2";
import { getClearEngine } from "../clear/index.ts";
import {
  buildResearchIntake,
  fetchKnowledgeEntries,
  seedResearchOutputs,
} from "../clear/research-io.ts";

const [projectId, runId, nonce] = Deno.args;

function fail(msg: string): never {
  console.error(msg);
  Deno.exit(1);
}

if (!projectId || !runId) fail("Usage: main.ts <projectId> <runId> [nonce]");

// A dropped/incorrect AI_MODE would silently run the STUB engine and seed canned
// fixtures into a real project — fail loud instead.
if (Deno.env.get("AI_MODE") !== "live") {
  fail("AI_MODE must be 'live' for the research worker (refusing to seed stub data).");
}

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
if (!SUPABASE_URL || !SERVICE_KEY) fail("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");

const admin = createClient(SUPABASE_URL, SERVICE_KEY);

// Only act on the row we were dispatched for, and only while it's still the
// current attempt (status running + matching nonce). A superseded dispatch (the
// edge GC deleted/replaced this row on a re-run) exits 0 without touching data.
const { data: run } = await admin.from("runs").select("*").eq("id", runId).maybeSingle();
if (!run || run.project_id !== projectId || run.phase !== "research" || run.status !== "running") {
  console.log("Run row is not in the expected running state — superseded or gone. Nothing to do.");
  Deno.exit(0);
}
// deno-lint-ignore no-explicit-any
const expectedNonce = (run.output as any)?.kickoff?.nonce;
if (nonce && expectedNonce && nonce !== expectedNonce) {
  console.log("Nonce mismatch — this dispatch was superseded. Nothing to do.");
  Deno.exit(0);
}

try {
  const { data: project, error: projErr } = await admin
    .from("projects").select("*").eq("id", projectId).single();
  if (projErr || !project) throw new Error(projErr?.message ?? "Project not found.");

  const intake = await buildResearchIntake(admin, projectId, project);
  const knowledgeEntries = await fetchKnowledgeEntries(admin);

  const engine = getClearEngine();
  const res = await engine.runResearch(intake, { knowledgeEntries });
  const out = res.output;

  // Seed findings/questions/gaps BEFORE flipping the row to done: the client polls
  // on `status` and loads findings the moment it sees "done", so the data must
  // already be present (no empty-results race).
  await seedResearchOutputs(admin, projectId, out);
  await admin
    .from("runs")
    .update({
      status: "done",
      output: out,
      tokens_used: res.tokens ?? 0,
      cost_usd: res.costUsd ?? 0,
    })
    .eq("id", runId);

  console.log(
    `Research done for project ${projectId}: ${out.findings?.length ?? 0} findings, ` +
      `${out.questions?.length ?? 0} questions, ${res.tokens ?? 0} tokens.`,
  );
} catch (e) {
  const message = (e as Error).message ?? "Research failed.";
  await admin
    .from("runs")
    .update({ status: "error", output: { error: message } })
    .eq("id", runId);
  fail(`Research failed for project ${projectId}: ${message}`);
}
