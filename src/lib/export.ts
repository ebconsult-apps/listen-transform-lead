import type { ClarifyOutput, LeverageFull, LeverageTeaser, ResourceEnvelope } from "@/lib/clear/types";
import type { AssumptionGapRow, InterventionCandidateRow, TestCardRow } from "@/lib/db";
import {
  combLabel,
  EVIDENCE_LABEL,
  FLAG_LABEL,
  GATE_LABEL,
  gapFlags,
  GENRE_LABEL,
} from "@/lib/clear/labels";
import { apeaseParked, apeaseSum } from "@/lib/experiment";

export interface ExperimentExport {
  envelope?: ResourceEnvelope;
  candidates?: InterventionCandidateRow[];
  testCards?: TestCardRow[];
  gaps?: AssumptionGapRow[];
}

/** Render the full report as Markdown and trigger a download (export, §8 step 6). */
export function exportReportMarkdown(
  projectName: string,
  clarify: ClarifyOutput,
  teaser: LeverageTeaser,
  full: LeverageFull,
  experiment?: ExperimentExport,
): void {
  const lines: string[] = [];
  const h = (level: number, text: string) => lines.push(`${"#".repeat(level)} ${text}`, "");
  const flagLines = (flags: ReturnType<typeof gapFlags>) =>
    flags.forEach((f) =>
      lines.push(`- **[${FLAG_LABEL[f.type]}]** ${f.content}${f.source ? ` _(${f.source})_` : ""}`),
    );

  h(1, `${projectName} — CLEAR report`);

  // ── Clarify ──
  h(2, "Clarify");
  lines.push(clarify.whyItMatters, "");
  h(3, "Objective");
  lines.push(clarify.objective, "");
  h(3, "Key Results");
  for (const kr of clarify.keyResults) {
    const meta = [
      kr.metric && `metric: ${kr.metric}`,
      kr.baseline && `baseline: ${kr.baseline}`,
      kr.target && `target: ${kr.target}`,
      kr.timeline && `timeline: ${kr.timeline}`,
      kr.owner && `owner: ${kr.owner}`,
      kr.confidence && `confidence: ${kr.confidence}`,
    ]
      .filter(Boolean)
      .join(" · ");
    lines.push(`- **${kr.kr}**${meta ? ` (${meta})` : ""}`);
  }
  lines.push("");
  const clarifyFlags = gapFlags(clarify);
  if (clarifyFlags.length) {
    h(3, "Assumptions & gaps");
    flagLines(clarifyFlags);
    lines.push("");
  }

  // ── Leverage ──
  h(2, "Leverage");
  lines.push(`> ${teaser.headline}`, "");
  h(3, "Systems map summary");
  lines.push(teaser.systemsMapSummary, "");

  h(3, "Top leverage points");
  for (const p of full.topLeveragePoints) {
    lines.push(
      `${p.rank}. **${p.point}** — impact ${p.impact}, ease ${p.ease}, confidence ${p.confidence}%${p.assumptionBased ? " _(assumption-based)_" : ""}`,
    );
    lines.push(`   ${p.currentState}`);
  }
  lines.push("");

  if (full.behaviors?.length) {
    h(3, "Observable behaviors");
    for (const b of full.behaviors) {
      const s = full.behaviorPriorities?.find((x) => x.behaviorId === b.id);
      const score = s ? ` (Effect ${s.effect} · Ease ${s.ease} · Centrality ${s.centrality} · Measurability ${s.measurability})` : "";
      lines.push(`- **${b.description}**${b.genre ? ` [${GENRE_LABEL[b.genre]}]` : ""}${score}`);
    }
    lines.push("");
  }

  if (full.keyActors?.length) {
    h(3, "Key actors & behaviors");
    full.keyActors.forEach((a) => lines.push(`- **${a.actor}** — ${a.behavior}`));
    lines.push("");
  }
  if (full.causeEffect?.length) {
    h(3, "Cause & effect");
    full.causeEffect.forEach((e) =>
      lines.push(`- ${e.from} →${e.polarity ? ` (${e.polarity})` : ""} ${e.to}${e.note ? ` — ${e.note}` : ""}`),
    );
    lines.push("");
  }
  if (full.loops?.length) {
    h(3, "Reinforcing loops");
    full.loops.forEach((l) => lines.push(`- ${l}`));
    lines.push("");
  }

  h(3, "COM-B barrier analysis");
  lines.push("| Component | Barrier | Impact × Changeability | Evidence |", "| --- | --- | --- | --- |");
  for (const c of full.comb) {
    const ev = c.evidenceFlag ? `${EVIDENCE_LABEL[c.evidenceFlag] ?? c.evidenceFlag}${c.source ? ` — ${c.source}` : ""}` : "—";
    lines.push(`| ${combLabel(c)} | ${c.barrier} | ${c.impact ?? "—"} × ${c.changeability ?? "—"} | ${ev} |`);
  }
  lines.push("");

  if (full.strongestBarriers?.length) {
    h(3, "Strongest barriers");
    full.strongestBarriers.forEach((b) =>
      lines.push(`- **${b.barrier}** _(${combLabel(b)})_ — ${b.rationale}`),
    );
    lines.push("");
  }

  h(3, "Why each lever works");
  for (const b of full.barrierNarratives) {
    lines.push(`- **${b.point}** — ${b.narrative}`);
  }
  lines.push("");

  h(3, "Gap log");
  flagLines(gapFlags(full));
  lines.push("");
  h(3, "Discovery activities");
  full.discoveryActivities.forEach((d) => lines.push(`- ${d}`));
  lines.push("");

  // ── Experiment (optional) ──
  if (experiment) {
    h(2, "Experiment");
    const env = experiment.envelope ?? {};
    h(3, "Resource envelope");
    lines.push(
      `- Budget: ${env.budget || "—"}`,
      `- People: ${env.people || "—"}`,
      `- Time: ${env.time || "—"}`,
      "",
    );

    const candidates = experiment.candidates ?? [];
    const survivors = candidates.filter((c) => !(c.parked || apeaseParked(c.apease)));
    const parked = candidates.filter((c) => c.parked || apeaseParked(c.apease));
    if (survivors.length) {
      h(3, "Intervention candidates (APEASE survivors)");
      lines.push(
        "| Intervention | Barrier | E | P | A | Sum | Acceptability | Safety | Equity |",
        "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
      );
      for (const c of survivors) {
        const a = c.apease;
        lines.push(
          `| ${c.title} | ${c.barrier ?? "—"} | ${a.effectiveness} | ${a.practicability} | ${a.affordability} | ${apeaseSum(a)} | ${GATE_LABEL[a.acceptability]} | ${GATE_LABEL[a.safety]} | ${GATE_LABEL[a.equity]} |`,
        );
      }
      lines.push("");
    }
    if (parked.length) {
      h(3, "Parked (failed an APEASE veto gate)");
      parked.forEach((c) => lines.push(`- **${c.title}** — ${c.apease.notes ?? "vetoed"}`));
      lines.push("");
    }

    const cards = experiment.testCards ?? [];
    if (cards.length) {
      h(3, "Test cards");
      for (const t of cards) {
        h(4, t.leverage_point || t.action || "Test card");
        lines.push(
          `- **Hypothesis:** ${t.hypothesis ?? "—"}`,
          `- **Action:** ${t.action ?? "—"}`,
          `- **Metric:** ${t.metric ?? "—"}`,
          `- **Threshold:** ${t.threshold ?? "—"}`,
          `- **Duration:** ${t.duration ?? "—"}`,
          `- **Risk:** ${t.risk_level ?? "—"}`,
          `- **KR:** ${t.kr_ref ?? "—"}`,
          t.ethics_notes ? `- **Ethics:** ${t.ethics_notes}` : "",
          "",
        );
      }

      h(3, "Execution calendar");
      lines.push("| Week | Test | Owner | Status |", "| --- | --- | --- | --- |");
      for (const t of [...cards].sort((a, b) => (a.calendar_week ?? 99) - (b.calendar_week ?? 99))) {
        lines.push(`| ${t.calendar_week ?? "—"} | ${t.leverage_point || t.action || "—"} | ${t.owner_role ?? "—"} | ${t.status} |`);
      }
      lines.push("");
    }

    const openGaps = (experiment.gaps ?? []).filter((g) => g.status !== "resolved");
    if (openGaps.length) {
      h(3, "Open assumptions & gaps");
      openGaps.forEach((g) =>
        lines.push(`- **[${FLAG_LABEL[g.flag_type]}]** ${g.content}${g.source ? ` _(${g.source})_` : ""}`),
      );
      lines.push("");
    }
  }

  const blob = new Blob([lines.filter((l) => l !== undefined).join("\n")], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${projectName.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-clear-report.md`;
  a.click();
  URL.revokeObjectURL(url);
}
