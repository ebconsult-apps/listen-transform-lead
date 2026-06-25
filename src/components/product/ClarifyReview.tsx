import { useId, useState } from "react";
import { Check, RefreshCw, Plus, Trash2, X } from "lucide-react";
import type { ClarifyOutput, KeyResult, Level } from "@/lib/clear/types";
import { gapFlags } from "@/lib/clear/labels";
import GapFlagList from "./GapFlagList";
import { AutoTextarea, FieldLabel, HINTS, OkrExplainer } from "./okr-help";

/** Module-scope so element identity is stable across renders (keeps focus while typing). */
const KrField = ({
  label,
  value,
  area,
  hint,
  optional,
  onChange,
}: {
  label: string;
  value: string;
  area?: boolean;
  hint: string;
  optional?: boolean;
  onChange: (v: string) => void;
}) => {
  const id = useId();
  return (
    <div>
      <FieldLabel htmlFor={id} label={label} hint={hint} optional={optional} small />
      {area ? (
        <AutoTextarea id={id} className="input text-sm" value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input id={id} className="input text-sm" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
};

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

      <OkrExplainer className="mb-6" />

      <FieldLabel htmlFor="clarify-why" label="Why it matters" hint={HINTS.why} optional />
      <AutoTextarea id="clarify-why" className="input mb-5" rows={3} value={whyItMatters} onChange={(e) => setWhy(e.target.value)} />

      <FieldLabel htmlFor="clarify-objective" label="Objective" hint={HINTS.objective} required />
      <AutoTextarea id="clarify-objective" aria-required="true" className="input mb-5" rows={2} value={objective} onChange={(e) => setObjective(e.target.value)} />

      <div className="flex items-center justify-between mb-2">
        <span className="block text-sm font-medium">Key Results</span>
        <button onClick={addKr} className="text-xs text-primary inline-flex items-center gap-1 hover:underline">
          <Plus className="h-3.5 w-3.5" /> Add KR
        </button>
      </div>
      <div className="space-y-3 mb-5">
        {keyResults.map((kr, i) => (
          <div key={i} className="border border-border rounded-xl p-4">
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <FieldLabel htmlFor={`kr-${i}-text`} label="Key result" hint={HINTS.kr} required small />
                <AutoTextarea
                  id={`kr-${i}-text`}
                  aria-required="true"
                  className="input font-medium"
                  value={kr.kr}
                  placeholder="Key result (outcome, measurable)"
                  onChange={(e) => setKr(i, { kr: e.target.value })}
                />
              </div>
              <button onClick={() => removeKr(i)} className="text-foreground/40 hover:text-rose-600 p-1.5 mt-7" title="Remove KR">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3 mt-3">
              <KrField label="Metric" area hint={HINTS.metric} optional value={kr.metric ?? ""} onChange={(v) => setKr(i, { metric: v })} />
              <KrField label="Baseline" area hint={HINTS.baseline} optional value={kr.baseline ?? ""} onChange={(v) => setKr(i, { baseline: v })} />
              <KrField label="Target" area hint={HINTS.target} optional value={kr.target ?? ""} onChange={(v) => setKr(i, { target: v })} />
            </div>
            <div className="grid sm:grid-cols-3 gap-3 mt-3">
              <KrField label="Timeline" hint={HINTS.timeline} optional value={kr.timeline ?? ""} onChange={(v) => setKr(i, { timeline: v })} />
              <KrField label="Owner (role)" hint={HINTS.owner} optional value={kr.owner ?? ""} onChange={(v) => setKr(i, { owner: v })} />
              <div>
                <FieldLabel htmlFor={`kr-${i}-confidence`} label="Confidence" hint={HINTS.confidence} optional small />
                <select
                  id={`kr-${i}-confidence`}
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
