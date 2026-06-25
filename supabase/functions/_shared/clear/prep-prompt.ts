// "Prep your input" prompt builder (respondent side) — Deno/edge runtime.
//
// Used by `invite-respondents` (to embed a ready-made prompt in the invitation
// email) and by `respondent` (to surface it on the /respond/:token portal). It
// hands an invited stakeholder a prompt they can paste into their OWN AI tool to
// turn their notes/documents into a clear, honest contribution — a concrete
// account from where they sit, aligned to the portal's guided questions
// (perspective / barriers / ideas). It deliberately leaves the framework analysis
// (sorting barriers into COM-B, screening ideas) to the LEVERAGE engine that
// consumes the response; the secondary AI only helps the stakeholder say what
// they actually know.
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
  return `You're helping me prepare my input as a stakeholder for a CLEAR behavioural-change project. The team's analysis engine will work from what I write — so the most useful thing I can give it is an honest, concrete account from where I sit, not a polished analysis. I can attach my own notes, emails, or documents.

Don't invent anything — if you're unsure, say so rather than guessing. Help me capture what I actually know; leave the framework analysis to the team's engine.

CONTEXT
${context}

YOUR TASK
Using anything I attach and your own questions to me, help me write a clear, honest contribution of under ~600 words covering:
1. My perspective — how I actually see this challenge from where I sit
2. What gets in the way — the real friction and what helps, described plainly with concrete examples or incidents I've seen (no need to sort it into categories — just tell it straight)
3. Any ideas I have — noted as ideas for the team to weigh, not worked-up proposals
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
  return `Du hjälper mig att förbereda mitt bidrag som intressent till ett CLEAR-projekt om beteendeförändring. Teamets analysmotor utgår från det jag skriver — så det mest användbara jag kan ge den är en ärlig, konkret beskrivning utifrån där jag står, inte en färdig analys. Jag kan bifoga mina egna anteckningar, mejl eller dokument.

Hitta inte på något — om du är osäker, säg det i stället för att gissa. Hjälp mig att fånga det jag faktiskt vet; lämna ramverksanalysen till teamets motor.

KONTEXT
${context}

DIN UPPGIFT
Använd det jag bifogar och dina egna frågor till mig för att hjälpa mig skriva ett tydligt och ärligt bidrag på under ~600 ord som täcker:
1. Mitt perspektiv — hur jag faktiskt ser på utmaningen utifrån där jag står
2. Vad som står i vägen — den verkliga friktionen och vad som hjälper, beskrivet rakt på sak med konkreta exempel eller händelser jag sett (du behöver inte sortera det i kategorier — säg det bara som det är)
3. Eventuella idéer jag har — noterade som idéer för teamet att väga, inte färdiga förslag
4. Allt jag tror att det nuvarande tänkandet missar eller har fel om

Håll det konkret och förankrat i det jag vet. Jag klistrar in detta i svarsformuläret.`;
}

/** Build the respondent "prep your input" prompt in the requested language. */
export function buildRespondentPrepPrompt(ctx: RespondentPrepContext, lang: PrepLang): string {
  return lang === "sv" ? respondentSv(ctx) : respondentEn(ctx);
}
