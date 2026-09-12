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
