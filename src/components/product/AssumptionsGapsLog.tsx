import { useEffect, useState } from "react";
import { Plus, Check, RotateCcw, Trash2, ArrowRightCircle } from "lucide-react";
import type { AssumptionGapRow } from "@/lib/db";
import type { FlagType } from "@/lib/clear/types";
import { FLAG_LABEL } from "@/lib/clear/labels";
import {
  addAssumptionGap,
  deleteAssumptionGap,
  listAssumptionGaps,
  setAssumptionGapStatus,
} from "@/lib/experiment";
import { FlagBadge } from "./GapFlagList";
import { toast } from "sonner";

const FLAG_TYPES: FlagType[] = [
  "assumption",
  "gap",
  "input_needed",
  "user_input",
  "needs_input",
  "requires_confirmation",
];

const statusClass: Record<string, string> = {
  open: "bg-amber-500/15 text-amber-600",
  resolved: "bg-emerald-500/15 text-emerald-600",
  carried: "bg-sky-500/15 text-sky-600",
};

/**
 * The persistent, cross-phase assumptions/gaps log — accumulates the
 * never-fabricate flags every phase emits, and lets the owner add, resolve, or
 * carry items forward.
 */
const AssumptionsGapsLog = ({ projectId }: { projectId: string }) => {
  const [rows, setRows] = useState<AssumptionGapRow[]>([]);
  const [type, setType] = useState<FlagType>("assumption");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () =>
    listAssumptionGaps(projectId)
      .then(setRows)
      .catch((e) => toast.error((e as Error).message))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const add = async () => {
    if (!content.trim()) return;
    try {
      await addAssumptionGap(projectId, { type, content: content.trim() });
      setContent("");
      await load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const setStatus = async (id: string, status: "open" | "resolved" | "carried") => {
    try {
      await setAssumptionGapStatus(id, status);
      await load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteAssumptionGap(id);
      await load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <div className="glass-card p-6 sm:p-8">
      <h3 className="heading-md mb-1">Assumptions &amp; gaps log</h3>
      <p className="body-md mb-5">
        Every phase records what it had to assume or couldn't verify here, rather than inventing it.
        Resolve items as you learn, or carry them into the next cycle.
      </p>

      {loading ? (
        <p className="text-sm text-foreground/50">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-foreground/50 mb-5">Nothing flagged yet.</p>
      ) : (
        <ul className="space-y-2.5 mb-5">
          {rows.map((r) => (
            <li key={r.id} className="flex items-start gap-2 text-sm">
              <FlagBadge type={r.flag_type} />
              <span className={`flex-grow ${r.status === "resolved" ? "line-through text-foreground/40" : "text-foreground/80"}`}>
                {r.content}
                {r.phase && <span className="text-foreground/40"> · {r.phase}</span>}
                {r.source && <span className="text-foreground/40"> ({r.source})</span>}
              </span>
              <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap ${statusClass[r.status]}`}>
                {r.status}
              </span>
              <div className="flex items-center gap-1 text-foreground/40">
                {r.status !== "resolved" ? (
                  <button onClick={() => setStatus(r.id, "resolved")} title="Mark resolved" className="hover:text-emerald-600">
                    <Check className="h-4 w-4" />
                  </button>
                ) : (
                  <button onClick={() => setStatus(r.id, "open")} title="Reopen" className="hover:text-amber-600">
                    <RotateCcw className="h-4 w-4" />
                  </button>
                )}
                {r.status !== "carried" && (
                  <button onClick={() => setStatus(r.id, "carried")} title="Carry forward" className="hover:text-sky-600">
                    <ArrowRightCircle className="h-4 w-4" />
                  </button>
                )}
                <button onClick={() => remove(r.id)} title="Delete" className="hover:text-rose-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <select className="input sm:w-48 text-sm" value={type} onChange={(e) => setType(e.target.value as FlagType)}>
          {FLAG_TYPES.map((t) => (
            <option key={t} value={t}>{FLAG_LABEL[t]}</option>
          ))}
        </select>
        <input
          className="input flex-grow text-sm"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Add an assumption or open question…"
        />
        <button onClick={add} disabled={!content.trim()} className="btn-secondary">
          <Plus className="h-4 w-4 mr-1" /> Add
        </button>
      </div>
    </div>
  );
};

export default AssumptionsGapsLog;
