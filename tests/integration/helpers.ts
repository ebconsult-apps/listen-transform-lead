/**
 * Integration-test harness against a local Supabase stack.
 *
 * Requires SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY in the
 * environment (the CI workflow maps these from `supabase status`). When they are
 * absent — e.g. a dev machine without Docker — `STACK` is false and the suites
 * `describe.skipIf(!STACK)` themselves rather than failing.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const anon = process.env.SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const STACK = Boolean(url && anon && service);

const noSession = { auth: { persistSession: false, autoRefreshToken: false } };

/** Service-role client (bypasses RLS) — only created when the stack is present. */
export const admin: SupabaseClient = STACK
  ? createClient(url!, service!, noSession)
  : (null as unknown as SupabaseClient);

export type Tier = "free" | "solo" | "team" | "business";

export interface TestUser {
  userId: string;
  email: string;
  token: string;
  /** anon client bound to this user's session (queries run under their RLS). */
  client: SupabaseClient;
  workspaceId: string;
  projectId: string;
}

const created: string[] = [];
let counter = 0;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Create a confirmed user (trigger provisions workspace + owner membership),
 *  give them a project, and return an authenticated client + ids. */
export async function createUser(opts?: { paid?: boolean }): Promise<TestUser> {
  const email = `it-${Date.now()}-${counter++}@example.com`;
  const password = "Password123!";

  const { data: createdUser, error: cErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (cErr || !createdUser.user) throw cErr ?? new Error("createUser failed");
  const userId = createdUser.user.id;
  created.push(userId);

  // The handle_new_user trigger creates the workspace + owner membership; retry
  // briefly in case the insert lands a beat after createUser resolves.
  let workspaceId = "";
  for (let i = 0; i < 10 && !workspaceId; i++) {
    const { data } = await admin.from("memberships").select("workspace_id").eq("user_id", userId).limit(1).maybeSingle();
    if (data?.workspace_id) workspaceId = data.workspace_id as string;
    else await sleep(150);
  }
  if (!workspaceId) throw new Error("workspace not provisioned for user");

  const { data: proj, error: pErr } = await admin
    .from("projects")
    .insert({ workspace_id: workspaceId, name: "IT project", created_by: userId })
    .select("id")
    .single();
  if (pErr) throw pErr;
  const projectId = proj.id as string;
  await admin.from("project_inputs").insert({ project_id: projectId, challenge: "Reduce churn", stakeholders: [{ role: "PM" }] });

  if (opts?.paid) await setEntitlement(workspaceId, "business");

  const client = createClient(url!, anon!, noSession);
  const { data: sess, error: sErr } = await client.auth.signInWithPassword({ email, password });
  if (sErr || !sess.session) throw sErr ?? new Error("signIn failed");

  return { userId, email, token: sess.session.access_token, client, workspaceId, projectId };
}

export async function setEntitlement(workspaceId: string, tier: Tier): Promise<void> {
  const { error } = await admin.from("entitlements").upsert({ workspace_id: workspaceId, tier, status: "active" });
  if (error) throw error;
}

export async function unlockProject(projectId: string): Promise<void> {
  const { error } = await admin.from("project_unlocks").upsert({ project_id: projectId, unlocked: true });
  if (error) throw error;
}

/** Delete every user created during the run (cascades clean their data). */
export async function cleanupAll(): Promise<void> {
  for (const id of created.splice(0)) {
    try {
      await admin.auth.admin.deleteUser(id);
    } catch {
      /* best-effort */
    }
  }
}

/** Raw POST to a served edge function so we can assert exact status codes. */
export async function callFn(
  token: string | null,
  name: string,
  body: unknown,
): Promise<{ status: number; json: Record<string, unknown> | null }> {
  const headers: Record<string, string> = { "Content-Type": "application/json", apikey: anon! };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${url}/functions/v1/${name}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  let json: Record<string, unknown> | null = null;
  try {
    json = (await res.json()) as Record<string, unknown>;
  } catch {
    /* some gateway responses have no JSON body */
  }
  return { status: res.status, json };
}
