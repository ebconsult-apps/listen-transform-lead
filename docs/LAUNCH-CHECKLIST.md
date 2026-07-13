# Launch checklist — Erik's 5%

The code is built and deployed. What's left is the handful of things **only Erik can do** to open
real sales: credentials, a paid infrastructure decision, a Stripe account, counsel sign-offs, and
a few DNS records. This is that list, ordered, with exact steps and rough minutes.

**Two paths, deliberately separated:**

- **Path A — the Founding Partner sale (€200 concierge).** Erik delivers each report personally,
  handles data and refunds by hand, and controls quality. This can open first. It needs the app
  working, a live Stripe Payment Link, and a *minimum* legal posture.
- **Path B — self-serve paid EU sign-ups (€99 Pass / €79 Solo / €249 Team).** Automated billing,
  no human in the loop. This is **hard-gated**: no paid EU self-serve sign-up until the legal
  Tier-0 items are closed (ROADMAP gate **G2**). Don't shortcut this one.

Legend: **[E]** only Erik / ops can do it · **[E+counsel]** needs a lawyer · **[E+C]** Erik
activates, a Claude session can do the code.

---

## Day 0 — Make the app real and worth showing

*Nothing else matters if the app is down or the reports are thin. This is also what the LinkedIn
launch and outreach point people at (the free teaser + the public sample), so it comes first even
before any money moves.*

- [ ] **D0.1 — Supabase: stop the auto-pause. `[E]` ~20 min + a €/$ decision.**
  The backend project (`clear-product` org, ref `ckpxikyhdwhetykdpnzd`) is on the **free** plan.
  It was found **paused** today. Free-tier Supabase **auto-pauses after 7 days of inactivity** —
  which, for a pre-launch app with no traffic, means it will keep pausing itself and every
  signup/login/report will fail intermittently. This is a launch blocker, not a nicety.
  - **Recommended:** upgrade the org to **Supabase Pro (~$25/mo)**. It removes auto-pause, adds
    daily backups and real resource limits, and is the right posture for anything taking money.
    (Supabase dashboard → the `clear-product` org → Billing → upgrade to Pro.)
  - **Stopgap only if you truly want to stay free a while longer:** a keep-alive (a scheduled
    ping every few days so the project never idles out). It avoids the pause but gives you no
    backups and still throttles you — not acceptable once real customers exist.
  - **Do this first.** Every step below assumes the backend is up.

- [ ] **D0.2 — Brevo sender domain authentication. `[E]` ~20 min + DNS propagation.**
  Auth emails (the magic link that *is* the signup) and any transactional/marketing mail need to
  actually land, not go to spam. Authenticate the sending domain in **Brevo**: add the SPF and
  DKIM DNS records Brevo gives you at your DNS host, and verify the sender. If the app's magic
  links are sent via custom SMTP (Brevo) rather than Supabase's rate-limited default, this is also
  what makes login reliable at volume. Verify a test email lands in a real inbox, not spam.

- [ ] **D0.3 — Verify the frontend + free signup end-to-end. `[E]` ~30 min.**
  On **clear-framework.com**, as a real new user (use a personal email, not your admin one):
  1. Load the site and the `/product` page — confirm it's live and current.
  2. Go to `/signup`, enter the email, and confirm the **magic link arrives** (check spam) and
     logs you in.
  3. Create a project, add a challenge, and **run the free teaser** — confirm it produces a real
     Clarify + Leverage teaser, not an error.
  4. Open the **public sample** at `/product/sample` (this is what your posts link to) and confirm
     it renders.
  If any step fails, that's the launch blocker — fix it before announcing anything.

- [ ] **D0.4 — Set the model matrix (report quality). `[E]` ~15 min, or confirm the merged default.**
  Production currently falls back to the **cheap model (Haiku 4.5)** for every phase "while we
  verify e2e," but the reports were designed and priced for a **Sonnet-class** matrix
  (`docs/unit-economics.md`, ROADMAP A3). Thin-feeling reports are your #1 stated worry — this is
  often the cause. Either:
  - set the four edge-function secrets to the target models:
    `supabase secrets set CLARIFY_MODEL=… LEVERAGE_MODEL=… EXPERIMENT_MODEL=… RESEARCH_MODEL=…`
    (the `.env.example` targets are `claude-sonnet-4-6`; `claude-opus-4-8` is the flagship option),
    and set the GitHub Actions `RESEARCH_MODEL` variable to match; **or**
  - if a merge has since changed the code default, **confirm** production is running the intended
    models before selling.
  Re-run one report after changing this and read it — it should be visibly better.

