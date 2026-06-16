// POST /stripe-webhook — Stripe-signed events. Syncs subscriptions → entitlements
// and one-off payments → project_unlocks. Deploy with --no-verify-jwt (Stripe
// authenticates via signature, not a Supabase JWT).
import Stripe from "npm:stripe@^17";
import { createClient } from "npm:@supabase/supabase-js@^2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2024-06-20" });
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;
const admin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

function tierFromMetadata(meta: Record<string, string> | null): string | null {
  const t = meta?.tier;
  return t && ["solo", "team", "business"].includes(t) ? t : null;
}

Deno.serve(async (req) => {
  const sig = req.headers.get("stripe-signature");
  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(raw, sig!, webhookSecret);
  } catch (e) {
    return new Response(`Webhook signature error: ${(e as Error).message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;
        const meta = s.metadata ?? {};
        const workspaceId = meta.workspace_id;

        if (s.mode === "payment" && meta.project_id) {
          // One-off per-report unlock (the per-deliverable lever).
          await admin.from("project_unlocks").upsert(
            {
              project_id: meta.project_id,
              unlocked: true,
              stripe_payment_intent: s.payment_intent as string,
              unlocked_at: new Date().toISOString(),
            },
            { onConflict: "project_id" },
          );
          // Reflect on the project for the dashboard badge.
          await admin.from("projects").update({ status: "paid" }).eq("id", meta.project_id);
        } else if (s.mode === "subscription" && workspaceId) {
          await admin.from("entitlements").upsert(
            {
              workspace_id: workspaceId,
              stripe_customer_id: s.customer as string,
              stripe_subscription_id: s.subscription as string,
              tier: tierFromMetadata(meta) ?? "solo",
              status: "active",
            },
            { onConflict: "workspace_id" },
          );
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const active = sub.status === "active" || sub.status === "trialing";
        // Look up the workspace by customer id.
        const { data: ent } = await admin
          .from("entitlements")
          .select("workspace_id")
          .eq("stripe_customer_id", sub.customer as string)
          .maybeSingle();
        if (ent) {
          await admin
            .from("entitlements")
            .update({
              status: sub.status,
              tier: active ? undefined : "free",
              stripe_subscription_id: sub.id,
              current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
            })
            .eq("workspace_id", ent.workspace_id);
        }
        break;
      }
    }
    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(`Handler error: ${(e as Error).message}`, { status: 500 });
  }
});
