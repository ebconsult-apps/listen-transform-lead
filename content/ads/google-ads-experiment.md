# Google Ads Experiment — Self-Serve CLEAR

**Budget:** €300–€500 total · **Channel:** Google Search only · **Market:** English / international
**Landing page:** `/product` · **Owner:** Erik · **Status:** ready to launch, not yet run

> **Numbers discipline.** Every CPC, rate, and click estimate in this document is labelled
> `[Estimate]` with the reasoning behind it. None of them come from CLEAR's own account — there is no
> historical ad data. The only hard numbers here are prices (`src/config/billing.ts`), the GA4
> property ID, and the database schema. Replace estimates with Keyword Planner figures before
> launch, and with real data after week 1.

---

## 1. What this experiment is actually asking

The question the owner wants answered is:

> *Can cold intent traffic → free signup → teaser → paid report?*

That is four conversion steps. **A €300–€500 budget cannot answer all four.** It can answer the
first one well, the second one directionally, and the third and fourth not at all. Being honest
about this up front is what makes the result usable.

| # | Step | Can €400 answer it? | Why |
|---|---|---|---|
| 1 | Does anyone search for this, and will they click? | **Yes** | Impressions + CTR need hundreds of impressions, not hundreds of conversions. Cheap to observe. |
| 2 | Does a cold clicker create a free account? | **Directionally** | ~50–200 clicks (§3) distinguishes "roughly zero" from "roughly 5%". It cannot distinguish 3% from 8%. |
| 3 | Does a signup reach a free teaser? | **Weakly** | Conditional on step 2. If there are 5 signups, teaser rate is measured on n=5. |
| 4 | Does a teaser become a €99 sale? | **No** | At any plausible rate this experiment produces 0–1 purchases. Zero sales is the *expected* outcome and must not be read as a kill signal. |

**So the honest framing:** this is a **demand-detection and click-quality test on step 1–2**, not a
CAC test. It buys the answer to *"is there searchable demand for a self-serve behavioral-science
report, and do those searchers sign up?"* — which is the cheapest way to find out whether paid search
is even the right channel before committing real money. If the answer is "no search demand at all,"
that is a **valuable** result and it points at LinkedIn / demand generation instead
(see `content/ads/linkedin-ads-option.md`).

### What it informs in the pricing research

Relative to `docs/research/self-serve-pricing.md`:

- **H1 (buyer is the solo consultant / PMM / small agency, not enterprise procurement)** — partially
  testable. The *search terms report* shows the vocabulary real buyers use, and any signups' email
  domains show whether they are consultancies, in-house teams, or enterprises. This is the cheapest
  H1 evidence available today.
- **H4 (the free/teaser line gives away too much or the wrong parts)** — partially testable. If cold
  traffic signs up and generates teasers but never reaches the paywall, the teaser is the ceiling.
- **H2 (Report Pass is a front door that feeds subscriptions)** — **not testable here.** Needs paid
  volume this budget will not produce.
- **H3 (Team is a dead zone without team affordances)** — **not testable here.** Wrong segment
  entirely.

---

## 2. The funnel, and what is measurable today

The product funnel a paid click travels:

```
Google ad → /product → "Start free" → /signup (email) → magic link in inbox
   → /auth/callback → /app → /app/projects/new → Clarify → approve
   → Leverage teaser (free)  →  paywall  →  €99 Report Pass
```

Three data sources, with different blind spots:

