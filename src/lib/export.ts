import type { ClarifyOutput, LeverageFull, LeverageTeaser } from "@/lib/clear/types";

/** Render the full report as Markdown and trigger a download (export, §8 step 6). */
export function exportReportMarkdown(
  projectName: string,
  clarify: ClarifyOutput,
  teaser: LeverageTeaser,
  full: LeverageFull,
): void {
  const lines: string[] = [];
  const h = (level: number, text: string) => lines.push(`${"#".repeat(level)} ${text}`, "");

  h(1, `${projectName} — CLEAR report`);

  h(2, "Clarify");
  lines.push(clarify.whyItMatters, "");
  h(3, "Objective");
  lines.push(clarify.objective, "");
  h(3, "Key Results");
  for (const kr of clarify.keyResults) {
    const meta = [
      kr.baseline && `baseline: ${kr.baseline}`,
      kr.target && `target: ${kr.target}`,
      kr.confidence && `confidence: ${kr.confidence}`,
    ]
      .filter(Boolean)
      .join(" · ");
    lines.push(`- **${kr.kr}**${meta ? ` (${meta})` : ""}`);
  }
  lines.push("");
  if (clarify.assumptions.length) {
    h(3, "Assumptions");
    clarify.assumptions.forEach((a) => lines.push(`- ${a}`));
    lines.push("");
  }

  h(2, "Leverage");
  lines.push(`> ${teaser.headline}`, "");
  h(3, "Systems map summary");
  lines.push(teaser.systemsMapSummary, "");
  h(3, "Top leverage points");
  for (const p of teaser.topLeveragePoints) {
    lines.push(
      `${p.rank}. **${p.point}** — impact ${p.impact}, ease ${p.ease}, confidence ${p.confidence}%`,
    );
    lines.push(`   ${p.currentState}`);
  }
  lines.push("");

  h(3, "COM-B barrier analysis");
  lines.push("| Factor | Barrier | Evidence |", "| --- | --- | --- |");
  for (const c of full.comb) {
    lines.push(`| ${c.factor} | ${c.barrier} | ${c.evidence ?? "—"} |`);
  }
  lines.push("");

  h(3, "Why each lever works");
  for (const b of full.barrierNarratives) {
    lines.push(`- **${b.point}** — ${b.narrative}`);
  }
  lines.push("");

  h(3, "Gap log");
  full.gapLog.forEach((g) => lines.push(`- ${g}`));
  lines.push("");
  h(3, "Discovery activities");
  full.discoveryActivities.forEach((d) => lines.push(`- ${d}`));
  lines.push("");

  const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${projectName.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-clear-report.md`;
  a.click();
  URL.revokeObjectURL(url);
}
