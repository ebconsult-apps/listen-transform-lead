# LinkedIn Ads — the alternative channel, on one page

**Purpose:** so the owner picks a paid channel with eyes open, rather than defaulting to Google
because it is cheaper per click. Companion to `content/ads/google-ads-experiment.md`.

> Same numbers discipline: every figure below is `[Estimate]` with reasoning, or `[Check]` where it
> must be verified in-platform. CLEAR has no LinkedIn ad history.

---

## 1. The trade in one line

**Google search buys existing demand. LinkedIn buys attention from a defined job title.**

CLEAR's problem is that its category may not have search demand — nobody wakes up and Googles
"self-serve COM-B report". They *do* have the underlying problem, and they *do* have a job title.
That is the entire case for LinkedIn.

---

## 2. Cost reality — LinkedIn is 2–5× Google, and the floor is high

| | Google Search `[Estimate]` | LinkedIn Sponsored Content `[Estimate]` |
|---|---|---|
| CPC | €3–6 blended | **€6–15**, senior/small audiences at the top of that |
| CPM | — | €25–60 |
| Clicks for €400 | 65–130 | **25–65** |
| Minimum daily budget | none meaningful | **~€10/day per campaign** `[Check]` |
| Minimum audience size | n/a | **300 members** |

**Reasoning for the CPC range:** LinkedIn prices on the scarcity of the targeted professional, not
on query intent. Narrowing to *Director+ in HR/L&D across a handful of European markets* is a small,
heavily-contested audience — every HR-tech vendor bids for it. The tighter the ICP, the higher the
CPC, which is the opposite of how it feels like it should work.

**The consequence is brutal at this budget.** €400 on LinkedIn buys perhaps 25–65 clicks. Section 3
of the Google plan already showed that 50–170 clicks is too thin to measure a signup rate. **25–65
clicks cannot measure a conversion rate at all.** A LinkedIn test at €300–500 can only answer
*"does this audience find the message interesting enough to click?"* — a CTR and CPM question, not a
funnel question.

---

## 3. When LinkedIn would beat Google search

Run LinkedIn **instead of** Google if any of these hold:

1. **Google Gate G1 fails.** Fewer than ~300 impressions on the Google test means the search demand
   is not there. That is not a reason to give up on paid — it is a reason to switch from capturing
   demand to creating it. *This is the most likely trigger, and the strongest argument in this
   document.*
2. **You need to know who the buyer is, not just whether they convert.** LinkedIn reports
   demographics on everyone who saw and clicked: job function, seniority, company size, industry.
   That is direct evidence for **H1** in `docs/research/self-serve-pricing.md` (is the buyer a solo
   consultant / small agency, or enterprise?) — evidence Google search cannot produce. For H1
   specifically, LinkedIn is the better instrument even at 5× the CPC.
3. **The asset is the argument.** CLEAR's strongest cold-traffic asset is the sample report. A
   LinkedIn **Document Ad** puts a sample in the feed and gets read without a click-out — a format
   Google Search has no equivalent for.
4. **You want the consulting funnel too.** LinkedIn reaches the same HR/transformation leaders who
   buy Erik's consulting. A click that does not buy a €99 report may still book a discovery call.
   Google's product keywords do not overlap that way.

## 4. When it would not

- **You need conversion data cheaply.** At €10/click you cannot afford enough clicks to see a funnel.
- **You need it this month.** LinkedIn creative needs iteration; a single image ad rarely works first
  try, and each iteration costs more than a Google iteration.
- **Budget is the binding constraint.** If €400 is genuinely all there is, Google's cheaper clicks
  produce more learning per euro on *whether the funnel works*. LinkedIn produces more learning per
  euro on *who the buyer is*. Pick which question matters more.

---

## 5. Minimal test spec

Only run this if the question is *"does this ICP respond to the message?"* — not *"what is our CAC?"*

