# Per-page findings

All ~45 routes, grouped marketing → landing → product/app. Global issues (Inter fallback, missing `:active`/focus states, `.glass-card`) are catalogued once in [design-system.md](./design-system.md) and only re-cited per page where a page makes them materially worse.

> **Note on `/app/*`, `/respond/:token`, `/auth/callback`:** these require an authenticated session or a valid token, so their screenshots show the auth/config/empty fallback. They were audited **from source** for the real UI — see [coverage.md](./coverage.md).

---

## Home

**Route:** `/`

> The home page is structurally complete and the blue accent (primary 220 80% 48%) is consistently locked across hero, services, badges, and CTAs, so there is no multi-accent or AI-gradient mess. Copy is specific and on-brand (the 70% failure-rate hook is strong), SEO/structured data is thorough, and decorative logos are correctly marked aria-hidden. The biggest problems are landing-strategy and craft tells rather than broken visuals: the exact same two CTAs ('Take the Free Assessment' + 'Book a Discovery Call') are repeated verbatim in the hero and again in the closing CTA section, with a third assessment CTA in between, so the page has no CTA hierarchy. Em-dashes appear in multiple UI strings (visible in the hero). The hero is a flat wall of centered text with no product visual, and its decorative radial-gradient background is actually broken by a CSS bug (HSL tokens piped into rgba()), so the intended ambient glow never renders. The feature row is the generic equal-card grid the checklist calls out, every surface is the same .glass-card, and buttons lack a pressed state and a visible focus ring.

**14 findings** — 3 high · 7 medium · 4 low

- **🔴 HIGH · Content** — Two CTAs with identical intent are repeated verbatim across the page. The hero (Hero.tsx:159-166) renders 'Take the Free Assessment' + 'Book a Discovery Call', and the closing CTASection (CTASection.tsx:56-62) renders the exact same pair word-for-word. Between them, the mid-page Assessment block (Index.tsx:67-70) adds a third assessment CTA ('Start the Assessment'). The page therefore pushes the same two actions 3-4 times with no escalating hierarchy, which reads as templated and dilutes conversion.
  - **Evidence:** src/components/Hero.tsx:159-166, src/components/CTASection.tsx:56-62, src/pages/Index.tsx:67-70, home__desktop-full.png
  - **Fix:** Pick one primary intent per section and vary it. Keep the hero as the single primary 'Take the Free Assessment' (book call as a quiet text link), make the mid-page block the assessment moment, and change the closing section to a distinct ask (e.g. just 'Book a Discovery Call with Erik'). Never repeat the identical button pair twice on one page.
  - **Rule:** _Single CTA intent / no two CTAs with the same intent on a page_
- **🔴 HIGH · Content** — Em-dashes are used in user-facing UI copy, which the pre-flight gate bans. The hero subtitle 'change for real — not just on paper.' is visible in the screenshot, and the same pattern recurs in other variants and elsewhere (Hero.tsx:33,38,45,51; BookPreview.tsx:80 'fail — even when').
  - **Evidence:** src/components/Hero.tsx:33, home__desktop-hero.png, src/components/BookPreview.tsx:80
  - **Fix:** Replace em-dashes in UI strings with a period, comma, or restructured sentence: 'change for real, not just on paper.' Apply across all hero variants and the book blurb.
  - **Rule:** _Em-dash ban in UI copy_
- **🔴 HIGH · Code Quality** — The hero's decorative background gradient is broken by a CSS variable bug, so the intended ambient glow renders as nothing. The code pipes the HSL design token into rgba(): rgba(var(--primary, 0, 0, 255), 0.15). But --primary is defined as space-separated HSL components '220 80% 48%' (index.css:17), not an RGB triple, so the fallback never applies and the function resolves to the invalid 'rgba(220 80% 48%, 0.15)'. The radial-gradient stops are therefore invalid and paint transparent. In the screenshot the hero background is effectively flat off-white with no visible gradient.
  - **Evidence:** src/components/Hero.tsx:120-121, src/index.css:17, home__desktop-hero.png
  - **Fix:** Use the token the way it is authored: 'hsl(var(--primary) / 0.15)' inside the radial-gradient, or define a dedicated RGB token. Remove the misleading '0, 0, 255' fallback. Verify the glow actually renders.
  - **Rule:** _Surface depth / colored ambient gradients (and import/token correctness)_
- **🟠 MED · Layout** — The hero is a flat, fully centered wall of text (tag, headline, paragraph, two buttons) on a near-flat off-white background with no product visual, portrait of Erik, illustration, or real imagery. Combined with the broken gradient above, the most important section of the page has zero visual depth and looks unfinished for a marketing hero.
  - **Evidence:** src/components/Hero.tsx:113-168, home__desktop-hero.png
  - **Fix:** Give the hero a focal visual: a portrait of Erik, the CLEAR framework diagram, or a masked editorial image, and/or break the strict center symmetry with an asymmetric two-column layout. At minimum ship a working subtle background (image at low opacity or a real mesh/radial gradient).
  - **Rule:** _Strong hero / empty flat sections with no visual depth_
- **🟠 MED · Component Patterns** — The feature row is the generic equal-card grid the checklist explicitly flags. ServicesPreview renders four identical .glass-card tiles in a uniform md:grid-cols-2 grid, each with the same icon-in-pill + title + description + 'Learn more' link, all forced to equal height (h-full flex flex-col).
  - **Evidence:** src/components/ServicesPreview.tsx:90-114, home__desktop-full.png
  - **Fix:** Break the uniformity: a 2-column zig-zag, an asymmetric/bento layout, or numbered C-L-E-A-R phases with varied emphasis (the framework is literally an ordered acronym, so lean into that sequence instead of four equal boxes).
  - **Rule:** _Three equal card columns as feature row_
- **🟠 MED · Component Patterns** — Every surface on the page is the same generic .glass-card (white/95 + border + shadow-lg + rounded-2xl). It is used for each service tile, the mid-page Assessment block, the book section, and the closing CTA. Repeating one identical card treatment for every distinct content type removes hierarchy and is a known AI-slop tell; this page makes the already-flagged global .glass-card issue noticeably worse by leaning on it 7+ times.
  - **Evidence:** src/index.css:77-79, src/pages/Index.tsx:57, src/components/ServicesPreview.tsx:95, src/components/CTASection.tsx:43, src/components/BookPreview.tsx:65
  - **Fix:** Differentiate surfaces by role: let the hero and CTA bands use background color/spacing instead of a bordered card, reserve elevation for genuinely interactive tiles, and vary radius (tighter inner, softer container). Cards should exist only where elevation communicates hierarchy.
  - **Rule:** _Generic card look (border + shadow + white background)_
- **🟠 MED · Interactivity & States** — Primary and secondary buttons have no :active/pressed feedback and no explicit visible focus ring. .btn-primary defines only a hover wipe (index.css:97-107) and .btn-secondary only a hover bg shift (index.css:109-111); neither has :active or :focus-visible. The hero, services, assessment, book, and CTA buttons all inherit this, so keyboard users get only the faint browser default outline and there is no tactile press response.
  - **Evidence:** src/index.css:97-111, src/components/Hero.tsx:159-166
  - **Fix:** Add active:scale-[0.98] (or translateY(1px)) and a focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 to .btn-primary and .btn-secondary. This is both a polish and an a11y requirement.
  - **Rule:** _Real states: :active/pressed + visible focus ring_
- **🟠 MED · Color & Surfaces** — The secondary button barely reads as a button against the page. .btn-secondary uses bg-secondary (220 16% 92%, a very light gray) while the page background is 210 20% 98%, a ~6% lightness difference, so 'Book a Discovery Call' sits as a faint near-white chip with no border. In the hero screenshot it nearly disappears next to the solid blue primary. This is a low surface-contrast / weak-affordance issue rather than a text-contrast failure (the dark label itself is legible).
  - **Evidence:** src/index.css:109-111, src/index.css:8, home__desktop-hero.png
  - **Fix:** Make the secondary action an outline button (1px border in primary or foreground/20) or a clearly tinted surface so it reads as interactive against the off-white page, while staying visually subordinate to the primary.
  - **Rule:** _Button affordance / surface contrast_
- **🟠 MED · Interactivity & States** — Entry animations are driven by inline style opacity:0 plus setTimeout/IntersectionObserver that add classes in JS (Hero.tsx:130-157 set opacity:'0' inline; ServicesPreview, CTASection, BookPreview, TrustedBy all start opacity-0 and rely on JS to reveal). If JS is delayed, blocked, or errors, the hero headline, subtitle, CTAs, services cards, and footer-CTA stay permanently invisible. There is also no prefers-reduced-motion handling for these fades.
  - **Evidence:** src/components/Hero.tsx:130-157, src/components/ServicesPreview.tsx:81-95, src/components/CTASection.tsx:42
  - **Fix:** Drive reveals with CSS (animation-fill-mode + IntersectionObserver toggling a class) so content is visible by default and only animates as enhancement, and gate the motion behind a prefers-reduced-motion: no-preference media query.
  - **Rule:** _No loading/robust states / motion accessibility_
- **🟠 MED · Typography** — Display headings have no real display typeface for most visitors. The font-display stack is ['SF Pro Display', 'Inter var', 'sans-serif'] (tailwind.config.ts:70), so on any non-Apple device (including the audited Linux render) every h1/h2 falls back to Inter var, the same family as body. The large hero h1 ('Organizational Change Through Behavioral Design') is therefore just big bold Inter with no distinct character. This compounds the global Inter-everywhere issue specifically on the page's most prominent type.
  - **Evidence:** tailwind.config.ts:69-70, src/components/Hero.tsx:138-144, home__desktop-hero.png
  - **Fix:** Self-host a real display face with presence (Geist, Outfit, Cabinet Grotesk, or a refined serif for an editorial/psychology feel) and load it as a web font so it renders for everyone, not just Apple users.
  - **Rule:** _Not Inter-everywhere / display headings need presence_
- **🟡 LOW · Content** — Headings use Title Case where sentence case would read more human. Examples: 'How Ready Is Your Organization for Change?' (Index.tsx:62) and 'Ready to Break the Cycle of Failed Change?' (CTASection.tsx:49).
  - **Evidence:** src/pages/Index.tsx:62, src/components/CTASection.tsx:49
  - **Fix:** Switch section headings to sentence case: 'How ready is your organization for change?'
  - **Rule:** _Title Case on every header_
- **🟡 LOW · Component Patterns** — The book section uses two pill-shaped .tag badges side by side ('Coming Soon' and 'The Book'), the generic rounded-full badge pattern the checklist flags, stacked redundantly.
  - **Evidence:** src/components/BookPreview.tsx:66-72
  - **Fix:** Use a single, plainer label (e.g. a small-caps 'Coming soon' eyebrow) rather than two pill chips; drop the redundant 'The Book' pill since the heading already says it.
  - **Rule:** _Pill-shaped New/Beta badges_
- **🟡 LOW · Iconography** — All icons on the page are Lucide (the default AI icon set): ArrowRight repeated on every CTA, plus Target/Network/FlaskConical/Briefcase, ClipboardCheck, BookOpen, ExternalLink. Heavy reuse of the same arrow on five-plus buttons reinforces the templated feel.
  - **Evidence:** src/components/Hero.tsx:3, src/components/ServicesPreview.tsx:4, src/pages/Index.tsx:11
  - **Fix:** Switch to a more distinctive set (Phosphor or a custom mark) and reduce arrow repetition; not every button needs a trailing arrow.
  - **Rule:** _Lucide/Feather icons exclusively_
- **🟡 LOW · Layout** — The hero sizes with min-h-[70vh] (viewport height) rather than dvh, which can cause the section height to jump on mobile browsers when the URL bar shows/hides (iOS Safari viewport bug).
  - **Evidence:** src/components/Hero.tsx:114
  - **Fix:** Use min-h-[70dvh] for the hero (and any other vh-based full-bleed sections).
  - **Rule:** _Using vh for full-screen sections instead of dvh_

---

## About

**Route:** `/about`

> The About page is functional, semantically uses sections, ships SEO/structuredData, and has genuinely strong, specific copy (real credentials, a named framework, no Lorem Ipsum). But it reads as a generic AI marketing template: the desktop hero is half-empty (text in the left column, a giant void on the right) with a long dead gap before content scrolls in, and the entire body is four visually IDENTICAL stacked white glass-cards — the most generic card-on-card pattern. The biggest tells are content-level: the page switches person mid-way (first-person 'My journey'/'I believe' in the top sections, then third-person 'While Erik leads... he works' in The Team and the sidebar), opens with a banned AI cliche ('My journey into the world of transformative listening'), and peppers body copy with en/em dashes. Two CTAs ('Get In Touch' and 'Start a Conversation') point to the same /contact destination with the same intent. State coverage is thin (btn-primary has no :active, content is hidden via inline opacity:0 until a JS setTimeout fires). Fixing the hero composition, de-duplicating the card treatment, unifying voice, and resolving the dual-CTA are the high-value moves.

**13 findings** — 6 high · 4 medium · 3 low

