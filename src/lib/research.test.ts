import { describe, it, expect } from "vitest";
import { findingsForGap } from "./research";
import type { ResearchFindingRow } from "./db";

// findingsForGap is the pure selector that buckets a project's findings under the
// gap(s) they were generated to close. A targeted (MECE) run can link one finding
// to several gaps, so the selector must match on array membership. Node-env.
function finding(id: string, sourceGapIds: string[]): ResearchFindingRow {
  return {
    id,
    project_id: "p1",
    phase_target: "leverage",
    claim: `claim ${id}`,
    detail: null,
    source_kind: "web",
    citations: [],
    evidence_flag: "V",
    confidence: 80,
    tags: {},
    status: "proposed",
    shared_finding_id: null,
    source_gap_ids: sourceGapIds,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  };
}

describe("findingsForGap", () => {
  const findings = [
    finding("f1", ["g1", "g2"]),
    finding("f2", ["g2"]),
    finding("f3", []),
  ];

  it("returns findings linked to the gap, incl. multi-gap MECE bundles", () => {
    expect(findingsForGap(findings, "g1").map((f) => f.id)).toEqual(["f1"]);
    expect(findingsForGap(findings, "g2").map((f) => f.id)).toEqual(["f1", "f2"]);
  });

  it("returns nothing for an unlinked gap", () => {
    expect(findingsForGap(findings, "g3")).toEqual([]);
  });

  it("tolerates a missing source_gap_ids field (pre-migration rows)", () => {
    const legacy = finding("f4", []) as Partial<ResearchFindingRow>;
    delete legacy.source_gap_ids;
    expect(findingsForGap([legacy as ResearchFindingRow], "g1")).toEqual([]);
  });
});
