// CLEAR report-quality eval runner.
//
//   npm run eval                 # live: generate each phase with the real prompts + models,
//                                #       then score with the LLM judge (needs ANTHROPIC_API_KEY)
//   npm run eval:offline         # offline: score pre-recorded outputs with the deterministic
//                                #          judge — no network, no key (CI-safe smoke)
//
// Flags (after `--`): --offline  --judge=llm|offline  --fixture=<id>  --phase=<name>
//                     --out=<path>  --no-fail  --record  --list
//
// See docs/evals.md.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { hasApiKey } from "./anthropic.ts";
import { judgeGroundTruth, SCORED_PHASES, type ScoredPhase } from "./engine-adapter.ts";
import { FIXTURES, fixtureById, type Fixture } from "./fixtures/index.ts";
import { GenState, generatePhase } from "./generate.ts";
import { type Judge, llmJudge, offlineJudge } from "./judges.ts";
import { PASS_THRESHOLD, type RubricScore } from "./rubric.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const RECORDED_DIR = join(HERE, "recorded");
const RESULTS_DIR = join(HERE, "results");

interface Args {
  offline: boolean;
  judge?: "llm" | "offline";
  fixture?: string;
  phase?: ScoredPhase;
  out?: string;
  noFail: boolean;
  record: boolean;
  list: boolean;
}

function parseArgs(argv: string[]): Args {
  const a: Args = { offline: false, noFail: false, record: false, list: false };
  for (const arg of argv) {
    if (arg === "--offline") a.offline = true;
    else if (arg === "--no-fail") a.noFail = true;
    else if (arg === "--record") a.record = true;
    else if (arg === "--list") a.list = true;
    else if (arg.startsWith("--judge=")) a.judge = arg.slice(8) as "llm" | "offline";
    else if (arg.startsWith("--fixture=")) a.fixture = arg.slice(10);
    else if (arg.startsWith("--phase=")) a.phase = arg.slice(8) as ScoredPhase;
    else if (arg.startsWith("--out=")) a.out = arg.slice(6);
  }
  return a;
}

function recordedPath(fixtureId: string, phase: string): string {
  return join(RECORDED_DIR, `${fixtureId}.${phase}.json`);
}

function loadRecorded(fixtureId: string, phase: string): unknown | null {
  try {
    return JSON.parse(readFileSync(recordedPath(fixtureId, phase), "utf8"));
  } catch {
    return null;
  }
}

function phasesToRun(a: Args): ScoredPhase[] {
  return a.phase ? [a.phase] : [...SCORED_PHASES];
}

function fixturesToRun(a: Args): Fixture[] {
  if (!a.fixture) return FIXTURES;
  const f = fixtureById(a.fixture);
  if (!f) throw new Error(`Unknown fixture "${a.fixture}". Known: ${FIXTURES.map((x) => x.id).join(", ")}`);
  return [f];
}

// ── Offline: score recorded outputs, no network ──────────────────────────────

async function runOffline(a: Args, judge: Judge): Promise<RubricScore[]> {
  const results: RubricScore[] = [];
  for (const fixture of fixturesToRun(a)) {
    for (const phase of phasesToRun(a)) {
      const output = loadRecorded(fixture.id, phase);
      if (output == null) {
        console.warn(`  · skip ${fixture.id}/${phase} — no recorded output at ${recordedPath(fixture.id, phase)}`);
        continue;
      }
      const it = judgeGroundTruth(fixture.intake, phase, fixture.envelope);
      results.push(await judge({ phase, fixture: fixture.id, intakeText: it, output }));
    }
  }
  return results;
}

// ── Live: generate with the real engine paths, then judge ────────────────────

