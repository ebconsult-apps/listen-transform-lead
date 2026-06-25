import { useCallback, useEffect, useState } from "react";
import { Microscope, Check, X, Library, RefreshCw, HelpCircle } from "lucide-react";
import type { ResearchFindingRow, ResearchQuestionRow } from "@/lib/db";
import type { ClarifyOutput, LeverageFull } from "@/lib/clear/types";
import { runResearch } from "@/lib/clear/run";
import { LoadingState } from "@/components/ui/data-states";
import ResearchValue from "./ResearchValue";
import ResearchFindingCard from "./ResearchFindingCard";
import ResearchGapsPanel from "./ResearchGapsPanel";
import {
  answerQuestion,
  confirmPromotion,
  dismissQuestion,
  listFindings,
  listQuestions,
  previewPromotion,
  setFindingStatus,
  type PromotePreview,
} from "@/lib/research";
import { toast } from "sonner";

/**
 * RESEARCH enrichment surface. The owner runs the agent to gather cited external
 * evidence, then curates it: accepted findings flow into the next CLARIFY/LEVERAGE
 * run as "Verified" evidence, and can be de-identified and promoted into the shared
 * library for reuse on future projects. The agent's follow-up questions sit
 * alongside so the owner can close the gaps the evidence still leaves open.
 */
const ResearchTab = ({
  projectId,
  clarify,
  full,
  entitled = true,
  onAfterRun,
}: {
  projectId: string;
  clarify: ClarifyOutput | null;
  full: LeverageFull | null;
  entitled?: boolean;
  onAfterRun?: () => Promise<void> | void;
}) => {
  const [findings, setFindings] = useState<ResearchFindingRow[]>([]);
  const [questions, setQuestions] = useState<ResearchQuestionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<{ id: string; entry: PromotePreview } | null>(null);
  const [promoting, setPromoting] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    const [f, q] = await Promise.all([listFindings(projectId), listQuestions(projectId)]);
    setFindings(f);
    setQuestions(q);
  }, [projectId]);

  useEffect(() => {
    load()
      .catch((e) => toast.error((e as Error).message))
      .finally(() => setLoading(false));
  }, [load]);

  const run = async () => {
    setBusy(true);
    try {
      await runResearch(projectId);
      await load();
      await onAfterRun?.();
      toast.success("Research complete. Review the findings below.");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const setStatus = async (id: string, status: "accepted" | "dismissed" | "proposed") => {
    try {
      await setFindingStatus(id, status);
      await load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const startPromote = async (id: string) => {
    setPromoting(true);
    try {
      const entry = await previewPromotion(id);
      setPreview({ id, entry });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setPromoting(false);
    }
  };

  const confirmPromote = async () => {
    if (!preview) return;
    setPromoting(true);
    try {
      await confirmPromotion(preview.id, preview.entry);
      setPreview(null);
      await load();
      toast.success("Saved to the shared library: reusable on future projects.");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setPromoting(false);
    }
  };

  const saveAnswer = async (id: string) => {
    try {
      await answerQuestion(id, answers[id] ?? "");
      await load();
      toast.success("Answer saved.");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const onDismissQuestion = async (id: string) => {
    try {
      await dismissQuestion(id);
      await load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  if (loading) return <LoadingState />;

  const active = findings.filter((f) => f.status !== "dismissed");
  const openQuestions = questions.filter((q) => q.status !== "dismissed");

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-3">
          <Microscope className="h-5 w-5 text-primary" />
          <h3 className="heading-md">Run research to turn your open questions into evidence</h3>
        </div>
        <div className="mb-5">
          <ResearchValue clarify={clarify} full={full} />
        </div>
        <button onClick={run} disabled={busy} className="btn-primary">
          {busy ? (
            <RefreshCw className="h-4 w-4 mr-1.5 animate-spin" />
          ) : (
            <Microscope className="h-4 w-4 mr-1.5" />
          )}
          {findings.length ? "Run research again" : "Run research"}
        </button>
      </div>

      <ResearchGapsPanel projectId={projectId} entitled={entitled} onResearched={load} />

      {active.length > 0 && (
        <div className="space-y-3">
          <h3 className="heading-md">Findings</h3>
          {active.map((f) => (
            <ResearchFindingCard key={f.id} finding={f}>
              <div className="flex gap-2 mt-4 flex-wrap">
                {f.status === "proposed" && (
                  <>
                    <button onClick={() => setStatus(f.id, "accepted")} className="btn-secondary text-sm">
                      <Check className="h-4 w-4 mr-1" /> Accept
                    </button>
                    <button onClick={() => setStatus(f.id, "dismissed")} className="inline-flex items-center px-3 py-2 text-sm text-foreground/60 hover:text-foreground transition-colors">
                      <X className="h-4 w-4 mr-1" /> Dismiss
                    </button>
                  </>
                )}
                {f.status === "accepted" && (
                  <>
                    <button onClick={() => startPromote(f.id)} disabled={promoting} className="btn-secondary text-sm">
                      <Library className="h-4 w-4 mr-1" /> Save to shared library
                    </button>
                    <button onClick={() => setStatus(f.id, "proposed")} className="inline-flex items-center px-3 py-2 text-sm text-foreground/60 hover:text-foreground transition-colors">
                      Undo accept
                    </button>
                  </>
                )}
              </div>

              {/* De-identified promotion preview (gate 2 — owner confirms) */}
              {preview?.id === f.id && (
                <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <p className="text-xs font-medium text-primary mb-2">
                    De-identified for the shared library. Review before saving:
                  </p>
                  <p className="text-sm font-medium">{preview.entry.title}</p>
                  <p className="text-sm text-foreground/70 mt-1">{preview.entry.summary}</p>
                  <div className="flex gap-2 mt-3">
                    <button onClick={confirmPromote} disabled={promoting} className="btn-primary text-sm">
                      {promoting ? <RefreshCw className="h-4 w-4 mr-1 animate-spin" /> : <Library className="h-4 w-4 mr-1" />}
                      Confirm &amp; save
                    </button>
                    <button onClick={() => setPreview(null)} disabled={promoting} className="inline-flex items-center px-3 py-2 text-sm text-foreground/60 hover:text-foreground transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </ResearchFindingCard>
          ))}
        </div>
      )}

      {openQuestions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-foreground/40" />
            <h3 className="heading-md">Questions to close the gaps</h3>
          </div>
          {openQuestions.map((q) => (
            <div key={q.id} className="glass-card p-5">
              <p className="body-md font-medium">{q.question}</p>
              {q.rationale && <p className="text-sm text-foreground/60 mt-1">{q.rationale}</p>}
              <textarea
                className="input mt-3"
                rows={2}
                placeholder="Your answer…"
                defaultValue={q.answer ?? ""}
                onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
              />
              <div className="flex gap-2 mt-2">
                <button onClick={() => saveAnswer(q.id)} className="btn-secondary text-sm">
                  {q.status === "answered" ? "Update answer" : "Save answer"}
                </button>
                <button onClick={() => onDismissQuestion(q.id)} className="inline-flex items-center px-3 py-2 text-sm text-foreground/60 hover:text-foreground transition-colors">
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {findings.length > 0 && (
        <p className="text-sm text-foreground/50">
          Accepted findings are folded into your next Clarify/Leverage run as cited, verified
          evidence. Re-run the full report to see them applied.
        </p>
      )}
    </div>
  );
};

export default ResearchTab;
