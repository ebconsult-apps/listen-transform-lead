import { useCallback, useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Play, FileDown, RefreshCw, Pencil, AlertTriangle } from "lucide-react";
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
import { approveClarify, getClarifyApproval, getClarifyApprovedAt } from "@/lib/clarify";
import type { ClarifyOutput, ExperimentOutput, LeverageFull, LeverageTeaser, RunPhase } from "@/lib/clear/types";
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
import WorkflowStepper from "@/components/product/WorkflowStepper";
import { stepDoneMap, stepUnlockedMap, furthestStep, isStale, type StepId, type StepDef } from "@/lib/clear/steps";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exportReportMarkdown } from "@/lib/export";
import { toast } from "sonner";

// The four linear phases shown in the stepper. Research/Collaborate are auxiliary
// (no ordering, no status gate) and stay as secondary tabs within the report view.
const STEPS: StepDef[] = [
  { id: "clarify", label: "Clarify", token: "--phase-c" },
  { id: "leverage", label: "Leverage", token: "--phase-l" },
  { id: "full", label: "Full Report", token: "--phase-l" },
  { id: "experiment", label: "Experiment", token: "--phase-e" },
];

// Non-destructive "an earlier step changed, this output may be outdated" notice.
const StaleBanner = ({
  message,
  label,
  onRerun,
  busy,
}: {
  message: string;
  label?: string;
  onRerun?: () => void;
  busy?: boolean;
}) => (
  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-4 no-print">
    <p className="flex items-center gap-2 font-medium text-amber-700">
      <AlertTriangle className="h-4 w-4 shrink-0" /> {message}
    </p>
    {onRerun && label && (
      <button onClick={onRerun} disabled={busy} className="btn-secondary shrink-0">
        <RefreshCw className={`h-4 w-4 mr-1.5 ${busy ? "animate-spin" : ""}`} /> {label}
      </button>
    )}
  </div>
);

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
  // null = follow the data (show the furthest-reached step); a value = pinned by a stepper click.
  const [activeStep, setActiveStep] = useState<StepId | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  // Per-phase "last produced at" timestamps, for non-destructive staleness checks.
  const [clarifyApprovedAt, setClarifyApprovedAt] = useState<string | null>(null);
  const [teaserAt, setTeaserAt] = useState<string | null>(null);
  const [fullAt, setFullAt] = useState<string | null>(null);
  const [experimentAt, setExperimentAt] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    const [proj, input, runs, approved, approvedAt] = await Promise.all([
      getProject(id),
      getProjectInput(id),
      listRuns(id),
      getClarifyApproval(id),
      getClarifyApprovedAt(id),
    ]);
    setProject(proj);
    setProjectInput(input);
    setClarifyRun(latestOutput<ClarifyOutput>(runs, "clarify"));
    setApproval(approved);
    setClarifyApprovedAt(approvedAt);
    setTeaser(latestOutput<LeverageTeaser>(runs, "leverage_teaser"));
    setFull(latestOutput<LeverageFull>(runs, "leverage_full"));
    setExperimentOutput(latestOutput<ExperimentOutput>(runs, "experiment"));
    const lastAt = (phase: RunPhase) => {
      const m = runs.filter((r) => r.phase === phase);
      return m.length ? m[m.length - 1].created_at : null;
    };
    setTeaserAt(lastAt("leverage_teaser"));
    setFullAt(lastAt("leverage_full"));
    setExperimentAt(lastAt("experiment"));
    const [ent, unlock] = await Promise.all([getEntitlement(proj.workspace_id), getUnlock(proj.id)]);
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
      setActiveStep(null); // approval committed → return to the latest view
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
    return <div className="max-w-3xl mx-auto px-6 py-10 animate-pulse text-foreground/50">Loading…</div>;
  }
  if (!project) return null;

  const clarify = approval ?? clarifyRun;
  const hasClarify = Boolean(clarify);
  const isApproved = Boolean(approval);
  const hasTeaser = Boolean(teaser);
  const showFull = (entitled || devUnlocked) && full;
  const canExperiment = Boolean((entitled || devUnlocked) && full);
  const canResearch = entitled || devUnlocked;
  const isRunning = project.status === "running" || busy;

  // Step status, derived from data already in memory (pure helpers — see clear/steps.ts).
  const stepFlags = {
    isApproved,
    hasTeaser,
    showFull: Boolean(showFull),
    canExperiment,
    hasExperiment: Boolean(experimentOutput),
  };
  const stepDone = stepDoneMap(stepFlags);
  const stepUnlocked = stepUnlockedMap(stepFlags);
  const furthest = furthestStep(stepDone, stepUnlocked);
  const effectiveStep: StepId = activeStep ?? furthest;
  // Clicking the current/furthest step clears the pin (back to auto); otherwise pin it.
  const onStepClick = (target: StepId) => setActiveStep(target === furthest ? null : target);

  const showReview = hasClarify && (!isApproved || effectiveStep === "clarify");

  // A downstream phase is stale if an upstream phase was (re)produced after it.
  const leverageStale = isStale(clarifyApprovedAt, teaserAt);
  const fullStale = isStale(teaserAt, fullAt);
  const experimentStale = isStale(fullAt, experimentAt);

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
      <SEO title={`${project.name} — CLEAR`} description="CLEAR project report." path={`/app/projects/${project.id}`} noindex />

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
        {hasClarify && (
          <WorkflowStepper
            steps={STEPS}
            effectiveStep={effectiveStep}
            done={stepDone}
            unlocked={stepUnlocked}
            onStepClick={onStepClick}
          />
        )}
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

      {/* Step 1 — review / edit / approve Clarify (also the re-open-Clarify surface) */}
      {showReview && clarify && (
        <ClarifyReview
          initial={clarify}
          busy={isRunning}
          onApprove={onApproveClarify}
          onReRun={onRunClarify}
          onCancel={isApproved ? () => setActiveStep(null) : undefined}
        />
      )}

      {/* Step 2 — approved, awaiting Leverage */}
      {isApproved && !hasTeaser && effectiveStep === "leverage" && clarify && (
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
                  <button onClick={() => setActiveStep("clarify")} disabled={busy} className="btn-secondary">
                    <Pencil className="h-4 w-4 mr-1.5" /> Edit Clarify
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Steps 2–4 — teaser / full report / experiment, navigated via the stepper */}
      {isApproved && hasTeaser && clarify && effectiveStep !== "clarify" &&
        (effectiveStep === "experiment" ? (
          <div className="space-y-6">
            {experimentStale && (
              <StaleBanner message="Clarify or Leverage changed after this experiment was generated — its candidates may be based on older inputs." />
            )}
            {canExperiment && teaser && full ? (
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
          </div>
        ) : (
          <Tabs defaultValue="report">
            <TabsList className="mb-6 no-print">
              <TabsTrigger value="report">Report</TabsTrigger>
              <TabsTrigger value="research" disabled={!canResearch}>Research</TabsTrigger>
              <TabsTrigger value="collaborate">Collaborate</TabsTrigger>
            </TabsList>

            <TabsContent value="report">
              <div className="space-y-8">
                {leverageStale && (
                  <StaleBanner
                    message="Clarify changed after the Leverage map was generated — it may be outdated."
                    label="Re-generate Leverage"
                    onRerun={onRegenerateLeverage}
                    busy={busy}
                  />
                )}
                {effectiveStep === "full" && fullStale && (
                  <StaleBanner
                    message="Leverage changed after the full report was generated — it may be outdated."
                    label="Re-generate report"
                    onRerun={onGenerateFull}
                    busy={busy}
                  />
                )}
                <ClarifyCard clarify={clarify} />
                <div className="flex gap-2 no-print -mt-4">
                  <button onClick={() => setActiveStep("clarify")} disabled={busy} className="btn-secondary text-sm">
                    <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit Clarify
                  </button>
                  <button onClick={onRegenerateLeverage} disabled={busy} className="btn-secondary text-sm">
                    <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Re-generate Leverage
                  </button>
                </div>

                <TeaserReport teaser={teaser!} />

                {effectiveStep === "full" &&
                  (showFull ? (
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
                  ))}
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
          </Tabs>
        ))}
    </div>
  );
};

export default ProjectDetail;
