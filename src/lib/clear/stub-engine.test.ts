import { describe, it, expect } from "vitest";
import { StubClearEngine } from "./stub-engine";
import type {
  ClarifyOutput,
  IntakeInput,
  LeverageTeaser,
  LeverageFull,
  ResearchContext,
  ResourceEnvelope,
} from "./types";

/**
 * The stub engine is the deterministic, no-API path that drives demo mode and
 * mirrors the live engine's contract. These tests assert the output of every
 * phase stays methodology-valid (shape + the rules from ccc/docs), which also
 * guards the demo fixtures from drifting out of spec.
 */

const engine = new StubClearEngine();
const intake: IntakeInput = {
  challenge: "Reduce trial-to-paid churn",
  stakeholders: [{ role: "Product manager" }],
  documents: [],
};

const FLAG_TYPES = [
  "assumption",
  "gap",
  "input_needed",
  "user_input",
  "needs_input",
  "requires_confirmation",
];
const COMB_COMPONENTS = [
  "capability_physical",
  "capability_psychological",
  "opportunity_physical",
  "opportunity_social",
  "motivation_reflective",
  "motivation_automatic",
];
const EVIDENCE_FLAGS = ["V", "A", "G", "NA"];
const GATES = ["pass", "flag", "fail"];

const wordCount = (s: string) => s.trim().split(/\s+/).length;
const validFlags = (gapLog: { type: string; content: string }[]) =>
  gapLog.every((f) => FLAG_TYPES.includes(f.type) && typeof f.content === "string" && f.content.length > 0);

describe("StubClearEngine.runClarify", () => {
  it("returns a full OKR: 3–5 KRs, a substantial why, and valid gap flags", async () => {
    const { output } = await engine.runClarify(intake);
    expect(typeof output.objective).toBe("string");
    expect(wordCount(output.whyItMatters)).toBeGreaterThanOrEqual(60);
    expect(output.keyResults.length).toBeGreaterThanOrEqual(3);
    expect(output.keyResults.length).toBeLessThanOrEqual(5);
    expect(output.keyResults.every((kr) => typeof kr.kr === "string" && kr.kr.length > 0)).toBe(true);
    expect(validFlags(output.gapLog)).toBe(true);
  });
});

describe("StubClearEngine.runLeverageTeaser", () => {
  it("returns exactly the top 3 leverage points + a headline", async () => {
    const { output } = await engine.runLeverageTeaser(intake, {} as ClarifyOutput);
    expect(output.topLeveragePoints).toHaveLength(3);
    expect(typeof output.systemsMapSummary).toBe("string");
    expect(typeof output.headline).toBe("string");
    expect(
      output.topLeveragePoints.every(
        (p) => ["High", "Medium", "Low"].includes(p.impact) && ["High", "Medium", "Low"].includes(p.ease),
      ),
    ).toBe(true);
  });
});

describe("StubClearEngine full report (two passes)", () => {
  it("assembles systems + barriers + teaser into the full chain: 5–10 points, six COM-B components, 3–5 strongest barriers", async () => {
    // The full report is generated in two passes that reassemble with the teaser
    // into one LeverageFull — mirror that here and assert the merged result.
    const teaser = (await engine.runLeverageTeaser(intake, {} as ClarifyOutput)).output;
    const systems = (await engine.runLeverageFullSystems(intake, {} as ClarifyOutput, teaser)).output;
    const barriers = (
      await engine.runLeverageFullBarriers(intake, {} as ClarifyOutput, teaser, systems)
    ).output;
    const output: LeverageFull = { ...teaser, ...systems, ...barriers };

    // 5–10 ranked leverage points (pass 1 extends the teaser's top 3)
    expect(output.topLeveragePoints.length).toBeGreaterThanOrEqual(5);
    expect(output.topLeveragePoints.length).toBeLessThanOrEqual(10);
    // COM-B covers all six components, each cell carries a valid evidence flag (pass 2)
    for (const component of COMB_COMPONENTS) {
      expect(output.comb.some((c) => c.component === component)).toBe(true);
    }
    expect(output.comb.every((c) => EVIDENCE_FLAGS.includes(c.evidenceFlag))).toBe(true);
    // 3–5 synthesized strongest barriers (pass 2)
    expect(output.strongestBarriers.length).toBeGreaterThanOrEqual(3);
    expect(output.strongestBarriers.length).toBeLessThanOrEqual(5);
    // behaviors + relative 1–5 prioritization (pass 1)
    expect(output.behaviors.length).toBeGreaterThan(0);
    expect(
      output.behaviorPriorities.every(
        (p) =>
          [p.effect, p.ease, p.centrality, p.measurability].every((n) => n >= 1 && n <= 5),
      ),
    ).toBe(true);
    expect(validFlags(output.gapLog)).toBe(true);
  });
});

describe("StubClearEngine.runExperiment", () => {
  it("screens interventions with APEASE and parks at least one vetoed idea", async () => {
    const { output } = await engine.runExperiment(
      intake,
      {} as ClarifyOutput,
      {} as LeverageTeaser,
      {} as LeverageFull,
      {} as ResourceEnvelope,
    );
    expect(output.interventionCandidates.length).toBeGreaterThan(0);
    for (const c of output.interventionCandidates) {
      const a = c.apease;
      expect([a.effectiveness, a.practicability, a.affordability].every((n) => n >= 1 && n <= 5)).toBe(true);
      expect([a.acceptability, a.safety, a.equity].every((g) => GATES.includes(g))).toBe(true);
      expect(typeof c.barrier).toBe("string"); // Effectiveness must trace to a named barrier
    }
    // The demo must include a vetoed (FAIL) candidate so the "park" rule is exercisable.
    const hasFail = output.interventionCandidates.some(
      (c) => c.apease.acceptability === "fail" || c.apease.safety === "fail" || c.apease.equity === "fail",
    );
    expect(hasFail).toBe(true);
    expect(output.faq.length).toBeGreaterThan(0);
    expect(validFlags(output.gapLog)).toBe(true);
  });
});

describe("StubClearEngine.runResearch", () => {
  it("returns cited findings, follow-up questions, and valid gap flags", async () => {
    const { output } = await engine.runResearch(intake, {} as ResearchContext);
    expect(output.findings.length).toBeGreaterThan(0);
    for (const f of output.findings) {
      expect(["clarify", "leverage"]).toContain(f.phaseTarget);
      expect(EVIDENCE_FLAGS).toContain(f.evidenceFlag);
      expect(["web", "knowledge_base", "dialogue"]).toContain(f.sourceKind);
      expect(Array.isArray(f.citations)).toBe(true);
    }
    expect(output.questions.length).toBeGreaterThan(0);
    expect(validFlags(output.gapLog)).toBe(true);
  });
});
