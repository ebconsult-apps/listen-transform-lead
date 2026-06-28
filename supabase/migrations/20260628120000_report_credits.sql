-- ─────────────────────────────────────────────────────────────────────────────
-- Report credits: record HOW a project was unlocked so the credit ledger can be
-- derived from project_unlocks (no separate balance to store/grant/reset).
--
-- A "credit" is one whole-project unlock granted by an active paid tier. Spending
-- one inserts a project_unlocks row with origin='credit'; a one-off Report Pass
-- inserts origin='pass' (OUTSIDE the monthly allotment). Remaining credits =
-- allotment(tier) − count(origin='credit' rows for the workspace this month), so
-- the consumption count drives enforcement (see project-run/index.ts and
-- _shared/billing/credits.ts).
--
-- No RLS change: project_unlocks stays service-role-write (webhook/edge only).
-- Existing rows predate credits and all came from one-off payments → backfill
-- 'pass' so they don't count against anyone's allotment.
-- ─────────────────────────────────────────────────────────────────────────────

alter table project_unlocks
  add column if not exists origin text;            -- 'credit' | 'pass' | 'comp'

update project_unlocks set origin = 'pass' where origin is null;

-- The credit-consumption count filters origin + unlocked_at within the month.
create index if not exists project_unlocks_origin_unlocked_at_idx
  on project_unlocks (origin, unlocked_at);