| Funnel step | Source | Measurable? | Caveat |
|---|---|---|---|
| Impressions, clicks, CTR, CPC, spend | Google Ads | **Yes, exact** | The only exact numbers in this experiment. |
| Search terms that triggered ads | Google Ads → Search terms | **Yes** | Google hides low-volume terms. At this budget expect a lot of "other search terms". |
| Sessions / landing-page views by UTM | GA4 `G-0P6CY2BME8` | **Yes, but undercounted** | Consent-gated — see §7. |
| `/product` → `/signup` click-through | GA4 `page_view` per path | **Yes, undercounted** | `/signup` is `noindex` but does fire a page view. |
| **Signup completed** | GA4 `product_signup_complete` **(new, this PR)** | **Yes, undercounted** | Fires in `AuthCallback` when a new account lands. Also: the `profiles` table is exact ground truth. |
| Project created | Supabase `projects` | **Yes, exact** | No GA4 event — DB only. |
| **Teaser generated** | GA4 `product_teaser_generated` **(new, this PR)** + Supabase `runs` | **Yes** | GA4 undercounted; `runs where phase='leverage_teaser'` is exact. |
| **Paywall reached** | GA4 `product_paywall_viewed` **(new, this PR)** | **GA4 only, undercounted** | **There is no database record of a paywall view.** `project_unlocks` records only *purchases*. If a user declines cookies, their paywall view is invisible and unrecoverable. This is the weakest number in the funnel — treat it as a floor, never as a rate denominator. |
| €99 purchase | Supabase `project_unlocks` / `report_passes` + Stripe | **Yes, exact** | Also the only revenue truth. |
| **Which purchase came from which ad** | — | **No** | Attribution breaks at the magic link (§7). Match manually by signup timestamp vs click timestamp while volume is this low. |

### Ground-truth SQL (run in Supabase → SQL Editor)

Run these **before launch** to record a baseline, then weekly. Adjust the window to your test period.

```sql
-- Signups per day
select date_trunc('day', created_at) as day, count(*) as signups
from profiles
where created_at >= '2026-08-01'
group by 1 order by 1;

-- Projects created, and how far each got
select p.status, count(*)
from projects p
where p.created_at >= '2026-08-01'
group by 1;

-- Runs by phase — 'leverage_teaser' is the activation metric
select phase, count(*) as runs, count(distinct project_id) as projects
from runs
where created_at >= '2026-08-01' and status = 'done'
group by 1;

-- Purchases: one-off Report Passes vs credit spends
select origin, count(*), min(unlocked_at), max(unlocked_at)
from project_unlocks
where unlocked = true and unlocked_at >= '2026-08-01'
group by 1;
```

The funnel to report each week is: **clicks (Ads) → signups (`profiles`) → projects (`projects`) →
teasers (`runs`) → unlocks (`project_unlocks`)**. Ads gives the top, the database gives the rest,
GA4 fills in the middle steps that have no database row — and only GA4 can see the paywall.

---

## 3. Budget reality check — do this maths before spending anything

This is the single most important section. **€300 does not buy 500 clicks in this category.**

| Blended CPC `[Estimate]` | Clicks for €300 | Clicks for €500 |
|---|---|---|
| €2.00 | 150 | 250 |
| €4.00 | 75 | 125 |
| €6.00 | 50 | 83 |
| €10.00 | 30 | 50 |

At the blended €3–6 estimated in §5, **€300–500 buys roughly 50–170 clicks.** At €10–15/day that is
a 20–40 day run.

What that sample size can and cannot resolve, at a hypothetical 5% signup rate:

- **100 clicks, 0 signups** → by the rule of three, the true rate is below ~3% with 95% confidence.
  That is a real, actionable finding: a kill signal for this keyword set.
- **100 clicks, 5 signups** → the 95% confidence interval is roughly **1.6%–11%**. You know the funnel
  is alive. You do **not** know whether it is 2% or 10%, and the difference between those two is the
  difference between an unviable and a viable channel.
- **100 clicks, 5 signups, 0 purchases** → completely uninformative about purchase rate. Even a
  healthy 10% teaser→paid rate produces an expected 0.5 sales. **Do not kill the product over this.**

> **Consequence for the decision rules:** every gate below triggers on **euros spent**, never on a
> click count, and the thresholds are set where the sample size can actually support the call.

---

## 4. Decision rules

Three gates. Check at each spend level; do not check daily (daily noise at this volume will make you
change things at random, which destroys the experiment).

