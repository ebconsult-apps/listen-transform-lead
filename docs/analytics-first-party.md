# First-party analytics (Supabase `analytics_events`)

A cookieless event log that mirrors every GA4 event the marketing site fires, stored in the
project's own Postgres so the whitepaper funnel and AI-assistant referrals can be queried with
SQL. Google Analytics stays in place for Google Ads conversion import; this is additive.

## How it flows

```
browser  ── trackEvent()  ──▶  gtag (GA4, consent-gated)
 (src/utils/analytics.ts)  └─▶  POST /functions/v1/track  ──▶  analytics_events
                                 (public edge function,          (RLS, service-role only)
                                  validates + derives)
```

| Piece | File |
| --- | --- |
| Client mirror (`sendFirstParty`, inside `trackEvent`) | `src/utils/analytics.ts` |
| Edge function | `supabase/functions/track/index.ts` (`verify_jwt = false` in `supabase/config.toml`) |
| Validation / classification helpers + tests | `supabase/functions/_shared/analytics/track.ts`, `track.test.ts` |
| Table, indexes, views, prune function | `supabase/migrations/20260913120000_analytics_events.sql` |
| Deploy | `.github/workflows/supabase-deploy.yml` (function) and the Supabase GitHub integration / `supabase db push` (migration) |

The client skips the mirror when `VITE_SUPABASE_URL` is unset, outside a browser, in dev/QA
mock mode, and in the prerender browser.

## What a row contains

| Column | Meaning |
| --- | --- |
| `event` | Same names as GA4: `page_view`, `cta_click`, `form_submission`, `lead_<form>`, `whitepaper_gate_view`, `whitepaper_download`, `hero_ab_impression`, `product_*` |
| `props` | Validated scalar props the caller attached (`whitepaper_id`, `placement`, `form_name`, `cta_name`, `hero_variant`). Never names or emails. |
| `path` | Page path without query string or hash |
| `referrer_host` | Host of `document.referrer`, lower-cased, no `www.` |
| `source` | Derived: `chatgpt`, `claude`, `perplexity`, `copilot`, `gemini`, `other_ai`, `google`, `bing`, `duckduckgo`, `linkedin`, `social`, `internal`, `direct`, `other` |
| `device` | `mobile`, `tablet`, `desktop`, `bot`, `unknown` (views exclude `bot`) |
| `visitor_hash` | `sha256(salt | ip | user-agent | day)` truncated to 16 hex. Rotates daily; the IP is never stored. |

Privacy position: no cookie, no device storage, no IP retained, EU-hosted, 14-month retention.
The privacy policy (§2, §3, §6, §8) describes it and relies on legitimate interests, not consent.

## Queries

Run these in the Supabase SQL editor or through the Supabase connector. Three views do the
common reports:

```sql
-- Per-whitepaper funnel: gate shown → lead submitted → PDF clicked
select * from analytics_whitepaper_funnel;

-- Visits by day and acquisition source (AI assistants are separate sources)
select * from analytics_daily_sources where day >= current_date - 30;

-- Everything that came from an AI assistant, newest first
select * from analytics_ai_referrals limit 100;
```

Useful ad-hoc queries:

```sql
-- Which pages do AI assistants send people to?
select path, source, count(*) as visits, count(distinct visitor_hash) as visitors
from analytics_events
where event = 'page_view' and source in ('chatgpt','claude','perplexity','copilot','gemini','other_ai')
group by 1, 2 order by visits desc;

-- Conversion rate of the whitepaper gate by placement (modal vs overview page)
select props->>'placement' as placement,
       count(*) filter (where event = 'whitepaper_gate_view') as views,
       count(*) filter (where event = 'lead_whitepaper_download') as leads
from analytics_events where props ? 'placement' group by 1;

-- Hero A/B: impressions and assessment CTA clicks per variant (same visitor, same day)
with imp as (
  select visitor_hash, props->>'hero_variant' as variant
  from analytics_events where event = 'hero_ab_impression'
), clicks as (
  select visitor_hash from analytics_events
  where event = 'cta_click' and props->>'cta_name' = 'hero_assessment'
)
select variant, count(distinct imp.visitor_hash) as visitors,
       count(distinct clicks.visitor_hash) as clicked
from imp left join clicks using (visitor_hash) group by 1;

-- Retention: run manually if needed (the function also calls it on ~0.5% of requests)
select analytics_prune();
```

## Operations

- **Salt.** Set `ANALYTICS_SALT` (`openssl rand -hex 32`) with `supabase secrets set` so the
  visitor key's salt is independent of the service-role key. Changing it resets visitor
  counts for the day, nothing else.
- **Adding an event.** Call `trackEvent("name", { key: "value" })` anywhere in the client; the
  mirror is automatic. Keep names `snake_case` and props short scalars, or the function drops
  them (see `parseTrackPayload`).
- **Abuse.** The endpoint is public and unauthenticated by design (so is every analytics
  beacon). It caps body size at 8 KB, rejects malformed events, and stores only validated
  fields. If junk appears, add an `Origin` allowlist in `track/index.ts`.
- **Verifying after deploy.** `select count(*), max(occurred_at) from analytics_events;` should
  grow within a minute of any visit to the live site.
