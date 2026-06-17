import type {
  ClarifyOutput,
  ExperimentOutput,
  LeverageFull,
  LeverageTeaser,
} from "./types.ts";

// Canned demo output (parity with src/lib/clear/fixtures/*.json). Used by the
// stub engine so AI_MODE=stub is fully demoable without an Anthropic key. The
// scenario is a generic adoption challenge gated by friction, salience and norms.

export const CLARIFY_FIXTURE: ClarifyOutput = {
  whyItMatters:
    "The behaviour you want to move sits at the centre of a system of habits, incentives and frictions, and right now the team measures activity instead of the few changes that actually shift behaviour. Without a shared, measurable definition of success, every conversation drifts toward more nudges and more comms — effort that feels productive but rarely moves the number that matters. Clarify fixes the target before any intervention is designed: it names one behavioural outcome, sets the key results that prove we moved it, and makes the baseline explicit so progress is undeniable. Getting this right means later phases can focus their energy on the highest-leverage barrier rather than relitigating what success means.",
  objective:
    "Increase sustained adoption of the target behaviour within the priority group, measured by a behavioural rate that holds for at least 8 weeks rather than a one-off spike.",
  keyResults: [
    { kr: "Lift the core behaviour adoption rate in the priority segment", metric: "Adoption rate (%)", baseline: "31% (trailing 90 days)", target: "50%", timeline: "End of quarter", owner: "Product lead", confidence: "Medium" },
    { kr: "Reduce drop-off between first and repeat action", metric: "First→repeat drop-off (%)", baseline: "58% drop-off", target: "≤35% drop-off", timeline: "End of quarter", owner: "Growth lead", confidence: "Medium" },
    { kr: "Sustain the behaviour 8 weeks after first adoption", metric: "Week-8 retained-active (%)", baseline: "Not measured", target: "≥70% still active at week 8", timeline: "8 weeks post-adoption", owner: "Data lead", confidence: "Low" },
  ],
  gapLog: [
    { type: "gap", content: "No instrumented measure of the week-8 sustained behaviour yet." },
    { type: "assumption", content: "Current baseline data is representative and not skewed by a recent campaign.", source: "Trailing-90-day analytics" },
    { type: "input_needed", content: "Confirm which team owns the friction point — ownership appears split across two teams." },
  ],
};

const TEASER_BASE: LeverageTeaser = {
  systemsMapSummary:
    "The target behaviour is gated by three reinforcing loops: a friction loop (each extra step at the moment of action compounds drop-off), a salience loop (nothing in the environment cues the behaviour, so it depends on memory), and a social-proof loop (peers only see the old behaviour, so the visible norm pulls the wrong way). The highest-leverage points sit where these loops intersect — early in the journey, before habits set.",
  topLeveragePoints: [
    { rank: 1, point: "Remove the highest-friction step at the moment of action", currentState: "A required step adds ~2 minutes and a context switch right when motivation peaks.", impact: "High", ease: "High", confidence: 78 },
    { rank: 2, point: "Add a timely environmental cue tied to an existing routine", currentState: "There is no reminder anchored to a moment the group already pays attention to.", impact: "High", ease: "Medium", confidence: 64 },
    { rank: 3, point: "Make the desired behaviour the visible social norm", currentState: "Peers only see the old behaviour; the new one is invisible.", impact: "Medium", ease: "Medium", confidence: 57, assumptionBased: true },
  ],
  headline:
    "If we changed the moment-of-action friction, the environmental cue, and the visible norm, we'd likely see adoption move from 31% toward the 50% target without new incentives.",
};

export const TEASER_FIXTURE: LeverageTeaser = TEASER_BASE;

