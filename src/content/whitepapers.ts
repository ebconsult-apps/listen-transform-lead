/**
 * Whitepaper catalogue. Single source of truth for the Resources grid, the
 * per-paper overview pages (/resources/:id), the gated download, and the
 * structured data AI search agents read.
 *
 * The overview text (summary, keyPoints, faqs) is deliberately public and
 * factual: agents fetch HTML without running JavaScript and lift short
 * self-contained passages, so each paper's argument has to be readable without
 * unlocking the PDF. Keep numbers and claims to what the paper itself says.
 *
 * Pure data, no React: this module is also read by the node-side tests and by
 * anything that needs the list outside the browser.
 */

export interface WhitepaperFaq {
  question: string;
  answer: string;
}

/**
 * Full-text blocks for papers published as HTML. Kept deliberately simple so
 * the page renders them as semantic HTML that crawlers can read and quote.
 */
export type WhitepaperBlock =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "callout"; label?: string; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "references"; items: string[] };

export interface Whitepaper {
  /** URL slug, PDF basename, and the id whitepaper-handler.php accepts. */
  id: string;
  title: string;
  /** Deck line from the PDF cover, when it has one. */
  subtitle?: string;
  /** Short card text shown on the Resources grid. */
  description: string;
  /** Bullet takeaways shown on the card and in the download gate. */
  takeaways: string[];
  pdfUrl: string;
  /** Series label from the PDF cover, e.g. "Behavioural design". */
  category: string;
  /** ISO date (YYYY-MM-DD or YYYY-MM) when known. */
  datePublished?: string;
  pages?: number;
  /** Public overview, one entry per paragraph. */
  summary: string[];
  /** Quotable, self-contained facts from the paper. */
  keyPoints: string[];
  faqs: WhitepaperFaq[];
  keywords: string[];
  /**
   * Full text, when the paper is published as HTML. The PDF stays available
   * as a download; the text here is the same paper, so agents can cite it
   * without going through the form.
   */
  body?: WhitepaperBlock[];
}

const AUTHOR_LINE = "Erik Bohjort, licensed psychologist and creator of the CLEAR Change Framework";

