/**
 * Seeded datasets for dev/QA mode. The default "seeded" dataset puts one project
 * in every product state into a single workspace, so they all show up in the
 * normal /app dashboard and you click into each to review that state. "empty" is
 * a fresh workspace with no projects (the dashboard empty state).
 *
 * All AI `output` reuses the authored CLEAR fixtures verbatim (see ./fixtures),
 * so seeded reports are identical to a real stub run. Pure builders — `buildDataset`
 * returns a fresh deep structure each call so resets/writes never alias.
 */
import type {
  AssumptionGapRow,
  DocumentRow,
  Entitlement,
  InterventionCandidateRow,
  KnowledgeEntryRow,
  LeverageReaction,
  Project,
  ProjectContribution,
  ProjectInput,
  ProjectInvitation,
  ProjectUnlock,
  ResearchFindingRow,
  ResearchQuestionRow,
  Run,
  TestCardRow,
  Workspace,
  ExperimentDesign,
} from "@/lib/db";
import type { ClarifyOutput, ProjectStatus, RunPhase } from "@/lib/clear/types";
import { MOCK_USER_ID } from "./mock-session";
import {
  CLARIFY,
  EXPERIMENT,
  FULL,
  RESEARCH,
  TEASER,
  candidateRows,
  findingRows,
  gapRows,
  questionRows,
} from "./fixtures";
import { daysAgoIso, uid } from "./util";

export interface MockDb {
  workspace: Workspace;
  entitlement: Entitlement;
  projects: Project[];
  inputs: Record<string, ProjectInput>;
  documents: Record<string, DocumentRow[]>;
  runs: Record<string, Run[]>;
  approvals: Record<string, ClarifyOutput | null>;
  unlocks: Record<string, ProjectUnlock>;
  invitations: Record<string, ProjectInvitation[]>;
  contributions: Record<string, ProjectContribution[]>;
  reactions: Record<string, LeverageReaction[]>;
  experimentDesigns: Record<string, ExperimentDesign | undefined>;
  candidates: Record<string, InterventionCandidateRow[]>;
  testCards: Record<string, TestCardRow[]>;
  assumptionGaps: Record<string, AssumptionGapRow[]>;
  findings: Record<string, ResearchFindingRow[]>;
  questions: Record<string, ResearchQuestionRow[]>;
  knowledgeBase: KnowledgeEntryRow[];
}

const WORKSPACE_ID = "ws-dev-0001";

function workspace(): Workspace {
  return {
    id: WORKSPACE_ID,
    name: "Dev / QA workspace",
    owner_id: MOCK_USER_ID,
    created_at: daysAgoIso(30),
  };
}

/** Free tier — per-project unlocks (below) drive who can see the full report. */
function entitlement(): Entitlement {
  return {
    workspace_id: WORKSPACE_ID,
    stripe_customer_id: null,
    stripe_subscription_id: null,
    tier: "free",
    status: "active",
    current_period_end: null,
  };
}

function project(
  id: string,
  name: string,
  status: ProjectStatus,
  targetGroup: string,
  useCase: string,
  daysAgo: number,
): Project {
  return {
    id,
    workspace_id: WORKSPACE_ID,
    name,
    target_group: targetGroup,
    use_case: useCase,
    status,
    created_by: MOCK_USER_ID,
    created_at: daysAgoIso(daysAgo),
  };
}

function input(
  projectId: string,
  challenge: string,
  stakeholders: { name?: string; role: string }[],
  timeline: string | null,
): ProjectInput {
  return { project_id: projectId, challenge, stakeholders, timeline };
}

function run(
  projectId: string,
  phase: RunPhase,
  output: unknown,
  daysAgo: number,
): Run {
  return {
    id: uid("run"),
    project_id: projectId,
    phase,
    status: "done",
    ai_mode: "stub",
    output,
    tokens_used: 0,
    cost_usd: 0,
    created_at: daysAgoIso(daysAgo),
  };
}

function unlock(projectId: string): ProjectUnlock {
  return {
    project_id: projectId,
    unlocked: true,
    stripe_payment_intent: "pi_dev_simulated",
    unlocked_at: daysAgoIso(1),
  };
}

