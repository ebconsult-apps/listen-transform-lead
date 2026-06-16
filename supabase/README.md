# CLEAR self-serve — Supabase backend

The self-serve product (routes `/product`, `/pricing`, `/login`, `/app/*`,
`/account/*`) runs on Supabase: Auth, Postgres + RLS, Storage, and Edge
Functions. The marketing site (`/`, `/about`, …) is unaffected and still works
without any of this configured.

## 1. Create the project (EU region)

Create a Supabase project in an **EU region** (`eu-central-1` / `eu-west-1`) for
GDPR data residency, then:

**Recommended — GitHub integration (GitOps).** In the Supabase dashboard:
Settings → Integrations → GitHub, connect this repo with production branch
`main`. Supabase then applies any `supabase/migrations/*.sql` on merge to `main`.
Migration files must be named `<timestamp>_name.sql` for the integration to pick
them up. Add future changes as new `supabase/migrations/<timestamp>_*.sql` files
and merge.

**Alternative — CLI:**

```bash
supabase link --project-ref <your-ref>
supabase db push                 # applies supabase/migrations/*.sql
```

The init migration creates the schema, RLS policies, the private `documents`
storage bucket + policies, and a trigger that provisions a `profiles` row, a
personal `workspaces` row, an owner `memberships` row, and a free `entitlements`
row on first login.

## 2. Client env

Copy `.env.example` → `.env.local` and fill the `VITE_*` values from
Supabase → Project Settings → API. Leave `VITE_AI_MODE=stub` to demo without an
Anthropic key.

## 3. Edge function secrets

```bash
supabase secrets set \
  SUPABASE_SERVICE_ROLE_KEY=... \
  STRIPE_SECRET_KEY=sk_test_... \
  STRIPE_WEBHOOK_SECRET=whsec_... \
  ANTHROPIC_API_KEY=sk-ant-... \
  AI_MODE=stub \
  CLARIFY_MODEL=claude-haiku-4-5 \
  LEVERAGE_MODEL=claude-sonnet-4-6 \
  WORKSPACE_MONTHLY_COST_CAP_USD=25

supabase functions deploy project-run stripe-checkout stripe-webhook
```

## 4. Stripe

Create Products/Prices for Solo/Team/Business (recurring) and a one-off
"full-report unlock". Put the Price IDs in the client env
(`VITE_STRIPE_PRICE_SOLO`, `_TEAM`, `_BUSINESS`, `_UNLOCK`) and point a Stripe
webhook at the deployed `stripe-webhook` URL (events:
`checkout.session.completed`, `customer.subscription.*`).

## 5. Going live (M5)

Flip `AI_MODE=live` in the function secrets. `LiveClearEngine` then calls Claude
with the prompts in `functions/_shared/clear/prompts.ts` — **no UI changes**.
Model ids come from `CLARIFY_MODEL` / `LEVERAGE_MODEL` so they can be upgraded
without code changes. Per-workspace monthly spend is capped by
`WORKSPACE_MONTHLY_COST_CAP_USD`.