export const whitepapers: Whitepaper[] = [
  {
    id: "clear-attention",
    title: "Attention Is the Scarce Resource",
    subtitle:
      "What shoppers who touch and look at products teach us about every behaviour we try to change, from checkout pages to shop floors.",
    description:
      "What shoppers who touch and look at products teach us about every behaviour we try to change, from checkout pages to shop floors.",
    takeaways: [
      "Why touch and gaze predict purchases, and what the real mechanism is",
      "Treat attention as the gating resource in digital and physical conversion",
      "Four design moves that win and hold attention before you add a single cue",
    ],
    pdfUrl: "/whitepapers/clear-attention.pdf",
    body: [
      { type: "h2", text: "1. A shop-floor finding with a much larger meaning" },
      {
        type: "p",
        text: "Put a customer within arm's reach of a product, let them pick it up, and the odds of a sale go up. Field and lab work in consumer psychology has repeated this result in many forms. Peck and Shu showed that merely touching an object raises the sense that it is already yours, and that this perceived ownership raises what people are willing to pay (Peck & Shu, 2009). Hultén's field experiment in IKEA's glassware department found that adding visual and olfactory cues at the point of purchase changed how much shoppers touched the products, with corresponding differences in sales (Hultén, 2012). Streicher, Estes and Büttner showed that widening shoppers' breadth of attention triggers an exploratory mindset that increases both physical exploration and unplanned purchases (Streicher, Estes & Büttner, 2021). Retail researchers at the University of Bath have argued for taking eye tracking out of the lab and into real stores precisely because where the eyes go is the best available proxy for where the decision goes (Journal of Retailing, 2024).",
      },
      {
        type: "p",
        text: "The retail interpretation of these findings is tactical: unbox the product, remove the \"do not touch\" sign, lower the shelf, add a sensory cue. That is fine advice, and retailers should follow it. But if we stop there we miss the general lesson.",
      },
      {
        type: "callout",
        text: "Looking and touching are not the cause of the purchase. They are the visible trace of a resource being spent: attention. The purchase follows the attention, not the fingertips. Once you see it that way, the shop floor and the checkout page and the corporate change programme become the same problem in different clothes.",
      },
      { type: "h2", text: "2. Why attention, not touch, is the mechanism" },
      {
        type: "p",
        text: "Consider what has to happen inside a person for touch to matter. First the product must enter the visual field. Then it must win against everything else competing for the eyes: other products, a phone, a partner, a child, the exit sign. Only once it has been selected for processing can a hand reach for it. Touch then extends and deepens that processing: it adds haptic information, it lengthens dwell time, and it gives the imagination something concrete to work with. Perceived ownership is what a few extra seconds of concentrated attention feel like from the inside.",
      },
      { type: "p", text: "Three properties of attention make it the right frame for behavioural design:" },
      {
        type: "ul",
        items: [
          "It is finite and rivalrous. A second spent on one object is not spent on another. This is why retail shelf position is an auction, why ad impressions are priced, and why the notification on a phone is the most powerful competitor any in-store display has.",
          "It is the gate to every later step. Motivation, ability and intention cannot act on something that was never noticed. Every behaviour model, from COM-B to Fogg's B=MAP, silently assumes the person is already attending to the cue.",
          "It is cheaply lost and expensively regained. A shopper who has walked past the display is gone. A visitor who bounced from a landing page is gone. A manager whose inbox swallowed the change announcement is gone. Winning back the same person costs far more than holding them the first time.",
        ],
      },
      { type: "h2", text: "3. The same problem in digital conversion" },
      {
        type: "p",
        text: "Translate the retail finding to a website and it reads: users who look at and interact with the product are more likely to buy it. Nobody in e-commerce would dispute this. Image galleries, 360-degree views, configurators, size guides, augmented-reality \"see it in your room\" features and interactive demos are all attempts to buy back what the screen took away: the possibility of touch. The best of them work because they extend dwell time and concentrate attention, not because a rendered sofa can be felt.",
      },
      {
        type: "p",
        text: "But digital settings also show the failure mode more clearly than shops do. Attention is spent before it reaches the product. It is spent on cookie banners, pop-ups, carousels, nine-item navigation menus, chat widgets and \"sign up for 10% off\" overlays. Each one is defensible on its own. Together they are the retail equivalent of placing the product behind a queue of people handing out leaflets. The visitor's attention budget was consumed by the store, not by the merchandise.",
      },
      {
        type: "callout",
        label: "Diagnostic question",
        text: "By the time a visitor can see the thing you want them to act on, how much of their attention have you already spent on things you do not care about?",
      },
      { type: "h2", text: "4. The same problem in organisational change" },
      {
        type: "p",
        text: "Now translate it again. Employees who look at and handle a new way of working are more likely to adopt it. This too is obviously true and is routinely ignored. Change programmes are announced in an email, presented in a town hall, and stored in an intranet page. Attention is assumed rather than earned. Meanwhile the new system, process or behaviour is never placed within arm's reach of the person expected to use it. It is not visible at the moment of the old habit. It cannot be picked up and tried without consequence.",
      },
      {
        type: "p",
        text: "The organisations that succeed at change do the equivalent of unboxing the product. They put the new behaviour where the old one happens. They let people try it in a low-stakes way before they must commit. They shorten the distance between noticing and doing. In CLEAR terms, this is what the Leverage step is for: mapping the system to find the moments where attention is naturally present and placing the intervention there, instead of building a new channel and hoping attention follows.",
      },
      { type: "h2", text: "5. What attention-first design looks like" },
      {
        type: "p",
        text: "Whether the setting is a shop, a screen or an office, the same design moves follow from taking attention seriously.",
      },
      { type: "h3", text: "Reduce the competition before you add a cue" },
      {
        type: "p",
        text: "Most teams respond to low engagement by adding something: a sign, a banner, a reminder. The attention frame says to subtract first. Remove the three things that are consuming attention upstream of the behaviour, and the existing cue may start working on its own. Retailers do this with visual quiet zones around hero products. Product teams do it by cutting the number of choices on a page. Change leaders do it by cancelling competing initiatives, which is the least popular and most effective move available to them.",
      },
      { type: "h3", text: "Put the behaviour within reach at the moment of attention" },
      {
        type: "p",
        text: "Attention decays fast. A cue that wins attention but requires the person to go somewhere else to act wastes most of what it won. The product must be graspable from where the eye landed. The button must be on the screen that raised the interest. The new process must be launchable from inside the old workflow.",
      },
      { type: "h3", text: "Extend dwell, do not just capture it" },
      {
        type: "p",
        text: "Capturing attention is a moment. Purchasing, converting and adopting need duration. Touch matters because it stretches the moment into seconds. The digital and organisational equivalents are interaction: a configurator to play with, a sandbox to try, a pilot to join. Anything that gives the hands something to do while the mind decides.",
      },
      { type: "h3", text: "Measure attention, not just outcomes" },
      {
        type: "p",
        text: "If attention is the gating resource, it should be the first thing measured. Retail has eye tracking and touch counts. Digital has scroll depth, dwell, hover and interaction rates. Organisations mostly have nothing, and it shows: they measure adoption at the end and cannot tell whether the failure was awareness, interest or ability. Instrumenting attention turns a vague \"people did not engage\" into a specific, solvable problem.",
      },
      { type: "h2", text: "6. Objections" },
      {
        type: "p",
        text: "\"Attention is just awareness, and awareness is the easy part.\" Awareness is a state; attention is a resource with a budget. Most change failures happen among people who were aware. They knew about the new system, the new offer, the new rule. What they never did was spend several uninterrupted seconds of processing on it at a moment when action was possible. Awareness without attention is a poster nobody reads twice.",
      },
      {
        type: "p",
        text: "\"This is just marketing.\" Marketing is the discipline that has taken attention seriously the longest, which is why it has the best tools for it. The argument of this paper is that behavioural science and change management should stop treating attention as someone else's department.",
      },
      {
        type: "p",
        text: "\"Some purchases are made without touching.\" True, and they are typically made with more attention elsewhere: reading reviews, comparing specifications, asking friends. The resource is still spent. It is simply spent through a different sense.",
      },
      { type: "h2", text: "7. Conclusion" },
      {
        type: "p",
        text: "The customer who picks up the product and buys it is not a curiosity of retail psychology. She is a demonstration of the first law of behaviour change: nothing happens without attention, and attention is scarce. Every behavioural problem, from a cart abandoned to a policy ignored, should begin with the same question the shopkeeper asks. Can they see it? Can they reach it? Is anything standing in the way? Only when the answers are yes does it make sense to talk about motivation, incentives or persuasion. Design for attention first, and a surprising amount of the rest takes care of itself.",
      },
      {
        type: "references",
        items: [
          "Hultén, B. (2012). Sensory cues and shoppers' touching behaviour: the case of IKEA. International Journal of Retail & Distribution Management, 40(4), 273–289.",
          "Peck, J., & Shu, S. B. (2009). The effect of mere touch on perceived ownership. Journal of Consumer Research, 36(3), 434–447.",
          "Streicher, M. C., Estes, Z., & Büttner, O. B. (2021). Exploratory shopping: Attention affects in-store exploration and unplanned purchasing. Journal of Consumer Research, 48(1), 51–76.",
          "University of Bath School of Management (2024). Utilising eye-tracking data in retailing field research: A practical guide. Journal of Retailing.",
          "Krishna, A. et al. (2024). A review of touch research in consumer psychology. Journal of Consumer Psychology.",
        ],
      },
    ],
    category: "Behavioural design",
    datePublished: "2026-09",
    pages: 6,
    summary: [
      `Retail research has shown for two decades that customers who look at and handle a product are far more likely to buy it. The usual explanation is psychological ownership: touching makes something feel like yours. This paper by ${AUTHOR_LINE} argues that the deeper mechanism is attention, and that attention is the recurring, scarce resource behind almost every behaviour-change problem, whether the goal is a purchase in a shop, a conversion on a website, or a new habit in an organisation.`,
      "Looking and touching are not the cause of a purchase. They are the visible trace of a resource being spent. Three properties make attention the right frame for behavioural design: it is finite and rivalrous, it is the gate to every later step (motivation, ability and intention cannot act on something never noticed, and every behaviour model from COM-B to Fogg's B=MAP silently assumes the person is already attending), and it is cheaply lost and expensively regained.",
      "The same failure shows up on websites, where cookie banners, pop-ups, carousels and chat widgets spend the visitor's attention before it reaches the product, and in organisational change, where programmes are announced by email and town hall while the new behaviour is never placed within arm's reach at the moment of the old habit. In CLEAR terms this is what the Leverage step is for: mapping the system to find the moments where attention is naturally present and placing the intervention there.",
    ],
    keyPoints: [
      "Touch raises perceived ownership and willingness to pay (Peck & Shu, 2009); sensory cues at the point of purchase change how much shoppers touch products, with corresponding differences in sales (Hultén, 2012, IKEA field experiment).",
      "Attention, not touch, is the mechanism: the purchase follows the attention, not the fingertips.",
      "Awareness is a state; attention is a resource with a budget. Most change failures happen among people who were aware.",
      "Four attention-first design moves: reduce the competition before you add a cue; put the behaviour within reach at the moment of attention; extend dwell, do not just capture it; measure attention, not just outcomes.",
      "Cancelling competing initiatives is the least popular and most effective move available to a change leader.",
    ],
    faqs: [
      {
        question: "What is the main argument of Attention Is the Scarce Resource?",
        answer:
          "That attention, not touch or psychological ownership, is the mechanism behind the retail finding that shoppers who look at and handle products buy more, and that attention is the scarce gating resource behind every behaviour-change problem: in shops, on websites and in organisational change. If you cannot get attention, nothing downstream happens.",
      },
      {
        question: "How does this apply to organisational change?",
        answer:
          "Change programmes usually assume attention rather than earn it: they announce in an email or town hall and store the new process on an intranet page. The paper argues for the organisational equivalent of unboxing the product: put the new behaviour where the old one happens, let people try it in a low-stakes way, and shorten the distance between noticing and doing.",
      },
      {
        question: "What should be measured first?",
        answer:
          "Attention itself. Retail has eye tracking and touch counts, digital has scroll depth, dwell and interaction rates, and organisations mostly have nothing, which is why they measure adoption at the end and cannot tell whether a failure was awareness, interest or ability.",
      },
    ],
    keywords: [
      "attention",
      "behavioural design",
      "retail psychology",
      "touch and purchase",
      "conversion",
      "organisational change",
      "COM-B",
    ],
  },
  {
    id: "clear-behaviour-free-design",
    title: "Design So the Behaviour Never Has to Happen",
    subtitle:
      "The most powerful behavioural solutions are the ones that remove the need for behaviour altogether. Why the field keeps forgetting this, and how to use it.",
    description:
      "The most powerful behavioural solutions remove the need for behaviour altogether. Why defaults and structure beat persuasion, and how to use them.",
    takeaways: [
      "Reframe every brief from “get people to act” to “get the outcome”",
      "A six-tier hierarchy of behavioural controls, from eliminate to persuade",
      "The ethical tests that keep behaviour-free design honest",
    ],
    pdfUrl: "/whitepapers/clear-behaviour-free-design.pdf",
    body: [
      { type: "h2", text: "1. The bias in the question" },
      {
        type: "p",
        text: "Every behaviour-change brief begins the same way. \"How do we get people to...?\" Save more. Recycle. Use the new system. Fill in the form. Take the medication. The question already contains an assumption: that the outcome we want requires a person to act, and that our job is to make them act. The whole apparatus of the field, from nudges to incentives to training, is built on that assumption.",
      },
      {
        type: "p",
        text: "But the outcome is what the organisation wants. The behaviour is merely one route to it. And behaviour is an expensive, unreliable route. It draws on attention, which is scarce. It draws on motivation, which fluctuates. It draws on memory, which fails. It has to happen again tomorrow, and the day after, for as long as the outcome matters. Every intervention that works through behaviour inherits all of this fragility.",
      },
      {
        type: "callout",
        text: "The question is not \"how do we get people to do X?\" It is \"how do we get the outcome that X was supposed to produce?\" Sometimes the answer still involves X. Often it does not.",
      },
      { type: "h2", text: "2. The evidence that no-behaviour beats behaviour" },
      {
        type: "p",
        text: "The clearest demonstration is the default effect. Johnson and Goldstein's comparison of organ-donation rates across European countries found consent rates near 100 percent where donation was the default and people had to opt out, against rates between 4 and 28 percent in otherwise similar countries where people had to opt in (Johnson & Goldstein, 2003). Decades of information campaigns had moved the opt-in countries a few percentage points. A change to the form moved the outcome by more than seventy.",
      },
      {
        type: "p",
        text: "Retirement saving tells the same story. Madrian and Shea found that automatic enrolment raised participation in a US company's 401(k) plan from around 37 percent to 86 percent among new hires (Madrian & Shea, 2001). The UK's national auto-enrolment policy, introduced from 2012, lifted workplace pension participation among eligible employees from around 55 percent to close to 90 percent. Financial education, matching contributions and reminder campaigns had been tried for years, with modest results. Removing the need to enrol worked immediately and permanently.",
      },
      {
        type: "p",
        text: "Public health has known this longer than behavioural economics has. Water fluoridation reduced tooth decay without asking anyone to brush differently. Lead was removed from petrol rather than drivers being asked to avoid it. Seatbelt use rose with laws and reminders, but the injury outcome shifted most when airbags and crumple zones protected people whether they buckled up or not. Occupational safety formalised the principle as the hierarchy of controls: eliminate the hazard first, substitute it second, engineer it out third, and only then rely on administrative rules and personal protective equipment, which require behaviour. The hierarchy is ordered by effectiveness, and behaviour sits at the bottom.",
      },
      {
        type: "callout",
        label: "The pattern",
        text: "Every time a field has compared \"change the person\" against \"change the system so the person need not change\", the system wins, and it keeps winning after the campaign budget is gone.",
      },
      { type: "h2", text: "3. Why it works: the arithmetic of reliability" },
      {
        type: "p",
        text: "Suppose an outcome requires a behaviour to happen at a given moment, and suppose the person notices the cue 80 percent of the time, is motivated 80 percent of the time they notice, and is able to act 80 percent of the time they are motivated. The behaviour happens about half the time. Improve each factor to 90 percent with a strong intervention and the behaviour happens 73 percent of the time. Now suppose the outcome must be sustained daily for a year. Even the improved version fails on roughly one day in four.",
      },
      {
        type: "p",
        text: "Now remove the behaviour. The outcome happens 100 percent of the time, on the first day and the last, for the disengaged employee and the enthusiastic one, in the week after the launch and the year after everyone has forgotten it. There is no version of persuasion that competes with that. The behaviour-free design is not a slightly better intervention; it belongs to a different class.",
      },
      {
        type: "p",
        text: "It is also fairer. Interventions that work through behaviour reward people who already have attention, motivation and capacity to spare. They widen gaps. Defaults and structural changes deliver the outcome to everyone, including the people the behavioural approach would have left behind.",
      },
      { type: "h2", text: "4. The hierarchy of behavioural controls" },
      {
        type: "p",
        text: "Borrowing from occupational safety, we can order behavioural solutions by how much they depend on the person acting. The higher the tier, the less behaviour is needed and the more reliable the outcome.",
      },
      {
        type: "table",
        headers: ["Tier", "Move", "Behaviour required", "Examples"],
        rows: [
          ["1. Eliminate", "Remove the need for the outcome-producing behaviour entirely", "None", "Auto-enrolment; automatic software updates; direct debit; pre-filled tax returns"],
          ["2. Default", "Make the desired outcome what happens if nobody acts", "Only to deviate", "Opt-out organ donation; green energy tariff as default; double-sided printing as default"],
          ["3. Constrain", "Make the undesired outcome impossible or hard", "Only to work around", "Interlocks; forced-choice forms; speed bumps; smaller plates; single-use bags removed from tills"],
          ["4. Simplify", "Reduce the effort, steps and attention the behaviour needs", "Reduced", "One-click checkout; recycling bin next to the desk bin; prescription delivered to the door"],
          ["5. Prompt", "Cue the behaviour at the right moment", "Full", "Reminders; signage; nudges; notifications"],
          ["6. Persuade", "Change motivation, beliefs or knowledge", "Full, plus ongoing", "Campaigns; training; incentives; education"],
        ],
      },
      {
        type: "p",
        text: "Most behavioural work happens in tiers 5 and 6. Most behavioural results come from tiers 1 to 3. The mismatch is the central inefficiency of the field.",
      },
      { type: "h2", text: "5. Why we keep forgetting" },
      { type: "p", text: "If the top of the hierarchy is so effective, why does practice cluster at the bottom? Four reasons recur." },
      {
        type: "ul",
        items: [
          "The brief arrives pre-framed. By the time a behavioural team is involved, someone has already decided that the problem is that people do not do X. Reframing to the outcome means challenging the client's diagnosis, which is uncomfortable.",
          "Structural changes belong to someone else. Changing a default in a form requires the owner of the form. Removing a step requires the owner of the process. Behavioural teams are often given a communications budget and no authority over systems, so they do what their budget allows.",
          "Visible effort feels like responsibility. A campaign shows that the organisation tried. A changed default is invisible. Leaders who need to be seen acting prefer the visible option even when it is the weaker one.",
          "Behaviour change is intellectually attractive. Understanding why people act is fascinating. Moving a checkbox is not. Professionals gravitate to the interesting problem, not the effective one.",
        ],
      },
      { type: "h2", text: "6. The ethical objection, taken seriously" },
      {
        type: "p",
        text: "Designing so that behaviour is unnecessary can sound like removing choice. Sometimes that is precisely the objection that should stop a design: people have a right to make decisions about their bodies, their money and their data, and an outcome imposed by a system they cannot see or leave is not a good outcome, however desirable it looks from the boardroom.",
      },
      {
        type: "p",
        text: "Three tests keep the approach honest. First, is the outcome one the affected person would choose on reflection, and could easily reverse? Defaults pass this test; hidden constraints often do not. Second, is the design transparent? A default that is disclosed and reversible respects autonomy more than a persuasion campaign that works by exploiting biases. Third, who benefits when the behaviour is removed? Removing the need for a customer to cancel a subscription is a very different act from removing the need for a patient to remember a dose. The same design move can serve the person or the organisation against the person, and the practitioner's job is to know which.",
      },
      { type: "h2", text: "7. How to apply it inside CLEAR" },
      {
        type: "p",
        text: "The CLEAR framework's Leverage step asks teams to map the system around a behaviour before designing any intervention. This is where behaviour-free design belongs. The map reveals which steps, forms, settings and structures currently require the person to act, and which of those could be changed so they do not. A disciplined version of the step asks, for each behaviour on the map:",
      },
      {
        type: "ol",
        items: [
          "What outcome is this behaviour for?",
          "Could the outcome be produced without the behaviour (eliminate)?",
          "Could the outcome be what happens when nobody acts (default)?",
          "Could the undesired alternative be made impossible or costly (constrain)?",
          "Only if none of the above: how do we make the behaviour easier, cued and motivated?",
        ],
      },
      {
        type: "p",
        text: "The Experiment step then tests the structural change on a small scale, exactly as it would test a nudge. Structural changes are not exempt from evidence. Defaults can be reversed by annoyed users, constraints can be worked around, and eliminations can have side effects the map did not show. But when they hold, they hold at a scale that behavioural interventions rarely reach, and they hold without anyone having to remember.",
      },
      { type: "h2", text: "8. Conclusion" },
      {
        type: "p",
        text: "The most powerful behavioural solution is the one in which no behaviour is required. This is not a rejection of behavioural science but its most rigorous conclusion: if attention, motivation and memory are the bottlenecks, the best design is the one that does not route through them. Practitioners should treat persuasion as the last resort it is in every other safety-critical field, and should measure their success not by how many people they moved but by how many people no longer need to be moved at all.",
      },
      {
        type: "references",
        items: [
          "Johnson, E. J., & Goldstein, D. (2003). Do defaults save lives? Science, 302(5649), 1338–1339.",
          "Madrian, B. C., & Shea, D. F. (2001). The power of suggestion: Inertia in 401(k) participation and savings behavior. Quarterly Journal of Economics, 116(4), 1149–1187.",
          "Department for Work and Pensions (UK). Workplace pension participation and savings trends, 2009 to 2023.",
          "National Institute for Occupational Safety and Health (NIOSH). Hierarchy of Controls.",
          "Thaler, R. H., & Sunstein, C. R. (2008). Nudge: Improving Decisions About Health, Wealth, and Happiness. Yale University Press.",
        ],
      },
    ],
    category: "Intervention design",
    datePublished: "2026-09",
    pages: 6,
    summary: [
      `Behavioural science is mostly about getting people to do things. This paper by ${AUTHOR_LINE} argues that its strongest results come from the opposite move: designing the system so that the desired outcome no longer depends on anyone doing anything. Defaults, elimination, automation and engineered constraints outperform persuasion, reminders and incentives by an order of magnitude, and they keep working when attention, motivation and memory run out.`,
      "Every behaviour-change brief starts with “how do we get people to...?”, which already assumes the outcome requires a person to act. The paper reframes the question to “how do we get the outcome that the behaviour was supposed to produce?” and borrows the occupational-safety hierarchy of controls to rank behavioural solutions by how much they depend on the person: eliminate, default, constrain, simplify, prompt, persuade. Most behavioural work happens in the bottom two tiers; most behavioural results come from the top three.",
      "Behaviour-free design is also fairer, because interventions that work through behaviour reward people who already have attention, motivation and capacity to spare, while defaults and structural changes deliver the outcome to everyone. The paper takes the ethical objection seriously and sets out three tests, then shows where the approach sits inside CLEAR: in the Leverage step, where the systems map reveals which steps, forms and settings currently require a person to act and could be changed so they do not.",
    ],
    keyPoints: [
      "Opt-out organ donation produced consent rates near 100 percent against 4 to 28 percent in otherwise similar opt-in countries (Johnson & Goldstein, 2003).",
      "Automatic enrolment raised 401(k) participation among new hires from around 37 percent to 86 percent (Madrian & Shea, 2001); UK auto-enrolment lifted workplace pension participation from around 55 percent to close to 90 percent.",
      "The arithmetic of reliability: with an 80 percent chance each of noticing, being motivated and being able to act, a behaviour happens about half the time; improve each to 90 percent and it still fails roughly one day in four over a year. Remove the behaviour and the outcome happens every time.",
      "The hierarchy of behavioural controls: 1 Eliminate, 2 Default, 3 Constrain, 4 Simplify, 5 Prompt, 6 Persuade. Reliability falls as you go down.",
      "Four reasons practice clusters at the bottom: the brief arrives pre-framed; structural changes belong to someone else; visible effort feels like responsibility; behaviour change is intellectually attractive.",
      "Three ethical tests: would the affected person choose the outcome on reflection and could they easily reverse it; is the design transparent; who benefits when the behaviour is removed.",
    ],
    faqs: [
      {
        question: "What is behaviour-free design?",
        answer:
          "Designing a system so that the desired outcome is produced without requiring anyone to act: through elimination, defaults, automation or constraints rather than persuasion, reminders or incentives. A behaviour that does not need to happen cannot fail to happen.",
      },
      {
        question: "Is this a rejection of nudging and behavioural science?",
        answer:
          "No. The paper calls it behavioural science's most rigorous conclusion: if attention, motivation and memory are the bottlenecks, the best design is the one that does not route through them. Persuasion should be the last resort, as it is in every other safety-critical field.",
      },
      {
        question: "How does behaviour-free design fit into the CLEAR framework?",
        answer:
          "In the Leverage step. For each behaviour on the systems map the team asks what outcome it is for, whether the outcome could be produced without the behaviour, whether it could be the default, whether the undesired alternative could be constrained, and only then how to make the behaviour easier, cued and motivated. The Experiment step then tests the structural change at small scale, because defaults and constraints are not exempt from evidence.",
      },
    ],
    keywords: [
      "defaults",
      "choice architecture",
      "hierarchy of controls",
      "behaviour-free design",
      "nudging",
      "auto-enrolment",
      "intervention design",
    ],
  },
  {
    id: "clear-goldilocks",
    title: "The Goldilocks Zone: Matching Goals to Interventions",
    subtitle:
      "Why the size of your goal must match the size of your intervention, what nudge meta-analyses really tell us about effect sizes, and how to balance exploration and exploitation when resources are scarce.",
    description:
      "Big goals need most barriers solved; small goals need a few. What nudge meta-analyses really say about effect sizes, and how to split a budget between exploring and exploiting.",
    takeaways: [
      "Calibrate expectations: a light-touch nudge is worth about two percentage points",
      "Let available resources set the size of the goal, not the other way round",
      "Use exploration vs exploitation to allocate a limited intervention budget",
    ],
    pdfUrl: "/whitepapers/clear-goldilocks.pdf",
    body: [
      { type: "h2", text: "1. Goals and barriers are the same object seen from two sides" },
      {
        type: "p",
        text: "Between any group of people and any outcome sits a stack of barriers. They do not notice. They do not care. They cannot find the time. The tool is confusing. The manager disapproves. The habit is strong. The alternative is cheaper. Each barrier removes some fraction of the people who would otherwise reach the outcome.",
      },
      {
        type: "p",
        text: "A goal is a statement about how many people must get through the stack. Set the goal at 5 percent improvement and you may only need to remove the one barrier that is stopping the most persuadable group. Set it at 50 percent and you must remove nearly every barrier, because any one of them left standing will stop enough people to keep you short.",
      },
      {
        type: "callout",
        text: "High goals commit you to solving most of the hindrances. Low goals permit you to solve a subset. There is no intervention design that escapes this arithmetic, only designs that ignore it.",
      },
      {
        type: "p",
        text: "This sounds obvious written down. It is violated constantly in practice, because goals are set by one group (leadership, funders, strategy) and interventions are designed by another (delivery teams, agencies, behavioural units), and the two rarely sit down to check whether the barrier stack the second group is willing to attack is large enough for the target the first group has announced.",
      },
      { type: "h2", text: "2. What a nudge is actually worth" },
      {
        type: "p",
        text: "To calibrate the match, we need honest numbers about what interventions deliver. The nudge literature provides the cleanest case because it has been meta-analysed several times with conflicting results, and the conflict itself is instructive.",
      },
      {
        type: "table",
        headers: ["Source", "Sample", "Headline effect"],
        rows: [
          ["Mertens et al. (2022), PNAS", "212 published studies, 447 effects", "Cohen's d = 0.43, a \"medium\" effect, with moderate publication bias detected"],
          ["Maier et al. (2022), PNAS, reanalysis", "Same database, bias-corrected", "d between −0.01 and 0.08 depending on method: \"no evidence for nudging after adjusting for publication bias\""],
          ["DellaVigna & Linos (2022), Econometrica", "126 trials, 23 million people, every trial run by two US government nudge units", "Average 1.4 percentage-point improvement (about 8 percent relative), versus 8.7 points in comparable academic publications"],
        ],
      },
      {
        type: "p",
        text: "The DellaVigna and Linos result is the most useful because it is a complete record: every trial two nudge units ran, published or not. On a baseline take-up of roughly 17 percent, the typical nudge added 1.4 points. Publication bias and low statistical power explained about 70 percent of the gap between that figure and what appears in journals. The remainder came from differences in the interventions themselves: academic studies more often tested defaults and in-person interventions, while the units mostly tested letters, emails and reminders.",
      },
      {
        type: "p",
        text: "The practical reading is not \"nudges do not work\". It is that a typical, cheap, communication-style nudge, deployed at scale, moves a behaviour by a small single-digit number of percentage points, and that anyone promising more from that class of intervention is quoting a biased literature. Around two percentage points is a sensible planning figure. That is a real, cost-effective gain when the base is millions of tax filers or patients. It is nowhere near a transformation goal.",
      },
      {
        type: "callout",
        label: "Calibration rule",
        text: "A single light-touch intervention buys you roughly a two-point improvement. If the goal is twenty points, you need either ten independent interventions that stack, or a different class of intervention: defaults, structural redesign, or removal of the behaviour altogether.",
      },
      { type: "h2", text: "3. The two ways to miss the zone" },
      { type: "h3", text: "Too hot: a large goal on a small intervention" },
      {
        type: "p",
        text: "This is the common failure. A board sets a target of doubling adoption, halving churn or cutting energy use by a third. The delivery team is given a communications budget and a quarter. They design a well-crafted nudge, run it, and report a statistically significant 2.3 percent improvement. Everyone is disappointed. The intervention was fine. The match was wrong. Worse, the disappointment is usually charged to behavioural science (\"we tried nudging, it did not work\") rather than to the mismatch, and the organisation loses a tool that would have been perfect for a goal of the right size.",
      },
      { type: "h3", text: "Too cold: a small goal on a large intervention" },
      {
        type: "p",
        text: "The rarer but costlier failure. A modest outcome, such as getting a few more people to complete a form, is attacked with a redesigned process, a training programme, new incentives and a change-management workstream. The barrier stack for that outcome had one meaningful layer. Removing it with a default or a reminder would have done the job at a hundredth of the cost. The over-built intervention succeeds and is celebrated, and nobody notices the wasted resources because success hides waste.",
      },
      { type: "h2", text: "4. Turn the logic around: let resources set the goal" },
      {
        type: "p",
        text: "Goal-setting usually runs from ambition to plan. The Goldilocks logic also runs in reverse, and the reverse direction is often more honest. If the resources available for a solution are small, the goal for its impact should be small. A team with one analyst, one email channel and no authority over systems should promise a two-point gain and deliver it, rather than promise a transformation and deliver a two-point gain.",
      },
      {
        type: "p",
        text: "This is not defeatism. Small, reliable, cheap gains compound. A unit that delivers a two-point improvement on twenty behaviours a year is worth more than one that promises a twenty-point improvement on one behaviour and misses. And a track record of matched promises is what earns the authority and budget needed to attempt the structural changes that deliver large effects. The path to big goals runs through correctly sized small ones.",
      },
      { type: "h2", text: "5. Exploration and exploitation: allocating what you have" },
      {
        type: "p",
        text: "Once a goal and a budget are matched, the next question is how to spend the budget across approaches. Here decision theory offers a precise vocabulary. In a multi-armed bandit problem, a player faces several options with unknown payoffs and must decide, at each turn, whether to exploit the option that has performed best so far or explore a less-tested one that might be better. Exploit too early and you lock into a mediocre option. Explore too long and you spend the budget learning instead of earning.",
      },
      {
        type: "p",
        text: "Behavioural programmes face the same trade-off. Exploitation is deploying the intervention with the best evidence, typically a proven default or a well-tested reminder, and accepting its known, modest effect. Exploration is testing something new, such as a structural redesign, a novel framing or a removal of the behaviour, with a higher variance of outcomes and a chance of a much larger effect. Three principles from the bandit literature translate directly:",
      },
      {
        type: "ul",
        items: [
          "Explore in proportion to the time horizon. A programme with one shot at a result should exploit. A programme that will run for years should explore heavily early, because a better arm found in year one pays off in every later year. Most organisations do the opposite: they explore in pilots that have no follow-on and exploit in long programmes that never test alternatives.",
          "Explore in proportion to the gap. If the best known intervention delivers two points and the goal needs twenty, exploitation cannot reach the goal, and the rational choice is to spend the budget looking for a higher-payoff arm. If the best known intervention already delivers the goal, exploration is a luxury.",
          "Explore cheaply and often, not expensively and once. Optimal bandit strategies test many arms with small samples before committing. In practice this means many small experiments at identified leverage points, run in parallel, rather than one large pilot of the option the team already preferred.",
        ],
      },
      {
        type: "p",
        text: "Risk appetite is what sets the balance. Exploration is risk-taking; exploitation is risk-avoidance. Neither is virtuous in itself. A programme that only exploits will never find the structural change that makes the goal reachable. A programme that only explores will never bank a result. The Goldilocks zone for resource allocation is a portfolio: enough exploitation to guarantee the modest goal, and enough exploration to have a credible chance at the ambitious one.",
      },
      { type: "h2", text: "6. A worked example" },
      {
        type: "p",
        text: "A regional health provider wants to raise attendance at screening appointments. Baseline attendance is 60 percent. Leadership wants 85.",
      },
      {
        type: "p",
        text: "The barrier map shows six meaningful layers: patients do not receive the letter, do not read it, forget the date, cannot get time off, cannot get transport, and are anxious about the result. The evidence says an SMS reminder will move attendance by two to four points. That solves one layer. Reaching 85 requires solving at least four.",
      },
      {
        type: "p",
        text: "The Goldilocks response has three parts. First, restate the goal in tiers: 64 percent is achievable this quarter with reminders (exploit); 75 percent requires a default appointment slot with easy rescheduling and an employer letter (moderate exploration); 85 percent requires transport partnerships and a redesigned results process, and is a two-year goal. Second, allocate the budget accordingly: most of it to the proven reminder, a meaningful share to the two structural experiments, a small share to a genuinely novel arm such as mobile screening units that removes the travel behaviour entirely. Third, agree with leadership that the number they hear this quarter will be 64, and that it is a success.",
      },
      { type: "h2", text: "7. Placing this inside CLEAR" },
      {
        type: "p",
        text: "The Clarify step of the CLEAR framework exists to set objectives and key results before any intervention is designed. The argument here sharpens what that step must produce: not just a goal, but a goal that has been checked against the barrier map (Leverage) and the planning effect sizes of the interventions the team can actually afford. The Experiment step is the exploration budget. The Analysis and Refinement steps are where the exploit-versus-explore balance gets updated with real data, exactly as a bandit algorithm updates its estimates after each pull.",
      },
      { type: "h2", text: "8. Conclusion" },
      {
        type: "p",
        text: "Match the size of the goal to the size of the barrier stack you are willing to remove. Use honest planning numbers, about two points for a light-touch nudge, an order of magnitude more for defaults and structural change. Let small resources set small goals and be proud of meeting them. And when the gap between what you can prove and what you need is large, spend deliberately on exploration, because no amount of exploiting a two-point intervention will ever reach a twenty-point goal.",
      },
      {
        type: "references",
        items: [
          "DellaVigna, S., & Linos, E. (2022). RCTs to scale: Comprehensive evidence from two nudge units. Econometrica, 90(1), 81–116.",
          "Mertens, S., Herberz, M., Hahnel, U. J. J., & Brosch, T. (2022). The effectiveness of nudging: A meta-analysis of choice architecture interventions across behavioral domains. PNAS, 119(1).",
          "Maier, M., Bartoš, F., Stanley, T. D., Shanks, D. R., Harris, A. J. L., & Wagenmakers, E.-J. (2022). No evidence for nudging after adjusting for publication bias. PNAS, 119(31).",
          "Szaszi, B., et al. (2022). No reason to expect large and consistent effects of nudge interventions. PNAS, 119(31).",
          "Lattimore, T., & Szepesvári, C. (2020). Bandit Algorithms. Cambridge University Press.",
          "March, J. G. (1991). Exploration and exploitation in organizational learning. Organization Science, 2(1), 71–87.",
        ],
      },
    ],
    category: "Goals, resources and risk",
    datePublished: "2026-09",
    pages: 6,
    summary: [
      `Between any group of people and any outcome sits a stack of barriers, and a goal is a statement about how many people must get through it. Ambitious goals require solving most of the barriers; modest goals can be met by solving a few. This paper by ${AUTHOR_LINE} shows that most behaviour-change programmes get the relationship wrong in one of two ways: they set transformational targets and fund a single nudge, or they build an elaborate intervention for an outcome a light touch would have delivered.`,
      "To calibrate the match the paper reviews the nudge meta-analyses. Mertens et al. (2022) reported a medium effect (Cohen's d = 0.43) with publication bias; Maier et al. (2022) reanalysed the same data and found a bias-corrected d between −0.01 and 0.08; DellaVigna and Linos (2022), using the complete record of 126 trials run by two US government nudge units covering 23 million people, found an average 1.4 percentage-point improvement against 8.7 points in comparable academic publications. The practical reading: a typical cheap, communication-style nudge moves a behaviour by a small single-digit number of points, and around two points is a sensible planning figure.",
      "The paper then turns the logic around, letting available resources set the goal, and borrows the multi-armed bandit from decision theory to show how to split a budget between exploiting proven interventions and exploring higher-variance structural ones. A worked example takes a screening-attendance programme from a 60 percent baseline toward an 85 percent target by tiering the goal, and the closing section places the argument inside CLEAR's Clarify, Leverage and Experiment steps.",
    ],
    keyPoints: [
      "High goals commit you to solving most of the hindrances; low goals permit you to solve a subset. No intervention design escapes this arithmetic.",
      "Calibration rule: a single light-touch intervention buys roughly a two-point improvement. A twenty-point goal needs ten independent interventions that stack, or a different class of intervention: defaults, structural redesign, or removing the behaviour.",
      "DellaVigna & Linos (2022): across every trial two US nudge units ran, the typical nudge added 1.4 percentage points on a baseline take-up of roughly 17 percent; publication bias and low power explained about 70 percent of the gap to published estimates.",
      "Two ways to miss the zone: too hot (a large goal on a small intervention, the common failure) and too cold (a small goal on a large intervention, rarer but costlier, and hidden because success hides waste).",
      "Three bandit principles: explore in proportion to the time horizon; explore in proportion to the gap between what you can prove and what you need; explore cheaply and often, not expensively and once.",
      "A unit that delivers a two-point improvement on twenty behaviours a year is worth more than one that promises twenty points on one behaviour and misses.",
    ],
    faqs: [
      {
        question: "How big an effect should I expect from a nudge?",
        answer:
          "Plan on about two percentage points for a typical light-touch, communication-style nudge deployed at scale. That figure comes from the complete trial record of two US government nudge units (DellaVigna & Linos, 2022), which found an average 1.4-point gain, far below the 8.7 points reported in comparable academic studies. Defaults and structural redesign deliver an order of magnitude more.",
      },
      {
        question: "What is the Goldilocks zone in behaviour change?",
        answer:
          "The range where the size of the goal matches the size of the barrier stack the intervention is willing to remove. Too hot is a transformational target funded with one nudge; too cold is a heavyweight programme for an outcome a reminder or default would have delivered.",
      },
      {
        question: "What does exploration versus exploitation mean for a behaviour-change budget?",
        answer:
          "Exploitation is deploying the intervention with the best evidence and accepting its known modest effect. Exploration is testing something new, such as a structural redesign or removing the behaviour, with higher variance and a chance of a much larger effect. The right balance is a portfolio: enough exploitation to guarantee the modest goal and enough exploration to have a credible chance at the ambitious one.",
      },
    ],
    keywords: [
      "nudge effect size",
      "meta-analysis",
      "goal setting",
      "OKRs",
      "exploration vs exploitation",
      "multi-armed bandit",
      "behaviour change strategy",
    ],
  },
  {
    id: "clear-vs-oecd-logic",
    title: "CLEAR and the OECD’s LOGIC Framework",
    subtitle:
      "The OECD's 2024 LOGIC principles tell governments how to make behavioural science a standard part of policymaking. CLEAR tells a team how to run a change. This paper compares the two and shows where each needs the other.",
    description:
      "The OECD’s 2024 LOGIC principles tell institutions how to mainstream behavioural science. CLEAR tells a team how to run a change. How they compare, and where each needs the other.",
    takeaways: [
      "Understand LOGIC’s five dimensions and how it relates to BASIC",
      "A step-by-step mapping of CLEAR against the OECD’s project cycle",
      "Practical guidance for public bodies, companies and practitioners",
    ],
    pdfUrl: "/whitepapers/clear-vs-oecd-logic.pdf",
    body: [
      { type: "h2", text: "1. Three frameworks, two altitudes" },
      {
        type: "p",
        text: "It is easy to compare frameworks as if they were rivals for the same job. The OECD's two behavioural frameworks and CLEAR are not. They answer different questions.",
      },
      {
        type: "table",
        headers: ["", "OECD LOGIC (2024)", "OECD BASIC (2019)", "CLEAR"],
        rows: [
          ["Question answered", "How does an institution make behavioural science a normal part of how it works?", "How do you run one behavioural policy project from problem to scaled result?", "How do you run an organisational change so that it actually sticks?"],
          ["Unit of analysis", "A government or public organisation", "A policy problem and a target citizen behaviour", "An organisational system and the behaviours within it"],
          ["Structure", "5 dimensions, 14 good-practice principles, maturity journeys", "5 sequential stages with a toolkit for each", "5 iterative steps, repeated in cycles"],
          ["Primary users", "Senior leaders, central units, heads of behavioural teams", "Policy analysts, behavioural insight teams", "Change leaders, consultants, product and operations teams"],
          ["Where it was developed", "Co-designed in 2023 with 35 government behavioural experts from 14 OECD countries", "OECD with behavioural units and academics", "Practice-based, from consulting and clinical psychology"],
        ],
      },
      {
        type: "p",
        text: "LOGIC sits at institutional altitude. BASIC and CLEAR sit at project altitude. The interesting comparison is therefore twofold: CLEAR against BASIC as methods, and CLEAR against LOGIC as method against preconditions.",
      },
      { type: "h2", text: "2. What LOGIC says" },
      {
        type: "p",
        text: "LOGIC's premise is that behavioural science has proven itself in pilots and now needs to be mainstreamed, meaning routinely and systematically applied rather than deployed by a specialist unit when someone thinks to ask. Its five dimensions describe what has to be true of an institution for that to happen.",
      },
      {
        type: "ul",
        items: [
          "Leadership. Senior leaders explicitly request and advocate for behavioural evidence, and managers actively cultivate that support. Without sponsorship at the top, behavioural work stays a curiosity.",
          "Objectives. Behavioural science is written into strategic plans, with a formal account of how a behavioural perspective helps the organisation reach its goals, and its use is monitored over time.",
          "Governance. There are structures, mandates and ethical safeguards that decide who can apply behavioural methods, how quality is assured, and how the public interest is protected.",
          "Integration. Behavioural thinking is built into standard processes: policy design, regulatory impact assessment, service design, evaluation. It is a step in the workflow, not a parallel track.",
          "Capability. Staff across the organisation, not only specialists, have the skills, tools and networks to apply behavioural science at the level their role requires.",
        ],
      },
      {
        type: "p",
        text: "The framework is deliberately not a method. It does not tell you how to diagnose a behaviour or design an intervention. It assumes you have BASIC or an equivalent for that, and asks what surrounds it.",
      },
      { type: "h2", text: "3. CLEAR against BASIC: the method comparison" },
      {
        type: "p",
        text: "BASIC's five stages are Behaviour (identify and prioritise the target behaviour), Analysis (diagnose why it happens, using the ABCD lens of attention, belief formation, choice and determination), Strategies (design interventions), Intervention (test them, ideally experimentally), and Change (scale, monitor, maintain). CLEAR's are Clarify (objectives and key results), Leverage (map the system and find intervention points), Experiment (test small), Analyse (evaluate against key results, attend to surprises), Refine (feed learning back, scale, start the next cycle).",
      },
      {
        type: "table",
        headers: ["BASIC", "CLEAR", "Difference in emphasis"],
        rows: [
          ["Behaviour", "Clarify", "BASIC starts from a target behaviour. CLEAR starts from an outcome and measurable key results, and only then decides which behaviours, if any, need to change. This allows outcomes to be reached without behaviour change where the system permits it."],
          ["Analysis", "Leverage", "BASIC diagnoses the individual's decision process (ABCD). CLEAR maps the organisational system: feedback loops, dependencies, incentives and structures, and looks for points where small changes propagate. Individual psychology is one input, not the frame."],
          ["Strategies + Intervention", "Experiment", "Both insist on testing. CLEAR pushes towards many small, cheap prototypes at leverage points, in the spirit of design thinking, rather than one well-powered trial."],
          ["Change", "Analyse + Refine", "BASIC treats scaling as the end of the cycle. CLEAR treats it as the start of the next one and gives explicit weight to surprises and failures as the most valuable data."],
        ],
      },
      {
        type: "p",
        text: "The two are close relatives. The genuine differences are three. First, the starting point: behaviour versus outcome. Second, the unit of diagnosis: the individual mind versus the organisational system. Third, the shape: BASIC is a sequence that can be repeated, CLEAR is a loop by design, with each cycle expected to sharpen the objectives set in the last.",
      },
      { type: "h2", text: "4. CLEAR against LOGIC: method meets preconditions" },
      {
        type: "p",
        text: "Read LOGIC as a checklist of what an organisation needs before a project method can be run more than once, and the comparison with CLEAR becomes practical.",
      },
      { type: "h3", text: "Where CLEAR already covers LOGIC's ground" },
      {
        type: "p",
        text: "The Clarify step does at project level what LOGIC's Objectives dimension asks at institutional level: it forces an explicit statement of what success means and how it will be measured. A CLEAR programme that has been run well produces exactly the evidence base LOGIC's Leadership dimension wants senior leaders to be asking for. And the Refine step, by feeding learning back into the next cycle, is a small-scale version of LOGIC's Integration principle: the behavioural perspective becomes part of how the next piece of work is planned.",
      },
      { type: "h3", text: "Where LOGIC identifies what CLEAR cannot do alone" },
      {
        type: "p",
        text: "CLEAR is silent on governance. It assumes the team running it has the mandate, ethical framework and quality assurance to do so. In a corporate setting that assumption is often safe; in a public one it is not, and LOGIC's Governance dimension is a necessary addition. CLEAR is also silent on capability beyond the team in the room. LOGIC's Capability dimension makes the point that a method is only mainstream when people outside the specialist unit can apply it. A CLEAR practice that lives with one consultant or one internal team has not been mainstreamed, however good its results.",
      },
      { type: "h3", text: "Where CLEAR sharpens LOGIC" },
      {
        type: "p",
        text: "LOGIC's Objectives dimension asks organisations to state how behavioural science serves strategy. It does not, because it is not a method, say how to size those objectives. CLEAR's insistence on key results, and the practitioner discipline of matching goal size to intervention size, gives LOGIC's Objectives principle teeth. And LOGIC's Integration dimension talks about embedding behavioural thinking in processes; CLEAR's Leverage step supplies the systems map that shows which processes matter.",
      },
      {
        type: "callout",
        label: "The combined picture",
        text: "LOGIC tells an institution what has to be true for behavioural work to be routine. BASIC or CLEAR tells a team how to do the work. CLEAR's distinctive contribution is to treat the organisation itself as the system under intervention, which is precisely the system LOGIC is trying to change.",
      },
      { type: "h2", text: "5. Practical guidance" },
      {
        type: "p",
        text: "If you are in government or a regulated public body: use LOGIC to assess institutional maturity across the five dimensions before committing to any project method. Then run projects with BASIC where the target is a citizen behaviour and the diagnostic tradition (ABCD) fits, and with CLEAR where the target is the organisation's own behaviour: how a department adopts a new process, how a service team changes its working pattern, how a policy unit learns from its own experiments.",
      },
      {
        type: "p",
        text: "If you are in a company: LOGIC's dimensions translate directly. Does leadership ask for behavioural evidence? Is behavioural change written into strategy with measurable objectives? Who is allowed to run experiments on staff and customers, under what ethical rules? Is behavioural thinking part of product, HR and operations processes, or a separate innovation team? Can people outside that team do the work? Score yourselves, then run CLEAR cycles on the dimensions that scored lowest. The organisation's own adoption of behavioural science is a change problem, and CLEAR is built for change problems.",
      },
      {
        type: "p",
        text: "If you are a practitioner choosing a method: the choice between BASIC and CLEAR is mostly a choice of starting point and unit of analysis. Start from a behaviour and a citizen, use BASIC. Start from an outcome and a system, use CLEAR. Either way, LOGIC is the list of things that will stop your second project from happening even if your first one succeeds.",
      },
      { type: "h2", text: "6. Conclusion" },
      {
        type: "p",
        text: "The OECD's LOGIC framework is an important document because it names the real bottleneck in behavioural public policy: not the lack of methods, but the lack of institutions ready to use them routinely. CLEAR does not compete with it. CLEAR is one of the methods LOGIC assumes, closest in shape to the OECD's own BASIC, and differing from it by starting with outcomes rather than behaviours, by mapping systems rather than individual decisions, and by looping rather than sequencing. Where the two meet is the organisation itself: LOGIC describes the destination, and CLEAR is a method for getting an organisation there one experiment at a time.",
      },
      {
        type: "references",
        items: [
          "OECD (2024). LOGIC: Good Practice Principles for Mainstreaming Behavioural Public Policy. OECD Publishing, Paris.",
          "OECD (2019). Tools and Ethics for Applied Behavioural Insights: The BASIC Toolkit. OECD Publishing, Paris.",
          "OECD (2017). Behavioural Insights and Public Policy: Lessons from Around the World. OECD Publishing, Paris.",
          "OECD (2025). Mind Shift, Green Lift: Six Behavioural Science Trends for Environmental Policy. OECD Publishing, Paris.",
          "Bohjort, E. The CLEAR Change Framework. clear-framework.com.",
        ],
      },
    ],
    category: "Framework comparison",
    datePublished: "2026-09",
    pages: 6,
    summary: [
      `In May 2024 the OECD published LOGIC: Good Practice Principles for Mainstreaming Behavioural Public Policy, fourteen principles across five dimensions (Leadership, Objectives, Governance, Integration, Capability) for embedding behavioural science in government. It complements the OECD's earlier BASIC toolkit (Behaviour, Analysis, Strategies, Intervention, Change), which describes the steps of a single behavioural project. This paper by ${AUTHOR_LINE} compares both with CLEAR's five iterative steps (Clarify, Leverage, Experiment, Analyse, Refine).`,
      "The frameworks operate at different altitudes. LOGIC is about institutional readiness; BASIC and CLEAR are about doing the work. Against BASIC, CLEAR maps closely onto the project cycle with three genuine differences: it starts from an outcome and measurable key results rather than a target behaviour, it diagnoses the organisational system rather than the individual decision process, and it is a loop by design rather than a sequence that can be repeated.",
      "Against LOGIC, CLEAR already covers some ground (Clarify does at project level what the Objectives dimension asks institutionally) but is silent on governance and on capability beyond the team in the room, which LOGIC supplies. In return CLEAR's key-results discipline and systems map give LOGIC's Objectives and Integration principles teeth. The paper closes with guidance for public bodies, companies and practitioners choosing between the methods.",
    ],
    keyPoints: [
      "LOGIC (OECD, 2024) was co-designed in 2023 with 35 government behavioural experts from 14 OECD countries; it has 5 dimensions and 14 good-practice principles and is deliberately not a method.",
      "BASIC's five stages are Behaviour, Analysis (using the ABCD lens of attention, belief formation, choice and determination), Strategies, Intervention and Change.",
      "CLEAR against BASIC: outcome versus behaviour as the starting point; organisational system versus individual mind as the unit of diagnosis; loop versus sequence as the shape.",
      "CLEAR is silent on governance and on capability outside the specialist team; those are what LOGIC's Governance and Capability dimensions add.",
      "Practitioner rule: start from a behaviour and a citizen, use BASIC; start from an outcome and a system, use CLEAR. Either way LOGIC is the list of things that will stop your second project from happening even if your first one succeeds.",
    ],
    faqs: [
      {
        question: "What is the OECD LOGIC framework?",
        answer:
          "Good Practice Principles for Mainstreaming Behavioural Public Policy, published by the OECD in May 2024: fourteen principles across Leadership, Objectives, Governance, Integration and Capability that describe what has to be true of an institution for behavioural science to be applied routinely rather than in one-off pilots. It is not a project method; it assumes one such as BASIC.",
      },
      {
        question: "How does CLEAR differ from the OECD BASIC toolkit?",
        answer:
          "They are close relatives. BASIC starts from a target citizen behaviour and diagnoses the individual's decision process; CLEAR starts from an outcome with measurable key results and maps the organisational system, so outcomes can sometimes be reached without behaviour change. BASIC is a repeatable sequence; CLEAR is an iterative loop in which each cycle sharpens the objectives set in the last.",
      },
      {
        question: "Which should a company or public body use?",
        answer:
          "Use LOGIC to assess institutional maturity first. Then run projects with BASIC where the target is a citizen behaviour, and with CLEAR where the target is the organisation's own behaviour, such as how a department adopts a new process or how a policy unit learns from its experiments. Companies can translate LOGIC's five dimensions directly and run CLEAR cycles on the ones that score lowest.",
      },
    ],
    keywords: [
      "OECD LOGIC",
      "OECD BASIC",
      "behavioural public policy",
      "behavioural insights",
      "framework comparison",
      "mainstreaming behavioural science",
    ],
  },
  {
    id: "clear-change-framework",
    title: "The CLEAR Change Framework",
    subtitle: "A powerful path to transformation.",
    description:
      "A comprehensive guide to the CLEAR methodology — from theoretical foundations to practical implementation.",
    takeaways: [
      "Understand the complete 5-step CLEAR process",
      "Learn how to apply systems thinking to organizational challenges",
      "Get actionable templates for running CLEAR workshops",
    ],
    pdfUrl: "/whitepapers/clear-change-framework.pdf",
    category: "Framework",
    pages: 22,
    summary: [
      `Over 70 percent of transformation initiatives fail, often because people lack clarity of purpose and genuine engagement. This introductory whitepaper by ${AUTHOR_LINE} presents CLEAR as a five-step model designed to flip that script: Clarity, Leverage, Experimentation, Analysis and Refinement, a sequence that balances a clear North Star with agile, iterative execution.`,
      "The paper compares CLEAR with established models, including Kotter's 8 Steps, ADKAR and Lean Change, to validate its principles, and draws on real-world stories such as the Starbucks turnaround, Earth Force's grassroots innovation and the UK Policy Lab's experiments. CLEAR does not ask organisations to abandon what works in traditional change management; it integrates proven ideas such as vision and reinforcement with an adaptive learning mindset.",
    ],
    keyPoints: [
      "CLEAR stands for Clarity, Leverage, Experimentation, Analysis, Refinement.",
      "Designed to balance a clear North Star vision with iterative, experiment-driven execution.",
      "Compared against Kotter's 8 Steps, ADKAR and Lean Change, and illustrated with Starbucks, Earth Force and the UK Policy Lab.",
    ],
    faqs: [
      {
        question: "Who is this whitepaper for?",
        answer:
          "Leaders and change practitioners who want a complete introduction to the CLEAR Change Framework: its five steps, how it relates to established change models, and how to run it in practice.",
      },
      {
        question: "Does CLEAR replace Kotter or ADKAR?",
        answer:
          "No. The paper positions CLEAR as integrating proven ideas from traditional change management, such as the importance of vision and reinforcement, with a modern, iterative learning approach built on behavioural science and systems thinking.",
      },
    ],
    keywords: ["CLEAR framework", "change management", "organisational change", "Kotter", "ADKAR", "systems thinking"],
  },
  {
    id: "clear-comparison",
    title: "Beyond Boundaries: CLEAR vs OBM, BCW & Design Thinking",
    description:
      "How the CLEAR framework compares to and integrates the strengths of established change methodologies.",
    takeaways: [
      "Understand the limits of single-domain approaches",
      "See how CLEAR bridges behavioral science and systems thinking",
      "Learn when to use CLEAR vs other frameworks",
    ],
    pdfUrl: "/whitepapers/clear-comparison.pdf",
    category: "Framework comparison",
    pages: 19,
    summary: [
      `Organizational Behavior Management (OBM), the Behaviour Change Wheel (BCW) and Design Thinking each offer part of the change puzzle, and each focuses on a specific domain: OBM on employee behaviour inside organisations, BCW on individual behaviour-change science, Design Thinking on product and service innovation. This whitepaper by ${AUTHOR_LINE} compares CLEAR with all three.`,
      "It shows where CLEAR aligns with each framework and where it extends beyond their limits by integrating behavioural science, management and design into a broader foundation for change across systems, strategies and people.",
    ],
    keyPoints: [
      "OBM focuses on employee behaviour within organisations; BCW is rooted in individual behaviour-change science (COM-B); Design Thinking drives product and service innovation.",
      "CLEAR is positioned as a unifying approach that integrates the strengths of the three rather than competing with any one of them.",
    ],
    faqs: [
      {
        question: "How does CLEAR relate to the Behaviour Change Wheel and COM-B?",
        answer:
          "The Behaviour Change Wheel is rooted in individual behaviour-change science. CLEAR uses the same behavioural foundations, including COM-B, but widens the unit of analysis to the organisational system and adds systems mapping, experimentation and refinement cycles.",
      },
    ],
    keywords: ["Behaviour Change Wheel", "COM-B", "OBM", "Design Thinking", "framework comparison"],
  },
  {
    id: "clear-sustainability",
    title: "Driving Sustainable Change Inside and Out",
    description:
      "How organizations can use the CLEAR framework to embed sustainability into operations, culture, and strategy.",
    takeaways: [
      "Align sustainability with business strategy",
      "Use systems mapping to identify ESG leverage points",
      "Build lasting sustainable practices through iterative change",
    ],
    pdfUrl: "/whitepapers/clear-sustainability.pdf",
    category: "Sustainability",
    pages: 17,
    summary: [
      `Sustainability has become a core strategic imperative, yet making broad change stick is difficult: roughly 70 percent of change programmes fail to meet their goals, often through resistance or lack of alignment. This whitepaper by ${AUTHOR_LINE} shows how CLEAR's listening-driven, systemic approach supports sustainability both internally, in operations and culture, and externally, across customers, community and policy.`,
      "It covers aligning sustainability with business strategy, using systems mapping to find ESG leverage points, and building lasting practices through iterative cycles, with case illustrations and a comparison against established sustainability frameworks such as the UN Sustainable Development Goals.",
    ],
    keyPoints: [
      "Treats sustainability as a change problem: the barrier is usually behaviour and alignment, not ambition.",
      "Uses the Leverage step's systems map to find where small changes in operations propagate into ESG outcomes.",
    ],
    faqs: [
      {
        question: "Who should read this whitepaper?",
        answer:
          "Sustainability and ESG leads, operations leaders and change managers who need to turn sustainability commitments into operational behaviour across departments.",
      },
    ],
    keywords: ["sustainability", "ESG", "sustainable behaviour", "organisational change"],
  },
  {
    id: "clear-clarity",
    title: "Frameworks for Clarifying Purpose and Setting Goals",
    description:
      "A deep dive into the Clarity step — the most critical foundation for any successful change initiative.",
    takeaways: [
      "Master OKR-setting for change initiatives",
      "Align stakeholders around a shared North Star",
      "Avoid the #1 reason change programs fail",
    ],
    pdfUrl: "/whitepapers/clear-clarity.pdf",
    category: "Clarify step",
    pages: 37,
    summary: [
      `The first step of CLEAR, Clarify, defines the outcomes a change leader aims to achieve. This reference whitepaper by ${AUTHOR_LINE} compiles the most used frameworks for articulating why an organisation exists, what it wants to achieve and how it will measure success: long-term alignment tools such as mission and vision statements and Simon Sinek's Golden Circle, and execution frameworks such as OKRs, SMART goals, KPIs and Hoshin Kanri.`,
      "Each framework is presented with practical application first (about 80 percent) and theory second, with examples, core principles, ideal use cases, strengths and limitations. The theoretical spine is Locke and Latham's goal-setting theory: specific, challenging goals drive higher performance than vague or easy ones, through clarity, challenge, commitment, feedback and task complexity.",
    ],
    keyPoints: [
      "Covers mission and vision, the Golden Circle, OKRs, SMART goals, KPIs and Hoshin Kanri.",
      "Grounded in Locke and Latham's five principles of effective goals: clarity, challenge, commitment, feedback, task complexity.",
    ],
    faqs: [
      {
        question: "Which goal-setting framework does CLEAR recommend?",
        answer:
          "CLEAR's Clarify step produces objectives and measurable key results, so OKRs are the natural fit, but the paper presents several frameworks with their ideal use cases so teams can choose what matches their horizon and culture.",
      },
    ],
    keywords: ["OKRs", "goal setting", "Locke and Latham", "purpose", "Hoshin Kanri", "SMART goals"],
  },
  {
    id: "clear-case-studies",
    title: "Iterative Change: Real-World Success Stories",
    description:
      "How organizations like Domino’s Pizza and others achieved transformation through iterative, listening-based change.",
    takeaways: [
      "Learn from real turnaround stories",
      "See how feedback loops drive business results",
      "Understand why iterative beats linear change",
    ],
    pdfUrl: "/whitepapers/clear-case-studies.pdf",
    category: "Case studies",
    pages: 8,
    summary: [
      `Many of the most dramatic business turnarounds have come not from a rigid blueprint but from continuous listening, iteration and co-creation. This whitepaper by ${AUTHOR_LINE} collects published cases from diverse industries that show how a CLEAR-aligned iterative approach outperforms linear change models such as Kotter's 8 Steps or ADKAR.`,
      "The opening case is Domino's Pizza, which in 2009 faced flat sales and focus groups describing its product as “cardboard”, chose to publish the criticism rather than hide it, and rebuilt the product through iterative testing. The other cases follow the same pattern of engaging stakeholders, listening deeply and refining solutions in real time.",
    ],
    keyPoints: [
      "Domino's Pizza turned public, unflattering customer feedback into the start of an iterative product and brand rebuild.",
      "Common thread: leaders who listen, iterate and co-create outperform those who follow a fixed sequence of steps.",
    ],
    faqs: [
      {
        question: "Are these CLEAR engagements?",
        answer:
          "No. They are published, public cases chosen because they illustrate the iterative, listening-based pattern that CLEAR formalises. They are not claims about Erik Bohjort's client work.",
      },
    ],
    keywords: ["case studies", "iterative change", "Domino's Pizza", "turnaround", "feedback loops"],
  },
];

export function getWhitepaper(id: string | undefined): Whitepaper | undefined {
  return id ? whitepapers.find((w) => w.id === id) : undefined;
}

export function whitepaperPath(id: string): string {
  return `/resources/${id}`;
}