| Setting | Value | Reasoning |
|---|---|---|
| Objective | **Website visits** | Not Lead Gen Forms: those produce an email address, which tests nothing about the product funnel. The whole point is to see whether they reach `/product` and sign up. |
| Format | **Single image ad** + **Document ad** (2 variants) | The document ad carries the sample report; the single image is the control. |
| Bidding | **Manual CPC**, bid at the low end of the suggested range | LinkedIn's automated bidding will spend the full daily budget regardless of efficiency. |
| Budget | **€15/day × 20 days = €300** | Below €15/day, delivery is too thin to learn anything within a month. |
| Audience Network | **OFF** | Off-platform inventory at LinkedIn prices. Same reasoning as Google's Display Network. |
| Geography | UK, Ireland, Netherlands, Sweden, Denmark, Norway, Germany | Matches the Google test, so the two are comparable. |
| Job function | Human Resources, Consulting, Operations, Program & Project Management | The four functions that own behavior-change programmes. |
| Seniority | Manager, Director, VP, Owner | Excludes students and entry level, which is most of the waste. |
| Company size | 51–200, 201–1000, 1001–5000 | Skips micro-companies (no budget) and enterprises (procurement, wrong funnel per H1). |
| Exclusions | Students, "Education" industry, current employees | — |
| Frequency | Check audience size is **≥ 50,000** | Smaller than that and €300 will hit the same people repeatedly, and CPC climbs. |

**Landing page:** `/product`, same as Google, with UTMs following the same convention:

```
https://clear-framework.com/product?utm_source=linkedin&utm_medium=paid_social&utm_campaign=selfserve_intl_li&utm_content=doc_ad
```

(`utm_content`: `doc_ad` or `single_image`.)

**Creative angle** — the same honest voice as the Google RSAs, but LinkedIn rewards specificity over
keywords. Lead with the sample report, not the price. Do not use the word "revolutionary", do not
invent customer counts, and do not imply clients CLEAR does not have.

`[Check]` **Message / Conversation Ads** have been restricted for EU-based audiences. Verify
availability in-platform before planning around that format — do not build a test on it.

---

## 6. Decision rules

Different from Google's, because the measurable outcome is different.

| Gate | Trigger | KILL | CONTINUE |
|---|---|---|---|
| **L1 — Attention** | €100 spent | CTR < 0.35% `[Estimate]` — the message does not land on this audience at all | CTR ≥ 0.45% `[Estimate]` — worth the remaining budget |
| **L2 — Audience fit** | €200 spent | Demographics show the clicks come from the wrong functions/seniority | The demographic report matches the ICP → **this is the H1 evidence, and it is worth the spend on its own** |
| **L3 — Verdict** | €300 spent | 0 signups **and** poor demographics | Any signups, or a clean ICP match → the audience exists; the question becomes cost, not existence |

**Do not set a CAC threshold.** 25–65 clicks cannot produce one. `[Estimate]` CTR benchmarks for
LinkedIn Sponsored Content sit broadly in the 0.4–0.6% range; the thresholds above are set around
that, and should be replaced with LinkedIn's own in-account benchmark once the campaign is live.

---

## 7. Tracking caveats specific to LinkedIn

- **The LinkedIn Insight Tag is not installed** on the site (verified: no `snap.licdn.com` reference
  anywhere in `index.html` or `src/`). Without it there is no LinkedIn-side conversion tracking and
  no retargeting pool — all measurement is UTM + GA4 + the Supabase counts, exactly as in the Google
  plan §2.
- **Do not add the Insight Tag yet.** It is an advertising tracker, and
  `legal/REMEDIATION-CHECKLIST.md` still lists **granular cookie consent** (separating analytics from
  advertising) as an open Tier-1 item. Adding an advertising tag before that ships would make the
  gap materially worse, not cosmetically. Close the consent item first; then the tag is a
  five-minute job that also unlocks retargeting — which is where LinkedIn actually gets efficient.
- **The magic-link attribution break applies identically** (Google plan §7). Reconcile manually
  against `profiles.created_at`.

---

## 8. Recommendation

**Run Google first, as specified — but treat its Gate G1 as the real decision point.**

Google's €400 buys 2–3× more clicks, which is the only way this budget gets near a funnel
measurement, and it answers the cheaper question first: *is anyone searching?* If G1 fails on
impressions, that is not a failed experiment — it is the finding that redirects the next €300 to
LinkedIn with a clear rationale, and with a much better idea of what to say.

**Do not run both at once on €500 total.** Split across two channels, neither reaches a sample size
that supports a decision, and you will have spent the budget to learn nothing twice.
