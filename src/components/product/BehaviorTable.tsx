import type { Behavior, BehaviorPriority } from "@/lib/clear/types";
import { GENRE_LABEL } from "@/lib/clear/labels";

/** Observable behaviors + their relative 1–5 prioritization scores. */
const BehaviorTable = ({
  behaviors,
  priorities,
}: {
  behaviors: Behavior[];
  priorities: BehaviorPriority[];
}) => {
  const scoreFor = (id: string) => priorities.find((p) => p.behaviorId === id);
  return (
    <div className="space-y-4">
      {behaviors.map((b) => {
        const s = scoreFor(b.id);
        const params = [
          b.who && `Who: ${b.who}`,
          b.doesWhat && `Does: ${b.doesWhat}`,
          b.when && `When: ${b.when}`,
          b.where && `Where: ${b.where}`,
          b.howOften && `How often: ${b.howOften}`,
          b.withWhom && `With whom: ${b.withWhom}`,
        ].filter(Boolean) as string[];
        return (
          <div key={b.id} className="border border-border rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="font-medium">{b.description}</p>
              {b.genre && (
                <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-secondary text-foreground/60 whitespace-nowrap">
                  {GENRE_LABEL[b.genre]}
                </span>
              )}
            </div>
            {params.length > 0 && (
              <p className="text-xs text-foreground/55 mt-1.5">{params.join(" · ")}</p>
            )}
            {s && (
              <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-xs text-foreground/70">
                <span>Effect <b>{s.effect}</b></span>
                <span>Ease <b>{s.ease}</b></span>
                <span>Centrality <b>{s.centrality}</b></span>
                <span>Measurability <b>{s.measurability}</b></span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BehaviorTable;
