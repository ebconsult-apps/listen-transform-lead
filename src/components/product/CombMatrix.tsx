import type { CombBarrier, EvidenceFlag, Level } from "@/lib/clear/types";
import { combLabel, EVIDENCE_LABEL } from "@/lib/clear/labels";

const evidenceClass: Record<EvidenceFlag, string> = {
  V: "bg-emerald-500/15 text-emerald-600",
  A: "bg-amber-500/15 text-amber-600",
  G: "bg-rose-500/15 text-rose-600",
  NA: "bg-secondary text-foreground/50",
};

const levelClass: Record<Level, string> = {
  High: "text-emerald-600",
  Medium: "text-amber-600",
  Low: "text-foreground/50",
};

/** Tolerate legacy rows that used a free-text `factor` instead of `component`. */
type LooseCell = CombBarrier & { factor?: string; evidence?: string };

const CombMatrix = ({ cells }: { cells: CombBarrier[] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-foreground/50 border-b border-border">
            <th className="py-2 pr-4 font-medium">COM-B component</th>
            <th className="py-2 pr-4 font-medium">Barrier</th>
            <th className="py-2 pr-4 font-medium whitespace-nowrap">Impact × Changeability</th>
            <th className="py-2 font-medium">Evidence</th>
          </tr>
        </thead>
        <tbody>
          {(cells as LooseCell[]).map((c, i) => (
            <tr key={i} className="border-b border-border/60 align-top">
              <td className="py-3 pr-4 font-medium">{combLabel(c)}</td>
              <td className="py-3 pr-4 text-foreground/80">
                {c.barrier}
                {c.significance && (
                  <span className="block text-xs text-foreground/45 mt-0.5">{c.significance}</span>
                )}
              </td>
              <td className="py-3 pr-4 whitespace-nowrap">
                {c.impact ? (
                  <span className={levelClass[c.impact]}>{c.impact}</span>
                ) : (
                  <span className="text-foreground/40">—</span>
                )}
                <span className="text-foreground/30"> × </span>
                {c.changeability ? (
                  <span className={levelClass[c.changeability]}>{c.changeability}</span>
                ) : (
                  <span className="text-foreground/40">—</span>
                )}
              </td>
              <td className="py-3 text-foreground/60">
                {c.evidenceFlag ? (
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${evidenceClass[c.evidenceFlag] ?? evidenceClass.NA}`}
                  >
                    {EVIDENCE_LABEL[c.evidenceFlag] ?? c.evidenceFlag}
                  </span>
                ) : null}
                {(c.source ?? c.evidence) && (
                  <span className="block text-xs text-foreground/45 mt-1">{c.source ?? c.evidence}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CombMatrix;
