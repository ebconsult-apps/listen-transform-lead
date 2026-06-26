// POST /delete-account   (owner-only; verify_jwt = true)
// Immediate hard delete of the caller's account. Order matters: workspaces.owner_id,
// projects.created_by and project_invitations.invited_by reference auth.users WITHOUT
// `on delete cascade`, so deleting the auth user directly would be blocked. We instead:
//   1. cancel any active Stripe subscription + delete the customer (best-effort),
//   2. purge the workspace's storage objects (the DB cascade doesn't touch the bucket),
//   3. delete the owned workspace(s) → cascades projects + all project children,
//      memberships, entitlements and unlocks,
//   4. delete the auth user → cascades the profile (+ any cross-workspace memberships);
//      knowledge_base.created_by is set null so the shared, de-identified library survives.
// Returns { ok, warnings }. Stripe/storage steps are best-effort so a billing or storage
// hiccup never strands the user with an account they can't delete.
import Stripe from "npm:stripe@^17";
import { createClient } from "npm:@supabase/supabase-js@^2";
import { corsHeaders, json } from "../_shared/cors.ts";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2024-06-20" });
const admin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

/** Remove every object under a workspace's storage prefix ({wsId}/{projectId}/{file}). */
async function purgeWorkspaceStorage(wsId: string, warnings: string[]): Promise<void> {
  const bucket = admin.storage.from("documents");
  const { data: projectDirs, error } = await bucket.list(wsId);
  if (error) {
    warnings.push(`storage list ${wsId}: ${error.message}`);
    return;
  }
  const paths: string[] = [];
  for (const dir of projectDirs ?? []) {
    const { data: files } = await bucket.list(`${wsId}/${dir.name}`);
    for (const f of files ?? []) paths.push(`${wsId}/${dir.name}/${f.name}`);
  }
  if (paths.length) {
    const { error: rmErr } = await bucket.remove(paths);
    if (rmErr) warnings.push(`storage remove ${wsId}: ${rmErr.message}`);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const jwt = req.headers.get("Authorization")?.replace("Bearer ", "");
    const { data: userData } = await admin.auth.getUser(jwt ?? "");
    const user = userData.user;
    if (!user) return json({ error: "Unauthorized" }, 401);

    const warnings: string[] = [];

    // Workspaces this user owns. handle_new_user creates exactly one, but handle N
    // defensively so a future multi-workspace owner is still fully cleaned up.
    const { data: wss, error: wsErr } = await admin
      .from("workspaces")
      .select("id")
      .eq("owner_id", user.id);
    if (wsErr) return json({ error: `workspace lookup: ${wsErr.message}` }, 500);
    const wsIds = (wss ?? []).map((w) => w.id);

    if (wsIds.length) {
      // 1. Cancel Stripe subscriptions + delete customers (best-effort).
      const { data: ents } = await admin
        .from("entitlements")
        .select("stripe_subscription_id, stripe_customer_id")
        .in("workspace_id", wsIds);
      for (const e of ents ?? []) {
        if (e.stripe_subscription_id) {
          try {
            await stripe.subscriptions.cancel(e.stripe_subscription_id);
          } catch (err) {
            warnings.push(`cancel sub ${e.stripe_subscription_id}: ${(err as Error).message}`);
          }
        }
        if (e.stripe_customer_id) {
          try {
            await stripe.customers.del(e.stripe_customer_id);
          } catch (err) {
            warnings.push(`delete customer ${e.stripe_customer_id}: ${(err as Error).message}`);
          }
        }
      }

      // 2. Purge storage blobs (the DB cascade won't remove bucket objects).
      for (const wsId of wsIds) {
        try {
          await purgeWorkspaceStorage(wsId, warnings);
        } catch (err) {
          warnings.push(`storage ${wsId}: ${(err as Error).message}`);
        }
      }

      // 3. Delete the workspaces → cascades projects + all project children,
      //    memberships, entitlements and unlocks. Must precede the user delete
      //    because workspaces.owner_id doesn't cascade from auth.users.
      const { error: delWsErr } = await admin.from("workspaces").delete().in("id", wsIds);
      if (delWsErr) return json({ error: `workspace delete: ${delWsErr.message}` }, 500);
    }

    // 4. Delete the auth user → cascades the profile + remaining memberships.
    const { error: delUserErr } = await admin.auth.admin.deleteUser(user.id);
    if (delUserErr) return json({ error: `auth delete: ${delUserErr.message}` }, 500);

    return json({ ok: true, warnings });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
