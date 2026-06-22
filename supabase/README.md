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
  EXPERIMENT_MODEL=claude-sonnet-4-6 \
  WORKSPACE_MONTHLY_COST_CAP_USD=25 \
  BREVO_API_KEY=xkeysib-... \
  PUBLIC_APP_URL=https://clear-framework.com

supabase functions deploy project-run stripe-checkout stripe-webhook \
  invite-respondents respondent
```

`BREVO_API_KEY` powers respondent invitation emails (reuses the marketing-site
Brevo account; sender is the already-verified `erik@eb-consulting.se`).
`PUBLIC_APP_URL` is the base for tokenized `/respond/<token>` links.

## 3b. Respondent collaboration

Two functions enable email-invited respondents to contribute to a project:

- `invite-respondents` (owner JWT) — sends/resends/revokes invitations.
- `respondent` (public, `verify_jwt = false`) — token-authed portal API
  (load/save/submit/upload). Respondents have no Supabase account; the invitation
  token authorizes every call, and writes go through the service-role client.

Respondent document uploads reuse the same in-browser text extraction as the owner
intake, so no separate extraction service is needed. The CI workflow
`.github/workflows/supabase-deploy.yml` deploys all three edge functions on push to
`main`; the `20260616210000_respondent_collaboration.sql` migration adds the
`project_invitations`, `project_contributions`, and `leverage_reactions` tables.

## 3c. Experiment phase

The `project-run` function gained a third phase, `experiment`, gated by the same
entitlement check as `full` (paid tier or project unlock → otherwise `402`). It
runs the APEASE-screened intervention generator (`EXPERIMENT_MODEL`, default
Sonnet) off the latest CLARIFY/LEVERAGE runs plus the owner's resource envelope,
then seeds editable records. The `20260617120000_experiment_phase.sql` migration
adds `experiment_designs`, `intervention_candidates`, `test_cards`, and the
cross-phase `assumption_gaps` log (all project-member read+write under RLS), and
extends the `runs.phase` / `projects.status` enums. `project-run` is edited in
place, so no change to the deploy workflow is required.

## 4. Stripe — go-live runbook

The `stripe-checkout` (creates Checkout / Billing-Portal sessions) and
`stripe-webhook` (syncs payments → `entitlements` / `project_unlocks`) functions
are deployed by `supabase-deploy.yml`. The decision logic is unit-tested in
`functions/_shared/billing/entitlements.test.ts`; the signed HTTP path is verified
in Stripe **test mode** below. Do all of this in **test mode** first, then repeat
with live keys.

> **Fast path:** `scripts/stripe-setup.mjs` does steps 1 + 4 (creates the prices +
> the webhook endpoint) via the Stripe API and prints every env value to paste —
> `STRIPE_SECRET_KEY=sk_test_… WEBHOOK_URL=…/functions/v1/stripe-webhook node
> scripts/stripe-setup.mjs`. You still grab the API keys and set the env yourself
> (steps 2–3, 5–6).

1. **Products + Prices** (Stripe dashboard → Products): create recurring prices for
   **Solo / Team / Business** and a one-off price for the **single-report unlock**.
   Copy each Price ID (`price_…`).

2. **Keys + secret:** grab the **publishable** + **secret** keys (Developers → API
   keys). You'll get the **webhook signing secret** in step 4.

3. **Set env:**
   - Edge secrets — `supabase secrets set STRIPE_SECRET_KEY=sk_test_… \
     STRIPE_WEBHOOK_SECRET=whsec_… STRIPE_PRICE_SOLO=price_… STRIPE_PRICE_TEAM=price_… \
     STRIPE_PRICE_BUSINESS=price_…` (the price ids let the webhook follow a
     Billing-Portal plan change → tier).
   - Client (GitHub Actions **Variables**, inlined at build): `VITE_STRIPE_PUBLISHABLE_KEY`,
     `VITE_STRIPE_PRICE_SOLO` / `_TEAM` / `_BUSINESS` / `_UNLOCK`, and `VITE_BILLING_ENABLED=true`.

4. **Webhook endpoint** (Developers → Webhooks → Add endpoint): point it at the
   deployed `…/functions/v1/stripe-webhook` URL; subscribe to
   `checkout.session.completed`, `customer.subscription.updated`,
   `customer.subscription.deleted`. Copy the signing secret into
   `STRIPE_WEBHOOK_SECRET` (step 3).

5. **Test (test mode):** in the app, subscribe from **/account/billing** or click a
   project's paywall **unlock**, pay with card `4242 4242 4242 4242` (any future
   expiry / CVC). Confirm the webhook flips `entitlements.tier` (subscription) or
   `project_unlocks.unlocked` (one-off) and the full report unlocks. Use the Billing
   Portal to change plan and confirm the tier follows. Local end-to-end:
   `stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook` +
   `stripe trigger checkout.session.completed`.

6. **Go live:** swap to live keys/prices, recreate the webhook on the live endpoint,
   and re-run a real card once.

> **Fees / tax:** Stripe is pay-per-transaction (≈1.5% + €0.25 EEA cards, **+0.5%**
> on subscriptions; verify current rates). Selling SaaS across the EU has VAT/OSS
> obligations — consider enabling **Stripe Tax**. The prices in `src/config/billing.ts`
> ($49/$299/$999) are hypotheses — validate before charging real customers.

## 5. Going live (M5)

Flip `AI_MODE=live` in the function secrets. `LiveClearEngine` then calls Claude
with the prompts in `functions/_shared/clear/prompts.ts` — **no UI changes**.
Model ids come from `CLARIFY_MODEL` / `LEVERAGE_MODEL` / `EXPERIMENT_MODEL` so
they can be upgraded without code changes. Per-workspace monthly spend is capped
by `WORKSPACE_MONTHLY_COST_CAP_USD`.

## 6. QA / full-access test account

With billing off (`VITE_BILLING_ENABLED=false`), no one can pay through Stripe, so
to exercise the **full** report (and the rest of the flow) you grant a test account
a paid `entitlements` row directly.

1. **Sign up** the test account at `clear-framework.com/signup` using an inbox you
   control (a `+alias`, e.g. `you+clear-test@gmail.com`, works well — it must
   receive the confirmation email). First login auto-provisions its workspace and a
   free entitlement.

2. **Grant full access** — Supabase → SQL Editor (swap in the email):

   ```sql
   update entitlements e
   set tier = 'business', status = 'active'
   from workspaces w
   join auth.users u on u.id = w.owner_id
   where e.workspace_id = w.id
     and u.email = 'you+clear-test@gmail.com';
   ```

3. **Verify**:

   ```sql
   select u.email, e.tier, e.status
   from entitlements e
   join workspaces w on w.id = e.workspace_id
   join auth.users u on u.id = w.owner_id
   where u.email = 'you+clear-test@gmail.com';
   ```

   Expect `tier = business`, `status = active`. That account now gets the full
   report auto-generated on any project it runs — no paywall.

Notes:

- Live runs still count against `WORKSPACE_MONTHLY_COST_CAP_USD` ($25/workspace/mo).
- When testing the **respondent** side, invite a *different* address than the
  project owner (the owner address is also the Brevo sender), e.g. another `+alias`.

## 7. Integration tests (gating + RLS)

`tests/integration/` exercises the security boundary that unit tests can't reach —
the edge-function gates (401/403/402/409) and Postgres RLS tenant-isolation — against
a real local stack. It needs Docker + the Supabase CLI.

```bash
supabase start            # boots Postgres + Auth + the served edge functions, applies migrations
# map the printed credentials into the env the harness reads:
export SUPABASE_URL=$(supabase status -o env | grep '^API_URL=' | cut -d'"' -f2)
export SUPABASE_ANON_KEY=$(supabase status -o env | grep '^ANON_KEY=' | cut -d'"' -f2)
export SUPABASE_SERVICE_ROLE_KEY=$(supabase status -o env | grep '^SERVICE_ROLE_KEY=' | cut -d'"' -f2)
npm run test:integration
supabase stop
```

Without those env vars the suite **skips** (so `npm test` and Docker-less machines are
unaffected). CI runs it automatically via `.github/workflows/integration.yml`.
