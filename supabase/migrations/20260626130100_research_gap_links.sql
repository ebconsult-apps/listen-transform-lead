-- ─────────────────────────────────────────────────────────────────────────────
-- Link research findings back to the assumption_gaps they were generated to close.
--
-- A targeted "Research these open questions" run lets the owner select one OR
-- several related gaps and research them together (MECE), so a single finding can
-- address several selected gaps → an array, not a scalar FK. Findings are always
-- loaded per-project (listFindings) then filtered in memory, so a uuid[] column is
-- the simplest correct fit. No new RLS: the existing "research_findings members"
-- policy already governs the row.
-- ─────────────────────────────────────────────────────────────────────────────

alter table research_findings
  add column if not exists source_gap_ids uuid[] not null default '{}';

-- Supports "which findings address this gap" lookups via array containment.
create index if not exists research_findings_source_gap_ids_idx
  on research_findings using gin (source_gap_ids);
