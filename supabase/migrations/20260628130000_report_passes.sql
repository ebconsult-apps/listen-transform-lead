-- ─────────────────────────────────────────────────────────────────────────────
-- Creditable Report Pass: a $99 one-off Report Pass is creditable toward the
-- workspace's FIRST subscription for 14 days. We record each pass purchase here so
-- stripe-checkout can apply an unexpired, unapplied one as account credit toward
-- the first subscription invoice (a Stripe customer-balance transaction), then
-- stamp applied_at so it's used at most once.
--
-- Service-role only: the Stripe webhook records passes and stripe-checkout applies
-- them. No client reads it, so RLS is enabled with no policy (service role bypasses
-- RLS; everyone else is denied) — same posture as the other webhook-driven tables.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists report_passes (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces on delete cascade,
  stripe_payment_intent text,
  amount_cents integer not null default 0,
  currency text not null default 'usd',
  purchased_at timestamptz not null default now(),
  expires_at timestamptz not null,
  applied_at timestamptz
);

-- "Newest unapplied, unexpired pass for this workspace" lookup at checkout time.
create index if not exists report_passes_workspace_idx
  on report_passes (workspace_id, applied_at, expires_at);

alter table report_passes enable row level security;
