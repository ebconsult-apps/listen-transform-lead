import { useCallback, useEffect, useMemo, useState } from "react";
import { Mail, RefreshCw, Send, Trash2, MessageSquare } from "lucide-react";
import {
  inviteRespondents,
  listContributions,
  listInvitations,
  listReactions,
  resendInvitation,
  revokeInvitation,
} from "@/lib/collab";
import type { LeverageReaction, ProjectContribution, ProjectInvitation } from "@/lib/db";
import { toast } from "sonner";

const REACTION_LABEL: Record<string, string> = {
  resonates: "resonates",
  unsure: "not sure",
  missing: "missing something",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Invited",
  opened: "Opened",
  submitted: "Submitted",
  revoked: "Revoked",
};

/**
 * Owner view: invite respondents, track invitations, and read submitted
 * contributions + a per-point reaction summary. Surfaces a "re-run to incorporate"
 * CTA when input has been submitted since the last analysis run.
 */
const CollaborateTab = ({
  projectId,
  lastTeaserAt,
  onRerun,
  busy,
}: {
  projectId: string;
  lastTeaserAt: string | null;
  onRerun: () => void | Promise<void>;
  busy: boolean;
}) => {
  const [invitations, setInvitations] = useState<ProjectInvitation[]>([]);
  const [contributions, setContributions] = useState<ProjectContribution[]>([]);
  const [reactions, setReactions] = useState<LeverageReaction[]>([]);
  const [emails, setEmails] = useState("");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    const [inv, contribs, rx] = await Promise.all([
      listInvitations(projectId),
      listContributions(projectId),
      listReactions(projectId),
    ]);
    setInvitations(inv);
    setContributions(contribs);
    setReactions(rx);
  }, [projectId]);

  useEffect(() => {
    load().catch((e) => toast.error(e.message));
  }, [load]);

  const submitted = useMemo(
    () => contributions.filter((c) => c.status === "submitted"),
    [contributions],
  );

  const newSinceRun = useMemo(
    () =>
      submitted.filter((c) => c.submitted_at && (!lastTeaserAt || c.submitted_at > lastTeaserAt)).length,
    [submitted, lastTeaserAt],
  );

  const reactionsByRank = useMemo(() => {
    const map = new Map<number, Record<string, number>>();
    for (const r of reactions) {
      const counts = map.get(r.point_rank) ?? { resonates: 0, unsure: 0, missing: 0 };
      counts[r.reaction] += 1;
      map.set(r.point_rank, counts);
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, [reactions]);

  const onInvite = async () => {
    const list = emails.split(/[\s,;]+/).map((e) => e.trim().toLowerCase()).filter((e) => e.includes("@"));
    if (list.length === 0) {
      toast.error("Enter at least one email address.");
      return;
    }
    setSending(true);
    try {
      const results = await inviteRespondents(projectId, list, note || undefined);
      const sent = results.filter((r) => r.status === "sent").length;
      const failed = results.filter((r) => r.status === "email_failed" || r.status === "error");
      const already = results.filter((r) => r.status === "already_invited").length;
      if (sent) toast.success(`Sent ${sent} invitation${sent === 1 ? "" : "s"}.`);
      if (already) toast.message(`${already} already invited. Use Resend.`);
      if (failed.length) toast.error(`${failed.length} couldn't be emailed: ${failed[0].error ?? "unknown error"}`);
      setEmails("");
      setNote("");
      await load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSending(false);
    }
  };

  const onResend = async (id: string) => {
    try {
      await resendInvitation(id);
      toast.success("Invitation resent.");
      await load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const onRevoke = async (id: string) => {
    try {
      await revokeInvitation(id);
      await load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const contributionByInvitation = (id: string) => contributions.find((c) => c.invitation_id === id);

  return (
    <div className="space-y-8">
      {/* Invite */}
      <section className="glass-card p-6 sm:p-8">
        <h3 className="heading-md mb-1">Invite respondents</h3>
        <p className="body-md mb-4">
          Email people close to the challenge. They get a private link, no account needed, to react to the map
          and add their input.
        </p>
        <textarea
          rows={2}
          className="input"
          placeholder="Email addresses, separated by commas or new lines"
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
        />
        <textarea
          rows={2}
          className="input mt-2"
          placeholder="Add a personal note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button onClick={onInvite} disabled={sending} className="btn-primary mt-3">
          <Send className="h-4 w-4 mr-1.5" /> {sending ? "Sending…" : "Send invitations"}
        </button>
      </section>

      {/* Re-run CTA */}
      {newSinceRun > 0 && (
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-between gap-4">
          <p className="font-medium text-primary">
            {newSinceRun} new contribution{newSinceRun === 1 ? "" : "s"} since the last analysis.
          </p>
          <button onClick={() => onRerun()} disabled={busy} className="btn-primary">
            <RefreshCw className={`h-4 w-4 mr-1.5 ${busy ? "animate-spin" : ""}`} /> Re-run to incorporate
          </button>
        </div>
      )}

      {/* Invitations */}
      <section className="glass-card p-6 sm:p-8">
        <h3 className="heading-md mb-4">Invitations</h3>
        {invitations.length === 0 ? (
          <p className="body-md text-foreground/50">No invitations yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {invitations.map((inv) => (
              <li key={inv.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="font-medium truncate flex items-center gap-2">
                    <Mail className="h-4 w-4 text-foreground/40 flex-shrink-0" /> {inv.email}
                  </p>
                  <p className="text-xs text-foreground/50 mt-0.5">{STATUS_LABEL[inv.status] ?? inv.status}</p>
                </div>
                {inv.status !== "revoked" && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => onResend(inv.id)} className="btn-secondary !py-1 !px-2 text-xs">
                      Resend
                    </button>
                    <button
                      onClick={() => onRevoke(inv.id)}
                      title="Revoke"
                      className="text-foreground/40 hover:text-destructive p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Reaction summary */}
      {reactionsByRank.length > 0 && (
        <section className="glass-card p-6 sm:p-8">
          <h3 className="heading-md mb-4">Reactions to the leverage map</h3>
          <ul className="space-y-2">
            {reactionsByRank.map(([rank, counts]) => (
              <li key={rank} className="text-sm flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center flex-shrink-0">
                  {rank}
                </span>
                <span className="text-foreground/70">
                  {Object.entries(counts)
                    .filter(([, n]) => n > 0)
                    .map(([k, n]) => `${n} ${REACTION_LABEL[k]}`)
                    .join(", ") || "no reactions yet"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Submitted contributions */}
      <section className="glass-card p-6 sm:p-8">
        <h3 className="heading-md mb-4">Contributions</h3>
        {submitted.length === 0 ? (
          <p className="body-md text-foreground/50">No submitted contributions yet.</p>
        ) : (
          <div className="space-y-5">
            {invitations
              .filter((inv) => contributionByInvitation(inv.id)?.status === "submitted")
              .map((inv) => {
                const c = contributionByInvitation(inv.id)!;
                const entries = Object.values(c.answers ?? {}).map((v) => String(v).trim()).filter(Boolean);
                return (
                  <div key={inv.id} className="border border-border rounded-xl p-4">
                    <p className="font-medium flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-foreground/40" />
                      {c.respondent_name?.trim() || inv.email}
                    </p>
                    {entries.length > 0 ? (
                      <ul className="mt-2 space-y-1 text-sm text-foreground/70 list-disc pl-5">
                        {entries.map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-sm text-foreground/50">Reacted to the map; no written input.</p>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </section>
    </div>
  );
};

export default CollaborateTab;
