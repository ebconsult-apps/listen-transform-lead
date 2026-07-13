import type { IntakeInput, ResourceEnvelope } from "../../supabase/functions/_shared/clear/types.ts";

// Fixture 2 — hospital hand-hygiene compliance. Deliberately a non-digital,
// clinical setting so the harness catches reports that reach for generic SaaS/
// nudge advice instead of the ward's own stated constraints.

export const intake: IntakeInput = {
  challenge:
    "Audited hand-hygiene compliance on our two medical wards is 52% against a target of 90%. Compliance drops most at the 'before patient contact' moment and during busy morning rounds. Alcohol-gel dispensers at some bed bays are frequently empty. Staff say they know the WHO 'five moments' but skip them under time pressure; senior doctors are observed to model it inconsistently, and juniors follow their lead.",
  targetGroup:
    "Ward nurses, junior doctors, and senior physicians on two 28-bed adult medical wards; also healthcare assistants during personal care.",
  useCase: "Clinical infection-prevention compliance",
  timeline: "Show measurable improvement before the next quarterly infection-control audit (about 3 months).",
  stakeholders: [
    { role: "Infection Prevention & Control Nurse" },
    { role: "Ward Manager" },
    { role: "Consultant Physician (clinical lead)" },
    { role: "Junior Doctor representative" },
    { role: "Facilities / supplies coordinator" },
  ],
  documents: [
    {
      filename: "audit-summary.md",
      text: [
        "# Hand-hygiene audit (last cycle, direct observation, n=300 opportunities)",
        "- Overall compliance: 52%",
        "- Moment 1 (before patient contact): 41%",
        "- Moment 4 (after patient contact): 74%",
        "- Compliance during 08:00-11:00 rounds: 38%; rest of day: 61%",
        "- 6 of 56 bed-bay dispensers found empty during spot checks",
        "Observers note compliance is higher when a senior visibly gels first.",
      ].join("\n"),
    },
    {
      filename: "staff-comments.txt",
      text: "Free-text from a staff pulse: 'gel runs out and I don't have time to hunt for a refill'; 'on rounds you're three patients behind before you know it'; 'if the consultant doesn't do it, it feels awkward to stop the round'. HCAs report they were never included in the last training.",
    },
  ],
};

export const envelope: ResourceEnvelope = {
  budget: "Modest — can fund extra dispensers/refills and printed cues; no budget for new staff or an app.",
  people: "IPC nurse one day/week; ward managers can allocate short huddle time.",
  time: "One audit cycle (~3 months) to a re-measure.",
};
