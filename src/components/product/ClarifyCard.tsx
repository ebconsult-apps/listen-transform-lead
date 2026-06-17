import type { ClarifyOutput } from "@/lib/clear/types";
import { gapFlags } from "@/lib/clear/labels";
import GapFlagList from "./GapFlagList";

/** Read-only Clarify (OKR) display, shown once the owner has approved it. */
const ClarifyCard = ({ clarify }: { clarify: ClarifyOutput }) => {
  return (
    <div className="glass-card p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="phase-chip !h-7 !w-7 !text-xs" style={{ backgroundColor: "hsl(var(--phase-c))" }}>
          C
        </span>
        <h3 className="heading-md">Clarify</h3>
        <span className="ml-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600">
          Approved
        </span>
      </div>
      <p className="body-md mb-5">{clarify.whyItMatters}</p>
      <h4 className="font-semibold text-sm uppercase tracking-wide text-foreground/50 mb-2">Objective</h4>
      <p className="text-lg font-medium mb-5">{clarify.objective}</p>
      <h4 className="font-semibold text-sm uppercase tracking-wide text-foreground/50 mb-3">Key Results</h4>
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
  );
};

export default ClarifyCard;
