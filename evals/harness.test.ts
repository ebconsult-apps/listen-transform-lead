import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  aggregate,
  buildJudgePrompt,
  NO_FABRICATION_FLOOR,
  parseJudgeResponse,
  PASS_THRESHOLD,
  RUBRIC,
} from "./rubric";
import { offlineJudge, stubJudge } from "./judges";
import { FIXTURES, fixtureById } from "./fixtures/index";
import { judgeGroundTruth, SCORED_PHASES } from "./engine-adapter";

const HERE = dirname(fileURLToPath(import.meta.url));
const recorded = (id: string, phase: string) =>
  JSON.parse(readFileSync(join(HERE, "recorded", `${id}.${phase}.json`), "utf8"));

const RUBRIC_KEYS = RUBRIC.map((d) => d.key);

// ── Rubric shape ─────────────────────────────────────────────────────────────

describe("rubric", () => {
  it("names the four A3.2 dimensions plus the implied gap_honesty", () => {
    expect(RUBRIC_KEYS).toEqual([
      "grounding",
      "specificity",
      "actionability",
      "no_fabrication",
      "gap_honesty",
    ]);
  });

  it("gives every dimension calibration anchors", () => {
    for (const d of RUBRIC) {
      expect(d.anchors["1"]).toBeTruthy();
      expect(d.anchors["3"]).toBeTruthy();
      expect(d.anchors["5"]).toBeTruthy();
    }
  });
});

// ── Aggregation + pass logic ─────────────────────────────────────────────────

describe("aggregate()", () => {
  const dims = (over: Partial<Record<string, number>> = {}) =>
    RUBRIC_KEYS.map((k) => ({ dimension: k, score: over[k] ?? 5 }));

  it("computes overall (mean) and min, and passes a clean sheet", () => {
    const r = aggregate("clarify", dims(), { judge: "offline" });
    expect(r.overall).toBe(5);
    expect(r.min).toBe(5);
    expect(r.pass).toBe(true);
  });

  it("fails when any dimension is below the pass threshold", () => {
    const r = aggregate("clarify", dims({ specificity: PASS_THRESHOLD - 1 }), { judge: "offline" });
    expect(r.min).toBe(PASS_THRESHOLD - 1);
    expect(r.pass).toBe(false);
  });

  it("fails a fabricating report even when every other dimension is perfect", () => {
    // no_fabrication below its higher floor, everything else maxed.
    const r = aggregate("clarify", dims({ no_fabrication: NO_FABRICATION_FLOOR - 1 }), {
      judge: "offline",
    });
    expect(r.min).toBeGreaterThanOrEqual(PASS_THRESHOLD); // min alone would pass
    expect(r.pass).toBe(false); // …but the fabrication floor vetoes it
  });

  it("clamps out-of-range scores into 1..5", () => {
    const r = aggregate("clarify", [{ dimension: "grounding", score: 9 }], { judge: "offline" });
    expect(r.dimensions[0].score).toBe(5);
    const r2 = aggregate("clarify", [{ dimension: "grounding", score: -3 }], { judge: "offline" });
    expect(r2.dimensions[0].score).toBe(1);
  });

  it("throws on an empty dimension set", () => {
    expect(() => aggregate("clarify", [], { judge: "offline" })).toThrow();
  });
});

// ── Judge prompt + response parsing ──────────────────────────────────────────

describe("buildJudgePrompt()", () => {
  it("embeds the intake, the output, the phase, and every rubric key", () => {
    const { system, user } = buildJudgePrompt("clarify", "INTAKE-MARKER churn 6%", '{"objective":"X"}');
    expect(user).toContain("INTAKE-MARKER");
    expect(user).toContain('"objective":"X"');
    expect(user).toContain("clarify");
    for (const k of RUBRIC_KEYS) expect(system + user).toContain(k);
  });
});