| Gate | Trigger | What you measure | KILL | ITERATE | SCALE |
|---|---|---|---|---|---|
| **G1 — Demand** | €75 spent *(≈ day 5–7)* | Total impressions; CTR | **< 300 impressions total** → there is no search demand at these terms. Pause. This is a channel finding, not a copy finding — go read the LinkedIn option. | **≥ 300 impressions but CTR < 2%** → demand exists, the ad or the keyword–intent match is wrong. Rewrite RSAs, tighten keywords, re-check at €150. | **CTR ≥ 4%** → intent match is good, continue unchanged. |
| **G2 — Click quality** | €200 spent | GA4 sessions on `/product` by UTM; engagement rate; `/signup` page views; signups in `profiles` | **Sessions arriving but ~0 reach `/signup`** *(< 3% of sessions)* → the ad promise and the landing page do not match. Pause the worst ad group. | **Some `/signup` views but no completed signups** → the leak is the magic-link email round trip, not the ads. Fix the funnel before spending more. | **Signup rate ≥ 4% of clicks** → let it run to G3. |
| **G3 — Verdict** | €400 spent, or 30 days | Full funnel: clicks → signups → projects → teasers | **0 signups** → cold search traffic does not convert here at any price you can afford. Stop paid search. | **1–4 signups** → signal exists, sample too small to act on. Either extend to €800 to tighten the estimate, or switch channel. Do not scale on this. | **≥ 5 signups AND ≥ 3 teasers generated** → the funnel works end-to-end on cold traffic. Now it is worth a real budget to measure CAC. |

### Supporting thresholds

- **CPC ceiling: €8.** Any keyword whose average CPC exceeds €8 gets paused or bid-capped. At €8,
  €400 buys 50 clicks and the experiment learns nothing. `[Estimate]` — this ceiling is derived from
  the sample-size maths in §3, not from a target CAC.
- **Signup-rate threshold: ≥ 4% of clicks.** Reasoning: a €99 one-off product with a free tier needs
  a decent top-of-funnel rate to survive a €3–6 CPC. At 4% signup and €4 CPC, cost per signup is
  €100 — already high for a €99 product, but survivable *if* signup→paid is strong. Below 4%, the
  arithmetic never closes. `[Estimate]`
- **Teaser-completion threshold: ≥ 50% of signups generate a teaser.** Reasoning: the free path from
  signup to teaser is three in-app steps with no payment. If more than half of signups do not get
  there, the product's activation flow — not the ads — is the binding constraint. `[Estimate]`
- **Purchases: no threshold.** Do not set one. See §3. Any purchase at all is a bonus data point,
  and its absence proves nothing.

### The result that is easiest to misread

**Cheap clicks with zero signups.** It is tempting to read this as "the ads worked, the product
failed". More often it means the keywords were informational (someone researching COM-B for an
essay), not commercial. Check the **search terms report** before blaming the product.

---

## 5. Campaign structure

**One campaign. Three ad groups by intent theme.** One campaign keeps the €10–15/day budget from
being split into unspendable fragments.

### Campaign settings

| Setting | Value | Why |
|---|---|---|
| Campaign type | Search | — |
| **Search Network partners** | **OFF** | Lower-quality inventory, no transparency. |
| **Display Network** | **OFF** | Google defaults this ON for search campaigns. It will silently eat most of a €10/day budget on irrelevant placements. **This is the single most common way a small test budget is wasted.** |
| Bidding | **Manual CPC** (no enhanced) | Smart Bidding needs ~15–30 conversions/month to work. This campaign will produce single-digit conversions. Automated bidding on that data is noise. |
| Daily budget | €10–15 | Google may spend up to 2× on a given day, averaging to budget over the month. Budget accordingly. |
| Locations | UK, Ireland, Netherlands, Sweden, Denmark, Norway, Germany, Australia | English-language ads to markets with high English business fluency. **Deliberately excludes US/Canada** — the most expensive English-language CPC market would consume the entire budget in one geo. Run US separately later if the concept validates. |
| Location option | **"Presence: People in your targeted locations"** | The default ("presence or interest") serves ads worldwide to anyone who merely mentions those places. |
| Languages | English | — |
| Ad rotation | Rotate indefinitely | At this volume Google's optimiser has no data to optimise on. |
| Ad schedule | All days | Not enough volume to justify dayparting. |

### Ad group 1 — Behavioral diagnosis (the method vocabulary)

**Theme:** people who already know the framework language. Smallest audience, best qualified,
cheapest clicks. `[Estimate]` CPC **€0.80–2.50** — reasoning: practitioner/academic vocabulary with
almost no commercial advertiser competition bidding against it.

```
[com-b analysis]
[com-b model analysis]
"com-b behaviour change"
[behaviour change wheel]
[behavior change wheel analysis]
[behavioural diagnosis tool]
"behavioural science analysis tool"
[behavioral barrier analysis]
```

