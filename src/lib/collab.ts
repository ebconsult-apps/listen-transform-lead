// Respondent collaboration — client data access + edge-function invokers.
//
// Owner-side reads go straight through RLS (member-read). All respondent *writes*
// (and the owner invite/resend/revoke actions) go through edge functions, since the
// new tables have no client write policies and respondents have no Supabase session.
import { requireSupabase } from "@/lib/supabase";
import { extractText } from "@/lib/extract-text";
import type {
  LeverageReaction,
  ProjectContribution,
  ProjectInvitation,
  ReactionValue,
} from "@/lib/db";

/** Guided prompts shown to respondents. `answers` is keyed by `key`. */
export const RESPONDENT_PROMPTS: { key: string; label: string; hint?: string }[] = [
  { key: "perspective", label: "How do you see this challenge?", hint: "What's actually going on, from where you sit?" },
  { key: "barriers", label: "What gets in the way?", hint: "Barriers, frustrations, or things that make the current behavior hard to change." },
  { key: "ideas", label: "What would help?", hint: "Ideas, examples, or what's worked before." },
];

// ── Owner-side reads ─────────────────────────────────────────────────────────

export async function listInvitations(projectId: string): Promise<ProjectInvitation[]> {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("project_invitations")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as ProjectInvitation[];
}

export async function listContributions(projectId: string): Promise<ProjectContribution[]> {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("project_contributions")
    .select("*")
    .eq("project_id", projectId)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ProjectContribution[];
}

export async function listReactions(projectId: string): Promise<LeverageReaction[]> {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("leverage_reactions")
    .select("*")
    .eq("project_id", projectId);
  if (error) throw error;
  return (data ?? []) as LeverageReaction[];
}

// ── Owner-side actions (invite-respondents fn) ───────────────────────────────

export interface InviteResult {
  email: string;
  status: "sent" | "already_invited" | "email_failed" | "error";
  invitationId?: string;
  error?: string;
}

export async function inviteRespondents(
  projectId: string,
  emails: string[],
  note?: string,
): Promise<InviteResult[]> {
  const sb = requireSupabase();
  const { data, error } = await sb.functions.invoke("invite-respondents", {
    body: { action: "invite", projectId, emails, note },
  });
  if (error) throw error;
  return (data?.results ?? []) as InviteResult[];
}

export async function resendInvitation(invitationId: string): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb.functions.invoke("invite-respondents", {
    body: { action: "resend", invitationId },
  });
  if (error) throw error;
}

export async function revokeInvitation(invitationId: string): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb.functions.invoke("invite-respondents", {
    body: { action: "revoke", invitationId },
  });
  if (error) throw error;
}

// ── Respondent portal (respondent fn; no auth session required) ──────────────

export interface RespondentReaction {
  point_rank: number;
  reaction: ReactionValue;
  note: string | null;
  run_id: string;
}

export interface RespondentLoad {
  projectName: string;
  status: string;
  currentRunId: string | null;
  /** The current leverage_teaser output (LeverageTeaser) or null if not run yet. */
  map: unknown;
  /** Ready-made "prep your input" prompt (EN + SV) for the respondent's own AI tool. */
  prepPrompt?: { en: string; sv: string };
  existing: {
    respondentName: string;
    answers: Record<string, string>;
    submitted: boolean;
    reactions: RespondentReaction[];
    documents: { id: string; filename: string; created_at: string }[];
  };
}

export async function respondentLoad(token: string): Promise<RespondentLoad> {
  const sb = requireSupabase();
  const { data, error } = await sb.functions.invoke("respondent", {
    body: { token, action: "load" },
  });
  if (error) throw new Error(await readInvokeError(error, "This link is no longer valid."));
  return data as RespondentLoad;
}

export async function respondentSave(
  token: string,
  payload: {
    respondentName?: string;
    answers?: Record<string, string>;
    reactions?: { pointRank: number; reaction: ReactionValue; note?: string }[];
  },
): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb.functions.invoke("respondent", {
    body: { token, action: "save", ...payload },
  });
  if (error) throw error;
}

