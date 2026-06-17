import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import type { TestCardRow, TestCardStatus } from "@/lib/db";
import { deleteTestCard, updateTestCard } from "@/lib/experiment";
import { toast } from "sonner";

const RISK = ["Low", "Medium", "High"];
const STATUSES: TestCardStatus[] = ["planned", "running", "done", "archived"];

type Editable = Partial<Omit<TestCardRow, "id" | "project_id" | "created_at" | "updated_at" | "results">>;

/** Module-scope so the element identity is stable across renders (keeps focus). */
const TextField = ({
  label,
  value,
  area,
  onChange,
  onBlur,
}: {
  label: string;
  value: string;
  area?: boolean;
  onChange: (v: string) => void;
  onBlur: () => void;
}) => (
  <div>
    <label className="block text-xs font-medium text-foreground/50 mb-1">{label}</label>
    {area ? (
      <textarea rows={2} className="input text-sm" value={value} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} />
    ) : (
      <input className="input text-sm" value={value} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} />
    )}
  </div>
);

const TestCardEditor = ({ card, onChange }: { card: TestCardRow; onChange: () => void }) => {
  const [draft, setDraft] = useState<TestCardRow>(card);
  useEffect(() => setDraft(card), [card]);

  const save = async (patch: Editable) => {
    try {
      await updateTestCard(card.id, patch);
      onChange();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  // Text field bound to a string column: update local on change, persist on blur if changed.
  const text = (k: keyof Editable, label: string, area?: boolean) => {
    const value = ((draft[k] as string | null) ?? "");
    return (
      <TextField
        label={label}
        value={value}
        area={area}
        onChange={(v) => setDraft((d) => ({ ...d, [k]: v }))}
        onBlur={() => value !== ((card[k] as string | null) ?? "") && save({ [k]: value } as Editable)}
      />
    );
  };

  return (
    <div className="border border-border rounded-xl p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <input
          className="input font-semibold"
          value={draft.leverage_point ?? ""}
          placeholder="Leverage point"
          onChange={(e) => setDraft((d) => ({ ...d, leverage_point: e.target.value }))}
          onBlur={() =>
            (draft.leverage_point ?? "") !== (card.leverage_point ?? "") &&
            save({ leverage_point: draft.leverage_point })
          }
        />
        <button
          onClick={async () => {
            try {
              await deleteTestCard(card.id);
              onChange();
            } catch (e) {
              toast.error((e as Error).message);
            }
          }}
          className="text-foreground/40 hover:text-rose-600 p-1.5"
          title="Delete test card"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {text("hypothesis", "Hypothesis (We believe…)", true)}
        {text("action", "Action (intervention to test)", true)}
        {text("metric", "Metric")}
        {text("threshold", "Threshold (success =)")}
        {text("duration", "Duration")}
        {text("kr_ref", "Key Result it ties to")}
      </div>

      <div className="grid sm:grid-cols-4 gap-3 mt-3">
        <div>
          <label className="block text-xs font-medium text-foreground/50 mb-1">Risk</label>
          <select
            className="input text-sm"
            value={draft.risk_level ?? ""}
            onChange={(e) => { setDraft((d) => ({ ...d, risk_level: e.target.value })); save({ risk_level: e.target.value }); }}
          >
            <option value="">—</option>
            {RISK.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-foreground/50 mb-1">Owner (role)</label>
          <input
            className="input text-sm"
            value={draft.owner_role ?? ""}
            onChange={(e) => setDraft((d) => ({ ...d, owner_role: e.target.value }))}
            onBlur={() => (draft.owner_role ?? "") !== (card.owner_role ?? "") && save({ owner_role: draft.owner_role })}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-foreground/50 mb-1">Week</label>
          <input
            type="number"
            min={1}
            className="input text-sm"
            value={draft.calendar_week ?? ""}
            onChange={(e) => setDraft((d) => ({ ...d, calendar_week: e.target.value === "" ? null : Number(e.target.value) }))}
            onBlur={() => draft.calendar_week !== card.calendar_week && save({ calendar_week: draft.calendar_week })}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-foreground/50 mb-1">Status</label>
          <select
            className="input text-sm"
            value={draft.status}
            onChange={(e) => { setDraft((d) => ({ ...d, status: e.target.value as TestCardStatus })); save({ status: e.target.value as TestCardStatus }); }}
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-3">{text("ethics_notes", "Risk & ethics notes", true)}</div>
    </div>
  );
};

const TestCardList = ({ cards, onChange }: { cards: TestCardRow[]; onChange: () => void }) => {
  if (!cards.length) {
    return (
      <p className="text-sm text-foreground/50">
        No test cards yet. Promote a surviving intervention above to design its test.
      </p>
    );
  }
  return (
    <div className="space-y-4">
      {cards.map((c) => (
        <TestCardEditor key={c.id} card={c} onChange={onChange} />
      ))}
    </div>
  );
};

export default TestCardList;
