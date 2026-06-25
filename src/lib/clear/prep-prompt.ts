/**
 * "Prep your inputs" prompt builder (owner side).
 *
 * Produces a copy-pasteable prompt the project owner runs in their OWN AI
 * assistant (Claude / ChatGPT / Copilot) over their OWN documents. The assistant
 * returns ONE Markdown evidence pack — raw, sourced material organised by CLEAR
 * phase — that the owner uploads back into the intake. It deliberately does NOT
 * perform the analysis: the secondary AI gathers and sources evidence, leaving
 * the OKRs, barrier diagnosis and experiment design to the CLARIFY / LEVERAGE /
 * EXPERIMENT engine that consumes the upload.
 *
 * Deterministic and dependency-free: no LLM call, no token cost, no data leaves
 * the app (the prompt is just text). The respondent-side counterpart lives in the
 * _shared/clear tree (Deno) for the edge runtime.
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
  const context = contextBlock(ctx, {
    challenge: "Challenge",
    targetGroup: "Target group",
    useCase: "Use case",
    timeline: "Timeline",
    stakeholders: "Key stakeholders",
  });
  return `You are helping me prepare the source material for a behavioural-change analysis that runs on the CLEAR framework (Clarity, Leverage, Experimentation). The analysis itself is done by a separate system — your job is NOT to do the analysis, but to give that system the cleanest, best-organised evidence to work from. I will attach my own documents and data to this conversation.

Do the gathering, not the thinking. Don't write objectives or OKRs, don't diagnose or rank barriers, don't design or score interventions — that is the analysis engine's job, and it does it better reasoning from raw evidence than from someone else's conclusions. Your job is to extract, organise and source what my material actually contains.

Never invent facts, numbers, or quotes. When my material doesn't contain something, say so and list it as a gap — don't fill the hole.

CONTEXT
${context}

YOUR TASK
Read everything I attach. Produce ONE Markdown file — an evidence pack — that I can download and upload into my CLEAR project. Organise it into the three sections below. Each section gathers the evidence one phase of the analysis will need; it does NOT pre-empt that phase's conclusions. Quote my material directly where you can, and cite the source document for every figure or quote.

clear-evidence-pack.md

## 1. Goals & success signals  (raw material for the CLARIFY phase)
   - The goals, mandates and definitions of success stated in my material — in my own words, quoted, with source. Don't compose an objective or key results; just surface what is already stated.
   - Every metric, KPI, baseline, target, rate or trend that actually appears in my documents, with the number and where it came from.
   - Why this matters now, and any deadline or time pressure mentioned.
   - Gaps: goals or numbers that are implied but not stated (e.g. a target is referenced but no baseline is given).

## 2. The system, behaviours & friction  (raw material for the LEVERAGE phase)
   - A plain-language description of how things currently work and who is involved — the actors and their roles, drawn from my material.
   - The observable behaviours my material describes — who does what, when, where, how often, with whom — reported as they appear, not interpreted. Do NOT sort them into categories or frameworks; the engine does that.
   - Direct quotes and data points about what gets in the way, what people complain about, and what already works — verbatim where possible, each with its source.
   - What has been tried before and what happened.
   - Gaps: behaviours or causes that seem important but aren't evidenced in my material.

## 3. Constraints, resources & ideas on the table  (raw material for the EXPERIMENT phase)
   - The resource envelope as stated: the budget, people and time available.
   - Any constraints that bound what's feasible — regulatory, brand, safety, equity, technical, political — and anything explicitly off-limits.
   - Any intervention ideas people have ALREADY proposed, captured verbatim and labelled "proposed idea (unscreened)". Don't screen, score or rank them — just record them so the engine can evaluate them.
   - Gaps: resource or constraint information the analysis will need but my material doesn't give (e.g. no budget stated).

FORMAT
- One Markdown file, roughly under 2,500 words. Use the three section headings above.
- Plain language. Cite the source document for every figure or quote. No preamble or sign-off outside the file.

When you're done, I'll upload this evidence pack into my CLEAR project so the analysis works from the sharpest possible source material.`;
}

function ownerSv(ctx: OwnerPrepContext): string {
  const context = contextBlock(ctx, {
    challenge: "Utmaning",
    targetGroup: "Målgrupp",
    useCase: "Användningsfall",
    timeline: "Tidsram",
    stakeholders: "Viktiga intressenter",
  });
  return `Du hjälper mig att förbereda källmaterialet för en beteendeförändringsanalys som körs med CLEAR-ramverket (Clarity, Leverage, Experimentation). Själva analysen görs av ett separat system — din uppgift är INTE att göra analysen, utan att ge det systemet det renaste, bäst organiserade underlaget att arbeta utifrån. Jag bifogar mina egna dokument och data i den här konversationen.

Samla in, tänk inte åt systemet. Skriv inga mål eller OKR:er, diagnostisera eller rangordna inga hinder, utforma eller poängsätt inga interventioner — det är analysmotorns jobb, och den gör det bättre när den resonerar utifrån rådata än utifrån någon annans slutsatser. Din uppgift är att extrahera, organisera och källhänvisa det som mitt material faktiskt innehåller.

Hitta aldrig på fakta, siffror eller citat. När mitt material inte innehåller något, säg det och notera det som en lucka — fyll inte hålet.

KONTEXT
${context}

DIN UPPGIFT
Läs allt jag bifogar. Skapa EN Markdown-fil — en underlagssammanställning — som jag kan ladda ner och ladda upp i mitt CLEAR-projekt. Dela in den i de tre avsnitten nedan. Varje avsnitt samlar in det underlag som en fas av analysen behöver; det föregriper INTE den fasens slutsatser. Citera mitt material direkt där du kan, och ange källdokumentet för varje siffra eller citat.

clear-evidence-pack.md

## 1. Mål & framgångssignaler  (råmaterial för CLARITY-fasen)
   - De mål, uppdrag och definitioner av framgång som anges i mitt material — med mina egna ord, citerade, med källa. Formulera inget mål eller nyckelresultat; lyft bara fram det som redan är uttalat.
   - Varje mått, KPI, utgångsläge, mål, andel eller trend som faktiskt förekommer i mina dokument, med siffran och var den kommer ifrån.
   - Varför detta är viktigt nu, och eventuell deadline eller tidspress som nämns.
   - Luckor: mål eller siffror som antyds men inte anges (t.ex. ett mål nämns men inget utgångsläge anges).

## 2. Systemet, beteenden & friktion  (råmaterial för LEVERAGE-fasen)
   - En beskrivning på vanligt språk av hur saker fungerar idag och vilka som är inblandade — aktörerna och deras roller, hämtat ur mitt material.
   - De observerbara beteenden mitt material beskriver — vem gör vad, när, var, hur ofta, med vem — återgivna som de framträder, inte tolkade. Sortera dem INTE i kategorier eller ramverk; det gör motorn.
   - Direkta citat och datapunkter om vad som står i vägen, vad folk klagar på och vad som redan fungerar — ordagrant där det går, var och en med sin källa.
   - Vad som har provats tidigare och vad som hände.
   - Luckor: beteenden eller orsaker som verkar viktiga men saknar stöd i mitt material.

## 3. Begränsningar, resurser & idéer på bordet  (råmaterial för EXPERIMENT-fasen)
   - Resursramen som den anges: budget, personer och tid som finns tillgängliga.
   - Eventuella begränsningar som avgränsar vad som är genomförbart — regulatoriska, varumärkesmässiga, säkerhet, rättvisa, tekniska, politiska — och allt som uttryckligen är uteslutet.
   - Eventuella interventionsidéer som folk REDAN har föreslagit, ordagrant återgivna och märkta "föreslagen idé (osållad)". Sålla, poängsätt eller rangordna dem inte — notera dem bara så att motorn kan utvärdera dem.
   - Luckor: resurs- eller begränsningsinformation som analysen behöver men mitt material inte ger (t.ex. ingen budget anges).

FORMAT
- En Markdown-fil, ungefär under 2 500 ord. Använd de tre rubrikerna ovan.
- Vanligt språk. Ange källdokumentet för varje siffra eller citat. Ingen inledning eller avslutning utanför filen.

När du är klar laddar jag upp den här underlagssammanställningen i mitt CLEAR-projekt så att analysen arbetar utifrån skarpast möjliga källmaterial.`;
}

/** Build the owner "prep your inputs" prompt in the requested language. */
export function buildOwnerPrepPrompt(ctx: OwnerPrepContext, lang: PrepLang): string {
  return lang === "sv" ? ownerSv(ctx) : ownerEn(ctx);
}