**Risk to expect:** volume may be so low that Google shows "Low search volume" and the keyword goes
inactive. That itself is the §4/G1 finding.

### Ad group 2 — Change diagnostic & readiness (the commercial middle)

**Theme:** change practitioners looking for a diagnostic instrument or report. `[Estimate]` CPC
**€5–12** — reasoning: sits adjacent to the well-funded change-management software/consulting
category (Prosci, WalkMe, Whatfix and similar bid on these modifiers), so auction density is high.

```
[change management diagnostic]
[change readiness assessment]
[change management assessment tool]
"change management report"
[organisational change diagnostic]
"change management diagnostic tool"
[change impact assessment tool]
```

**Watch this one.** It is the most likely to blow the €8 CPC ceiling and drain the budget before the
other two ad groups get impressions. Cap bids at €6 here.

### Ad group 3 — Behavior change at work (the problem vocabulary)

**Theme:** people describing the problem rather than the method. `[Estimate]` CPC **€3–8** —
reasoning: overlaps HR-tech and CX-analytics advertisers, both of which bid moderately.

```
[employee behaviour change]
[employee behavior change program]
"changing employee behaviour"
[customer behaviour analysis tool]
"customer behaviour change"
[behaviour change intervention design]
"behavioural science consulting alternative"
[behaviour change consultancy alternative]
```

> **Note on the "consulting alternative" terms.** They are included because they capture buyers
> shopping away from a consultancy — exactly CLEAR's pitch. But they also attract buyers who want a
> *human* consultant, which is the consulting site's funnel, not this one. Watch the search terms
> report closely; if they pull in "hire a consultant" queries, move them out.

### Match types

Start **exact `[...]` and phrase `"..."` only. No broad match.** Broad match at €10/day with no
conversion history will spend the budget on Google's guesses. Add broad match only after the search
terms report proves the concepts are clean.

### Negative keywords (add as a shared account-level list)

```
jobs, job, careers, career, hiring, vacancy, vacancies, recruitment, recruiter, salary, internship,
graduate, trainee, "how to become",
course, courses, training, certification, certificate, diploma, degree, MBA, university, college,
school, student, students, "online course", udemy, coursera, "linkedin learning", cpd, webinar,
free, "free template", template, templates, "free download", "free tool", "free pdf", ppt,
powerpoint, "google slides", worksheet, checklist, cheatsheet,
"what is", definition, meaning, wikipedia, reddit, quora, "examples of", "pdf download",
thesis, dissertation, "literature review", "systematic review", "research paper", citation, apa,
"scholarly article", journal,
salary, freelance, "for students", "for essay",
prosci, adkar, kotter, mckinsey, "6 sigma", "six sigma", lean, agile, scrum, prince2
```

Reasoning for the academic block: "COM-B" and "behaviour change wheel" are heavily taught terms.
Without these negatives, ad group 1 will mostly serve students writing essays — clicks that can never
convert. Reasoning for the competitor-framework block: those searchers want that specific framework,
not an alternative one, and they are expensive.

Review the search terms report **weekly** and add negatives. At this budget, one bad query pattern
can consume 20% of the test.

---

## 6. Responsive Search Ad assets

Two RSAs, one per ad group (ad group 1 and 3 can share; ad group 2 gets its own with the
diagnostic framing). Google counts characters including spaces; `€` is one character.

**Voice rules applied:** no hype, no invented statistics, no unverifiable claims ("trusted by",
"#1", "leading"). Every claim is either a fact about the product or a fact about Erik. Prices are the
real ones from `src/config/billing.ts`.

### Headlines (max 30 characters)

| # | Headline | Chars |
|---|---|---|
| 1 | `Behavioral Science Report` | 25 |
| 2 | `COM-B Analysis, Self-Serve` | 26 |
| 3 | `Free Teaser, No Card` | 20 |
| 4 | `Built by a Psychologist` | 23 |
| 5 | `Behavior Change Analysis` | 24 |
| 6 | `Find the Real Barriers` | 22 |
| 7 | `See a Sample Report` | 19 |
| 8 | `€99 Full Report, One-Off` | 24 |
| 9 | `Not a Consultancy Retainer` | 26 |
| 10 | `From Challenge to Plan` | 22 |
| 11 | `Evidence, Not Hunches` | 21 |
| 12 | `Change Management Tools` | 23 |

