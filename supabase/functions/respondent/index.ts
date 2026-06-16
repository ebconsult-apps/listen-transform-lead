// POST /respondent   (public, verify_jwt=false — authorized by the invitation token)
// Token-authed, action-based access for an invited respondent (no Supabase session):
//   { token, action: "load" }                                  -> project name + current map + existing draft
//   { token, action: "save", answers?, respondentName?, reactions? }
//   { token, action: "submit" }
//   { token, action: "upload-url", filename }                  -> signed upload URL
//   { token, action: "upload-complete", path, filename, mime, bytes, extractedText }
import { createClient } from "npm:@supabase/supabase-js@^2";
import { corsHeaders, json } from "../_shared/cors.ts";
import { hashToken } from "../_shared/token.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const admin = createClient(SUPABASE_URL, SERVICE_KEY);

interface Invitation {
  id: string;
  project_id: string;
  email: string;
  status: string;
  expires_at: string | null;
}

/** Resolve a raw token to a usable (non-revoked, non-expired) invitation, or null. */
async function resolveInvitation(token: unknown): Promise<Invitation | null> {
  if (!token || typeof token !== "string") return null;
  const { data: inv } = await admin
    .from("project_invitations")
    .select("id, project_id, email, status, expires_at")
    .eq("token_hash", await hashToken(token))
    .maybeSingle();
  if (!inv) return null;
  if (inv.status === "revoked") return null;
  if (inv.expires_at && new Date(inv.expires_at) < new Date()) return null;
  return inv as Invitation;
}

/** The latest leverage_teaser run — the "current map" respondents react to. */
async function currentTeaser(projectId: string): Promise<{ id: string; output: unknown } | null> {
  const { data } = await admin
    .from("runs")
    .select("id, output")
    .eq("project_id", projectId)
    .eq("phase", "leverage_teaser")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data ?? null;
}

function sanitizeFilename(name: string): string {
  return (
    name
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-zA-Z0-9.\-_]/g, "_")
      .replace(/_{2,}/g, "_")
      .replace(/^_+|_+$/g, "") || "file"
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const body = await req.json();
    const action = body.action;
    const inv = await resolveInvitation(body.token);
    if (!inv) return json({ error: "This link is no longer valid." }, 404);

    const { data: project } = await admin
      .from("projects")
      .select("id, name, workspace_id")
      .eq("id", inv.project_id)
      .single();
    if (!project) return json({ error: "This link is no longer valid." }, 404);

    if (action === "load") {
      if (inv.status === "pending") {
        await admin.from("project_invitations").update({ status: "opened" }).eq("id", inv.id);
      }
      const [teaser, { data: contribution }, { data: reactions }, { data: documents }] = await Promise.all([
        currentTeaser(inv.project_id),
        admin.from("project_contributions").select("*").eq("invitation_id", inv.id).maybeSingle(),
        admin.from("leverage_reactions").select("point_rank, reaction, note, run_id").eq("invitation_id", inv.id),
        admin.from("documents").select("id, filename, created_at").eq("invitation_id", inv.id).order("created_at"),
      ]);
      return json({
        projectName: project.name,
        status: inv.status === "pending" ? "opened" : inv.status,
        currentRunId: teaser?.id ?? null,
        map: teaser?.output ?? null,
        existing: {
          respondentName: contribution?.respondent_name ?? "",
          answers: contribution?.answers ?? {},
          submitted: contribution?.status === "submitted",
          reactions: reactions ?? [],
          documents: documents ?? [],
        },
      });
    }

    if (action === "save") {
      const answers = body.answers && typeof body.answers === "object" ? body.answers : {};
      const respondentName = body.respondentName ? String(body.respondentName) : null;
      await admin.from("project_contributions").upsert(
        {
          project_id: inv.project_id,
          invitation_id: inv.id,
          respondent_name: respondentName,
          answers,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "invitation_id" },
      );

      const reactions = Array.isArray(body.reactions) ? body.reactions : [];
      if (reactions.length) {
        const teaser = await currentTeaser(inv.project_id);
        if (teaser) {
          const rows = reactions
            .filter(
              (r: { pointRank?: unknown; reaction?: unknown }) =>
                typeof r?.pointRank === "number" &&
                ["resonates", "unsure", "missing"].includes(String(r?.reaction)),
            )
            .map((r: { pointRank: number; reaction: string; note?: string }) => ({
              project_id: inv.project_id,
              invitation_id: inv.id,
              run_id: teaser.id,
              point_rank: r.pointRank,
              reaction: r.reaction,
              note: r.note ? String(r.note) : null,
              updated_at: new Date().toISOString(),
            }));
          if (rows.length) {
            await admin
              .from("leverage_reactions")
              .upsert(rows, { onConflict: "invitation_id,run_id,point_rank" });
          }
        }
      }
      return json({ ok: true });
    }

    if (action === "submit") {
      await admin.from("project_contributions").upsert(
        {
          project_id: inv.project_id,
          invitation_id: inv.id,
          status: "submitted",
          submitted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "invitation_id" },
      );
      await admin.from("project_invitations").update({ status: "submitted" }).eq("id", inv.id);
      return json({ ok: true });
    }

    if (action === "upload-url") {
      const path = `${project.workspace_id}/${project.id}/${crypto.randomUUID()}-${sanitizeFilename(
        String(body.filename ?? "file"),
      )}`;
      const { data, error } = await admin.storage.from("documents").createSignedUploadUrl(path);
      if (error || !data) return json({ error: error?.message ?? "Could not create upload URL" }, 500);
      return json({ path: data.path, token: data.token, signedUrl: data.signedUrl });
    }

    if (action === "upload-complete") {
      if (!body.path) return json({ error: "Bad request" }, 400);
      await admin.from("documents").insert({
        project_id: inv.project_id,
        invitation_id: inv.id,
        storage_path: String(body.path),
        filename: body.filename ? String(body.filename) : "file",
        mime: body.mime ? String(body.mime) : null,
        bytes: typeof body.bytes === "number" ? body.bytes : null,
        extracted_text: body.extractedText ? String(body.extractedText) : null,
        status: "uploaded",
      });
      return json({ ok: true });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