describe("parseJudgeResponse()", () => {
  const full = (over: Partial<Record<string, number>> = {}) => ({
    dimensions: RUBRIC_KEYS.map((k) => ({ dimension: k, score: over[k] ?? 4, notes: "ok" })),
    failures: ["one specific problem"],
  });

  it("parses a well-formed judge response and keeps failures", () => {
    const { dimensions, failures } = parseJudgeResponse(full());
    expect(dimensions.map((d) => d.dimension)).toEqual(RUBRIC_KEYS);
    expect(failures).toEqual(["one specific problem"]);
  });

  it("throws when the judge skips a dimension", () => {
    const bad = full();
    bad.dimensions = bad.dimensions.filter((d) => d.dimension !== "actionability");
    expect(() => parseJudgeResponse(bad)).toThrow(/actionability/);
  });

  it("ignores unknown dimensions and clamps scores", () => {
    const raw = full({ grounding: 12 });
    (raw.dimensions as unknown[]).push({ dimension: "made_up", score: 5 });
    const { dimensions } = parseJudgeResponse(raw);
    expect(dimensions.find((d) => d.dimension === "grounding")!.score).toBe(5);
    expect(dimensions.find((d) => d.dimension === "made_up")).toBeUndefined();
  });

  it("throws when `dimensions` is missing entirely", () => {
    expect(() => parseJudgeResponse({ failures: [] })).toThrow();
  });
});

// ── Fixtures ─────────────────────────────────────────────────────────────────

describe("fixtures", () => {
  it("exposes three diverse, well-formed intake fixtures", () => {
    expect(FIXTURES).toHaveLength(3);
    expect(FIXTURES.map((f) => f.id)).toEqual([
      "saas-churn",
      "hospital-hand-hygiene",
      "manufacturing-safety",
    ]);
    for (const f of FIXTURES) {
      expect(f.intake.challenge.length).toBeGreaterThan(50);
      expect(f.intake.stakeholders.length).toBeGreaterThan(0);
      for (const s of f.intake.stakeholders) expect(s.role).toBeTruthy();
      expect(f.envelope).toBeTruthy();
    }
  });

  it("resolves fixtures by id", () => {
    expect(fixtureById("saas-churn")?.label).toContain("SaaS");
    expect(fixtureById("nope")).toBeUndefined();
  });

  it("judgeGroundTruth adds the envelope only for the experiment phase", () => {
    const f = fixtureById("saas-churn")!;
    expect(judgeGroundTruth(f.intake, "clarify", f.envelope)).not.toContain("RESOURCE ENVELOPE");
    expect(judgeGroundTruth(f.intake, "experiment", f.envelope)).toContain("RESOURCE ENVELOPE");
  });
});

// ── Offline judge over the recorded outputs (the proven, network-free path) ───

describe("offlineJudge over recorded saas-churn outputs", () => {
  for (const phase of SCORED_PHASES) {
    it(`scores ${phase}: all rubric dims present, in-range, and passes`, async () => {
      const f = fixtureById("saas-churn")!;
      const output = recorded("saas-churn", phase);
      const it = judgeGroundTruth(f.intake, phase, f.envelope);
      const score = await offlineJudge({ phase, fixture: "saas-churn", intakeText: it, output });

      expect(score.dimensions.map((d) => d.dimension).sort()).toEqual([...RUBRIC_KEYS].sort());
      for (const d of score.dimensions) {
        expect(d.score).toBeGreaterThanOrEqual(1);
        expect(d.score).toBeLessThanOrEqual(5);
      }
      expect(score.pass).toBe(true);
    });
  }
});

describe("offlineJudge catches blatant fabrication", () => {
  it("tanks no_fabrication + grounding on invented entities and stats", async () => {
    const f = fixtureById("saas-churn")!;
    const doctored = {
      objective: "Adopt the Acme Corp growth playbook",
      keyResults: [
        { kr: "Match Globex Industries results", metric: "ARR", baseline: "$4.2M", target: "$9.9M" },
      ],
      gapLog: [],
    };
    const it = judgeGroundTruth(f.intake, "clarify", f.envelope);
    const score = await offlineJudge({ phase: "clarify", fixture: "saas-churn", intakeText: it, output: doctored });

    const noFab = score.dimensions.find((d) => d.dimension === "no_fabrication")!.score;
    const grounding = score.dimensions.find((d) => d.dimension === "grounding")!.score;
    expect(noFab).toBeLessThan(NO_FABRICATION_FLOOR);
    expect(grounding).toBeLessThanOrEqual(2);
    expect(score.pass).toBe(false);
  });
});

// ── Stub judge (pure aggregation harness) ────────────────────────────────────

describe("stubJudge", () => {
  it("returns a full rubric and passes when scores are high", async () => {
    const score = await stubJudge({}, [])({ phase: "clarify", intakeText: "", output: {} });
    expect(score.dimensions).toHaveLength(RUBRIC.length);
    expect(score.pass).toBe(true);
  });

  it("threads a low score into a fail", async () => {
    const score = await stubJudge({ no_fabrication: 2 })({ phase: "clarify", intakeText: "", output: {} });
    expect(score.pass).toBe(false);
  });
});
