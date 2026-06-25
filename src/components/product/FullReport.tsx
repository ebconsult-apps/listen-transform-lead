import type { LeverageFull } from "@/lib/clear/types";
import { combLabel, gapFlags } from "@/lib/clear/labels";
import CombMatrix from "./CombMatrix";
import BehaviorTable from "./BehaviorTable";
import CauseEffectMap from "./CauseEffectMap";
import GapFlagList from "./GapFlagList";
import ResearchGapsPanel from "./ResearchGapsPanel";

/**
 * Paid Leverage sections: the full methodology chain — observable behaviors and
 * their prioritization, systems map (actors + cause/effect), COM-B barrier
 * matrix with evidence provenance, the strongest barriers, why each lever works,
 * discovery activities, and the flagged gap log.
 */
const FullReport = ({
  full,
  projectId,
  entitled = false,
}: {
  full: LeverageFull;
  /** Provided in-app to surface the "Research these open questions" panel. */
  projectId?: string;
  entitled?: boolean;
}) => {
  const behaviors = full.behaviors ?? [];
  const strongest = full.strongestBarriers ?? [];
  const flags = gapFlags(full);

  return (
    <div className="space-y-6">
      {/* Behaviors + prioritization */}
      {behaviors.length > 0 && (
        <div className="glass-card p-6 sm:p-8">
          <h3 className="heading-md mb-1">Observable behaviors</h3>
          <p className="text-sm text-foreground/50 mb-4">
            Verb-led behaviors, scored 1–5 (relative) on Effect · Ease · Centrality · Measurability.
          </p>
          <BehaviorTable behaviors={behaviors} priorities={full.behaviorPriorities ?? []} />
        </div>
      )}

      {/* Systems map: actors + cause/effect + loops */}
      {((full.keyActors?.length ?? 0) > 0 || (full.causeEffect?.length ?? 0) > 0) && (
        <div className="glass-card p-6 sm:p-8">
          <h3 className="heading-md mb-4">Systems map</h3>
          <CauseEffectMap
            actors={full.keyActors ?? []}
            edges={full.causeEffect ?? []}
            loops={full.loops}
          />
        </div>
      )}

      {/* COM-B */}
      <div className="glass-card p-6 sm:p-8">
        <h3 className="heading-md mb-1">COM-B barrier analysis</h3>
        <p className="text-sm text-foreground/50 mb-4">
          Each cell carries an evidence flag (Verified, Assumption, or Gap) so no assessment reads
          as fact without provenance.
        </p>
        <CombMatrix cells={full.comb ?? []} />
      </div>

      {/* Strongest barriers */}
      {strongest.length > 0 && (
        <div className="glass-card p-6 sm:p-8">
          <h3 className="heading-md mb-4">Strongest barriers</h3>
          <div className="space-y-4">
            {strongest.map((b, i) => (
              <div key={i} className="border-l-2 border-rose-400/40 pl-4">
                <p className="font-semibold">
                  {b.barrier}
                  <span className="ml-2 text-xs font-normal text-foreground/45">{combLabel(b)}</span>
                </p>
                <p className="text-sm text-foreground/70 mt-1">{b.rationale}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Barrier narratives */}
      <div className="glass-card p-6 sm:p-8">
        <h3 className="heading-md mb-4">Why each lever works</h3>
        <div className="space-y-4">
          {full.barrierNarratives.map((b, i) => (
            <div key={i} className="border-l-2 border-primary/30 pl-4">
              <p className="font-semibold">{b.point}</p>
              <p className="text-sm text-foreground/70 mt-1">{b.narrative}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Gap log + discovery */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card p-6 sm:p-8">
          <h3 className="heading-md mb-4">Gap log</h3>
          <GapFlagList flags={flags} />
        </div>
        <div className="glass-card p-6 sm:p-8">
          <h3 className="heading-md mb-4">Discovery activities</h3>
          <ul className="space-y-2 list-disc pl-5 text-sm text-foreground/80">
            {full.discoveryActivities.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
      </div>

      {projectId && (
        <ResearchGapsPanel projectId={projectId} entitled={entitled} phase="leverage_full" />
      )}
    </div>
  );
};

export default FullReport;
