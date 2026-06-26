import { useState } from "react";
import {
  ArrowRightCircle,
  Check,
  Paperclip,
  RefreshCw,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import type { AssumptionGapRow, AssumptionGapStatus, DocumentRow } from "@/lib/db";
import { cn } from "@/lib/utils";
import { ACCEPT, formatBytes, iconBtn } from "./shared";

/**
 * The editor half of an assumption / open-question item: the owner's answer
 * textarea, the supporting-document list + upload, and the resolve / carry /
 * delete controls. Always rendered expanded — the caller (focus card or the
 * collapsed "answered & carried" section) decides when to mount it.
 *
 * Module-scope (never defined inside a render fn) so element identity and
 * textarea focus stay stable across the parent's react-query refetches. Seed the
 * `draft` once from `gap.response`; to retarget a different gap, REMOUNT by
 * keying on `gap.id` rather than resetting state via an effect (which would
 * clobber in-progress typing on refetch).
 */
const GapEditor = ({
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

  return (
    <div className="space-y-4">
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
          <button onClick={() => onRespond(gap.id, draft)} disabled={busy} className="btn-secondary text-sm">
            {gap.response ? "Update answer" : "Save answer"}
          </button>
          {draft.trim() && !gap.response && (
            <span className="text-xs text-foreground/40">Saving marks this answered.</span>
          )}
        </div>
      </div>

      <div>
        <span className="mb-1.5 block text-xs font-medium text-foreground/50">
          Supporting documentation{" "}
          <span className="font-normal text-foreground/35">(PDF/DOCX/XLSX/MD/TXT/CSV)</span>
        </span>
        {docs.length > 0 && (
          <ul className="mb-2 space-y-1">
            {docs.map((d) => (
              <li
                key={d.id}
                className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-1.5 text-sm"
              >
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

      {/* Status controls */}
      <div className="flex flex-wrap items-center gap-1 border-t border-border pt-3">
        {!answered ? (
          <button
            onClick={() => onSetStatus(gap.id, "resolved")}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-emerald-600 transition-colors hover:bg-emerald-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Check className="h-4 w-4" /> Mark answered
          </button>
        ) : (
          <button
            onClick={() => onSetStatus(gap.id, "open")}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-amber-600 transition-colors hover:bg-amber-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <RotateCcw className="h-4 w-4" /> Reopen
          </button>
        )}
        {gap.status !== "carried" && (
          <button
            onClick={() => onSetStatus(gap.id, "carried")}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-sky-600 transition-colors hover:bg-sky-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowRightCircle className="h-4 w-4" /> Carry forward
          </button>
        )}
        <button
          onClick={() => onDelete(gap.id)}
          aria-label="Delete item"
          title="Delete"
          className={cn(iconBtn, "ml-auto hover:text-rose-600")}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default GapEditor;