export const FULL_FIXTURE: LeverageFull = {
  ...TEASER_BASE,
  topLeveragePoints: [
    ...TEASER_BASE.topLeveragePoints,
    { rank: 4, point: "Confirm completion so people know they 'did it right'", currentState: "No confirmation after the first action; users hesitate to repeat.", impact: "Medium", ease: "High", confidence: 61 },
    { rank: 5, point: "Pre-fill known information to shorten the action", currentState: "Users re-enter data the system already holds.", impact: "Medium", ease: "Medium", confidence: 55, assumptionBased: true },
    { rank: 6, point: "Sequence the ask after a moment of demonstrated intent", currentState: "The ask lands before intent is expressed, so it reads as noise.", impact: "Low", ease: "Medium", confidence: 48 },
  ],
  behaviors: [
    { id: "b1", description: "Completes the core action in a single sitting at the decision point", who: "Priority-segment user", doesWhat: "Completes the core action", when: "At the decision point", where: "In the product", howOften: "Per eligible occasion", withWhom: "Alone", level: "detail", genre: "carry_out_process" },
    { id: "b2", description: "Repeats the action within the following week", who: "First-time actor", doesWhat: "Repeats the action", when: "Within 7 days", where: "In the product", howOften: "Weekly", withWhom: "Alone", level: "detail", genre: "carry_out_process" },
    { id: "b3", description: "Notices a peer performing the new behaviour", who: "Priority-segment user", doesWhat: "Observes a peer's visible action", when: "During routine use", where: "Shared surfaces", howOften: "Recurring", withWhom: "Peers", level: "high", genre: "social" },
  ],
  behaviorPriorities: [
    { behaviorId: "b1", effect: 5, ease: 4, centrality: 5, measurability: 4 },
    { behaviorId: "b2", effect: 4, ease: 3, centrality: 4, measurability: 4 },
    { behaviorId: "b3", effect: 3, ease: 2, centrality: 3, measurability: 2 },
  ],
  keyActors: [
    { actor: "Priority-segment user", behavior: "Decides whether to complete the action at the decision point" },
    { actor: "Peer cohort", behavior: "Signals the prevailing norm through visible behaviour" },
    { actor: "Product team", behavior: "Owns the friction step and the confirmation surface" },
  ],
  causeEffect: [
    { from: "Friction at the moment of action", to: "First-action drop-off", polarity: "+", note: "Each extra step compounds drop-off" },
    { from: "Absence of an environmental cue", to: "Reliance on memory", polarity: "+" },
    { from: "Invisible new behaviour", to: "Norm pulls toward old behaviour", polarity: "+" },
    { from: "Completion confirmation", to: "Repeat-action rate", polarity: "-", note: "Confirmation reduces hesitation to repeat" },
  ],
  loops: [
    "Friction loop: friction → drop-off → fewer visible adopters → weaker norm → less motivation to push through friction.",
    "Salience loop: no cue → behaviour forgotten → no habit → cue never becomes self-generated.",
  ],
  comb: [
    { component: "capability_physical", barrier: "The action requires a step many in the group can't complete in the moment.", significance: "Dominant first-action barrier", impact: "High", changeability: "High", evidenceFlag: "V", source: "Funnel analytics: drop-off concentrates at the context-switch step" },
    { component: "capability_psychological", barrier: "People are unsure whether they did it 'right', so they hesitate to repeat.", impact: "Medium", changeability: "High", evidenceFlag: "A", source: "Inferred from repeat-rate lag" },
    { component: "opportunity_physical", barrier: "No environmental cue at the decision point; behaviour depends on memory.", impact: "High", changeability: "Medium", evidenceFlag: "V", source: "Behaviour clusters after incidental reminders, then decays" },
    { component: "opportunity_social", barrier: "The desired behaviour is invisible to peers, so the norm signals the opposite.", impact: "Medium", changeability: "Medium", evidenceFlag: "A", source: "Higher adoption where behaviour is publicly visible (correlational)" },
    { component: "motivation_reflective", barrier: "Belief the outcome is worth it is present but fragile under friction.", impact: "Medium", changeability: "Low", evidenceFlag: "V", source: "Stated intent high; behaviour falls off only as effort rises" },
    { component: "motivation_automatic", barrier: "No habit loop yet; nothing makes the behaviour feel automatic.", impact: "Medium", changeability: "Medium", evidenceFlag: "G", source: "Week-8 sustained rate unmeasured" },
  ],
  strongestBarriers: [
    { barrier: "Friction at the moment of action blocks capable, motivated users", component: "capability_physical", rationale: "Highest impact and highly changeable; converts existing intent directly into action." },
    { barrier: "No environmental cue, so the behaviour depends on memory", component: "opportunity_physical", rationale: "High impact; anchoring a cue to an existing routine is a cheap, reversible change." },
    { barrier: "The new behaviour is invisible, so social proof runs the wrong way", component: "opportunity_social", rationale: "Reinforces the other two levers once the behaviour becomes visible." },
  ],
  barrierNarratives: [
    { point: "Remove the highest-friction step at the moment of action", narrative: "Effort at the decision point is the dominant barrier. Because motivation is already high, lowering friction converts existing intent directly into action — the cheapest, fastest lever." },
    { point: "Add a timely environmental cue tied to an existing routine", narrative: "Even motivated people forget. Anchoring a cue to an existing routine turns memory-dependence into reliable triggering without adding incentives." },
    { point: "Make the desired behaviour the visible social norm", narrative: "Behaviour spreads by imitation. Making the new behaviour visible flips social proof from a headwind into a tailwind, reinforcing the other two levers over time." },
  ],
  gapLog: [
    { type: "gap", content: "Instrument the week-8 sustained-behaviour measure before launch." },
    { type: "input_needed", content: "Assign single-team ownership of the friction step to avoid split accountability." },
    { type: "assumption", content: "The chosen cue routine actually has the group's attention.", source: "Unvalidated" },
    { type: "gap", content: "Segment the group by capability vs. motivation barrier to target interventions." },
  ],
  discoveryActivities: [
    "5–8 contextual interviews at the moment of action to confirm the friction step.",
    "A friction audit / journey walkthrough timing each step to the decision point.",
    "A norms survey to measure perceived vs. actual behaviour in the group.",
    "A baseline instrumentation sprint to capture the week-8 sustained metric.",
  ],
};