- **🔴 HIGH · Content** — Person/voice is inconsistent across the page. The hero and first two cards are written in first person ('My journey', 'I believe', 'I've had the privilege'), but 'The Team' card abruptly switches to third person ('While Erik leads every engagement personally, he works with...'), and the sidebar caption is third person ('Erik Bohjort / Licensed Psychologist'). A reader can't tell if Erik or 'we' is speaking.
  - **Evidence:** About.tsx:68 ('My journey'), About.tsx:88 ('I believe'), vs About.tsx:107 ('While Erik leads... he works'); about__desktop-full.png
  - **Fix:** Pick one voice for the whole page. Since the hero is first-person, rewrite The Team in first person too ('I work with a curated network of senior consultants...'). Keep the sidebar caption as a label (that's fine in third person), but the body prose must not flip between 'I' and 'Erik/he'.
  - **Rule:** _Active voice / consistent narrator_
- **🔴 HIGH · Content** — Opens with a banned AI copywriting cliche: 'My journey into the world of transformative listening began with...'. 'journey into the world of' is a textbook AI tell, and the page repeats 'transform/transformation' as filler ('turn insight into lasting transformation', 'transform what they hear into strategic action', 'Ready to Transform Your Organization?').
  - **Evidence:** About.tsx:68 ('My journey into the world of transformative listening'), About.tsx:81, About.tsx:179
  - **Fix:** Rewrite the opener with a concrete, specific sentence ('In most hard rooms, the problem is not a lack of ideas — it is that nobody is really listening.'). Cut at least two of the four 'transform' instances and replace with specific outcomes (e.g. 'turn what they hear into decisions').
  - **Rule:** _AI copywriting cliches (no 'In the world of...')_
- **🔴 HIGH · Layout** — The desktop hero is half-empty. The 'About' tag, H1 'Erik Bohjort', and intro paragraph all sit in the left ~50% while the entire right half is blank, and there is a tall dead gap below the paragraph before any content scrolls into view. It reads as a placeholder hero where the right-side visual was never added.
  - **Evidence:** About.tsx:46-57 (hero section is a single full-width text block, no second column or visual); about__desktop-hero.png (large empty right half + bottom void)
  - **Fix:** Either move Erik's portrait into the hero (two-column: text left, photo right) and free the sidebar, or constrain/redesign the hero so the empty right column isn't dead space — e.g. an offset oversized credential stat, a pull-quote, or the CLEAR phase chips. Reduce the vertical gap so the first content card is closer to the fold.
  - **Rule:** _Empty, flat sections with no visual depth / Whitespace maximization (purposeful, not accidental)_
- **🔴 HIGH · Component Patterns** — The four body sections (My Story, Philosophy & Approach, The Team, Credentials & Experience) are rendered as four IDENTICAL .glass-card boxes (white bg + border + shadow + same radius + same p-8/p-10), stacked vertically. This is the generic 'card on white card' AI pattern — the cards add no hierarchy because every section looks the same, and on a white page they barely separate from the background.
  - **Evidence:** About.tsx:65, 85, 104, 120 (four identical 'glass-card p-8 md:p-10' wrappers); about__desktop-full.png
  - **Fix:** Drop the card chrome for narrative prose. Render My Story / Philosophy / The Team as plain typographic sections (heading + body) separated by whitespace and a hairline rule, and reserve an actual card/elevation only for Credentials (the list) where the boxed treatment earns its place. Vary the treatment so the page has rhythm instead of four clones.
  - **Rule:** _Generic card look (border + shadow + white background) — cards only when elevation communicates hierarchy_
- **🔴 HIGH · Component Patterns** — Two CTAs with the same intent and the same destination on one page: the sidebar 'Get In Touch' and the bottom CTA 'Start a Conversation' both link to /contact, and the nav also has 'Contact'. Duplicate primary CTAs pointing to the same place dilute the call to action.
  - **Evidence:** About.tsx:164 (sidebar 'Get In Touch' -> /contact), About.tsx:184 (CTA section 'Start a Conversation' -> /contact)
  - **Fix:** Keep one primary /contact CTA per page. Make the bottom section the single conversion CTA, and either remove the sidebar button or change its intent (e.g. 'Read the CLEAR Framework' -> /methodology, or download a bio/PDF) so the two buttons don't compete.
  - **Rule:** _No two CTAs with the same intent on a page_
- **🔴 HIGH · Interactivity & States** — Both CTAs use .btn-primary, which has a hover (bg shift + before-overlay sweep) but no :active/pressed state and relies on the global focus ring only. There is no pressed feedback when the buttons are clicked. (Global btn-primary issue, but this page is button-driven so it is felt here.)
  - **Evidence:** index.css:97-107 (btn-primary defines :hover and :hover:before but no :active); used at About.tsx:164 and About.tsx:184
  - **Fix:** Add an :active state to btn-primary (e.g. active:scale-[0.98] active:translate-y-px) and confirm a visible focus-visible ring, so the two CTAs give physical click feedback and keyboard affordance.
  - **Rule:** _No active/pressed feedback — add hover AND :active_
- **🟠 MED · Content** — Em-dash and en-dash used as punctuation in UI/body copy, which is on the ban list. Three en-dashes and one em-dash appear in prose.
  - **Evidence:** About.tsx:75 ('clients – from EU'), About.tsx:88 ('transformation – whether... organizational –'), About.tsx:94 ('your guide – someone'), About.tsx:108 ('senior consultants — each')
  - **Fix:** Replace each en/em dash with a comma, period, or restructured sentence. e.g. 'clients, from EU policymakers to...'; 'as your guide, someone walking alongside you...'.
  - **Rule:** _Em-dash ban in UI copy_
- **🟠 MED · Interactivity & States** — Page content is hidden by default (opacity-0) and only revealed by an imperative setTimeout that adds a class and sets element.style.opacity = '1' after 100ms/300ms. If JS is slow, blocked, or fails, the hero and main content render invisible (blank white page). This is also a flash/accessibility risk and animates on an arbitrary timer rather than on scroll/entry.
  - **Evidence:** About.tsx:15-26 (setTimeout + heroRef.current.style.opacity='1'); About.tsx:48 ('opacity-0') and About.tsx:64 ('opacity-0')
  - **Fix:** Render content visible by default and layer the entrance animation progressively (e.g. CSS @keyframes on mount, or IntersectionObserver-driven reveal), so a JS hiccup can never leave the page blank. Avoid setting inline style.opacity imperatively.
  - **Rule:** _Staggered entry (never leave content invisible if JS fails) / Animations via transform & opacity, not arbitrary timers_
- **🟠 MED · Color & Surfaces** — The bottom CTA card is the only surface with a tint (bg-primary/5 — a faint blue wash) on an otherwise all-white page. A single faintly-colored section reads as a copy-paste accent rather than an intentional system, and at /5 opacity the tint is so weak it barely registers while still breaking the neutral consistency.
  - **Evidence:** About.tsx:178 ('glass-card ... bg-primary/5'); about__desktop-full.png (only the bottom card is tinted)
  - **Fix:** Either commit to a clearly differentiated CTA surface (a solid soft-accent or a deeper tint that obviously signals 'this is the action zone') or drop the tint and differentiate via spacing/border. Don't leave a barely-perceptible one-off wash.
  - **Rule:** _Random tinted section breaking a consistent background tone_
- **🟠 MED · Typography** — Section headings use Title Case in a couple of places, mixing with sentence-style elsewhere, and the CTA heading is a Title Case AI cliche. 'Ready to Transform Your Organization?' is Title Case; 'My Story' / 'The Team' are title-ish too.
  - **Evidence:** About.tsx:179 ('Ready to Transform Your Organization?'), About.tsx:66 ('My Story'), About.tsx:105 ('The Team')
  - **Fix:** Standardize on sentence case for headings ('My story', 'The team', 'Ready to transform your organization?') and rewrite the CTA heading to be more specific and less cliche (e.g. 'Let's work through the hard part together').
  - **Rule:** _Title Case On Every Header — use sentence case_
- **🟡 LOW · Color & Surfaces** — The sidebar role caption is text-foreground/70 at text-sm on a white card — low-contrast small supporting text. It is readable but sits near the lower end of comfortable contrast for fine print.
  - **Evidence:** About.tsx:159 ('text-foreground/70 text-sm'); about__desktop-full.png (sidebar caption under name)
  - **Fix:** Bump to text-foreground/80 (or a defined muted token verified at >=4.5:1) so the caption clears WCAG AA for body text at that size.
  - **Rule:** _Form/body contrast must meet WCAG AA (4.5:1 body)_
- **🟡 LOW · Iconography** — Both CTAs use the Lucide ArrowRight icon, the default AI icon choice. It is consistent but generic, and the arrow-after-CTA pattern is repeated identically on both buttons.
  - **Evidence:** About.tsx:2 (import { ArrowRight } from 'lucide-react'), used at About.tsx:166 and About.tsx:186
  - **Fix:** If differentiation is desired site-wide, consider Phosphor/Heroicons or a small custom arrow; at minimum, only the single primary CTA needs the arrow affordance once the dual-CTA issue is resolved.
  - **Rule:** _Lucide/Feather icons exclusively — the default AI icon choice_
- **🟡 LOW · Strategic Omissions** — The credentials list uses five identical tiny round bullet dots (h-1.5 w-1.5 rounded-full bg-primary). It's clean but it's the default 'dot list' — a missed chance to make the strongest, most concrete content on the page (real credentials) feel distinctive.
  - **Evidence:** About.tsx:122-143 (five li items each with the same dot div); about__desktop-full.png
  - **Fix:** Consider giving the credentials more presence — e.g. small numbered markers, a 2-column grid, or short label/value pairs — so Erik's actual proof points read as a designed module rather than a generic bulleted list.
  - **Rule:** _Feature/credential lists as generic bullet rows — add structure/emphasis_

---

## Services (hub)

**Route:** `/services`

> The /services page is clean, legible and on-brand: a single blue accent is held consistently (tag, links, icon tints, active nav underline), the copy is specific and human (real engagement names, honest 'Best for:' qualifiers, no Lorem/AI cliches like 'Elevate' or 'Seamless'), and the four engagement cards correctly bottom-align their CTAs with mt-auto. The strongest problems are conversion and craft, not chaos. The hero wastes an enormous amount of space (empty right half on desktop plus a tall dead gap before the cards) and carries no visual element, so the page opens weak. The primary action 'Book a Discovery Call' is repeated verbatim on three cards plus a fourth variant, fragmenting CTA intent. The engagement section is the textbook generic AI layout (a 2x2 grid of identical white border+shadow glass-cards, each led by a Lucide icon in a tinted circle). Recurring em-dashes in UI copy, sub-AA gray text (text-foreground/50 on near-white, including interactive 'Learn more' links), Title-Case headline, an over-wide hero paragraph, and a dead Lucide import in the related ServicesPreview component round out the issues.

**13 findings** — 4 high · 5 medium · 4 low

- **🔴 HIGH · Layout** — The desktop hero is mostly empty: the headline and one paragraph sit in the left column while the entire right half is blank, and there is a tall vertical dead-zone (roughly 250px) between the subhead and where the first cards appear. The page opens feeling unfinished and low-energy rather than like a strong landing hero.
  - **Evidence:** Services.tsx:35-46 (hero is a single text column inside section-container, no media/aside); services__desktop-hero.png (right half empty, large gap above cards)
  - **Fix:** Give the hero presence: either add a supporting visual to the right column (portrait of Erik, an abstract CLEAR diagram, or a low-opacity full-bleed image with a scrim) or pull the engagement cards up and tighten the hero padding so the fold does real work. Use an asymmetric two-column hero instead of one narrow left-aligned text block floating in space.
  - **Rule:** _Empty, flat sections with no visual depth / Strong hero (landing standard)_
- **🔴 HIGH · Content** — The single primary conversion CTA 'Book a Discovery Call' is repeated verbatim on three of the four engagement cards, with a fourth near-identical variant 'Inquire About Availability'. Four near-duplicate primary actions on one screen dilute intent and read as templated repetition rather than a designed path.
  - **Evidence:** Services.tsx:70, 97, 124, 150 (three identical 'Book a Discovery Call' + 'Inquire About Availability'); also a second CTA block at 175-182
  - **Fix:** Lead with one clear primary action for the page (e.g. the bottom 'Take the Assessment' / single 'Book a discovery call'), and let each card's link describe its own next step (e.g. 'See the workshop format', 'View coaching details') rather than repeating the same booking label. No two CTAs with the same intent on a page.
  - **Rule:** _No two CTAs with the same intent on a page / Single CTA intent (landing standard)_
- **🔴 HIGH · Component Patterns** — The engagement section is the most generic AI layout there is: a symmetric 2x2 grid of four identical .glass-card tiles (white background + border + shadow), each opening with a Lucide icon inside a bg-primary/10 rounded-full circle. Same shape, same surface, same icon treatment four times — no hierarchy, no emphasis on a flagship offering.
  - **Evidence:** Services.tsx:51 (grid md:grid-cols-2), repeated card block 53-77 / 79-104 / 106-131 / 133-160; identical 'bg-primary/10 p-3 rounded-full' icon chip at 54, 80, 107, 134
  - **Fix:** Break the uniformity: drop the icon-in-tinted-circle pattern, vary the surfaces (e.g. feature the lead engagement with a different treatment, use a 2-col zig-zag or an editorial list), and let elevation/emphasis communicate which offering matters most instead of four equal towers.
  - **Rule:** _Three equal card columns as feature row / Generic card look (border + shadow + white) / Avatar-circle icon chips_
- **🔴 HIGH · Accessibility** — Interactive and meta text is set at text-foreground/50 on the near-white page background, which fails WCAG AA. This includes the secondary 'Learn more / Speaking / Workshops' links (interactive UI text needs >=4.5:1 for body or at least 3:1) and the duration meta labels ('1-2 days', 'Tailored programs', 'Ongoing'). The de-emphasized links are visibly faint in the screenshot.
  - **Evidence:** Services.tsx:73, 100, 127, 153, 156 ('text-foreground/50' on Learn-more links); 59, 85, 112, 139 (duration labels at /50); 65, 92, 119, 145 ('Best for:' at /50); services__desktop-full.png (faint secondary links)
  - **Fix:** Raise muted text to at least text-foreground/70 (or a token verified at >=4.5:1), and ensure interactive secondary links meet contrast in both default and hover states. Reserve the lightest gray only for truly non-essential text that still clears 3:1.
  - **Rule:** _Button & form / UI text contrast must meet WCAG AA_
- **🟠 MED · Content** — Em-dashes are used repeatedly in UI copy: the hero subhead ('your organization's needs — from a focused diagnostic'), and card descriptions ('applied practice — not another workshop', 'systems thinking — a sounding board'). The em-dash ban targets exactly this AI-copy fingerprint in interface text.
  - **Evidence:** Services.tsx:42-43 (hero '— from'), 89-90 ('— not another workshop'), 116-117 ('— a sounding board')
  - **Fix:** Replace em-dashes with periods, commas, or restructured sentences. e.g. 'Structured coaching and applied practice. Not another workshop they'll forget by Monday.'
  - **Rule:** _Em-dash ban in UI copy_
- **🟠 MED · Typography** — The hero headline 'How We Work Together' is in Title Case (every word capitalized), as are the card headings 'Executive Coaching & Advisory', 'Keynote Speaking & Workshops', and the section 'Not Sure Where to Start?'. Title Case on every header is a generic-template tell; sentence case reads more editorial and intentional.
  - **Evidence:** Services.tsx:38 ('How We Work Together'), 111, 138, 169
  - **Fix:** Switch display and section headings to sentence case: 'How we work together', 'Executive coaching & advisory', 'Not sure where to start?'.
  - **Rule:** _Title Case On Every Header -> use sentence case_
- **🟠 MED · Typography** — The hero paragraph uses max-w-3xl (~768px), which at this font size runs well past the comfortable ~65ch reading measure, producing long lines that hurt readability (visible as three near-full-width lines in the hero).
  - **Evidence:** Services.tsx:39 ('body-lg max-w-3xl'); body-lg defined index.css:129-131; services__desktop-hero.png (wide hero lines)
  - **Fix:** Constrain hero/body copy to roughly max-w-prose / ~60-65ch (e.g. max-w-2xl or an explicit measure) so lines stay scannable.
  - **Rule:** _Body text too wide -> limit to ~65ch_
- **🟠 MED · Layout** — The fourth engagement card ('Keynote Speaking & Workshops') has three footer links (Inquire + Speaking + Workshops) while the other three cards have two, so the footer row breaks the consistent rhythm established across the otherwise-uniform grid. In a deliberately symmetric 2x2 grid this asymmetric footer reads as a mistake rather than a choice.
  - **Evidence:** Services.tsx:148-159 (three links: Inquire About Availability, Speaking, Workshops) vs two links in cards at 68-76, 95-103, 122-130
  - **Fix:** Normalize the card footers to one consistent CTA pattern (e.g. a single 'Learn more' that routes to a Speaking & Workshops landing page), or redesign that card so the extra links are intentional and visually balanced.
  - **Rule:** _Inconsistent vertical rhythm in side-by-side elements_
- **🟠 MED · Interactivity & States** — The text-link CTAs ('Book a Discovery Call', 'Learn more', etc.) only change color on hover and have no defined focus-visible ring; combined with the page-wide btn-primary lacking an :active/pressed state, keyboard users get no visible focus indicator and clicks have no pressed feedback. The bottom CTA section renders two such buttons.
  - **Evidence:** Services.tsx:69-75, 96-102, 175-182 (links/buttons with only hover:text color change, no focus ring class); btn-primary defined index.css:97-107 (hover only, no :active)
  - **Fix:** Add a visible focus-visible ring to all links and buttons (e.g. focus-visible:ring-2 ring-ring ring-offset-2) and an :active state (translateY(1px) or scale(0.98)) to btn-primary/secondary.
  - **Rule:** _Missing focus ring / No active-pressed feedback_
- **🟡 LOW · Iconography** — All icons are from Lucide (Search, Layers, UserCircle, Mic, ArrowRight, ExternalLink) — the default AI icon set — and several are literal metaphors (magnifying-glass for 'Diagnostic Workshop', stacked layers for 'Leadership Development', microphone for 'Keynote'). Functional but undifferentiated.
  - **Evidence:** Services.tsx:4 (import from lucide-react), icons rendered at 55 (Search), 81 (Layers), 108 (UserCircle), 135 (Mic)
  - **Fix:** Move to a more distinctive set (Phosphor, or a small custom line set) and pick less on-the-nose symbols, or drop decorative icons entirely in favor of typographic hierarchy.
  - **Rule:** _Lucide or Feather icons exclusively / cliche icon metaphors_
- **🟡 LOW · Component Patterns** — The 'Services' label uses the generic pill badge pattern (rounded-full, bg-primary/10) at the top of the hero, the same default pill used elsewhere; it adds little and is the stock 'New/Beta'-style chip shape.
  - **Evidence:** Services.tsx:37 (<div className="tag">Services</div>); .tag defined index.css:137-139 (rounded-full pill)
  - **Fix:** Use a plain uppercase-tracked label or a small flag/underline eyebrow instead of the pill, or remove it since the H1 already names the section.
  - **Rule:** _Pill-shaped badges -> try square badges, flags, or plain text labels_
- **🟡 LOW · Code Quality** — In the related ServicesPreview component (audited alongside this route), 'Lightbulb' is imported from lucide-react but never used — a dead import / debug artifact.
  - **Evidence:** ServicesPreview.tsx:4 (imports Briefcase, Lightbulb, ...; Lightbulb has no usage anywhere in the file)
  - **Fix:** Remove the unused Lightbulb import.
  - **Rule:** _Import hygiene / Commented-out or dead code artifacts_
- **🟡 LOW · Content** — ServicesPreview presents the CLEAR framework but the four cards map to only Clarity, Leverage, Experimentation, and 'Business Consulting' — the last does not correspond to the A or R of CLEAR, while the intro copy explicitly promises 'clarity, systems thinking, experimentation, analysis, and refinement' (all five). The acronym and the cards disagree, undermining the framework's credibility.
  - **Evidence:** ServicesPreview.tsx:84-87 (copy lists 5 CLEAR phases) vs services array 6-31 (card 4 is 'Business Consulting', no Analysis/Refinement card)
  - **Fix:** Make the cards match the acronym (Clarity, Leverage, Experimentation, Analysis, Refinement) or relabel the section so the mismatch with the promised five phases is not visible.
  - **Rule:** _Content integrity / avoid placeholder-feeling structure_

---

## Service detail pages (family of 6)

**Route:** `/services/* — 6 pages`

> A family of 6 service-detail pages (/services/*) sharing one template: tag chip, large Inter H1, a wide intro paragraph, a 'why it fails / the difference' problem block (amber AlertTriangle cards), an approach list (blue CheckCircle rows), optional format/topic card grid, and a centered 'Start With a Conversation' glass-card CTA with two buttons. The copy is genuinely strong, specific, and differentiated per page (this is the best thing here) and the information architecture is clear and consistent. But visually this is the textbook generic-AI landing pattern: text-only flat near-white pages with no hero imagery, no overlap/depth, no motion, identical centered CTA cards, a single accent (good) broken only by amber warning icons, lucide icons throughout with cliche metaphors, body measure far wider than 65ch, em-dashes everywhere in UI copy, and a swapped CTA hierarchy on the psychometric page that breaks the family's CTA consistency. The primary CTA also inherits the foundation button with no :active/pressed state and no custom focus ring. None of the six pages feels like a premium, art-directed service page — they read as a CMS template. Per-page variance is limited to copy, the H1, and CTA labels; the layout system is identical.

**14 findings** — 5 high · 7 medium · 2 low

- **🔴 HIGH · Layout** — Every hero across all 6 pages is text-only on a flat near-white background with a large empty right column (the H1 + paragraph occupy only the left ~60% and the right half is dead space). There is no hero image, no visual anchor, no depth — the most generic AI landing pattern. A premium service page needs a strong hero with a focal element.
  - **Evidence:** services-speaking__desktop-hero.png and services-change-management__desktop-hero.png (large blank right column); ChangeManagementService.tsx:36-49 hero is one tag + h1 + p inside a plain section, no media
  - **Fix:** Give the hero presence: add a portrait/illustration or a masked image on the right column (Speaking already has a portrait further down — pull a treatment of it into the hero), an asymmetric layout, or at minimum a subtle background texture/gradient or supporting stat row. Fill or remove the empty column; do not ship a half-empty hero.
  - **Rule:** _Empty, flat sections with no visual depth / Strong hero (landing standard)_
- **🔴 HIGH · Content** — Em-dashes are used pervasively in visible UI copy across all 6 pages — hero paragraphs and body cards. E.g. change-management hero 'the strategy is wrong — but because', speaking hero 'consulting experience — evidence-based, practical'. The taste pre-flight bans em-dashes in UI copy.
  - **Evidence:** services-change-management__desktop-hero.png and services-speaking__desktop-hero.png (visible em-dashes); ChangeManagementService.tsx:43-44, ExecutiveCoachingService.tsx:88 ('honest feedback'), SpeakingService.tsx:51
  - **Fix:** Replace em-dashes in user-facing copy with periods, commas, or restructured sentences across all six pages. This is a shared fix applicable to the whole family.
  - **Rule:** _Em-dash ban in UI copy_
- **🔴 HIGH · Typography** — Intro/body paragraphs run far wider than the ~65ch limit. body-lg has no max-ch and the hero paragraph uses max-w-3xl (48rem ≈ 768px); at text-lg (~18px) that is roughly 85-90 characters per line, which visibly hurts readability. Same for body-md text at max-w-3xl in the approach sections.
  - **Evidence:** ChangeManagementService.tsx:42 (p className="body-lg max-w-3xl") and :86 (body-md ... max-w-3xl); rendered long lines in services-change-management__desktop-hero.png and services-speaking__desktop-hero.png
  - **Fix:** Constrain prose to ~60-65ch (e.g. max-w-[58ch] or max-w-prose / max-w-2xl) for hero and section intros. Apply consistently across all six pages.
  - **Rule:** _Body text too wide (<= ~65ch)_
- **🔴 HIGH · Interactivity & States** — The primary CTA on every page inherits .btn-primary, which has a hover shimmer/bg shift but NO :active/pressed state and NO custom focus-visible ring (it relies on the browser default outline, which is effectively invisible on this light UI). These are the only interactive elements on otherwise static pages, so the missing pressed + focus states are felt acutely. btn-secondary likewise has no :active or focus ring.
  - **Evidence:** index.css:97-111 (.btn-primary defines :before/:hover only; .btn-secondary hover only; neither has :active or focus-visible); used at ChangeManagementService.tsx:141-148
  - **Fix:** Add :active (e.g. translate-y-px / scale-[0.98]) and a visible focus-visible ring to both button classes in the design system. This is foundation-level but the service pages are where the CTA lives, so it materially affects them.
  - **Rule:** _Real states: :active/pressed + visible focus ring_
- **🔴 HIGH · Component Patterns** — CTA intent and hierarchy is inconsistent across the family, which is a conversion/usability tell. Five pages make 'Book a Discovery Call / Confidential Call / Check Availability' the PRIMARY and the assessment the secondary; PsychometricAssessmentsService flips it — 'Try the Free Assessment' is primary and 'Book a Discovery Call' is secondary. So the same two actions swap visual weight depending on page, and 'Book a Discovery Call' vs 'Take the Free Assessment' are two CTAs competing on most pages.
  - **Evidence:** ChangeManagementService.tsx:141-148 (booking primary, assessment secondary) vs PsychometricAssessmentsService.tsx:112-119 (assessment primary, booking secondary); WorkshopsService.tsx:124-131 ('Check Availability' primary, 'View All Services' secondary)
  - **Fix:** Lock one primary intent per page and keep the booking-vs-assessment hierarchy consistent across the family unless there is a deliberate reason (psychometric leading with assessment is defensible, but then make that an intentional, documented exception, not an accidental swap). Demote the non-primary action to a text link to reduce two-button competition.
  - **Rule:** _No two CTAs with the same intent on a page / single CTA intent (landing standard)_
- **🟠 MED · Color & Surfaces** — The locked accent is the blue --primary, but the 'why it fails' problem cards introduce a second hue — text-amber-500 AlertTriangle icons — on 4 of the 6 pages. It is a small dose, but it is a second accent color appearing on most pages and slightly breaks the color-consistency lock.
  - **Evidence:** ChangeManagementService.tsx:71 (text-amber-500), LeadershipDevelopmentService.tsx:69, ExecutiveCoachingService.tsx:69, PsychometricAssessmentsService.tsx:69; visible amber triangles in services-change-management__desktop-full.png
  - **Fix:** Either commit to a single accent (use a muted/neutral icon or the primary for the problem list and signal 'problem' through copy/weight) or formalize amber as a deliberate semantic 'warning' token used consistently. Avoid an ad-hoc second color that only shows up in one section.
  - **Rule:** _More than one accent color / Color-consistency lock_
- **🟠 MED · Layout** — Section structure is rigidly symmetrical and flat across all pages: centered max-w container, vertically stacked sections, and a centered CTA card. The card grids are the generic equal-column pattern (2-up on Leadership/Workshops, 3-up on Speaking Formats) with no zig-zag, overlap, asymmetry, or depth. Nothing breaks the grid; pages feel like a CMS template.
  - **Evidence:** LeadershipDevelopmentService.tsx:108-126 (md:grid-cols-2 equal cards), SpeakingService.tsx:182-205 (md:grid-cols-3 equal cards); services-workshops__desktop-full.png and services-speaking__desktop-full.png
  - **Fix:** Introduce asymmetry/depth on at least the hero and one content section (offset columns, an image bleed, a 2-col zig-zag for 'how it works', or overlapping cards). Vary the layout between sections so the page reads as designed, not generated.
  - **Rule:** _Everything centered and symmetrical / Three equal card columns_
- **🟠 MED · Iconography** — Icons are 100% lucide (AlertTriangle, CheckCircle, ArrowRight, ExternalLink, Users, Globe, Lightbulb) — the default AI icon set — and several use cliche metaphors: Lightbulb = 'ideas/insight', Globe = 'behavioral design at scale', Users = 'leadership' on the Speaking talks. CheckCircle is also reused for two different meanings (approach steps AND 'who it's for' bullets), flattening hierarchy.
  - **Evidence:** SpeakingService.tsx:105/112/119 (Lightbulb/Users/Globe per talk), ChangeManagementService.tsx:100 & :123 (CheckCircle reused for approach steps and audience list); visible in services-speaking__desktop-full.png
  - **Fix:** Move to a more distinctive set (Phosphor/Heroicons or a small custom mark) and pick less literal metaphors; or drop decorative talk icons entirely and lean on typographic hierarchy. Standardize one stroke weight.
  - **Rule:** _Lucide/Feather exclusively / cliche metaphor icons_
- **🟠 MED · Component Patterns** — The .glass-card (white bg + border + shadow-lg + rounded-2xl) is used for everything on these pages — problem cards, who-it's-for, format grids, the speaker bio, and the CTA — so elevation no longer communicates hierarchy; it is just the default container. Combined with identical 'Start With a Conversation' CTA cards on 4 pages, the family looks templated.
  - **Evidence:** Repeated glass-card usage e.g. ChangeManagementService.tsx:70, :122, :134; ExecutiveCoachingService.tsx:105 ('Start With a Conversation' heading duplicated verbatim on Change Mgmt :135 and Leadership :132)
  - **Fix:** Reserve elevated cards for elements that genuinely need to float (the CTA), and use spacing/dividers/background tints for the rest. Differentiate the closing CTA per page (heading + layout) so the six pages don't share a copy-pasted footer block.
  - **Rule:** _Generic card look (border + shadow + white background)_
- **🟠 MED · Strategic Omissions** — Most pages have no in-body 'back to all services' path. Workshops and Speaking include a 'View All Services' secondary button in their CTA, but Change Management, Leadership, Executive Coaching, and Psychometric Assessments offer no breadcrumb or back link within the page body — the only way back to the service index is the top nav. For deep-linked landing traffic this is a soft dead end and breaks cross-sell.
  - **Evidence:** WorkshopsService.tsx:128 and SpeakingService.tsx:222 have 'View All Services'; ChangeManagementService.tsx, LeadershipDevelopmentService.tsx, ExecutiveCoachingService.tsx, PsychometricAssessmentsService.tsx have no equivalent link/breadcrumb
  - **Fix:** Add a consistent breadcrumb (Services / <name>) near the hero tag and/or a 'See all services' link in every page's CTA so all six behave the same and offer onward navigation.
  - **Rule:** _No 'back' navigation / dead ends in flows_
- **🟠 MED · Typography** — Display headings lack presence beyond raw size. heading-xl gets tracking-tight but heading-lg / heading-md have leading-tight only and no tracking, all in Inter bold — so section titles read as generic bold sans. There is no editorial treatment (no tightened tracking at large sizes, no contrast in weight/style) to make the H1s feel intentional rather than default.
  - **Evidence:** index.css:117-127 (heading-lg/heading-md have no tracking); rendered H1 in services-speaking__desktop-hero.png reads as plain bold Inter
  - **Fix:** Add negative tracking to large headings, consider a display face for H1s, and create more weight/size contrast. (Font-is-Inter-everywhere is a foundation issue; here the issue is these large display headings get no compensating treatment.)
  - **Rule:** _Headlines lack presence (size/tracking/leading)_
- **🟠 MED · Interactivity & States** — These pages are entirely static — no scroll reveals, no staggered entry, no motion on the card grids or list rows. For a premium marketing surface the total absence of motion (combined with flat backgrounds) makes the pages feel unfinished and template-like. The only animation anywhere is the button hover shimmer.
  - **Evidence:** All six source files render content with no transition/animation classes on sections, cards, or list items; services-leadership-development__desktop-full.png / services-speaking__desktop-full.png are flat static layouts
  - **Fix:** Add restrained scroll-in reveals (opacity + small translateY, staggered) for cards and list rows, and consider a subtle parallax or image treatment in the hero. Keep it tasteful and GPU-accelerated (transform/opacity).
  - **Rule:** _Staggered entry / scroll-driven reveals (motion upgrade)_
- **🟡 LOW · Content** — The closing CTA copy is near-duplicated across the family: four pages use the H2 'Start With a Conversation' (or near-variant) and the same 'Book a free 30-minute discovery call ... No commitment, no pitch' framing. It reads as a templated block rather than copy written for each service.
  - **Evidence:** ChangeManagementService.tsx:135-139, LeadershipDevelopmentService.tsx:132-136, ExecutiveCoachingService.tsx:105-109 (all 'Start With a Conversation'-style + discovery-call body)
  - **Fix:** Write a distinct closing line per service that ties back to that page's specific promise; vary the heading so the six CTAs are not visibly copy-pasted.
  - **Rule:** _Templated/duplicated copy across pages_
- **🟡 LOW · Accessibility** — The Speaker portrait uses alt="Erik Bohjort" — just the name with no descriptive context. It is not empty, so this is minor, but for a meaningful portrait a short descriptive alt is better, and the name alone is what a sighted user already gets from the adjacent H2.
  - **Evidence:** SpeakingService.tsx:62-66 (img src="/erik-portrait.jpg" alt="Erik Bohjort")
  - **Fix:** Use a more descriptive alt, e.g. 'Erik Bohjort, licensed psychologist, headshot', or keep it concise but ensure it adds information beyond the visible heading.
  - **Rule:** _Missing/weak alt text on meaningful images_

---

## Consulting / niche SEO pages (family of 7)

**Route:** `/consulting/* — 7 pages`

> Family of 7 SEO/niche landing pages (route /consulting/*) all rendered by one shared template, src/components/NichePage.tsx. The structure is sound and the prose is genuinely strong, specific, on-topic, and free of Lorem Ipsum or fake John-Doe data, which is rare and worth crediting. SEO/structuredData (Service schema, real founder, areaServed) is well done. However, all 7 pages are VISUALLY AND STRUCTURALLY IDENTICAL: same hero-with-no-CTA, same 2x2 challenge grid of generic white glass-cards, same stacked solution cards, same centered Title-Case section headers, same Lucide AlertTriangle/CheckCircle/Quote icon set, and the same bottom CTA pair (Book a Free Discovery Call + Take the Change Readiness Assessment) with the same H2 'Ready to Start Your Transformation?'. This is a duplicate-template thin-content and repeated-CTA-intent risk: a search engine and a visitor jumping between two of these pages see the same page with words swapped. The hero is a large near-empty band with NO call to action, no imagery, and no scrim, so the only conversion point sits at the very bottom of a long scroll. Body copy is riddled with em-dashes (encoded \u2014), which the brief explicitly bans for UI copy, and every heading is Title Case. The challenge icons are amber while the rest of the page is blue, breaking the single-accent lock. Depth is also inconsistent across the family: Stockholm and Manufacturing include a case study, while Healthcare, Europe, Org-Psych, Sustainability, and Merger omit it, so some pages are noticeably thinner. Most issues live once in NichePage.tsx and the per-page prop files, so fixes propagate to all 7 at once.

**12 findings** — 3 high · 6 medium · 3 low

- **🔴 HIGH · Strategic Omissions** — Hero has no call-to-action and no visual. The hero renders only a tag, an H1, and a subheadline inside a tall section (pt-12 pb-16 sm:pt-16 sm:pb-24) leaving a large empty band; the only CTAs on the entire page are at the very bottom after challenge+solution+(optional case study) sections. A high-intent visitor landing from search has nothing to click above the fold.
  - **Evidence:** NichePage.tsx:115-123; consulting-change-management-stockholm__desktop-hero.png (empty lower two-thirds of hero)
  - **Fix:** Add a primary CTA (the same Book a Free Discovery Call) directly in the hero, plus a supporting trust signal (licensed-psychologist line or a metric). Tighten the empty vertical space or add a masked background image / portrait so the hero has presence instead of dead area.
  - **Rule:** _No back navigation / strong hero (taste-skill landing: strong hero, single CTA above the fold)_
- **🔴 HIGH · Content** — Em-dashes throughout body copy. The shared and per-page copy uses em-dashes (encoded as \u2014) repeatedly, e.g. 'onboarding documents\u2014it requires', 'zero tolerance...will be rejected\u2014and clinicians', 'each with its own culture\u2014must navigate'. The brief explicitly bans em-dashes in UI copy and treats it as a high-severity AI-slop tell.
  - **Evidence:** ChangeManagementStockholm.tsx:27,40,45; HealthcareChangeManagement.tsx:17,27,32,50; ManufacturingChangeManagement.tsx:22,27,45
  - **Fix:** Replace every \u2014 with a comma, period, or restructured sentence across all 7 niche prop files. Do a project-wide sweep so no UI string ships an em-dash.
  - **Rule:** _Em-dash ban in UI copy_
- **🔴 HIGH · Content** — Duplicate-template thin content and repeated CTA intent across 7 pages. All 7 /consulting/* pages share NichePage.tsx, so they are byte-for-byte identical in layout, the same H2 'Ready to Start Your Transformation?', the same primary CTA 'Book a Free Discovery Call' and the same secondary CTA 'Take the Change Readiness Assessment'. Only the injected strings differ. For an SEO family this is a near-duplicate / doorway-page pattern, and for a visitor browsing two of them it reads as the same page reskinned.
  - **Evidence:** NichePage.tsx:228-259 (hardcoded CTA section identical for every page); identical structure visible across consulting-*__desktop-full.png (all 7)
  - **Fix:** Differentiate per niche: vary the CTA headline/label to the niche (e.g. 'Talk through your healthcare rollout'), add at least one niche-unique module (industry stat band, named mini-case, or relevant logos), and vary section ordering/visual treatment so each page is genuinely distinct rather than a string swap.
  - **Rule:** _No two CTAs with same intent / duplicate-template thin content_
- **🟠 MED · Color & Surfaces** — Second accent color breaks the single-accent lock. The page is otherwise locked to one blue (--primary 220 80% 48%) used for tag, solution icons, case-study chip, and CTA, but every challenge card uses amber (bg-amber-500/10 + text-amber-500 AlertTriangle). That introduces a competing warm hue purely for decoration.
  - **Evidence:** NichePage.tsx:137-138; visible amber triangles in consulting-healthcare-change-management__desktop-full.png challenge grid
  - **Fix:** Drop amber and render challenge icons in a neutral/muted tone or a desaturated single-accent tint, reserving color for the action path. Keep one accent across the whole page.
  - **Rule:** _Color-consistency lock (one accent across the page)_
- **🟠 MED · Content** — Title Case on every header. The H1, every section H2 ('The Stockholm Challenge', 'How CLEAR Fits the Nordic Context', 'Ready to Start Your Transformation?'), and every card H3 ('Consensus Culture Slows Change', 'Built for Consensus Culture') are Title Case. The redesign checklist calls for sentence case.
  - **Evidence:** ChangeManagementStockholm.tsx:12,15,38; NichePage.tsx:235; visible in all consulting-*__desktop-full.png
  - **Fix:** Switch headlines, section titles, and card titles to sentence case across the prop files. Keep only the CLEAR acronym and proper nouns capitalized.
  - **Rule:** _Title Case On Every Header_
- **🟠 MED · Interactivity & States** — No :active/pressed state on the primary CTA. .btn-primary defines hover (a white sweep via :before) but no :active or pressed feedback, so clicks feel inert. This affects the only conversion button on all 7 pages.
  - **Evidence:** src/index.css:97-107 (btn-primary, btn-primary:before, btn-primary:hover:before — no active rule); btn-secondary index.css:109-111 also has no active state
  - **Fix:** Add active:scale-[0.98] / active:translate-y-px (and a slightly darker bg) to both .btn-primary and .btn-secondary for physical press feedback.
  - **Rule:** _No active/pressed feedback_
- **🟠 MED · Component Patterns** — Generic three/four equal-card grid plus generic card look. The challenge section is a uniform 2x2 grid of identical white .glass-card (border + shadow + white bg), and the solution section is a vertical stack of the same card with a decorative left accent bar. This is the most generic AI landing layout and gives every page the same flat rhythm.
  - **Evidence:** NichePage.tsx:129-149 (challenge grid), 157-179 (solution cards), 164-165 (decorative bg-primary bars); consulting-manufacturing-change-management__desktop-full.png
  - **Fix:** Break the grid: use a 2-column zig-zag or an asymmetric/numbered list for challenges, reduce reliance on bordered white cards (use spacing or a tinted surface), and vary the treatment between challenge and solution sections so the page does not read as four identical card rows.
  - **Rule:** _Three equal card columns as feature row / generic card look (border + shadow + white)_
- **🟠 MED · Layout** — Everything centered and symmetric. Every section header is heading-md text-center, content is mx-auto max-w-* centered, and the CTA block is text-center. Combined with identical top/bottom padding this produces a monotonous, perfectly symmetrical column with no asymmetry or focal variation.
  - **Evidence:** NichePage.tsx:128,156,233 (text-center headers + centered containers); consulting-change-management-europe__desktop-full.png
  - **Fix:** Left-align section headers over the content, introduce an offset or asymmetric layout for at least one section, and optically increase bottom padding. Let one element (hero or CTA) dominate via whitespace.
  - **Rule:** _Everything centered and symmetrical_
- **🟠 MED · Content** — Inconsistent depth across the family. Stockholm and Manufacturing render a case study; Healthcare, Europe, Organizational-Psychology, Sustainability, and Merger pass no caseStudy, so the section is silently omitted and those pages are shorter and thinner. The family lacks consistent proof.
  - **Evidence:** NichePage.tsx:184-226 (caseStudy gated by `&&`); HealthcareChangeManagement.tsx has no caseStudy prop (compare consulting-healthcare-change-management__desktop-full.png — no case block — vs consulting-change-management-stockholm__desktop-full.png which has one)
  - **Fix:** Give every niche page at least one proof module (case excerpt, named metric, or testimonial). If a real case is unavailable, substitute an industry-relevant outcome stat so depth is consistent and no page reads as a stub.
  - **Rule:** _Strategic omissions / proof consistency_
- **🟡 LOW · Iconography** — Lucide icons used exclusively with cliche metaphors. Imports are all Lucide (ArrowRight, CheckCircle, AlertTriangle, Quote), and the metaphors are the default ones: warning-triangle = 'challenge', check-circle = 'solution', quote-mark = 'case study'. This is the stock AI icon choice and adds nothing distinctive.
  - **Evidence:** NichePage.tsx:3 (import), 138/168/193 (icon usage)
  - **Fix:** Move to a differentiated set (Phosphor/Heroicons or custom) and pick less obvious marks, or drop icons in favor of numbered steps. Standardize one stroke weight.
  - **Rule:** _Lucide or Feather icons exclusively / cliche metaphors_
- **🟡 LOW · Typography** — Display headline lacks distinct presence. heading-xl is Inter (display stack is 'SF Pro Display','Inter var' which on most machines falls back to Inter) with default tracking-tight at 700; the large H1 reads as plain bold sans with no character. The whole family inherits the same flat type voice.
  - **Evidence:** src/index.css:117-119 (.heading-xl); tailwind.config.ts:69-70 (sans/display both resolve to Inter var); consulting-change-management-stockholm__desktop-hero.png
  - **Fix:** Foundation-level, but for these high-value landing pages give the H1 more presence: a display face with character, tighter tracking and leading-[1.05], and apply text-wrap:balance to avoid the awkward two-line break ('Consulting / in Stockholm').
  - **Rule:** _Headlines lack presence / not Inter everywhere_
- **🟡 LOW · Code Quality** — Reveal animation is JS+setTimeout on opacity-0 content. Every section mounts with opacity-0 and is revealed via setTimeout adding animate-fade-in(-up). If JS is slow or disabled the primary content stays invisible, and it causes a staggered flash on each navigation. For SEO landing pages this is a fragile pattern.
  - **Evidence:** NichePage.tsx:62-103 (useEffect setTimeout chain), 117/134/162/189/233 (opacity-0 on content)
  - **Fix:** Drive reveals with IntersectionObserver or CSS-only animations that default to visible (animate from opacity, but never leave content at opacity-0 without a guaranteed trigger), or respect prefers-reduced-motion and render content visible by default.
  - **Rule:** _Animations / no-JS resilience (real states)_

---

## Framework

**Route:** `/framework`

> The /framework page explains Lewin's Unfreeze-Change-Refreeze model with an interactive 3-stage tab/detail panel. The interaction model is genuinely useful (selectable stages, progress bar, prev/next), the copy is real and substantive (no Lorem Ipsum, no fake stats), the page uses semantic <section> wrappers, and the cookie banner is present. The biggest problems are: (1) a color-consistency break — the stages section introduces raw Tailwind blue-500/amber-500/green-500 that neither match the brand --primary blue nor stay within one locked accent, and the amber/green stage titles fail WCAG AA contrast on white; (2) a weak, empty hero with no imagery and no CTA, leaving a large void on desktop and a single buried CTA only at the very bottom; (3) the in-card 'Previous Stage'/'Next Stage' controls are bare text buttons with no hover/active/focus states, and the tab pattern has no ARIA roles or focus rings; (4) heavy repetition of the generic .glass-card and a dead, near-duplicate LewinModel.tsx component. Type hierarchy is flat (display h1 falls back to Inter with no extra presence) and headers are Title Case.

**13 findings** — 4 high · 6 medium · 3 low

- **🔴 HIGH · Color & Surfaces** — The Three Stages section introduces three new raw Tailwind accents — text-blue-500/bg-blue-500, text-amber-500/bg-amber-500, text-green-500/bg-green-500 — used for icons, stage titles, progress bars and bullet dots. This breaks the one-accent lock. Worse, the 'Unfreeze' blue-500 (#3b82f6) is NOT the brand --primary (hsl 220 80% 48% ≈ #1e5fd9 used by the nav, the 'First Listen' tag and the 'Next Stage' link), so even the blue stage clashes with the brand blue sitting a few pixels away. This is exactly the multi-color CLEAR-phase palette the brief warns about.
  - **Evidence:** src/pages/Framework.tsx:13-14,18-19,27-28 (color/bgColor per stage); src/index.css:17 (--primary 220 80% 48%); framework__desktop-full.png (Unfreeze panel blue vs nav/tag blue)
  - **Fix:** Lock one accent across the page. Map the three stages to tints/shades of the brand --primary (or to the already-defined --phase-c/--phase-l/--phase-e CSS vars) instead of literal blue-500/amber-500/green-500, and make the active 'Unfreeze' state use the exact --primary token so it matches the nav and tag.
  - **Rule:** _Color-consistency lock: one accent locked across the whole page (watch the 5-color CLEAR phase palette)_
- **🔴 HIGH · Accessibility** — The large stage title is rendered as text-2xl font-bold in text-amber-500 (#f59e0b ≈ 1.9:1 on the white card) and text-green-500 (#22c55e ≈ 1.8:1) — both fail the WCAG AA 3:1 minimum for large/UI text. The amber/green also reappear as the only color carrying meaning on bullet dots and the progress bar.
  - **Evidence:** src/pages/Framework.tsx:215-221 (text-2xl font-bold colored title); framework__desktop-full.png (orange 'Unfreeze'/amber heading on white)
  - **Fix:** Do not use 500-weight greens/ambers as text on white. Use a darker shade for the heading text (e.g. amber-700/green-700) or keep the heading in foreground and carry the stage color only on a solid chip/icon background that already passes contrast.
  - **Rule:** _Button & form contrast must meet WCAG AA (4.5:1 body, 3:1 large/UI)_
- **🔴 HIGH · Layout** — The hero is nearly empty: an 'First Listen' tag, an h1, and one line of body sit at roughly the top third, followed by a large blank void before the intro card scrolls into view. There is no hero imagery, no supporting visual, and no call to action — the section reads as unfinished on a marketing/landing surface.
  - **Evidence:** framework__desktop-hero.png (large empty area below the one-line subhead); src/pages/Framework.tsx:126-136
  - **Fix:** Give the hero presence: add a supporting visual (a small Unfreeze→Change→Refreeze diagram, an ambient gradient/photo at low opacity, or pull the interactive model up into the hero) and a primary CTA so the fold does real work instead of leaving dead space.
  - **Rule:** _Landing standard: strong hero_
- **🔴 HIGH · Interactivity & States** — The in-card 'Previous Stage' and 'Next Stage' controls are bare text buttons with only a color transition — no hover background, no :active/pressed feedback, and no visible focus ring. The three stage-selector <button>s likewise have a hover bg only when inactive and no focus-visible ring. Keyboard users get no indication of focus anywhere in the primary interaction.
  - **Evidence:** src/pages/Framework.tsx:284-302 (Prev/Next text buttons); src/pages/Framework.tsx:167-173 (stage buttons, no focus styles)
  - **Fix:** Add focus-visible:ring-2 ring-ring to all buttons, an :active scale(0.98)/translateY(1px) press state, and a hover background on the Prev/Next controls. The .btn-primary CTA also still lacks an :active state (Foundation).
  - **Rule:** _Real states: hover AND :active/pressed, visible focus ring_
- **🟠 MED · Strategic Omissions** — The page's only real conversion CTA ('Book a Consultation') lives in the very last section; the hero offers no action at all. A long explanatory page with the ask buried at the bottom loses readers who don't scroll to the end.
  - **Evidence:** src/pages/Framework.tsx:318-321 (only Link/btn-primary on the page); framework__desktop-full.png (CTA only in final card)
  - **Fix:** Add a primary CTA in the hero (or a persistent secondary CTA) with the same intent, so the action is available above the fold and reinforced at the bottom.
  - **Rule:** _Landing standard: single CTA intent, present at the fold_
- **🟠 MED · Accessibility** — The stage list functions as a tab set (clicking a stage swaps the detail panel on the right) but is implemented as a plain group of <button>s with no role="tablist"/role="tab"/aria-selected and no aria-controls linking to the panel. Screen-reader and keyboard users cannot perceive the selected-tab relationship.
  - **Evidence:** src/pages/Framework.tsx:163-195 (stage list) and 197-304 (detail panel)
  - **Fix:** Wire the pattern up as ARIA tabs: role="tablist" on the list, role="tab" + aria-selected + aria-controls on each button, role="tabpanel" + matching id on the detail panel, and arrow-key navigation.
  - **Rule:** _Code Quality: semantic HTML / accessible interactive patterns_
- **🟠 MED · Component Patterns** — The same generic .glass-card (bg-white/95 + border + shadow-lg + rounded-2xl) is reused for the intro block, the stage detail panel, and the CTA block, and again as the active-state for the stage selector — every surface on the page is the identical white card. There is no hierarchy from elevation; it reads as a stack of identical boxes.
  - **Evidence:** src/pages/Framework.tsx:141,198,312 (.glass-card); src/index.css:77-79 (.glass-card definition); framework__desktop-full.png
  - **Fix:** Differentiate surfaces: let the intro be plain text on the page background, reserve the card/elevation for the one interactive panel, and give the CTA a distinct treatment (tinted background or accent border) rather than a fourth identical glass-card.
  - **Rule:** _Component Patterns: generic card look (border + shadow + white background)_
- **🟠 MED · Code Quality** — src/components/LewinModel.tsx is a dead, near-identical duplicate of the Framework stages section (same stages array, same layout, same color logic) and is not imported anywhere. It also contains leftover empty markup (two empty <div className="flex items-center gap-2"> blocks at lines 120-123) and an auto-advance setInterval. Maintaining two divergent copies of the same UI invites drift.
  - **Evidence:** src/components/LewinModel.tsx:4-31 (duplicated stages) and 120-123 (empty divs); no import found for LewinModel in the codebase
  - **Fix:** Delete LewinModel.tsx if unused, or extract a single shared <StageExplorer> component consumed by both the home preview and /framework so the stages data and styling live in one place.
  - **Rule:** _Code Quality: commented-out / dead code; DRY_
- **🟠 MED · Code Quality** — Reveal animation is implemented via imperative setTimeout chains that set element.style.opacity='1' and add animate-fade-in classes after fixed delays (100/300/500ms). This couples content visibility to JS timers — if JS is slow or fails the content can stay at opacity:0 (the inline style sets opacity '0' as the default), and it bypasses React's declarative model with direct DOM mutation.
  - **Evidence:** src/pages/Framework.tsx:91-113 (setTimeout opacity hack) and inline style={{opacity:'0'}} on lines 128,141,160
  - **Fix:** Drive reveals with CSS (IntersectionObserver toggling a class, or animation on mount) and avoid defaulting visible content to opacity:0 gated behind a JS timer; ensure content is visible if animations never run.
  - **Rule:** _Code Quality: avoid fragile imperative DOM/animation hacks_
- **🟠 MED · Typography** — The hero h1 'Lewin's Change Model' is large but lacks display presence: the display stack is SF Pro Display, Inter var — SF Pro Display is not a bundled webfont so it renders in Inter var with only leading-tight/tracking-tight from heading-xl. No heavier optical weight, no editorial tracking, and the single-line subhead at body-lg max-w-3xl is the only support, so the type hierarchy reads flat for a hero.
  - **Evidence:** tailwind.config.ts:70 (display: SF Pro Display, Inter var); src/index.css:117-119 (.heading-xl); framework__desktop-hero.png
  - **Fix:** Either bundle the intended display face or pick a distinctive display font with real character (Geist/Outfit/Cabinet Grotesk), and push the hero h1 with tighter tracking and more deliberate scale so it does not read as default Inter.
  - **Rule:** _Typography: display headings need presence; not Inter-everywhere_
- **🟡 LOW · Content** — Section headers use Title Case throughout — 'The Power of Listening in Change', 'The Three Stages', 'Apply the Model to Your Challenges' — rather than sentence case.
  - **Evidence:** src/pages/Framework.tsx:142,161,313
  - **Fix:** Switch headers to sentence case (e.g. 'The power of listening in change', 'The three stages') for a less templated, more editorial tone.
  - **Rule:** _Content: Title Case On Every Header_
- **🟡 LOW · Typography** — Body copy uses max-w-3xl (768px). At body-lg (text-lg) the hero subhead and the intro paragraphs run well past the ~65-character comfortable measure, hurting readability of the longer intro block.
  - **Evidence:** src/pages/Framework.tsx:131 (body-lg max-w-3xl) and 141 (intro card max-w-3xl); src/index.css:129-131
  - **Fix:** Constrain reading paragraphs to roughly max-w-prose / ~65ch (max-w-2xl or a measure cap) rather than 768px of full-width text.
  - **Rule:** _Typography: body <= ~65ch_
- **🟡 LOW · Layout** — Every block on the page is centered and symmetrical — centered 'The Three Stages' heading, centered CTA card, mirrored intro card (mx-auto) — and vertical padding is largely symmetric. The composition is the generic centered-stack with no asymmetry or visual rhythm break.
  - **Evidence:** src/pages/Framework.tsx:161 (text-center), 312 (text-center CTA), 141 (mx-auto); framework__desktop-full.png
  - **Fix:** Introduce some asymmetry (left-aligned section headers over the interactive panel, an offset intro, or a 2-column intro with a supporting visual) so the page does not read as a stack of centered cards.
  - **Rule:** _Layout: everything centered and symmetrical_

---

## Methodology

**Route:** `/methodology`

> The /methodology page is content-strong and well-organized: the CLEAR framework is clearly explained, the copy is specific and non-cliche (no 'Elevate/Seamless/Unleash'), the comparisons section adds real differentiation, and the active nav state is correct. It is, however, visually generic and under-designed for a marketing surface. The hero is nearly empty (a tag, an H1, and three lines of body sit in a max-w-7xl container with ~400px of dead vertical space and no supporting visual), so it lacks presence. The page is then 9 near-identical .glass-card white boxes stacked vertically with the same blue icon-in-a-circle medallion repeated four times. The most striking miss: a per-phase CLEAR color system (--phase-c..r, 5 distinct hues) already exists in tokens and the data carries Unfreeze/Change/Refreeze phases, yet every one of the five step cards uses the same --primary blue accent bar and icon, so the five steps and the Lewin phase grouping read as undifferentiated. The Unfreeze-Change-Refreeze model promised in the hero is never visualized. Em-dashes appear in visible UI copy including the step titles. Typography is Inter/SF-Pro-Display (display font barely differs from body), headers are Title Case throughout, and icons are all default Lucide (Brain for behavioral science is a literal cliche).

**11 findings** — 3 high · 4 medium · 4 low

- **🔴 HIGH · Layout** — The hero is almost entirely empty. A small 'Methodology' tag, the H1, and a 3-line paragraph sit at the top-left of a full-width max-w-7xl container, leaving roughly 400px of blank space below before the 'Foundations' card edges into view. There is no supporting visual, diagram, or secondary element. For a marketing/landing surface this hero has no presence and feels unfinished.
  - **Evidence:** methodology__desktop-hero.png; Methodology.tsx:120-130 (section pt-12 pb-16 with only tag + h1 + p)
  - **Fix:** Give the hero a job: add a visual anchor on the right (a CLEAR cycle/Lewin Unfreeze-Change-Refreeze diagram, the 5-phase ring, or an abstract systems-map graphic), constrain the text column, and reduce the empty bottom band. Consider a primary CTA in the hero so the page is not a single CTA at the very bottom.
  - **Rule:** _Empty, flat sections with no visual depth / Strong hero (landing standard)_
- **🔴 HIGH · Color & Surfaces** — A per-phase CLEAR color system already exists in tokens (--phase-c 220, --phase-l 172, --phase-e 145, --phase-a 43, --phase-r 351) and each step carries an Unfreeze/Change/Refreeze phase, but every one of the five step cards renders the same --primary blue accent bar and the same blue icon. The five steps are visually indistinguishable and the Lewin phase grouping is invisible. The design either should commit to the locked single accent OR use the phase palette intentionally — right now it does neither (defines five colors, ships one).
  - **Evidence:** methodology__desktop-full.png (five identical cards); Methodology.tsx:163-164 (bg-primary/20 + bg-primary bar) and 167-169 (icon text-primary) for all steps; index.css:48-52 (unused --phase-c..r)
  - **Fix:** Map each step's accent bar, icon tint, and phase tag to its --phase-* color, and visually band the three Lewin phases (e.g. group/label Unfreeze, Change, Refreeze). This makes the five steps scannable and turns the existing token system into a real design system instead of dead CSS.
  - **Rule:** _Color-consistency lock / Real design system (one accent OR an intentional system, not five defined and one used)_
- **🔴 HIGH · Content** — Em-dashes appear in visible UI copy. The most prominent is the step-card heading separator 'C — Clarity of Objectives' (rendered on every step card), plus em-dashes inside displayed prose in the step descriptions and the comparison blurbs. Em-dashes are a banned AI-slop tell in UI copy.
  - **Evidence:** methodology__desktop-full.png (card titles 'C — Clarity of Objectives' etc.); Methodology.tsx:172 (visible title separator), 50, 62, 74, 86, 90, 198 (em-dashes in shown copy)
  - **Fix:** Replace the title separator with a colon, a middot, or layout (letter badge + title) rather than ' — '. In prose, rewrite em-dash clauses as separate sentences or use commas/parentheses.
  - **Rule:** _Em-dash ban in UI copy_
- **🟠 MED · Component Patterns** — The entire page is built from nine near-identical .glass-card white boxes stacked vertically (Foundations, five steps, Cyclical, Comparisons, CTA). The generic card look (white bg + border + shadow + 0.75rem-ish radius) is repeated without any elevation hierarchy, so nothing stands out and the page reads as a stack of templated panels.
  - **Evidence:** methodology__desktop-full.png; Methodology.tsx:136, 162, 190, 206, 224 (every section is glass-card); index.css:77-79
  - **Fix:** Reserve the card surface for content that actually needs elevation. Render the step list as a connected timeline/spine (it is sequential), drop the box around Foundations/Cyclical (use spacing + a rule instead), and let the CTA be the one elevated surface. Vary radius (tighter inner chips, softer outer).
  - **Rule:** _Generic card look (border + shadow + white background)_
- **🟠 MED · Iconography** — Icons are exclusively Lucide (the default AI set), each shown in the same bg-primary/10 circular medallion repeated four times across section headers. Several are literal-metaphor cliches: Brain for 'behavioral science / Foundations', GitCompareArrows for 'How CLEAR Compares', Repeat for 'CLEAR Is Cyclical'.
  - **Evidence:** methodology__desktop-full.png (blue circle + brain, etc.); Methodology.tsx:4-16 (all lucide-react), 138-139, 167, 192, 208
  - **Fix:** Differentiate the icon set (Phosphor/Heroicons or a small custom set) and standardize one stroke weight; replace the most literal metaphors (Brain, Repeat). Vary the medallion treatment instead of the same blue circle four times.
  - **Rule:** _Lucide or Feather icons exclusively / Cliche metaphors_
- **🟠 MED · Strategic Omissions** — The hero promises the page is 'Built on Lewin's Unfreeze-Change-Refreeze model', and the data carries a phase per step, yet the model is never visualized. The phase only appears as a tiny per-card 'Unfreeze Phase' tag, with no grouping, no diagram, and no sense of the three-stage arc. The single most distinctive conceptual hook of the methodology is left as plain text.
  - **Evidence:** Methodology.tsx:126-127 (claim), 171 (phase shown only as a tag); methodology__desktop-full.png
  - **Fix:** Add a compact Unfreeze -> Change -> Refreeze diagram (or band the five steps into the three phases visually) so the Lewin foundation is shown, not just asserted. This doubles as the hero visual.
  - **Rule:** _Strategic omissions (show the core concept, don't just assert it)_
- **🟠 MED · Layout** — Layout is centered and symmetric throughout: 'The Five Steps' and 'Ready to Apply CLEAR?' headings centered, CTA centered, and every step card is the same full-width stacked block. The five sequential steps are presented as a plain vertical list with no progression cue (numbering, connector line, or staggered/asymmetric rhythm), which is the most generic possible treatment for an ordered process.
  - **Evidence:** methodology__desktop-full.png; Methodology.tsx:158 (text-center heading), 160-187 (uniform vertical stack), 224 (text-center CTA)
  - **Fix:** Break symmetry: left-align section headers over the content, and render the five steps as a vertical timeline with a connecting spine and step index, or a zig-zag, so the sequence and momentum are legible.
  - **Rule:** _Everything centered and symmetrical / Three equal cards (here: equal stacked rows)_
- **🟡 LOW · Content** — Headers use Title Case throughout: 'The Five Steps', 'CLEAR Is Cyclical', 'How CLEAR Compares', 'Ready to Apply CLEAR?'. Sentence case reads less templated.
  - **Evidence:** Methodology.tsx:158, 195, 211, 225
  - **Fix:** Switch section headers to sentence case ('The five steps', 'How CLEAR compares', 'Ready to apply CLEAR?'), keeping the CLEAR acronym capitalized.
  - **Rule:** _Title Case On Every Header_
- **🟡 LOW · Typography** — The 'display' font is SF Pro Display falling back to Inter var, while body is Inter var — so on most machines the H1 and body are effectively the same family. The H1 has weight and tight tracking but no real typographic distinction from body, and the page leans on a single sans throughout. Headings could carry more presence (tracking/leading/weight contrast) to feel intentional rather than default.
  - **Evidence:** tailwind.config.ts:69-70 (sans + display both resolve to Inter var); index.css:117-119 (heading-xl), 67-69 (h-tags use font-display)
  - **Fix:** Either ship a distinctive display face (Geist/Outfit/Cabinet Grotesk/Satoshi) for headings, or push the existing display heading further with tighter tracking and heavier weight, so it does not collapse to body Inter on machines without SF Pro.
  - **Rule:** _Inter everywhere / Headlines lack presence (page-level)_
- **🟡 LOW · Component Patterns** — The comparisons list places bg-muted/30 inner cards inside the outer .glass-card (cards inside cards), and the step activities render as low-emphasis muted pills (bg-muted/50, text-foreground/70) with a CheckCircle each — a generic chip pattern with muddy contrast.
  - **Evidence:** Methodology.tsx:214-219 (card-in-card), 176-182 (muted activity pills); methodology__desktop-full.png
  - **Fix:** Drop the inner card border/fill in comparisons (use a divided list or two-column term/definition layout). For activities, increase text contrast and consider a simple checked list rather than wrapped pills.
  - **Rule:** _Cards inside cards / Generic card + low-contrast chips_
- **🟡 LOW · Interactivity & States** — The page's only interactive elements are the two bottom CTAs. btn-primary has a hover wipe but no :active/pressed feedback, and btn-secondary has only transition-colors (no active, no scale). Page makes the global missing-active-state issue visible on its primary conversion point. (Global issue — noted here only because this CTA is the page's sole action.)
  - **Evidence:** Methodology.tsx:231-238; index.css:97-111 (no :active rule on either button)
  - **Fix:** Add a pressed state (active:scale-[0.98] or translateY(1px)) to both button styles so the page's single CTA feels physical.
  - **Rule:** _No active/pressed feedback_

---

## FAQ

**Route:** `/faq`

> The FAQ page is functional, content-rich, and accessible in its bones: real, specific, well-written answer copy (no Lorem, no fake stats), proper FAQPage structured data for SEO, a single clear CTA with one intent ('Get In Touch'), a sensible max-w-3xl reading measure, and min-h-screen (not h-screen). The accent is locked to the brand blue throughout. The core problems are that the page is the textbook generic AI FAQ layout — a single stacked accordion inside a generic white glass-card, plus a second centered glass-card CTA — which the redesign skill explicitly calls out, and that the hero is almost entirely empty dead space because section padding is compounded (the .section-container utility already adds py-16/py-24, and the hero section adds another pt/pb on top). There is also a real semantic bug (an <h3> manually placed inside Radix's own <h3> accordion header, producing nested headings and an out-of-order H1 -> H3 -> H2 outline) and a fragile JS-gated reveal that leaves all content at opacity:0 if the effect never runs. No custom display type, no per-question affordance beyond a hover:underline + chevron, and no search/filter for 10 questions.

**10 findings** — 4 high · 3 medium · 3 low

- **🔴 HIGH · Layout** — The hero is ~60% empty dead space. The hero <section> applies pt-12 pb-16 sm:pt-16 sm:pb-24, but its child .section-container already bakes in py-16 sm:py-24 (index.css:114). The two stack, so there is a massive empty band between the lede and the first accordion card, which only peeks into view at the very bottom of the fold.
  - **Evidence:** faq__desktop-hero.png (huge blank area under the lede); FAQ.tsx:109 (section pt-12 pb-16) combined with index.css:114 (.section-container py-16 sm:py-24)
  - **Fix:** Remove the duplicated vertical padding: drop the per-section pt/pb OR strip the py from .section-container for this composition. Tighten the hero so the first 2-3 FAQ items are visible above the fold, and consider pulling the FAQ card up with a negative top margin to overlap the hero for depth.
  - **Rule:** _Layout > Symmetrical/duplicated vertical padding; Missing whitespace discipline (too much, not too little)_
- **🔴 HIGH · Component Patterns** — The entire page is the most generic AI FAQ pattern: one vertical single-open accordion (Accordion type='single' collapsible) of 10 items, dropped inside a generic border+shadow+white .glass-card, followed by a second centered .glass-card 'Still Have Questions?' CTA. The redesign checklist names accordion FAQ sections specifically as a pattern to replace.
  - **Evidence:** FAQ.tsx:130-144 (single accordion in glass-card) and FAQ.tsx:151 (second glass-card CTA); faq__desktop-full.png
  - **Fix:** Move off the plain accordion: use a two-column category list / searchable help index, or group questions under headings (Framework basics / Comparisons / Engagement) with inline progressive disclosure. At minimum, drop the wrapping glass-card and present questions as a clean ruled list so the page does not read as default shadcn.
  - **Rule:** _Component Patterns > Accordion FAQ sections; Generic card look (border+shadow+white)_
- **🔴 HIGH · Accessibility** — Nested and out-of-order headings. Radix AccordionPrimitive.Header renders an <h3> by default (accordion.tsx:25), and FAQ.tsx then places another <h3> inside the trigger, producing <h3><button><h3>question</h3></button></h3> — an invalid heading nested inside a heading. Additionally the document outline runs H1 (hero) -> H3 x10 (questions) -> H2 ('Still Have Questions?'), so the only H2 appears after ten H3s, skipping a level and breaking sequence.
  - **Evidence:** FAQ.tsx:134 (<h3 className='text-lg font-semibold pr-4'>) rendered inside accordion.tsx:25 (AccordionPrimitive.Header, default h3); CTA H2 at FAQ.tsx:152
  - **Fix:** Remove the manual <h3> inside the trigger and style the question text on a <span>; let Radix Header carry the heading semantics, and set the accordion Header level to h2 so each question is an H2 under the H1. Reorder so heading levels are monotonic (H1 -> H2s).
  - **Rule:** _Code Quality > Semantic HTML / no heading soup; Accessibility > logical heading order_
- **🔴 HIGH · Interactivity & States** — All hero and FAQ content is hidden behind opacity:0 and only revealed by a JS setTimeout that adds animate-fade-in-up and sets opacity='1'. If the effect is delayed, throttled, or fails (JS error, reduced-motion edge cases), the H1, lede, and the entire FAQ card stay invisible — content gated behind script. There is also no prefers-reduced-motion guard.
  - **Evidence:** FAQ.tsx:82-97 (setTimeout reveal) with FAQ.tsx:111 and FAQ.tsx:128 (initial className 'opacity-0')
  - **Fix:** Render content visible by default and use a CSS-only entrance (e.g. @starting-style or an IntersectionObserver that only enhances), so text is present without JS. Wrap any motion in @media (prefers-reduced-motion: reduce){...:none}. Never set the default state of primary content to opacity:0.
  - **Rule:** _Interactivity & States > content must not depend on JS to be visible; respect reduced-motion_
- **🟠 MED · Interactivity & States** — The accordion trigger has no visible focus ring and no :active/pressed feedback. Its className is only 'py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180' — no focus-visible:ring and no active/scale state, so keyboard focus on each question relies on the default UA outline (easily lost on this near-white card) and there is no press affordance. The hover affordance is just underlining a bold heading, which reads cheap.
  - **Evidence:** accordion.tsx:28-31 (no focus-visible: or :active classes); rendered question rows in faq__desktop-full.png
  - **Fix:** Add focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded and an active:opacity-80 / active:translate-y-px to the trigger. Replace hover:underline with a subtle row background tint and rely on the chevron rotation as the open/close cue.
  - **Rule:** _Interactivity & States > visible focus ring + :active/pressed; hover affordance quality_
- **🟠 MED · Color & Surfaces** — The page is one flat off-white field (--background 210 20% 98%) with two white cards and zero texture or depth — no ambient gradient, no imagery, no contrast band. The hero in particular is a large empty light rectangle, which the redesign checklist flags as an unfinished, sterile section.
  - **Evidence:** faq__desktop-full.png and faq__desktop-hero.png (flat near-white throughout); index.css:8 (--background) and .glass-card white on white at index.css:77
  - **Fix:** Add subtle depth: a faint radial/ambient gradient or low-opacity background texture behind the hero, and let the FAQ card sit on it with a tinted (not pure-black) shadow. Even a 3-5% noise overlay or a soft brand-tinted glow breaks the flatness.
  - **Rule:** _Color & Surfaces > empty flat sections with no depth; flat design with zero texture_
- **🟠 MED · Typography** — The hero H1 'Frequently Asked Questions' is the page's one big type moment but uses font-display, which resolves to 'SF Pro Display' -> falls back to 'Inter var' (tailwind.config.ts:70). On any non-Apple device the headline renders in Inter at default tracking, so the display headline has no bundled custom face and little presence beyond bold weight + tracking-tight. This page makes the global Inter-default worse because the headline IS the hero.
  - **Evidence:** FAQ.tsx:113 (h1 heading-xl) -> index.css:118 + tailwind.config.ts:70 (display: ['SF Pro Display','Inter var']) ; faq__desktop-hero.png
  - **Fix:** Self-host a real display face (e.g. Geist, Outfit, Cabinet Grotesk) for h1/h2 so the headline has presence cross-platform, and tune leading/tracking on heading-xl. Do not depend on an OS-only font for the page's largest text.
  - **Rule:** _Typography > display headings need presence; not Inter-everywhere / OS-only fonts_
- **🟡 LOW · Content** — Headings use Title Case ('Frequently Asked Questions', 'Still Have Questions?') where the design checklist prefers sentence case, and the CTA heading is phrased as a casual question. Minor, but it contributes to the generic-template feel.
  - **Evidence:** FAQ.tsx:113 ('Frequently Asked Questions') and FAQ.tsx:152 ('Still Have Questions?')
  - **Fix:** Use sentence case for the section headings and make the CTA heading a confident statement (e.g. 'Talk through your specific challenge' / 'Book a discovery call').
  - **Rule:** _Content > sentence case over Title Case on every header_
- **🟡 LOW · Component Patterns** — Ten questions are presented as a single flat accordion with no search, no category grouping, and no jump-to navigation. For 10 items this forces linear scanning and a lot of open/close clicking.
  - **Evidence:** FAQ.tsx:12-63 (10 faqItems) rendered as one Accordion at FAQ.tsx:130-143
  - **Fix:** Add a search/filter input or group the questions (basics, framework comparisons, engagement logistics) with sub-headings, so users can scan to the relevant area instead of expanding items one by one.
  - **Rule:** _Component Patterns > searchable help / progressive disclosure over a long flat accordion_
- **🟡 LOW · Content** — An em dash (\u2014) appears inside answer copy. This is grammatically fine in long-form editorial prose, but the project's pre-flight gate bans em dashes in UI copy; given the brand's house style elsewhere it is worth normalizing.
  - **Evidence:** FAQ.tsx:31 ('during the Leverage phase \u2014 cross-functional teams')
  - **Fix:** If the house style bans em dashes, replace with a colon or restructure the sentence (e.g. 'during the Leverage phase, cross-functional teams collaboratively map...'). Apply consistently across answer copy.
  - **Rule:** _Content > em-dash ban (scope: editorial body copy, low priority)_

---

## Resources

**Route:** `/resources`

> The /resources page is a clean, legible whitepaper library with sensible structure (intro -> search -> grid -> CTA), real product copy, a working live search filter, an empty state, and SEO meta. But it reads as a generic AI landing surface: the hero is ~half a viewport of dead whitespace with a tiny pill + Inter heading and no visual anchor (image, motion, or product preview), the entire page is a vertical stack of identical centered white glass-cards (card-on-card, everything symmetrical), and the 5 whitepaper cards are a fixed equal-height grid where every card uses the same FileText icon and the same 'Download Free' button (five CTAs with identical intent and label). Brand-critical issues: the display heading font is 'SF Pro Display' which is never loaded (only Inter is @imported) so headings fall back to Inter with no display presence; em-dashes appear in UI copy; the search input has a low-contrast placeholder on a near-white translucent field with no visible focus ring; btn-primary still has no :active/pressed state; the download modal has no focus trap / Escape handling / dialog role; the gating form pre-checks the newsletter opt-in (consent dark pattern) and shows a spinner + 'Success!' toast instead of skeleton + confident copy. Headings are Title Case throughout. None of the CLEAR phase accents appear here, so color stays locked to one blue primary, which is good.

**17 findings** — 6 high · 7 medium · 4 low

- **🔴 HIGH · Layout** — The desktop hero is roughly half a viewport of empty whitespace with no visual anchor. A small 'Resources' pill, the 'Knowledge Center' heading, and one line of body sit in the top-left while the entire right ~55% and the lower third of the fold are blank. It reads as an unfinished template, not a designed hero. Compounding it, the hero <section> sets pt-12 pb-16 but .section-container already applies py-16 sm:py-24 (index.css:114), so vertical padding is effectively doubled.
  - **Evidence:** resources__desktop-hero.png; src/pages/Resources.tsx:140-151; src/index.css:114
  - **Fix:** Give the hero a real anchor and tighten it: either a two-column hero (copy left, a stacked whitepaper-cover collage / illustration / ambient gradient-on-image right), or center it and pull the resource grid up so the fold shows value. Remove the double padding by not adding py to a section that uses .section-container, and reduce the top dead space.
  - **Rule:** _Empty, flat sections with no visual depth / Missing whitespace (over-applied) / Strong hero (taste landing)_
- **🔴 HIGH · Component Patterns** — Every primary section is the same generic glass-card (white bg + border + shadow + rounded-2xl) stacked vertically and centered (max-w-3xl / max-w-5xl mx-auto): intro card, then the grid of card-on-card whitepapers, then the CTA card. This is the textbook AI 'border+shadow+white card for everything' pattern with zero hierarchy differentiation.
  - **Evidence:** src/pages/Resources.tsx:158, 221, 261; src/index.css:77-79; resources__desktop-full.png
  - **Fix:** Use elevation only where it communicates hierarchy. Make the intro plain text on the background (no card), let the whitepaper grid be borderless tiles separated by spacing/dividers, and reserve the elevated card for the single CTA. Vary radius (tighter inner, softer container) instead of uniform rounded-2xl.
  - **Rule:** _Generic card look (border + shadow + white background)_
- **🔴 HIGH · Content** — Five whitepaper cards each render the exact same 'Download Free' button (Resources.tsx:249), so the page has five CTAs with identical intent and identical label. There is no way to scan/differentiate actions, and it violates the single-CTA-intent landing rule by repeating one undifferentiated action five times.
  - **Evidence:** src/pages/Resources.tsx:244-250; resources__desktop-full.png; resources__mobile-full.png
  - **Fix:** Differentiate the action per resource or demote it: e.g. make the whole card clickable with a single quieter 'Get the guide' text link/arrow, or label by artifact ('Get the framework guide', 'Get the comparison'). Keep one prominent CTA intent on the page (the bottom 'Explore services').
  - **Rule:** _No two CTAs with the same intent on a page (taste pre-flight) / Always one filled button_
- **🔴 HIGH · Typography** — Display headings are configured as font-display = 'SF Pro Display' with an 'Inter var' fallback (tailwind.config.ts:70), but only Inter is actually loaded (@import url rsms.me/inter at index.css:194). SF Pro Display is not web-served, so on every non-Apple device headings silently fall back to Inter, and there is no licensed display face at all. Headings therefore have no distinct display presence beyond bold Inter with tracking-tight.
  - **Evidence:** tailwind.config.ts:69-70; src/index.css:67-69, 194; resources__desktop-hero.png
  - **Fix:** Load a real display face with character (e.g. Geist, Outfit, Cabinet Grotesk, Satoshi) via @font-face / link and point font-display at it, or commit to Inter and stop pretending with the SF Pro fallback. Give 'Knowledge Center' more presence (heavier weight, tighter negative tracking, leading-[1.05]).
  - **Rule:** _Browser default fonts or Inter everywhere / Headlines lack presence_
- **🔴 HIGH · Accessibility** — The search input is type=text on a translucent near-white field (bg-white/50) with a placeholder color of foreground/50 and NO focus ring or focus styles. The page background is #f8f9fb (--background 210 20% 98%), so a 50%-white field plus a ~50% foreground placeholder fails WCAG AA contrast for placeholder text and the input gives no visible keyboard-focus indication. Note the codebase already has a .input class with focus:ring-2 (index.css:154-156) that is NOT used here.
  - **Evidence:** src/pages/Resources.tsx:179-185; src/index.css:154-156, 8-9
  - **Fix:** Use the existing .input class (solid white bg + focus ring) or add bg-white + a darker placeholder (text-foreground/60+) and an explicit focus-visible ring. Ensure placeholder and focus state both meet AA.
  - **Rule:** _Button & form contrast must meet WCAG AA / Missing focus ring (taste pre-flight: real states)_
- **🔴 HIGH · Interactivity & States** — The download/gate modal is not accessible: the overlay div has no role=dialog or aria-modal, focus is never trapped inside it, focus is not moved to the dialog on open or restored on close, and Escape does not close it (only backdrop click and the X button do). Keyboard and screen-reader users can tab out of the open modal to the page behind it.
  - **Evidence:** src/pages/Resources.tsx:284-310
  - **Fix:** Wrap in a proper dialog (the project already ships shadcn Dialog) or add role=dialog + aria-modal=true, trap focus, move focus to the close/heading on open, restore on close, and handle Escape to close.
  - **Rule:** _Missing focus ring / real states (taste pre-flight) + Modals for everything_
- **🟠 MED · Content** — Em-dashes (U+2014) are used in UI copy in multiple whitepaper descriptions, which the UI copy guidelines ban.
  - **Evidence:** src/pages/Resources.tsx:21 ('CLEAR methodology \u2014 from theoretical foundations'), :57 ('the Clarity step \u2014 the most critical foundation')
  - **Fix:** Replace em-dashes with a colon, comma, or period, e.g. 'A comprehensive guide to the CLEAR methodology: from theoretical foundations to practical implementation.'
  - **Rule:** _Em-dash ban in UI copy (taste pre-flight)_
- **🟠 MED · Typography** — Headings across the page use Title Case rather than sentence case: 'Knowledge Center', 'Free Educational Resources', 'Need Personalized Guidance?', plus card titles. The checklist calls for sentence case.
  - **Evidence:** src/pages/Resources.tsx:144, 160, 263; resources__desktop-full.png
  - **Fix:** Switch display/section headings to sentence case ('Knowledge center', 'Free educational resources', 'Need personalized guidance?'). Keep proper nouns like CLEAR capitalized.
  - **Rule:** _Title Case On Every Header_
- **🟠 MED · Layout** — The whitepaper feature row is a uniform multi-column grid of equal-height cards (grid md:grid-cols-2, flex-1 spacer to force equal height). It is the generic equal-card grid pattern; the forced equal heights leave uneven trailing whitespace under shorter cards, and the layout is fully symmetrical with no rhythm variation.
  - **Evidence:** src/pages/Resources.tsx:216-251 (flex-1 on the takeaways <ul> at :235); resources__desktop-full.png
  - **Fix:** Break the grid: a 2-col zig-zag, an editorial list with cover thumbnails, or allow natural card heights. If you keep the grid, pin CTAs to the bottom (already attempted) but let card heights vary so trailing whitespace is intentional, and feature the flagship 'CLEAR Change Framework' resource larger than the rest.
  - **Rule:** _Three equal card columns as feature row / Cards of equal height forced by flexbox_
- **🟠 MED · Interactivity & States** — btn-primary (used on every card and the CTA) has a hover background shift and a sheen :before, but no :active/pressed feedback anywhere, so clicks feel inert. This is the known global gap, and this page leans on btn-primary heavily (6+ instances) which makes it more noticeable.
  - **Evidence:** src/index.css:97-107; src/pages/Resources.tsx:246, 271; src/components/WhitepaperGate.tsx:195
  - **Fix:** Add an :active state to .btn-primary (e.g. active:scale-[0.98] active:translate-y-px) so every download/CTA press has physical feedback.
  - **Rule:** _No active/pressed feedback (taste pre-flight: hover AND :active)_
- **🟠 MED · Interactivity & States** — The gate form's loading state is a circular spinner overlaid on the submit button, not a skeleton, and on success it fires a toast titled 'Success!' with an exclamation mark. The checklist asks for skeletons over spinners and bans exclamation marks in success messages.
  - **Evidence:** src/components/WhitepaperGate.tsx:198-201 (spinner), :46-47 (toast 'Success!')
  - **Fix:** Keep an inline button busy state (e.g. 'Sending...') without a spinner, and rewrite the success toast confidently without the exclamation, e.g. title 'Whitepaper ready', description 'Your download is below.'
  - **Rule:** _No loading states (skeleton not spinner) / Exclamation marks in success messages_
- **🟠 MED · Strategic Omissions** — The newsletter opt-in in the gate form defaults to checked (newsletter=true), so submitting the download form silently subscribes the user unless they untick it. Pre-checked marketing consent is a dark pattern and is non-compliant under GDPR-style consent rules.
  - **Evidence:** src/components/WhitepaperGate.tsx:28 (useState(true)), :180-190
  - **Fix:** Default the newsletter checkbox to unchecked (opt-in, not opt-out) so subscription is an affirmative action.
  - **Rule:** _No cookie consent / form consent (Strategic Omissions: compliant consent)_
- **🟠 MED · Iconography** — Icons are exclusively lucide-react (FileText, Download, ArrowRight, Check, X), the default AI icon set, and every one of the five whitepaper cards uses the identical FileText icon, so the icons carry no differentiating meaning between resources.
  - **Evidence:** src/pages/Resources.tsx:3, 225 (same FileText per card); resources__desktop-full.png
  - **Fix:** Either drop the per-card icon (let the title carry it) or vary the glyph/treatment per resource (e.g. a numbered/lettered CLEAR-phase chip, or distinct topical icons), and consider a non-default icon set (Phosphor/Heroicons) for differentiation.
  - **Rule:** _Lucide or Feather icons exclusively_
- **🟡 LOW · Typography** — Hero body copy uses body-lg max-w-3xl (~48rem). At text-lg that line measure runs well beyond the ~65ch readability target, so the lead paragraph is wider than ideal.
  - **Evidence:** src/pages/Resources.tsx:145-148; src/index.css:129-131; resources__desktop-hero.png
  - **Fix:** Constrain the lead to ~max-w-2xl (or a ch-based measure ~60-65ch) so the line length sits in the comfortable reading range.
  - **Rule:** _Body text too wide (<= ~65ch)_
- **🟡 LOW · Layout** — The bottom CTA spaces its two buttons with a right-margin hack (btn-primary mr-4) inside a flex row instead of using gap, which is brittle and adds trailing margin on the last-but-one element.
  - **Evidence:** src/pages/Resources.tsx:270-277
  - **Fix:** Use flex gap (e.g. flex justify-center gap-4 flex-wrap) instead of mr-4, and allow wrapping so the two CTAs stack cleanly on small screens.
  - **Rule:** _Complex flexbox / spacing hacks (Layout, Code Quality)_
- **🟡 LOW · Code Quality** — Section reveal animations are driven by manual setTimeout chains that add animate-fade-in-up classes after mount, while elements ship with opacity-0 in markup. If the JS is slow, errors, or animations are disabled, the intro and all cards can remain invisible (no IntersectionObserver, no prefers-reduced-motion guard).
  - **Evidence:** src/pages/Resources.tsx:87-112, 142, 158, 221
  - **Fix:** Drive reveals with IntersectionObserver (or CSS scroll-driven animations) keyed to in-view, ensure a no-JS / reduced-motion fallback leaves content visible, and respect prefers-reduced-motion.
  - **Rule:** _Staggered entry (do it robustly) / Animations and reduced-motion_
- **🟡 LOW · Code Quality** — The search field's magnifying-glass icon is a hand-inlined raw SVG (lucide Search shape) rather than the imported lucide Search component, which is inconsistent with the rest of the icon usage on the page and duplicates an icon the library already provides.
  - **Evidence:** src/pages/Resources.tsx:186-201
  - **Fix:** Import and render the Search icon from lucide-react (consistent stroke width and sizing) instead of the inline SVG.
  - **Rule:** _Inconsistent stroke widths across icons / Div soup (inline SVG)_

---

## Insights

**Route:** `/insights`

> The /insights page is a clean but unfinished article index: a tag, an h1, a one-paragraph intro, a 3-up card grid, and a CTA box. The copy is genuinely good (specific, opinionated, no AI cliches in the prose voice), the SEO component is complete (og:image, twitter card, canonical), and the single CTA intent ('Join the Mailing List' -> /get-the-book) is correct with no duplicate CTAs. The serious problems are: (1) the hero is a large empty void — stacked vertical padding pushes the cards ~770px down the viewport with nothing in between; (2) the page is functionally dead — all 6 cards read 'Coming soon' and none are links, so an articles index has zero clickable content; (3) low-contrast italic 'Coming soon' fails AA. Layout is the textbook generic AI pattern (three equal columns + centered glass card). Foundation-level issues (Inter everywhere, generic .glass-card, no :active on .btn-primary) are inherited here and made slightly worse by being the only surface treatment on the page.

**11 findings** — 3 high · 5 medium · 3 low

- **🔴 HIGH · Layout** — The hero is a tall empty void. The hero <section> uses pt-12 pb-16 (sm:pt-16 sm:pb-20) and contains only a tag + h1 + one short paragraph, then the very next <section> opens with .section-container which itself applies py-16 sm:py-24. The two stacked paddings plus the short content leave roughly 250px of dead whitespace below the intro before the first card appears — in insights__desktop-hero.png the cards only start ~770px down, so the entire first screen is mostly blank.
  - **Evidence:** src/pages/Insights.tsx:65 (pt-12 pb-16) + src/index.css:114 (.section-container py-16 sm:py-24); insights__desktop-hero.png
  - **Fix:** Treat this as an editorial index header, not a marketing hero. Drop the empty void: reduce the gap so cards begin within the first viewport, or fill the space with a featured/lead article card (largest, real link) spanning two columns. Add a subtle full-width ambient background or a thin rule under the intro so the header reads as intentional rather than truncated.
  - **Rule:** _Empty, flat sections with no visual depth / Missing whitespace (over-applied)_
- **🔴 HIGH · Content** — The entire page is non-functional. All six article cards end in a static 'Coming soon' label and the card <div> is not a <Link> — nothing on the index is clickable except the mailing-list CTA. An 'Insights' index where no insight can be opened is a dead end and reads as an unshipped placeholder.
  - **Evidence:** src/pages/Insights.tsx:83-104 (cards are plain <div>, line 101-103 renders 'Coming soon'); insights__desktop-full.png
  - **Fix:** Either ship at least one real article and link its card with <Link to={`/insights/${slug}`}>, or, if content is genuinely pending, redesign as a single 'first article in progress' lead block plus an email-capture — don't render six identical dead cards. If a card must stay unpublished, visibly disable it (reduced opacity, cursor-not-allowed, aria-disabled) rather than presenting it as normal content.
  - **Rule:** _Dead links / No empty states_
- **🔴 HIGH · Accessibility** — The 'Coming soon' status label is rendered at text-foreground/40 in italic. foreground is 220 20% 10% (near-black) at 40% opacity over the ~98% white card — roughly 2.5:1 contrast, below the WCAG AA 4.5:1 minimum for this small text. It is also the only state on every card, so the least-legible element carries the most repeated meaning.
  - **Evidence:** src/pages/Insights.tsx:101-103 (text-foreground/40 italic); insights__desktop-full.png
  - **Fix:** Raise to at least text-foreground/60 (or a real muted token meeting 4.5:1), drop the italic on a UI status label, and pair it with a small square badge so it reads as a status rather than an afterthought.
  - **Rule:** _Button & form contrast / WCAG AA body 4.5:1_
- **🟠 MED · Layout** — The articles use three equal card columns (grid-cols-1 md:grid-cols-2 lg:grid-cols-3, gap-8), which the audit calls out as the single most generic AI feature-row layout. Combined with six identical-treatment cards it produces a flat, templated 2x3 wall with no hierarchy — no lead story, no varied sizes.
  - **Evidence:** src/pages/Insights.tsx:81; insights__desktop-full.png
  - **Fix:** Break the uniform grid: feature the lead/most-recent article as a wide 2-column card, then run the rest in a tighter list or asymmetric grid. Or use an editorial 2-column zig-zag. Give cards variable emphasis so the eye has somewhere to land.
  - **Rule:** _Three equal card columns as feature row_
- **🟠 MED · Component Patterns** — Every surface on the page is the same generic .glass-card (white/95 + 1px border + shadow-lg + rounded-2xl) — used for all six article cards AND the centered CTA box. The cards are not interactive yet carry shadow-lg elevation, so the elevation communicates no hierarchy, and the CTA is the cliche centered glass card mx-auto.
  - **Evidence:** src/pages/Insights.tsx:85 and 109 (.glass-card on cards + CTA); src/index.css:77-79
  - **Fix:** Differentiate surfaces. For a content index, drop the heavy border+shadow card in favor of spacing/dividers (cards earn elevation only when clickable, and then gain a hover lift). Make the CTA a distinct full-width band rather than another floating glass card so it doesn't read as a seventh article.
  - **Rule:** _Generic card look (border + shadow + white background)_
- **🟠 MED · Content** — Em-dashes are used throughout UI copy, which the taste pre-flight bans for on-screen text. The hero paragraph splits 'applied behavioral psychology — from a licensed psychologist' and several card summaries open with em-dash asides ('everyone quotes — but few understand', 'change management approaches — one from project management').
  - **Evidence:** src/pages/Insights.tsx:73-74 (hero), 11, 18, 25, 32 (card summaries); insights__desktop-hero.png
  - **Fix:** Replace em-dashes in UI copy with a period, comma, or colon. E.g. hero: 'applied behavioral psychology, from a licensed psychologist who works in the field.'
  - **Rule:** _Em-dash ban in UI copy_
- **🟠 MED · Typography** — Title Case is used on several headings instead of sentence case: card titles like 'Which Change Framework Is Right for Your Organization?' and especially the CTA heading 'Want to Be Notified When Articles Publish?' and button 'Join the Mailing List'. The audit prescribes sentence case for headers.
  - **Evidence:** src/pages/Insights.tsx:110 (CTA h2), 115 (button label), plus article titles 16/30/44; insights__desktop-full.png
  - **Fix:** Convert UI/section headings and the button to sentence case: 'Want to be notified when articles publish?' and 'Join the mailing list'. (Editorial article titles may keep their own style, but the page chrome should be sentence case.)
  - **Rule:** _Title Case On Every Header_
- **🟠 MED · Interactivity & States** — The only interactive element (the mailing-list CTA) has a hover sweep via .btn-primary:before but no :active/pressed state and no explicit focus-visible ring. Cards have no hover/focus affordance at all. So the page has effectively zero real interaction states beyond a hover tint.
  - **Evidence:** src/index.css:97-107 (.btn-primary hover only, no :active); src/pages/Insights.tsx:115-118
  - **Fix:** Add an :active state to .btn-primary (e.g. active:scale-[0.98] or translateY(1px)) and a visible focus-visible ring (ring-2 ring-ring ring-offset-2). When cards become links, add hover elevation/translate + the same focus ring.
  - **Rule:** _No active/pressed feedback / Missing focus ring_
- **🟡 LOW · Strategic Omissions** — This is a content/blog index but the SEO component is called without structuredData, so there is no Blog or ItemList JSON-LD listing the articles. For a page whose entire purpose is discoverability of articles, that's a missed SEO/AI-citation opportunity.
  - **Evidence:** src/pages/Insights.tsx:59-63 (SEO has no structuredData prop); src/components/SEO.tsx:46-50 (supports structuredData)
  - **Fix:** Pass an ItemList/Blog schema enumerating the articles (name, url, description) to <SEO structuredData={...} /> once articles are real, so search and AI surfaces can index the index.
  - **Rule:** _Missing meta tags_
- **🟡 LOW · Code Quality** — Manual window.scrollTo(0, 0) in a useEffect to reset scroll on mount. The app already sets html { scroll-behavior: smooth } globally, so this imperative jump is redundant with router scroll handling and can cause a visible snap. Scroll-to-top is better handled once at the router level.
  - **Evidence:** src/pages/Insights.tsx:53-55; src/index.css:160-162
  - **Fix:** Remove the per-page scrollTo and handle scroll-restoration centrally (a single ScrollToTop component on route change), so individual pages don't each re-implement it.
  - **Rule:** _Inline styles mixed with CSS classes (imperative DOM side-effects)_
- **🟡 LOW · Code Quality** — Div soup for what is semantic content. The card grid renders article previews as nested <div> elements rather than <article> within a <section>/<ul>, and the page has no <main> wrapper (only a bare <div className="min-h-screen">).
  - **Evidence:** src/pages/Insights.tsx:58 (<div>), 83-104 (article cards as <div>)
  - **Fix:** Wrap the page body in <main>, render each preview as <article>, and group them in a list (<ul>/<li>) for screen-reader and SEO semantics.
  - **Rule:** _Div soup_

---

## Get the Book

**Route:** `/get-the-book`

> A clean, restrained book landing page. Strengths: a single locked blue accent (--primary 220 80% 48%) used consistently across tags, buttons and links (no rainbow), body copy is width-constrained (max-w-2xl/3xl, ~65ch), forms have real inline error states instead of window.alert, the nav shows an active-page indicator, and a cookie banner is present. The big problem is the hero: it is built as a 2-column grid but the right column is completely empty, leaving half the viewport blank and — on a page selling a BOOK — showing no book cover or mockup anywhere on the page. Secondary issues are pure AI-slop tells: the same CheckCircle icon repeated five times down the 'What You'll Learn' list, two near-identical Name+Email capture forms competing on one page, em-dashes in body copy, exclamation marks in success/toast copy, Title Case headings, and custom .btn-primary/.btn-secondary anchors that have no focus-visible ring for keyboard users. Layout is a single centered column the whole way down.

**11 findings** — 2 high · 4 medium · 5 low

- **🔴 HIGH · Layout** — The hero is declared as a two-column grid (grid-cols-1 lg:grid-cols-2) but only ONE child div exists, so the entire right half of the hero renders as dead blank space on desktop. It reads as a broken/unfinished layout rather than intentional whitespace.
  - **Evidence:** src/pages/GetTheBook.tsx:63 (grid lg:grid-cols-2 with a single child div lines 64-82); get-the-book__desktop-hero.png (right ~50% of hero is empty)
  - **Fix:** Either fill the right column with the book asset (see Strategic Omissions) or drop lg:grid-cols-2 and use a single, deliberately constrained left-aligned hero column. Do not ship a 2-col grid with an empty cell.
  - **Rule:** _Everything centered and symmetrical / No max-width container (intentional asymmetry, not accidental gaps)_
- **🔴 HIGH · Strategic Omissions** — This is a 'Get the Book' landing page but there is NO image of the book anywhere — no cover, no 3D mockup, no spine. The empty hero column is exactly where a cover should sit. A book page with no book visual undercuts the entire pitch and the 'pre-order' ask.
  - **Evidence:** src/pages/GetTheBook.tsx:60-336 (no <img> except the author headshot at line 208); get-the-book__desktop-full.png (no book cover in any section)
  - **Fix:** Add a book cover / 3D mockup in the hero right column (and optionally a smaller repeat near the pre-register form). Use a real cover render or a placeholder mockup until artwork exists.
  - **Rule:** _Empty, flat sections with no visual depth / Strategic Omissions (what AI forgets)_
- **🟠 MED · Iconography** — All five 'What You'll Learn' rows use the identical CheckCircle icon in an identical primary/10 circle. Repeating one generic checkmark five times conveys no information and is a classic AI-list tell; it also reads as a feature checklist rather than chapter topics.
  - **Evidence:** src/pages/GetTheBook.tsx:102,115,128,141,154 (CheckCircle repeated); get-the-book__desktop-full.png (What You'll Learn list)
  - **Fix:** Give each topic a distinct, meaningful icon (or number the chapters 01-05), or drop the icon chrome entirely and lean on numbered/typographic hierarchy. Standardize stroke weight.
  - **Rule:** _Lucide/Feather icons exclusively + cliche/repeated metaphors_
- **🟠 MED · Component Patterns** — Two visually near-identical lead-capture cards (Name + Email) sit on the same page: 'Download a Free Chapter' (#free-chapter) and 'Pre-Register for Launch Updates' (#register-interest). Asking for the same details twice on one page splits attention and dilutes conversion; the cards look like duplicates.
  - **Evidence:** src/pages/GetTheBook.tsx:184-196 (free chapter card) and 253-333 (pre-register card); get-the-book__desktop-full.png (two stacked identical forms)
  - **Fix:** Lead with ONE primary capture (free chapter is the stronger hook) and make pre-register a single-field secondary path, or merge into one form with a 'also notify me at launch' checkbox. Differentiate the two cards visually if both must stay.
  - **Rule:** _Always one filled + one ghost / no two CTAs with the same intent on a page_
- **🟠 MED · Interactivity & States** — The hero CTAs and the BookPreview CTA are custom .btn-primary/.btn-secondary anchors and buttons that define hover but no :focus-visible ring, so keyboard users get no visible focus indicator on the page's primary actions. (Shadcn <Button>/<Input> inside the forms do have rings; the custom classes do not.)
  - **Evidence:** src/index.css:97-111 (.btn-primary / .btn-secondary have hover :before but no focus styles); src/pages/GetTheBook.tsx:74-80 (anchors using these classes)
  - **Fix:** Add focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 to .btn-primary and .btn-secondary so anchor/button CTAs are keyboard-navigable.
  - **Rule:** _Missing focus ring (a11y requirement, not optional)_
- **🟠 MED · Content** — Em-dashes appear in UI copy across the page (hero subhead and chapter descriptions), and success/toast copy uses exclamation marks. Both are banned anti-slop tells; the page should read confident, not loud.
  - **Evidence:** src/pages/GetTheBook.tsx:68 ('fail — not because'), 120, 133 (em-dash 'Refinement —'); toast 'You're on the list!' line 38 and heading 'You're on the List!' line 322; FreeChapterForm.tsx:33 ('Your chapter is ready!'), 46 ('Thank You!')
  - **Fix:** Replace em-dashes with periods, commas, or restructured sentences. Drop exclamation marks: 'You're on the list.' / 'Your chapter is ready.'
  - **Rule:** _Em-dash ban in UI copy + Exclamation marks in success messages_
- **🟡 LOW · Content** — Headings use Title Case ('What You'll Learn', 'Be the First to Know', 'Real-World Case Studies', 'You're on the List') rather than sentence case.
  - **Evidence:** src/pages/GetTheBook.tsx:93,144,246,322
  - **Fix:** Switch to sentence case: 'What you'll learn', 'Be the first to know', 'Real-world case studies'.
  - **Rule:** _Title Case on every header_
- **🟡 LOW · Layout** — Below the hero every section is a single centered, max-w-3xl column with centered headers and centered intros (What You'll Learn, Get a Free Chapter, Be the First to Know). The whole page is one symmetrical centered stack with no rhythm change, which feels templated.
  - **Evidence:** src/pages/GetTheBook.tsx:90,172,203,244 (repeated max-w-3xl mx-auto text-center); get-the-book__desktop-full.png
  - **Fix:** Break the monotony: left-align at least one section header, vary content width, or pair the chapter list with the book visual in a two-column layout so not every block is dead-centered.
  - **Rule:** _Everything centered and symmetrical_
- **🟡 LOW · Color & Surfaces** — The 'Coming Soon' / 'Free Preview' tags render medium-blue text (primary 220 80% 48%) on a very pale primary/10 fill at 12px. Blue-on-pale-blue at this small size is borderline against WCAG AA 4.5:1 for body-size text.
  - **Evidence:** src/index.css:137-139 (.tag bg-primary/10 text-primary text-xs); get-the-book__desktop-hero.png (Coming Soon pill)
  - **Fix:** Darken the tag text (e.g. text-primary at a deeper shade or use accent-foreground 220 80% 30%) or increase the chip background contrast so the label clears 4.5:1.
  - **Rule:** _Button & form contrast must meet WCAG AA_
- **🟡 LOW · Code Quality** — The page root is a plain <div className="min-h-screen"> wrapping several <section> elements with no <main> landmark, so assistive tech has no primary-content landmark for this route.
  - **Evidence:** src/pages/GetTheBook.tsx:44 (outer div) through 337
  - **Fix:** Wrap the page sections in <main> (or render this page inside a layout that provides one) for a proper landmark structure.
  - **Rule:** _Div soup / use semantic HTML landmarks_
- **🟡 LOW · Typography** — The large hero heading renders in Inter for most users: font-display resolves to 'SF Pro Display, Inter var' but SF Pro Display is not a loaded webfont, so off-Apple devices fall back to Inter var — the same family as body. At text-6xl this makes the headline read as a heavy default sans with no display character. (Inter-everywhere is a Foundation-level issue; flagged low here because the oversized hero makes it more visible.)
  - **Evidence:** tailwind.config.ts:69-70 (sans + display both end in 'Inter var'); index.html:37 (only Inter imported); src/index.css:117-118 (.heading-xl); get-the-book__desktop-hero.png
  - **Fix:** Ship a real display face as a webfont (or load SF Pro alternative) so the hero headline has distinct presence; tighten tracking on the display size.
  - **Rule:** _Inter everywhere / display headings need presence_

---

## Contact

**Route:** `/contact`

> The /contact page is functional and reasonably restrained: it uses a clean two-column grid, has a real inline error state (destructive box), a working focus ring on inputs (focus:ring-primary/30), a smooth submit micro-interaction with success check, and the footer carries Privacy/Terms legal links. The accent is the single locked blue, so there is no rainbow-palette problem here. The biggest issues are strategic and content-level rather than purely visual: (1) the page renders its OWN inline 'Send a Message' form that is a near-duplicate of the richer, Zod-validated LeadForm.tsx component which it never imports, so the weaker form (HTML 'required' only, no client validation, no inline field errors) ships while a better one sits unused; (2) two primary CTAs with the same 'start a conversation' intent compete on the page (the form's 'Start the Conversation' and Calendly's 'Book a Discovery Call'); (3) the hero is a flat, near-empty expanse of #f8fafb with generic 'transform your challenges into opportunities' copy and a pill eyebrow; (4) input field borders (--input ~#dfe2e8 on --background ~#f8fafb, ~1.15:1) are far below the 3:1 AA UI-contrast threshold, so the form fields are barely perceptible as fields. Three identical white glass-cards stacked on a near-white background make the surface read as generic. Headings are Title Case throughout. None of these break the page, but together they read as templated and leave conversion affordances weak.

**11 findings** — 3 high · 5 medium · 3 low

- **🔴 HIGH · Component Patterns** — The page hand-rolls its own 'Send a Message' contact form inline in Contact.tsx (name/email/company/message) instead of using the dedicated LeadForm.tsx component, which is a near-identical but stronger form ('Request a Consultation') with Zod schema validation and inline per-field error messages. The result is duplicated form logic and the WEAKER form is the one that ships on /contact, while LeadForm sits in the codebase unused on this route.
  - **Evidence:** src/pages/Contact.tsx:100-184 (inline form) vs src/components/LeadForm.tsx:8-17,82-93,151-153 (Zod + inline errors); Contact.tsx never imports LeadForm
  - **Fix:** Consolidate to one form component. Either render LeadForm on /contact or extract a shared validated <ContactForm> so both surfaces share Zod validation and inline error rendering. Do not maintain two divergent contact forms.
  - **Rule:** _No form validation / Div soup (duplicated component logic)_
- **🔴 HIGH · Content** — Two primary CTAs with the same underlying intent ('get in touch / start a conversation') compete on a single page: the form submit 'Start the Conversation' and the Calendly card's 'Book a Discovery Call'. Both are full-width filled btn-primary in the same blue, so neither is clearly the priority action and the page has no single conversion focus.
  - **Evidence:** src/pages/Contact.tsx:179 ('Start the Conversation') and src/components/CalendlyEmbed.tsx:30 ('Book a Discovery Call'); both render as full-width .btn-primary — see contact__desktop-full.png
  - **Fix:** Pick one primary intent per page. Make booking the secondary path: render 'Book a Discovery Call' as a lower-emphasis style (btn-secondary or text link) so the form submit is the single dominant CTA, or split scheduling onto its own surface.
  - **Rule:** _no two CTAs with the same intent on a page (taste pre-flight)_
- **🔴 HIGH · Accessibility** — Input field borders have almost no contrast against the page. --input resolves to hsl(220 16% 90%) (~#dfe2e8) sitting on --background hsl(210 20% 98%) (~#f8fafb) — roughly 1.15:1, far below the 3:1 minimum for UI component boundaries. On the near-white page the text inputs and selects read as faint rectangles with no clear edge, which is visible in the screenshots where the fields nearly disappear.
  - **Evidence:** src/index.css:8 (--background 210 20% 98%) and src/index.css:33 (--input 220 16% 90%); inputs use 'border border-input bg-background' at Contact.tsx:110,125,140,154 — see contact__desktop-full.png / contact__mobile-full.png
  - **Fix:** Raise input border contrast to meet 3:1 against the page (e.g. darken --input toward ~hsl(220 14% 80%) or add an inset background tint to fields so the field boundary is unambiguous). Verify with a contrast checker.
  - **Rule:** _Button & form contrast must meet WCAG AA (3:1 large/UI) — light placeholder/border on near-white (taste pre-flight)_
- **🟠 MED · Interactivity & States** — The primary button has a hover shimmer but no :active / pressed state, so clicks have no physical feedback. This is the global .btn-primary definition and it is used for every CTA on this page (form submit and Calendly).
  - **Evidence:** src/index.css:97-107 (.btn-primary defines hover:before shimmer and hover:bg-primary/90 but no :active rule); used at Contact.tsx:163 and CalendlyEmbed.tsx:27
  - **Fix:** Add an :active state to .btn-primary (e.g. active:scale-[0.98] or active:translate-y-px plus a slightly darker bg) so pressing feels tactile.
  - **Rule:** _Real states: hover AND :active/pressed (taste pre-flight) / No active/pressed feedback_
- **🟠 MED · Content** — Hero body copy is generic AI-aspirational filler: 'Ready to transform your challenges into opportunities? Let's start a conversation.' It leans on the 'transform...into opportunities' cliche and says nothing specific about who Erik is, response time, or what happens after you submit. The eyebrow is a generic pill that just repeats the page name ('Contact').
  - **Evidence:** src/pages/Contact.tsx:78-82 — see contact__desktop-hero.png
  - **Fix:** Replace with concrete, reassuring copy: what to expect (e.g. 'A licensed psychologist reads every message — expect a reply within 1-2 business days'). Drop the 'transform challenges into opportunities' phrasing.
  - **Rule:** _AI copywriting cliches (avoid 'transform challenges into opportunities')_
- **🟠 MED · Typography** — Headings are Title Case across the page: 'Get In Touch', 'Send a Message', 'Contact Information', 'Book a Discovery Call'. Capitalizing every word ('Get In Touch') is a templated tell; sentence case reads more editorial and intentional.
  - **Evidence:** src/pages/Contact.tsx:79 ('Get In Touch'), :94 ('Send a Message'), :191 ('Contact Information'); src/components/CalendlyEmbed.tsx:15 ('Book a Discovery Call')
  - **Fix:** Switch headings to sentence case: 'Get in touch', 'Send a message', 'Contact information', 'Book a discovery call'.
  - **Rule:** _Title Case On Every Header (use sentence case)_
- **🟠 MED · Layout** — The hero leaves a large flat empty band: pt-12 hero with short copy, then the contact grid starts far below, leaving roughly a viewport of empty near-white #f8fafb between the headline and the form on desktop. The hero has no image, texture, or supporting element to fill or justify the space, so it reads as unfinished rather than spacious.
  - **Evidence:** src/pages/Contact.tsx:75 (hero section padding) and :88 (contact section) — large empty gap visible in contact__desktop-hero.png and the upper third of contact__desktop-full.png
  - **Fix:** Either tighten the hero-to-form spacing so the form is closer to above the fold, or give the hero presence (a portrait of Erik, a subtle background image/pattern at low opacity, or pull the form/info cards up into the hero band).
  - **Rule:** _Empty, flat sections with no visual depth_
- **🟠 MED · Component Patterns** — Three identical .glass-card surfaces (generic white + border + shadow, uniform rounded-2xl) are stacked on the near-white page: the form card, the Contact Information card, and the Book a Discovery Call card. With no differentiation in elevation, tint, or radius, the page reads as a stack of generic cards rather than a designed hierarchy. Contact Information in particular (just Location + Email, two short lines) does not need a full elevated card.
  - **Evidence:** src/pages/Contact.tsx:93, :190 and src/components/CalendlyEmbed.tsx:10 all use 'glass-card p-8 md:p-10' — see contact__desktop-full.png
  - **Fix:** Demote the Contact Information block to plain text / a borderless group (no card) so elevation is reserved for the form and the booking CTA. Vary surface treatment so the three blocks are not visually interchangeable.
  - **Rule:** _Generic card look (border + shadow + white background) — cards should exist only when elevation communicates hierarchy_
- **🟡 LOW · Layout** — On desktop the two columns are structurally lopsided: the left column is one tall form card, the right is two short stacked cards, leaving a noticeable column of empty space below the right cards before the footer. The columns share a top edge but their differing internal rhythm makes the right side feel unfinished.
  - **Evidence:** src/pages/Contact.tsx:90-208 (grid lg:grid-cols-2); dead space under the right column visible in contact__desktop-full.png
  - **Fix:** Balance the columns — e.g. move Contact Information inline above/below the form, or add a third reassurance element (what-to-expect, response time, a small map) to the right column so both sides terminate at a similar height.
  - **Rule:** _Inconsistent vertical rhythm in side-by-side elements_
- **🟡 LOW · Interactivity & States** — The form-submit loading state is a circular spinner overlaid on the button rather than a skeleton, and the same disabled-spinner pattern is duplicated verbatim in Contact.tsx and LeadForm.tsx. For an inline button submit a small spinner is borderline acceptable, but the skill calls for skeletons over spinners and the duplicated markup reinforces the unconsolidated-form problem.
  - **Evidence:** src/pages/Contact.tsx:166-169 and src/components/LeadForm.tsx:321-325 (identical 'animate-spin' button overlay)
  - **Fix:** Keep an inline busy indicator on the button but unify it in the shared form component; ensure the busy button also exposes aria-busy / disabled labelling for screen readers.
  - **Rule:** _No loading states — replace generic spinners with skeleton loaders_
- **🟡 LOW · Accessibility** — Decorative Lucide icons inside CTAs and status overlays (Send, Check) have no aria-hidden, and the inline error <p> messages in LeadForm are not associated to their inputs via aria-describedby / aria-invalid. The Contact form relies on native 'required' only, with no aria-required or programmatic error association.
  - **Evidence:** src/pages/Contact.tsx:174,180 (Check/Send icons, no aria-hidden); src/components/LeadForm.tsx:151-153 (error <p> not linked to input via aria-describedby)
  - **Fix:** Add aria-hidden="true" to decorative icons; wire each field's error <p> with id + aria-describedby and set aria-invalid on the input when it errors.
  - **Rule:** _visible focus ring + real error states (accessibility wiring)_

---

## Assessment quiz

**Route:** `/assessment`

> The /assessment route is a clean, well-structured diagnostic funnel: progress bar, a sensible 'value-first' question order (5 CLEAR scale questions before 3 qualifying ones), real client-side validation via zod, an inline success state, a results radar chart, and a single clear booking CTA. Copy is specific and non-cliche, the body paragraph is correctly width-capped (max-w-2xl), and the form has proper labels + required markers. The main problems are AI-slop tells and a11y/state gaps rather than broken structure: a Title-Case headline, a near-empty hero with no visual depth, no :active/pressed feedback on the quiz answer buttons, exclamation marks in success copy, a spinner instead of a skeleton for loading, and a second color system (traffic-light orange/amber/green) introduced on the results page that competes with the locked blue accent. Most visibly, the global cookie banner overlaps and obscures the quiz answer options in every screenshot, blocking the page's core interaction. Inter-everywhere and the generic .glass-card are Foundation-level issues; this page mainly compounds the glass-card monotony by stacking five identical cards on the results view.

**11 findings** — 2 high · 6 medium · 3 low

- **🔴 HIGH · Interactivity & States** — The quiz answer buttons (1-5 scale and the qualifying option cards) have hover and selected states but no :active/pressed feedback, and no custom focus-visible ring. These are the single most-clicked elements on the page, yet a press produces no physical feedback. Inputs on the results form DO get a custom focus ring (focus:ring-2 focus:ring-primary/30), so keyboard focus styling is inconsistent across the same flow.
  - **Evidence:** AssessmentQuiz.tsx:195-199 (qualifying card: only hover/selected), AssessmentQuiz.tsx:218-222 (scale button: only hover/selected); contrast with AssessmentResults.tsx:67 input focus ring
  - **Fix:** Add active:scale-[0.98] (or active:translate-y-px) plus focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 to both the scale buttons and qualifying cards so press and keyboard focus are visible and consistent with the form inputs.
  - **Rule:** _Real states: hover AND :active/pressed, visible focus ring_
- **🔴 HIGH · Layout** — The global cookie consent banner sits on top of the quiz card and covers the primary interactive content in every screenshot: on desktop-full it overlaps the answer-option row, and on mobile it obscures the question text itself ('How clearly defined and shared...') AND the answer buttons. A first-time visitor literally cannot see/use the quiz until they dismiss the banner. This page makes the global banner materially worse because the obscured region is the page's core interaction, not marketing copy.
  - **Evidence:** assessment__desktop-full.png (banner over option row), assessment__mobile-full.png (banner over question + scale buttons), assessment__desktop-hero.png
  - **Fix:** Ensure the cookie banner does not overlap focusable content: add bottom padding/scroll-margin to the quiz card while the banner is visible, or make the banner a non-overlapping sticky strip that reserves layout space (margin-bottom on <main>), so the question and answers are never occluded.
  - **Rule:** _Real states: empty/usable core interaction must remain visible (skill: Interactivity & States / Layout overlap)_
- **🟠 MED · Content** — The hero H1 is Title Case on every significant word ('How Ready Is Your Organization for Change?') and the results H1 ('Your Change Readiness Results') follows the same pattern. Title Case on headers is an explicit AI-slop tell; sentence case reads more human and editorial.
  - **Evidence:** Assessment.tsx:52 ('How Ready Is Your Organization for Change?'), Assessment.tsx:68; visible in assessment__desktop-hero.png
  - **Fix:** Use sentence case: 'How ready is your organization for change?' and 'Your change readiness results'. Apply text-wrap:balance to the H1 to avoid the awkward two-word last line ('Change?').
  - **Rule:** _Title Case On Every Header -> sentence case_
- **🟠 MED · Content** — Success messages use exclamation marks in two places: the toast 'Report request sent!' and the inline confirmation 'Report request sent!'. The skill bans exclamation marks in success messages; confident, quiet copy reads more premium.
  - **Evidence:** AssessmentResults.tsx:160 (toast title 'Report request sent!'), AssessmentResults.tsx:267 (inline 'Report request sent!')
  - **Fix:** Drop the exclamation marks: 'Report sent. Check your inbox for your full change-readiness report.' Keep the tone calm and declarative.
  - **Rule:** _Exclamation marks in success messages -> remove them_
- **🟠 MED · Interactivity & States** — The form submit loading state is a circular spinner overlay (border-t-white animate-spin), not a skeleton. The taste-skill pre-flight calls for skeleton loaders over spinners.
  - **Evidence:** AssessmentResults.tsx:322-325 (animate-spin spinner inside the submit button)
  - **Fix:** Keep an in-button affordance but make it feel intentional: a label swap to 'Sending...' with the button in a disabled/pressed style, or a subtle progress shimmer, rather than a generic spinner ring. (A button-level spinner is conventional, but per the gate prefer a non-spinner indicator.)
  - **Rule:** _Real states: loading (skeleton not spinner)_
- **🟠 MED · Color & Surfaces** — The results page introduces a second color system on top of the locked blue accent: the score badge uses orange/amber/green (bg-orange-100/amber-100/green-100) and the dimension bars hardcode hsl(25 95% 53%)/hsl(45 93% 47%)/hsl(142 71% 45%), while the radar fill is blue hsl(220 80% 48%). Combined with the 5-hue CLEAR phase palette defined in CSS (--phase-c..r), the page risks the exact multi-accent 'CLEAR 5-color' drift the pre-flight warns about. The traffic-light bars are defensibly semantic, but the badge background colors plus blue radar plus blue progress make the surface feel like three palettes at once.
  - **Evidence:** AssessmentResults.tsx:96-113 (badge orange/amber/green), AssessmentResults.tsx:233 (bar colors), AssessmentResults.tsx:190-193 (blue radar); index.css:47-52 (5-hue phase palette)
  - **Fix:** Lock blue as the single brand accent and express score quality with one semantic ramp only on the bars (keep them), but neutralize the badge to a tinted-neutral chip with a single colored dot or text color instead of three filled pastel backgrounds; pull the bar/radar colors from CSS tokens rather than hardcoded hsl().
  - **Rule:** _Color-consistency lock: one accent locked across the whole page (watch the 5-color CLEAR phase palette)_
- **🟠 MED · Component Patterns** — The results view is five visually identical .glass-card blocks stacked vertically (radar, overall score, dimension breakdown, email gate, CTA), each with the same border + shadow-lg + rounded-2xl white surface. The repetition makes the page read as generic stacked cards with no hierarchy signalling which block matters most (the email gate / CTA).
  - **Evidence:** AssessmentResults.tsx:168, 201, 215, 250, 337 (five .glass-card wrappers); glass-card defined index.css:77-79
  - **Fix:** Differentiate by role instead of cloning: let the radar + score read as plain sections (no card), reserve elevation/border for the email-gate and the booking CTA so elevation communicates the conversion priority. Vary radius/emphasis between primary and secondary blocks.
  - **Rule:** _Generic card look (border + shadow + white background) -> elevation only when it communicates hierarchy_
- **🟠 MED · Layout** — The desktop hero is mostly empty: roughly the top third of the viewport is blank near-white before the 'Diagnostic Tool' tag appears, and the surface is flat text on a near-flat background (210 20% 98%) with no imagery, texture, or depth. It reads as an unfinished, under-composed hero rather than a confident landing entry.
  - **Evidence:** assessment__desktop-hero.png (large empty band above the tag); Assessment.tsx:46 (pt-12/sm:pt-16 with no hero visual)
  - **Fix:** Tighten the top spacing so the headline sits in the optical upper-third, and add subtle depth: an ambient radial/mesh gradient or a low-opacity background texture behind the hero, or bring the quiz card up so it anchors the fold. Give the section presence rather than a flat white void.
  - **Rule:** _Empty, flat sections with no visual depth_
- **🟡 LOW · Color & Surfaces** — The quiz answer controls are bg-white/50 with a very light border (--border 220 16% 90%) sitting inside a bg-white/95 card on a near-white page. In the screenshots the 1-5 scale boxes are faint, low-contrast outlined squares that read as barely-there until selected; the affordance that these are pressable buttons is weak.
  - **Evidence:** AssessmentQuiz.tsx:218-221 (scale: border-border bg-white/50), AssessmentQuiz.tsx:195-198 (qualifying: same); assessment__desktop-full.png / assessment__mobile-full.png (faint boxes)
  - **Fix:** Increase resting contrast: a slightly darker/2px border or a faint inner surface (e.g. bg-muted) so the buttons read as tappable before interaction, and strengthen the hover border from primary/40 to a more visible value.
  - **Rule:** _Button & form contrast must meet WCAG AA (3:1 large/UI)_
- **🟡 LOW · Code Quality** — The radar chart hardcodes color values (stroke/fill 'hsl(220 80% 48%)', grid 'hsl(220 16% 90%)', tick fill 'hsl(220 20% 10%)') that duplicate existing CSS tokens (--primary, --border, --foreground). If the accent token changes, the chart silently drifts out of sync.
  - **Evidence:** AssessmentResults.tsx:178-194 (hardcoded hsl literals matching --border/--foreground/--primary)
  - **Fix:** Read the values from the design tokens (e.g. via CSS variables / getComputedStyle or a shared theme constant) so the chart tracks the locked accent automatically.
  - **Rule:** _Hardcoded values that duplicate tokens (Code Quality)_
- **🟡 LOW · Content** — The intro frames the quiz as '5 diagnostic questions then a few about your context', but the progress indicator immediately shows 'Question 1 of 8'. The numbers reconcile (5 + 3) but the jump from '5' in the promise to 'of 8' on the very first step can read as a slight bait, and undercuts the low-friction framing.
  - **Evidence:** Assessment.tsx:58-60 ('5 diagnostic questions'), AssessmentQuiz.tsx:161-166 ('Question {n} of {totalSteps}' = of 8)
  - **Fix:** Make the framing consistent: either state '8 quick questions (~2 minutes)' up front, or split the progress UI into two labeled phases ('Diagnostic 1 of 5' then 'About you 1 of 3') so the count matches the promise.
  - **Rule:** _Content consistency (avoid contradicting the stated step count)_

---

## Booking Confirmed

**Route:** `/booking-confirmed`

> Simple, focused confirmation page: one centered card, a clear success state, two next-step links, and correct noindex SEO. Body-copy contrast actually passes AA (foreground/70 = 6.6:1, foreground/60 = 4.7:1) and the primary button (white on blue, 6.0:1) is fine, so it avoids the worst contrast traps. The main problems are taste/anti-slop tells rather than broken a11y: both desktop CTAs wrap to two lines because the buttons have no min-width/flex sizing inside the max-w-lg card, the success heading shouts with an exclamation mark, the green check introduces a second accent that breaks the page's locked blue, the two CTAs are the same 'navigate-away' intent (filled + ghost cliche), and the buttons have no :active/pressed or focus-visible state. The card is vertically centered with min-h-screen which leaves large dead space and lets the global cookie banner overlap the CTAs (clips 'Browse Resources' entirely on mobile). It is also a content dead end: a booking confirmation that shows no meeting time, no add-to-calendar, and no reschedule path.

**9 findings** — 2 high · 5 medium · 2 low

- **🔴 HIGH · Interactivity & States** — Both desktop CTA labels wrap to two lines. 'Explore the Framework' breaks into 'Explore the / Framework' (with the arrow orphaned) and 'Browse Resources' breaks into 'Browse / Resources'. The buttons are inline-flex with no min-width or flex-basis, so inside the max-w-lg / sm:flex-row row they shrink to fit the column rather than their text, producing ragged two-line buttons.
  - **Evidence:** booking-confirmed__desktop-full.png (both pill buttons show two-line labels); BookingConfirmation.tsx:26-33 (flex flex-col sm:flex-row gap-4 justify-center with btn-primary/btn-secondary children that have no flex-1 or whitespace-nowrap)
  - **Fix:** Add whitespace-nowrap to both buttons and let them size to content (or give the row a wider stack: make them full-width stacked on the card and only side-by-side when there is room). Simplest: add `whitespace-nowrap` to .btn-primary/.btn-secondary usage here and widen the card or reduce horizontal padding so a single-line 'Explore the Framework →' fits.
  - **Rule:** _CTA labels must fit one line at desktop (no wrapping)_
- **🔴 HIGH · Color & Surfaces** — The success icon uses a green badge (bg-green-100) with a green-600 check, introducing a second accent color on a page whose locked brand accent is blue (--primary: 220 80% 48%, used by the logo and the primary CTA). Green appears nowhere else, so the check reads as a generic Bootstrap/lucide success token rather than part of the CLEAR system, violating the one-accent color-consistency lock.
  - **Evidence:** BookingConfirmation.tsx:15-16 (bg-green-100 ... CheckCircle text-green-600); booking-confirmed__desktop-hero.png (green circle check above blue 'Explore the Framework' button and blue CLEAR logo)
  - **Fix:** Recolor the success badge to the brand accent: use bg-primary/10 (or the existing --accent 220 60% 92%) with a text-primary check, so the confirmation reads in the page's blue. If a 'success green' is genuinely wanted, define it as a real token and use it consistently, not a one-off green-100/600.
  - **Rule:** _Color-consistency lock: one accent locked across the whole page_
- **🟠 MED · Content** — The success headline shouts with an exclamation mark: 'You're All Set!'. Anti-slop guidance is to remove exclamation marks from success messages and be confident, not loud. 'All Set' is also a generic filler phrase for a high-trust consulting brand.
  - **Evidence:** BookingConfirmation.tsx:18 (<h1 className="heading-lg">You're All Set!</h1>); booking-confirmed__desktop-hero.png
  - **Fix:** Drop the exclamation and use specific, calm copy, e.g. 'Your discovery call is booked' or 'Discovery call confirmed'. Let the supporting line carry the detail.
  - **Rule:** _Exclamation marks in success messages — remove them_
- **🟠 MED · Component Patterns** — The two CTAs are the cliche one-filled + one-ghost pair AND share the same intent: both are 'go look at marketing content elsewhere' (Explore the Framework / Browse Resources). Neither helps the user with the thing they just did (the booking). Two same-intent navigate-away buttons compete for the same click and dilute the page's job.
  - **Evidence:** BookingConfirmation.tsx:27-33 (Link to /methodology btn-primary + Link to /resources btn-secondary); booking-confirmed__desktop-full.png
  - **Fix:** Make the two actions distinct in intent: keep one forward action ('Explore the Framework') and replace the second with a confirmation-relevant action — 'Add to calendar', 'Reschedule', or a plain text 'Return home' link — instead of a second equally-weighted marketing button. Demote it to a tertiary text link to reduce visual noise.
  - **Rule:** _No two CTAs with the same intent on a page / vary button hierarchy_
- **🟠 MED · Interactivity & States** — Neither button has a pressed/:active state or a visible focus ring. .btn-primary has only a hover sheen (:before) and bg shift; .btn-secondary has only a hover bg change. There is no :active scale/translate and no focus-visible outline, so keyboard users get no focus indicator and clicks have no physical feedback.
  - **Evidence:** index.css:97-111 (.btn-primary / .btn-secondary define hover only; no :active, no focus-visible:ring); rendered buttons in booking-confirmed__desktop-full.png
  - **Fix:** Add active:scale-[0.98] (or active:translate-y-px) and focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 to both button utilities. This is shared global polish, but it is the only interactive element on this page so its absence is felt here.
  - **Rule:** _Real states: hover AND :active/pressed, visible focus ring_
- **🟠 MED · Layout** — The page hard-centers a single card with min-h-screen + flex items-center justify-center, leaving large empty bands above and below and, on desktop, pushing the card into the global fixed cookie banner so the banner sits right under the card edge. On mobile the dark cookie banner overlaps the card and fully clips the 'Browse Resources' button, hiding a CTA.
  - **Evidence:** BookingConfirmation.tsx:7 (min-h-screen flex items-center justify-center); booking-confirmed__mobile-full.png (cookie bar covers the 'Browse Resources' button); booking-confirmed__desktop-full.png (banner abuts card with empty space above)
  - **Fix:** Account for the persistent cookie banner: add bottom padding/safe-area to the centering container (e.g. pb-32) or anchor the card with top padding instead of pure vertical centering, so the banner never overlaps the CTAs. Consider min-h-[100dvh] rather than min-h-screen to avoid mobile viewport jump.
  - **Rule:** _Using height:100vh for full-screen sections / overlap usability_
- **🟠 MED · Strategic Omissions** — This is a booking confirmation that confirms nothing concrete. It shows no meeting date/time, no duration, no 'add to calendar' action, no reschedule/cancel link, and no fallback if the email never arrives. It just says an email is coming and then sends the user to marketing pages, which undercuts the trust moment right after someone books a call.
  - **Evidence:** BookingConfirmation.tsx:19-25 (only generic 'You'll receive a confirmation email ... shortly' copy; no booking details or calendar actions); booking-confirmed__desktop-hero.png
  - **Fix:** Surface the actual booking details (date, time, timezone, who they'll meet) and add 'Add to calendar' (.ics/Google) plus a 'Need to reschedule?' link. Even if data isn't wired yet, design the slot for it so the confirmation does its job.
  - **Rule:** _No 'back'/next-step affordance — every flow needs a real way forward_
- **🟡 LOW · Iconography** — The success and arrow icons are lucide-react (CheckCircle, ArrowRight) — the default AI icon set — and the check sits in the most generic possible 'green circle tick' treatment. It is a recognizable templated success pattern.
  - **Evidence:** BookingConfirmation.tsx:1 (import { CheckCircle, ArrowRight } from "lucide-react"); booking-confirmed__desktop-hero.png
  - **Fix:** If the project standardizes on a more distinctive set (Phosphor/Heroicons) elsewhere, use it here; at minimum restyle the badge to the brand accent (see Color finding) so the success mark looks bespoke rather than a stock green check.
  - **Rule:** _Lucide/Feather icons exclusively — differentiate the icon set_
- **🟡 LOW · Code Quality** — The page is div-soup with no semantic landmark. The whole confirmation lives in nested <div>s with no <main> wrapper, so screen-reader users get no main landmark for this standalone page.
  - **Evidence:** BookingConfirmation.tsx:7-35 (outer <div> + glass-card <div>, no <main> / <section>)
  - **Fix:** Wrap the content in <main> (e.g. make the outer container a <main>), and keep the single <h1> as the page label so the page exposes a proper landmark.
  - **Rule:** _Div soup — use semantic HTML (main/section)_

---

## Thank You

**Route:** `/thank-you`

> A clean, restrained confirmation page. Copy is genuinely good: 'Message Received' is confident, no exclamation marks, no AI cliches, and the body is concise and honest ('Erik typically responds within one business day'). SEO is well handled (canonical, og:image, twitter card, noindex on a utility page). The dual-path offer (book now vs. take the assessment) plus a 'Return to homepage' escape is sound information architecture for a dead-end page. Weaknesses are mostly polish and states rather than structure: the page leans on the global design system, so it inherits the system's gaps (Inter-everywhere display type, no :active state, no focus ring on buttons) and these are amplified here because the page is essentially nothing but two buttons and a link. The most concrete defects are accessibility: the 'Return to homepage' link fails WCAG AA contrast (3.36:1) and the buttons expose no visible keyboard focus ring. Visually the page is very sparse, with a large band of dead vertical space on desktop and a fully centered, symmetric, texture-free composition that reads as unfinished.

**9 findings** — 2 high · 5 medium · 2 low

- **🔴 HIGH · Accessibility** — The 'Return to homepage' link uses text-foreground/50, which computes to a 3.36:1 contrast ratio against the page background (--foreground 220 20% 10% at 50% over --background 210 20% 98%). At text-sm (14px) this fails WCAG AA for normal text (requires 4.5:1). On a dead-end confirmation page this is the primary 'back to safety' exit, so the least-readable element is also one of the most important.
  - **Evidence:** src/pages/ThankYou.tsx:58 (text-foreground/50); rendered in thank-you__desktop-full.png ('Return to homepage')
  - **Fix:** Raise to at least text-foreground/70 (6.45:1) or treat it as a real text-link with the locked accent and an underline on hover/focus. Do not let the page's only back-navigation sit below AA.
  - **Rule:** _Button & form contrast must meet WCAG AA (pre-flight contrast gate)_
- **🔴 HIGH · Interactivity & States** — Neither CTA exposes a visible keyboard focus ring. .btn-primary and .btn-secondary define hover styles but no focus-visible ring, even though a --ring token (220 80% 48%) exists in the theme. This page is effectively just two buttons plus one link, so for a keyboard or switch user there is no visible indication of focus anywhere on the page.
  - **Evidence:** src/index.css:97-111 (.btn-primary / .btn-secondary have no focus-visible:ring); consumed at src/pages/ThankYou.tsx:46,51
  - **Fix:** Add focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 to both button classes (and a visible focus state to the homepage link). Visible focus is an accessibility requirement, not optional.
  - **Rule:** _Real states: visible focus ring (pre-flight states gate)_
- **🟠 MED · Interactivity & States** — No :active / pressed feedback on either CTA. Both buttons animate on hover only (bg shift / sheen), so a click registers no physical 'press'. Because the entire purpose of this page is to push the user into one of these two buttons, the missing pressed state is felt more here than on a content-heavy page.
  - **Evidence:** src/index.css:97-107 (.btn-primary hover/:before only, no :active); src/index.css:109-111 (.btn-secondary hover only)
  - **Fix:** Add active:scale-[0.98] (or active:translate-y-px) with the existing 200ms transition to both button classes for tactile click feedback.
  - **Rule:** _Real states: hover AND :active/pressed (pre-flight states gate)_
- **🟠 MED · Iconography** — The success state is a lucide CheckCircle inside a tinted primary/10 circle — the single most common AI 'success page' tell (lucide used exclusively + checkmark-in-a-soft-circle). It adds no brand character and is interchangeable with thousands of generated confirmation pages.
  - **Evidence:** src/pages/ThankYou.tsx:4,25-27 (CheckCircle in inline-flex w-16 h-16 rounded-full bg-primary/10); thank-you__desktop-hero.png
  - **Fix:** Drop the generic check-in-circle, or replace with a brand-specific mark (e.g. a CLEAR phase glyph / Erik's monogram, an envelope-sent motif tied to the 'message received' copy, or a custom-set icon). If a checkmark stays, use a non-lucide set and tie its color to the locked accent.
  - **Rule:** _Lucide/Feather icons exclusively; rocketship/shield cliche metaphors (Iconography)_
- **🟠 MED · Component Patterns** — Two forward-conversion CTAs of nearly equal visual weight compete for the same moment: 'Book a Discovery Call' (filled primary) and 'Take the Free Assessment' (secondary). On a confirmation page the user has already converted; presenting two similarly-prominent next actions splits intent instead of guiding one clear next step. The classic one-filled + one-ghost pairing also reads as a default.
  - **Evidence:** src/pages/ThankYou.tsx:40-54 (btn-primary + btn-secondary side by side); thank-you__desktop-hero.png
  - **Fix:** Make a single action visually primary (the booking CTA) and demote the assessment to a tertiary text link or a quieter card, so there is one obvious next step. Avoid two equally-weighted forward CTAs in the same row.
  - **Rule:** _No two CTAs with the same intent; always one filled + one ghost is a default (CTA / Component Patterns)_
- **🟠 MED · Layout** — The page is a single centered, perfectly symmetric column with a large band of empty vertical space below the content on desktop (roughly the lower third of the viewport before the footer) and no texture, imagery, or depth. It reads as an unfinished placeholder rather than a designed confirmation moment.
  - **Evidence:** thank-you__desktop-full.png (wide empty gap between the CTA block and the footer); src/pages/ThankYou.tsx:22-24 (single max-w-2xl mx-auto text-center column)
  - **Fix:** Give the page presence: anchor the content vertically (center it in the viewport), and add subtle depth — an ambient background gradient/photo at low opacity, what-happens-next microcopy ('check your inbox', expected reply window), or a small next-steps card — instead of a flat centered stack floating in whitespace.
  - **Rule:** _Empty, flat sections with no visual depth; everything centered and symmetrical (Color & Surfaces / Layout)_
- **🟠 MED · Typography** — The hero heading 'Message Received' is the page's only visual anchor, but it is generic Inter at font-bold with tracking-tight and no distinctive treatment. With nothing else on the page to carry the brand, the display type's lack of presence makes the whole surface feel templated.
  - **Evidence:** src/pages/ThankYou.tsx:29 (.heading-xl); src/index.css:117-119 (text-4xl/5xl/6xl font-bold leading-tight tracking-tight, font-display === Inter)
  - **Fix:** Give the hero word real presence: a display face with character (or at minimum heavier weight, tighter optical tracking, and considered leading), or an editorial accent. This is the one place on the page where distinctive type would pay off most.
  - **Rule:** _Display headings need presence; not Inter everywhere (Typography pre-flight gate)_
- **🟡 LOW · Accessibility** — The secondary line 'Want to skip the email exchange and book a time directly?' uses text-foreground/60, which computes to 4.60:1 — only just clearing the 4.5:1 AA threshold for normal text at body-md (16px). It is a fragile margin (any background tint or weight change tips it under).
  - **Evidence:** src/pages/ThankYou.tsx:36 (body-md text-foreground/60)
  - **Fix:** Bump to text-foreground/70 (6.45:1) for comfortable headroom; reserve /60 and below for non-essential decorative text only.
  - **Rule:** _Body contrast must meet WCAG AA with margin (pre-flight contrast gate)_
- **🟡 LOW · Content** — The two stacked paragraphs read slightly disjointed: a confirmation sentence, then a separate rhetorical question ('Want to skip the email exchange and book a time directly?') sitting above the buttons. The question floats as its own block rather than being tied to the CTA it sets up.
  - **Evidence:** src/pages/ThankYou.tsx:31-38 (two separate <p> blocks before the CTA row)
  - **Fix:** Tighten the lead-in so the prompt and its action read as one unit — e.g. make the second line a short, declarative bridge directly above the booking button, or fold it into the primary copy, rather than a standalone question.
  - **Rule:** _Write plain, specific language; tighten hierarchy (Content)_

---

## 404 Not Found

**Route:** `/* (404)`

> The 404 page is functionally broken in the rendered output: in all three screenshots (desktop hero, desktop full, mobile full) the central content card is completely blank — the 'Page Not Found' heading, the explanatory copy, and the 'Return to Home' CTA never appear. Root cause is a CSS animation bug: NotFound.tsx:24 ships the content with Tailwind's `opacity-0` class, then NotFound.tsx:18 adds `animate-fade-in` after a 100ms setTimeout. The `fade-in` keyframe (tailwind.config.ts:86) animates opacity 0→1 but the animation shorthand (tailwind.config.ts:110) has no `forwards` fill-mode, so once the 0.3s animation finishes the element snaps back to its base `opacity-0` rule and disappears. Net result: a user who hits a bad URL sees the global header, cookie banner, and footer wrapped around an empty void with no message and no way forward — the single most important job of a 404 page fails. Beyond the blocking bug, the design itself is generic: a centered Inter `glass-card` with the title-cased AI-default heading 'Page Not Found', body text in faded `text-foreground/70`-style gray, a single Lucide ArrowLeft icon, and no brand voice, no search, and no useful links. The page also logs to console on every render (NotFound.tsx:11) which is a debug artifact. What is already good: there IS a custom 404 route (not a raw framework default), it provides a back-to-home Link rather than a dead `#`, and it reuses the design-system type/button classes so once the opacity bug is fixed it will at least be on-brand.

**7 findings** — 2 high · 3 medium · 2 low

- **🔴 HIGH · Interactivity & States** — The entire 404 content card is invisible in the rendered page. The wrapper is mounted with `opacity-0` (NotFound.tsx:24) and only revealed by adding the `animate-fade-in` class via setTimeout (NotFound.tsx:18). But the `fade-in` animation (tailwind.config.ts:110 → 'fade-in 0.3s ease-out') has NO animation-fill-mode: forwards, so after the 0.3s run completes the element reverts to its base computed style, which is still `opacity-0`. The card fades in then vanishes — confirmed by all three screenshots, where the center of the page (where 'Page Not Found' + CTA should be) is completely blank while header, cookie banner, and footer render normally.
  - **Evidence:** src/pages/NotFound.tsx:24 (opacity-0) + src/pages/NotFound.tsx:18 (animate-fade-in) + tailwind.config.ts:110 (no forwards fill); notfound-404__desktop-full.png and notfound-404__mobile-full.png (blank card region)
  - **Fix:** Do not gate critical content behind a JS-added animation class that lacks a forwards fill. Easiest robust fix: remove the `opacity-0` + setTimeout pattern entirely and render the card visible by default (optionally add a CSS entrance animation that itself sets the final opacity, e.g. add `forwards` to the keyframe shorthand: 'fade-in 0.3s ease-out forwards', and/or start the animation immediately via a Tailwind `animate-fade-in` class rather than a 100ms setTimeout). The 404 message must be visible even if JS fails to run.
  - **Rule:** _Real states: content must not depend on a non-forwards animation; No loading/empty/error sleight-of-hand that hides content_
- **🔴 HIGH · Strategic Omissions** — Because the card never renders, the page has effectively no recovery path: a user who lands on a broken URL sees an empty page with only global nav. There is no visible 'Return to Home' action, no search box, and no links to popular destinations. Even when the opacity bug is fixed, a single 'Return to Home' button is a thin 404 experience for a multi-page consulting site (Services, Methodology, Get the Book, Contact all exist per the footer/nav).
  - **Evidence:** notfound-404__desktop-full.png (no recovery UI visible in body); src/pages/NotFound.tsx:30-33 (only one Link, to '/')
  - **Fix:** After fixing visibility, design a helpful branded 404: keep the friendly headline, add 2–3 quick links to the site's real high-value pages (Methodology, Services, Get the Book), and consider a search or a short 'Looking for one of these?' list. Reuse the brand accent and footer nav targets that already exist.
  - **Rule:** _No custom 404 page → design a helpful, branded 'page not found' experience with a way back_
- **🟠 MED · Content** — Heading uses Title Case ('Page Not Found') which is the generic AI-default 404 string, and the body copy ('The page you're looking for doesn't exist or has been moved.') is boilerplate with zero brand voice. For a named consultancy (CLEAR / Erik Bohjort) this reads like an untouched template.
  - **Evidence:** src/pages/NotFound.tsx:26 ('Page Not Found'), src/pages/NotFound.tsx:27-29 (boilerplate body)
  - **Fix:** Use sentence case and a confident, on-brand line, e.g. heading 'This page wandered off' or 'We can't find that page' and a one-line redirect to the framework/contact. Match the plain, specific tone used elsewhere on the site rather than generic filler.
  - **Rule:** _Title Case On Every Header → sentence case; avoid generic boilerplate copy_
- **🟠 MED · Code Quality** — console.error fires on every render of the 404 page (NotFound.tsx:11-14). This is a debug artifact that ships to production, pollutes the console for every mistyped URL or crawler hit, and is not gated behind a dev check.
  - **Evidence:** src/pages/NotFound.tsx:11-14
  - **Fix:** Remove the console.error, or gate it behind `import.meta.env.DEV`, or route it to real analytics/error tracking instead of console. Do not ship debug logging to production.
  - **Rule:** _Commented-out / debug artifacts → remove debug artifacts before shipping_
- **🟠 MED · Code Quality** — Div soup / non-semantic markup. The page is a stack of generic <div>s with no landmark for the main content. There is no <main> element wrapping the 404 message, which hurts screen-reader navigation and 'skip to content' semantics on what is already a degraded (error) page.
  - **Evidence:** src/pages/NotFound.tsx:23-35 (three nested <div>s, no <main>)
  - **Fix:** Wrap the centered content in a semantic <main> landmark and make the heading the page's <h1> (it already is) so assistive tech announces the error context properly.
  - **Rule:** _Div soup → use semantic HTML (<main>)_
- **🟡 LOW · Component Patterns** — The 404 content sits in the generic shared `.glass-card` (white bg + border + shadow-lg + rounded-2xl, index.css:77-78) — the same border+shadow+white card pattern flagged globally. On a full-bleed error page a heavy elevated card floating in the middle of empty space adds no hierarchy; the elevation communicates nothing here.
  - **Evidence:** src/pages/NotFound.tsx:25 (glass-card p-12) + src/index.css:77-78
  - **Fix:** Drop the card chrome on the 404 and let large centered type + generous whitespace carry the moment, or give the page a distinctive treatment (oversized '404' display numeral, subtle background) instead of the same boxed card used everywhere else.
  - **Rule:** _Generic card look (border + shadow + white background) → remove the card when elevation communicates nothing_
- **🟡 LOW · Iconography** — The only icon is Lucide's ArrowLeft (NotFound.tsx:4, 31), reinforcing the project-wide Lucide-everywhere default. On a 404 an arrow-left next to 'Return to Home' is also a slightly off metaphor (home is not 'back', it's a destination).
  - **Evidence:** src/pages/NotFound.tsx:4 and src/pages/NotFound.tsx:31
  - **Fix:** Use a home/house glyph for a 'Return to Home' action, or drop the icon. If keeping icons, align with whatever differentiated set the redesign picks rather than defaulting to Lucide.
  - **Rule:** _Lucide/Feather icons exclusively; cliche metaphor mapping_

---

## Standalone landing pages (family of 7)

**Route:** `/lp/* — 7 pages`

> Family of 7 paid-traffic landing pages built on one shared LandingPage.tsx + WhitepaperGate.tsx. The copy is genuinely strong: specific, psychology-led headlines and problem statements that avoid AI cliches, confident microcopy ('No commitment. No pitch. Just clarity.'), and a clean low-clutter aesthetic. SEO scaffolding (per-page title/description/canonical/OG/Twitter via SEO.tsx) is well structured. But the SURFACE is templated and conversion-weak: every page is the identical stack of three centered white .glass-card panels (Inter, Title-Case heading-xl, one saturated blue CTA) with no above-the-fold CTA, no real trust signals, and a single tinted blue panel that breaks the rhythm. Two glaring tells: (1) the flagship organizational-change page renders raw '\u2014' escape codes to visitors in its solution copy; (2) the exact same testimonial quote + 'CCO / Housing Organisation' attribution is duplicated on two different pages, and on merger-integration that quote is about 'sustainability issues' (wrong topic). CTA labels and intent are also inconsistent across the family.

**17 findings** — 5 high · 11 medium · 1 low

- **🔴 HIGH · Content** — On the flagship organizational-change page the solution paragraph renders literal escape codes to visitors: 'Built on five proven steps \u2014 Clarity, Landscape, Experimentation, Adaptation, and Results \u2014 CLEAR...'. The raw '\u2014' shows on screen instead of an em-dash. The problem bullet on the SAME page renders the dash correctly, and other pages (e.g. sustainability) render '\u2014' fine, so this is an isolated, visible defect on the highest-value page.
  - **Evidence:** lp-organizational-change__desktop-full.png and lp-organizational-change__mobile-full.png (solution card 'There's a better way'); source OrganizationalChange.tsx:15 (and :13)
  - **Fix:** Replace the broken sequence with a literal em-dash character in OrganizationalChange.tsx (as the other landing pages already do). Audit the whole family for stray '\u2014' literals and lint for them; better, drop em-dashes from UI copy entirely per the em-dash ban and use a period or 'and'.
  - **Rule:** _Content: no Lorem/placeholder artifacts in user-facing copy; Em-dash ban in UI copy_
- **🔴 HIGH · Content** — Duplicate testimonial across pages: the identical quote 'What sets Erik apart is his ability to combine psychological insight with practical business acumen...' attributed to 'CCO / Housing Organisation' appears verbatim on BOTH change-management and merger-integration. On merger-integration that quote talks about 'complex sustainability issues' — wrong topic for a post-merger M&A page. Reusing the same anonymous quote on multiple landing pages reads as fabricated/copy-paste social proof.
  - **Evidence:** ChangeManagement.tsx:17-20 and MergerIntegration.tsx:17-20 (identical quote/author/role); lp-merger-integration__desktop-full.png testimonial
  - **Fix:** Use a distinct, topic-relevant testimonial per page, or remove the testimonial where a real one does not exist. At minimum, swap the merger page to a merger/integration quote so the proof matches the offer.
  - **Rule:** _Content: same asset reused for distinct entities / fabricated proof_
- **🔴 HIGH · Strategic Omissions** — No call-to-action above the fold on any non-whitepaper page. The hero is headline + subhead only; the sole CTA ('Book a Free Discovery Call') sits in the very last section at the page bottom, below a fixed cookie banner. For paid-traffic landing pages this buries the single conversion action and depresses conversion.
  - **Evidence:** LandingPage.tsx:62-72 (hero has no CTA) vs LandingPage.tsx:131-152 (only CTA, bottom of page); lp-organizational-change__desktop-hero.png shows hero with no button
  - **Fix:** Add a primary CTA in the hero (and/or a sticky CTA bar) that mirrors the bottom CTA, so visitors can convert without scrolling the entire page.
  - **Rule:** _Landing standard: strong hero with a single, visible primary CTA_
- **🔴 HIGH · Accessibility** — WhitepaperGate form fields have very low contrast: inputs use bg-background (210 20% 98%, near-white) sitting inside a white .glass-card, with default light-gray placeholder text. In the zoomed form the field outlines and 'Your name' / 'your.email@example.com' placeholders are barely legible — well under WCAG AA 4.5:1 for placeholder text and ~3:1 for the field boundary.
  - **Evidence:** WhitepaperGate.tsx:137,155,173 (className 'bg-background ... border-input'), index.css:8 (--background 210 20% 98%) and :33 (--input 220 16% 90%); _wp_form_zoom.png from lp-clear-whitepaper__desktop-full.png
  - **Fix:** Give inputs a distinct surface (e.g. white field on a tinted card, or a darker border-input) and a placeholder color that meets 4.5:1. Ensure the field border meets 3:1 against the card.
  - **Rule:** _Pre-flight gate: button & form contrast must meet WCAG AA (light placeholder on near-white)_
- **🔴 HIGH · Strategic Omissions** — A cookie-consent banner ('We use cookies to analyze site traffic...') is shown on every page, but the landing template exposes no Privacy Policy or Terms links anywhere — the footer has only 'clear-framework.com' and 'Contact'. Running analytics consent without linkable privacy/terms is a legal/compliance gap on lead-gen pages that also collect name/email.
  - **Evidence:** LandingPage.tsx:154-167 (footer: only home + Contact, no legal links); cookie banner visible in every full/hero screenshot (e.g. lp-organizational-change__desktop-full.png); grep for privacy/terms in LandingPage.tsx returns 0 matches
  - **Fix:** Add Privacy Policy and Terms links to the footer (and ideally the cookie banner). Link the whitepaper form's privacy line to the actual policy.
  - **Rule:** _Strategic omissions: no legal links; cookie consent must pair with privacy/terms_
- **🟠 MED · Content** — Testimonials are attributed to anonymous role + generic org ('CEO / International Healthcare Provider', 'CCO / Housing Organisation', 'CEO / Deep Tech Startup') with no real name, photo, or company. On a credibility-driven psychologist's landing page this reads as low-trust placeholder social proof.
  - **Evidence:** OrganizationalPsychology.tsx:19-20, MergerIntegration.tsx:19-20, LeadershipDevelopment.tsx:19-20; lp-merger-integration__desktop-full.png ('CCO / Housing Organisation')
  - **Fix:** Add a real name, headshot (or company logo), and full title where consent exists. If anonymity is required, add a credibility cue (e.g. 'Verified client, name withheld') rather than a bare title.
  - **Rule:** _Iconography/Content: stock 'diverse team' / generic avatars and unnamed sources erode trust_
- **🟠 MED · Content** — CTA label and intent are inconsistent across the family for the same booking action: organizational-change uses 'Book a Free Discovery Call' while change-management / merger / psychology / leadership use 'Book a Free 30-Minute Discovery Call'. The whitepaper pages instead use 'Download the Whitepaper' / 'Download the Sustainability Whitepaper'. Same intent, different wording weakens a recognizable single CTA across the set.
  - **Evidence:** OrganizationalChange.tsx:16 vs ChangeManagement.tsx:22 / MergerIntegration.tsx:22 / OrganizationalPsychology.tsx:22 / LeadershipDevelopment.tsx:22
  - **Fix:** Standardize one booking CTA label across all consult pages (e.g. 'Book a free 30-minute call') and one download label across whitepaper pages. Keep exactly one CTA intent per page.
  - **Rule:** _Pre-flight: no two CTAs with the same intent; single CTA intent per page; consistent labels_
- **🟠 MED · Accessibility** — The persistent top-left brand link 'clear-framework.com' is rendered at text-foreground/40 (foreground 220 20% 10% at 40% opacity over a near-white bg) — roughly 2:1 contrast, below AA for this small text. It is also the only 'home/trust' affordance in the hero.
  - **Evidence:** LandingPage.tsx:53-60 (text-foreground/40); visible faint top-left on every hero screenshot, e.g. lp-leadership-development__desktop-hero.png
  - **Fix:** Raise to at least text-foreground/70 (or a solid muted token meeting 4.5:1). Consider a small real wordmark/logo instead of faint URL text to double as a trust signal.
  - **Rule:** _Pre-flight gate: text contrast must meet WCAG AA_
- **🟠 MED · Interactivity & States** — WhitepaperGate submit uses a circular spinner overlay during submission rather than a skeleton/inline progress, and .btn-primary has hover + a :before sweep but no :active/pressed state (no scale/translate on click).
  - **Evidence:** WhitepaperGate.tsx:198-201 (border-t-white rounded-full animate-spin); index.css:97-106 (.btn-primary hover and :before only, no :active)
  - **Fix:** Keep the spinner only if inline within the button label, but add a pressed state to .btn-primary (active:scale-[0.98] or active:translate-y-px). The 'skeleton not spinner' rule mainly targets content loading; the higher-impact fix here is the missing :active feedback on the primary button used on every page.
  - **Rule:** _Real states: hover AND :active/pressed; loading (skeleton not spinner)_
- **🟠 MED · Content** — Success messaging uses exclamation marks: toast 'Success!' and the inline 'Your whitepaper is ready!' heading. The anti-slop guidance says be confident, not loud — drop exclamation marks in success states.
  - **Evidence:** WhitepaperGate.tsx:46 (title: 'Success!') and WhitepaperGate.tsx:99 ('Your whitepaper is ready!')
  - **Fix:** Rewrite as calm confirmations: toast 'Whitepaper sent' / inline 'Your whitepaper is ready' (no exclamation).
  - **Rule:** _Content: no exclamation marks in success messages_
- **🟠 MED · Layout** — Every page is the same vertically stacked sequence of centered, equal-width white .glass-card panels (hero text, 'Does this sound familiar?', 'There's a better way', testimonial, CTA), all text-center, all max-w-3xl/4xl. Across 7 pages this is a single rigid template with no layout variation, no asymmetry, no imagery, and heavy repetition — the generic 'stacked centered cards' AI landing pattern.
  - **Evidence:** LandingPage.tsx:74-152 (each section is glass-card + text-center); compare lp-organizational-change__desktop-full.png, lp-change-management__desktop-full.png, lp-merger-integration__desktop-full.png — structurally identical
  - **Fix:** Break symmetry on at least the hero and solution sections (left-aligned hero, asymmetric problem/solution split, supporting imagery or a framework diagram for the CLEAR steps). Vary at least one section per page so the family does not read as one template x7.
  - **Rule:** _Layout: everything centered/symmetrical; generic equal-card stacks; missing depth/imagery_
- **🟠 MED · Component Patterns** — Every container is the same generic .glass-card (border + shadow + white background) used 4-5 times per page, so elevation no longer communicates hierarchy — the page is a column of identical floating white boxes. The lone exception is the solution card with bg-primary/5, a single faint-blue panel that breaks the otherwise all-white rhythm and reads as an accidental tint.
  - **Evidence:** LandingPage.tsx:77,96 (glass-card on every section; :96 adds bg-primary/5); the pale-blue 'There's a better way' panel visible in lp-organizational-change__desktop-full.png
  - **Fix:** Reserve the card/elevation for one or two moments (e.g. the whitepaper gate and testimonial); render problem/solution as plain typographic sections on the page background. Either commit the solution section to a real surface treatment or drop the lone bg-primary/5 tint.
  - **Rule:** _Component patterns: generic border+shadow+white card overuse; Color: random tinted section breaks the palette_
- **🟠 MED · Content** — Title Case headlines on every hero ('Is Your Organization Stuck in a Cycle of Failed Change?', 'Leadership Development That Goes Deeper Than Any Workshop', 'Turn ESG Mandates Into Competitive Advantage', 'When Your Organization Needs a Psychologist, Not Another Consultant'). Title-casing every word is a generic tell; sentence case reads more editorial and human.
  - **Evidence:** OrganizationalChange.tsx:8, LeadershipDevelopment hero in lp-leadership-development__desktop-hero.png, Sustainability.tsx:8, OrganizationalPsychology hero in lp-organizational-psychology__desktop-full.png
  - **Fix:** Switch hero headlines to sentence case (capitalize first word and proper nouns/CLEAR only), e.g. 'Is your organization stuck in a cycle of failed change?'
  - **Rule:** _Content: Title Case On Every Header; use sentence case_
- **🟠 MED · Typography** — Display headings rely on Inter at font-bold (700) with leading-tight/tracking-tight and only 400/500/700 weights in play. The heroes are large but flat — no heavier display weight, no editorial tracking, and the same treatment on all 7 pages — so they lack presence and differentiation. (Inter-everywhere is the known global issue; flagged here only because the hero is the headline moment and re-uses it unchanged.)
  - **Evidence:** index.css:117-118 (.heading-xl text-4xl/5xl/6xl font-bold leading-tight tracking-tight); LandingPage.tsx:65 (heading-xl on hero); heroes in lp-clear-whitepaper__desktop-hero.png and lp-leadership-development__desktop-hero.png
  - **Fix:** Give the hero display type real presence: a distinctive display face (or at least font-extrabold/black weight), tighter optical tracking on large sizes, and text-wrap: balance to avoid the awkward 3-line wraps seen on the long headlines.
  - **Rule:** _Typography: display headings need presence (size/tracking/leading/weight); not Inter-everywhere_
- **🟠 MED · Strategic Omissions** — All 7 share-targeted landing pages emit the same single og:image (/og-image.jpg). When any of these paid/social URLs is shared, every preview looks identical and generic — a missed conversion/branding opportunity for distinct campaign pages.
  - **Evidence:** SEO.tsx:23 (const ogImage = `${siteUrl}/og-image.jpg` — hardcoded, no per-page override); used at SEO.tsx:37,43
  - **Fix:** Allow a per-page ogImage prop on SEO and pass a topic-specific share image for each landing page (org-change, sustainability, merger, etc.).
  - **Rule:** _Code quality / Strategic omissions: per-page social share image (og:image)_
- **🟠 MED · Accessibility** — The newsletter opt-in is a <button type='button'> toggling CheckSquare/Square icons rather than a real checkbox input, and there is no <fieldset>/legend or aria-pressed/role state. It is keyboard-focusable but not announced as a checkbox to assistive tech, and it defaults to opted-in (newsletter=true) which is a consent dark-pattern in some jurisdictions.
  - **Evidence:** WhitepaperGate.tsx:28 (useState(true)) and :179-191 (button type='button' with icon swap, no aria)
  - **Fix:** Use a real <input type='checkbox'> with a linked <label> (or add role='checkbox' + aria-checked). Consider defaulting newsletter opt-in to false to respect explicit consent.
  - **Rule:** _Accessibility: form controls need semantic roles/state; consent should be opt-in_
- **🟡 LOW · Iconography** — All icons are Lucide (AlertTriangle, CheckCircle, ArrowRight, FileText, Download, Check, CheckSquare, Square), and each problem bullet uses the cliche amber AlertTriangle 'warning' metaphor repeated 3x per page across all 7 pages. Lucide-only + repeated warning triangles is a default-AI look.
  - **Evidence:** LandingPage.tsx:3,84 (AlertTriangle on every problem bullet); WhitepaperGate.tsx:3; amber triangles visible in every 'Does this sound familiar?' card
  - **Fix:** Differentiate the icon set (Phosphor/Heroicons or a small custom mark) and consider dropping the per-bullet warning triangle for a subtler marker, keeping one consistent stroke weight.
  - **Rule:** _Iconography: Lucide/Feather exclusively; cliche metaphor icons_

---

## Product landing

**Route:** `/product`

> The /product landing page is structurally complete (hero, pipeline explainer, use cases, proof, pricing teaser) with coherent, specific marketing copy (no Lorem Ipsum, no Acme Corp, real EU/data claim). The CLEAR pipeline visual is a genuinely original component and the strongest moment on the page. However it reads as generic SaaS-template: the hero stacks THREE CTAs with two competing ghost buttons (single-CTA-intent + dual-CTA violations), em-dashes are sprinkled through nearly every copy block (explicit ban), the page leans entirely on the repeated generic .glass-card (border+shadow+white) including a 4-equal-column 'feature row' (the most generic AI layout), the 5-color CLEAR phase palette competes with the locked blue accent (color-consistency-lock risk), low-contrast foreground/50 and /60 body text fails WCAG AA, and the 'Proof' section contains no actual proof (no logos, numbers, or testimonials — just a restated claim). Typography is Inter-everywhere with no display presence and no text-wrap balance, so the hero wraps raggedly with the em-dash mid-line. Buttons inherit the foundation's missing :active state.

**13 findings** — 6 high · 5 medium · 2 low

- **🔴 HIGH · Component Patterns** — The hero presents three CTAs in one row: 'Log in' (btn-primary), 'Start free' (btn-secondary), and 'See a sample report' (btn-secondary). Two equal-weight ghost buttons compete for the same visual slot, and 'Log in' + 'Start free' split the primary conversion intent so no single action is dominant. This is exactly the 'no two CTAs with the same intent' / single-CTA-intent violation.
  - **Evidence:** src/pages/product/ProductLanding.tsx:41-52 and product__desktop-hero.png (three buttons side by side)
  - **Fix:** Lead with ONE primary CTA. Make 'Start free' the single filled btn-primary (it is the actual conversion goal), demote 'See a sample report' to a quiet text link with an arrow, and move 'Log in' out of the hero into the top nav (where a Log in button already exists). One filled + one link, not three buttons.
  - **Rule:** _Always one filled button + one ghost button / single CTA intent_
- **🔴 HIGH · Content** — Em-dashes are used in UI copy across nearly every block: the H1 ('behavior — backed by science'), the hero body ('act on — in minutes, not months'), three of four pipeline step bodies ('Clarify + Leverage', 'Share as PDF or Markdown — ready for your team'), and the proof statement ('CLEAR Change Framework — the same...'). The taste-skill pre-flight bans em-dashes in UI copy.
  - **Evidence:** src/pages/product/ProductLanding.tsx:32-34 (h1), :38-39 (body), :17 (export step), :96-97 (proof) and product__desktop-hero.png (em-dash visible mid-line in the headline)
  - **Fix:** Replace em-dashes with periods, commas, or restructured sentences. e.g. H1: 'Move your target group's behavior. Backed by science, not a six-figure consultancy.' Proof: 'Built on the CLEAR Change Framework, the same behavioral-science method used in enterprise change programs.'
  - **Rule:** _Em-dash ban in UI copy_
- **🔴 HIGH · Color & Surfaces** — The CLEAR pipeline renders five distinct hues simultaneously (--phase-c blue, --phase-l teal, --phase-e green, --phase-a amber, --phase-r pink) right next to the locked blue brand accent (--primary). On a landing page this reads as a rainbow and breaks the one-accent-per-page lock; the warm amber/pink in particular fight the cool blue brand. This is the exact '5-color CLEAR phase palette' the color-consistency lock warns about.
  - **Evidence:** src/index.css:48-52 (--phase-c through --phase-r) consumed in src/components/product/Pipeline.tsx:24-26; product__desktop-full.png (multicolor pipeline chips)
  - **Fix:** On this marketing page, render the pipeline in a single accent family: active phases (C, L) in the brand blue and the three 'later' phases in neutral gray (they are already opacity-40). Reserve the full 5-color spectrum, if it must exist, for the in-app report where the legend carries meaning — not on the public landing hero.
  - **Rule:** _Color-consistency lock: one accent locked across the whole page_
- **🔴 HIGH · Accessibility** — Secondary body text uses text-foreground/50 and text-foreground/60 over the near-white --background (210 20% 98%). foreground is 220 20% 10%; at 50% alpha that resolves to roughly a mid-gray on off-white at about 3.5:1 contrast, below the 4.5:1 WCAG AA minimum for small text. Affected: the proof caption ('processed in the EU...', text-sm /50) and all four pipeline step descriptions (/60).
  - **Evidence:** src/pages/product/ProductLanding.tsx:71 (text-foreground/60 step bodies), :98 (text-foreground/50 proof caption); product__desktop-full.png (faint gray captions)
  - **Fix:** Use a token that meets AA: text-muted-foreground is defined as 220 10% 40% (a solid ~4.6:1). Replace text-foreground/50 and /60 with text-foreground/70 or text-muted-foreground for any text below 18px.
  - **Rule:** _Button & form contrast must meet WCAG AA (4.5:1 body)_
- **🔴 HIGH · Layout** — The 'Built for behavior that matters' section is four equal glass-card columns (sm:grid-cols-2 lg:grid-cols-4) of short, equal-length copy. Four identical cards in a row is the most generic AI feature-row layout, and because each card holds only a title + one sentence the grid adds boxes without adding hierarchy.
  - **Evidence:** src/pages/product/ProductLanding.tsx:81-88; product__desktop-full.png (four identical bordered cards)
  - **Fix:** Drop the cards entirely and use a 2-column asymmetric list (title left, body right) or a simple definition list with hairline dividers, no borders or shadows. If a grid is kept, vary it: a 2x2 with one promoted example, or pair each use case with a one-line outcome metric so the cards earn their elevation.
  - **Rule:** _Three equal card columns as feature row / Generic card look_
- **🔴 HIGH · Strategic Omissions** — The section literally titled 'Proof' contains no proof. It is a single restated marketing sentence about the CLEAR framework inside a tinted glass-card, with zero customer logos, outcome numbers, named testimonials, or citations. A proof section with no evidence is an AI-slop tell and undermines the 'used in enterprise change programs' claim it makes.
  - **Evidence:** src/pages/product/ProductLanding.tsx:91-102 (Proof comment; only two <p> claims, no data); product__desktop-full.png (tinted card with one centered paragraph)
  - **Fix:** Add real proof: a logo strip of organizations that use the method, one or two attributed quotes with name/role/org, or a concrete outcome stat (e.g. an organic figure like '23% lift in onboarding completion'). If no proof exists yet, rename the section to set expectation honestly (e.g. 'The method behind it') rather than calling it Proof.
  - **Rule:** _Strategic Omissions / fake credibility_
- **🟠 MED · Typography** — The H1 (heading-xl => text-6xl) is constrained to max-w-4xl with no text-wrap: balance, so it wraps into three ragged lines and breaks across the em-dash mid-line ('behavior — backed by science,'). The break lands awkwardly and the line lengths are uneven, which reads as unconsidered.
  - **Evidence:** src/pages/product/ProductLanding.tsx:32-35; product__desktop-hero.png (3-line ragged wrap, em-dash starting line 2)
  - **Fix:** Add text-wrap: balance (or text-balance) to the H1 and remove the em-dash so the break can fall on a clean clause. Consider a deliberate <br/> after the first clause for editorial control of the wrap.
  - **Rule:** _Orphaned words / text-wrap balance_
- **🟠 MED · Typography** — Display headings have no real presence beyond size. heading-xl/lg are Inter (font-display maps to the same Inter stack) at font-bold with default tracking-tight, no distinct display face, no tighter optical leading, no weight contrast. The hero headline therefore looks like default bold body text scaled up rather than an intentional display treatment.
  - **Evidence:** src/index.css:67-70 (h-tags just font-display tracking-tight), :117-123 (heading-xl/lg); index.css:194 imports Inter as the only family; product__desktop-hero.png
  - **Fix:** Give display headings their own character: a real display face (Geist, Cabinet Grotesk, or a serif for editorial contrast), tighter tracking at large sizes (tracking-[-0.02em]) and leading-[1.05], and reserve font-bold/800 for display while body stays 400/500. This is a foundation issue but the hero makes it most visible.
  - **Rule:** _Headlines lack presence / not Inter-everywhere_
- **🟠 MED · Component Patterns** — Every content block on the page is the same generic .glass-card (white background + border + shadow + rounded-2xl): the pipeline wrapper, each of the four use-case cards, and the proof block. With no variation, cards stop communicating hierarchy and just become the page's only texture, which is the 'generic card look' tell repeated four-plus times.
  - **Evidence:** src/pages/product/ProductLanding.tsx:57, :83, :93 (all .glass-card); src/index.css:77-79 (border+shadow+white); product__desktop-full.png
  - **Fix:** Reserve elevation for one or two moments. Make the pipeline a bordered/elevated panel, but render use cases as borderless (background tint or spacing only) and the proof as a full-bleed tinted band rather than a floating card. Differentiate radii (tighter inner, softer container) instead of uniform rounded-2xl.
  - **Rule:** _Generic card look (border + shadow + white background)_
- **🟠 MED · Iconography** — All icons are Lucide (Upload, Sparkles, Lock, FileDown, ArrowRight) — the default AI icon set — and several use cliche metaphors: Sparkles for the 'Clarify + Leverage' (AI-magic) step and a padlock for 'Unlock the full report'. Lucide-exclusive plus magic-sparkles is a recognizable slop signature.
  - **Evidence:** src/pages/product/ProductLanding.tsx:2 (lucide-react imports), :13-18 (Sparkles, Lock used as step icons); product__desktop-full.png (small round icon chips in the steps row)
  - **Fix:** Switch to Phosphor or a custom set with one consistent stroke weight, and replace the magic 'Sparkles' with something concrete to the action (e.g. a target/crosshair or graph node for Clarify+Leverage). Keep the lock only if the paywall metaphor is intentional, but vary it from the default.
  - **Rule:** _Lucide or Feather icons exclusively / cliche metaphors_
- **🟠 MED · Interactivity & States** — Primary CTAs use .btn-primary, which has a hover (bg shift + sweep :before) but no :active/pressed state, so clicks give no physical feedback. The hero CTAs and the two 'See pricing' / 'See a sample report' actions all inherit this. (Foundation-level, but this page is built almost entirely out of these buttons.)
  - **Evidence:** src/index.css:97-107 (.btn-primary has :hover/:before, no :active); src/pages/product/ProductLanding.tsx:42-51, :111-114
  - **Fix:** Add an :active state to .btn-primary and .btn-secondary (e.g. active:scale-[0.98] active:translate-y-px) so presses read as physical clicks.
  - **Rule:** _No active/pressed feedback_
- **🟡 LOW · Content** — Headings are inconsistent in case: most use sentence case ('Built for behavior that matters', 'Start free. Pay when you need the full report.') but the pipeline step labels and use-case titles read as fragment labels and the brand framework name 'CLEAR Change Framework' is title-cased inline. Minor, but the mix of sentence-case headers and capitalized inline phrases reads slightly unconsidered.
  - **Evidence:** src/pages/product/ProductLanding.tsx:58 ('The CLEAR pipeline'), :96 ('CLEAR Change Framework')
  - **Fix:** Confirm a single casing rule for headings (sentence case) and treat 'CLEAR' consistently as the product/acronym while keeping surrounding words sentence case. Low priority cleanup.
  - **Rule:** _Title Case On Every Header / sentence case_
- **🟡 LOW · Layout** — The hero is fully centered (tag, headline, body, CTAs all mx-auto text-center) and so is every following section heading — a top-to-bottom centered column. Combined with the centered card grids this is the symmetrical, everything-centered layout the checklist flags; nothing anchors the eye or breaks the axis.
  - **Evidence:** src/pages/product/ProductLanding.tsx:30 (text-center hero), :58/:80/:106 (all centered headings); product__desktop-full.png
  - **Fix:** Introduce one asymmetric moment: left-align the hero with the pipeline visual offset to the right, or left-align section headers over the card grids, so the page is not a single centered stack.
  - **Rule:** _Everything centered and symmetrical_

---

## Sample report

**Route:** `/product/sample`

> The public CLEAR sample report (/product/sample) is a content-dense, read-only product surface and is, on the whole, thoughtfully built: it has a real Back link, a single unambiguous 'Start free' CTA, a max-w-3xl reading column that keeps body copy well under 65ch, genuinely good empty-state guards (GapFlagList 'None recorded.', conditional sections), realistic non-round data (31%, 58% drop-off, confidence 78/64/57), and a standout LeveragePriorityMap SVG with real hover scale, focus-visible state, keyboard (Enter/Space) handlers and descriptive aria-labels. Routing note: this is product/data UI, so it is correctly judged on clarity, density and legibility rather than landing-page polish. The dominant problem is COLOR: the page runs seven-plus accent hues at once — primary blue, phase-c blue, phase-l teal, phase-a amber, plus raw Tailwind emerald/rose/sky/violet — which breaks the 'one accent locked' pre-flight gate, and the same teal/amber carry contradictory meaning in different widgets. Layered on top is a systemic CONTRAST failure: low-opacity foreground text (/30-/50) and every colored badge ('High' teal at 2.04:1, Medium/assumption amber at ~2.9:1, emerald/sky/rose flags 3.3-3.9:1) fall below WCAG AA, and the teal 'Do first' label in the priority map is 2.31:1. Foundation-level items (Inter/SF-Pro font, generic .glass-card, uniform radius, btn-primary lacking :active) are not re-litigated here except where this page amplifies them.

**10 findings** — 4 high · 3 medium · 3 low

- **🔴 HIGH · Color & Surfaces** — No single accent is locked across the page. One scroll surfaces primary blue (logo, 'Start free', tag, priority-map bubbles, 'Why each lever works' rail), phase-c blue (Clarify chip), phase-l teal (Leverage chip, priority map, 'High' badges, 'weakens'), phase-a amber ('strengthens', Medium badges), plus raw Tailwind emerald (Approved, Verified, High), rose (Gap, strongest-barriers rail), sky (input_needed), and violet (needs_input/requires_confirmation). That is 7+ competing hues — the exact 'watch the 5-color CLEAR phase palette' failure the pre-flight gate warns about.
  - **Evidence:** GapFlagList.tsx:4-11 (amber/rose/sky/violet flag map); ClarifyCard.tsx:10-16 (phase-c chip + emerald 'Approved'); TeaserReport.tsx:13 (phase-l chip); LeverageTable.tsx:3-7 (phase-l + phase-a + amber-600); CombMatrix.tsx:4-9 (emerald/amber/rose); product-sample__desktop-full.png
  - **Fix:** Lock ONE brand accent for interactive/brand elements (the primary blue) and demote the phase colors to a small, fixed semantic legend. Collapse the evidence/flag palette from five hues to at most three roles (e.g. positive=emerald, caution=amber, blocker=rose) and reuse those exact three everywhere; drop sky and violet. Make the Clarify chip and CTA share one blue token instead of primary vs phase-c.
  - **Rule:** _More than one accent color / Color-consistency lock (one accent locked across the page)_
- **🔴 HIGH · Accessibility** — Colored badge text fails WCAG AA, several badly. Computed against the white card: 'High' badge text-[hsl(var(--phase-l))] on phase-l/15 = 2.04:1; 'Medium' badge text-amber-600 on phase-a/15 = 2.91:1; assumption/gap-flag amber-600 on amber-500/15 = 2.84:1; emerald-600 on emerald-500/15 = 3.26:1; sky-600 on sky-500/15 = 3.51:1; rose-600 on rose-500/15 = 3.85:1. All are below the 4.5:1 minimum for this small (10-12px) text, and the teal one is below even 3:1.
  - **Evidence:** LeverageTable.tsx:3-7 (High=phase-l on phase-l/15); LeverageTable.tsx:28 (Assumption-based amber); CombMatrix.tsx:4-9; GapFlagList.tsx:4-11; FlagBadge GapFlagList.tsx:14
  - **Fix:** Darken each badge's text token to its -700/-800 step (e.g. emerald-700 #047857, amber-700 #b45309, rose-700 #be123c, sky-700 #0369a1) and/or raise the tint background opacity from /15 to ~/20-/25 so small label text clears 4.5:1. For the teal 'High' badge, stop using --phase-l (172 66% 45%) as text on its own tint — substitute a darkened teal (~172 70% 28%) or render it as emerald like the other 'positive' states.
  - **Rule:** _Button & form contrast must meet WCAG AA (4.5:1 body); missing/insufficient contrast_
- **🔴 HIGH · Accessibility** — Pervasive low-opacity foreground text is unreadable. foreground/45 = 2.92:1, foreground/40 = 2.54:1, foreground/30 = 1.95:1 against the card — all far below AA. This is used for real, meaningful content: KR metric/baseline/target meta, COM-B significance and source captions, the 'x' separators in the Impact x Changeability column, and flag source attributions.
  - **Evidence:** CombMatrix.tsx:39 (significance text-foreground/45), CombMatrix.tsx:46,48,50 (foreground/40 and /30 separators), CombMatrix.tsx:64 (source text-foreground/45); ClarifyCard.tsx:26 (KR meta foreground/60 ~4.66:1 OK but adjacent); GapFlagList.tsx:29 (source text-foreground/45); FullReport.tsx:63 (combLabel foreground/45)
  - **Fix:** Raise secondary/caption text to at least foreground/60 (4.66:1) and ideally /70 for the smallest sizes; reserve /40-/45 only for truly decorative glyphs (and even the 'x'/'—' separators read as data here, so lift them too).
  - **Rule:** _Real states / contrast — secondary text must still meet AA_
- **🔴 HIGH · Color & Surfaces** — Semantic color is contradictory across widgets. In the systems map, teal (--phase-l) means 'weakens' and amber (--phase-a) means 'strengthens' — but on the very same page teal is the brand 'Leverage'/'Do first'/'High-impact-good' color (priority map 'Do first' zone, 'High' badges) and amber is the 'Medium/caution/Assumption-based' color. So one color simultaneously signals 'good, do this' and 'this link weakens', and another signals both 'strengthens' and 'caution'. A reader cannot build a stable color mental model.
  - **Evidence:** CauseEffectMap.tsx:11-12 + 35-39 (AMBER=strengthens, TEAL=weakens) vs LeveragePriorityMap.tsx:22,86-99 (TEAL 'Do first' + High) and LeverageTable.tsx:3-4 (High=teal, Medium=amber)
  - **Fix:** Decouple causal polarity from the brand/priority palette. Use a neutral, dedicated polarity pair (e.g. a single slate/ink for the link with + and - glyphs carrying the meaning, or green-up/red-down used ONLY for polarity) and keep teal exclusively for leverage-priority and amber exclusively for caution. Add a one-line legend so the mapping is explicit.
  - **Rule:** _Color-consistency lock / consistent semantic meaning per hue_
- **🟠 MED · Accessibility** — The priority map's own labels are low-contrast teal-on-white. The 'Do first' callout and the teal axis/legend usage render --phase-l (172 66% 45%) directly on the white card at 2.31:1 — below the 3:1 minimum for large/graphical text. On the busy SVG grid this small 12px teal label is hard to read.
  - **Evidence:** LeveragePriorityMap.tsx:97-99 ('Do first' text fill=TEAL), LeveragePriorityMap.tsx:22; product-sample__desktop-full.png (priority-map panel)
  - **Fix:** Use a darkened teal (~172 70% 28%) for the 'Do first' label text, or place it on the filled teal/0.08 zone with sufficient weight; keep the bright --phase-l only for the filled bubbles where it sits on white as a shape (the inside number is white, which is fine).
  - **Rule:** _Button & form contrast must meet WCAG AA (3:1 large/UI)_
- **🟠 MED · Component Patterns** — Two near-identical blues are used as if they were one. --primary is 220 80% 48% and --phase-c is 220 80% 55% — same hue/sat, 7% lightness apart. The Clarify section chip uses phase-c while the nav logo, tag, 'Start free' CTA, priority-map bubbles and the 'Why each lever works' accent rail use primary. The tiny delta reads as an inconsistency/accident rather than an intentional distinction.
  - **Evidence:** index.css:17 (--primary) vs index.css:48 (--phase-c); ClarifyCard.tsx:10; Sample.tsx:35,52; LeveragePriorityMap.tsx (bubbles use TEAL not blue, compounding the blue ambiguity)
  - **Fix:** Either make the Clarify chip use --primary so all blues match, or push --phase-c meaningfully different (it is the 'C' phase identity) — do not leave a 7% lightness gap that looks like a token mistake.
  - **Rule:** _More than one accent color / mixing near-identical tokens_
- **🟠 MED · Layout** — The COM-B matrix is a 4-column data table with overflow-x-auto but no min-width, so on narrow viewports it crushes long barrier/significance text into very tall, hard-to-scan rows rather than scrolling or reflowing. The mobile full-page screenshot shows the COM-B and behavior content compressed and dense.
  - **Evidence:** CombMatrix.tsx:21-23 (overflow-x-auto, table w-full, no min-w); product-sample__mobile-full.png
  - **Fix:** Give the table a sensible min-width (e.g. min-w-[640px]) inside the overflow-x-auto wrapper so it scrolls horizontally on mobile instead of column-crushing, or switch to a stacked card layout below sm: where each barrier becomes a labeled block (component / barrier / impact x changeability / evidence).
  - **Rule:** _Hardcoded/percentage table math — use a layout that survives small screens; data legibility_
- **🟡 LOW · Content** — Em-dash in hardcoded UI chrome copy. The page subhead uses ' — ' as a sentence connector in author-written UI copy (not report data), which the UI copy em-dash ban flags. It renders visibly in the hero screenshot.
  - **Evidence:** Sample.tsx:38-39 ('...full COM-B barrier analysis — the same output...'); product-sample__desktop-hero.png
  - **Fix:** Replace the em-dash in the subhead with a period or a colon: '...the full COM-B barrier analysis. The same output you get on your own challenge.' (Leave em-dashes inside fixture report bodies; those are data, not chrome.)
  - **Rule:** _Em-dash ban in UI copy_
- **🟡 LOW · Interactivity & States** — The page's only true CTA, 'Start free', inherits .btn-primary which has a :hover and a ::before shimmer but no :active/pressed state, so the click has no physical feedback. (Global btn-primary issue, but this page's single conversion action is the place a user actually presses it.)
  - **Evidence:** Sample.tsx:52 (Link className btn-primary); index.css:97-107 (btn-primary hover + ::before, no :active)
  - **Fix:** Add an :active state to .btn-primary (e.g. active:scale-[0.98] active:translate-y-px) so the primary conversion button registers the press.
  - **Rule:** _No active/pressed feedback_
- **🟡 LOW · Component Patterns** — Heavy reliance on the generic .glass-card (white + border + shadow-lg) for every section block — Clarify, Leverage, Observable behaviors, Systems map, COM-B, Strongest barriers, Why-each-lever, Gap log, Discovery, and the CTA — produces a uniform stack of eight-plus identical floating white cards with no hierarchy between primary content and the CTA. (Foundation flags .glass-card globally; noted here because this page multiplies it ~10x with no differentiation.)
  - **Evidence:** FullReport.tsx:23,34,45,57,73,87,91 (glass-card x7); ClarifyCard.tsx:8; TeaserReport.tsx:10; Sample.tsx:49 (CTA card); product-sample__desktop-full.png
  - **Fix:** Reduce elevation to communicate hierarchy: keep the shadowed card for the free teaser and the CTA, and render the methodology sections as borderless or hairline-divided blocks on the page background so the report reads as one document rather than ten stacked panels. Vary radius/elevation between the CTA and the data sections.
  - **Rule:** _Generic card look (border + shadow + white background); elevation should communicate hierarchy_

---

## Pricing

**Route:** `/pricing`

> The /pricing page is functional and reasonably clean: it correctly locks to a single blue accent (no CLEAR 5-color phase palette leak), the recommended tier gets a filled primary CTA, btn-secondary text/background contrast is fine (~9:1, dark foreground on light gray), and tier data is realistic (no $99.99 / Acme placeholders). The strongest problems are not styling but structure and states: an em-dash in the subhead (violates the UI em-dash ban), a 4-equal-tower pricing grid whose feature lists and price rows start at different Y positions because only the highlighted card carries the 'Most popular' badge, no visible focus ring or :active state on the link-styled CTAs (a11y gate), three indistinguishable gray secondary CTAs competing for attention, an inconsistent button treatment between the two card grids (w-full vs auto-width), and a heading hierarchy that jumps h1 -> h3. The global cookie banner also sits on top of the pricing cards in every captured viewport, fully hiding the highlighted Solo card's price on mobile. The recommended-tier emphasis is a thin ring only, not real elevation. Most fixes are low-risk and improve clarity and legibility rather than demanding a marketing redesign.

**13 findings** — 3 high · 6 medium · 4 low

- **🔴 HIGH · Content** — The hero subhead uses an em-dash inside UI copy: 'Pay per-report or subscribe — whichever fits how often you ship change.' The mandatory pre-flight gate bans em-dashes in interface copy. The same em-dash repeats in the Single report unlock body ('when you need it — the per-deliverable option').
  - **Evidence:** src/pages/product/Pricing.tsx:22-23 (and the same dash visible in pricing__desktop-hero.png subhead); src/config/billing.ts:71
  - **Fix:** Replace em-dashes with a period or restructure: 'Pay per report or subscribe. Pick whichever fits how often you ship change.' Apply the same to the unlock copy in billing.ts.
  - **Rule:** _Em-dash ban in UI copy_
- **🔴 HIGH · Interactivity & States** — The plan CTAs are <Link> anchors styled with btn-primary / btn-secondary. btn-secondary defines only 'transition-colors' with no :active/pressed state and no focus-visible ring; btn-primary likewise has hover but no :active. Keyboard users get only the browser default outline (and on anchors styled as buttons that is easy to lose), so there is no reliable visible focus indicator on any of the six purchase CTAs.
  - **Evidence:** src/pages/product/Pricing.tsx:52-57, 74-77, 86-88; src/index.css:97-111 (btn-primary / btn-secondary definitions, no :active, no focus-visible)
  - **Fix:** Add a shared focus-visible ring (e.g. focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2) and an :active state (active:scale-[0.98] or active:translate-y-px) to both button utilities so all CTAs show pressed + focus feedback.
  - **Rule:** _Real states: visible focus ring + :active/pressed_
- **🔴 HIGH · Layout** — The four tier cards are rendered as equal towers, and their internal rows do not align across columns. Only the highlighted Solo card carries the 'Most popular' badge (rendered above the title), which pushes Solo's title, price and feature list down relative to Free / Team / Business. In pricing__desktop-full.png the 'Solo' title and '$49' price sit visibly lower than the other three titles/prices, so the price row and the start of the feature checklist are misaligned across the row.
  - **Evidence:** src/pages/product/Pricing.tsx:30-51 (badge at line 36-38 only on highlight; no reserved slot); pricing__desktop-full.png (Solo column offset lower than Free/Team/Business)
  - **Fix:** Reserve a fixed-height badge slot on every card (render the badge area always, empty when not highlighted) or move the badge to an absolutely-positioned ribbon so titles, price rows and feature lists begin at the same Y across all four columns. Consider min-h on the title+price block.
  - **Rule:** _Feature lists / prices starting at different vertical positions; Pricing table with 3 towers_
- **🟠 MED · Component Patterns** — Three of the four tier CTAs (Free 'Start free', Team 'Choose Team', Business 'Choose Business') all render the identical gray btn-secondary, plus the two lower cards add two more gray secondary buttons. The page therefore shows five near-identical low-contrast gray buttons and a single blue one. With every paid upgrade except Solo styled the same weak gray, the visual hierarchy gives the buyer no read on relative importance.
  - **Evidence:** src/pages/product/Pricing.tsx:54 (highlight ? btn-primary : btn-secondary), 74, 86; pricing__desktop-full.png (Choose Team / Choose Business / Start free / Unlock this report / Contact us all gray)
  - **Fix:** Differentiate tiers: keep one filled primary (Solo), make the other tier CTAs an outline/bordered button (clearly clickable, higher contrast than the flat gray fill), and demote Enterprise to a tertiary text link. Avoid five flat-gray buttons reading as one undifferentiated block.
  - **Rule:** _Always one filled + one ghost button (reduce duplicate-intent buttons); Highlight recommended tier with emphasis_
- **🟠 MED · Component Patterns** — Button treatment is inconsistent between the two card grids. The four tier CTAs use 'w-full' (full-width, centered), while the lower 'Unlock this report' and 'Contact us' CTAs are plain btn-secondary with no width class, so they shrink to content width and left-align. The result reads as two unrelated card systems on one page.
  - **Evidence:** src/pages/product/Pricing.tsx:54 (w-full) vs 74 and 86 (no w-full); pricing__desktop-full.png (full-width tier buttons above, small left-aligned buttons below)
  - **Fix:** Pick one CTA-width convention per card family. Either make the unlock/enterprise CTAs w-full like the tiers, or intentionally bottom-pin and align them; do not mix full-width and auto-width button styles between adjacent card grids.
  - **Rule:** _Buttons not bottom-aligned / inconsistent in card groups_
- **🟠 MED · Layout** — The page splits pricing across two grids of different column counts: a 4-column tier grid then a separate 2-column grid for 'Single report unlock' (tinted bg-primary/5) and 'Enterprise'. The $200+ one-off (a genuinely distinct purchase path) is orphaned below the four towers and below the fold, and the 2-col block does not align to the 4-col block above it, so the page bottom looks like a leftover row.
  - **Evidence:** src/pages/product/Pricing.tsx:28 (lg:grid-cols-4) vs 63 (md:grid-cols-2 mt-6); pricing__desktop-full.png (two cards on the lower half, wider than the tier columns)
  - **Fix:** Integrate the one-off and enterprise options into the same grid rhythm (e.g. a full-width 'or buy a single report' band that spans the tier grid width, or a 4-up row that continues the column structure) so the per-deliverable option is visible and the layout reads as one system.
  - **Rule:** _Three equal card columns / inconsistent vertical rhythm in side-by-side elements_
- **🟠 MED · Component Patterns** — The recommended tier is differentiated almost entirely by a 2px ring plus the badge; the card body itself has no elevation, scale, or background emphasis over the other three. On a light page the thin blue ring is a weak signal for 'this is the one to buy', and it is the only structural difference besides the filled button.
  - **Evidence:** src/pages/product/Pricing.tsx:33 (plan.highlight ? 'ring-2 ring-primary' : ''); pricing__desktop-full.png (Solo card same size/elevation as neighbors)
  - **Fix:** Give the highlighted tier real emphasis: a tinted or slightly elevated surface, subtle scale or a taller card, and/or a colored header band, in addition to the ring and filled CTA, so the recommended plan is unmistakable.
  - **Rule:** _Pricing table: highlight the recommended tier with color and emphasis, not just a ring_
- **🟠 MED · Accessibility** — Heading hierarchy skips a level. The page goes from the h1 hero ('Simple, productized pricing') straight to h3 for every card title (Free, Solo, Team, Business, Single report unlock, Enterprise). There is no h2, so the document outline is broken for screen-reader and SEO structure.
  - **Evidence:** src/pages/product/Pricing.tsx:20 (h1) then 39, 65, 80 (h3 with no intervening h2)
  - **Fix:** Either promote the card titles to h2, or add a visually-hidden/section h2 (e.g. 'Plans') above the tier grid and a second for the one-off/enterprise section, so headings descend h1 -> h2 -> h3 without skipping.
  - **Rule:** _Code quality / semantic HTML: correct heading hierarchy_
- **🟠 MED · Layout** — The global cookie consent bar overlaps the pricing content in every captured viewport, and the page's own layout makes this worse than elsewhere because the most commercially important cards sit at the fold. On desktop the bar covers the '$200+' price of the Single report unlock card; on mobile the bar completely hides the highlighted Solo card's name and '$49 /mo' price.
  - **Evidence:** pricing__desktop-full.png (banner over 'Single report unlock $200+'); pricing__mobile-full.png (banner sitting on top of the Most-popular Solo card, hiding Solo + $49)
  - **Fix:** Although the banner is global, ensure pricing content is not occluded: add bottom padding/scroll offset to the pricing container while the banner is shown, or render the banner as a layout-pushing element rather than a fixed overlay on this route, so no plan price is hidden.
  - **Rule:** _Strategic omissions / no overlap obscuring content_
- **🟡 LOW · Component Patterns** — The 'Most popular' badge uses the generic pill style (.tag = rounded-full bg-primary/10 text-primary). Combined with the rounded-2xl cards and rounded-full badge, the recommended-tier marker reads as a default component rather than a deliberate flag.
  - **Evidence:** src/pages/product/Pricing.tsx:37; src/index.css:137-139 (.tag rounded-full pill)
  - **Fix:** Consider a squared or ribbon-style badge, or an inline label tied to the colored header treatment, to make the 'Most popular' marker feel intentional rather than the default pill.
  - **Rule:** _Pill-shaped New/Beta badges -> try square badges or flags_
- **🟡 LOW · Typography** — The centered subhead wraps to two lines at ~70-75 characters (max-w-2xl on text-lg), slightly above the ~65ch comfortable measure, and the second line ('you ship change.') ends close to an orphan. On mobile the same paragraph wraps to three lines with an em-dash mid-line.
  - **Evidence:** src/pages/product/Pricing.tsx:21-24 (body-lg max-w-2xl); pricing__mobile-full.png (3-line subhead)
  - **Fix:** Tighten the measure to ~max-w-xl (~60-65ch) and/or apply text-wrap: balance so the subhead breaks evenly and stays under the measure cap.
  - **Rule:** _Body text <= ~65ch; orphaned words_
- **🟡 LOW · Iconography** — Icons are Lucide (Check, ArrowRight), the default AI icon set. The page is otherwise icon-light so impact is small, but it is the generic choice and is consistent with the Foundation-level Lucide-everywhere observation.
  - **Evidence:** src/pages/product/Pricing.tsx:2 (import { Check, ArrowRight } from 'lucide-react')
  - **Fix:** If the design system migrates off Lucide (e.g. to Phosphor/Heroicons or a custom set), include these checklist and arrow glyphs; otherwise leave as-is. Low priority on this surface.
  - **Rule:** _Lucide/Feather icons exclusively_
- **🟡 LOW · Content** — Two price tokens are vague: the one-off plan shows '$200+' and Enterprise shows 'Custom'. '$200+' in particular is a soft, open-ended number next to the precise $49 / $299 / $999 tier prices and reads as a placeholder rather than a real anchor.
  - **Evidence:** src/config/billing.ts:77 (price: '$200+'); src/pages/product/Pricing.tsx:81 ('Custom')
  - **Fix:** Give the one-off a concrete 'from' price (e.g. 'From $200') or a single number; 'Custom' for Enterprise is acceptable. Keep the price language consistent in tone with the precise subscription prices.
  - **Rule:** _Fake round / hand-wavy numbers -> use concrete, specific data_

---

## Login

**Route:** `/login`

> A clean, restrained passwordless login: single blue accent locked across the wordmark and links (no 5-color CLEAR-phase palette leakage here), sentence-case headings, plain copy, and a tasteful highlighted 'C' in the CLEAR wordmark. The magic-link primary flow, Google fallback, and divider are conventional and readable. The main weaknesses are real-state gaps that the audited screenshot can't show because it renders the Supabase-not-configured branch: the Google OAuth path has no loading or error handling, form errors surface only as an ephemeral toast instead of inline, and neither button exposes a focus-visible ring (a keyboard-a11y miss). There are two em-dash UI-copy violations, a 100vh (not 100dvh) full-height wrapper, and an all-centered card that center-aligns even the form field. The generic glass-card/Inter foundation is inherited and not made worse here.

**11 findings** — 3 high · 4 medium · 4 low

- **🔴 HIGH · Content** — Em-dash used in user-facing UI copy in two places: the signup subhead 'Start free — no credit card. We'll email you a magic link.' and the SEO/browser titles 'Start free — CLEAR' / 'Log in — CLEAR'. The em-dash-in-copy ban is an explicit pre-flight gate and a common AI-writing tell.
  - **Evidence:** src/pages/product/Login.tsx:64 ("Start free — no credit card") and :46 ("Start free — CLEAR" / "Log in — CLEAR")
  - **Fix:** Replace em-dashes with a period or comma: 'Start free. No credit card. We'll email you a magic link.' and titles 'Start free · CLEAR' / 'Log in · CLEAR' (or 'Log in to CLEAR').
  - **Rule:** _Em-dash ban in UI copy_
- **🔴 HIGH · Interactivity & States** — Neither the primary submit button nor the secondary 'Continue with Google' button has a visible keyboard focus ring. The input gets focus:ring-2 focus:ring-ring, but .btn-primary and .btn-secondary define only hover/transition with no :focus-visible style, so a keyboard user tabbing through the form has no visible focus indicator on the two main actions.
  - **Evidence:** src/index.css:97-107 (.btn-primary, only :before/:hover) and :109-111 (.btn-secondary, only hover); buttons rendered at src/pages/product/Login.tsx:91,99
  - **Fix:** Add focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none to both .btn-primary and .btn-secondary so keyboard focus is always visible.
  - **Rule:** _Visible focus ring (Real states)_
- **🔴 HIGH · Interactivity & States** — The Google OAuth action has no loading state and no error handling. google() awaits supabase.auth.signInWithOAuth but ignores the returned { error }, so an OAuth failure is silently dropped and the button gives no pressed/disabled/loading feedback while the redirect resolves. Contrast with the magic-link path which at least toasts the error and shows 'Sending…'.
  - **Evidence:** src/pages/product/Login.tsx:35-41 (google() ignores error, no setLoading) vs :23-33 (magic link handles error + loading)
  - **Fix:** Capture the { error } from signInWithOAuth and surface it inline; disable the Google button and show a 'Redirecting…' label while the call is in flight, mirroring the magic-link flow.
  - **Rule:** _Real states (loading + error)_
- **🟠 MED · Interactivity & States** — Form/auth errors are shown only via an ephemeral sonner toast (toast.error(error.message)). A login error (e.g. rate-limited, invalid email) needs a persistent, inline message tied to the form; a toast auto-dismisses and is easy to miss, and the raw Supabase error.message is leaked verbatim to the user.
  - **Evidence:** src/pages/product/Login.tsx:29 (toast.error(error.message))
  - **Fix:** Render an inline error region below the input (role="alert") with a friendly mapped message, e.g. 'We couldn't send the link. Check the address and try again.' Keep the toast optional but do not rely on it as the only error surface.
  - **Rule:** _Add clear, inline error messages for forms (No error states)_
- **🟠 MED · Layout** — The wrapper uses min-h-screen (= min-height: 100vh). On mobile browsers the 100vh viewport bug causes the centered card to jump as the iOS Safari address bar shows/hides. The skill calls for min-height: 100dvh on full-screen sections.
  - **Evidence:** src/pages/product/Login.tsx:44 (min-h-screen ...) ; mobile rendering: login__mobile-full.png
  - **Fix:** Use min-h-[100dvh] (or Tailwind min-h-dvh) instead of min-h-screen for the full-height auth wrapper.
  - **Rule:** _Use min-height: 100dvh, not 100vh (Layout)_
- **🟠 MED · Layout** — Everything inside the card is center-aligned, including the form field, button labels, and the email-sent confirmation. Center-aligned form inputs and helper text reduce scannability; left-aligning the input column (while a centered heading is fine) reads as more deliberate and is easier to fill in.
  - **Evidence:** src/pages/product/Login.tsx:59,62 (text-center on heading+subhead), :74 (sent state text-center), :105 (footer text-center); login__desktop-full.png
  - **Fix:** Keep the heading centered if desired, but left-align the form block (input, button, 'Check your email' confirmation) so the field and its future inline error/label form a clean left edge.
  - **Rule:** _Everything centered and symmetrical (Layout)_
- **🟠 MED · Accessibility** — The email input has a placeholder ('you@company.com') but no associated <label>. Placeholder-as-label disappears on focus/typing and is not reliably announced; combined with the very light --input border (220 16% 90%) on a near-white card, the field affordance is faint.
  - **Evidence:** src/pages/product/Login.tsx:83-90 (input with placeholder, no label/aria-label); border token src/index.css:33 (--input: 220 16% 90%)
  - **Fix:** Add a visible or sr-only <label htmlFor> (e.g. 'Work email') tied to the input, or at minimum aria-label="Email address". Consider a slightly darker input border for clearer affordance.
  - **Rule:** _Form labels / Missing focus and field affordance (Accessibility)_
- **🟡 LOW · Interactivity & States** — Inherited from the foundation: .btn-primary has a hover sweep but no :active/pressed feedback, so the primary action on this page never confirms a physical click. Re-noted only because this is the page's main CTA.
  - **Evidence:** src/index.css:97-107 (no :active rule); button at src/pages/product/Login.tsx:91
  - **Fix:** Add active:scale-[0.98] (or active:translate-y-px) to .btn-primary for tactile press feedback.
  - **Rule:** _No active/pressed feedback (Interactivity & States)_
- **🟡 LOW · Content** — The post-submit confirmation 'Check your email' is a dead-end: there is no way to resend the link, change the email, or go back to edit the address if the user mistyped it. The screen replaces the form entirely once sent.
  - **Evidence:** src/pages/product/Login.tsx:73-79 (sent state has no resend / 'use a different email' action)
  - **Fix:** Add a tertiary text action under the confirmation: 'Resend link' and 'Use a different email' (resets sent=false), so a mistyped address isn't a dead end.
  - **Rule:** _No back navigation / dead ends (Strategic Omissions)_
- **🟡 LOW · Color & Surfaces** — The Supabase-not-configured notice introduces amber-600 text on amber-50 — a color outside the locked blue accent and the only colored surface on the page (it is what the audited screenshot actually displays). This is a dev-only configuration warning, so semantic amber is defensible, but it should not read as a user-facing error in production.
  - **Evidence:** src/pages/product/Login.tsx:69 (text-amber-600 bg-amber-50); login__desktop-full.png shows the amber block
  - **Fix:** Keep amber strictly for the not-configured dev state; ensure it never ships to end users (it should be impossible to reach in a configured build). No change to the accent lock needed.
  - **Rule:** _One accent locked across the page (Color-consistency lock)_
- **🟡 LOW · Code Quality** — The page re-implements the input styling inline instead of using the shared .input component class that already exists for 'product intake/auth forms', so the auth field can drift from the design system.
  - **Evidence:** src/pages/product/Login.tsx:89 (hand-rolled classes) vs src/index.css:154-156 (.input utility intended for auth forms)
  - **Fix:** Replace the inline input classes with className="input" (the shared token) so all auth/intake fields stay consistent.
  - **Rule:** _Inline styling instead of the project's styling system (Code Quality)_

---

## Signup

**Route:** `/signup`

> The /signup route is a 4-line wrapper (Signup.tsx) that renders the shared AuthForm from Login.tsx with mode="signup", so the real audit target is Login.tsx. As a passwordless auth screen it is appropriately restrained: centered single card, a clear h1 ("Create your account"), honest sub-copy, a real semantic <form>, magic-link + Google OAuth, and proper success/error handling via sonner toast (no window.alert). SEO is genuinely good — canonical, og, twitter, description, and noindex are all set. As product UI it correctly avoids landing-page theatrics. The problems are concrete and fixable: (1) the screenshots only ever show the !isSupabaseConfigured fallback, an amber-on-amber notice that FAILS WCAG AA (3.07:1) and dumps raw env-var names (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY) at the end user; (2) em-dashes appear in UI copy and the page <title>; (3) the shared btn-primary/btn-secondary and the logo link have no visible focus ring and no :active/pressed state, so the entire form is keyboard-inaccessible at the indicator level; (4) min-h-screen instead of min-h-dvh; (5) the disabled "Sending…" button has no disabled styling. None of these are landing-page nitpicks — they are real usability/a11y/content defects.

**12 findings** — 4 high · 5 medium · 3 low

- **🔴 HIGH · Accessibility** — The Supabase-not-configured notice — the single most prominent block in every signup screenshot — is amber-600 text (#d97706) on amber-50 (#fffbeb), which measures 3.07:1. That FAILS WCAG AA (4.5:1 required for body text). It is barely legible.
  - **Evidence:** Login.tsx:69 (text-amber-600 bg-amber-50); signup__desktop-full.png and signup__mobile-full.png (the orange notice block)
  - **Fix:** Darken the text to amber-700/amber-800 (#b45309 / #92400e on amber-50 clears 4.5:1) or pair amber-900 text with a stronger amber-100 surface. Add an icon + heading so it reads as an alert, not a paragraph.
  - **Rule:** _Button & form contrast must meet WCAG AA (4.5:1 body)_
- **🔴 HIGH · Interactivity & States** — Neither shared button class defines a visible focus ring, and the logo Link has none either. The email <input> gets focus:ring-2 focus:ring-ring, but btn-primary, btn-secondary, the 'Email me a magic link' submit, the 'Continue with Google' button, and the 'Log in' / 'Start free' links have no focus-visible style anywhere in the CSS. Keyboard users cannot see where they are during the entire auth flow.
  - **Evidence:** index.css:97-111 (btn-primary/.btn-secondary — no focus-visible); Login.tsx:51-56 (logo Link), Login.tsx:91 (submit), Login.tsx:99 (Google button); grep of index.css confirms zero 'focus-visible' occurrences
  - **Fix:** Add focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 to .btn-primary and .btn-secondary, and a focus-visible ring to the logo/inline text links. This is an a11y requirement, not optional.
  - **Rule:** _Real states: visible focus ring_
- **🔴 HIGH · Content** — The fallback notice exposes raw internal env-var names — 'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable sign-in.' — directly to the end user. In the deployed state shown in the screenshots, a real prospective signup sees a developer error message instead of a working form, with no email field, no buttons, and no recovery path.
  - **Evidence:** Login.tsx:70-72; signup__desktop-full.png (entire form body is replaced by this dev message)
  - **Fix:** Never surface env-var names to end users. Show a user-facing message ('Sign-up is temporarily unavailable — please try again shortly or contact support') and log the config detail to the console/monitoring only. Ideally gate this behind a dev-only flag so production never renders it.
  - **Rule:** _No error states / be direct, user-facing copy_
- **🔴 HIGH · Content** — Em-dashes appear in UI copy and in the page <title>, violating the em-dash ban for UI text. Visible on-screen in the sub-headline 'Start free — no credit card. We'll email you a magic link.' and also in the browser-tab title 'Start free — CLEAR'.
  - **Evidence:** Login.tsx:64 ('Start free — no credit card...'), Login.tsx:46 (title 'Start free — CLEAR'); signup__desktop-hero.png (sub-headline under 'Create your account')
  - **Fix:** Replace em-dashes with a period or comma: 'Start free. No credit card needed — we'll email you a magic link.' becomes 'Start free, no credit card. We'll email you a magic link.' and title 'Start free · CLEAR' or 'Sign up · CLEAR'.
  - **Rule:** _Em-dash ban in UI copy_
- **🟠 MED · Interactivity & States** — No :active/pressed feedback on either button. btn-primary has only a hover :before sweep; btn-secondary has only a hover bg shift. Pressing 'Email me a magic link' or 'Continue with Google' gives no tactile response.
  - **Evidence:** index.css:97-111 (no :active rule); grep confirms zero ':active' occurrences in index.css
  - **Fix:** Add active:scale-[0.98] or active:translate-y-px to .btn-primary and .btn-secondary for physical click feedback.
  - **Rule:** _Real states: hover AND :active/pressed_
- **🟠 MED · Interactivity & States** — The submit button is set disabled={loading} but no disabled styling exists, so during the 'Sending…' state the button looks fully active and clickable (same blue, same hover sweep). There is no disabled:opacity / cursor-not-allowed anywhere in the CSS.
  - **Evidence:** Login.tsx:91-93 (disabled={loading}, label 'Sending…'); grep of index.css confirms zero 'disabled:' occurrences
  - **Fix:** Add disabled:opacity-60 disabled:cursor-not-allowed (and suppress the hover sweep when disabled) to .btn-primary so the loading state reads as non-interactive. A small inline spinner glyph beside 'Sending…' would also help.
  - **Rule:** _No loading states_
- **🟠 MED · Layout** — The auth wrapper uses min-h-screen, which on iOS Safari includes the dynamic toolbar and causes the centered card to jump/clip when the URL bar collapses. The mobile screenshot already shows the card sitting low and a fixed cookie bar competing for the same viewport.
  - **Evidence:** Login.tsx:44 ('min-h-screen flex flex-col items-center justify-center'); signup__mobile-full.png
  - **Fix:** Use min-h-dvh (or min-h-[100dvh]) instead of min-h-screen for the full-height centering container.
  - **Rule:** _Using height:100vh / min-h-screen for full-screen sections_
- **🟠 MED · Accessibility** — The email input relies on a placeholder ('you@company.com') as its only label — there is no <label> element and no aria-label. Placeholder-as-label disappears on focus and is not reliably announced; the field is also the only input in a passwordless flow, so its labeling matters more, not less.
  - **Evidence:** Login.tsx:83-90 (input has placeholder but no associated label or aria-label)
  - **Fix:** Add a visible or visually-hidden <label htmlFor="email"> (e.g. 'Work email') and id="email", or at minimum aria-label="Email address". Keep the placeholder as an example only.
  - **Rule:** _No form validation / missing label semantics_
- **🟠 MED · Code Quality** — Div soup with no landmark. The page is a bare <div> wrapper containing the card; there is no <main> element, so screen-reader users get no primary landmark and a 'skip to content' target would have nowhere to land.
  - **Evidence:** Login.tsx:43-44 (outer <div className="min-h-screen...">, no <main>)
  - **Fix:** Wrap the auth content in <main> (and ideally make the card a <section>). The <form> is already semantic, which is good — extend that to the page container.
  - **Rule:** _Div soup — use semantic HTML_
- **🟡 LOW · Accessibility** — The 'or' divider label is foreground/40 on the white card, ~2.64:1 contrast — below the 4.5:1 text threshold. It is decorative/non-essential but still hard to read for low-vision users. (Not visible in the current screenshots because that branch only renders when Supabase is configured.)
  - **Evidence:** Login.tsx:95-98 (text-foreground/40 'or' divider); index.css mapping of --foreground at 40% opacity
  - **Fix:** Bump the divider label to foreground/60 (4.6:1) and lighten the rules instead, or render 'or' uppercase-tracked at a darker tone so the meaning survives.
  - **Rule:** _Button & form contrast must meet WCAG AA_
- **🟡 LOW · Component Patterns** — Generic glass-card treatment (white card + border + shadow-lg + rounded-2xl) carries the whole screen with no brand presence beyond the 'CLEAR' wordmark. For an auth surface this is acceptable, but the card is the only object on a flat slate-98 background, so it reads as a stock template. (Foundation-level glass-card genericness is tracked separately; flagged here only because this page leans entirely on it.)
  - **Evidence:** Login.tsx:58 (glass-card p-8 w-full max-w-md); index.css:77-79; signup__desktop-full.png
  - **Fix:** Optional polish only: add a faint tinted shadow or a subtle ambient gradient/illustration behind the card, or anchor the card with a 1px inner highlight, so the screen has a hint of brand without becoming a marketing page.
  - **Rule:** _Generic card look (border + shadow + white background)_
- **🟡 LOW · Color & Surfaces** — The amber alert color is the only non-primary hue on the page and is off the locked accent (primary blue 220 80% 48%) and off the five CLEAR phase accents defined in tokens. It is a justifiable warning color, but combined with the failing contrast it reads as an accidental third palette rather than a deliberate status token.
  - **Evidence:** Login.tsx:69 (amber-600/amber-50); index.css:48-52 (--phase-c..r palette, none amber); signup__desktop-full.png
  - **Fix:** Define a single semantic 'warning' token derived from --phase-a (43 89% 55%) at AA-compliant text/surface pairs and use it for this notice, so warnings stay on-system instead of pulling in raw Tailwind amber.
  - **Rule:** _Color-consistency lock: one accent locked across the page_

---

## Auth callback

**Route:** `/auth/callback`

> The /auth/callback route is a redirect handler whose only rendered surface is a single loading line: an animate-pulse 'Signing you in…' centered on a min-h-screen flex container (AuthCallback.tsx:28-32). Note: the three screenshots actually show /login, not this route — with Supabase unconfigured the component redirects to /login immediately (AuthCallback.tsx:14-16), so the loading state is never visually captured; this audit judges it from code. What is good: the logic is correct and idiomatic (subscribes to onAuthStateChange AND checks getSession for the already-authenticated case, cleans up the subscription, uses replace:true so the callback is not left in history). The visual/UX layer is the weak part: the one piece of text on screen fails AA contrast, there is no skeleton, and there is no error/timeout branch — a failed or expired link leaves the user stuck on 'Signing you in…' forever with no way back.

**6 findings** — 2 high · 2 medium · 2 low

- **🔴 HIGH · Accessibility** — The only content rendered on this screen ('Signing you in…') uses text-foreground/50. --foreground is 220 20% 10% (near-black) and --background is 210 20% 98% (near-white); at 50% opacity the effective text color resolves to roughly #6f7174-on-#f7f8fa, about 4.0:1 — below the WCAG AA 4.5:1 minimum for body text. The single most important element on the page is sub-AA.
  - **Evidence:** src/pages/product/AuthCallback.tsx:30 (text-foreground/50); src/index.css:8-9 (--background 210 20% 98%, --foreground 220 20% 10%)
  - **Fix:** Raise to at least text-foreground/70 (≈6:1) or use a defined muted-foreground token verified ≥4.5:1. Do not dim the only on-screen text below AA just to look 'soft'.
  - **Rule:** _Button & form contrast must meet WCAG AA (light/muted text on near-white)_
- **🔴 HIGH · Interactivity & States** — There is no error or timeout state. The component waits indefinitely for a session via onAuthStateChange/getSession. If the magic link is expired/already-used, the OAuth provider returns an error, or the network drops, the user is parked on 'Signing you in…' permanently with no message and no escape. Supabase surfaces these as error / error_description in the URL hash/query, which this code never reads.
  - **Evidence:** src/pages/product/AuthCallback.tsx:18-26 (only success paths navigate; no error read, no setTimeout fallback)
  - **Fix:** Parse error/error_description from the URL and, if present, redirect to /login with an inline error ('That sign-in link has expired. Request a new one.'). Add a ~10s timeout that, if no session arrives, shows an error with a 'Back to sign in' action. Never leave a terminal loading state with no exit.
  - **Rule:** _Real states: loading AND error; no dead ends in user flows_
- **🟠 MED · Interactivity & States** — Loading is communicated with an animate-pulse text string, i.e. a pulsing-text spinner equivalent, rather than a skeleton that matches the destination (/app) layout. The redesign and taste rules both call for skeletons over generic spinners/pulsing placeholders.
  - **Evidence:** src/pages/product/AuthCallback.tsx:30 (animate-pulse text-foreground/50 'Signing you in…')
  - **Fix:** Show a minimal branded loading state: the CLEAR mark + a short skeleton block (or a small accent spinner with a label) sized like the app shell, so the transition into /app feels continuous rather than a bare line of pulsing text.
  - **Rule:** _No loading states: replace generic spinners with skeleton loaders that match the layout shape_
- **🟠 MED · Strategic Omissions** — The callback screen has no branding and no navigation. It is a single unstyled centered line with no CLEAR logo, unlike the /login card it sits between in the flow. If anything stalls, there is no 'back to sign in' affordance — a dead end. It reads as an unfinished intermediate page rather than part of the product.
  - **Evidence:** src/pages/product/AuthCallback.tsx:28-32 (bare div + one text node, no logo, no link)
  - **Fix:** Add the CLEAR wordmark above the loading indicator for continuity with /login, and (paired with the error state above) a 'Back to sign in' link so the page is never a terminal dead end.
  - **Rule:** _No 'back' navigation: every page needs a way back; brand continuity across the flow_
- **🟡 LOW · Layout** — The container uses min-h-screen (100vh-based) for a full-screen centered state. On mobile browsers (iOS Safari) the dynamic toolbar makes 100vh taller than the visible area, so the vertically-centered text can sit slightly off-center or cause a jump.
  - **Evidence:** src/pages/product/AuthCallback.tsx:29 (min-h-screen)
  - **Fix:** Use min-h-[100dvh] (dynamic viewport height) for full-screen centered states to keep centering stable across mobile browser chrome.
  - **Rule:** _Using height:100vh for full-screen sections — replace with min-height:100dvh_
- **🟡 LOW · Content** — The loading copy 'Signing you in…' is generic and gives no reassurance about expected duration or what is happening (verifying the link, redirecting). It is the only words the user sees while waiting and could carry slightly more confidence/specificity.
  - **Evidence:** src/pages/product/AuthCallback.tsx:30
  - **Fix:** Keep it short but specific, e.g. 'Verifying your sign-in link…' so the message matches the actual step and reassures during the brief wait. (Ellipsis char is fine; no em-dash present.)
  - **Rule:** _Write plain, specific language (Content)_

---

## App — Dashboard

**Route:** `/app`

> The /app dashboard source is small and reasonably clean: it has a real loading branch, a composed empty state with icon + CTA, sentence-case headings, a max-width container, tabular-friendly status pills, and a sensible 2-up responsive grid. The screenshot only shows the unauthenticated 'Setup required' config fallback (no Supabase session), which itself is a competent centered card. The real problems are in states and color discipline: the status pill system spends 3 different CLEAR phase accent colors (blue/teal/green) plus primary and destructive on a single surface and maps semantically distinct states (paid vs clarify vs full_ready) to the SAME blue — violating the color-consistency lock and making status unreadable at a glance. The loading state is a text 'Loading…' string, not a skeleton matching the card grid. There is no inline error/retry state — a fetch failure fires a toast and silently falls through to the 'No projects yet' empty state, which actively lies to the user. Several status labels use an em-dash and trailing ellipses in UI chrome. The empty-state CTA and header CTA are two identical 'New project' primary buttons (duplicate intent). The whole-card <Link> with a nested status pill has no keyboard focus ring and no :active feedback (inherited from .btn/.glass-card globals, made worse here by the card being the primary interactive element).

**12 findings** — 5 high · 3 medium · 4 low

- **🔴 HIGH · Color & Surfaces** — The status-pill palette spends three different CLEAR phase accents on one surface — clarify states use --phase-c (blue), teaser_ready uses --phase-l (teal), experiment states use --phase-e (green) — plus --primary for 'running' and --destructive for 'error'. That is up to 5 hues competing in a single small dashboard grid. This is exactly the '5-color CLEAR phase palette' the brief flags and breaks the one-accent-locked rule.
  - **Evidence:** src/pages/app/Dashboard.tsx:22-33 (STATUS_CLASS map); index.css:48-52 (--phase-c/l/e/a/r definitions)
  - **Fix:** Lock one accent for the whole dashboard. Express status with a neutral-to-semantic ramp instead of phase hues: muted/secondary for draft, the single accent (primary) for in-progress, a green success token for 'ready/unlocked' states, and destructive only for error. Reserve the per-phase colors for inside a project's CLEAR pipeline view, not the project list where they read as noise.
  - **Rule:** _Color-consistency lock (one accent locked across the page) / 'More than one accent color — pick one'_
- **🔴 HIGH · Content** — Multiple status states collapse to the same color, destroying the status pill's job. 'paid' (Unlocked), 'clarify_ready' (Clarify — review), 'clarify_approved', and 'full_ready' (Full report ready) all render with the identical --phase-c blue background+text. A user scanning the grid cannot distinguish 'needs my review' from 'fully done and paid' — they look the same.
  - **Evidence:** src/pages/app/Dashboard.tsx:25-29 (clarify_ready, clarify_approved, paid, full_ready all use bg-[hsl(var(--phase-c))]/15 text-[hsl(var(--phase-c))])
  - **Fix:** Give terminal/positive states (paid, full_ready) a distinct success treatment, give action-needed states (clarify_ready) an attention treatment, and visually separate 'in progress' from 'done'. Color should encode the meaningful state boundary, not the CLEAR phase letter.
  - **Rule:** _Real states / status legibility (data dashboards: status must be distinguishable at a glance)_
- **🔴 HIGH · Interactivity & States** — There is no error state. listProjects() failures are caught only by toast.error(e.message), then .finally sets loading=false, so the render falls through to the 'No projects yet' empty state. A logged-in user whose fetch failed is told they have no projects and shown a 'create your first project' CTA — the UI reports success-with-zero-data when it actually errored. Toasts are transient and easily missed.
  - **Evidence:** src/pages/app/Dashboard.tsx:39-44 (catch -> toast only, finally -> setLoading(false)); :61-71 (length===0 empty state is the fallback)
  - **Fix:** Track an error in state. On failure, render an inline error block inside the page (heading like 'Couldn’t load your projects', the reason, and a 'Try again' button that re-runs the fetch) instead of the empty state. Distinguish 'zero projects' from 'failed to load'.
  - **Rule:** _No error states / inline error not window.alert-or-toast-only_
- **🔴 HIGH · Interactivity & States** — Loading state is a bare text string 'Loading…' with animate-pulse, not a skeleton that matches the card grid. The layout collapses to a single muted line and then pops into a 2-column grid, causing a jarring content shift on load.
  - **Evidence:** src/pages/app/Dashboard.tsx:59-60 (<div className="animate-pulse text-foreground/50">Loading…</div>)
  - **Fix:** Render 2–4 skeleton cards in the same sm:grid-cols-2 layout (gray block for title, pill, and meta line) so the page reserves space and transitions smoothly. Skeletons over spinners/text per the checklist.
  - **Rule:** _No loading states — use skeleton loaders matching layout shape, not a spinner/text_
- **🔴 HIGH · Interactivity & States** — The primary interactive element on this page is the whole-card <Link>, but it has no visible keyboard focus ring and no :active/pressed feedback — only hover:shadow-xl. Keyboard users tabbing through the grid get no indication of which card is focused, and there is no press feedback on click. (.btn-primary globally also lacks :active per the known global context; here the card is the bigger miss because it is the main affordance.)
  - **Evidence:** src/pages/app/Dashboard.tsx:75-79 (className="glass-card p-5 hover:shadow-xl transition-shadow" — no focus-visible:, no active:, no scale/translate)
  - **Fix:** Add focus-visible:outline / focus-visible:ring-2 ring-primary ring-offset-2 to the card Link, and an active: state (e.g. active:scale-[0.99] or active:shadow-md). Also transition all relevant props, not just shadow, so hover/press feel intentional.
  - **Rule:** _Missing focus ring (a11y requirement) + No active/pressed feedback_
- **🟠 MED · Content** — Em-dash used in UI chrome. The status label 'Clarify — review' uses a literal em-dash in a tight status pill, and several labels use trailing ellipses ('Running…', 'Designing experiments' is fine but 'Running…' / 'Loading…' read as in-progress filler). The em-dash ban applies to UI copy; an en-dash, colon, or slash reads cleaner and fits the narrow pill better.
  - **Evidence:** src/pages/app/Dashboard.tsx:12 (clarify_ready: "Clarify — review"); :15 (running: "Running…"); :60 ("Loading…")
  - **Fix:** Replace the em-dash with a colon or middot: 'Clarify: review' or 'Review clarify'. Keep the ellipsis only where genuinely indeterminate, or replace 'Running…' with 'Analyzing' / 'In progress'.
  - **Rule:** _Em-dash ban in UI copy_
- **🟠 MED · Component Patterns** — Two identical primary CTAs with the same intent on one page. The header has a 'New project' .btn-primary (top-right), and the empty state renders a second, identical 'New project' .btn-primary. When the list is empty, both render simultaneously — duplicate intent, same label, same style.
  - **Evidence:** src/pages/app/Dashboard.tsx:54-56 (header New project) and :68-70 (empty-state New project)
  - **Fix:** When the empty state is shown, suppress or de-emphasize the header CTA (or vice versa) so a single primary action is offered. If both must exist, differentiate hierarchy (header becomes a quieter secondary).
  - **Rule:** _No two CTAs with the same intent on a page_
- **🟠 MED · Component Patterns** — Generic glass-card pattern (white background + border + shadow) is the only surface vocabulary, applied identically to the empty state and to every project card. .glass-card is bg-white/95 border border-white/60 shadow-lg rounded-2xl — a textbook 'border + shadow + white' AI card. Cards here are clickable nav targets, so a flatter, hover-elevating treatment would communicate interactivity better than a permanently-elevated card.
  - **Evidence:** src/pages/app/Dashboard.tsx:62 and :78 (glass-card); index.css:77-79 (.glass-card definition)
  - **Fix:** For the project list, drop the heavy resting shadow: use a subtle background/1px border at rest and elevate on hover/focus so the card reads as actionable. Keep elevation only where it communicates hierarchy. Differentiate the card radius from the inner pill radius (currently everything trends to the uniform 0.75rem / rounded-2xl).
  - **Rule:** _Generic card look (border + shadow + white background) — elevation should communicate hierarchy_
- **🟡 LOW · Layout** — Project cards are forced into an equal 2-column grid with whole-card links of variable content height, but the status pill is whitespace-nowrap with no wrap handling for long labels ('Full report ready', 'Designing experiments') on the narrow mobile width — the title (h3) and pill share a row via justify-between with gap-3, risking the title getting squeezed when the pill is long.
  - **Evidence:** src/pages/app/Dashboard.tsx:80-86 (flex justify-between gap-3, h3 + nowrap pill); mobile-full.png (narrow column)
  - **Fix:** On small widths, allow the pill to drop below the title (flex-wrap or stack), or truncate the project name with truncate/line-clamp so a long status label never collapses the title. Verify the longest label ('Full report ready') against the smallest card width.
  - **Rule:** _Inconsistent vertical rhythm / labels must fit without squeezing siblings_
- **🟡 LOW · Content** — Metadata uses an em-dash as the empty-value placeholder and a middot separator: when use_case is missing the line renders '— · 6/24/2026'. The lone em-dash placeholder is ambiguous and again trips the em-dash-in-UI guidance; the date is also locale-formatted (toLocaleDateString) which can render inconsistently.
  - **Evidence:** src/pages/app/Dashboard.tsx:88-91 (use_case ? ... : "—" and new Date(...).toLocaleDateString())
  - **Fix:** Use a word placeholder ('No use case' or omit the segment entirely) instead of a bare em-dash, and consider a fixed, readable date format (e.g. 'Jun 24, 2026') for consistency across locales.
  - **Rule:** _Em-dash ban in UI copy / organic, specific content_
- **🟡 LOW · Accessibility** — Status is conveyed by color + the pill background tint with low-opacity fills (e.g. text-[hsl(var(--phase-l))] on bg-[...]/15). Teal (--phase-l 172 66% 45%) and green (--phase-e 145 63% 45%) text at this saturation on a 15%-opacity tint of the same hue is at risk of falling below WCAG AA 4.5:1 for the 12px (text-xs) pill label. Color is also the only differentiator between several states (see status finding), which fails for color-blind users.
  - **Evidence:** src/pages/app/Dashboard.tsx:27 (teaser_ready teal), :30-31 (experiment green) with text-xs at :83; index.css:49-50
  - **Fix:** Verify each pill's text-on-tint contrast at 12px against AA; darken the text token or increase fill opacity where needed. Add a non-color cue (a small leading dot/icon or distinct shape) so status is not color-only.
  - **Rule:** _Button & form contrast must meet WCAG AA / status not encoded by color alone_
- **🟡 LOW · Interactivity & States** — Unauthenticated/config fallback state (the screenshot) is functional but a dead end: the 'Setup required' card explains the missing Supabase env vars but offers no actionable link (docs, copyable .env keys) and no 'back to home' path — the only navigation is the global header. For a logged-out visitor hitting /app this is a flat config message rather than a sign-in prompt.
  - **Evidence:** app-dashboard__desktop-full.png (Setup required card, centered, no CTA); src/lib/supabase.ts:26-31 (config error copy)
  - **Fix:** Give the fallback an action: a 'Log in' or 'Back to home' button, or for the config case a link to setup docs. Avoid leaving the primary route as a non-interactive notice. (Lower priority since this is the misconfigured/no-session edge, not the authed dashboard.)
  - **Rule:** _No 'back' navigation / dead ends in user flows_

---

## App — New Project

**Route:** `/app/projects/new`

> The /app/projects/new intake form is a clean, vertically-stacked single-column form (max-w-2xl) with sensible grouping, a useful AI prep-prompt card, and a genuinely thoughtful dictation control that already does the right things (EN/SV toggle, aria-pressed, aria-live interim transcript, graceful unsupported fallback). The shared .input class also has a real focus ring. So the foundation is decent. The problems are concentrated in form-completion concerns that AI scaffolds routinely skip: there is no inline validation or inline error surface (errors are dumped as raw exception strings into a toast), no real loading/progress state for a submit that uploads up to 10 files and extracts text (only a button label swap, and the form stays editable mid-save), no back/cancel navigation out of this deep route, and raw lowercase DB enum tokens are shown verbatim as option labels. Several em-dashes appear in UI copy, low-contrast 40%-alpha helper text is used repeatedly, and icon-only remove buttons lack accessible names and focus rings. The screenshots are the auth/Setup-required fallback (no Supabase configured) so all findings are sourced from NewProject.tsx and its CSS/component dependencies.

**9 findings** — 2 high · 5 medium · 2 low

- **🔴 HIGH · Interactivity & States** — No real error state. The only failure handling on submit is toast.error((err as Error).message) — a raw Supabase/JS exception message shown in a transient toast. There are no inline field errors, no per-field validation messaging, and a network/RLS error string (e.g. a Postgres constraint message) gets shown verbatim to a non-technical user. The only client validation is the native `required` on the challenge textarea, which fires the browser's default bubble.
  - **Evidence:** src/pages/app/NewProject.tsx:117-120 (catch -> toast.error((err as Error).message)); required only at line 135
  - **Fix:** Add inline, field-level validation (required name/challenge, friendly messages) rendered next to the field with aria-describedby + aria-invalid. Map backend failures to a human sentence ('Couldn't create the project. Please try again.') in an inline alert region above the submit button, and log the raw error rather than surfacing it. Keep toasts only for non-blocking warnings.
  - **Rule:** _No error states / Add clear inline error messages for forms; do not use window.alert()_
- **🔴 HIGH · Interactivity & States** — No meaningful loading state for a long, multi-step submit. Pressing Create project uploads up to 10 files (≤50MB), runs client-side text extraction per file, and performs several sequential inserts — this can take many seconds. The only feedback is the button label changing to 'Creating…'. There is no progress indicator, no per-file upload status, and crucially the rest of the form is never disabled while saving=true, so the user can keep editing fields whose values have already been read.
  - **Evidence:** src/pages/app/NewProject.tsx:57-121 (submit loop) and 236-238 (button only label-swaps on `saving`); inputs/selects/textarea have no disabled binding
  - **Fix:** Disable the whole form (fieldset disabled={saving}) during submit, and show real progress: a skeleton/placeholder list of files with per-file 'uploading…/done' states, or a determinate progress bar driven by file count. Replace the bare 'Creating…' label with an inline spinner + the same disabled treatment so the action reads as in-flight.
  - **Rule:** _No loading states / replace generic spinners with skeleton loaders that match the layout shape_
- **🟠 MED · Strategic Omissions** — No back / cancel navigation out of this deep route. The form lives at /app/projects/new but the ProductLayout chrome only links the wordmark to /product (the marketing site), and there is no Dashboard link visible until signed-in nav, no breadcrumb, and no Cancel button on the form. A user who opens 'New project' and changes their mind has no in-page way back to /app, and on success is pushed straight into the new project with no escape.
  - **Evidence:** src/pages/app/NewProject.tsx (no back/cancel control anywhere in the form); src/components/product/ProductLayout.tsx:22-30 (wordmark -> /product only)
  - **Fix:** Add a 'Back to projects' link (to /app) above the H1 or a secondary 'Cancel' button next to Create project, and/or a breadcrumb (Projects / New). This is a one-line addition and removes a dead end in the core creation flow.
  - **Rule:** _No back navigation / every page needs a way back_
- **🟠 MED · Content** — Raw lowercase DB enum tokens are rendered verbatim as option labels. Target group options show 'customers / citizens / tenants / employees / other' all-lowercase, and Use case shows 'churn / onboarding / compliance / policy_uptake -> policy uptake / other'. The all-lowercase casing plus the underscore-derived 'policy uptake' read like un-prettified database identifiers leaking into the UI rather than human-authored labels.
  - **Evidence:** src/pages/app/NewProject.tsx:13-14 (TARGET_GROUPS / USE_CASES arrays) and 151-162 (options render the raw token, only underscores swapped to spaces)
  - **Fix:** Introduce a label map (value -> display) with proper casing: 'Customers', 'Citizens', 'Policy uptake', 'Compliance', etc. Keep the machine token as the option value; show the friendly label as the option text.
  - **Rule:** _Raw identifiers / placeholder values leaking into UI; sentence-case labels_
- **🟠 MED · Content** — Em/en-dashes used throughout UI copy. The Field hint joiner renders '{label} — {hint}' with a literal em-dash, the challenge textarea placeholder uses '— type, or tap Dictate to speak…', and the SEO/title strings use '—' as well. The taste pre-flight bans em-dashes in UI copy.
  - **Evidence:** src/pages/app/NewProject.tsx:247 (`{label} — {hint}`), 140 (placeholder '… — type, or tap Dictate to speak…'), 125 (title 'New project — CLEAR')
  - **Fix:** Replace the em-dash separators with a colon, a middot, layout (place the hint on its own muted line), or a parenthetical. e.g. label on one line, hint beneath in muted text; placeholder 'Describe the challenge, the group, and what success looks like. Type or tap Dictate to speak.'
  - **Rule:** _Em-dash ban in UI copy_
- **🟠 MED · Accessibility** — Icon-only remove buttons have no accessible name and no visible focus ring. The stakeholder-row remove (X) and the per-file remove (X) are bare buttons containing only a Lucide X icon, with no aria-label and only a hover color change — no focus-visible treatment. Keyboard users get no name announced and no visible focus indicator, and the px-2 / icon hit target is small.
  - **Evidence:** src/pages/app/NewProject.tsx:188-190 (stakeholder remove) and 227-229 (file remove)
  - **Fix:** Add aria-label (e.g. `aria-label={`Remove ${f.name}`}` / 'Remove stakeholder'), a focus-visible:ring-2 ring-ring class, and a slightly larger padded hit area (min 32-40px). This pairs with the global focus-ring requirement.
  - **Rule:** _Missing focus ring (a11y requirement) / missing accessible name on icon buttons_
- **🟠 MED · Color & Surfaces** — Repeated low-contrast helper text at 40% foreground alpha. Field hints, the '(optional)' qualifier, the Documents file-type spec, and the PrepPromptCard footer use text-foreground/40. With --foreground at 220 20% 10% on the near-white --background (210 20% 98%), 40% alpha lands well under the 4.5:1 AA threshold for body text, making genuinely useful guidance (file limits, optionality) hard to read.
  - **Evidence:** src/pages/app/NewProject.tsx:215 (Documents spec text-foreground/40), 247 (Field hint text-foreground/40), 219 (dropzone text-foreground/60 is borderline)
  - **Fix:** Use the design system's muted-foreground token (220 10% 40% solid) instead of an alpha of near-black for any text the user is meant to read; reserve /40 for purely decorative glyphs. Verify each helper string hits 4.5:1.
  - **Rule:** _Button & form text must meet WCAG AA (4.5:1 body)_
- **🟡 LOW · Component Patterns** — The file dropzone stacks a generic elevated card with a competing dashed outline and duplicate border declarations. The <label> applies .glass-card (which already sets `border border-white/60 shadow-lg rounded-2xl`) and then also `border-dashed border-2 border-border`, producing a shadowed white card whose border is declared twice (white/60 then border) and styled both solid-via-card and dashed. The result reads as the default 'border + shadow + white card' dropzone, and the shadow-lg fights the 'this is a drop target' affordance.
  - **Evidence:** src/pages/app/NewProject.tsx:217 (className combines glass-card + border-dashed border-2 border-border); src/index.css:77-79 (.glass-card already sets border + shadow-lg + rounded-2xl)
  - **Fix:** Drop .glass-card here and style the dropzone as a flat dashed region: a single muted dashed border, subtle bg-muted/30, no shadow, with a clearer hover/drag-over state (and add onDragOver/onDrop, currently click-to-upload only). This removes the duplicated border and the generic-card look.
  - **Rule:** _Generic card look (border + shadow + white background)_
- **🟡 LOW · Interactivity & States** — The single most important control on the page — the full-width Create project submit — relies on .btn-primary, which has a hover shimmer but no :active/pressed state. (Noted at foundation; re-flagged only because on this page the primary button is the sole conversion action and currently gives no tactile press feedback.)
  - **Evidence:** src/index.css:97-107 (.btn-primary has :hover/:before but no :active); used at src/pages/app/NewProject.tsx:236
  - **Fix:** Add an :active treatment to .btn-primary (e.g. active:scale-[0.98] or active:translate-y-px) so the submit press registers physically.
  - **Rule:** _No active/pressed feedback_

---

## App — Project workspace

**Route:** `/app/projects/:id`

> The project-detail workspace is the product's core surface: a back link, project title, export buttons, a staged Clarify → Leverage → paywall flow, and a 4-tab workspace (Report / Research / Collaborate / Experiment). The screenshots are the unauthenticated 'Setup required' fallback, so this audit is grounded in the source. What is already good: there IS real back navigation (ProjectDetail.tsx:149), genuine empty/locked states for every tab (Research/Experiment/Collaborate), confident non-shouty copy with no exclamation marks ('Promoted to a test card.', 'Answer saved.'), client-side email validation in Collaborate, and the Paywall has a dev-only bypass that's clearly labelled. The main problems are AI-slop tells the skill calls out explicitly: spinner-based loading instead of skeletons, bare 'Loading…' text states, em-dashes sprinkled through UI copy (taste-gate violation), data numerals in proportional Inter with no tabular-nums, every section rendered as the same generic glass-card with no hierarchy, all-caps subheaders everywhere, hand-rolled tertiary buttons with no focus ring, an icon-only destructive control with no accessible label, and disabled tabs that give the user no reason why they're greyed out. Hierarchy is muddy because card titles use the same heading-md (text-2xl/3xl bold) as page-level h2s, so they compete with the h1.

**13 findings** — 3 high · 7 medium · 3 low

- **🔴 HIGH · Interactivity & States** — Loading and in-progress states are spinners and bare text, never skeletons. The route-level load shows the literal string 'Loading…' with animate-pulse; every async phase (Clarify running, Leverage generating, full-report generating) shows a spinning RefreshCw icon. The skill bans this: 'Replace generic circular spinners with skeleton loaders that match the layout shape.'
  - **Evidence:** ProjectDetail.tsx:120 ('Loading…'), ProjectDetail.tsx:173, ProjectDetail.tsx:212, ProjectDetail.tsx:260 (RefreshCw animate-spin); repeats in ExperimentTab.tsx:122 and ResearchTab.tsx:133
  - **Fix:** Replace the route 'Loading…' with a skeleton that mirrors the page: a title bar, then 1–2 card-shaped placeholders. For the Clarify/Leverage/full-report generation states, render a skeleton ClarifyCard / report card (greyed blocks the shape of the OKR and leverage table) instead of a centered spinner, so the user sees the structure forming.
  - **Rule:** _No loading states / skeleton loaders not spinners_
- **🔴 HIGH · Content** — Em-dashes appear throughout UI copy, which the taste pre-flight bans in interface text. Multiple user-facing strings use ' — ' as a connector, including a CTA label and toast messages.
  - **Evidence:** ProjectDetail.tsx:78 ('Payment received — generating your full report.'), Paywall.tsx:48 ('the gap log, and recommended discovery activities — plus PDF & Markdown export'), Paywall.tsx:53 ('Unlock this report — ${UNLOCK_PLAN.price}'), ResearchTab.tsx:145-149 ('sector benchmarks … — to turn the assumptions'), CollaborateTab.tsx:138 ('a private link — no account needed — to react')
  - **Fix:** Rewrite without em-dashes: use periods, commas, or colons. e.g. CTA → 'Unlock full report · ${price}'; toast → 'Payment received. Generating your full report.'; Collaborate → 'a private link (no account needed) to react to the map.'
  - **Rule:** _Em-dash ban in UI copy_
- **🔴 HIGH · Accessibility** — Hand-rolled tertiary/secondary buttons skip the visible focus ring, and a destructive icon-only control has no accessible name. The 'Dismiss', 'Undo accept', 'Cancel' buttons in Research are bare inline-flex with only hover color and no focus-visible ring; the Collaborate revoke button is an icon-only Trash2 with a title attribute but no aria-label, so screen-reader users hear nothing actionable. Visible focus is an a11y requirement, not optional.
  - **Evidence:** ResearchTab.tsx:212, 222, 242, 274 (inline-flex … hover:text-foreground, no focus-visible); CollaborateTab.tsx:192-198 (Trash2 button, title='Revoke', no aria-label, no focus ring)
  - **Fix:** Add focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 to the tertiary buttons (or route them through a shared btn-tertiary class), and give the revoke button aria-label='Revoke invitation' plus a focus ring. Standardise these tertiary actions into one component so states are consistent.
  - **Rule:** _Missing focus ring (keyboard a11y) / Missing alt text on meaningful controls_
- **🟠 MED · Interactivity & States** — Disabled tabs communicate nothing. Research and Experiment TabsTriggers are disabled until paid/unlocked, rendering as 50%-opacity labels with no lock icon, tooltip, or explanation, so the user can't tell whether the tab is broken or gated.
  - **Evidence:** ProjectDetail.tsx:237 (disabled={!canResearch}), ProjectDetail.tsx:239 (disabled={!canExperiment}); tabs.tsx:30 only applies disabled:opacity-50
  - **Fix:** Keep the tabs enabled but show the gated state on click (the panels already render a 'part of a paid plan' message), OR add a small Lock icon + tooltip ('Unlock the full report to use Research') to the disabled trigger so the gate is legible rather than looking dead.
  - **Rule:** _No indication of current page / dead controls_
- **🟠 MED · Typography** — Data numerals are rendered in proportional Inter with no tabular figures, despite this being a data-heavy report surface (confidence %, baselines, targets, APEASE scores). Columns of percentages won't align and digits shift width.
  - **Evidence:** LeverageTable.tsx:45 ({p.confidence}%), ClarifyCard.tsx:27-32 (Metric/Baseline/Target/Confidence values), ResearchTab.tsx:174 ('{f.confidence}% confidence')
  - **Fix:** Apply font-variant-numeric: tabular-nums (Tailwind: tabular-nums) to metric/confidence values and any numeric column so figures align and don't jitter on update.
  - **Rule:** _Numbers in proportional font / tabular figures for data-heavy interfaces_
- **🟠 MED · Typography** — Heading hierarchy is flat. The page h1 uses heading-lg (text-3xl/4xl) while every card title (Clarify, Leverage, Research, Experiment) and every empty-state heading uses heading-md = text-2xl sm:text-3xl bold — nearly the same size as the h1. With 5+ heading-md titles stacked down the page, nothing reads as primary and the report feels like a wall of equal-weight bold headers.
  - **Evidence:** index.css:121-127 (heading-lg vs heading-md scales); ProjectDetail.tsx:153 (h1 heading-lg) vs ClarifyCard.tsx:13, TeaserReport.tsx:18, ResearchTab.tsx:143, ExperimentTab.tsx:135 (all heading-md card titles)
  - **Fix:** Introduce a distinct card-title size (e.g. text-lg/xl semibold) for section/card headers and reserve heading-md/lg for the page title only. Pair phase chips with smaller titles so the chip carries the color emphasis, not the type size.
  - **Rule:** _Headlines lack presence / weak hierarchy_
- **🟠 MED · Component Patterns** — Every section is the same generic glass-card (white bg + border + shadow + uniform 2xl radius). The report stacks roughly six identical cards (ClarifyCard, TeaserReport, plus each ExperimentTab block), so elevation no longer communicates hierarchy — it's just visual wallpaper. The skill: cards should exist only when elevation communicates hierarchy.
  - **Evidence:** ProjectDetail.tsx:170, 209, 259; ClarifyCard.tsx:8; TeaserReport.tsx:10; ExperimentTab.tsx:132, 183, 192, 198, 205, 213 — all .glass-card; index.css:77-79
  - **Fix:** Differentiate by role: keep elevation only for the primary report card; render secondary sections (assumptions log, FAQ, calendar) as flat panels using background tint or a divider/spacing instead of another shadowed card. Vary inner radius vs container radius so the uniform 0.75rem isn't repeated at every level.
  - **Rule:** _Generic card look (border + shadow + white) / uniform border-radius_
- **🟠 MED · Typography** — All-caps subheaders are used as the default label style across the report ('OBJECTIVE', 'KEY RESULTS', 'SYSTEMS MAP SUMMARY', 'LEVERAGE PRIORITY MAP', 'TOP 3 LEVERAGE POINTS', 'ASSUMPTIONS & OPEN QUESTIONS'). The skill calls out 'All-caps subheaders everywhere' as a generic tell.
  - **Evidence:** ClarifyCard.tsx:19, 21, 39; TeaserReport.tsx:20, 24, 28 (font-semibold text-sm uppercase tracking-wide text-foreground/50)
  - **Fix:** Switch these eyebrow labels to sentence-case small caps or a quieter weight/size, or use a colored small label only where it adds scanning value. Reserve uppercase for true micro-labels, not every section header.
  - **Rule:** _All-caps subheaders everywhere_
- **🟠 MED · Component Patterns** — The paywall presents two CTAs with overlapping intent — both lead to paying for the full report. 'Unlock this report — {price}' (one-off) sits next to 'Or subscribe' (subscription), which is exactly the duplicate-intent pattern the taste gate warns against; the secondary also reads as a second primary path rather than a clear alternative.
  - **Evidence:** Paywall.tsx:52-58 (btn-primary 'Unlock this report' + btn-secondary Link 'Or subscribe')
  - **Fix:** Lead with one primary CTA (the per-project unlock) and demote the subscription option to a quiet text link ('or subscribe for unlimited projects') beneath it, so there's a single clear action and a tertiary alternative — not two competing buttons.
  - **Rule:** _Two CTAs with the same intent / always one filled + one ghost button_
- **🟠 MED · Content** — Long body paragraphs run the full width of the max-w-3xl (768px) container, which is roughly 90+ characters at the base font size — wider than the ~65ch readability target. The Research and Experiment intro paragraphs are dense and span the whole column.
  - **Evidence:** ResearchTab.tsx:145-150 (multi-line blurb), ExperimentTab.tsx:137-141; container ProjectDetail.tsx:145 (max-w-3xl); body-md has no measure constraint (index.css:133-135)
  - **Fix:** Cap long prose at max-w-prose (~65ch) inside the wider card, letting tables and maps use the full width. This keeps reading comfortable without narrowing the data.
  - **Rule:** _Body text too wide (<=65ch)_
- **🟡 LOW · Iconography** — A Unicode emoji (⏸) is used as a status glyph in the running-experiments banner, inconsistent with the Lucide icon set used everywhere else on the page. Emoji render differently per-OS and break the otherwise uniform stroke iconography.
  - **Evidence:** ExperimentTab.tsx:153 ('⏸ Experiments are running in the real world.')
  - **Fix:** Replace the ⏸ with a Lucide Pause (or CircleDot) icon styled to match the rest of the UI, keeping one consistent icon family and stroke weight.
  - **Rule:** _Inconsistent stroke widths / consistent icon set_
- **🟡 LOW · Component Patterns** — Inconsistent button composition in the export row: the 'PDF' button has a FileDown icon while the adjacent 'Markdown' button has none, so two sibling secondary buttons look mismatched.
  - **Evidence:** ProjectDetail.tsx:156-161 (PDF has <FileDown/>, Markdown has no icon)
  - **Fix:** Give Markdown a matching leading icon (e.g. FileText/Code) or drop the icon from both so the pair reads as a consistent export group.
  - **Rule:** _Inconsistent component patterns_
- **🟡 LOW · Color & Surfaces** — The blue primary accent and the 5-color CLEAR phase palette (--phase-c blue, --phase-l teal, --phase-e green, --phase-a amber, --phase-r pink) coexist on the same report. Clarify uses a blue chip, Leverage a teal chip, badges use teal/amber, and the primary CTA is blue — so the 'one accent locked across the page' rule is stretched; teal Leverage chrome competes with the blue primary for emphasis.
  - **Evidence:** ClarifyCard.tsx:10 (phase-c), TeaserReport.tsx:14 (phase-l), LeverageTable.tsx:3-7 (phase-l + phase-a badges); index.css:48-52 (phase palette) vs --primary blue index.css:17
  - **Fix:** Treat the phase colors strictly as small categorical chips/labels and keep ALL interactive emphasis (buttons, links, focus, highlight bars) on the single blue primary. Avoid teal/amber tinted backgrounds on large surfaces so the accent stays locked.
  - **Rule:** _Color-consistency lock (one accent) / more than one accent color_

---

## Account — Billing

**Route:** `/account/billing`

> The /account/billing page (src/pages/app/Billing.tsx) is a compact, sensibly-scoped account screen: it has a real back link, an SEO/noindex tag, a max-w-2xl reading column, sentence-case copy, and CTA labels that fit one line. The screenshots only show the unauthenticated 'Setup required' fallback (Supabase env not set), so all findings below are from SOURCE. The dominant problems are weak state design and a semantically-blind status pill: the loading state is a bare 'Loading…' string (skill says skeleton, not spinner/text), the busy/checkout state collapses the button label to a single '…' character with no spinner, there is no real error state (errors are fire-and-forget sonner toasts, and a load failure leaves the page stuck showing the free state with no retry), and there is no empty/'no subscription history' affordance. The status tag renders whatever the server returns (active / canceled / past_due / trialing) in the same primary-blue pill with no semantic color, so a past-due or canceled account looks identical to a healthy one. The paid-plan grid is the generic three-equal-column tower with no recommended-tier emphasis even though config marks Solo highlight:true. Secondary text leans on foreground/50 which is borderline for AA body contrast. Inherited foundation issues (Inter everywhere, generic .glass-card, btn-primary has no :active) are present but not made worse here.

**11 findings** — 3 high · 5 medium · 3 low

- **🔴 HIGH · Interactivity & States** — Loading state is a bare text node 'Loading…' in muted gray, not a skeleton. It does not match the shape of the content it replaces (the plan card + subscribe card), so the layout jumps when data arrives and the page reads as half-built while loading.
  - **Evidence:** src/pages/app/Billing.tsx:62-63 ({loading ? (<div className="animate-pulse text-foreground/50">Loading…</div>)
  - **Fix:** Replace with a skeleton that mirrors the layout: a glass-card-shaped block with two bars (label + plan name) and a button-height bar, plus (for free users) a 3-column row of card-shaped skeletons. Use the existing animate-pulse on neutral rounded blocks instead of the word 'Loading…'.
  - **Rule:** _No loading states / skeleton not spinner_
- **🔴 HIGH · Interactivity & States** — No real error state. Every failure path is a transient sonner toast: the initial load .catch only fires toast.error(e.message), and on failure `loading` becomes false while `entitlement` stays null, so a user whose entitlement failed to load is silently shown the *free / Subscribe* UI as if they had no plan. There is no inline error, no retry, and no distinction between 'free user' and 'load failed'.
  - **Evidence:** src/pages/app/Billing.tsx:22-24 (.catch((e) => toast.error(e.message)).finally(() => setLoading(false))) and tier fallback at :26 (entitlement?.tier ?? "free")
  - **Fix:** Track an error state separately from loading. On load failure render an inline error card ('We couldn't load your billing details.' + a 'Try again' button that re-runs the fetch), and do NOT fall through to the free/Subscribe view, which can mislead a paying customer.
  - **Rule:** _No error states / inline error not alert_
- **🔴 HIGH · Component Patterns** — The status pill renders the raw server status string in a single fixed style (.tag = primary-blue), only toggling opacity for free vs paid. status is typed `string | null` and can be 'active', 'trialing', 'past_due', 'canceled', 'incomplete', etc. A past-due or canceled subscription therefore shows the exact same calm blue pill as a healthy one, so there is no visual signal that billing needs attention.
  - **Evidence:** src/pages/app/Billing.tsx:72-74 (<span className={`tag ${isPaid ? "" : "opacity-60"}`}>{entitlement?.status ?? "active"}</span>); status type at src/lib/db.ts:68 (status: string | null)
  - **Fix:** Map status to a semantic chip: green/neutral for active & trialing, amber for past_due/incomplete, red for canceled/unpaid. Also normalize the label (e.g. 'past_due' -> 'Past due') instead of printing the raw snake_case enum, and show an inline call-to-action ('Update payment method') when the status is unhealthy.
  - **Rule:** _Real states: error / status legibility_
- **🟠 MED · Interactivity & States** — The checkout busy state replaces the entire button label with a single ellipsis character '…'. There is no spinner, the button keeps its full width, and an ellipsis alone is an ambiguous busy signal; it also momentarily makes every Subscribe button look broken (one-character label) while busy is true across the whole grid.
  - **Evidence:** src/pages/app/Billing.tsx:112 ({busy ? "…" : "Subscribe"}) and the disabled binding at :109 (disabled={busy || !PRICE_IDS[...]})
  - **Fix:** Show an inline spinner + retained label ('Redirecting…' with a small Loader2 spin) and scope the busy state to the specific plan being purchased (track busyPlanId) so the other two buttons stay labelled 'Subscribe' rather than all collapsing to '…'.
  - **Rule:** _No loading states / pressed + busy feedback_
- **🟠 MED · Component Patterns** — The paid-plan grid is the generic three-equal-column tower with identical card styling and no recommended-tier emphasis. The billing config explicitly marks Solo with highlight:true, but that flag is ignored here, so there is no anchor/'most popular' tier to guide the choice — the exact pattern the audit calls out for pricing.
  - **Evidence:** src/pages/app/Billing.tsx:99-115 (grid sm:grid-cols-3 ... border border-border rounded-xl, no per-plan emphasis); highlight flag at src/config/billing.ts:49 (highlight: true for Solo)
  - **Fix:** Honor plan.highlight: give the recommended tier a ring/accent border, a small 'Most popular' marker, and slightly stronger button (filled vs the others as secondary), instead of three visually identical cards. Reinforce the single locked accent rather than adding a new color.
  - **Rule:** _Pricing table with 3 towers / highlight recommended tier_
- **🟠 MED · Accessibility** — Secondary text relies on foreground/50 (foreground is 220 20% 10%, near-black). At 50% alpha over the near-white app background this lands around #7d8088 ≈ ~4.0:1, under the 4.5:1 AA body threshold. It is used for the 'Current plan' label and other meta lines, so the labels that identify what the big number means are the least legible text on the card.
  - **Evidence:** src/pages/app/Billing.tsx:69 (text-foreground/50 'Current plan'), :105 (text-foreground/50 cadence); token at src/index.css:9 (--foreground: 220 20% 10%)
  - **Fix:** Use foreground/60 or foreground/70 for labels and cadence text to clear 4.5:1 (or define a dedicated --muted-foreground token tuned to AA), keeping foreground/50 only for genuinely decorative text.
  - **Rule:** _WCAG AA body contrast 4.5:1_
- **🟠 MED · Interactivity & States** — Keyboard focus is not styled on the page's interactive controls. The back link and the inline 'Compare plans →' link are plain anchors with only hover color changes (hover:text-foreground / hover:underline) and no focus-visible ring; the Subscribe/Manage buttons inherit btn-primary which the foundation audit already notes lacks an :active state. Keyboard users get no clear focus indicator on the primary actions of a billing screen.
  - **Evidence:** src/pages/app/Billing.tsx:57-59 (Back link: hover only), :117-119 (Compare plans link: hover:underline only), :85 & :110 (btn-primary)
  - **Fix:** Add focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 to the links and ensure btn-primary exposes a visible focus ring (and an :active scale) so every interactive element on the billing flow is keyboard-discoverable.
  - **Rule:** _Missing focus ring (a11y requirement)_
- **🟠 MED · Content** — The renewal line always reads 'Renews {date}.' regardless of subscription status. If status is 'canceled' or cancel_at_period_end is set, current_period_end is actually the *end* date, so the UI would tell a churning customer their plan 'Renews' on the day it actually expires — misleading and the opposite of the truth.
  - **Evidence:** src/pages/app/Billing.tsx:77-81 (Renews {new Date(entitlement.current_period_end).toLocaleDateString()}.)
  - **Fix:** Choose the verb from status: 'Renews {date}' for active, 'Ends {date}' / 'Cancels on {date}' for canceled or scheduled-to-cancel. This needs the cancel flag from the entitlement; if unavailable, at least gate the 'Renews' wording behind status === 'active'.
  - **Rule:** _Active voice / accurate copy_
- **🟡 LOW · Interactivity & States** — No empty / no-history affordance for paid users. A subscribed user sees only the current-plan card and a single 'Manage subscription' button — no next-charge amount, no payment method, no invoice/receipt history, and no composed empty state if those are absent. The screen is functional but bare for someone who came to check what they'll be charged.
  - **Evidence:** src/pages/app/Billing.tsx:83-89 (paid branch: only the Manage subscription button)
  - **Fix:** Add a small 'Next payment' / 'Payment method' summary row (even if it just says 'Managed in the Stripe portal') and/or a short invoices list, so the paid view is not a near-empty card. If no data is available yet, show a one-line composed empty state rather than nothing.
  - **Rule:** _No empty states / composed empty view_
- **🟡 LOW · Component Patterns** — Two competing CTA treatments for essentially the same destination on the free view: every plan card has a filled btn-primary 'Subscribe', and immediately below sits a 'Compare plans →' text link to /pricing. Three identical filled primary buttons in a row plus the secondary link creates button noise; the audit prefers reducing repeated filled primaries.
  - **Evidence:** src/pages/app/Billing.tsx:107-113 (three btn-primary 'Subscribe') and :117-119 ('Compare plans →')
  - **Fix:** Make non-recommended plan buttons secondary/outline and keep only the highlighted tier as a filled primary, so the row has a single visual anchor instead of three equal-weight filled buttons competing with each other and with the text link.
  - **Rule:** _Always one filled + reduce repeated primaries_
- **🟡 LOW · Code Quality** — Div soup / non-semantic structure on a standalone page. The whole screen is nested <div>s with no landmark element; there is no <main> wrapping the page content despite this being a top-level route, which weakens screen-reader navigation and 'skip to content' behavior.
  - **Evidence:** src/pages/app/Billing.tsx:54 (root <div className="max-w-2xl ...">) — no <main>/<section> landmarks anywhere in the file
  - **Fix:** Wrap the page body in <main> (and use a <section> for the Subscribe block) so assistive tech gets a proper content landmark, consistent with semantic-HTML guidance.
  - **Rule:** _Div soup / semantic HTML_

---

## Respondent portal

**Route:** `/respond/:token`

> The respondent portal is one of the cleaner surfaces in the app: it is a single-column, max-w-2xl form with sentence-case headings, a real inline load-error state, a real empty state for the map ('the team is still preparing the analysis'), a thank-you confirmation without an exclamation mark, toast-based error handling (no window.alert), best-effort autosave, and human, non-cliche microcopy ('There are no wrong answers'). The accent is locked to a single blue (--primary 220 80% 48%); the 5-color CLEAR phase palette is NOT leaked onto this page. Reaction chips, dictation, and the AI-prep card all use aria-pressed and aria-labels. The main weaknesses are: low-contrast secondary text (text-foreground/40 fails WCAG AA and carries load-bearing info like the autosave status and the '(optional)' qualifiers); the primary submit button has hover but no :active/pressed feedback and no visible focus ring; the load and upload states are a pulsing text string and a spinner rather than skeletons; several em-dashes appear in UI copy (banned by the taste pre-flight); and the all-caps tracking-wide subheader inside the map plus an inline text-base '(optional)' next to a 30px heading are small consistency tells. SCREENSHOT shows only the dummy-token Supabase-not-configured error; findings about the real form are sourced from RespondentPortal.tsx and its child components.

**11 findings** — 3 high · 5 medium · 3 low

- **🔴 HIGH · Accessibility** — Load-bearing secondary text is set to text-foreground/40. With --foreground 220 20% 10% over --background 210 20% 98%, 40% opacity yields roughly 2.5:1 contrast, well below the WCAG AA 4.5:1 minimum for body text. This color is used for the autosave/draft status ('Your progress saves automatically' / 'Draft saved'), the PrepPromptCard footer, and the prompt hints — actual information the respondent needs, not decoration.
  - **Evidence:** RespondentPortal.tsx:279-281 (savedAt status, text-xs text-foreground/40); PrepPromptCard.tsx:174 (footer); RespondentMap currentState at text-foreground/70 is fine but hints/optional below are not. index.css:8-9 token values.
  - **Fix:** Raise informational secondary text to at least text-foreground/70 (~5:1) or use --muted-foreground (220 10% 40%, ~4.7:1). Reserve /40 only for truly decorative glyphs. The autosave status especially must be legible since it is the only feedback that work is being persisted.
  - **Rule:** _Button & form contrast must meet WCAG AA (pre-flight contrast gate)_
- **🔴 HIGH · Accessibility** — The '(optional)' qualifiers and prompt hints next to required-looking labels are rendered in text-foreground/40, which fails AA. These qualifiers change whether a respondent thinks a field is mandatory, so sub-threshold contrast is a real usability problem, not just polish.
  - **Evidence:** RespondentPortal.tsx:203 ('(optional)' on name), :217-219 (hint after each prompt label, text-foreground/40), :238 (Documents '(optional)').
  - **Fix:** Bump qualifier/hint text to text-foreground/60 or text-foreground/70 so the optional/required distinction is actually readable; keep the smaller font size for hierarchy instead of leaning on low opacity.
  - **Rule:** _Light placeholder/label on near-white fails AA (pre-flight contrast gate)_
- **🔴 HIGH · Interactivity & States** — The primary submit button has a hover background shift and a shimmer :before, but no :active/pressed state and no visible focus-visible ring. .btn-primary applies focus styles to .input but the button class itself sets neither outline nor ring, and there is no :active rule. Keyboard users get no clear focus indicator on the single most important action on the page, and there is no tactile press feedback.
  - **Evidence:** index.css:97-99 (.btn-primary: hover only, no :active, no focus-visible); RespondentPortal.tsx:276 (button uses btn-primary with no added focus/active classes).
  - **Fix:** Add a .btn-primary:active { transform: translateY(1px) } (or scale(0.98)) and a focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2. This is the page's submit CTA — it must show pressed and focused states.
  - **Rule:** _Real states: hover AND :active/pressed, visible focus ring_
- **🟠 MED · Content** — Em-dashes appear in multiple UI strings. The taste pre-flight bans the em-dash in UI copy. Several instances are visible to the respondent.
  - **Evidence:** RespondentPortal.tsx:176 ('There are no wrong answers — this takes a few minutes'), :239 ('Share anything relevant — notes, reports, spreadsheets'), :218 (label renders '— {p.hint}'); PrepPromptCard.tsx:30/32 blurbs ('returns three briefs you can upload below' uses —), :40/174 footer ('Nothing is sent to CLEAR — the prompt just guides...').
  - **Fix:** Replace em-dashes with a period, a colon, or a restructured sentence. E.g. 'There are no wrong answers, and it only takes a few minutes.'; 'Share anything relevant: notes, reports, spreadsheets.'; render the hint as a parenthetical or after a colon rather than ' — '.
  - **Rule:** _Em-dash ban in UI copy_
- **🟠 MED · Interactivity & States** — Loading and upload states use a pulsing text string and a circular spinner rather than skeletons matching the layout. The skill explicitly prefers skeleton loaders over spinners. The initial load shows only 'Loading…' with animate-pulse on a half-opacity string; the upload swaps the Upload icon for a Loader2 spinner.
  - **Evidence:** RespondentPortal.tsx:149 ('Loading…' animate-pulse text-foreground/50), :242 (Loader2 animate-spin in upload dropzone).
  - **Fix:** Replace the bare 'Loading…' with a skeleton of the form scaffold (header bar + a couple of card-shaped placeholders). For uploads, a determinate progress bar or a skeleton file-row reads better than a spinner; at minimum keep the spinner but pair it with a labeled progress affordance.
  - **Rule:** _Loading state should be a skeleton, not a spinner_
- **🟠 MED · Typography** — All-caps tracking-wide subheader inside the map ('WHERE THE THINKING IS NOW') is the generic all-caps-label pattern the skill flags. It also collides tonally with the otherwise sentence-case voice of the page ('The current thinking', 'Your input').
  - **Evidence:** RespondentMap.tsx:29-31 (font-semibold text-sm uppercase tracking-wide text-foreground/50).
  - **Fix:** Use sentence case ('Where the thinking is now') at a quieter weight, or small-caps, instead of full uppercase. Also note text-foreground/50 here is borderline for AA at this small size.
  - **Rule:** _All-caps subheaders everywhere — use sentence case or small-caps_
- **🟠 MED · Typography** — Body paragraphs run the full max-w-2xl (~672px) width. At the base 16px body size this is roughly 80-85 characters per line for the intro and section descriptions, exceeding the ~65ch comfortable reading measure the pre-flight requires.
  - **Evidence:** RespondentPortal.tsx:148 (main max-w-2xl), :174-177 (intro paragraph spans full width), :239 (documents description).
  - **Fix:** Constrain prose blocks to ~60-65ch (e.g. max-w-[60ch] or max-w-prose on the intro/description paragraphs) while letting form controls and cards keep the wider 2xl column.
  - **Rule:** _Body <= ~65ch_
- **🟠 MED · Component Patterns** — Every container on the page is a .glass-card (border + shadow + white, rounded-2xl): the map section, the AI-prep card, the input section, and the documents section all sit in identical white cards stacked vertically. Because all four carry the same elevation, the cards stop communicating hierarchy and the page reads as a uniform stack of boxes rather than a guided flow.
  - **Evidence:** RespondentPortal.tsx:182, :187, :199, :237 (four sequential .glass-card sections); PrepPromptCard.tsx:109 (a fifth). index.css:77-79 (.glass-card definition).
  - **Fix:** Reserve the elevated card for the read-only 'current thinking' map (the thing being reacted to) and let the respondent's own input/documents sit on the page background with only spacing/dividers, or use a lighter surface. Differentiating the 'what we think' card from the 'your turn' inputs would make the flow legible.
  - **Rule:** _Generic card look (border + shadow + white) — cards should exist only when elevation communicates hierarchy_
- **🟡 LOW · Layout** — An inline '(optional)' is set at text-base directly inside the Documents heading, which is heading-md (text-2xl on mobile, text-3xl ~30px on desktop). The fixed text-base qualifier next to a 30px bold heading sits at an awkward, non-proportional scale and baseline.
  - **Evidence:** RespondentPortal.tsx:238 (<h2 className="heading-md">Documents <span ... text-base>(optional)</span></h2>).
  - **Fix:** Either move '(optional)' to a small subheading line under the title, or size it as a proportional fraction (e.g. text-sm align-middle font-normal) and verify it aligns to the heading's optical baseline rather than the box.
  - **Rule:** _Mathematical alignment that looks optically wrong_
- **🟡 LOW · Interactivity & States** — There is no per-field validation or visual completeness cue beyond the consent checkbox. Every textarea is optional and the only gate is consent, so a respondent can submit an essentially empty form with no nudge. The autosave status and submit button also give no indication of whether anything has been entered.
  - **Evidence:** RespondentPortal.tsx:119-135 (onSubmit only checks consent), :215-233 (all prompts optional, no required indicator or progress).
  - **Fix:** Add a light, non-blocking completeness hint (e.g. 'You haven't added any input yet — add a note or document before submitting') and/or a subtle progress affordance, rather than relying solely on the consent gate.
  - **Rule:** _No form validation (Strategic Omissions)_
- **🟡 LOW · Interactivity & States** — Submit errors other than the consent check are surfaced only via a transient sonner toast, while the load error gets a persistent inline card. If respondentSubmit fails (network), the toast disappears and the user is left on a form with no durable indication the submission did not go through.
  - **Evidence:** RespondentPortal.tsx:130-134 (catch -> toast.error only), vs :151-156 (inline persistent loadError card).
  - **Fix:** On submit failure, also show a persistent inline error near the submit button (mirroring the loadError card style) so the failure state survives after the toast auto-dismisses.
  - **Rule:** _Add clear, inline error messages for forms_

---

