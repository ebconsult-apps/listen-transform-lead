import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowRightCircle,
  Check,
  ChevronDown,
  HelpCircle,
  Paperclip,
  Plus,
  RefreshCw,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import type { FlagType } from "@/lib/clear/types";
import type { AssumptionGapRow, AssumptionGapStatus, DocumentRow } from "@/lib/db";
import { FLAG_LABEL } from "@/lib/clear/labels";
import { listDocuments, uploadDocument, deleteDocument } from "@/lib/db";
import {
  useAddAssumptionGap,
  useAssumptionGaps,
  useDeleteAssumptionGap,
  useRespondAssumptionGap,
  useSetAssumptionGapStatus,
} from "@/hooks/queries/useAssumptionGaps";
import { cn } from "@/lib/utils";
import { FlagBadge } from "./GapFlagList";

const FLAG_TYPES: FlagType[] = [
  "assumption",
  "gap",
  "input_needed",
  "user_input",
  "needs_input",
  "requires_confirmation",
];

const ACCEPT = ".pdf,.docx,.xlsx,.md,.txt,.csv";

const STATUS_CLASS: Record<AssumptionGapStatus, string> = {
  open: "bg-amber-500/15 text-amber-600",
  resolved: "bg-emerald-500/15 text-emerald-600",
  carried: "bg-sky-500/15 text-sky-600",
};
const STATUS_LABEL: Record<AssumptionGapStatus, string> = {
  open: "Open",
  resolved: "Answered",
  carried: "Carried",
};

/** Status groups, in the order the owner should work through them. */
const GROUPS: { status: AssumptionGapStatus; label: string; hint: string }[] = [
  { status: "open", label: "Needs your input", hint: "Answer or document these so the next run accounts for them." },
  { status: "resolved", label: "Answered", hint: "Folded into your next analysis run." },
  { status: "carried", label: "Carried forward", hint: "Deferred to a later cycle." },
];

/** Icon-button base: real hit target + a visible focus ring (a11y). */
const iconBtn =
  "p-1.5 rounded-md text-foreground/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function formatBytes(n: number | null | undefined): string {
  if (!n) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * One assumption / open-question row: shows the flag, lets the owner write an
 * answer and attach supporting documents, and exposes the resolve / carry /
 * delete controls. Module-scope so element identity (and textarea focus) is
 * stable across the parent's react-query refetches.
 */
