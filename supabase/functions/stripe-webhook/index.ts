// POST /stripe-webhook — Stripe-signed events. Syncs subscriptions → entitlements
// and one-off payments → project_unlocks. Deploy with verify_jwt=false (Stripe
// authenticates via signature, not a Supabase JWT).
//
// The decision logic lives in ../_shared/billing/entitlements.ts (pure + unit-
// tested); this handler verifies the signature, normalizes the event, and applies
// the returned mutation via the service-role client.
import Stripe from "npm:stripe@^17";
import { createClient } from "npm:@supabase/supabase-js@^2";
import {
  PASS_CREDIT_WINDOW_DAYS,
  planForEvent,
  type NormalizedEvent,
  type PriceMap,
} from "../_shared/billing/entitlements.ts";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2024-06-20" });
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;
const admin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

// Server-side price ids let a Billing-Portal plan change map back to a tier.
const prices: PriceMap = {
  solo: Deno.env.get("STRIPE_PRICE_SOLO") ?? undefined,
  team: Deno.env.get("STRIPE_PRICE_TEAM") ?? undefined,
  business: Deno.env.get("STRIPE_PRICE_BUSINESS") ?? undefined,
};

function normalize(event: Stripe.Event): NormalizedEvent {
  if (event.type === "checkout.session.completed") {
    const s = event.data.object as Stripe.Checkout.Session;
    return {
      type: event.type,
      mode: s.mode,
      metadata: s.metadata ?? null,
      customerId: (s.customer as string) ?? null,
      subscriptionId: (s.subscription as string) ?? null,
      paymentIntent: (s.payment_intent as string) ?? null,
      amountTotal: s.amount_total ?? null,
      currency: s.currency ?? null,
    };
  }
  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    return {
      type: event.type,
      customerId: (sub.customer as string) ?? null,
      subscriptionId: sub.id,
      subStatus: sub.status,
      periodEnd: sub.current_period_end ?? null,
      priceId: sub.items?.data?.[0]?.price?.id ?? null,
    };
  }
  return { type: event.type };
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
    const plan = planForEvent(normalize(event), prices);

    if (plan?.kind === "unlock") {
      const now = new Date();
      await admin.from("project_unlocks").upsert(
        {
          project_id: plan.projectId,
          unlocked: true,
          stripe_payment_intent: plan.paymentIntent,
          unlocked_at: now.toISOString(),
          origin: "pass", // a one-off Report Pass (outside the monthly credit allotment)
        },
        { onConflict: "project_id" },
      );
      await admin.from("projects").update({ status: "paid" }).eq("id", plan.projectId);
      // Record the pass so it can be credited toward a first subscription (14 days).
      if (plan.workspaceId) {
        const expires = new Date(now.getTime() + PASS_CREDIT_WINDOW_DAYS * 86_400_000);
        await admin.from("report_passes").insert({
          workspace_id: plan.workspaceId,
          stripe_payment_intent: plan.paymentIntent,
          amount_cents: plan.amountCents,
          currency: plan.currency,
          purchased_at: now.toISOString(),
          expires_at: expires.toISOString(),
        });
      }
    } else if (plan?.kind === "entitlement") {
      if (plan.workspaceId) {
        await admin
          .from("entitlements")
          .upsert({ workspace_id: plan.workspaceId, ...plan.patch }, { onConflict: "workspace_id" });
      } else if (plan.byCustomer) {
        const { data: ent } = await admin
          .from("entitlements")
          .select("workspace_id")
          .eq("stripe_customer_id", plan.byCustomer)
          .maybeSingle();
        if (ent) {
          await admin.from("entitlements").update(plan.patch).eq("workspace_id", ent.workspace_id);
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(`Handler error: ${(e as Error).message}`, { status: 500 });
  }
});
