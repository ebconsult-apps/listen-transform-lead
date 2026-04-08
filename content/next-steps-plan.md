# Next Steps Plan — EB Consulting Go-to-Market

Everything below is sequenced by dependency. Each section says who does it (Erik or Claude), what exactly to do, and what "done" looks like.

---

## SPRINT 0: INSTRUMENTATION (This Week)

### 1. Replace Google Ads Conversion Placeholders
**Who:** Erik (5 minutes per conversion action)
**Status:** Code is deployed with placeholder `AW-XXXXXXXXX/...` labels

**Steps:**
1. Log into Google Ads (ads.google.com)
2. Go to Goals → Conversions → New conversion action → Website
3. Create 6 conversion actions:

| Name | Category | Count |
|------|----------|-------|
| Contact Form | Submit lead form | One per click |
| Book Interest | Submit lead form | One per click |
| Assessment Report | Submit lead form | One per click |
| Whitepaper Download | Submit lead form | One per click |
| Free Chapter | Submit lead form | One per click |
| Consultation Request | Submit lead form | One per click |

4. For each action, Google gives you a conversion ID + label (format: `AW-123456789/AbCdEfGh`)
5. Send me all 6 ID/label pairs and I'll replace the placeholders in the code, or find-and-replace yourself:

| File | Placeholder to replace |
|------|----------------------|
| `src/pages/Contact.tsx` | `AW-XXXXXXXXX/CONTACT_FORM` |
| `src/pages/GetTheBook.tsx` | `AW-XXXXXXXXX/BOOK_INTEREST` |
| `src/components/AssessmentResults.tsx` | `AW-XXXXXXXXX/ASSESSMENT_REPORT` |
| `src/components/WhitepaperGate.tsx` | `AW-XXXXXXXXX/WHITEPAPER` |
| `src/components/FreeChapterForm.tsx` | `AW-XXXXXXXXX/FREE_CHAPTER` |
| `src/components/LeadForm.tsx` | `AW-XXXXXXXXX/CONSULTATION` |

6. Enable Enhanced Conversions: Google Ads → Goals → Settings → Enhanced conversions for web → Turn on → Select "Google tag"

**Done when:** All 6 conversion actions fire real events in Google Ads, Enhanced Conversions is enabled.

---

### 2. Link Google Ads to GA4
**Who:** Erik (2 minutes)

1. In Google Ads: Tools & Settings → Linked accounts → Google Analytics (GA4) → Link
2. Select the `G-0P6CY2BME8` property
3. Enable auto-tagging

**Done when:** Google Ads shows as a linked account in GA4 Admin → Product Links.

---

### 3. Verify Google Search Console
**Who:** Erik (5 minutes)

1. Go to search.google.com/search-console
2. Add property → URL prefix → `https://clear-framework.com`
3. Verify via DNS TXT record (easiest with Hostup) or HTML file upload
4. Once verified, go to Sitemaps → Submit `https://clear-framework.com/sitemap.xml`

**Done when:** Search Console shows "Sitemap submitted" and starts indexing pages.

---

### 4. Record Baseline Metrics
**Who:** Erik (15 minutes)

Open GA4 and record these numbers for the current week (before any ads run):

| Metric | Where to find it | Current value |
|--------|-----------------|---------------|
| Weekly sessions | Reports → Engagement overview | ___ |
| Sessions by source | Reports → Acquisition → Traffic acquisition | ___ |
| Homepage bounce rate | Reports → Engagement → Pages → filter `/` | ___ |
| Contact form submissions | Events → `form_submission` | ___ |
| Assessment starts | Events → `page_view` → filter `/assessment` | ___ |
| Assessment email gates | Events → `form_submission` → filter `assessment_report` | ___ |
| Book interest signups | Events → `form_submission` → filter `book_preregistration` | ___ |

Save these in a spreadsheet. They're the baseline Sprint 2 will compare against.

---

### 5. Create UTM Tracking Spreadsheet
**Who:** Erik (10 minutes)

Create a Google Sheet with this structure:

**Tab 1: Campaign Tracker**
| Date | Channel | Campaign | Spend (EUR) | Clicks | Leads | Calls Booked | Cost/Lead | Notes |
|------|---------|----------|-------------|--------|-------|-------------|-----------|-------|

**Tab 2: LinkedIn Content Tracker**
| Date | Post # | Topic | Impressions | Reactions | Comments | Profile visits | Link clicks | Notes |
|------|--------|-------|-------------|-----------|----------|---------------|------------|-------|

**Tab 3: Referral Tracker**
| Date sent | Recipient | Organization | Response (Y/N) | Intro made (Y/N) | Lead quality | Outcome |
|-----------|-----------|-------------|----------------|-------------------|-------------|---------|

---

## SPRINT 1: PARALLEL LAUNCH (Weeks 1-2)