Pin headline 1 or 5 to position 1 so every impression leads with what the thing *is*. Leave the rest
unpinned.

### Descriptions (max 90 characters)

| # | Description | Chars |
|---|---|---|
| 1 | `A behavioral-science report on your change challenge. Free teaser, no credit card.` | 82 |
| 2 | `COM-B barrier analysis, a systems map, and leverage points. Teaser free, €99 full.` | 82 |
| 3 | `Built on the COM-B model by a licensed psychologist. See a full sample report first.` | 84 |
| 4 | `Describe the behavior you need to change. Get a measurable objective in minutes.` | 80 |
| 5 | `Not a six-figure consultancy. One report, €99. Or monthly credits from €79.` | 75 |
| 6 | `See where the leverage is before you spend. The free teaser maps it for you.` | 76 |
| 7 | `Every claim flagged Verified, Assumption, or Gap — so you know what is solid.` | 77 |

### Assets to add

- **Sitelinks:** `See a sample report` → `/product/sample`, `Pricing` → `/pricing`,
  `How CLEAR works` → `/methodology`, `About Erik` → `/about`
- **Callouts:** `Free teaser`, `No credit card`, `Data stored in the EU`, `PDF & Markdown export`
- **Structured snippet** (Type: *Services*): `Clarify`, `Leverage`, `COM-B analysis`,
  `Experiment design`

> **Claims check.** "Data stored in the EU" and the Anthropic DPA line are already made on
> `/product` — the ad must not out-claim the landing page. Do **not** add callouts like "Trusted by
> 500 teams" or "Used by Fortune 500" — they would be fabrications.

---

## 7. Landing strategy

### Send every ad to `/product`, never the homepage

| | `/` (homepage) | `/product` |
|---|---|---|
| What it sells | Erik's consulting practice | The self-serve product |
| Primary CTA | Book a discovery call | **Start free** |
| Match to ad promise | Poor — the ad promises a report you run yourself | Direct |
| Prerendered to static HTML | Yes | **Yes** (`vite.config.ts` routes) |

A cold searcher who clicked "behavioral science report, free teaser" and lands on a page whose main
action is "book a 30-minute call with a consultant" has been mis-sold. That is both a conversion
problem and a Google **Ad Relevance / Landing Page Experience** problem, which raises CPC.

`/product` is prerendered, so it serves static HTML on first paint — good for Quality Score.

### `/product/sample` is the conviction asset, not the landing page

The sample report (`/product/sample?segment=...`) is the strongest thing CLEAR has for a cold
visitor: it shows the actual output — leverage priority map, systems map, full COM-B matrix — with no
signup. Link it from the ad as a **sitelink** and rely on the "See a full sample report" button
already on `/product`.

Do **not** make it the primary ad landing page: it is not in the prerender route list, so it renders
client-side only (slower first paint, weaker landing-page signal), and its own CTA already routes to
`/signup`.

Four segments exist (`?segment=`): `product-growth`, `people-culture`, `healthcare`,
`manufacturing`. If ad group 3 ever gets its own sitelink, point it at
`/product/sample?segment=people-culture`.

### UTM convention

**Enable auto-tagging** (`gclid`) in Google Ads — that is what actually joins Ads data to GA4. The
manual UTMs below are for readable GA4 landing-page reports and for the weekly spreadsheet; they do
not replace auto-tagging.

Set the **Final URL per ad group**:

| Ad group | Final URL |
|---|---|
| 1 — Behavioral diagnosis | `https://clear-framework.com/product?utm_source=google&utm_medium=cpc&utm_campaign=selfserve_intl_search&utm_content=comb_method` |
| 2 — Change diagnostic | `https://clear-framework.com/product?utm_source=google&utm_medium=cpc&utm_campaign=selfserve_intl_search&utm_content=change_diagnostic` |
| 3 — Behavior at work | `https://clear-framework.com/product?utm_source=google&utm_medium=cpc&utm_campaign=selfserve_intl_search&utm_content=behavior_at_work` |

Then set one **campaign-level Final URL suffix** so the query lands in GA4 too:

