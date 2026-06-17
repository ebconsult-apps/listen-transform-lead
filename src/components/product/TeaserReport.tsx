import type { LeverageTeaser } from "@/lib/clear/types";
import LeverageTable from "./LeverageTable";
import LeveragePriorityMap from "./LeveragePriorityMap";

/** Free Leverage teaser: systems map + priority map + top 3 leverage points. */
const TeaserReport = ({ teaser }: { teaser: LeverageTeaser }) => {
  return (
    <div className="space-y-6">
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
          Leverage priority map
        </h4>
        <LeveragePriorityMap points={teaser.topLeveragePoints} />
        <h4 className="font-semibold text-sm uppercase tracking-wide text-foreground/50 mb-3 mt-8">
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