### Experiment 1: Google Ads
**Who:** Erik
**Budget:** EUR 50/day (EUR 700 for 2 weeks)
**Goal:** Determine if change management keywords in Germany generate leads at < EUR 200/lead

**Campaign setup:**

1. Create campaign: "DE - Change Management - Search"
   - Network: Search only (uncheck Display partner)
   - Location: Germany
   - Language: German + English
   - Bidding: Manual CPC
   - Daily budget: EUR 50

2. Create 3 ad groups with exact match keywords:

**Ad Group 1: Change Management** (EUR 25/day)
```
[change management consulting]
[change management consultant]
[organizational change consultant]
[organizational change management]
[change management beratung]
```
Landing page: `https://clear-framework.com/lp/change-management?utm_source=google&utm_medium=cpc&utm_campaign=de_change_mgmt&utm_content=change_management`

**Ad Group 2: Leadership** (EUR 15/day)
```
[leadership development consultant]
[leadership development program]
[executive coaching consultant]
[führungskräfteentwicklung]
```
Landing page: `https://clear-framework.com/lp/leadership-development?utm_source=google&utm_medium=cpc&utm_campaign=de_change_mgmt&utm_content=leadership`

**Ad Group 3: Psychology/Assessments** (EUR 10/day)
```
[organizational psychology consultant]
[behavioral design consulting]
[psychometric assessments consulting]
[organisationspsychologie beratung]
```
Landing page: `https://clear-framework.com/lp/organizational-psychology?utm_source=google&utm_medium=cpc&utm_campaign=de_change_mgmt&utm_content=psychology`

3. Set max CPC bids:
   - Change management: EUR 6
   - Leadership: EUR 5
   - Psychology: EUR 4

4. Add Responsive Search Ads (minimum 2 per ad group):

**English ad:**
Headlines (use 10+, pick from these):
- `Psychology-Led Change Mgmt` (25 chars)
- `Licensed Psychologist` (21 chars)
- `Change That Actually Happens` (28 chars)
- `Stop Change Programs Failing` (28 chars)
- `The CLEAR Change Framework` (26 chars)
- `Evidence-Based Change Tools` (27 chars)
- `Behavioral Design Consulting` (28 chars)
- `Assessments That Work` (21 chars)
- `Book a Free Discovery Call` (26 chars)
- `Erik Bohjort | CLEAR` (20 chars)

Descriptions (use 4+):
- `70% of change initiatives fail. A licensed psychologist's framework makes yours succeed.` (89 chars)
- `Change management built on clinical psychology — not MBA theory. Book a discovery call.` (87 chars)
- `Psychology-backed consulting trusted by leading Nordic and international organizations.` (87 chars)
- `The CLEAR framework: behavioral science meets systems thinking. Free 30-min consultation.` (89 chars)

**German ad:**
Headlines:
- `Lizenzierter Psychologe` (23 chars)
- `Change Management Methode` (25 chars)
- `Warum Change scheitert` (22 chars)
- `Das CLEAR-Framework` (19 chars)
- `Psychologiebasiert` (18 chars)
- `Veränderung die wirkt` (21 chars)
- `Erstgespräch buchen` (19 chars)
- `Erik Bohjort | CLEAR` (20 chars)

Descriptions:
- `Lizenzierter Psychologe. Bewährtes Framework. Veränderung, die wirklich funktioniert.` (85 chars)
- `Kein Coach. Ein lizenzierter Psychologe für Organisationswandel. Jetzt Erstgespräch.` (84 chars)
- `Verhaltenspsychologie trifft Organisationsentwicklung. Kostenlose 30-Min-Beratung.` (82 chars)

5. Upload negative keywords (account level):
```
jobs, job, careers, career, hiring, vacancy, vacancies, employment,
salary, salaries, wage, wages, pay, compensation,
"how to become", intern, internship, graduate, trainee,
recruiter, recruitment, staffing, headhunter,
course, courses, certification, certificate, degree, diploma, MBA,
university, college, school, student, students,
online course, e-learning, Coursera, LinkedIn Learning, udemy,
free, template, templates, "free template", "free download",
PDF, ebook, "free ebook", tool, tools, "free tool",
checklist, guide, "free guide", DIY, "do it yourself",
"what is", definition, examples, Wikipedia, Reddit,
"case study", "case studies",
Kotter, ADKAR, Prosci, McKinsey
```

**Weekly check (every Monday):**
- Review search term report → add negatives for irrelevant queries
- Check CPC vs budget → adjust bids if underspending
- Check CTR → kill any ad group below 0.5% after 200+ impressions
- Check conversions → celebrate any form submission

**Kill criteria:** < 0.5% CTR OR zero form submissions after EUR 500 spend
**Scale criteria:** Any form submission at < EUR 150 cost-per-lead

---

