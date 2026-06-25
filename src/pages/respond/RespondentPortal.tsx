import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Upload, X, Check, Loader2 } from "lucide-react";
import SEO from "@/components/SEO";
import DictationButton from "@/components/DictationButton";
import RespondentMap, { type PointReaction } from "@/components/product/RespondentMap";
import PrepPromptCard from "@/components/product/PrepPromptCard";
import {
  RESPONDENT_PROMPTS,
  respondentLoad,
  respondentSave,
  respondentSubmit,
  respondentUpload,
  type RespondentLoad,
} from "@/lib/collab";
import type { LeverageTeaser } from "@/lib/clear/types";
import { toast } from "sonner";

const ACCEPT = ".pdf,.docx,.xlsx,.md,.txt,.csv";

/** Append a dictated segment without clobbering typed text (mirrors NewProject). */
function appendTranscript(prev: string, addition: string): string {
  const add = addition.trim();
  if (!add) return prev;
  if (!prev) return add;
  return /\s$/.test(prev) ? prev + add : `${prev} ${add}`;
}

const RespondentPortal = () => {
  const { token } = useParams<{ token: string }>();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [data, setData] = useState<RespondentLoad | null>(null);

  const [respondentName, setRespondentName] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [reactions, setReactions] = useState<Record<number, PointReaction>>({});
  const [documents, setDocuments] = useState<{ id: string; filename: string }[]>([]);
  const [consent, setConsent] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const dirtyRef = useRef(false);

  useEffect(() => {
    if (!token) return;
    respondentLoad(token)
      .then((d) => {
        setData(d);
        setRespondentName(d.existing.respondentName);
        setAnswers(d.existing.answers ?? {});
        const rx: Record<number, PointReaction> = {};
        for (const r of d.existing.reactions) {
          rx[r.point_rank] = { reaction: r.reaction, note: r.note ?? undefined };
        }
        setReactions(rx);
        setDocuments(d.existing.documents.map((doc) => ({ id: doc.id, filename: doc.filename })));
        setSubmitted(d.existing.submitted);
      })
      .catch((e) => setLoadError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  const reactionsPayload = useCallback(
    () =>
      Object.entries(reactions)
        .filter(([, v]) => v.reaction)
        .map(([rank, v]) => ({ pointRank: Number(rank), reaction: v.reaction!, note: v.note })),
    [reactions],
  );

  const save = useCallback(async () => {
    if (!token) return;
    await respondentSave(token, { respondentName, answers, reactions: reactionsPayload() });
    setSavedAt(Date.now());
  }, [token, respondentName, answers, reactionsPayload]);

  // Autosave a draft ~1.5s after the respondent stops editing.
  useEffect(() => {
    if (loading || submitted || !dirtyRef.current) return;
    const t = setTimeout(() => {
      save().catch(() => {/* draft autosave is best-effort */});
    }, 1500);
    return () => clearTimeout(t);
  }, [respondentName, answers, reactions, loading, submitted, save]);

  const markDirty = () => {
    dirtyRef.current = true;
  };

  const setAnswer = (key: string, value: string) => {
    markDirty();
    setAnswers((a) => ({ ...a, [key]: value }));
  };

  const setReaction = (rank: number, next: PointReaction) => {
    markDirty();
    setReactions((r) => ({ ...r, [rank]: next }));
  };

  const onFiles = async (list: FileList | null) => {
    if (!list || !token) return;
    setUploading(true);
    try {
      for (const file of Array.from(list)) {
        await respondentUpload(token, file);
        setDocuments((d) => [...d, { id: crypto.randomUUID(), filename: file.name }]);
      }
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async () => {
    if (!token) return;
    if (!consent) {
      toast.error("Please confirm the consent checkbox to submit.");
      return;
    }
    setSubmitting(true);
    try {
      await save();
      await respondentSubmit(token);
      setSubmitted(true);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const map = data?.map ? (data.map as LeverageTeaser) : null;

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Share your input: CLEAR" description="Contribute to a CLEAR project." path="/respond" noindex />
      <header className="border-b border-border">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4">
          <span className="font-bold tracking-tight text-lg">CLEAR</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {loading && <div className="animate-pulse text-foreground/50">Loading…</div>}

        {!loading && loadError && (
          <div className="glass-card p-8 text-center">
            <h1 className="heading-md mb-2">This link isn't available</h1>
            <p className="body-md">{loadError}</p>
          </div>
        )}

        {!loading && data && submitted && (
          <div className="glass-card p-10 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 text-primary mx-auto mb-4 flex items-center justify-center">
              <Check className="h-6 w-6" />
            </div>
            <h1 className="heading-md mb-2">Thank you</h1>
            <p className="body-md">
              Your input on <strong>{data.projectName}</strong> has been shared. You can close this page.
            </p>
          </div>
        )}

        {!loading && data && !submitted && (
          <div className="space-y-8">
            <div>
              <h1 className="heading-lg mb-2">Help shape “{data.projectName}”</h1>
              <p className="body-md">
                You've been invited to add your perspective. Review the current thinking, react to it, and share
                your own input below. There are no wrong answers. This takes a few minutes.
              </p>
            </div>

            {/* Current map + reactions */}
            {map ? (
              <section className="glass-card p-6 sm:p-8">
                <h2 className="heading-md mb-4">The current thinking</h2>
                <RespondentMap teaser={map} reactions={reactions} onChange={setReaction} />
              </section>
            ) : (
              <section className="glass-card p-6 sm:p-8">
                <p className="body-md">
                  The team is still preparing the analysis. Your input below will help shape it.
                </p>
              </section>
            )}

            {data.prepPrompt && (
              <PrepPromptCard variant="respondent" prebuilt={data.prepPrompt} />
            )}

            {/* Guided input */}
            <section className="glass-card p-6 sm:p-8 space-y-5">
              <h2 className="heading-md">Your input</h2>

              <div>
                <label className="block text-sm font-medium mb-2">Your name <span className="text-foreground/40 font-normal">(optional)</span></label>
                <input
                  className="input"
                  value={respondentName}
                  onChange={(e) => {
                    markDirty();
                    setRespondentName(e.target.value);
                  }}
                  placeholder="So the team knows who shared this"
                />
              </div>

              {RESPONDENT_PROMPTS.map((p) => (
                <div key={p.key}>
                  <label className="block text-sm font-medium mb-2">
                    {p.label} {p.hint && <span className="text-foreground/40 font-normal">: {p.hint}</span>}
                  </label>
                  <textarea
                    rows={4}
                    className="input"
                    value={answers[p.key] ?? ""}
                    onChange={(e) => setAnswer(p.key, e.target.value)}
                    placeholder="Type, or tap Dictate to speak…"
                  />
                  <div className="mt-2">
                    <DictationButton
                      onResult={(text) => setAnswer(p.key, appendTranscript(answers[p.key] ?? "", text))}
                    />
                  </div>
                </div>
              ))}
            </section>

            {/* Documents */}
            <section className="glass-card p-6 sm:p-8">
              <h2 className="heading-md mb-2">Documents <span className="text-foreground/40 font-normal text-base">(optional)</span></h2>
              <p className="body-md mb-4">Share anything relevant: notes, reports, spreadsheets.</p>
              <label className="border-dashed border-2 border-border rounded-xl flex flex-col items-center justify-center py-8 cursor-pointer hover:bg-muted/50 transition-colors">
                {uploading ? (
                  <Loader2 className="h-6 w-6 text-foreground/40 mb-2 animate-spin" />
                ) : (
                  <Upload className="h-6 w-6 text-foreground/40 mb-2" />
                )}
                <span className="text-sm text-foreground/60">{uploading ? "Uploading…" : "Click to add files"}</span>
                <input type="file" multiple accept={ACCEPT} className="hidden" disabled={uploading} onChange={(e) => onFiles(e.target.files)} />
              </label>
              {documents.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {documents.map((d) => (
                    <li key={d.id} className="flex items-center gap-2 text-sm border border-border rounded-lg px-3 py-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="truncate">{d.filename}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Consent + submit */}
            <section className="space-y-4">
              <label className="flex items-start gap-3 text-sm text-foreground/70">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <span>
                  I understand my input and any documents I share will be visible to the project team and used to
                  shape this analysis.
                </span>
              </label>
              <div className="flex items-center gap-4">
                <button onClick={onSubmit} disabled={submitting} className="btn-primary">
                  {submitting ? "Submitting…" : "Submit my input"}
                </button>
                <span className="text-xs text-foreground/40">
                  {savedAt ? "Draft saved" : "Your progress saves automatically"}
                </span>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default RespondentPortal;
