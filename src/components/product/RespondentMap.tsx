import type { LeverageTeaser } from "@/lib/clear/types";
import type { ReactionValue } from "@/lib/db";
import ReactionChips from "./ReactionChips";

export interface PointReaction {
  reaction?: ReactionValue;
  note?: string;
}

/**
 * Read-only rendering of the current Goals & Leverage map for a respondent, with a
 * reaction control under each leverage point. Parallel to the (closed) LeverageTable
 * used in the owner report — here the focus is listening, so impact/ease badges are
 * omitted and each point gets a reaction + optional note instead.
 */
const RespondentMap = ({
  teaser,
  reactions,
  disabled,
  onChange,
}: {
  teaser: LeverageTeaser;
  reactions: Record<number, PointReaction>;
  disabled?: boolean;
  onChange: (rank: number, next: PointReaction) => void;
}) => (
  <div className="space-y-5">
    <div>
      <h4 className="font-semibold text-sm uppercase tracking-wide text-foreground/50 mb-2">
        Where the thinking is now
      </h4>
      <p className="body-md">{teaser.systemsMapSummary}</p>
    </div>

    <div className="space-y-4">
      {teaser.topLeveragePoints.map((p) => {
        const r = reactions[p.rank] ?? {};
        return (
          <div key={p.rank} className="border border-border rounded-xl p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 h-7 w-7 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
                {p.rank}
              </div>
              <div className="flex-grow">
                <h5 className="font-semibold text-foreground">{p.point}</h5>
                <p className="text-sm text-foreground/70 mt-1">{p.currentState}</p>
                {!disabled && (
                  <div className="mt-3 space-y-2">
                    <ReactionChips
                      value={r.reaction}
                      onChange={(v) => onChange(p.rank, { ...r, reaction: v })}
                    />
                    {r.reaction && (
                      <textarea
                        rows={2}
                        className="input"
                        placeholder="Add a note (optional)"
                        value={r.note ?? ""}
                        onChange={(e) => onChange(p.rank, { ...r, note: e.target.value })}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default RespondentMap;