### Experiment 2: LinkedIn Organic
**Who:** Erik
**Effort:** ~30 minutes per post
**Goal:** Determine if psychology-angle content generates engagement from HR/C-suite audience

1. Open `content/linkedin-posts.md` in the repo — 5 posts ready to copy-paste
2. Post schedule: Day 1, Day 3, Day 5, Day 8, Day 11 (5 posts across 2 weeks)
3. Post between 8-10 AM CET
4. After posting, engage: like and comment on 5-10 posts from HR leaders / OD professionals / C-suite executives in your feed
5. Reply to every comment on your posts within 2 hours

**Tracking (after each post):**
- Check LinkedIn analytics → Posts → record impressions, reactions, comments
- Check Visitors → see if profile visits increase and from which job titles
- Record in the LinkedIn Content Tracker tab of your spreadsheet

**Kill criteria:** < 500 impressions per post, zero profile visits from target titles
**Scale criteria:** Any post > 2,000 impressions or > 5 comments from HR/C-suite titles

---

### Experiment 3: Referral Activation
**Who:** Erik
**Effort:** ~2 hours total (personalize and send 20 emails)
**Goal:** Generate warm introductions from past clients and contacts

1. Open `content/referral-email-template.md` in the repo — template + personalization notes
2. Make a list of 20 past clients and warm professional contacts
3. Send each a personalized email (not mass mail — individual)
4. Record each send in the Referral Tracker tab
5. If no response after 7 days, send the follow-up (template included)

**Kill criteria:** Zero responses after 2 weeks (very unlikely)
**Scale criteria:** Any introduction → send to next 30 contacts

---

### Experiment 4: Assessment Funnel
**Who:** Automatic (already deployed)
**Goal:** Measure the assessment → email gate → discovery call funnel

The assessment is already the primary CTA on the homepage hero and CTA section. Just monitor the metrics in GA4:

- Assessment page views (how many start)
- Assessment completions (track via `form_submission` event for `assessment_report`)
- Email gate conversion rate = completions / page views

**Kill criteria:** < 3% email gate rate after 2 weeks of data
**Scale criteria:** > 8% → make assessment the primary CTA in Google Ads campaigns too

---

## SPRINT 2: FIRST ADAPT (Weeks 3-4)

### Week 3 Review Checklist
**Who:** Erik (1 hour)
**When:** End of week 3

Open your tracking spreadsheet and answer these questions:

**Google Ads:**
- [ ] Total spend so far: EUR ___
- [ ] Total clicks: ___
- [ ] Click-through rate: ___%
- [ ] Form submissions from ads: ___
- [ ] Cost per lead: EUR ___
- [ ] Search terms that triggered ads (any surprises?): ___
- [ ] New negative keywords to add: ___
- [ ] Which ad group performed best?
- [ ] Which ad group should be paused?

**LinkedIn:**
- [ ] Which post got the most impressions?
- [ ] Which post got the most comments?
- [ ] Were comments from target audience (HR, C-suite, OD)?
- [ ] Did profile visits increase?
- [ ] Any inbound messages or connection requests from prospects?

**Referrals:**
- [ ] How many of 20 emails got a response?
- [ ] How many introductions were made?
- [ ] Any conversations or calls booked?
- [ ] Which contacts were most helpful?

**Assessment:**
- [ ] Assessment page views per week: ___
- [ ] Email gate submissions per week: ___
- [ ] Conversion rate: ___%

### Adapt Decisions

Based on the data:

| Signal | Action |
|--------|--------|
| Google Ads: leads at < EUR 200 | Add phrase match keywords, keep going |
| Google Ads: clicks but no leads | Change landing pages to point to /assessment instead of booking |
| Google Ads: no clicks | Review ad copy, raise bids, or pause and reallocate |
| LinkedIn: engagement from target audience | Increase to 3-4 posts/week, start podcast pitching |
| LinkedIn: no engagement | Try different formats (carousel, polls, shorter posts) |
| Referrals: introductions generated | Email next 30 contacts, ask for testimonials |
| Referrals: no responses | Revise the email, try phone/LinkedIn message instead |
| Assessment: high conversion | Run Google Ads pointing to /assessment |
| Assessment: low conversion | Review assessment UX, simplify the email gate |

---

## SPRINT 3-4: REINFORCE (Weeks 5-8)

### If Google Ads works:
**Who:** Erik + Claude

