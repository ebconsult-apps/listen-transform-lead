import { useCallback, useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Play, FileDown, RefreshCw } from "lucide-react";
import SEO from "@/components/SEO";
import {
  getProject,
  getEntitlement,
  getUnlock,
  listRuns,
  type Project,
} from "@/lib/db";
import { runFull, runTeaser, latestOutput } from "@/lib/clear/run";
import type { ClarifyOutput, LeverageFull, LeverageTeaser } from "@/lib/clear/types";
import { canViewFull } from "@/config/billing";
import TeaserReport from "@/components/product/TeaserReport";
import FullReport from "@/components/product/FullReport";
import Paywall from "@/components/product/Paywall";
import CollaborateTab from "@/components/product/CollaborateTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exportReportMarkdown } from "@/lib/export";
import { toast } from "sonner";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [project, setProject] = useState<Project | null>(null);
  const [clarify, setClarify] = useState<ClarifyOutput | null>(null);
  const [teaser, setTeaser] = useState<LeverageTeaser | null>(null);
  const [full, setFull] = useState<LeverageFull | null>(null);
  const [entitled, setEntitled] = useState(false);
  const [devUnlocked, setDevUnlocked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [teaserAt, setTeaserAt] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    const [proj, runs] = await Promise.all([getProject(id), listRuns(id)]);
    setProject(proj);
    setClarify(latestOutput<ClarifyOutput>(runs, "clarify"));
    setTeaser(latestOutput<LeverageTeaser>(runs, "leverage_teaser"));
    setFull(latestOutput<LeverageFull>(runs, "leverage_full"));
    const teaserRuns = runs.filter((r) => r.phase === "leverage_teaser");
    setTeaserAt(teaserRuns.length ? teaserRuns[teaserRuns.length - 1].created_at : null);
    const [ent, unlock] = await Promise.all([
      getEntitlement(proj.workspace_id),
      getUnlock(proj.id),
    ]);
    setEntitled(canViewFull(ent, unlock));
  }, [id]);

  useEffect(() => {
    load()
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [load]);

  // Returning from a successful Stripe checkout → refresh entitlement + run full.
  useEffect(() => {
    if (searchParams.get("checkout") === "success") {
      toast.success("Payment received — generating your full report.");
      load();
    }
  }, [searchParams, load]);

  const onRun = async () => {
    if (!id) return;
    setBusy(true);
    try {
      await runTeaser(id);
      await load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const onGenerateFull = useCallback(async () => {
    if (!id) return;
    setBusy(true);
    try {
      await runFull(id);
      await load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }, [id, load]);

  // Once entitled (paid/subscribed) and the full report isn't built yet, build it.
  useEffect(() => {
    if (entitled && teaser && !full && !busy) onGenerateFull();
  }, [entitled, teaser, full, busy, onGenerateFull]);

  const showFull = (entitled || devUnlocked) && full;

  const onDevPreview = async () => {
    setDevUnlocked(true);
    if (!full) await onGenerateFull();
  };

  if (loading) {
    return <div className="max-w-3xl mx-auto px-6 py-10 animate-pulse text-foreground/50">Loading…</div>;
  }
  if (!project) return null;

  const isRunning = project.status === "running" || busy;
  const hasTeaser = Boolean(clarify && teaser);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <SEO title={`${project.name} — CLEAR`} description="CLEAR project report." path={`/app/projects/${project.id}`} noindex />

      <div className="no-print">
        <Link to="/app" className="inline-flex items-center text-sm text-foreground/50 hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> All projects
        </Link>
        <div className="flex items-start justify-between gap-4 mb-8">
          <h1 className="heading-lg">{project.name}</h1>
          {hasTeaser && (
            <div className="flex gap-2">
              {showFull && (
                <>
                  <button onClick={() => window.print()} className="btn-secondary">
                    <FileDown className="h-4 w-4 mr-1.5" /> PDF
                  </button>
                  <button
                    onClick={() => exportReportMarkdown(project.name, clarify!, teaser!, full!)}
                    className="btn-secondary"
                  >
                    Markdown
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Not yet run */}
      {!hasTeaser && (
        <div className="glass-card p-10 text-center no-print">
          {isRunning ? (
            <>
              <RefreshCw className="h-6 w-6 text-primary mx-auto mb-3 animate-spin" />
              <h2 className="heading-md mb-1">Running your analysis…</h2>
              <p className="body-md">Clarify → Leverage. This takes a few seconds.</p>
            </>
          ) : (
            <>
              <h2 className="heading-md mb-2">Ready to analyze</h2>
              <p className="body-md mb-6">Run Clarify + Leverage to generate your free teaser.</p>
              <button onClick={onRun} disabled={busy} className="btn-primary">
                <Play className="h-4 w-4 mr-1.5" /> Run analysis
              </button>
            </>
          )}
        </div>
      )}

      {/* Teaser + paywall/full, with a Collaborate tab for respondent input */}
      {hasTeaser && (
        <Tabs defaultValue="report">
          <TabsList className="mb-6 no-print">
            <TabsTrigger value="report">Report</TabsTrigger>
            <TabsTrigger value="collaborate">Collaborate</TabsTrigger>
          </TabsList>

          <TabsContent value="report">
            <div className="space-y-8">
              <TeaserReport clarify={clarify!} teaser={teaser!} />

              {showFull ? (
                <FullReport full={full!} />
              ) : isRunning && entitled ? (
                <div className="glass-card p-10 text-center">
                  <RefreshCw className="h-6 w-6 text-primary mx-auto mb-3 animate-spin" />
                  <p className="body-md">Generating your full report…</p>
                </div>
              ) : (
                <div className="relative">
                  {/* Blurred locked preview behind the paywall */}
                  <div className="locked-blur" aria-hidden>
                    <div className="glass-card p-8 h-64" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <Paywall projectId={project.id} onDevPreview={onDevPreview} />
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="collaborate">
            <CollaborateTab
              projectId={project.id}
              lastTeaserAt={teaserAt}
              onRerun={onRun}
              busy={isRunning}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ProjectDetail;
