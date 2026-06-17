// "Prep your input" prompt builder (respondent side) — Deno/edge runtime.
//
// Used by `invite-respondents` (to embed a ready-made prompt in the invitation
// email) and by `respondent` (to surface it on the /respond/:token portal). It
// hands an invited stakeholder a prompt they can paste into their OWN AI tool to
// turn their notes/documents into a concise, honest contribution — aligned to the
// portal's three guided questions (perspective / barriers / ideas) and the COM-B
// lens the LEVERAGE phase uses.
//
// Pure string-building (no Deno APIs, no imports) so it is unit-testable from the
// Node/vitest suite alongside the owner-side builder in src/lib/clear.

export type PrepLang = "en" | "sv";

export interface RespondentPrepContext {
  projectName?: string;
  challenge?: string;
  targetGroup?: string;
  /** The latest leverage-teaser map's ranked points, when a run exists. */
  topLeveragePoints?: { rank: number; point: string }[];
  /** Optional personal note the owner added to the invitation. */
  invitationNote?: string;
}

function pointsList(ctx: RespondentPrepContext): { en: string; sv: string } {
  const points = ctx.topLeveragePoints ?? [];
  if (!points.length) return { en: "", sv: "" };
  const lines = points.map((p, i) => `   ${p.rank ?? i + 1}. ${p.point}`).join("\n");
  return {
    en: `- The team's current top leverage points:\n${lines}`,
    sv: `- Teamets nuvarande främsta hävstångspunkter:\n${lines}`,
  };
}

function respondentEn(ctx: RespondentPrepContext): string {
  const context = [
    ctx.projectName ? `- Project: ${ctx.projectName}` : "",
    ctx.challenge ? `- The challenge being worked on: ${ctx.challenge}` : "",
    ctx.targetGroup ? `- Target group: ${ctx.targetGroup}` : "",
    pointsList(ctx).en,
    ctx.invitationNote ? `- A note from whoever invited me: ${ctx.invitationNote}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  return `You're helping me prepare my input as a stakeholder for a CLEAR behavioural-change project. I can attach my own notes, emails, or documents.

Don't invent anything — if you're unsure about something, say so rather than guessing.

CONTEXT
${context}

YOUR TASK
Using anything I attach and your own reasoning, help me write a clear, honest contribution. Produce a concise brief (under ~600 words) covering:
1. My perspective — how I actually see this challenge from where I sit
2. What gets in the way — the real barriers and enablers, organised by Capability, Opportunity and Motivation (COM-B)
3. What would help — ideas worth testing, and why
4. Anything I think the current thinking is missing or gets wrong

Keep it specific and grounded in what I know. I'll paste this into the response form.`;
}

function respondentSv(ctx: RespondentPrepContext): string {
  const context = [
    ctx.projectName ? `- Projekt: ${ctx.projectName}` : "",
    ctx.challenge ? `- Utmaningen vi arbetar med: ${ctx.challenge}` : "",
    ctx.targetGroup ? `- Målgrupp: ${ctx.targetGroup}` : "",
    pointsList(ctx).sv,
    ctx.invitationNote ? `- En kommentar från den som bjöd in mig: ${ctx.invitationNote}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  return `Du hjälper mig att förbereda mitt bidrag som intressent till ett CLEAR-projekt om beteendeförändring. Jag kan bifoga mina egna anteckningar, mejl eller dokument.

Hitta inte på något — om du är osäker, säg det i stället för att gissa.

KONTEXT
${context}

DIN UPPGIFT
Använd det jag bifogar och ditt eget resonemang för att hjälpa mig skriva ett tydligt och ärligt bidrag. Skapa en kortfattad sammanfattning (under ~600 ord) som täcker:
1. Mitt perspektiv — hur jag faktiskt ser på utmaningen utifrån där jag står
2. Vad som står i vägen — de verkliga hindren och möjliggörarna, ordnade efter Capability/Förmåga, Opportunity/Möjlighet och Motivation (COM-B)
3. Vad som skulle hjälpa — idéer värda att testa, och varför
4. Allt jag tror att det nuvarande tänkandet missar eller har fel om

Håll det konkret och förankrat i det jag vet. Jag klistrar in detta i svarsformuläret.`;
}

/** Build the respondent "prep your input" prompt in the requested language. */
export function buildRespondentPrepPrompt(ctx: RespondentPrepContext, lang: PrepLang): string {
  return lang === "sv" ? respondentSv(ctx) : respondentEn(ctx);
}
