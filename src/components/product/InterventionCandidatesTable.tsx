import { useEffect, useState } from "react";
import { ArrowRight, AlertTriangle } from "lucide-react";
import type { Apease, Gate } from "@/lib/clear/types";
import type { InterventionCandidateRow } from "@/lib/db";
import { apeaseFlagged, apeaseParked, apeaseSum, saveCandidateApease } from "@/lib/experiment";
import { toast } from "sonner";

const SCORES = [1, 2, 3, 4, 5];
const GATES: Gate[] = ["pass", "flag", "fail"];
const gateClass: Record<Gate, string> = {
  pass: "text-emerald-600",
  flag: "text-amber-600",
  fail: "text-rose-600",
};

const ScoreSelect = ({ value, onChange }: { value: number; onChange: (n: number) => void }) => (
  <select className="input !py-1 !px-2 w-16 text-sm" value={value} onChange={(e) => onChange(Number(e.target.value))}>
    {SCORES.map((n) => (
      <option key={n} value={n}>{n}</option>
    ))}
  </select>
);

const GateSelect = ({ value, onChange }: { value: Gate; onChange: (g: Gate) => void }) => (
  <select
    className={`input !py-1 !px-2 text-sm font-medium ${gateClass[value]}`}
    value={value}
    onChange={(e) => onChange(e.target.value as Gate)}
  >
    {GATES.map((g) => (
      <option key={g} value={g}>{g.toUpperCase()}</option>
    ))}
  </select>
);

/**
 * Editable APEASE screen: 3 scores (1–5) + 3 veto gates (PASS/FLAG/FAIL).
 * Any FAIL parks the candidate regardless of its scored sum (the load-bearing
 * rule), and parked candidates cannot be promoted to a test card.
 */
const InterventionCandidatesTable = ({
  candidates,
  onPromote,
  onChange,
}: {
  candidates: InterventionCandidateRow[];
  onPromote: (candidate: InterventionCandidateRow) => void;
  onChange: () => void;
}) => {
  // Local mirror for snappy edits; persist in the background, then refresh parent.
  const [rows, setRows] = useState(candidates);
  useEffect(() => setRows(candidates), [candidates]);

  const patchApease = async (id: string, patch: Partial<Apease>) => {
    const row = rows.find((r) => r.id === id);
    if (!row) return;
    const apease = { ...row.apease, ...patch };
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, apease, parked: apeaseParked(apease) } : r)));
    try {
      await saveCandidateApease(id, apease);
      onChange();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <div className="space-y-4">
      {rows.map((c) => {
        const parked = c.parked || apeaseParked(c.apease);
        const flagged = apeaseFlagged(c.apease);
        return (
          <div
            key={c.id}
            className={`border rounded-xl p-4 sm:p-5 ${parked ? "border-rose-300/50 bg-rose-500/[0.03]" : "border-border"}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-semibold">{c.title}</h4>
                  {c.leverage_point_rank != null && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-foreground/60">
                      Leverage #{c.leverage_point_rank}
                    </span>
                  )}
                  {parked && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600">
                      <AlertTriangle className="h-3 w-3" /> Parked (veto FAIL)
                    </span>
                  )}
                </div>
                {c.barrier && <p className="text-xs text-foreground/50 mt-0.5">Targets: {c.barrier}</p>}
                {c.description && <p className="text-sm text-foreground/70 mt-2">{c.description}</p>}
              </div>
              <button
                onClick={() => onPromote(c)}
                disabled={parked}
                className="btn-secondary whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
                title={parked ? "A vetoed idea can't become a test card" : "Promote to test card"}
              >
                Test card <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>

            <div className="flex flex-wrap items-end gap-x-5 gap-y-3 mt-4 text-xs">
              <label className="flex flex-col gap-1">
                <span className="text-foreground/50">Effectiveness</span>
                <ScoreSelect value={c.apease.effectiveness} onChange={(n) => patchApease(c.id, { effectiveness: n })} />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-foreground/50">Practicability</span>
                <ScoreSelect value={c.apease.practicability} onChange={(n) => patchApease(c.id, { practicability: n })} />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-foreground/50">Affordability</span>
                <ScoreSelect value={c.apease.affordability} onChange={(n) => patchApease(c.id, { affordability: n })} />
              </label>
              <span className="flex flex-col gap-1">
                <span className="text-foreground/50">Sum</span>
                <span className="font-bold text-foreground/80 px-2 py-1.5">{apeaseSum(c.apease)}/15</span>
              </span>
              <span className="w-px self-stretch bg-border mx-1 hidden sm:block" />
              <label className="flex flex-col gap-1">
                <span className="text-foreground/50">Acceptability</span>
                <GateSelect value={c.apease.acceptability} onChange={(g) => patchApease(c.id, { acceptability: g })} />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-foreground/50">Safety</span>
                <GateSelect value={c.apease.safety} onChange={(g) => patchApease(c.id, { safety: g })} />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-foreground/50">Equity</span>
                <GateSelect value={c.apease.equity} onChange={(g) => patchApease(c.id, { equity: g })} />
              </label>
            </div>

            {(flagged || parked) && c.apease.notes && (
              <p className="text-xs text-amber-700/90 mt-3 bg-amber-500/[0.06] rounded-lg px-3 py-2">
                {c.apease.notes}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default InterventionCandidatesTable;
