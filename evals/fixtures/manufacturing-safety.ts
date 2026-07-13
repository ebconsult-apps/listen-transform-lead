import type { IntakeInput, ResourceEnvelope } from "../../supabase/functions/_shared/clear/types.ts";

// Fixture 3 — manufacturing near-miss reporting. The interesting behaviour here is
// UNDER-reporting: a good report must treat rising reports as a leading indicator,
// not a failure, and must not invent injury statistics the intake never gives.

export const intake: IntakeInput = {
  challenge:
    "At our injection-moulding plant, near-miss reporting is very low (about 4 reports/month across 180 operators) while recordable injuries have crept up. We believe near-misses are happening but not being logged. Operators say the paper form 'takes 15 minutes and goes into a black hole', and some fear that reporting a near-miss reflects badly on their shift's bonus. Supervisors rarely follow up on submitted reports, so nothing visibly changes.",
  targetGroup:
    "Line operators and shift supervisors across three shifts on the moulding floor; ~180 operators, ~12 supervisors.",
  useCase: "Workplace safety / near-miss reporting culture",
  timeline: "Lift reporting and close the loop within one quarter, ahead of the annual HSE review.",
  stakeholders: [
    { role: "Plant HSE Manager" },
    { role: "Shift Supervisor (representative)" },
    { role: "Line Operator (representative)" },
    { role: "Operations Director" },
    { role: "Union safety representative" },
  ],
  documents: [
    {
      filename: "hse-metrics.md",
      text: [
        "# HSE metrics (trailing 12 months)",
        "- Near-miss reports: ~4/month (48 total)",
        "- Recordable injuries: 9 (up from 6 the prior year)",
        "- Reporting channel: triplicate paper form handed to shift supervisor",
        "- Median time from report to any documented action: not tracked",
        "- Shift bonus includes a 'zero-incident' component (details in policy doc, not attached)",
        "Benchmark heard at an industry forum: mature programmes see 10-20 near-misses per recordable injury; we are far below that.",
      ].join("\n"),
    },
    {
      filename: "floor-interviews.txt",
      text: "Notes from six operator interviews: 'the form is by the office, not the line'; 'last time I reported something, I never heard back'; 'lads worry it dents the shift's safety bonus'; 'supervisors are slammed, they don't have time to action them'. One operator suggested a quick tear-off card at each machine.",
    },
  ],
};

export const envelope: ResourceEnvelope = {
  budget: "Can fund printed cards, a whiteboard per line, and small recognition rewards; no capital for a reporting system this quarter.",
  people: "HSE manager part-time on this; supervisors can add a 5-minute item to shift handover.",
  time: "One quarter to a re-measure of reporting rate.",
};
