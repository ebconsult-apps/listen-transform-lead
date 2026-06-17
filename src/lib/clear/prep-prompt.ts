/**
 * "Prep your inputs" prompt builder (owner side).
 *
 * Produces a copy-pasteable prompt the project owner runs in their OWN AI
 * assistant (Claude / ChatGPT / Copilot) over their OWN documents. The assistant
 * returns three Markdown briefs — one per CLEAR phase — that the owner uploads
 * back into the intake, maximising the quality of the inputs the CLARIFY /
 * LEVERAGE / EXPERIMENT engine consumes.
 *
 * Deterministic and dependency-free: no LLM call, no token cost, no data leaves
 * the app (the prompt is just text). The deliverables mirror the real engine
 * schemas in supabase/functions/_shared/clear/prompts.ts. The respondent-side
 * counterpart lives in that same _shared/clear tree (Deno) for the edge runtime.
 */
import type { IntakeInput } from "./types";

export type PrepLang = "en" | "sv";

/** Just the intake fields the prompt needs — a subset of {@link IntakeInput}. */
export type OwnerPrepContext = Pick<
  IntakeInput,
  "challenge" | "stakeholders" | "timeline" | "targetGroup" | "useCase"
>;

interface ContextLabels {
  challenge: string;
  targetGroup: string;
  useCase: string;
  timeline: string;
  stakeholders: string;
}

/** Render the CONTEXT block, omitting any optional field that's absent. */
function contextBlock(ctx: OwnerPrepContext, labels: ContextLabels): string {
  const stakeholders = ctx.stakeholders
    .map((s) => (s.name ? `${s.role} (${s.name})` : s.role))
    .filter((s) => s && s.trim());
  return [
    `- ${labels.challenge}: ${ctx.challenge}`,
    ctx.targetGroup ? `- ${labels.targetGroup}: ${ctx.targetGroup}` : "",
    ctx.useCase ? `- ${labels.useCase}: ${ctx.useCase}` : "",
    ctx.timeline ? `- ${labels.timeline}: ${ctx.timeline}` : "",
    stakeholders.length ? `- ${labels.stakeholders}: ${stakeholders.join("; ")}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function ownerEn(ctx: OwnerPrepContext): string {
  const group = ctx.targetGroup?.trim() || "the target group";
  const context = contextBlock(ctx, {
    challenge: "Challenge",
    targetGroup: "Target group",
    useCase: "Use case",
    timeline: "Timeline",
    stakeholders: "Key stakeholders",
  });
  return `You are helping me prepare high-quality inputs for a behavioural-change analysis that uses the CLEAR framework (Clarity, Leverage, Experimentation). I will attach my own documents and data to this conversation.

Never invent facts, numbers, or quotes. When my material doesn't contain something, flag it as a gap instead of guessing.

CONTEXT
${context}

YOUR TASK
Read everything I attach. Extract and synthesise only what my material actually supports, then produce THREE separate Markdown files I can download and upload into my CLEAR project — one per phase.

1) clarity-brief.md — CLARITY (a sharp, measurable OKR set)
   - Why this matters: a short rallying paragraph, grounded in my data
   - One overarching, behaviourally-focused objective — what success looks like, not how to get there
   - 3–5 outcome-focused key results, each with a metric, baseline, target, timeline and owning role where my data supports it (leave a field out and record it under gaps if it doesn't)
   - Gaps & unknowns: anything missing, assumed, or needing confirmation

2) leverage-evidence.md — LEVERAGE (diagnose the barriers, don't solve them yet)
   - A plain-language summary of the system around this behaviour and its key actors
   - The observable behaviours that drive the outcome (who does what, when, where, how often, with whom)
   - Barriers and enablers mapped across COM-B — Capability (physical / psychological), Opportunity (physical / social), Motivation (reflective / automatic). For each: the current state, an evidence quote, the source document, and a tag of Verified, Assumption or Gap
   - The 3–5 strongest barriers, and which leverage points look highest-impact versus easiest to change
   - Gaps & unknowns: what discovery is still needed

3) experimentation-options.md — EXPERIMENT (the smallest tests that could work, not a rollout)
   - My resource envelope: the budget, people, and time available
   - For each top leverage point: 2–3 small, preferably reversible interventions, each tied to the named COM-B barrier it addresses
   - Screen every idea with APEASE — score Effectiveness, Practicability and Affordability 1–5, then gate Acceptability, Side-effects/Safety and Equity as pass / flag / fail (any fail parks the idea regardless of score)
   - 3–6 testable hypotheses in the form "If we change X for ${group}, then Y, because Z", each with how I'd measure success
   - Gaps & unknowns

FORMAT
- One Markdown file per deliverable, each under ~2,000 words.
- Cite the source document for every figure or quote. Plain language, no preamble outside the files.

When you're done, I'll upload these files into my CLEAR project so the analysis has the sharpest possible inputs.`;
}

function ownerSv(ctx: OwnerPrepContext): string {
  const group = ctx.targetGroup?.trim() || "målgruppen";
  const context = contextBlock(ctx, {
    challenge: "Utmaning",
    targetGroup: "Målgrupp",
    useCase: "Användningsfall",
    timeline: "Tidsram",
    stakeholders: "Viktiga intressenter",
  });
  return `Du hjälper mig att förbereda underlag av hög kvalitet för en beteendeförändringsanalys som använder CLEAR-ramverket (Clarity, Leverage, Experimentation). Jag bifogar mina egna dokument och data i den här konversationen.

Hitta aldrig på fakta, siffror eller citat. När mitt material inte innehåller något, flagga det som en lucka i stället för att gissa.

KONTEXT
${context}

DIN UPPGIFT
Läs allt jag bifogar. Extrahera och sammanfatta endast det som mitt material faktiskt stödjer, och skapa sedan TRE separata Markdown-filer som jag kan ladda ner och ladda upp i mitt CLEAR-projekt — en per fas.

1) clarity-brief.md — CLARITY (en skarp, mätbar OKR-uppsättning)
   - Varför det här är viktigt: ett kort, samlande stycke förankrat i mina data
   - Ett övergripande, beteendefokuserat mål — hur framgång ser ut, inte hur vi tar oss dit
   - 3–5 utfallsfokuserade nyckelresultat, vart och ett med mått, utgångsläge, mål, tidsram och ansvarig roll där mina data stödjer det (utelämna ett fält och notera det under luckor om de inte gör det)
   - Luckor & osäkerheter: allt som saknas, antas eller behöver bekräftas