---

## Day 1 — Open the Founding Partner sale (Path A)

*Take the first €200 safely. This is the launch goal. It's a concierge sale Erik fulfills by hand,
so it can open ahead of the full self-serve billing gate — but it still moves real money, so it
gets a minimum legal posture.*

- [ ] **D1.1 — Activate Stripe live mode. `[E]` ~30–60 min + Stripe review time.**
  In the **Stripe dashboard**, complete business activation for **Erik Bohjort Consulting AB**:
  business details, representative, and the **bank account** for payouts. Stripe may take a short
  time to review. Live mode is required before any real card can be charged (both paths need it).

- [ ] **D1.2 — Create the €200 Founding Partner Payment Link. `[E]` ~15 min.**
  In Stripe (live mode) → **Payment Links** → create a link for a **€200 one-off** "Founding
  Partner Report" product. Turn on receipt emails. Then paste the URL into
  **`content/launch/founding-customer-offer.md`** where it says `[STRIPE PAYMENT LINK]`, and into
  the LinkedIn offer post / outreach templates as needed. This is a *separate* product from the
  self-serve €99 Report Pass — it does not touch the app's billing config or webhooks.

- [ ] **D1.3 — Minimum legal posture for taking concierge money. `[E+counsel]` ~30 min Erik-side.**
  You're about to charge EU customers and process their documents. Before the first sale:
  - Make the **happiness guarantee + refund terms explicit** in the offer one-pager (14-day, full
    money-back). This is your published refund stance for this product — counsel should glance at
    it against `legal/drafts/refund-cancellation-policy.md`.
  - Ask counsel for a quick read of the **one-pager's claims** (you're a licensed psychologist —
    keep credential claims accurate and don't name the pension-company client).
  - Execute **DPAs with the processors that touch a partner's data in fulfillment** — at minimum
    **Supabase** (storage/DB) and **Anthropic** (inference). The full five-vendor set is a Path B
    gate (below), but these two are live the moment you run a real challenge through the app.

- [ ] **D1.4 — Test the money path once, for real. `[E]` ~15 min.**
  Buy your own Founding Partner link with a real card, confirm the receipt, then **refund it** in
  Stripe (Payments → the charge → Refund → full). This proves both the charge *and* the refund
  flow you promise in the guarantee work before a customer relies on them.

---

## Week 1 — Open self-serve paid EU sign-ups (Path B)

*The automated path. Hard-gated on the legal Tier-0 items (G2) and money-path integrity (G1, which
is already merged). Do the legal work first; the Stripe go-live is quick once it's cleared.*

- [ ] **W1.1 — Close legal Tier-0 (the G2 gate). `[E+counsel]` — external timeline.**
  From `legal/REMEDIATION-CHECKLIST.md`, Tier 0. **No paid EU self-serve sign-up until these are
  done.** The Erik/counsel-owned pieces:
  - Counsel-**finalize and publish** the **Privacy Policy**, **Terms of Service**, and
    **Refund/Cancellation policy** (drafts exist in `legal/drafts/`).
  - **Execute DPAs with all five subprocessors**: Supabase, Anthropic, Stripe, Brevo, Google.
  - **Name and publish a DSR intake address** and put the manual `legal/records/dsr-runbook.md`
    into operation (the support playbook routes to it).
  - Confirm **VAT/OSS + Stripe Tax** with an accountant; the app must show **EUR, VAT-inclusive**
    prices (today it shows `$`).
  - Reconcile the **"processed in the EU" claim** against the Anthropic (US) transfer — fix any
    marketing copy that overstates EU-only processing.
  The code-side companions (ToS acceptance gate, EUR/VAT display, respondent-portal notice,
  "AI-generated" label) are `[C]` roadmap items C1–C3 — but the sign-offs above are yours.

