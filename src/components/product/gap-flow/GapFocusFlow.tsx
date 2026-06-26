import { useMemo, useState } from "react";
import { Check, ChevronDown, SkipForward } from "lucide-react";
import type { AssumptionGapRow, AssumptionGapStatus, DocumentRow } from "@/lib/db";
import { cn } from "@/lib/utils";
import { FlagBadge } from "../GapFlagList";
import GapEditor from "./GapEditor";
import { sortOpenGaps } from "./priority";
import { STATUS_CLASS, STATUS_LABEL } from "./shared";

type Handlers = {
  busy: boolean;
  onRespond: (id: string, response: string) => void;
  onSetStatus: (id: string, status: AssumptionGapStatus) => void;
  onDelete: (id: string) => void;
  onUpload: (gapId: string, files: FileList) => Promise<void>;
  onRemoveDoc: (docId: string) => Promise<void>;
};

/** Phase · source provenance line, when either is present. */
const Provenance = ({ gap }: { gap: AssumptionGapRow }) =>
  gap.phase || gap.source ? (
    <p className="mt-0.5 text-xs text-foreground/40">
      {gap.phase}
      {gap.phase && gap.source ? " · " : ""}
      {gap.source}
    </p>
  ) : null;

/**
 * One-at-a-time triage for the Open-questions list: the single most important
 * OPEN item is the large focus card (answer / confirm / attach inline); the rest
 * sit in a jumpable "up next" queue; answered & carried items tuck into a
 * collapsed section. Focus is tracked by id with a fallback to the top of the
 * queue, so resolving / carrying / deleting / saving the focused item advances
 * to the next one automatically on refetch — no index math, no flicker.
 */
