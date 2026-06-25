import type { CauseEffectEdge, KeyActor } from "@/lib/clear/types";
import { ArrowRight, Repeat } from "lucide-react";

/**
 * Systems map (visual) — the cause→effect graph rendered as polarity-coded
 * causal links (＋ strengthens, − weakens), with the reinforcing loops and key
 * actors that complete the picture. Drop-in replacement for the text
 * `CauseEffectList`; reads the same `causeEffect` / `loops` / `keyActors` data.
 */

const TEAL = "var(--phase-l)";
const AMBER = "var(--phase-a)";

const CauseEffectMap = ({
  actors,
  edges,
  loops,
}: {
  actors: KeyActor[];
  edges: CauseEffectEdge[];
  loops?: string[];
}) => {
  return (
    <div className="space-y-6">
      {edges.length > 0 && (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <h4 className="font-semibold text-sm uppercase tracking-wide text-foreground/50">
              Cause &amp; effect
            </h4>
            <div className="flex items-center gap-3 text-xs text-foreground/50">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: `hsl(${AMBER})` }} />
                strengthens
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: `hsl(${TEAL})` }} />
                weakens
              </span>
            </div>
          </div>
          <div className="space-y-2.5">
            {edges.map((e, i) => {
              const neg = e.polarity === "-";
              const accent = neg ? TEAL : AMBER;
              return (
                <div key={i}>
                  <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2 sm:gap-3">
                    <div className="flex items-center rounded-xl border border-border px-3 py-2.5 text-sm text-foreground/80">
                      {e.from}
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1 px-0.5">
                      <span
                        className="inline-flex items-center justify-center h-5 min-w-[20px] px-1 rounded-md text-xs font-semibold leading-none"
                        style={{ backgroundColor: `hsl(${accent} / 0.15)`, color: `hsl(${accent})` }}
                      >
                        {neg ? "−" : "+"}
                      </span>
                      <ArrowRight className="h-4 w-4" style={{ color: `hsl(${accent})` }} aria-hidden />
                    </div>
                    <div
                      className="flex items-center rounded-xl border border-border border-l-[3px] px-3 py-2.5 text-sm text-foreground/80"
                      style={{ borderLeftColor: `hsl(${accent})` }}
                    >
                      {e.to}
                    </div>
                  </div>
                  {e.note && <p className="text-xs text-foreground/45 mt-1 text-center">{e.note}</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {loops && loops.length > 0 && (
        <div>
          <h4 className="font-semibold text-sm uppercase tracking-wide text-foreground/50 mb-2">
            Reinforcing loops
          </h4>
          <div className="space-y-2">
            {loops.map((l, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 rounded-xl border p-3"
                style={{ backgroundColor: `hsl(${TEAL} / 0.06)`, borderColor: `hsl(${TEAL} / 0.25)` }}
              >
                <Repeat className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: `hsl(${TEAL})` }} aria-hidden />
                <p className="text-sm text-foreground/80">{l}</p>
              </div>
            ))}
          </div>
        </div>
      )}

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
    </div>
  );
};

export default CauseEffectMap;