- [ ] **W1.2 — Stripe self-serve go-live (ROADMAP C5). `[E+C]` ~45–60 min. Gated on W1.1.**
  Once G1 (done) + G2 (W1.1) are clear:
  1. Run `scripts/stripe-setup.mjs` with a **live** key and the live webhook URL
     (`https://ckpxikyhdwhetykdpnzd.supabase.co/functions/v1/stripe-webhook`). It creates the
     Solo/Team/Pass prices (lookup keys `clear_solo_7900`, `clear_team_24900`, `clear_pass_9900`)
     and the webhook endpoint, and prints the env values.
  2. Set the **edge secrets** (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_SOLO`,
     `STRIPE_PRICE_TEAM`) and the **GitHub Actions variables** (`VITE_STRIPE_PRICE_SOLO/TEAM/UNLOCK`,
     `VITE_STRIPE_PUBLISHABLE_KEY`, `VITE_BILLING_ENABLED=true`).
  3. Do **one real end-to-end purchase** (buy a Report Pass on the live self-serve flow), confirm
     the report unlocks, then **refund it**. Until this passes, displayed and charged prices can
     diverge (pricing memo §8) — don't open the tier.

- [ ] **W1.3 — Configure the Google OAuth provider. `[E+C]` ~30 min. (Can move to Day 1.)**
  The **"Continue with Google"** button already ships in the login UI and **errors until the
  provider is configured** — so either configure it or the button is a broken promise. Per PR #47's
  checklist:
  1. In **Google Cloud Console**, create an OAuth 2.0 client; set the authorized redirect URI to
     the **Supabase auth callback** (`https://ckpxikyhdwhetykdpnzd.supabase.co/auth/v1/callback`)
     and the site URL to `clear-framework.com`.
  2. In **Supabase → Authentication → Providers → Google**, paste the **client ID + secret** and
     enable it.
  3. Test: click "Continue with Google" on `/login` and confirm it completes to `/auth/callback`
     and lands you in `/app`.
  Magic-link login works without this, so it's not a blocker — but the button shouldn't be visible
  and broken. If you can't do it now, the faster fix is to hide the button until it's ready
  (`[C]` can do that).

---

## Go / no-go order (what must precede what)

```
D0.1 Supabase un-paused/upgraded ─┐
D0.2 Brevo sender auth ───────────┼─► D0.3 free signup works e2e ──┐
                                  │                                 ├─► ANNOUNCE (LinkedIn + outreach → free teaser + sample)
D0.4 Model matrix set ────────────┘                                 │
                                                                    │
D1.1 Stripe live active ─► D1.2 €200 Payment Link ─► D1.4 test buy+refund ─┐
D1.3 Min legal posture (guarantee + 2 DPAs + claims read) ─────────────────┼─► OPEN FOUNDING PARTNER SALE (Path A)
                                                                            │
G1 money-path (already merged) ─┐
W1.1 Legal Tier-0 complete ─────┴─► W1.2 Stripe self-serve go-live ─► OPEN SELF-SERVE PAID EU SIGN-UPS (Path B)
W1.3 Google OAuth (or hide the button) — anytime, not a gate
```

**In words:**
1. **Backend up + emails deliver + reports are good** (D0.1–D0.4) before you announce anything.
   The launch content points at the free teaser and the sample — those must work.
2. **Announce** (start the LinkedIn series and outreach) as soon as Day 0 is green. You do **not**
   need billing live to start filling the pipeline; the CTA is "message me / free teaser / sample."
3. **Open the Founding Partner sale** (Path A) once Stripe is live, the €200 link exists and has
   been test-charged-and-refunded, and the minimum legal posture is in place. This is the fastest
   route to the goal — a happy €200 buyer.
4. **Open self-serve paid EU sign-ups** (Path B) **only after** legal Tier-0 is closed and the
   live Stripe self-serve flow has passed a real purchase-and-refund. Never before.
5. **Google OAuth** is polish — configure it, or hide the button. It gates nothing.