```
utm_term={keyword}
```

**Convention, so future channels stay comparable:**

| Parameter | Value | Rule |
|---|---|---|
| `utm_source` | `google` | The platform. |
| `utm_medium` | `cpc` | `cpc` for paid search, `paid_social` for LinkedIn. |
| `utm_campaign` | `selfserve_intl_search` | `{product}_{market}_{channel}`. Consulting-site campaigns keep their own `de_change_mgmt` style names — never reuse one across the two funnels. |
| `utm_content` | ad group theme | Lowercase snake_case, matches the ad group name. |
| `utm_term` | `{keyword}` | ValueTrack; auto-filled by Google. |

### The attribution break you cannot fix

Signup is passwordless: the user submits an email on `/signup`, **leaves for their inbox**, and
returns via a magic link. That return is a fresh landing with no UTM parameters.

- GA4's user-scoped attribution normally carries the campaign through (last non-direct click within
  the lookback window), so the conversion should still credit the ad **if** the user returns in the
  same browser with analytics consent granted.
- Session-scoped reports will split the journey across two sessions, one of which looks direct.
- If the user opens the magic link on a **different device** (phone inbox, desktop signup), the
  chain breaks completely and the signup is unattributable.

**At this volume, do not fight this.** Reconcile manually: compare click timestamps in Google Ads
against `profiles.created_at` in Supabase. With fewer than ten signups that is a five-minute job and
more reliable than any attribution model.

### Consent gating — read this before trusting any GA4 number

`index.html` loads gtag.js with **Consent Mode v2, all storage defaulting to `denied`**.
`CookieConsent.tsx` upgrades to `granted` only when the visitor clicks **Accept**.

The three new product events ride exactly this gate — they add no tracking that the existing `lead_*`
events do not already do. But the consequence for this experiment is real:

- Visitors who **decline** or ignore the banner are not measured in GA4 in the normal way.
- Google's **behavioural modelling** fills that gap only above traffic thresholds this experiment
  will not reach. At 50–200 clicks, assume **no modelling**.
- `[Estimate]` Expect GA4 to see materially fewer signups than the database does. European consent
  rates vary far too much to put a number on; **measure your own** by comparing
  `product_signup_complete` in GA4 against `count(*) from profiles` for the same window. That ratio
  *is* your consent rate, and it is worth knowing.

**Therefore: the database is the scoreboard, GA4 is the diagnostic.** Never report a funnel rate
whose denominator is a consent-gated GA4 number and whose numerator is a database count.

> **Open Tier-1 legal item.** `legal/REMEDIATION-CHECKLIST.md` still lists **granular cookie
> consent** (separating analytics from advertising, plus a persistent "Cookie settings" control) as
> outstanding. This experiment does not change that posture — no new pre-consent tracking was added —
> but running *advertising* traffic makes the ad-storage/analytics-storage distinction materially
> more relevant. Worth closing before scaling spend, and required before adding any remarketing tag.

---

## 8. Erik's setup checklist

**~47 minutes hands-on, split across two days.** Steps 1–4 must happen a day before launch: a GA4
key event can take up to 24 hours to become importable into Google Ads.

### Day 1 — plumbing (20 min)

| # | Step | Where | Time |
|---|---|---|---|
| 1 | Create the Google Ads account; set billing (country + currency **EUR** — cannot be changed later); skip the "Smart campaign" wizard by choosing **"Switch to Expert Mode"** | ads.google.com | 10 min |
| 2 | Link Google Ads to GA4 property `G-0P6CY2BME8`, and **enable auto-tagging** | Google Ads → Tools → Linked accounts → Google Analytics (GA4) | 2 min |
| 3 | Mark **`product_signup_complete`** as a key event. If it is not in the events list yet (it appears only after the first real signup), use **Admin → Key events → New key event** and type the name manually | GA4 Admin | 3 min |
| 4 | Create the conversion action: **New conversion action → Import → Google Analytics 4 properties → Web → `product_signup_complete`**. Set Category **Sign-up**, Count **One**, and leave it as the campaign's primary conversion — but **do not** switch to conversion-based bidding | Google Ads → Goals → Conversions | 5 min |

