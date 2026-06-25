import { useCallback, useEffect, useState } from "react";
import { FlaskConical, Lock, Pencil, FileDown, RefreshCw } from "lucide-react";
import type { ClarifyOutput, ExperimentOutput, LeverageFull, LeverageTeaser, ResourceEnvelope } from "@/lib/clear/types";
import type { AssumptionGapRow, InterventionCandidateRow, TestCardRow } from "@/lib/db";
import { setProjectStatus } from "@/lib/db";
import { runExperiment } from "@/lib/clear/run";
import {
  createTestCard,
  getExperimentDesign,
  listAssumptionGaps,
  listCandidates,
  listTestCards,
  setExperimentDesignStatus,
  upsertExperimentDesign,
} from "@/lib/experiment";
import { exportReportMarkdown } from "@/lib/export";
import ResourceEnvelopeForm from "./ResourceEnvelopeForm";
import InterventionCandidatesTable from "./InterventionCandidatesTable";
import TestCardList from "./TestCardList";
import ExecutionCalendar from "./ExecutionCalendar";
import FrontlineFaq from "./FrontlineFaq";
import AssumptionsGapsLog from "./AssumptionsGapsLog";
import { toast } from "sonner";

/**
 * EXPERIMENT phase surface (post-paywall): resource envelope → APEASE-screened
 * intervention candidates → editable test cards + execution calendar → PAUSE for
 * real-world execution. The assumptions/gaps log persists across the whole cycle.
 */
const ExperimentTab = ({
  projectId,
  projectName,
  projectStatus,
  clarify,
  teaser,
  full,
  experimentOutput,
  onAfterRun,
}: {
  projectId: string;
  projectName: string;
  projectStatus: string;
  clarify: ClarifyOutput;
  teaser: LeverageTeaser;
  full: LeverageFull;
  experimentOutput: ExperimentOutput | null;
  onAfterRun: () => Promise<void> | void;
}) => {
  const [envelope, setEnvelope] = useState<ResourceEnvelope>({});
  const [designStatus, setDesignStatus] = useState<"design" | "active" | null>(null);
  const [candidates, setCandidates] = useState<InterventionCandidateRow[]>([]);
  const [cards, setCards] = useState<TestCardRow[]>([]);
  const [gaps, setGaps] = useState<AssumptionGapRow[]>([]);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [design, cands, tcards, ag] = await Promise.all([
      getExperimentDesign(projectId),
      listCandidates(projectId),
      listTestCards(projectId),
      listAssumptionGaps(projectId),
    ]);
    setEnvelope(design?.envelope ?? {});
    setDesignStatus(design?.status ?? null);
    setCandidates(cands);
    setCards(tcards);
    setGaps(ag);
  }, [projectId]);

  useEffect(() => {
    load()
      .catch((e) => toast.error((e as Error).message))
      .finally(() => setLoading(false));
  }, [load]);

  const generate = async (env: ResourceEnvelope) => {
    setBusy(true);
    try {
      await upsertExperimentDesign(projectId, env);
      await runExperiment(projectId);
      await load();
      await onAfterRun();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const promote = async (c: InterventionCandidateRow) => {
    try {
      await createTestCard(projectId, {
        candidate_id: c.id,
        leverage_point: c.title,
        action: c.description,
        hypothesis: c.barrier ? `We believe ${c.title.toLowerCase()} will ease "${c.barrier}".` : "",
        status: "planned",
      });
      await load();
      toast.success("Promoted to a test card.");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const setActive = async (active: boolean) => {
    setBusy(true);
    try {
      await setExperimentDesignStatus(projectId, active ? "active" : "design");
      await setProjectStatus(projectId, active ? "experiment_active" : "experiment_design");
      await load();
      await onAfterRun();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse text-foreground/50">Loading…</div>;
  }

  const hasCandidates = candidates.length > 0;
  const isActive = designStatus === "active" || projectStatus === "experiment_active";

  // First visit: collect the resource envelope, then generate.
  if (!hasCandidates) {
    return (
      <div className="space-y-6">
        <div className="glass-card p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-2">
            <FlaskConical className="h-5 w-5 text-primary" />
            <h3 className="heading-md">Experiment</h3>
          </div>
          <p className="body-md">
            Turn your top leverage points into the smallest tests that could disprove a hypothesis.
            We'll propose 2–3 minimal, reversible interventions per leverage point and screen them
            with APEASE, then you decide what becomes a test card.
          </p>
        </div>
        <ResourceEnvelopeForm initial={envelope} busy={busy} onGenerate={generate} />
        <AssumptionsGapsLog projectId={projectId} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isActive && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
          <p className="font-medium text-primary">⏸ Experiments are running in the real world.</p>
          <p className="text-sm text-foreground/70 mt-1">
            There is no simulating the data. Enter results in Analyse once you have them (coming next).
          </p>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h3 className="heading-md">Intervention candidates</h3>
        <div className="flex gap-2">
          <button
            onClick={() =>
              exportReportMarkdown(projectName, clarify, teaser, full, { envelope, candidates, testCards: cards, gaps })
            }
            className="btn-secondary"
          >
            <FileDown className="h-4 w-4 mr-1.5" /> Export
          </button>
          {isActive ? (
            <button onClick={() => setActive(false)} disabled={busy} className="btn-secondary">
              <Pencil className="h-4 w-4 mr-1.5" /> Keep editing
            </button>
          ) : (
            <button onClick={() => setActive(true)} disabled={busy || cards.length === 0} className="btn-primary">
              <Lock className="h-4 w-4 mr-1.5" /> Lock &amp; start running
            </button>
          )}
        </div>
      </div>

      <div className="glass-card p-6 sm:p-8">
        <p className="body-md mb-5">
          Adjust the APEASE screen as you learn. Three scores (1–5) rank ideas; three veto gates
          guard acceptability, safety, and equity. <strong>Any FAIL parks the idea regardless of its
          score</strong>: a brilliant-but-unsafe idea must not win on points.
        </p>
        <InterventionCandidatesTable candidates={candidates} onPromote={promote} onChange={load} />
      </div>

      <div className="glass-card p-6 sm:p-8">
        <h3 className="heading-md mb-4">Test cards</h3>
        <TestCardList cards={cards} onChange={load} />
      </div>

      {cards.length > 0 && (
        <div className="glass-card p-6 sm:p-8">
          <h3 className="heading-md mb-4">Execution calendar</h3>
          <ExecutionCalendar cards={cards} />
        </div>
      )}

      {experimentOutput?.faq?.length ? (
        <div className="glass-card p-6 sm:p-8">
          <h3 className="heading-md mb-4">FAQ for frontline teams</h3>
          <FrontlineFaq faq={experimentOutput.faq} />
        </div>
      ) : null}

      <AssumptionsGapsLog projectId={projectId} />

      <div className="glass-card p-6 sm:p-8 text-center">
        <RefreshCw className="h-5 w-5 text-foreground/30 mx-auto mb-2" />
        <p className="text-sm text-foreground/60">
          Experiments must run in the real world before Analyse. Lock the set when you're ready to
          execute; come back to enter results in the next phase.
        </p>
      </div>
    </div>
  );
};

export default ExperimentTab;
