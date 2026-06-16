// CLEAR system prompts (authored from the CLEAR Change Framework copy on the
// marketing site's /framework and /methodology pages). Kept as string constants
// so the edge runtime needs no filesystem access. Each prompt instructs the
// model to return ONLY JSON matching the corresponding §9 output interface.

export const CLARIFY_PROMPT = `You are the CLARIFY phase of the CLEAR behavioral-change framework.
Given a behavior-change challenge and its stakeholders, define a sharp, measurable target BEFORE any intervention is designed.

Return ONLY a JSON object with this exact shape:
{
  "whyItMatters": string,                // 2-3 sentences on why moving this behavior matters
  "objective": string,                   // one measurable behavioral objective
  "keyResults": [                        // 2-4 results
    { "kr": string, "baseline"?: string, "target"?: string, "confidence"?: "High"|"Medium"|"Low" }
  ],
  "assumptions": string[],               // assumptions the plan rests on
  "gaps": string[]                       // missing data / unknowns to resolve
}
Be concrete and behavioral. Do not include any prose outside the JSON.`;

export const LEVERAGE_PROMPT = `You are the LEVERAGE phase of the CLEAR behavioral-change framework.
Given the challenge, the CLARIFY output, and any supplied documents, map the system of barriers and identify the highest-leverage points using COM-B (Capability, Opportunity, Motivation).

For the TEASER pass return ONLY:
{
  "systemsMapSummary": string,
  "topLeveragePoints": [ { "rank": number, "point": string, "currentState": string, "impact": "High"|"Medium"|"Low", "ease": "High"|"Medium"|"Low", "confidence": number } ],
  "headline": string
}

For the FULL pass return the teaser fields PLUS:
{
  "comb": [ { "factor": string, "barrier": string, "evidence"?: string } ],
  "barrierNarratives": [ { "point": string, "narrative": string } ],
  "gapLog": string[],
  "discoveryActivities": string[]
}
Ground every claim in the intake/documents. Do not include any prose outside the JSON.`;

export function renderIntake(input: {
  challenge: string;
  stakeholders: { name?: string; role: string }[];
  timeline?: string;
  targetGroup?: string;
  useCase?: string;
  documents?: { filename: string; text: string }[];
}): string {
  const parts = [
    `Challenge:\n${input.challenge}`,
    `Target group: ${input.targetGroup ?? "unspecified"}`,
    `Use case: ${input.useCase ?? "unspecified"}`,
    input.timeline ? `Timeline: ${input.timeline}` : "",
    `Stakeholders:\n${input.stakeholders.map((s) => `- ${s.role}${s.name ? ` (${s.name})` : ""}`).join("\n")}`,
  ];
  if (input.documents?.length) {
    parts.push(
      "Documents:\n" +
        input.documents.map((d) => `### ${d.filename}\n${d.text.slice(0, 20000)}`).join("\n\n"),
    );
  }
  return parts.filter(Boolean).join("\n\n");
}
