import { describe, it, expect } from "vitest";
import type { AssumptionGapRow } from "@/lib/db";
import { sortOpenGaps } from "./priority";

/**
 * The focus flow surfaces the most-important OPEN item first. Ordering reads the
 * persisted `priority` column (higher = first) with created_at as a deterministic
 * tie-break so the focused item stays stable across refetches.
 */
const row = (over: Partial<AssumptionGapRow>): AssumptionGapRow => ({
  id: "id",
  project_id: "p",
  phase: null,
  flag_type: "assumption",
  content: "c",
  source: null,
  status: "open",
  response: null,
  priority: 0,
  created_at: "2026-06-01T00:00:00Z",
  updated_at: "2026-06-01T00:00:00Z",
  ...over,
});

describe("sortOpenGaps", () => {
  it("drops resolved and carried items", () => {
    const rows = [
      row({ id: "a", status: "open" }),
      row({ id: "b", status: "resolved" }),
      row({ id: "c", status: "carried" }),
    ];
    expect(sortOpenGaps(rows).map((r) => r.id)).toEqual(["a"]);
  });

  it("orders by priority desc, then oldest first on ties", () => {
    const rows = [
      row({ id: "low", priority: 1, created_at: "2026-06-01T00:00:00Z" }),
      row({ id: "high", priority: 5, created_at: "2026-06-03T00:00:00Z" }),
      row({ id: "mid-new", priority: 3, created_at: "2026-06-05T00:00:00Z" }),
      row({ id: "mid-old", priority: 3, created_at: "2026-06-02T00:00:00Z" }),
    ];
    expect(sortOpenGaps(rows).map((r) => r.id)).toEqual(["high", "mid-old", "mid-new", "low"]);
  });

  it("does not mutate the input array", () => {
    const rows = [row({ id: "a", priority: 1 }), row({ id: "b", priority: 5 })];
    const before = rows.map((r) => r.id);
    sortOpenGaps(rows);
    expect(rows.map((r) => r.id)).toEqual(before);
  });
});
