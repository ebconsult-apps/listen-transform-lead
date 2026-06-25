import { useCallback, useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Play, FileDown, RefreshCw, Pencil } from "lucide-react";
import SEO from "@/components/SEO";
import {
  getProject,
  getProjectInput,
  getEntitlement,
  getUnlock,
  listRuns,
  type Project,
  type ProjectInput,
} from "@/lib/db";
import { runClarify, runLeverage, runFull, latestOutput } from "@/lib/clear/run";
import { approveClarify, getClarifyApproval } from "@/lib/clarify";
import type { ClarifyOutput, ExperimentOutput, LeverageFull, LeverageTeaser } from "@/lib/clear/types";
import { canViewFull } from "@/config/billing";
import TeaserReport from "@/components/product/TeaserReport";
import ClarifyCard from "@/components/product/ClarifyCard";
import ClarifyReview from "@/components/product/ClarifyReview";
import FullReport from "@/components/product/FullReport";
import Paywall from "@/components/product/Paywall";
import CollaborateTab from "@/components/product/CollaborateTab";
import ExperimentTab from "@/components/product/ExperimentTab";
import ResearchTab from "@/components/product/ResearchTab";
import PrepPromptCard from "@/components/product/PrepPromptCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exportReportMarkdown } from "@/lib/export";
import { toast } from "sonner";
import { LoadingState, ErrorState } from "@/components/ui/data-states";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [project, setProject] = useState<Project | null>(null);
  const [projectInput, setProjectInput] = useState<ProjectInput | null>(null);
  const [clarifyRun, setClarifyRun] = useState<ClarifyOutput | null>(null);
  const [approval, setApproval] = useState<ClarifyOutput | null>(null);
  const [teaser, setTeaser] = useState<LeverageTeaser | null>(null);
  const [full, setFull] = useState<LeverageFull | null>(null);
  const [experimentOutput, setExperimentOutput] = useState<ExperimentOutput | null>(null);
  const [entitled, setEntitled] = useState(false);
  const [devUnlocked, setDevUnlocked] = useState(false);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [teaserAt, setTeaserAt] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    const [proj, input, runs, approved] = await Promise.all([
      getProject(id),
      getProjectInput(id),
      listRuns(id),
      getClarifyApproval(id),
    ]);
    setProject(proj);
    setProjectInput(input);
    setClarifyRun(latestOutput<ClarifyOutput>(runs, "clarify"));
    setApproval(approved);
    setTeaser(latestOutput<LeverageTeaser>(runs, "leverage_teaser"));
    setFull(latestOutput<LeverageFull>(runs, "leverage_full"));
    setExperimentOutput(latestOutput<ExperimentOutput>(runs, "experiment"));
    const teaserRuns = runs.filter((r) => r.phase === "leverage_teaser");
    setTeaserAt(teaserRuns.length ? teaserRuns[teaserRuns.length - 1].created_at : null);
    const [ent, unlock] = await Promise.all([getEntitlement(proj.workspace_id), getUnlock(proj.id)]);
    setEntitled(canViewFull(ent, unlock));
  }, [id]);

  const reload = useCallback(() => {
    setLoadError(null);
    setLoading(true);
    load()
      .catch((e) => setLoadError((e as Error).message))
      .finally(() => setLoading(false));
  }, [load]);

  useEffect(() => {
    reload();
  }, [reload]);

  // Returning from a successful Stripe checkout → refresh entitlement + run full.
  useEffect(() => {
    if (searchParams.get("checkout") === "success") {
      toast.success("Payment received, generating your full report.");
      load();
    }
  }, [searchParams, load]);

  const run = useCallback(
    async (fn: () => Promise<void>) => {
      if (!id) return;
      setBusy(true);
      try {
        await fn();
        await load();
      } catch (e) {
        toast.error((e as Error).message);
      } finally {
        setBusy(false);
      }
    },
    [id, load],
  );

  const onRunClarify = () => run(() => runClarify(id!));
  const onRegenerateLeverage = () => run(() => runLeverage(id!));
  const onGenerateFull = useCallback(() => run(() => runFull(id!)), [run, id]);
  const onApproveClarify = (edited: ClarifyOutput) =>
    run(async () => {
      await approveClarify(id!, edited);
      await runLeverage(id!);
      setEditing(false);
    });

  // Once entitled (paid/subscribed) and the full report isn't built yet, build it.
  useEffect(() => {
    if (entitled && teaser && !full && !busy) onGenerateFull();
  }, [entitled, teaser, full, busy, onGenerateFull]);

  const onDevPreview = async () => {
    setDevUnlocked(true);
    if (!full) await onGenerateFull();
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <LoadingState />
      </div>
    );
  }
  if (loadError || !project) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ErrorState
          message={loadError ?? "This project couldn't be found."}
          onRetry={reload}
        />
      </div>
    );
  }

  const clarify = approval ?? clarifyRun;
  const hasClarify = Boolean(clarify);
  const isApproved = Boolean(approval);
  const hasTeaser = Boolean(teaser);
  const showFull = (entitled || devUnlocked) && full;
  const canExperiment = Boolean((entitled || devUnlocked) && full);
  const canResearch = entitled || devUnlocked;
  const isRunning = project.status === "running" || busy;
  const showReview = hasClarify && (!isApproved || editing);

  const ownerCtx = projectInput
    ? {
        challenge: projectInput.challenge,
        stakeholders: projectInput.stakeholders ?? [],
        timeline: projectInput.timeline ?? undefined,
        targetGroup: project.target_group ?? undefined,
        useCase: project.use_case ?? undefined,
      }
    : null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <SEO title={`${project.name}: CLEAR`} description="CLEAR project report." path={`/app/projects/${project.id}`} noindex />

      <div className="no-print">
        <Link to="/app" className="inline-flex items-center text-sm text-foreground/50 hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> All projects
        </Link>
        <div className="flex items-start justify-between gap-4 mb-8">
          <h1 className="heading-lg">{project.name}</h1>
          {showFull && (
            <div className="flex gap-2">
              <button onClick={() => window.print()} className="btn-secondary">
                <FileDown className="h-4 w-4 mr-1.5" /> PDF
              </button>
              <button onClick={() => exportReportMarkdown(project.name, clarify!, teaser!, full!)} className="btn-secondary">
                Markdown
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Step 0 — not yet run: kick off Clarify */}
      {!hasClarify && (
        <div className="space-y-6 no-print">
          <div className="glass-card p-10 text-center">
            {isRunning ? (
              <>
                <RefreshCw className="h-6 w-6 text-primary mx-auto mb-3 animate-spin" />
                <h2 className="heading-md mb-1">Running Clarify…</h2>
                <p className="body-md">Defining your measurable target. This takes a few seconds.</p>
              </>
            ) : (
              <>
                <h2 className="heading-md mb-2">Start with Clarify</h2>
                <p className="body-md mb-6">
                  Define a sharp, measurable target first. You'll review and approve the OKRs before
                  Leverage runs.
                </p>
                <button onClick={onRunClarify} disabled={busy} className="btn-primary">
                  <Play className="h-4 w-4 mr-1.5" /> Run Clarify
                </button>
              </>
            )}
          </div>
          {!isRunning && ownerCtx && <PrepPromptCard variant="owner" ctx={ownerCtx} />}
        </div>
      )}

      {/* Step 1 — review / edit / approve Clarify */}
      {showReview && clarify && (
        <ClarifyReview
          initial={clarify}
          busy={isRunning}
          onApprove={onApproveClarify}
          onReRun={onRunClarify}
          onCancel={isApproved ? () => setEditing(false) : undefined}
        />
      )}

      {/* Step 2 — approved, awaiting Leverage */}
      {isApproved && !editing && !hasTeaser && clarify && (
        <div className="space-y-6">
          <ClarifyCard clarify={clarify} />
          <div className="glass-card p-8 text-center no-print">
            {isRunning ? (
              <>
                <RefreshCw className="h-6 w-6 text-primary mx-auto mb-3 animate-spin" />
                <p className="body-md">Generating Leverage…</p>
              </>
            ) : (
              <>
                <p className="body-md mb-5">Clarify is approved. Generate the Leverage map next.</p>
                <div className="flex justify-center gap-2">
                  <button onClick={onRegenerateLeverage} disabled={busy} className="btn-primary">
                    <Play className="h-4 w-4 mr-1.5" /> Generate Leverage
                  </button>
                  <button onClick={() => setEditing(true)} disabled={busy} className="btn-secondary">
                    <Pencil className="h-4 w-4 mr-1.5" /> Edit Clarify
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Step 3 — Leverage teaser + paywall/full, with tabs */}
      {isApproved && !editing && hasTeaser && clarify && (
        <Tabs defaultValue="report">
          <TabsList className="mb-6 no-print">
            <TabsTrigger value="report">Report</TabsTrigger>
            <TabsTrigger value="research" disabled={!canResearch}>Research</TabsTrigger>
            <TabsTrigger value="collaborate">Collaborate</TabsTrigger>
            <TabsTrigger value="experiment" disabled={!canExperiment}>Experiment</TabsTrigger>
          </TabsList>

          <TabsContent value="report">
            <div className="space-y-8">
              <ClarifyCard clarify={clarify} />
              <div className="flex gap-2 no-print -mt-4">
                <button onClick={() => setEditing(true)} disabled={busy} className="btn-secondary text-sm">
                  <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit Clarify
                </button>
                <button onClick={onRegenerateLeverage} disabled={busy} className="btn-secondary text-sm">
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Re-generate Leverage
                </button>
              </div>

              <TeaserReport teaser={teaser!} />

              {showFull ? (
                <FullReport full={full!} />
              ) : isRunning && entitled ? (
                <div className="glass-card p-10 text-center">
                  <RefreshCw className="h-6 w-6 text-primary mx-auto mb-3 animate-spin" />
                  <p className="body-md">Generating your full report…</p>
                </div>
              ) : (
                <div className="relative">
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

          <TabsContent value="research">
            {canResearch ? (
              <ResearchTab projectId={project.id} onAfterRun={load} />
            ) : (
              <div className="glass-card p-10 text-center">
                <h3 className="heading-md mb-2">Research is part of a paid plan</h3>
                <p className="body-md">
                  The research agent gathers cited evidence to strengthen your Clarify and Leverage
                  analysis. Unlock the full report to use it.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="collaborate">
            <CollaborateTab projectId={project.id} lastTeaserAt={teaserAt} onRerun={onRegenerateLeverage} busy={isRunning} />
          </TabsContent>

          <TabsContent value="experiment">
            {canExperiment && clarify && teaser && full ? (
              <ExperimentTab
                projectId={project.id}
                projectName={project.name}
                projectStatus={project.status}
                clarify={clarify}
                teaser={teaser}
                full={full}
                experimentOutput={experimentOutput}
                onAfterRun={load}
              />
            ) : (
              <div className="glass-card p-10 text-center">
                <h3 className="heading-md mb-2">Unlock the full report to continue</h3>
                <p className="body-md">
                  The Experiment phase turns your leverage points into testable interventions. It
                  becomes available once the full report is unlocked.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ProjectDetail;
