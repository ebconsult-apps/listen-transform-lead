import type { ClarifyOutput, LeverageTeaser } from "@/lib/clear/types";
import { gapFlags } from "@/lib/clear/labels";
import LeverageTable from "./LeverageTable";
import GapFlagList from "./GapFlagList";

/** Free teaser: Clarify (objective + KRs) + partial Leverage (systems map + top 3). */
const TeaserReport = ({
  clarify,
  teaser,
}: {
  clarify: ClarifyOutput;
  teaser: LeverageTeaser;
}) => {
  return (
    <div className="space-y-6">
      {/* Clarify */}
      <div className="glass-card p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-4">
          <span
            className="phase-chip !h-7 !w-7 !text-xs"
            style={{ backgroundColor: "hsl(var(--phase-c))" }}
          >
            C
          </span>
          <h3 className="heading-md">Clarify</h3>
        </div>
        <p className="body-md mb-5">{clarify.whyItMatters}</p>
        <h4 className="font-semibold text-sm uppercase tracking-wide text-foreground/50 mb-2">
          Objective
        </h4>
        <p className="text-lg font-medium mb-5">{clarify.objective}</p>
        <h4 className="font-semibold text-sm uppercase tracking-wide text-foreground/50 mb-3">
          Key Results
        </h4>
        <div className="space-y-3">
          {clarify.keyResults.map((kr, i) => (
            <div key={i} className="border border-border rounded-xl p-4">
              <p className="font-medium">{kr.kr}</p>
              <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2 text-sm text-foreground/60">
                {kr.metric && <span>Metric: {kr.metric}</span>}
                {kr.baseline && <span>Baseline: {kr.baseline}</span>}
                {kr.target && <span>Target: {kr.target}</span>}
                {kr.timeline && <span>Timeline: {kr.timeline}</span>}
                {kr.owner && <span>Owner: {kr.owner}</span>}
                {kr.confidence && <span>Confidence: {kr.confidence}</span>}
              </div>
            </div>
          ))}
        </div>
        {gapFlags(clarify).length > 0 && (
          <>
            <h4 className="font-semibold text-sm uppercase tracking-wide text-foreground/50 mb-3 mt-6">
              Assumptions &amp; open questions
            </h4>
            <GapFlagList flags={gapFlags(clarify)} />
          </>
        )}
      </div>

      {/* Leverage teaser */}
      <div className="glass-card p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-4">
          <span
            className="phase-chip !h-7 !w-7 !text-xs"
            style={{ backgroundColor: "hsl(var(--phase-l))" }}
          >
            L
          </span>
          <h3 className="heading-md">Leverage</h3>
        </div>
        <h4 className="font-semibold text-sm uppercase tracking-wide text-foreground/50 mb-2">
          Systems map summary
        </h4>
        <p className="body-md mb-6">{teaser.systemsMapSummary}</p>
        <h4 className="font-semibold text-sm uppercase tracking-wide text-foreground/50 mb-3">
          Top 3 leverage points
        </h4>
        <LeverageTable points={teaser.topLeveragePoints} />
        <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
          <p className="font-medium text-primary">{teaser.headline}</p>
        </div>
      </div>
    </div>
  );
};

export default TeaserReport;
