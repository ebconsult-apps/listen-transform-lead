import { useState } from "react";
import { Check, RefreshCw, Plus, Trash2, X } from "lucide-react";
import type { ClarifyOutput, KeyResult, Level } from "@/lib/clear/types";
import { gapFlags } from "@/lib/clear/labels";
import GapFlagList from "./GapFlagList";

/**
 * Editable Clarify (OKR) review — the C→L checkpoint. The owner reviews and edits
 * the generated objective / Key Results / why, then approves. The approved
 * (possibly edited) version is what Leverage and downstream phases consume.
 */
const ClarifyReview = ({
  initial,
  busy,
  onApprove,
  onReRun,
  onCancel,
}: {
  initial: ClarifyOutput;
  busy: boolean;
  onApprove: (edited: ClarifyOutput) => void;
  onReRun: () => void;
  onCancel?: () => void;
}) => {
  const [whyItMatters, setWhy] = useState(initial.whyItMatters ?? "");
  const [objective, setObjective] = useState(initial.objective ?? "");
  const [keyResults, setKeyResults] = useState<KeyResult[]>(initial.keyResults ?? []);

  const setKr = (i: number, patch: Partial<KeyResult>) =>
    setKeyResults((rs) => rs.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  const addKr = () => setKeyResults((rs) => [...rs, { kr: "" }]);
  const removeKr = (i: number) => setKeyResults((rs) => rs.filter((_, j) => j !== i));

  const approve = () =>
    onApprove({
      ...initial,
      whyItMatters,
      objective,
      keyResults: keyResults.filter((k) => k.kr.trim()),
    });

  const flags = gapFlags(initial);

  return (
    <div className="glass-card p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-1">
        <span className="phase-chip !h-7 !w-7 !text-xs" style={{ backgroundColor: "hsl(var(--phase-c))" }}>
          C
        </span>
        <h3 className="heading-md">Clarify: review &amp; approve</h3>
      </div>
      <p className="body-md mb-6">
        Edit the OKRs until they're right, then approve. Leverage runs on the version you approve.
        Nothing is diagnosed on top of a target you haven't signed off.
      </p>

      <label className="block text-sm font-medium mb-1">Why it matters</label>
      <textarea className="input mb-5" rows={4} value={whyItMatters} onChange={(e) => setWhy(e.target.value)} />

      <label className="block text-sm font-medium mb-1">Objective</label>
      <textarea className="input mb-5" rows={2} value={objective} onChange={(e) => setObjective(e.target.value)} />

      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium">Key Results</label>
        <button onClick={addKr} className="text-xs text-primary inline-flex items-center gap-1 hover:underline">
          <Plus className="h-3.5 w-3.5" /> Add KR
        </button>
      </div>
      <div className="space-y-3 mb-5">
        {keyResults.map((kr, i) => (
          <div key={i} className="border border-border rounded-xl p-4">
            <div className="flex items-start gap-2">
              <input
                className="input font-medium"
                value={kr.kr}
                placeholder="Key result (outcome, measurable)"
                onChange={(e) => setKr(i, { kr: e.target.value })}
              />
              <button onClick={() => removeKr(i)} className="text-foreground/40 hover:text-rose-600 p-1.5" title="Remove KR">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="grid sm:grid-cols-3 gap-2 mt-2">
              <input className="input text-sm" value={kr.metric ?? ""} placeholder="Metric" onChange={(e) => setKr(i, { metric: e.target.value })} />
              <input className="input text-sm" value={kr.baseline ?? ""} placeholder="Baseline" onChange={(e) => setKr(i, { baseline: e.target.value })} />
              <input className="input text-sm" value={kr.target ?? ""} placeholder="Target" onChange={(e) => setKr(i, { target: e.target.value })} />
              <input className="input text-sm" value={kr.timeline ?? ""} placeholder="Timeline" onChange={(e) => setKr(i, { timeline: e.target.value })} />
              <input className="input text-sm" value={kr.owner ?? ""} placeholder="Owner (role)" onChange={(e) => setKr(i, { owner: e.target.value })} />
              <select
                className="input text-sm"
                value={kr.confidence ?? ""}
                onChange={(e) => setKr(i, { confidence: (e.target.value || undefined) as Level | undefined })}
              >
                <option value="">Confidence…</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {flags.length > 0 && (
        <>
          <h4 className="font-semibold text-sm uppercase tracking-wide text-foreground/50 mb-3">
            Assumptions &amp; open questions
          </h4>
          <div className="mb-6">
            <GapFlagList flags={flags} />
          </div>
        </>
      )}

      <div className="flex flex-wrap gap-2">
        <button onClick={approve} disabled={busy || !objective.trim() || keyResults.filter((k) => k.kr.trim()).length === 0} className="btn-primary">
          <Check className="h-4 w-4 mr-1.5" /> {busy ? "Working…" : "Approve & generate Leverage"}
        </button>
        <button onClick={onReRun} disabled={busy} className="btn-secondary">
          <RefreshCw className="h-4 w-4 mr-1.5" /> Re-run Clarify
        </button>
        {onCancel && (
          <button onClick={onCancel} disabled={busy} className="btn-secondary">
            <X className="h-4 w-4 mr-1.5" /> Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default ClarifyReview;