> **Option A vs Option B.** This uses **Option A (GA4 import)** from `content/next-steps-plan.md` —
> no code changes, no conversion labels. `GOOGLE_ADS_ID` and `CONVERSION_LABELS` in
> `src/config/site.ts` stay as placeholders, and `trackGoogleAdsConversion()` stays a no-op. Option B
> (native tags + Enhanced Conversions) is better attribution, but it is not worth wiring for a €400
> test — revisit it only if §4/G3 says SCALE.
>
> Optionally also import the six existing `lead_*` key events. They belong to the *consulting*
> funnel, so keep them as **Secondary** conversions on this campaign — otherwise a whitepaper
> download will look like a product signup.

### Day 2 — the campaign (27 min)

| # | Step | Time |
|---|---|---|
| 5 | New campaign → Objective **"Create a campaign without a goal's guidance"** → **Search**. Uncheck **Search partners** and **Display Network**. Set locations (§5) and **Presence** targeting. Bidding: **Manual CPC**. Budget €10–15/day | 8 min |
| 6 | Create the three ad groups; paste keywords from §5; set max CPC — €2.50 (AG1), €6.00 (AG2), €5.00 (AG3); set the per-ad-group Final URLs from §7 | 8 min |
| 7 | Build the RSAs from §6; add sitelinks, callouts, structured snippets | 8 min |
| 8 | Add the negative keyword list (§5) as a **shared list** at account level, applied to the campaign; set the campaign Final URL suffix `utm_term={keyword}` | 3 min |
| 9 | **Before enabling:** re-check that Display Network is off and the daily budget reads €10–15, not €100 | — |

### Then, weekly (15 min)

1. Search terms report → add negatives for anything irrelevant.
2. Record in the tracking spreadsheet: spend, impressions, clicks, CTR, avg CPC.
3. Run the §2 SQL → signups, projects, teasers, unlocks.
4. Check the §4 gate for the spend level reached. **Change one thing at most.** At this volume,
   changing several things at once means the result is uninterpretable.

---

## 9. What to do with each outcome

| Outcome at €400 | Read | Next move |
|---|---|---|
| < 300 impressions | The category has no search demand under these terms | Stop paid search. The buyer does not know to look for this — that is a demand-generation problem. Go to `content/ads/linkedin-ads-option.md`. |
| Impressions, low CTR | Demand exists, message is off | One more round at €200 with rewritten RSAs before judging the channel. |
| Clicks, no signups | Wrong traffic, or the landing page does not carry the promise | Check search terms first. If terms are clean, the leak is `/product` → `/signup`. |
| Signups, no teasers | Ads work; activation does not | Product problem, not a channel problem. Look at the magic-link round trip and the Clarify→approve→Leverage path. |
| Signups and teasers, no sales | **The expected outcome.** Proves nothing about pricing | Fund a larger round to measure CAC. This is the good result. |
| ≥ 5 signups, ≥ 3 teasers | Cold search traffic completes the free funnel | Scale to €30–50/day, add the US as a separate campaign, and only then revisit Option B tagging. |

---

## 10. Assumptions and gaps

Tracked honestly, in the CLEAR house style.

| Item | Status |
|---|---|
| All CPC figures in §5 | `[Assumption]` — category reasoning only. **Replace with Google Keyword Planner data before launch** (free, inside the Ads account, Tools → Keyword Planner). |
| Search volume for COM-B terms is small | `[Assumption]` — plausible from the vocabulary being practitioner-specific, unverified. |
| 4% signup-rate threshold | `[Assumption]` — derived from CPC arithmetic against a €99 price, not from observed behaviour. |
| 50% teaser-completion threshold | `[Assumption]` — no baseline exists; the product has no historical funnel data. |
| GA4 undercount vs database | `[Gap]` — real magnitude unknown until measured. The GA4-vs-`profiles` ratio in §7 closes this. |
| Paywall-view rate | `[Gap]` — no database record exists; GA4-only and consent-gated. Cannot be made exact without a product analytics event stored server-side (roadmap B5). |
| Which purchase came from which click | `[Gap]` — attribution breaks at the magic link. Manual timestamp matching only. |
| Whether the €99 price is right | `[Gap]` — out of scope here; needs the pricing work in `docs/research/self-serve-pricing.md` §7. |
