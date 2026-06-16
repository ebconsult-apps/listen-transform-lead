import type { ClarifyOutput, LeverageFull, LeverageTeaser } from "./types.ts";

// Canned demo output (parity with src/lib/clear/fixtures/*.json). Used by the
// stub engine so AI_MODE=stub is fully demoable without an Anthropic key.

export const CLARIFY_FIXTURE: ClarifyOutput = {
  whyItMatters:
    "The behaviour you want to move sits at the centre of a system of habits, incentives and frictions. Without a shared, measurable definition of success, teams optimise for activity instead of the few changes that actually shift behaviour. Clarify fixes the target before any intervention is designed.",
  objective:
    "Increase sustained adoption of the target behaviour within the priority group, measured by a behavioural rate that holds for at least 8 weeks rather than a one-off spike.",
  keyResults: [
    { kr: "Lift the core behaviour adoption rate in the priority segment", baseline: "31% (trailing 90 days)", target: "50% by end of quarter", confidence: "Medium" },
    { kr: "Reduce drop-off between first and repeat action", baseline: "58% drop-off", target: "≤35% drop-off", confidence: "Medium" },
    { kr: "Sustain the behaviour 8 weeks after first adoption", baseline: "Not measured", target: "≥70% still active at week 8", confidence: "Low" },
  ],
  assumptions: [
    "The priority segment is reachable through existing channels at least weekly.",
    "Intent is not the bottleneck — most of the group already says they want the outcome.",
    "Current baseline data is representative and not skewed by a recent campaign.",
  ],
  gaps: [
    "No instrumented measure of the week-8 sustained behaviour yet.",
    "Stakeholder ownership of the friction points is split across two teams.",
    "Unclear which segment sub-groups face capability vs. motivation barriers.",
  ],
};

const TEASER_BASE = {
  systemsMapSummary:
    "The target behaviour is gated by three reinforcing loops: a friction loop, a salience loop, and a social-proof loop. The highest-leverage points sit where these loops intersect — early in the journey, before habits set.",
  topLeveragePoints: [
    { rank: 1, point: "Remove the highest-friction step at the moment of action", currentState: "A required step adds ~2 minutes and a context switch right when motivation peaks.", impact: "High" as const, ease: "High" as const, confidence: 78 },
    { rank: 2, point: "Add a timely environmental cue tied to an existing routine", currentState: "There is no reminder anchored to a moment the group already pays attention to.", impact: "High" as const, ease: "Medium" as const, confidence: 64 },
    { rank: 3, point: "Make the desired behaviour the visible social norm", currentState: "Peers only see the old behaviour; the new one is invisible.", impact: "Medium" as const, ease: "Medium" as const, confidence: 57 },
  ],
  headline:
    "Three changes — cut one friction point, add one cue, flip the visible norm — plausibly move adoption from 31% toward the 50% target without new incentives.",
};

export const TEASER_FIXTURE: LeverageTeaser = TEASER_BASE;

export const FULL_FIXTURE: LeverageFull = {
  ...TEASER_BASE,
  comb: [
    { factor: "Capability — Physical", barrier: "The action requires a step many in the group can't complete in the moment.", evidence: "Drop-off concentrates at the step that demands the context switch." },
    { factor: "Capability — Psychological", barrier: "People are unsure whether they did it 'right', so they hesitate to repeat.", evidence: "Repeat-action rate lags first-action rate by a wide margin." },
    { factor: "Opportunity — Physical", barrier: "No environmental cue at the decision point; behaviour depends on memory.", evidence: "Behaviour clusters right after any incidental reminder, then decays." },
    { factor: "Opportunity — Social", barrier: "The desired behaviour is invisible to peers, so the norm signals the opposite.", evidence: "Adoption is higher where the behaviour is publicly visible." },
    { factor: "Motivation — Reflective", barrier: "Belief the outcome is worth it is present but fragile under friction.", evidence: "Stated intent is high; behaviour falls off only when effort rises." },
    { factor: "Motivation — Automatic", barrier: "No habit loop yet; nothing makes the behaviour feel automatic.", evidence: "Week-8 sustained rate is unmeasured but anecdotally low." },
  ],
  barrierNarratives: [
    { point: "Remove the highest-friction step at the moment of action", narrative: "Effort at the decision point is the dominant barrier. Because motivation is already high, lowering friction converts existing intent directly into action — the cheapest, fastest lever." },
    { point: "Add a timely environmental cue tied to an existing routine", narrative: "Even motivated people forget. Anchoring a cue to an existing routine turns memory-dependence into reliable triggering without adding incentives." },
    { point: "Make the desired behaviour the visible social norm", narrative: "Behaviour spreads by imitation. Making the new behaviour visible flips social proof from a headwind into a tailwind, reinforcing the other two levers over time." },
  ],
  gapLog: [
    "Instrument the week-8 sustained-behaviour measure before launch.",
    "Assign single-team ownership of the friction step to avoid split accountability.",
    "Segment the group by capability vs. motivation barrier to target interventions.",
    "Validate that the chosen cue routine actually has the group's attention.",
  ],
  discoveryActivities: [
    "5–8 contextual interviews at the moment of action to confirm the friction step.",
    "A friction audit / journey walkthrough timing each step to the decision point.",
    "A norms survey to measure perceived vs. actual behaviour in the group.",
    "A baseline instrumentation sprint to capture the week-8 sustained metric.",
  ],
};
