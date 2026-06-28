// POST /stripe-checkout
//  { mode: "subscription"|"payment", priceId, tier?, projectId?, successUrl, cancelUrl }
//  { mode: "portal", returnUrl }
// Creates a Stripe Checkout Session (or Billing Portal session) for the caller's
// workspace and returns { url } to redirect to. Secret key stays server-side.
import Stripe from "npm:stripe@^17";
import { createClient } from "npm:@supabase/supabase-js@^2";
import { corsHeaders, json } from "../_shared/cors.ts";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2024-06-20" });
const admin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const jwt = req.headers.get("Authorization")?.replace("Bearer ", "");
    const { data: userData } = await admin.auth.getUser(jwt ?? "");
    const user = userData.user;
    if (!user) return json({ error: "Unauthorized" }, 401);

    const body = await req.json();

    // The caller's personal workspace (owner).
    const { data: ws } = await admin
      .from("workspaces")
      .select("id")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .single();
    if (!ws) return json({ error: "No workspace" }, 400);

    // Reuse or create the Stripe customer for this workspace.
    const { data: ent } = await admin
      .from("entitlements")
      .select("stripe_customer_id")
      .eq("workspace_id", ws.id)
      .maybeSingle();
    let customerId = ent?.stripe_customer_id ?? null;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        metadata: { workspace_id: ws.id },
      });
      customerId = customer.id;
      await admin
        .from("entitlements")
        .upsert({ workspace_id: ws.id, stripe_customer_id: customerId }, { onConflict: "workspace_id" });
    }

    if (body.mode === "portal") {
      const portal = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: body.returnUrl,
      });
      return json({ url: portal.url });
    }

    if (!body.priceId) return json({ error: "Missing priceId" }, 400);

    // Creditable Report Pass: if this is a subscription and the workspace has an
    // unexpired, unapplied Report Pass, apply its amount as Stripe account credit
    // (a negative customer-balance transaction) so it nets off the first invoice,
    // then stamp applied_at so it's used at most once.
    if (body.mode === "subscription") {
      const nowIso = new Date().toISOString();
      const { data: pass } = await admin
        .from("report_passes")
        .select("id, amount_cents, currency")
        .eq("workspace_id", ws.id)
        .is("applied_at", null)
        .gt("expires_at", nowIso)
        .order("purchased_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (pass && pass.amount_cents > 0) {
        await stripe.customers.createBalanceTransaction(customerId, {
          amount: -pass.amount_cents, // negative = credit toward upcoming invoices
          currency: pass.currency ?? "usd",
          description: "Report Pass credit toward first subscription",
        });
        await admin.from("report_passes").update({ applied_at: nowIso }).eq("id", pass.id);
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: body.mode, // "subscription" | "payment"
      customer: customerId,
      line_items: [{ price: body.priceId, quantity: 1 }],
      success_url: body.successUrl,
      cancel_url: body.cancelUrl,
      metadata: {
        workspace_id: ws.id,
        project_id: body.projectId ?? "",
        tier: body.tier ?? "",
      },
    });
    return json({ url: session.url });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
