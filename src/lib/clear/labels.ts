/**
 * Presentation helpers for the CLEAR methodology vocabulary — flag taxonomy,
 * COM-B components, evidence flags, behavior genres, and APEASE gates. Kept in
 * one place so the report UI, the Experiment tab, and the markdown export render
 * the same labels. Also provides back-compat normalisation for older persisted
 * runs whose `output` predates the richer shapes.
 */
import type {
  ClarifyOutput,
  ComBComponent,
  EvidenceFlag,
  FlagType,
  Gate,
  GapFlag,
  Genre,
  LeverageFull,
} from "./types";

export const FLAG_LABEL: Record<FlagType, string> = {
  assumption: "Assumption",
  gap: "Gap",
  input_needed: "Input needed",
  user_input: "User input",
  needs_input: "Needs input",
  requires_confirmation: "Requires confirmation",
};

/**
 * Default importance per flag type — higher = more urgent to put in front of the
 * owner. Confirmation/blocking input first, then gaps (missing facts), then
 * assumptions the model inferred, then soft user_input. Stored on the
 * `assumption_gaps.priority` column so ordering is data-driven (and AI-rankable
 * later); the SQL backfill in 20260626130000_assumption_gap_priority.sql mirrors
 * these exact ranks. Used to seed `priority` whenever a flag is persisted without
 * an explicit one.
 */
export const FLAG_PRIORITY: Record<FlagType, number> = {
  requires_confirmation: 5,
  needs_input: 4,
  input_needed: 4,
  gap: 3,
  assumption: 2,
  user_input: 1,
};

/** Derive the default `priority` for a flag type (0 for anything unexpected). */
export function defaultPriority(type: FlagType): number {
  return FLAG_PRIORITY[type] ?? 0;
}

export const COMB_LABEL: Record<ComBComponent, string> = {
  capability_physical: "Capability — Physical",
  capability_psychological: "Capability — Psychological",
  opportunity_physical: "Opportunity — Physical",
  opportunity_social: "Opportunity — Social",
  motivation_reflective: "Motivation — Reflective",
  motivation_automatic: "Motivation — Automatic",
};

export const EVIDENCE_LABEL: Record<EvidenceFlag, string> = {
  V: "Verified",
  A: "Assumption",
  G: "Gap",
  NA: "—",
};

export const GENRE_LABEL: Record<Genre, string> = {
  seek_information: "Seek information",
  compare: "Compare",
  decide: "Decide",
  carry_out_process: "Carry out process",
  register: "Register",
  social: "Social",
};

export const GATE_LABEL: Record<Gate, string> = {
  pass: "Pass",
  flag: "Flag",
  fail: "Fail",
};

/** Loose shape covering both the current gapLog and the legacy assumptions/gaps split. */
interface MaybeLegacyGaps {
  gapLog?: GapFlag[];
  assumptions?: string[];
  gaps?: string[];
}

/**
 * Return the flag list for a phase output, tolerating older persisted runs that
 * used `assumptions[]` + `gaps[]` instead of a unified `gapLog`.
 */
export function gapFlags(output: ClarifyOutput | LeverageFull | MaybeLegacyGaps): GapFlag[] {
  const o = output as MaybeLegacyGaps;
  if (o.gapLog && o.gapLog.length) return o.gapLog;
  const legacy: GapFlag[] = [];
  (o.assumptions ?? []).forEach((content) => legacy.push({ type: "assumption", content }));
  (o.gaps ?? []).forEach((content) => legacy.push({ type: "gap", content }));
  return legacy;
}

/** Human label for a COM-B component, tolerating legacy free-text `factor` cells. */
export function combLabel(cell: { component?: ComBComponent; factor?: string }): string {
  if (cell.component && COMB_LABEL[cell.component]) return COMB_LABEL[cell.component];
  return cell.factor ?? "—";
}
