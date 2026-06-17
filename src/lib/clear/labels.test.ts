import { describe, it, expect } from "vitest";
import {
  gapFlags,
  combLabel,
  COMB_LABEL,
  EVIDENCE_LABEL,
  FLAG_LABEL,
  GATE_LABEL,
  GENRE_LABEL,
} from "./labels";
import type { ClarifyOutput } from "./types";

/**
 * Presentation helpers shared by the report UI, the Experiment tab, and the
 * markdown export. The back-compat paths matter: older persisted runs used a
 * split assumptions/gaps array and a free-text COM-B `factor`, and must still
 * render rather than crash.
 */

describe("gapFlags", () => {
  it("returns the modern gapLog when present", () => {
    const out = {
      gapLog: [{ type: "gap", content: "missing metric" }],
    } as unknown as ClarifyOutput;
    expect(gapFlags(out)).toEqual([{ type: "gap", content: "missing metric" }]);
  });

  it("falls back to legacy assumptions[]/gaps[] for older runs", () => {
    const legacy = { assumptions: ["reachable weekly"], gaps: ["no week-8 measure"] };
    expect(gapFlags(legacy)).toEqual([
      { type: "assumption", content: "reachable weekly" },
      { type: "gap", content: "no week-8 measure" },
    ]);
  });

  it("returns an empty array when nothing is flagged", () => {
    expect(gapFlags({})).toEqual([]);
  });
});

describe("combLabel", () => {
  it("maps a known COM-B component to its human label", () => {
    expect(combLabel({ component: "capability_physical" })).toBe("Capability — Physical");
  });
  it("falls back to a legacy free-text factor", () => {
    expect(combLabel({ factor: "Capability — Physical (legacy)" })).toBe("Capability — Physical (legacy)");
  });
  it("returns a dash when neither is present", () => {
    expect(combLabel({})).toBe("—");
  });
});

describe("label maps are complete", () => {
  it("has a label for every COM-B component, evidence flag, flag type, gate, and genre", () => {
    expect(Object.keys(COMB_LABEL)).toHaveLength(6);
    expect(Object.keys(EVIDENCE_LABEL)).toHaveLength(4);
    expect(Object.keys(FLAG_LABEL)).toHaveLength(6);
    expect(Object.keys(GATE_LABEL)).toHaveLength(3);
    expect(Object.keys(GENRE_LABEL)).toHaveLength(6);
    // no empty labels
    const all = [COMB_LABEL, EVIDENCE_LABEL, FLAG_LABEL, GATE_LABEL, GENRE_LABEL];
    expect(all.every((m) => Object.values(m).every((v) => typeof v === "string" && v.length > 0))).toBe(true);
  });
});