const GapItem = ({
  gap,
  docs,
  busy,
  onRespond,
  onSetStatus,
  onDelete,
  onUpload,
  onRemoveDoc,
}: {
  gap: AssumptionGapRow;
  docs: DocumentRow[];
  busy: boolean;
  onRespond: (id: string, response: string) => void;
  onSetStatus: (id: string, status: AssumptionGapStatus) => void;
  onDelete: (id: string) => void;
  onUpload: (gapId: string, files: FileList) => Promise<void>;
  onRemoveDoc: (docId: string) => Promise<void>;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState(gap.response ?? "");
  const [uploading, setUploading] = useState(false);

  const answered = gap.status === "resolved";

  const handleFiles = async (list: FileList | null, el: HTMLInputElement) => {
    if (!list || !list.length) return;
    setUploading(true);
    try {
      await onUpload(gap.id, list);
    } finally {
      setUploading(false);
      el.value = ""; // allow re-selecting the same file
    }
  };

  const save = () => {
    onRespond(gap.id, draft);
    setExpanded(false);
  };

  return (
    <li className="rounded-xl border border-border bg-background/40 p-4">
      <div className="flex items-start gap-2.5">
        <FlagBadge type={gap.flag_type} />
        <div className="min-w-0 flex-grow">
          <p className={cn("text-sm", answered ? "text-foreground/50 line-through" : "text-foreground/80")}>
            {gap.content}
          </p>
          {(gap.phase || gap.source) && (
            <p className="mt-0.5 text-xs text-foreground/40">
              {gap.phase}
              {gap.phase && gap.source ? " · " : ""}
              {gap.source}
            </p>
          )}
        </div>
        <span className={cn("inline-flex shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium", STATUS_CLASS[gap.status])}>
          {STATUS_LABEL[gap.status]}
        </span>
      </div>

      {/* Collapsed preview of a saved answer + attachments */}
      {!expanded && gap.response && (
        <div className="mt-2.5 rounded-lg bg-muted/40 px-3 py-2">
          <span className="text-xs font-medium text-foreground/40">Your answer</span>
          <p className="mt-0.5 whitespace-pre-wrap text-sm text-foreground/70">{gap.response}</p>
        </div>
      )}
      {!expanded && docs.length > 0 && (
        <ul className="mt-2 space-y-1">
          {docs.map((d) => (
            <li key={d.id} className="flex items-center gap-1.5 text-xs text-foreground/55">
              <Paperclip className="h-3 w-3 shrink-0" />
              <span className="truncate">{d.filename}</span>
              {d.bytes ? <span className="text-foreground/35">· {formatBytes(d.bytes)}</span> : null}
            </li>
          ))}
        </ul>
      )}

      {/* Toolbar */}
      <div className="mt-2.5 flex flex-wrap items-center gap-1">
        <button
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-primary transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
          {gap.response || docs.length ? "Edit answer & attachments" : "Answer & attach"}
        </button>
        <div className="ml-auto flex items-center gap-1">
          {!answered ? (
            <button onClick={() => onSetStatus(gap.id, "resolved")} aria-label="Mark answered" title="Mark answered" className={cn(iconBtn, "hover:text-emerald-600")}>
              <Check className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={() => onSetStatus(gap.id, "open")} aria-label="Reopen" title="Reopen" className={cn(iconBtn, "hover:text-amber-600")}>
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
          {gap.status !== "carried" && (
            <button onClick={() => onSetStatus(gap.id, "carried")} aria-label="Carry forward to next cycle" title="Carry forward" className={cn(iconBtn, "hover:text-sky-600")}>
              <ArrowRightCircle className="h-4 w-4" />
            </button>
          )}
          <button onClick={() => onDelete(gap.id)} aria-label="Delete item" title="Delete" className={cn(iconBtn, "hover:text-rose-600")}>
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Expanded editor */}
      {expanded && (
        <div className="mt-3 space-y-4 border-t border-border pt-3">
          <div>
            <label htmlFor={`ans-${gap.id}`} className="mb-1 block text-xs font-medium text-foreground/50">
              Your answer or supporting note
            </label>
            <textarea
              id={`ans-${gap.id}`}
              className="input text-sm"
              rows={3}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Explain, confirm, or resolve this — paste any links or references too…"
            />
            <div className="mt-2 flex items-center gap-2">
              <button onClick={save} disabled={busy} className="btn-secondary text-sm">
                {gap.response ? "Update answer" : "Save answer"}
              </button>
              {draft.trim() && !gap.response && (
                <span className="text-xs text-foreground/40">Saving marks this answered.</span>
              )}
            </div>
          </div>

          <div>
            <span className="mb-1.5 block text-xs font-medium text-foreground/50">
              Supporting documentation <span className="font-normal text-foreground/35">(PDF/DOCX/XLSX/MD/TXT/CSV)</span>
            </span>
            {docs.length > 0 && (
              <ul className="mb-2 space-y-1">
                {docs.map((d) => (
                  <li key={d.id} className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-1.5 text-sm">
                    <span className="inline-flex min-w-0 items-center gap-1.5">
                      <Paperclip className="h-3.5 w-3.5 shrink-0 text-foreground/40" />
                      <span className="truncate">{d.filename}</span>
                      {d.bytes ? <span className="shrink-0 text-xs text-foreground/40">{formatBytes(d.bytes)}</span> : null}
                    </span>
                    <button
                      onClick={() => onRemoveDoc(d.id)}
                      aria-label={`Remove ${d.filename}`}
                      title="Remove"
                      className={cn(iconBtn, "hover:text-rose-600")}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-primary hover:underline">
              {uploading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
              {uploading ? "Uploading…" : "Attach a file"}
              <input
                type="file"
                multiple
                accept={ACCEPT}
                disabled={uploading}
                className="hidden"
                aria-label={`Attach a document to: ${gap.content}`}
                onChange={(e) => handleFiles(e.target.files, e.currentTarget)}
              />
            </label>
          </div>
        </div>
      )}
    </li>
  );
};

/**
 * Dedicated "Open questions" workspace: gathers every assumption / gap / input-
 * needed item the analysis flagged across all phases and lets the owner answer
 * each one, attach supporting documents, and resolve or carry it. Answers and
 * attachments fold into the next analysis run (see buildIntake).
 */
const OpenQuestionsPanel = ({ projectId }: { projectId: string }) => {
  const { data: rows = [], isPending } = useAssumptionGaps(projectId);
  const addGap = useAddAssumptionGap(projectId);
  const respond = useRespondAssumptionGap(projectId);
  const setStatusMutation = useSetAssumptionGapStatus(projectId);
  const deleteGap = useDeleteAssumptionGap(projectId);

  const [docs, setDocs] = useState<DocumentRow[]>([]);
  const [type, setType] = useState<FlagType>("input_needed");
  const [content, setContent] = useState("");

  const reloadDocs = useCallback(async () => {
    setDocs(await listDocuments(projectId));
  }, [projectId]);
  useEffect(() => {
    reloadDocs().catch((e) => toast.error((e as Error).message));
  }, [reloadDocs]);

  const docsByGap = useMemo(() => {
    const map: Record<string, DocumentRow[]> = {};
    for (const d of docs) {
      if (d.assumption_gap_id) (map[d.assumption_gap_id] ??= []).push(d);
    }
    return map;
  }, [docs]);

  const counts = useMemo(
    () => ({
      open: rows.filter((r) => r.status === "open").length,
      resolved: rows.filter((r) => r.status === "resolved").length,
      carried: rows.filter((r) => r.status === "carried").length,
    }),
    [rows],
  );

  const onRespond = (id: string, response: string) =>
    respond.mutate({ id, response }, { onSuccess: () => toast.success(response.trim() ? "Answer saved." : "Answer cleared.") });
  const onSetStatus = (id: string, status: AssumptionGapStatus) => setStatusMutation.mutate({ id, status });
  const onDelete = (id: string) => deleteGap.mutate(id);

  const onUpload = async (gapId: string, files: FileList) => {
    try {
      for (const file of Array.from(files)) {
        await uploadDocument(projectId, file, { assumptionGapId: gapId });
      }
      await reloadDocs();
      toast.success(files.length > 1 ? `${files.length} files attached.` : "File attached.");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };
  const onRemoveDoc = async (docId: string) => {
    try {
      await deleteDocument(docId);
      await reloadDocs();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const add = () => {
    if (!content.trim()) return;
    addGap.mutate({ type, content: content.trim() }, { onSuccess: () => setContent("") });
  };

  return (
    <div className="glass-card p-6 sm:p-8">
      <div className="mb-1 flex items-center gap-2">
        <HelpCircle className="h-5 w-5 text-primary" />
        <h3 className="heading-md">Open questions</h3>
      </div>
      <p className="body-md mb-4">
        Every phase records what it had to assume or couldn't verify here, rather than inventing it.
        Answer each one or attach the documentation that settles it — your input is folded into the
        next analysis run.
      </p>

      {/* Summary chips */}
      {!isPending && rows.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-2 text-xs font-medium">
          <span className={cn("rounded-full px-2.5 py-1", STATUS_CLASS.open)}>{counts.open} open</span>
          <span className={cn("rounded-full px-2.5 py-1", STATUS_CLASS.resolved)}>{counts.resolved} answered</span>
          {counts.carried > 0 && (
            <span className={cn("rounded-full px-2.5 py-1", STATUS_CLASS.carried)}>{counts.carried} carried</span>
          )}
        </div>
      )}

      {isPending ? (
        <div className="space-y-2.5" aria-hidden>
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center">
          <p className="text-sm text-foreground/60">
            No open questions yet — they appear here as each phase runs. You can also add your own below.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {GROUPS.map((g) => {
            const groupRows = rows.filter((r) => r.status === g.status);
            if (!groupRows.length) return null;
            return (
              <section key={g.status}>
                <div className="mb-2.5 flex items-baseline gap-2">
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-foreground/50">{g.label}</h4>
                  <span className="text-xs text-foreground/35">{g.hint}</span>
                </div>
                <ul className="space-y-2.5">
                  {groupRows.map((gap) => (
                    <GapItem
                      key={gap.id}
                      gap={gap}
                      docs={docsByGap[gap.id] ?? []}
                      busy={respond.isPending}
                      onRespond={onRespond}
                      onSetStatus={onSetStatus}
                      onDelete={onDelete}
                      onUpload={onUpload}
                      onRemoveDoc={onRemoveDoc}
                    />
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}

      {/* Add your own */}
      <div className="mt-6 border-t border-border pt-5">
        <span className="mb-2 block text-sm font-medium">Add your own</span>
        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            aria-label="Flag type"
            className="input text-sm sm:w-48"
            value={type}
            onChange={(e) => setType(e.target.value as FlagType)}
          >
            {FLAG_TYPES.map((t) => (
              <option key={t} value={t}>
                {FLAG_LABEL[t]}
              </option>
            ))}
          </select>
          <input
            aria-label="New assumption or open question"
            className="input flex-grow text-sm"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            placeholder="Add an assumption or open question…"
          />
          <button onClick={add} disabled={!content.trim() || addGap.isPending} className="btn-secondary">
            <Plus className="mr-1 h-4 w-4" /> Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default OpenQuestionsPanel;
