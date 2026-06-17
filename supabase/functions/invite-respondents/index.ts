// POST /invite-respondents   (owner-only, verify_jwt=true)
// Manages respondent invitations for a project the caller is a member of:
//   { action: "invite", projectId, emails: string[], note? }  -> insert + email
//   { action: "resend", invitationId }                         -> new token + email
//   { action: "revoke", invitationId }                         -> status = revoked
import { createClient } from "npm:@supabase/supabase-js@^2";
import { corsHeaders, json } from "../_shared/cors.ts";
import { generateToken, hashToken } from "../_shared/token.ts";
import { sendBrevoEmail } from "../_shared/email.ts";
import { buildRespondentPrepPrompt } from "../_shared/clear/prep-prompt.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const PUBLIC_APP_URL = Deno.env.get("PUBLIC_APP_URL") ?? "https://clear-framework.com";

const admin = createClient(SUPABASE_URL, SERVICE_KEY);

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

/** The project's behaviour-change challenge — context for the respondent prep prompt. */
async function loadChallenge(projectId: string): Promise<string | undefined> {
  const { data } = await admin
    .from("project_inputs")
    .select("challenge")
    .eq("project_id", projectId)
    .maybeSingle();
  return data?.challenge ?? undefined;
}

function inviteEmail(opts: {
  projectName: string;
  inviterName: string;
  link: string;
  note?: string;
  challenge?: string;
  targetGroup?: string;
}) {
  const { projectName, inviterName, link, note, challenge, targetGroup } = opts;
  const subject = `${inviterName} invited you to help shape "${projectName}"`;
  const noteHtml = note ? `<p style="margin:16px 0;padding:12px 16px;background:#f5f5f4;border-radius:8px">${escapeHtml(note)}</p>` : "";

  // A ready-made prompt the respondent can paste into their own AI assistant to
  // turn their notes/documents into a clear contribution before opening the form.
  const prepPrompt = challenge
    ? buildRespondentPrepPrompt({ projectName, challenge, targetGroup }, "en")
    : "";
  const promptHtml = prepPrompt
    ? `<p style="margin:24px 0 8px;font-size:14px"><strong>Short on time?</strong> Paste this into your AI assistant (ChatGPT, Claude, Copilot) with any notes you have — it'll help you prepare your input:</p>
    <pre style="white-space:pre-wrap;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px;line-height:1.5;background:#f5f5f4;border:1px solid #e7e5e4;border-radius:8px;padding:12px;color:#1c1917">${escapeHtml(prepPrompt)}</pre>`
    : "";
  const promptText = prepPrompt
    ? `\n\nShort on time? Paste this into your AI assistant to prepare your input:\n\n${prepPrompt}\n`
    : "";

  const html = `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:520px;margin:0 auto;color:#1c1917">
    <p>Hi,</p>
    <p><strong>${escapeHtml(inviterName)}</strong> invited you to share your input on a CLEAR project: <strong>${escapeHtml(projectName)}</strong>.</p>
    ${noteHtml}
    <p>You don't need an account — just open the link below to review the current thinking, react to it, and add your perspective. It only takes a few minutes.</p>
    <p style="margin:24px 0">
      <a href="${link}" style="background:#0f766e;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;display:inline-block">Share your input</a>
    </p>
    ${promptHtml}
    <p style="color:#78716c;font-size:13px">This link is personal to you and expires in 30 days. If the button doesn't work, paste this into your browser:<br>${link}</p>
  </div>`;
  const text = `${inviterName} invited you to share your input on the CLEAR project "${projectName}".`
    + (note ? `\n\nNote: ${note}` : "")
    + promptText
    + `\n\nOpen your personal link (expires in 30 days):\n${link}`;
  return { subject, html, text };
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const jwt = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!jwt) return json({ error: "Unauthorized" }, 401);
    const { data: userData } = await admin.auth.getUser(jwt);
    const user = userData.user;
    if (!user) return json({ error: "Unauthorized" }, 401);

    const inviterName =
      (user.user_metadata?.full_name as string | undefined) || user.email || "A CLEAR user";

    // Load a project and confirm the caller is a member of its workspace.
    async function assertMember(projectId: string) {
      const { data: project } = await admin.from("projects").select("*").eq("id", projectId).single();
      if (!project) return null;
      const { data: membership } = await admin
        .from("memberships")
        .select("user_id")
        .eq("workspace_id", project.workspace_id)
        .eq("user_id", user.id)
        .maybeSingle();
      return membership ? project : null;
    }

    const body = await req.json();
    const action = body.action ?? "invite";

    if (action === "invite") {
      const projectId: string | undefined = body.projectId;
      const emails: string[] = Array.isArray(body.emails) ? body.emails : [];
      const note: string | undefined = body.note ? String(body.note) : undefined;
      if (!projectId || emails.length === 0) return json({ error: "Bad request" }, 400);

      const project = await assertMember(projectId);
      if (!project) return json({ error: "Forbidden" }, 403);

      const challenge = await loadChallenge(projectId);

      const results: { email: string; status: string; invitationId?: string; error?: string }[] = [];
      for (const raw of emails) {
        const email = String(raw).trim().toLowerCase();
        if (!email || !email.includes("@")) continue;

        // Insert-only on (project_id, email): re-inviting an existing email is a
        // no-op here and routes the owner to "resend".
        const { data: existing } = await admin
          .from("project_invitations")
          .select("id")
          .eq("project_id", projectId)
          .eq("email", email)
          .maybeSingle();
        if (existing) {
          results.push({ email, status: "already_invited", invitationId: existing.id });
          continue;
        }

        const token = generateToken();
        const { data: inv, error } = await admin
          .from("project_invitations")
          .insert({
            project_id: projectId,
            email,
            token_hash: await hashToken(token),
            invited_by: user.id,
            note: note ?? null,
          })
          .select("id")
          .single();
        if (error || !inv) {
          results.push({ email, status: "error", error: error?.message ?? "insert failed" });
          continue;
        }

        try {
          await sendBrevoEmail({
            to: email,
            ...inviteEmail({
              projectName: project.name,
              inviterName,
              link: `${PUBLIC_APP_URL}/respond/${token}`,
              note,
              challenge,
              targetGroup: project.target_group ?? undefined,
            }),
          });
          results.push({ email, status: "sent", invitationId: inv.id });
        } catch (e) {
          // Keep the row; the owner can resend once the sender is configured.
          results.push({ email, status: "email_failed", invitationId: inv.id, error: (e as Error).message });
        }
      }
      return json({ ok: true, results });
    }

    if (action === "resend" || action === "revoke") {
      const invitationId: string | undefined = body.invitationId;
      if (!invitationId) return json({ error: "Bad request" }, 400);
      const { data: inv } = await admin
        .from("project_invitations")
        .select("*")
        .eq("id", invitationId)
        .single();
      if (!inv) return json({ error: "Not found" }, 404);
      const project = await assertMember(inv.project_id);
      if (!project) return json({ error: "Forbidden" }, 403);

      if (action === "revoke") {
        await admin.from("project_invitations").update({ status: "revoked" }).eq("id", invitationId);
        return json({ ok: true });
      }

      // resend: issue a fresh token, reopen, and re-send.
      const token = generateToken();
      await admin
        .from("project_invitations")
        .update({
          token_hash: await hashToken(token),
          status: "pending",
          last_sent_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + THIRTY_DAYS_MS).toISOString(),
        })
        .eq("id", invitationId);
      await sendBrevoEmail({
        to: inv.email,
        ...inviteEmail({
          projectName: project.name,
          inviterName,
          link: `${PUBLIC_APP_URL}/respond/${token}`,
          note: inv.note ?? undefined,
          challenge: await loadChallenge(inv.project_id),
          targetGroup: project.target_group ?? undefined,
        }),
      });
      return json({ ok: true });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