const GapFocusFlow = ({
  rows,
  docsByGap,
  ...handlers
}: Handlers & {
  rows: AssumptionGapRow[];
  docsByGap: Record<string, DocumentRow[]>;
}) => {
  const [focusId, setFocusId] = useState<string | null>(null);
  const [openDoneId, setOpenDoneId] = useState<string | null>(null);

  const openSorted = useMemo(() => sortOpenGaps(rows), [rows]);
  const done = useMemo(
    () =>
      rows
        .filter((r) => r.status !== "open")
        .sort((a, b) => b.updated_at.localeCompare(a.updated_at)),
    [rows],
  );

  const counts = useMemo(
    () => ({
      open: openSorted.length,
      resolved: rows.filter((r) => r.status === "resolved").length,
      carried: rows.filter((r) => r.status === "carried").length,
    }),
    [openSorted.length, rows],
  );

  const focusGap = openSorted.find((g) => g.id === focusId) ?? openSorted[0];
  const queue = focusGap ? openSorted.filter((g) => g.id !== focusGap.id) : [];

  const handled = counts.resolved + counts.carried;
  const pct = rows.length ? Math.round((handled / rows.length) * 100) : 0;

  const skip = () => {
    if (!focusGap || openSorted.length < 2) return;
    const idx = openSorted.findIndex((g) => g.id === focusGap.id);
    setFocusId(openSorted[(idx + 1) % openSorted.length].id);
  };

  return (
    <div className="space-y-5">
      {/* Progress header */}
      <div>
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <p className="text-sm font-medium text-foreground/70">
            {counts.open > 0
              ? `${counts.open} ${counts.open === 1 ? "item needs" : "items need"} your input`
              : "Everything's been handled"}
          </p>
          <span className="text-xs tabular-nums text-foreground/40">{pct}% complete</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden>
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-2.5 flex flex-wrap gap-2 text-xs font-medium">
          <span className={cn("rounded-full px-2.5 py-1", STATUS_CLASS.open)}>{counts.open} open</span>
          <span className={cn("rounded-full px-2.5 py-1", STATUS_CLASS.resolved)}>{counts.resolved} answered</span>
          {counts.carried > 0 && (
            <span className={cn("rounded-full px-2.5 py-1", STATUS_CLASS.carried)}>{counts.carried} carried</span>
          )}
        </div>
      </div>

      {focusGap ? (
        <>
          {/* Focus card — the single most important open item */}
          <div
            key={focusGap.id}
            className="animate-fade-in-up rounded-2xl border-2 border-primary/20 bg-background p-5 shadow-sm"
          >
            <div className="mb-4 flex items-start gap-2.5">
              <FlagBadge type={focusGap.flag_type} />
              <div className="min-w-0 flex-grow">
                <p className="font-medium leading-snug text-foreground">{focusGap.content}</p>
                <Provenance gap={focusGap} />
              </div>
              <span
                className={cn(
                  "inline-flex shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
                  STATUS_CLASS[focusGap.status],
                )}
              >
                {STATUS_LABEL[focusGap.status]}
              </span>
            </div>

            <GapEditor key={focusGap.id} gap={focusGap} docs={docsByGap[focusGap.id] ?? []} {...handlers} />

            {openSorted.length > 1 && (
              <div className="mt-3 flex justify-end">
                <button
                  onClick={skip}
                  className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-foreground/50 transition-colors hover:bg-muted hover:text-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <SkipForward className="h-4 w-4" /> Skip for now
                </button>
              </div>
            )}
          </div>

          {/* Up next — jumpable queue of the remaining open items */}
          {queue.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-foreground/50">
                Up next · {queue.length}
              </h4>
              <ul className="space-y-1.5">
                {queue.map((g) => (
                  <li key={g.id}>
                    <button
                      onClick={() => setFocusId(g.id)}
                      className="flex w-full items-center gap-2.5 rounded-xl border border-border bg-background/40 px-3 py-2.5 text-left transition-colors hover:border-primary/30 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <FlagBadge type={g.flag_type} />
                      <span className="min-w-0 flex-grow truncate text-sm text-foreground/80">{g.content}</span>
                      <span className="shrink-0 text-xs text-foreground/40">
                        {g.response ? "draft saved" : "needs answer"}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        /* Done state — no open items left */
        <div className="animate-fade-in rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-8 text-center">
          <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15">
            <Check className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="text-sm font-medium text-foreground/80">All caught up</p>
          <p className="mt-0.5 text-sm text-foreground/55">Every flagged item is answered or carried forward.</p>
        </div>
      )}

      {/* Answered & carried — collapsed, still editable */}
      {done.length > 0 && (
        <details className="rounded-xl border border-border">
          <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-foreground/60 transition-colors hover:text-foreground/80">
            Answered &amp; carried · {done.length}
          </summary>
          <ul className="space-y-1.5 border-t border-border p-3">
            {done.map((g) => {
              const expanded = openDoneId === g.id;
              return (
                <li key={g.id} className="rounded-xl border border-border bg-background/40 p-3">
                  <button
                    onClick={() => setOpenDoneId(expanded ? null : g.id)}
                    aria-expanded={expanded}
                    className="flex w-full items-start gap-2.5 text-left focus-visible:outline-none"
                  >
                    <FlagBadge type={g.flag_type} />
                    <span className="min-w-0 flex-grow">
                      <span className="block truncate text-sm text-foreground/50 line-through">{g.content}</span>
                    </span>
                    <span
                      className={cn(
                        "inline-flex shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
                        STATUS_CLASS[g.status],
                      )}
                    >
                      {STATUS_LABEL[g.status]}
                    </span>
                    <ChevronDown
                      className={cn("h-4 w-4 shrink-0 text-foreground/40 transition-transform", expanded && "rotate-180")}
                    />
                  </button>
                  {expanded && (
                    <div className="mt-3 border-t border-border pt-3">
                      <GapEditor key={g.id} gap={g} docs={docsByGap[g.id] ?? []} {...handlers} />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </details>
      )}
    </div>
  );
};

export default GapFocusFlow;