export async function respondentSubmit(token: string): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb.functions.invoke("respondent", {
    body: { token, action: "submit" },
  });
  if (error) throw error;
}

/**
 * Upload a respondent document: extract its text in the browser (reusing the same
 * pipeline as the owner intake), get a signed upload URL, upload, then record the
 * row server-side with the extracted text.
 */
export async function respondentUpload(token: string, file: File): Promise<void> {
  const sb = requireSupabase();
  const extractedText = await extractText(file);

  const { data: urlData, error: urlError } = await sb.functions.invoke("respondent", {
    body: { token, action: "upload-url", filename: file.name },
  });
  if (urlError) throw urlError;
  const { path, token: uploadToken } = urlData as { path: string; token: string };

  const { error: upErr } = await sb.storage.from("documents").uploadToSignedUrl(path, uploadToken, file);
  if (upErr) throw upErr;

  const { error: completeError } = await sb.functions.invoke("respondent", {
    body: {
      token,
      action: "upload-complete",
      path,
      filename: file.name,
      mime: file.type || null,
      bytes: file.size,
      extractedText,
    },
  });
  if (completeError) throw completeError;
}

/** Supabase FunctionsHttpError hides the body; pull the server message when present. */
async function readInvokeError(error: unknown, fallback: string): Promise<string> {
  const ctx = (error as { context?: Response }).context;
  if (ctx && typeof ctx.json === "function") {
    try {
      const body = await ctx.json();
      if (body?.error) return String(body.error);
    } catch {
      /* ignore */
    }
  }
  return (error as Error)?.message || fallback;
}

// ── Engine intake helper ─────────────────────────────────────────────────────

/**
 * Render submitted respondent input (text answers + a reaction summary) as a single
 * intake document. Returns null when there's nothing submitted to add. Used by both
 * the client stub run path and mirrored by the project-run edge function.
 */
export function summarizeRespondentInput(
  contributions: ProjectContribution[],
  reactions: LeverageReaction[],
): string | null {
  const submitted = contributions.filter((c) => c.status === "submitted");
  if (submitted.length === 0) return null;
  const submittedIds = new Set(submitted.map((c) => c.invitation_id));
  const parts: string[] = [];

  for (const c of submitted) {
    const answers = Object.values(c.answers ?? {})
      .map((v) => String(v).trim())
      .filter(Boolean);
    if (answers.length === 0) continue;
    const who = c.respondent_name?.trim() || "Anonymous respondent";
    parts.push(`Respondent: ${who}\n${answers.map((a) => `- ${a}`).join("\n")}`);
  }

  const relevant = reactions.filter((r) => submittedIds.has(r.invitation_id));
  if (relevant.length) {
    const byRank = new Map<number, LeverageReaction[]>();
    for (const r of relevant) {
      const arr = byRank.get(r.point_rank) ?? [];
      arr.push(r);
      byRank.set(r.point_rank, arr);
    }
    const lines: string[] = [];
    for (const rank of [...byRank.keys()].sort((a, b) => a - b)) {
      const rs = byRank.get(rank)!;
      const counts: Record<string, number> = { resonates: 0, unsure: 0, missing: 0 };
      const notes: string[] = [];
      for (const r of rs) {
        counts[r.reaction] += 1;
        if (r.note?.trim()) notes.push(r.note.trim());
      }
      const summary = Object.entries(counts)
        .filter(([, n]) => n > 0)
        .map(([k, n]) => `${n} ${k}`)
        .join(", ");
      lines.push(
        `- Leverage point #${rank}: ${summary}${notes.length ? `. Notes: ${notes.map((n) => `"${n}"`).join("; ")}` : ""}`,
      );
    }
    parts.push(`Stakeholder reactions to the current leverage map:\n${lines.join("\n")}`);
  }

  return parts.length ? `[Respondent contributions]\n\n${parts.join("\n\n")}` : null;
}
