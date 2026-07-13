import type { IntakeInput, ResourceEnvelope } from "../../supabase/functions/_shared/clear/types.ts";

// Fixture 1 — B2B SaaS trial-to-paid churn. Concrete baseline numbers are embedded
// in the intake so the harness can check the report grounds its claims in THEM
// (and flags, rather than invents, the metrics the intake leaves blank).

export const intake: IntakeInput = {
  challenge:
    "Our project-management SaaS converts only 6% of free trials to paid. Most trials never create a second project after signup: 71% of trial accounts never invite a teammate, and activation (first shared board) sits at 22%. Sales says the product is 'too quiet' in week one; support sees repeated confusion at the workspace-setup step. We want more trials to become paying teams without discounting.",
  targetGroup:
    "Team leads (5-30 person teams) who start a free trial, mostly first-time users of a dedicated PM tool, migrating off spreadsheets or Trello.",
  useCase: "SaaS trial-to-paid conversion",
  timeline: "Improve within two quarters (before the annual pricing change).",
  stakeholders: [
    { role: "Head of Growth" },
    { role: "Product Manager, Activation" },
    { role: "Customer Support Lead" },
    { role: "Founding Engineer" },
  ],
  documents: [
    {
      filename: "trial-funnel-q2.md",
      text: [
        "# Trial funnel (last 90 days)",
        "- Signups: 4,120",
        "- Created a first project: 2,240 (54%)",
        "- Invited a teammate: 1,190 (29% of signups)",
        "- Created a shared board (activation): 910 (22%)",
        "- Converted to paid: 247 (6.0%)",
        "Notes: drop-off concentrates between signup and 'first shared board'.",
        "The workspace-setup wizard has 7 steps; median time-to-first-project is 3 days.",
        "Trials that invite a teammate in the first 48h convert at 19% vs 3% otherwise.",
      ].join("\n"),
    },
    {
      filename: "support-themes.txt",
      text: "Top trial support tickets: (1) 'How do I add my team?' (2) 'Where did my imported cards go?' (3) 'Can I try it solo first?'. Reps note users often set up alone, then never return to invite others. No in-product prompt to invite after the first project is created.",
    },
  ],
};

export const envelope: ResourceEnvelope = {
  budget: "No new paid tooling this quarter; existing analytics + in-app messaging only.",
  people: "One PM at ~30%, one engineer at ~50% for 6 weeks.",
  time: "6-week window before the next growth review.",
};
