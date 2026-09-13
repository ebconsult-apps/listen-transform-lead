# AI search visibility (ChatGPT, Claude, Perplexity)

Goal: when someone asks an AI assistant for a **behaviour change expert / consultant in
Sweden**, clear-framework.com is one of the sources it reads and cites.

AI answer engines do not rank pages the way Google does. They (1) pull candidate pages from a
web index (ChatGPT search uses Bing's index; Claude uses Brave's; Perplexity has its own),
(2) fetch the page HTML **without running JavaScript**, and (3) lift short, factual,
self-contained passages into the answer. So what matters is: being in those indexes, serving
complete HTML, and stating the facts plainly on the page.

## What the site does (in this repo)

| Lever | Where |
| --- | --- |
| Explicit allow rules for OpenAI (`GPTBot`, `OAI-SearchBot`, `ChatGPT-User`), Anthropic (`ClaudeBot`, `Claude-SearchBot`, `Claude-User`) and other AI crawlers | `public/robots.txt` |
| Plain-text site summary for LLM agents, following the llms.txt convention | `public/llms.txt` |
| Every marketing route prerendered to static HTML at build time, so crawlers get full content without JS | `vite.config.ts` (`routes`) |
| Stable homepage H1: the headless prerender browser always gets the "Behavior Change by Design" hero variant; visitors keep the A/B test | `src/components/Hero.tsx` (`CRAWLER_VARIANT_ID`) |
| Entity page for the target query, with the exact phrase in the URL, title, H1 and first paragraph, plus an always-visible FAQ and `FAQPage` + `Service` JSON-LD | `src/pages/niche/BehaviourChangeConsultantSweden.tsx` → `/consulting/behaviour-change-consultant-sweden` |
| `ProfessionalService` / `Person` JSON-LD with Stockholm address, `areaServed` Sweden / Nordics / Europe, `knowsAbout`, languages, and shared `@id`s so the graph links up | `src/pages/Index.tsx`, `src/pages/About.tsx`, `src/pages/Services.tsx` |
| "Where are you based" and "is CLEAR a behaviour change methodology" Q&As in the FAQ schema | `src/pages/FAQ.tsx` |
| One public overview page per whitepaper (`/resources/<id>`) with summary, key facts, FAQ and `Report` + `FAQPage` JSON-LD, so gated PDFs still surface in AI answers; listed in `llms.txt` | `src/content/whitepapers.ts`, `src/pages/WhitepaperPage.tsx` |

## Whitepaper analytics (GA4)

Every whitepaper event now carries `whitepaper_id` (and `placement`: `modal` on /resources,
`page` on /resources/<id>):

| Event | Fires when |
| --- | --- |
| `whitepaper_gate_view` | the download gate renders |
| `form_submission` / `lead_whitepaper_download` | the form is submitted successfully (existing events, now with the id) |
| `whitepaper_download` | the unlocked "Download PDF" link is clicked |

**You do not need GA4 to read these.** Every event is also mirrored, cookieless, into the
project's own `analytics_events` table; `select * from analytics_whitepaper_funnel` gives the
per-paper funnel and `analytics_ai_referrals` shows visits arriving from ChatGPT, Claude,
Perplexity and friends. See `docs/analytics-first-party.md`.

**Optional GA4 setup** (only if you also want the funnel inside GA4): Admin → Custom
definitions → create event-scoped custom dimensions `whitepaper_id` and `placement`. GA4 stores
the parameters regardless but cannot report on them until then. `lead_whitepaper_download` stays
the key event imported to Google Ads either way.

**Adding a paper:** add the PDF to `public/whitepapers/`, an entry to `src/content/whitepapers.ts`,
the id to `public/whitepaper-handler.php`, the route to `vite.config.ts` and `public/sitemap.xml`.
`npm test` fails until all five agree.

Both spellings (behaviour / behavior) appear deliberately; agents match either.

## Writing rules for new pages

- Put the answer in the first paragraph: who, where, what, for whom. Agents quote openers.
- One fact per sentence. "Erik Bohjort is a licensed psychologist based in Stockholm, Sweden."
  beats a paragraph of positioning.
- Prefer visible Q&A blocks over accordions for anything you want quoted; pair them with a
  `FAQPage` entry in the page's `structuredData`. `NichePage` has a `faqs` prop for this.
- Never invent client names, percentages or outcomes. Agents repeat them as facts.
- Add every new public route to `vite.config.ts` `routes` **and** `public/sitemap.xml`, and
  link it from at least one existing page (the footer is fine) so it is not orphaned.

## Indexing (automated)

Every production deploy ends by submitting all sitemap URLs to **IndexNow**
(`scripts/indexnow-submit.mjs`, called from `.github/workflows/main.yml`). IndexNow feeds Bing,
which is the index ChatGPT search reads, plus Yandex, Naver and Seznam, with no account needed.
The key file is the 32-hex-character `.txt` in `public/`; the script finds it by pattern. To
rotate the key, delete that file and generate a new one with the command in the script header.
Run `node scripts/indexnow-submit.mjs --dry-run` locally to see the payload.

Google does not support IndexNow. It discovers pages from the sitemap referenced in
`robots.txt`, which is already in place.

## Off-site checklist (not code, but it is most of the effect)

1. **GA4 custom dimensions** (needed for the per-whitepaper reports, see below). In GA4: Admin →
   Data display → Custom definitions → Create custom dimension. Scope *Event*, dimension name
   `whitepaper_id`, event parameter `whitepaper_id`. Repeat for `placement`. This cannot be done
   from the repo; it needs an editor role on the GA4 property.
2. **Bing Webmaster Tools** (optional, for reporting only): verifying the site there shows
   crawl and IndexNow status. Indexing itself is already handled by the automated IndexNow
   submission above. **Google Search Console**: likewise optional; useful to confirm the
   sitemap was read after a deploy.
3. **LinkedIn**: Erik's profile headline and the EB Consulting company page should use the same
   wording as the site ("Licensed psychologist · Behaviour change consultant · Stockholm,
   Sweden") and link to clear-framework.com. Agents cross-check entities across sources.
4. **Third-party mentions**: directories and listings that agents already trust (Clutch,
   Swedish consulting directories, conference speaker pages, podcast show notes) should
   describe Erik with the same phrase and link back. A handful of consistent mentions moves the
   needle more than more on-site copy.
5. **Test it**: once a month, ask ChatGPT (with search), Claude and Perplexity the target
   questions in English and Swedish ("behaviour change consultant Sweden", "beteendeförändring
   konsult Stockholm") and note whether clear-framework.com is cited. If the Swedish queries
   never surface the site, a Swedish-language version of the entity page is the next step.
