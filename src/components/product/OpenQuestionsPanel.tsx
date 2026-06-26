import { useCallback, useEffect, useMemo, useState } from "react";
import { HelpCircle, Plus } from "lucide-react";
import { toast } from "sonner";
import type { FlagType } from "@/lib/clear/types";
import type { AssumptionGapStatus, DocumentRow } from "@/lib/db";
import { FLAG_LABEL } from "@/lib/clear/labels";
import { listDocuments, uploadDocument, deleteDocument } from "@/lib/db";
import {
  useAddAssumptionGap,
  useAssumptionGaps,
  useDeleteAssumptionGap,
  useRespondAssumptionGap,
  useSetAssumptionGapStatus,
} from "@/hooks/queries/useAssumptionGaps";
import GapFocusFlow from "./gap-flow/GapFocusFlow";

const FLAG_TYPES: FlagType[] = [
  "assumption",
  "gap",
  "input_needed",
  "user_input",
  "needs_input",
  "requires_confirmation",
];

/**
 * Dedicated "Open questions" workspace: gathers every assumption / gap / input-
 * needed item the analysis flagged across all phases and walks the owner through
 * them one at a time — most important first — via GapFocusFlow. Answers and
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

  const onRespond = (id: string, response: string) =>
    respond.mutate(
      { id, response },
      { onSuccess: () => toast.success(response.trim() ? "Answer saved." : "Answer cleared.") },
    );
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
      <p className="body-md mb-5">
        Every phase records what it had to assume or couldn't verify here, rather than inventing it.
        Work through them one at a time — most important first — answering each or attaching the
        documentation that settles it. Your input is folded into the next analysis run.
      </p>

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
        <GapFocusFlow
          rows={rows}
          docsByGap={docsByGap}
          busy={respond.isPending}
          onRespond={onRespond}
          onSetStatus={onSetStatus}
          onDelete={onDelete}
          onUpload={onUpload}
          onRemoveDoc={onRemoveDoc}
        />
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
