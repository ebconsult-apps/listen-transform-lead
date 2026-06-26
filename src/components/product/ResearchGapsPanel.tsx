import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Lock, Microscope, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { useAssumptionGaps } from "@/hooks/queries/useAssumptionGaps";
import { useFindings, useResearchGaps } from "@/hooks/queries/useResearchGaps";
import { findingsForGap } from "@/lib/research";
import { FlagBadge } from "./GapFlagList";
import ResearchFindingCard from "./ResearchFindingCard";

/**
 * "Research these open questions" — the on-ramp shown wherever the app lists
 * assumptions & gaps. The owner selects one OR several related open questions and
 * researches them together (MECE); the findings are saved to the project and
 * linked back to the gap(s), then shown inline beneath them.
 *
 * Subscriber-gated via `entitled` (= canViewFull): everyone else sees an upsell,
 * so the surface still "pushes for research." Renders nothing when there are no
 * open gaps to research, so it never clutters a surface with nothing to offer.
 *
 * Driven by the persistent assumption_gaps rows (they carry ids + status), not
 * the id-less GapFlag display objects — that's what lets findings link back.
 */
const ResearchGapsPanel = ({
  projectId,
  entitled,
  phase,
  onResearched,
}: {
  projectId: string;
  entitled: boolean;
  /** Limit to one phase's gaps (e.g. "clarify" under the Clarify card). Omit for all. */
  phase?: string;
  /** Called after a successful run, for surfaces holding their own findings state. */
  onResearched?: () => Promise<void> | void;
}) => {
  const { data: gaps = [], isLoading } = useAssumptionGaps(projectId);
  const { data: findings = [] } = useFindings(projectId);
  const research = useResearchGaps(projectId);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const open = gaps.filter((g) => g.status === "open" && (!phase || g.phase === phase));
  if (isLoading || open.length === 0) return null;

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const onResearch = async () => {
    const ids = [...selected];
    if (!ids.length) return;
    try {
      await research.mutateAsync(ids);
      setSelected(new Set());
      await onResearched?.();
      toast.success(
        ids.length > 1
          ? "Research complete — findings linked below."
          : "Research complete — finding linked below.",
      );
    } catch {
      /* useResearchGaps surfaces the error toast */
    }
  };

  return (
    <div className="rounded-xl border border-primary/15 bg-primary/[0.03] p-4 sm:p-5 no-print">
      <div className="flex items-center gap-2">
        <Microscope className="h-4 w-4 text-primary shrink-0" />
        <h4 className="font-semibold text-sm">Research these open questions</h4>
      </div>
      <p className="text-sm text-foreground/60 mt-1 mb-4">
        {entitled
          ? "Select one or more related questions and research them together — you'll get cited findings that cover them without overlap, saved to this project."
          : "Turn these assumptions into cited, sourced evidence. Research is included with any paid plan."}
      </p>

      <ul className="space-y-3">
        {open.map((g) => {
          const linked = findingsForGap(findings, g.id);
          return (
            <li key={g.id}>
              <div className="flex items-start gap-2.5">
                {entitled && (
                  <Checkbox
                    id={`gap-${g.id}`}
                    checked={selected.has(g.id)}
                    onCheckedChange={() => toggle(g.id)}
                    disabled={research.isPending}
                    className="mt-1 shrink-0"
                  />
                )}
                <label
                  htmlFor={entitled ? `gap-${g.id}` : undefined}
                  className={`flex flex-wrap items-start gap-x-2 gap-y-1 text-sm ${
                    entitled ? "cursor-pointer" : ""
                  }`}
                >
                  <FlagBadge type={g.flag_type} />
                  <span className="text-foreground/80">
                    {g.content}
                    {g.source && <span className="text-foreground/45">, {g.source}</span>}
                  </span>
                  {linked.length > 0 && (
                    <span className="inline-flex items-center text-xs font-medium text-emerald-700">
                      <Check className="h-3 w-3 mr-0.5" /> Researched
                    </span>
                  )}
                </label>
              </div>

              {linked.length > 0 && (
                <div className="mt-2 ml-7 space-y-2">
                  {linked.map((f) => (
                    <ResearchFindingCard key={f.id} finding={f} className="!p-4" />
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-4">
        {entitled ? (
          <button
            onClick={onResearch}
            disabled={selected.size === 0 || research.isPending}
            className="btn-primary"
          >
            {research.isPending ? (
              <RefreshCw className="h-4 w-4 mr-1.5 animate-spin" />
            ) : (
              <Microscope className="h-4 w-4 mr-1.5" />
            )}
            Research selected ({selected.size})
          </button>
        ) : (
          <Link to="/pricing" className="btn-primary">
            <Lock className="h-4 w-4 mr-1.5" /> Unlock research
          </Link>
        )}
      </div>
    </div>
  );
};

export default ResearchGapsPanel;
