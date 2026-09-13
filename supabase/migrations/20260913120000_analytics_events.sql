-- ─────────────────────────────────────────────────────────────────────────────
-- First-party, cookieless analytics event log.
--
-- The marketing site mirrors every GA4 event it fires (page_view, cta_click,
-- whitepaper_gate_view, lead_*, whitepaper_download, ...) into this table via the
-- public `track` edge function, so the per-asset funnels and AI-referral traffic
-- can be queried with plain SQL instead of the GA4 UI. Google Analytics stays in
-- place for Google Ads conversion import; this is additive.
--
-- Privacy model (see src/content/privacy-policy.tsx §2, §3, §8):
--   - no cookies, no localStorage, nothing set on the visitor's device;
--   - no IP address stored. `visitor_hash` is sha256(salt | ip | user-agent | day),
--     truncated, so it cannot be reversed and changes every day; it only lets us
--     count distinct visitors within a day;
--   - `props` is whatever the client attached to the event (whitepaper_id,
--     placement, form_name, cta_name, hero_variant ...), validated by the function
--     to short scalar values; the client never sends names or emails here.
--
-- Access: RLS is enabled with NO policies and the default grants are revoked, so
-- anon/authenticated PostgREST callers can neither read nor write. Only the
-- service role (the `track` function and the operator's SQL) touches it.
--
-- Retention: analytics_prune() deletes rows older than 14 months (the period the
-- privacy policy states). The track function calls it on a small fraction of
-- requests so no scheduler is required.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists analytics_events (
  id            bigint generated always as identity primary key,
  occurred_at   timestamptz not null default now(),
  event         text        not null,
  props         jsonb       not null default '{}'::jsonb,
  path          text,
  referrer_host text,
  -- chatgpt | claude | perplexity | copilot | gemini | other_ai | google | bing |
  -- duckduckgo | linkedin | social | internal | direct | other
  source        text        not null default 'other',
  -- mobile | tablet | desktop | bot | unknown
  device        text,
  visitor_hash  text
);

create index if not exists analytics_events_occurred_at_idx
  on analytics_events (occurred_at desc);
create index if not exists analytics_events_event_idx
  on analytics_events (event, occurred_at desc);
create index if not exists analytics_events_source_idx
  on analytics_events (source, occurred_at desc);
create index if not exists analytics_events_whitepaper_idx
  on analytics_events ((props->>'whitepaper_id'))
  where props ? 'whitepaper_id';

alter table analytics_events enable row level security;
revoke all on analytics_events from anon, authenticated;

-- ── Reporting views (security_invoker so they inherit the table's RLS) ───────

-- Per-whitepaper funnel: gate shown → lead form submitted → PDF link clicked.
create or replace view analytics_whitepaper_funnel
  with (security_invoker = true) as
select
  props->>'whitepaper_id'                                                   as whitepaper_id,
  count(*)                    filter (where event = 'whitepaper_gate_view')      as gate_views,
  count(distinct visitor_hash) filter (where event = 'whitepaper_gate_view')     as gate_visitors,
  count(*)                    filter (where event = 'lead_whitepaper_download')  as leads,
  count(*)                    filter (where event = 'whitepaper_download')       as downloads,
  min(occurred_at)                                                           as first_seen,
  max(occurred_at)                                                           as last_seen
from analytics_events
where props ? 'whitepaper_id'
  and coalesce(device, '') <> 'bot'
group by 1
order by gate_views desc;

-- Traffic by day and acquisition source (the AI assistants are separate sources).
create or replace view analytics_daily_sources
  with (security_invoker = true) as
select
  (occurred_at at time zone 'Europe/Stockholm')::date              as day,
  source,
  count(*)                     filter (where event = 'page_view')  as page_views,
  count(distinct visitor_hash)                                     as visitors,
  count(*)                     filter (where event like 'lead\_%') as leads
from analytics_events
where coalesce(device, '') <> 'bot'
group by 1, 2
order by 1 desc, 3 desc;

-- Every event that arrived from an AI assistant, newest first.
create or replace view analytics_ai_referrals
  with (security_invoker = true) as
select occurred_at, source, referrer_host, path, event, props, device
from analytics_events
where source in ('chatgpt', 'claude', 'perplexity', 'copilot', 'gemini', 'other_ai')
order by occurred_at desc;

revoke all on analytics_whitepaper_funnel, analytics_daily_sources, analytics_ai_referrals
  from anon, authenticated;

-- ── Retention ────────────────────────────────────────────────────────────────

create or replace function analytics_prune(retain interval default interval '14 months')
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  n integer;
begin
  delete from analytics_events where occurred_at < now() - retain;
  get diagnostics n = row_count;
  return n;
end
$$;

revoke all on function analytics_prune(interval) from public, anon, authenticated;