async function runLive(a: Args, judge: Judge): Promise<RubricScore[]> {
  const results: RubricScore[] = [];
  for (const fixture of fixturesToRun(a)) {
    const state: GenState = {};
    const wanted = new Set(phasesToRun(a));
    // Always generate the full chain up to the deepest wanted phase (later phases
    // depend on earlier outputs); only SCORE the wanted phases.
    const deepest = Math.max(...[...wanted].map((p) => SCORED_PHASES.indexOf(p)));
    for (let i = 0; i <= deepest; i++) {
      const phase = SCORED_PHASES[i];
      process.stdout.write(`  · generating ${fixture.id}/${phase} … `);
      const gen = await generatePhase(phase, fixture, state);
      console.log(`${gen.tokens} tok (${gen.model})`);
      if (a.record) {
        mkdirSync(RECORDED_DIR, { recursive: true });
        writeFileSync(recordedPath(fixture.id, phase), JSON.stringify(gen.output, null, 2) + "\n");
      }
      if (wanted.has(phase)) {
        const it = judgeGroundTruth(fixture.intake, phase, fixture.envelope);
        results.push(await judge({ phase, fixture: fixture.id, intakeText: it, output: gen.output }));
      }
    }
  }
  return results;
}

// ── Reporting ────────────────────────────────────────────────────────────────

function summarize(results: RubricScore[]): string {
  const lines: string[] = [];
  lines.push("");
  lines.push("CLEAR eval — rubric scores (1-5)");
  lines.push("=".repeat(72));
  for (const r of results) {
    const flag = r.pass ? "PASS" : "FAIL";
    lines.push(`\n[${flag}] ${r.fixture ?? "?"} / ${r.phase}   overall ${r.overall}  min ${r.min}  (${r.judge}${r.model ? " " + r.model : ""})`);
    for (const d of r.dimensions) {
      lines.push(`    ${d.score}  ${d.dimension.padEnd(16)} ${d.notes ?? ""}`);
    }
    for (const f of r.failures.slice(0, 6)) lines.push(`    ✗ ${f}`);
  }
  const passed = results.filter((r) => r.pass).length;
  const meanOverall =
    results.length ? Math.round((results.reduce((s, r) => s + r.overall, 0) / results.length) * 100) / 100 : 0;
  lines.push("");
  lines.push("-".repeat(72));
  lines.push(`Passed ${passed}/${results.length} phase(s)  ·  mean overall ${meanOverall}  ·  pass floor ${PASS_THRESHOLD}/dim (no_fabrication ≥ 4)`);
  return lines.join("\n");
}

async function main() {
  const a = parseArgs(process.argv.slice(2));

  if (a.list) {
    console.log("Fixtures:", FIXTURES.map((f) => f.id).join(", "));
    console.log("Phases:  ", SCORED_PHASES.join(", "));
    return;
  }

  const useOffline = a.offline || a.judge === "offline";
  const judge: Judge = useOffline ? offlineJudge : llmJudge();
  const mode = useOffline ? "offline" : "live";

  if (mode === "live" && !hasApiKey()) {
    console.error(
      "\nANTHROPIC_API_KEY is not set — cannot run the live eval.\n" +
        "Run `npm run eval:offline` to exercise the harness without a key,\n" +
        "or export ANTHROPIC_API_KEY and re-run `npm run eval`.\n",
    );
    process.exit(2);
  }

  console.log(`\nCLEAR eval — mode=${mode}, judge=${useOffline ? "offline (deterministic)" : "llm"}`);
  const results = useOffline ? await runOffline(a, judge) : await runLive(a, judge);

  if (results.length === 0) {
    console.error("No phases scored (missing recorded outputs?). Nothing to report.");
    process.exit(2);
  }

  console.log(summarize(results));

  mkdirSync(RESULTS_DIR, { recursive: true });
  const outPath = a.out ?? join(RESULTS_DIR, `${mode}-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
  writeFileSync(
    outPath,
    JSON.stringify({ mode, generatedAt: new Date().toISOString(), results }, null, 2) + "\n",
  );
  console.log(`\nWrote ${results.length} result(s) → ${outPath}`);

  const anyFail = results.some((r) => !r.pass);
  if (anyFail && !a.noFail) {
    console.error("\nSome phases fell below the rubric pass floor. (Pass --no-fail to report without failing.)");
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("\neval failed:", e instanceof Error ? e.message : e);
  process.exit(1);
});