export const EXPERIMENT_FIXTURE: ExperimentOutput = {
  interventionCandidates: [
    {
      leveragePointRank: 1,
      barrier: "Friction at the moment of action blocks capable, motivated users",
      title: "Pre-fill the blocking step",
      description: "Pre-populate the field that forces a context switch so the first action takes seconds, not minutes. Fully reversible behind a flag.",
      apease: { effectiveness: 5, practicability: 4, affordability: 4, acceptability: "pass", safety: "pass", equity: "pass", notes: "Smallest reversible test of the dominant barrier." },
    },
    {
      leveragePointRank: 1,
      barrier: "Friction at the moment of action blocks capable, motivated users",
      title: "Defer the blocking step to after first value",
      description: "Move the high-friction step until after the user has seen value, testing whether ordering alone lifts completion.",
      apease: { effectiveness: 4, practicability: 4, affordability: 5, acceptability: "pass", safety: "pass", equity: "pass" },
    },
    {
      leveragePointRank: 2,
      barrier: "No environmental cue, so the behaviour depends on memory",
      title: "Anchor a cue to an existing weekly routine",
      description: "Attach a single lightweight reminder to a moment the group already attends to, rather than adding a new channel.",
      apease: { effectiveness: 4, practicability: 3, affordability: 4, acceptability: "flag", safety: "pass", equity: "pass", notes: "FLAG: confirm reminder frequency with comms to avoid notification fatigue." },
    },
    {
      leveragePointRank: 3,
      barrier: "The new behaviour is invisible, so social proof runs the wrong way",
      title: "Show an aggregate 'most people' signal",
      description: "Surface an honest aggregate count of peers performing the behaviour on a shared surface.",
      apease: { effectiveness: 3, practicability: 4, affordability: 4, acceptability: "pass", safety: "pass", equity: "pass" },
    },
    {
      leveragePointRank: 3,
      barrier: "The new behaviour is invisible, so social proof runs the wrong way",
      title: "Publish individual peer activity by name",
      description: "Make each peer's activity individually visible to the cohort to maximise social proof.",
      apease: { effectiveness: 4, practicability: 3, affordability: 4, acceptability: "fail", safety: "flag", equity: "fail", notes: "FAIL on Acceptability and Equity: exposes individuals without consent and disadvantages less-active users. Parked regardless of score." },
    },
  ],
  faq: [
    { q: "Will pre-filling the field cause wrong data?", a: "We only pre-fill values the system already holds with high confidence, and users can edit before confirming." },
    { q: "Is the cue just another notification people will mute?", a: "It's a single reminder anchored to an existing routine, capped in frequency, and measured against opt-outs during the test." },
  ],
  gapLog: [
    { type: "assumption", content: "Resource envelope assumed conservative (one engineer, two weeks, no new spend) — confirm with owner.", source: "Envelope unclear at intake" },
    { type: "gap", content: "Success threshold for the cue test depends on the week-8 metric that is not yet instrumented." },
  ],
};