2) leverage-evidence.md — LEVERAGE (diagnostisera hindren, lös dem inte ännu)
   - En sammanfattning på vanligt språk av systemet kring beteendet och dess nyckelaktörer
   - De observerbara beteenden som driver utfallet (vem gör vad, när, var, hur ofta, med vem)
   - Hinder och möjliggörare kartlagda enligt COM-B — Capability/Förmåga (fysisk / psykologisk), Opportunity/Möjlighet (fysisk / social), Motivation (reflektiv / automatisk). För varje: nuläge, ett citat som bevis, källdokumentet, och en märkning Verifierad, Antagande eller Lucka
   - De 3–5 starkaste hindren, och vilka hävstångspunkter som ser mest effektfulla ut jämfört med lättast att förändra
   - Luckor & osäkerheter: vilken upptäcktsfas som fortfarande behövs

3) experimentation-options.md — EXPERIMENT (minsta möjliga test, inte en utrullning)
   - Mina resursramar: budget, personer och tid som finns tillgängliga
   - För varje topp-hävstångspunkt: 2–3 små, helst reversibla interventioner, var och en kopplad till det namngivna COM-B-hinder den adresserar
   - Sålla varje idé med APEASE — poängsätt Effekt, Genomförbarhet och Kostnadsbärighet 1–5, grinda sedan Acceptans, Bieffekter/Säkerhet och Rättvisa som pass / flagga / underkänd (en underkänd parkerar idén oavsett poäng)
   - 3–6 testbara hypoteser i formen "Om vi ändrar X för ${group}, så händer Y, eftersom Z", var och en med hur jag skulle mäta framgång
   - Luckor & osäkerheter

FORMAT
- En Markdown-fil per leverabel, var och en under ~2 000 ord.
- Ange källdokumentet för varje siffra eller citat. Vanligt språk, ingen inledning utanför filerna.

När du är klar laddar jag upp dina filer i mitt CLEAR-projekt så att analysen får skarpast möjliga underlag.`;
}

/** Build the owner "prep your inputs" prompt in the requested language. */
export function buildOwnerPrepPrompt(ctx: OwnerPrepContext, lang: PrepLang): string {
  return lang === "sv" ? ownerSv(ctx) : ownerEn(ctx);
}
