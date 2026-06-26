/**
 * Ordering for the Open-questions focus flow. The importance lives on the
 * `assumption_gaps.priority` column (seeded from FLAG_PRIORITY at insert time,
 * AI-rankable later), so this just sorts by that column with a deterministic
 * tie-break — created_at ascending — so the "most important" item stays stable
 * across react-query refetches and the focus card doesn't reshuffle mid-edit.
 */
import type { AssumptionGapRow } from "@/lib/db";

/** Open items only, most-important first (priority desc, then oldest first). */
export function sortOpenGaps(rows: AssumptionGapRow[]): AssumptionGapRow[] {
  return rows
    .filter((r) => r.status === "open")
    .slice()
    .sort((a, b) => b.priority - a.priority || a.created_at.localeCompare(b.created_at));
}