- [ ] Add phrase match keywords alongside exact match
- [ ] Create a German-language landing page (Claude builds this)
- [ ] Launch Nordics campaign (Sweden, Norway, Denmark — English, EUR 300/mo)
- [ ] Set up remarketing audience in Google Ads (people who visited site but didn't convert)
- [ ] Consider switching to Maximize Conversions bidding (only if 15+ conversions recorded)

### If LinkedIn works:
**Who:** Erik + Claude

- [ ] Formalize editorial calendar: 3 posts/week with rotating format (contrarian, framework, case, assessment)
- [ ] Pitch 10 podcasts as guest (Claude can draft the pitch emails)
- [ ] Pitch 5 Nordic HR conferences for speaking slots (Claude can identify targets and draft pitches)
- [ ] Consider LinkedIn Ads test: EUR 1,500 for 2 weeks targeting HR Directors, CPOs in Nordics

### If referrals work:
**Who:** Erik

- [ ] Build quarterly touchpoint system: email past clients every 3 months with an update
- [ ] Ask 3-5 clients for testimonials (named if possible, with title and org type)
- [ ] Identify 5 potential referral partners (executive coaches, strategy consultants, HR tech vendors)
- [ ] Set up informal referral arrangements

### Content to create:
**Who:** Claude (when Erik is ready)

- [ ] Write first 2 Insights articles (topics validated by LinkedIn engagement data)
- [ ] Write 2-3 anonymized case studies
- [ ] Expand the CLEAR framework page to 3,000+ words (SEO pillar page)
- [ ] Create "Behavioral Science in Organizations" pillar page

---

## SPRINT 5-8: COMPOUND (Months 3-4)

### SEO Content Machine
**Who:** Claude writes, Erik reviews and publishes

- [ ] 2 articles/month on topics validated by LinkedIn engagement
- [ ] Each article: 1,500-2,500 words, unique meta tags, structured data, internal links
- [ ] Article topics (adjust based on what resonated on LinkedIn):
  1. "Why 70% of Change Initiatives Fail (And What the Research Actually Says)"
  2. "ADKAR vs CLEAR: Which Change Framework Is Right for Your Organization?"
  3. "The Psychology of Resistance to Change: What Leaders Get Wrong"
  4. "How Psychometric Assessments Actually Improve Leadership"
  5. "What Is Behavioral Design? A Practical Guide for HR and OD Professionals"
  6. "Why Most Leaders Are Poor Listeners (And Don't Know It)"

### German Market Evaluation
**Who:** Erik reviews data, Claude builds

- [ ] Review Google Ads Germany performance data (months 1-3)
- [ ] If CPL is viable: build German-language versions of top 2 landing pages
- [ ] If CPL is too high: reduce Germany budget, reallocate to Nordics or LinkedIn
- [ ] Consider German-language LinkedIn content if organic traction warrants it

### Book Launch Preparation (if timing aligns)
**Who:** Erik leads, Claude supports

- [ ] Build dedicated book landing page (separate from current /get-the-book)
- [ ] Press outreach plan for backlinks (HR trade publications, psychology press)
- [ ] Create "Simple Listening Framework" SEO pillar page
- [ ] Coordinate book launch with LinkedIn content push (5-10 posts in launch week)

### Technical SEO Evaluation
**Who:** Claude

- [ ] Check organic traffic trajectory in Search Console after 3 months of content
- [ ] If organic growth is promising: evaluate Astro migration for full static rendering
- [ ] If organic growth is slow: focus budget on paid channels, defer migration

---

## ONGOING: THE LEARNING LOOP

Every 2 weeks, Erik reviews (15 minutes):

| Question | If answer is bad | Action |
|----------|-----------------|--------|
| Cost per lead by channel? | Any channel > EUR 300/lead after 30 days | Kill or pivot that channel |
| Lead to call conversion? | Leads aren't booking calls | Fix landing page copy or add booking CTA to thank-you flow |
| Call to proposal rate? | Calls don't convert to proposals | Targeting is wrong — wrong audience is clicking |
| What content resonated? | Nothing is getting traction | Try different formats, topics, or posting times |

---

## SUMMARY: WHAT HAPPENS WHEN

| When | What | Who |
|------|------|-----|
| This week | Replace conversion placeholders, link GA4, verify Search Console, record baselines | Erik |
| This week | Send 20 referral emails | Erik |
| Week 1 | Launch Google Ads Germany campaign | Erik |
| Week 1 | Post first LinkedIn post | Erik |
| Week 3 | First review — kill/scale/pivot decisions | Erik |
| Week 5-8 | Reinforce winning channels, start content production | Erik + Claude |
| Month 3-4 | SEO articles, case studies, German market evaluation | Erik + Claude |
| Month 4+ | Book launch prep, speaking engagements, partnership development | Erik |

---

## WHAT CLAUDE CAN DO NEXT (Ask Anytime)

- Replace Google Ads conversion placeholders once Erik provides the IDs
- Build German-language landing pages
- Write full Insights articles (1,500-2,500 words each)
- Write case study pages
- Expand the CLEAR framework page for SEO
- Draft podcast pitch emails
- Draft conference speaker proposals
- Build LinkedIn Ads campaign structure
- Create email nurture sequences for assessment completers
- Build a dashboard page for Erik to track key metrics
