-- ─────────────────────────────────────────────────────────────────────────────
-- Billing & data integrity (roadmap B1, gate G1 — see docs/ROADMAP.md §5).
--
-- Closes five money-path holes:
--   1. `runs` was member-writable via `for all` RLS, but the free-run quota and
--      the monthly spend cap are DERIVED by counting/summing runs — so a member
--      could DELETE their own runs to reset both. Members now only INSERT (stub
--      mode writes runs from the client) and SELECT; edge functions use the
--      service role and are unaffected.
--   2. Same vector one level up: `projects members write` was `for all`, and
--      runs + project_unlocks cascade on project delete — deleting a project
--      reset the run counters AND freed the spent credit. The client never
--      deletes projects (verified: only insert + status update), so members now
--      get insert + update and deletion becomes a service-role operation (the
--      retention/erasure work in roadmap C4 will add a proper deletion path).
--   3. The Stripe webhook had no replay protection: `stripe_events` records each
--      event id and when it was fully processed, so redelivered events are
--      no-ops and half-applied attempts are retryable.
--   4. A redelivered checkout event re-inserted `report_passes` → duplicate
--      creditable passes. A unique index on the payment intent makes the
--      duplicate impossible at the DB layer. NOTE: deliberately NOT a partial
--      index — PostgREST's `on_conflict` can't repeat a partial index's
--      predicate, so a partial index can never be its ON CONFLICT arbiter
--      (42P10). A plain unique index still permits many NULLs (NULLS DISTINCT).
--   5. Credit spend was read-count-then-upsert in project-run: two concurrent
--      runs could both pass the check with one credit left. `spend_report_credit`
--      serializes per workspace with an advisory xact lock and makes
--      check-and-spend a single transaction.
--
-- Also adds the missing hot-path indexes: `runs` and `documents` had none, yet
-- every phase run queries runs by (project_id, phase) and month-sums runs across
-- a workspace via the projects join.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1 ── runs: members read + insert only (no update/delete → no quota resets)
drop policy if exists "runs members write" on runs;
create policy "runs members insert" on runs for insert
  with check (public.is_project_member(project_id));
-- "runs members read" (select) from the init migration stays as-is.

-- 2 ── projects: members read + insert + update, no delete (cascade would erase
-- the runs/unlock rows the usage accounting is derived from).
drop policy if exists "projects members write" on projects;
create policy "projects members insert" on projects for insert
  with check (public.is_member(workspace_id));
create policy "projects members update" on projects for update
  using (public.is_member(workspace_id))
  with check (public.is_member(workspace_id));
-- "projects members read" (select) from the init migration stays as-is.

-- 3 ── hot-path indexes
create index if not exists runs_project_phase_created_idx
  on runs (project_id, phase, created_at);
create index if not exists documents_project_idx on documents (project_id);
create index if not exists projects_workspace_idx on projects (workspace_id);
-- Webhook looks entitlements up by Stripe customer id.
create index if not exists entitlements_stripe_customer_idx
  on entitlements (stripe_customer_id);

-- 4 ── Stripe event ledger: one row per event id; `processed_at` is stamped only
-- after every mutation succeeded. Redelivery of a processed event → no-op;
-- redelivery of an unprocessed one (a crashed or failed attempt) → reprocessed
-- (all webhook mutations are idempotent). Service-role only: RLS enabled with no
-- policies (same posture as report_passes).
create table if not exists stripe_events (
  id text primary key,                       -- Stripe event id (evt_…)
  type text not null,
  received_at timestamptz not null default now(),
  processed_at timestamptz
);
alter table stripe_events enable row level security;

-- 5 ── report_passes: at most one pass per Stripe payment intent.
-- Defensive dedupe first (the previously replay-unsafe webhook could have left
-- duplicates). Keep exactly one row per intent, preferring an APPLIED row —
-- checkout credits the newest UNAPPLIED pass, so keeping an unapplied duplicate
-- of an applied one would let a single $99 payment be credited twice — then the
-- earliest purchase, with id as a deterministic tiebreaker.
delete from report_passes rp
using (
  select id,
         row_number() over (
           partition by stripe_payment_intent
           order by (applied_at is null), purchased_at, id
         ) as rn
  from report_passes
  where stripe_payment_intent is not null
) ranked
where rp.id = ranked.id and ranked.rn > 1;

create unique index if not exists report_passes_payment_intent_key
  on report_passes (stripe_payment_intent);

-- 6 ── Atomic credit spend: check-and-spend in one transaction, serialized per
-- workspace by an advisory xact lock (released automatically at commit/rollback).
-- The allotment stays computed in TypeScript (env-overridable, unit-tested in
-- _shared/billing/credits.ts) and is passed in; the month window is passed in so
-- it matches the spend-cap window exactly. Returns:
--   true  → the project is unlocked (was already, or a credit was just spent)
--   false → no credit left this month (caller answers 402)
create or replace function public.spend_report_credit(
  p_project_id uuid,
  p_workspace_id uuid,
  p_allotment integer,
  p_month_start timestamptz
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  consumed integer;
begin
  perform pg_advisory_xact_lock(hashtext(p_workspace_id::text));

  -- Already unlocked (pass, comp, or an earlier credit) → idempotent success.
  if exists (
    select 1 from project_unlocks
    where project_id = p_project_id and unlocked
  ) then
    return true;
  end if;

  select count(*) into consumed
  from project_unlocks u
  join projects p on p.id = u.project_id
  where u.origin = 'credit'
    and u.unlocked_at >= p_month_start
    and p.workspace_id = p_workspace_id;

  if consumed >= p_allotment then
    return false;
  end if;

  insert into project_unlocks (project_id, unlocked, origin, unlocked_at)
  values (p_project_id, true, 'credit', now())
  on conflict (project_id) do update
    set unlocked = true, origin = 'credit', unlocked_at = now();
  return true;
end;
$$;

-- Service-role only: edge functions call this; clients must not.
revoke execute on function public.spend_report_credit(uuid, uuid, integer, timestamptz)
  from public, anon, authenticated;
grant execute on function public.spend_report_credit(uuid, uuid, integer, timestamptz)
  to service_role;
