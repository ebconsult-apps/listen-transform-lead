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

## Off-site checklist (not code, but it is most of the effect)

1. **Bing Webmaster Tools**: verify the site and submit `sitemap.xml`. ChatGPT search reads
   Bing's index; a page Bing has not crawled cannot appear in ChatGPT. Turn on IndexNow there
   so new pages are picked up within hours.
2. **Google Search Console**: resubmit the sitemap after this deploy so the new URL is crawled.
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
