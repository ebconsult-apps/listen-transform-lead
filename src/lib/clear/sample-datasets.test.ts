import { describe, it, expect } from "vitest";
import {
  SAMPLE_SEGMENTS,
  DEFAULT_SAMPLE_SEGMENT,
  getSampleSegment,
} from "./sample-datasets";
import { COMB_LABEL, EVIDENCE_LABEL, FLAG_LABEL, GENRE_LABEL } from "./labels";

/**
 * Guards the segment-specific sample datasets against the exact shapes the report
 * renderers destructure and map over (ClarifyCard, TeaserReport, FullReport and
 * their children). A malformed fixture would throw at runtime in a browser tab; this
 * catches it in CI instead. Enum membership is checked against the label maps the
 * UI uses, so a stray component/flag/genre value can't slip through.
 */

const LEVELS = ["High", "Medium", "Low"];
const EVIDENCE = Object.keys(EVIDENCE_LABEL); // V | A | G | NA
const COMPONENTS = Object.keys(COMB_LABEL);
const FLAG_TYPES = Object.keys(FLAG_LABEL);
const GENRES = Object.keys(GENRE_LABEL);

const isNonEmptyString = (v: unknown) => typeof v === "string" && v.length > 0;

describe("sample datasets", () => {
  it("exposes a stable default segment", () => {
    expect(SAMPLE_SEGMENTS.some((s) => s.slug === DEFAULT_SAMPLE_SEGMENT)).toBe(true);
    expect(getSampleSegment(undefined).slug).toBe(DEFAULT_SAMPLE_SEGMENT);
    expect(getSampleSegment("does-not-exist").slug).toBe(DEFAULT_SAMPLE_SEGMENT);
    // Unique slugs so shareable URLs are unambiguous.
    expect(new Set(SAMPLE_SEGMENTS.map((s) => s.slug)).size).toBe(SAMPLE_SEGMENTS.length);
  });

  it("has at least three buyer segments", () => {
    expect(SAMPLE_SEGMENTS.length).toBeGreaterThanOrEqual(3);
  });

  for (const seg of SAMPLE_SEGMENTS) {
    describe(seg.slug, () => {
      it("resolves via its slug and has picker metadata", () => {
        expect(getSampleSegment(seg.slug)).toBe(seg);
        expect(isNonEmptyString(seg.label)).toBe(true);
        expect(isNonEmptyString(seg.audience)).toBe(true);
        expect(isNonEmptyString(seg.scenario)).toBe(true);
      });

      it("Clarify matches ClarifyCard's shape", () => {
        const { clarify } = seg;
        expect(isNonEmptyString(clarify.whyItMatters)).toBe(true);
        expect(isNonEmptyString(clarify.objective)).toBe(true);
        expect(Array.isArray(clarify.keyResults)).toBe(true);
        expect(clarify.keyResults.length).toBeGreaterThan(0);
        for (const kr of clarify.keyResults) {
          expect(isNonEmptyString(kr.kr)).toBe(true);
          if (kr.confidence !== undefined) expect(LEVELS).toContain(kr.confidence);
        }
        expect(Array.isArray(clarify.gapLog)).toBe(true);
        for (const f of clarify.gapLog) {
          expect(FLAG_TYPES).toContain(f.type);
          expect(isNonEmptyString(f.content)).toBe(true);
        }
      });

      it("Teaser matches TeaserReport / LeveragePriorityMap's shape", () => {
        const { teaser } = seg;
        expect(isNonEmptyString(teaser.systemsMapSummary)).toBe(true);
        expect(isNonEmptyString(teaser.headline)).toBe(true);
        expect(Array.isArray(teaser.topLeveragePoints)).toBe(true);
        expect(teaser.topLeveragePoints.length).toBeGreaterThan(0);
        for (const p of teaser.topLeveragePoints) {
          expect(typeof p.rank).toBe("number");
          expect(isNonEmptyString(p.point)).toBe(true);
          expect(isNonEmptyString(p.currentState)).toBe(true);
          // LeveragePriorityMap indexes LEVEL_INDEX[p.ease] / [p.impact] — must be exact.
          expect(LEVELS).toContain(p.impact);
          expect(LEVELS).toContain(p.ease);
          expect(typeof p.confidence).toBe("number");
        }
        // Ranks are unique (used as React keys / scroll targets).
        const ranks = teaser.topLeveragePoints.map((p) => p.rank);
        expect(new Set(ranks).size).toBe(ranks.length);
      });

      it("Full report matches every array FullReport maps over", () => {
        const { full } = seg;
        // Behaviours + priorities (BehaviorTable).
        expect(Array.isArray(full.behaviors)).toBe(true);
        const ids = full.behaviors.map((b) => b.id);
        expect(new Set(ids).size).toBe(ids.length);
        for (const b of full.behaviors) {
          expect(isNonEmptyString(b.id)).toBe(true);
          expect(isNonEmptyString(b.description)).toBe(true);
          if (b.genre !== undefined) expect(GENRES).toContain(b.genre);
        }
        expect(Array.isArray(full.behaviorPriorities)).toBe(true);
        for (const bp of full.behaviorPriorities) {
          expect(ids).toContain(bp.behaviorId);
          for (const n of [bp.effect, bp.ease, bp.centrality, bp.measurability]) {
            expect(typeof n).toBe("number");
          }
        }

        // Systems map (CauseEffectMap).
        expect(Array.isArray(full.keyActors)).toBe(true);
        for (const a of full.keyActors) {
          expect(isNonEmptyString(a.actor)).toBe(true);
          expect(isNonEmptyString(a.behavior)).toBe(true);
        }
        expect(Array.isArray(full.causeEffect)).toBe(true);
        for (const e of full.causeEffect) {
          expect(isNonEmptyString(e.from)).toBe(true);
          expect(isNonEmptyString(e.to)).toBe(true);
          if (e.polarity !== undefined) expect(["+", "-"]).toContain(e.polarity);
        }
        if (full.loops) {
          expect(Array.isArray(full.loops)).toBe(true);
          for (const l of full.loops) expect(isNonEmptyString(l)).toBe(true);
        }

        // COM-B matrix (CombMatrix).
        expect(Array.isArray(full.comb)).toBe(true);
        expect(full.comb.length).toBe(6);
        expect(new Set(full.comb.map((c) => c.component)).size).toBe(6);
        for (const c of full.comb) {
          expect(COMPONENTS).toContain(c.component);
          expect(isNonEmptyString(c.barrier)).toBe(true);
          expect(LEVELS).toContain(c.impact);
          expect(LEVELS).toContain(c.changeability);
          expect(EVIDENCE).toContain(c.evidenceFlag);
        }

        // Strongest barriers + narratives (mapped without null-guards in FullReport).
        expect(Array.isArray(full.strongestBarriers)).toBe(true);
        for (const b of full.strongestBarriers) {
          expect(isNonEmptyString(b.barrier)).toBe(true);
          expect(COMPONENTS).toContain(b.component);
          expect(isNonEmptyString(b.rationale)).toBe(true);
        }
        expect(Array.isArray(full.barrierNarratives)).toBe(true);
        expect(full.barrierNarratives.length).toBeGreaterThan(0);
        for (const n of full.barrierNarratives) {
          expect(isNonEmptyString(n.point)).toBe(true);
          expect(isNonEmptyString(n.narrative)).toBe(true);
        }

        // Discovery activities + gap log.
        expect(Array.isArray(full.discoveryActivities)).toBe(true);
        expect(full.discoveryActivities.length).toBeGreaterThan(0);
        for (const d of full.discoveryActivities) expect(isNonEmptyString(d)).toBe(true);
        expect(Array.isArray(full.gapLog)).toBe(true);
        for (const f of full.gapLog) {
          expect(FLAG_TYPES).toContain(f.type);
          expect(isNonEmptyString(f.content)).toBe(true);
        }
      });
    });
  }
});
