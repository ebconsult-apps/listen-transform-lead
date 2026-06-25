import type { CauseEffectEdge, KeyActor } from "@/lib/clear/types";

/** Key actors + the cause-and-effect adjacency list (with loops, if any). */
const CauseEffectList = ({
  actors,
  edges,
  loops,
}: {
  actors: KeyActor[];
  edges: CauseEffectEdge[];
  loops?: string[];
}) => {
  return (
    <div className="space-y-5">
      {actors.length > 0 && (
        <div>
          <h4 className="font-semibold text-sm uppercase tracking-wide text-foreground/50 mb-2">
            Key actors &amp; behaviors
          </h4>
          <ul className="space-y-1.5 text-sm text-foreground/80">
            {actors.map((a, i) => (
              <li key={i}>
                <span className="font-medium">{a.actor}</span>: {a.behavior}
              </li>
            ))}
          </ul>
        </div>
      )}

      {edges.length > 0 && (
        <div>
          <h4 className="font-semibold text-sm uppercase tracking-wide text-foreground/50 mb-2">
            Cause &amp; effect
          </h4>
          <ul className="space-y-1.5 text-sm text-foreground/80">
            {edges.map((e, i) => (
              <li key={i} className="flex items-baseline gap-2">
                <span className="font-mono text-xs text-foreground/45">
                  {e.from} →{e.polarity ? ` (${e.polarity})` : ""} {e.to}
                </span>
                {e.note && <span className="text-foreground/55">({e.note})</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {loops && loops.length > 0 && (
        <div>
          <h4 className="font-semibold text-sm uppercase tracking-wide text-foreground/50 mb-2">
            Reinforcing loops
          </h4>
          <ul className="space-y-1.5 list-disc pl-5 text-sm text-foreground/80">
            {loops.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CauseEffectList;
