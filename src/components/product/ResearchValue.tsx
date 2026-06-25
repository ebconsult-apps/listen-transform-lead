import { Microscope } from "lucide-react";
import type { ClarifyOutput, GapFlag, LeverageFull } from "@/lib/clear/types";
import { gapFlags } from "@/lib/clear/labels";
import { FlagBadge } from "./GapFlagList";

const MAX_GAPS = 5;

/**
 * Collect the project's own open questions — the gap-log entries from the full
 * Leverage report and the Clarify target — that research is meant to close.
 * Leverage gaps come first (more specific), then Clarify, de-duped by content.
 * `full` is null until the report is unlocked, so we fall back to Clarify alone.
 */
function projectGaps(
  clarify: ClarifyOutput | null,
  full: LeverageFull | null,
): GapFlag[] {
  const flags = [...(full ? gapFlags(full) : []), ...(clarify ? gapFlags(clarify) : [])];
  const seen = new Set<string>();
  return flags.filter((f) => {
    if (!f.content || seen.has(f.content)) return false;
    seen.add(f.content);
    return true;
  });
}

/**
 * Shared "why research" surface, rendered both in the gated tab (before unlock, to
 * motivate it) and inside ResearchTab (before a run). It pairs the generic value
 * framing with the project's actual gap log so the owner sees exactly which open
 * questions research would close. The post-run "Questions to close the gaps"
 * section in ResearchTab is the other half of this same promise.
 */
const ResearchValue = ({
  clarify,
  full,
}: {
  clarify: ClarifyOutput | null;
  full: LeverageFull | null;
}) => {
  const gaps = projectGaps(clarify, full);
  const shown = gaps.slice(0, MAX_GAPS);
  const extra = gaps.length - shown.length;

  return (
    <div className="space-y-4">
      <p className="body-md">
        Every analysis carries assumptions and gaps, things we inferred but couldn't
        verify from your inputs alone. Research sends an agent to gather cited external
        evidence, sector benchmarks, behavioural-science findings, real-world examples,
        and turns those open questions into verified facts. Every finding carries a
        source; nothing is invented. Accept what holds up and it strengthens your next
        Clarify and Leverage run.
      </p>

      {shown.length > 0 && (
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
          <p className="font-medium flex items-center gap-2 mb-3">
            <Microscope className="h-4 w-4 text-primary flex-shrink-0" />
            Here's what research would close for <span className="italic">this</span> project
          </p>
          <ul className="space-y-2.5">
            {shown.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <FlagBadge type={f.type} />
                <span className="text-foreground/80">
                  {f.content}
                  {f.source && <span className="text-foreground/45">, {f.source}</span>}
                </span>
              </li>
            ))}
          </ul>
          {extra > 0 && (
            <p className="text-sm text-foreground/50 mt-2.5">
              +{extra} more open {extra === 1 ? "question" : "questions"}.
            </p>
          )}
          <p className="text-sm text-foreground/50 mt-3">
            Research targets exactly these. After it runs, the agent's follow-up
            questions appear below as <span className="font-medium">Questions to close
            the gaps</span> for you to answer.
          </p>
        </div>
      )}
    </div>
  );
};

export default ResearchValue;