/** The full "all states" dataset: one project per product state. */
function buildSeeded(): MockDb {
  const db: MockDb = {
    workspace: workspace(),
    entitlement: entitlement(),
    projects: [],
    inputs: {},
    documents: {},
    runs: {},
    approvals: {},
    unlocks: {},
    invitations: {},
    contributions: {},
    reactions: {},
    experimentDesigns: {},
    candidates: {},
    testCards: {},
    assumptionGaps: {},
    findings: {},
    questions: {},
    knowledgeBase: [],
  };

  const add = (p: Project, inp: ProjectInput) => {
    db.projects.push(p);
    db.inputs[p.id] = inp;
  };

  // 1 — Draft: input only, no runs (Step 0 "Run Clarify" + PrepPrompt).
  {
    const id = "proj-draft";
    add(
      project(id, "Reduce trial churn", "draft", "customers", "churn", 8),
      input(
        id,
        "Free-trial users sign up but most never reach the first 'aha' action, and ~58% never return after day one.",
        [{ name: "Sam Rivera", role: "Head of Growth" }, { role: "Lifecycle PM" }],
        "Pilot within one quarter",
      ),
    );
  }

  // 2 — Clarify ready: one clarify run, no approval (ClarifyReview).
  {
    const id = "proj-clarify-ready";
    add(
      project(id, "Onboarding activation", "clarify_ready", "customers", "onboarding", 7),
      input(
        id,
        "New customers stall during onboarding before configuring their first workspace.",
        [{ role: "Onboarding Lead" }],
        null,
      ),
    );
    db.runs[id] = [run(id, "clarify", CLARIFY, 7)];
    db.assumptionGaps[id] = gapRows(id, "clarify", CLARIFY.gapLog, 7);
  }

  // 3 — Clarify approved: clarify run + approval, awaiting Leverage.
  {
    const id = "proj-clarify-approved";
    add(
      project(id, "Policy uptake among tenants", "clarify_approved", "tenants", "policy_uptake", 6),
      input(
        id,
        "Tenants rarely opt into the new digital maintenance-request flow and keep calling the front desk.",
        [{ name: "Property Ops", role: "Operations" }],
        "Two months",
      ),
    );
    db.runs[id] = [run(id, "clarify", CLARIFY, 6)];
    db.approvals[id] = CLARIFY;
    db.assumptionGaps[id] = gapRows(id, "clarify", CLARIFY.gapLog, 6);
  }

  // 4 — Teaser (free, paywalled): clarify+approval+teaser, no unlock → blurred Paywall.
  {
    const id = "proj-teaser";
    add(
      project(id, "Compliance training completion", "teaser_ready", "employees", "compliance", 5),
      input(
        id,
        "Staff defer mandatory compliance modules until the final deadline week, creating risk and a support spike.",
        [{ role: "Compliance Manager" }, { role: "People Ops" }],
        "This quarter",
      ),
    );
    db.runs[id] = [run(id, "clarify", CLARIFY, 5), run(id, "leverage_teaser", TEASER, 5)];
    db.approvals[id] = CLARIFY;
    db.assumptionGaps[id] = gapRows(id, "clarify", CLARIFY.gapLog, 5);
  }

  // 5 — Full report (unlocked): full report + export; Research/Experiment tabs enabled.
  {
    const id = "proj-full";
    add(
      project(id, "Member retention", "full_ready", "customers", "churn", 1),
      input(
        id,
        "Members lapse after the first renewal; we want to lift second-year retention without discounting.",
        [{ name: "Dana Lee", role: "VP Membership" }, { role: "Data Analyst" }],
        "Pilot in 6 weeks",
      ),
    );
    db.runs[id] = [
      run(id, "clarify", CLARIFY, 2),
      run(id, "leverage_teaser", TEASER, 2),
      run(id, "leverage_full", FULL, 1),
    ];
    db.approvals[id] = CLARIFY;
    db.unlocks[id] = unlock(id);
    const fullGaps = [
      ...gapRows(id, "clarify", CLARIFY.gapLog, 2),
      ...gapRows(id, "leverage_full", FULL.gapLog, 1),
    ];
    // Demo one answered item with an attached document so the Open-questions
    // surface shows the resolved/answered state (and an attachment) out of the box.
    if (fullGaps[0]) {
      fullGaps[0].response =
        "Confirmed with the membership team: the day-1 baseline is a 58% drop-off (Q2 cohort export, attached).";
      fullGaps[0].status = "resolved";
      fullGaps[0].updated_at = daysAgoIso(1);
      db.documents[id] = [
        {
          id: uid("doc"),
          project_id: id,
          storage_path: `dev/${id}/q2-cohort-baseline.csv`,
          filename: "q2-cohort-baseline.csv",
          mime: "text/csv",
          bytes: 12480,
          status: "uploaded",
          extracted_text: null,
          assumption_gap_id: fullGaps[0].id,
          created_at: daysAgoIso(1),
        },
      ];
    }
    db.assumptionGaps[id] = fullGaps;
  }

  // 6 — With contributions: invitations + submitted contributions + reactions.
  {
    const id = "proj-collab";
    add(
      project(id, "Field service tool adoption", "full_ready", "employees", "onboarding", 4),
      input(
        id,
        "Field technicians keep using the old paper workflow instead of the new mobile app.",
        [{ name: "Jordan Pak", role: "Field Ops Director" }],
        "Rollout this half",
      ),
    );
    const teaserRun = run(id, "leverage_teaser", TEASER, 4);
    db.runs[id] = [run(id, "clarify", CLARIFY, 4), teaserRun, run(id, "leverage_full", FULL, 3)];
    db.approvals[id] = CLARIFY;
    db.unlocks[id] = unlock(id);

    const invPending: ProjectInvitation = {
      id: uid("inv"),
      project_id: id,
      email: "tech.lead@field.example",
      status: "pending",
      invited_by: MOCK_USER_ID,
      note: "Would love your take on the rollout barriers.",
      created_at: daysAgoIso(3),
      expires_at: daysAgoIso(-11),
      last_sent_at: daysAgoIso(3),
    };
    const invOpened: ProjectInvitation = {
      ...invPending,
      id: uid("inv"),
      email: "dispatch@field.example",
      status: "opened",
      note: null,
    };
    const invSubmitted: ProjectInvitation = {
      ...invPending,
      id: uid("inv"),
      email: "senior.tech@field.example",
      status: "submitted",
      note: null,
    };
    db.invitations[id] = [invPending, invOpened, invSubmitted];

    db.contributions[id] = [
      {
        id: uid("contrib"),
        project_id: id,
        invitation_id: invSubmitted.id,
        respondent_name: "Senior Technician",
        answers: {
          perspective: "The app takes too many taps to log a job compared to the paper form.",
          barriers: "No signal in basements; the app can't save offline so we lose entries.",
          ideas: "Offline mode and a one-tap 'job done' button would change everything.",
        },
        status: "submitted",
        submitted_at: daysAgoIso(2),
        created_at: daysAgoIso(3),
        updated_at: daysAgoIso(2),
      },
    ];

    db.reactions[id] = [1, 2, 3].map((rank) => ({
      id: uid("react"),
      project_id: id,
      invitation_id: invSubmitted.id,
      run_id: teaserRun.id,
      point_rank: rank,
      reaction: rank === 1 ? "resonates" : rank === 2 ? "unsure" : "missing",
      note: rank === 3 ? "The offline barrier isn't represented here." : null,
    }));

    db.assumptionGaps[id] = gapRows(id, "leverage_full", FULL.gapLog, 3);
  }

  // 7 — Experiments populated: candidates (incl. APEASE-parked), test cards, design, gaps.
  {
    const id = "proj-experiment";
    add(
      project(id, "Energy-saving behaviour", "experiment_design", "citizens", "policy_uptake", 2),
      input(
        id,
        "Residents leave heating high with windows open; we want a low-cost nudge programme.",
        [{ name: "City Sustainability", role: "Programme Lead" }],
        "Winter pilot",
      ),
    );
    db.runs[id] = [
      run(id, "clarify", CLARIFY, 4),
      run(id, "leverage_teaser", TEASER, 4),
      run(id, "leverage_full", FULL, 3),
      run(id, "experiment", EXPERIMENT, 2),
    ];
    db.approvals[id] = CLARIFY;
    db.unlocks[id] = unlock(id);
    db.candidates[id] = candidateRows(id, 2);
    db.experimentDesigns[id] = {
      project_id: id,
      envelope: { budget: "€5k", people: "1 analyst, 1 comms", time: "8 weeks" },
      status: "design",
      updated_at: daysAgoIso(2),
    };
    const firstCandidate = db.candidates[id][0];
    db.testCards[id] = [
      {
        id: uid("card"),
        project_id: id,
        candidate_id: firstCandidate?.id ?? null,
        leverage_point: "Friction at the moment of action",
        hypothesis: "Pre-filling the blocking step lifts completion by 10pp.",
        action: "Ship pre-fill behind a flag to 50% of new residents.",
        metric: "First-action completion rate",
        threshold: "+10pp vs control",
        duration: "4 weeks",
        risk_level: "low",
        kr_ref: "KR1",
        ethics_notes: "Reversible; values are user-editable before confirm.",
        calendar_week: 1,
        owner_role: "Lifecycle PM",
        status: "planned",
        results: null,
        created_at: daysAgoIso(2),
        updated_at: daysAgoIso(2),
      },
      {
        id: uid("card"),
        project_id: id,
        candidate_id: null,
        leverage_point: "No environmental cue",
        hypothesis: "A cue anchored to a weekly routine raises follow-through.",
        action: "Add one reminder tied to Monday building comms.",
        metric: "Weekly action rate",
        threshold: "+5pp",
        duration: "6 weeks",
        risk_level: "medium",
        kr_ref: "KR2",
        ethics_notes: "Frequency capped to avoid notification fatigue.",
        calendar_week: 3,
        owner_role: "Comms",
        status: "running",
        results: null,
        created_at: daysAgoIso(2),
        updated_at: daysAgoIso(1),
      },
    ];
    db.assumptionGaps[id] = [
      ...gapRows(id, "leverage_full", FULL.gapLog, 3),
      ...gapRows(id, "experiment", EXPERIMENT.gapLog, 2),
    ];
  }

  // 8 — Research findings: mixed-status findings, questions, a knowledge-base entry.
  {
    const id = "proj-research";
    add(
      project(id, "Vaccination reminder uptake", "full_ready", "citizens", "policy_uptake", 3),
      input(
        id,
        "Eligible residents miss seasonal vaccination despite reminders; we want evidence-based nudges.",
        [{ name: "Public Health", role: "Behavioural Lead" }],
        "Ahead of next season",
      ),
    );
    db.runs[id] = [
      run(id, "clarify", CLARIFY, 5),
      run(id, "leverage_teaser", TEASER, 5),
      run(id, "leverage_full", FULL, 4),
      run(id, "research", RESEARCH, 3),
    ];
    db.approvals[id] = CLARIFY;
    db.unlocks[id] = unlock(id);

    const findings = findingRows(id, 3);
    // Spread across the lifecycle so the Research tab shows every state.
    if (findings[0]) findings[0].status = "accepted";
    if (findings[1]) {
      findings[1].status = "promoted";
      findings[1].shared_finding_id = "kb-dev-0001";
    }
    if (findings[3]) findings[3].status = "dismissed";
    db.findings[id] = findings;

    const questions = questionRows(id, 3);
    if (questions[0]) {
      questions[0].status = "answered";
      questions[0].answer = "The Monday clinic newsletter — almost everyone opens it.";
    }
    db.questions[id] = questions;

    db.assumptionGaps[id] = [
      ...gapRows(id, "leverage_full", FULL.gapLog, 4),
      ...gapRows(id, "research", RESEARCH.gapLog, 3),
    ];

    db.knowledgeBase = [
      {
        id: "kb-dev-0001",
        kind: "promoted",
        title: "Implementation intentions beat generic reminders",
        summary:
          "Anchoring a new action to an existing routine reliably increases follow-through versus standalone reminders.",
        tags: { topic: "cue", comBComponent: "opportunity_physical" },
        citations: RESEARCH.findings[1]?.citations ?? [],
        evidence_strength: "V",
        origin_note: "Promoted from a project finding (de-identified).",
        created_by: MOCK_USER_ID,
        review_status: "approved",
        created_at: daysAgoIso(2),
        updated_at: daysAgoIso(2),
      },
    ];
  }

  // 9 — Error state: a run that failed (dashboard error chip + detail error state).
  {
    const id = "proj-error";
    add(
      project(id, "Stalled data import", "error", "customers", "other", 9),
      input(id, "A document import failed mid-run; surfaces the error state.", [{ role: "Owner" }], null),
    );
  }

  return db;
}

function buildEmpty(): MockDb {
  return {
    workspace: workspace(),
    entitlement: entitlement(),
    projects: [],
    inputs: {},
    documents: {},
    runs: {},
    approvals: {},
    unlocks: {},
    invitations: {},
    contributions: {},
    reactions: {},
    experimentDesigns: {},
    candidates: {},
    testCards: {},
    assumptionGaps: {},
    findings: {},
    questions: {},
    knowledgeBase: [],
  };
}

export function buildDataset(id: string): MockDb {
  return id === "empty" ? buildEmpty() : buildSeeded();
}
