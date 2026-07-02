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
import { safeErrorMessage } from "../_shared/errors.ts";

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

  // Replay protection: record the event id, then process; processed_at is
  // stamped only after every mutation succeeded. A redelivery of a PROCESSED
  // event is a no-op; a redelivery of an UNPROCESSED one (a prior attempt
  // crashed mid-handler or failed) is reprocessed — every mutation below is
  // idempotent, so reprocessing is safe and self-healing.
  const claim = await admin
    .from("stripe_events")
    .upsert({ id: event.id, type: event.type }, { onConflict: "id", ignoreDuplicates: true })
    .select("id");
  if (claim.error) {
    console.error("stripe-webhook: event-ledger claim failed", claim.error);
    return new Response("Event ledger error", { status: 500 });
  }
  if (!claim.data?.length) {
    const { data: prior } = await admin
      .from("stripe_events")
      .select("processed_at")
      .eq("id", event.id)
      .maybeSingle();
    if (prior?.processed_at) {
      return new Response(JSON.stringify({ received: true, duplicate: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }
    // Known event id but never fully processed → fall through and reprocess.
  }

  // supabase-js returns errors in the result instead of throwing; every mutation
  // must be checked or a failed write would still ACK the event with 200.
  const must = <T extends { error: unknown }>(result: T): T => {
    if (result.error) throw result.error;
    return result;
  };

  try {
    const plan = planForEvent(normalize(event), prices);

    if (plan?.kind === "unlock") {
      const now = new Date();
      must(
        await admin.from("project_unlocks").upsert(
          {
            project_id: plan.projectId,
            unlocked: true,
            stripe_payment_intent: plan.paymentIntent,
            unlocked_at: now.toISOString(),
            origin: "pass", // a one-off Report Pass (outside the monthly credit allotment)
          },
          { onConflict: "project_id" },
        ),
      );
      must(await admin.from("projects").update({ status: "paid" }).eq("id", plan.projectId));
      // Record the pass so it can be credited toward a first subscription (14 days).
      // Upsert on the payment intent (unique-indexed) so a redelivered event can
      // never mint a second creditable pass.
      if (plan.workspaceId) {
        if (plan.paymentIntent) {
          const expires = new Date(now.getTime() + PASS_CREDIT_WINDOW_DAYS * 86_400_000);
          must(
            await admin.from("report_passes").upsert(
              {
                workspace_id: plan.workspaceId,
                stripe_payment_intent: plan.paymentIntent,
                amount_cents: plan.amountCents,
                currency: plan.currency,
                purchased_at: now.toISOString(),
                expires_at: expires.toISOString(),
              },
              { onConflict: "stripe_payment_intent", ignoreDuplicates: true },
            ),
          );
        } else {
          // Without a payment intent there is no idempotency key — skip rather
          // than risk minting duplicate creditable passes on a reprocess.
          console.error("stripe-webhook: unlock event without payment_intent — pass not recorded", event.id);
        }
      }
    } else if (plan?.kind === "entitlement") {
      if (plan.workspaceId) {
        must(
          await admin
            .from("entitlements")
            .upsert({ workspace_id: plan.workspaceId, ...plan.patch }, { onConflict: "workspace_id" }),
        );
      } else if (plan.byCustomer) {
        const { data: ent, error: entErr } = await admin
          .from("entitlements")
          .select("workspace_id")
          .eq("stripe_customer_id", plan.byCustomer)
          .maybeSingle();
        if (entErr) throw entErr;
        if (ent) {
          must(await admin.from("entitlements").update(plan.patch).eq("workspace_id", ent.workspace_id));
        } else {
          // Ordering gap: a subscription.updated can arrive before the checkout
          // event that stamps stripe_customer_id onto the entitlement row. Fall
          // back to the workspace id recorded in the Stripe customer's metadata
          // (set at customer creation in stripe-checkout) instead of dropping
          // the update silently.
          const customer = await stripe.customers.retrieve(plan.byCustomer);
          const wsId = customer.deleted ? undefined : customer.metadata?.workspace_id;
          if (wsId) {
            must(
              await admin.from("entitlements").upsert(
                { workspace_id: wsId, stripe_customer_id: plan.byCustomer, ...plan.patch },
                { onConflict: "workspace_id" },
              ),
            );
          } else {
            console.error("stripe-webhook: no entitlement or metadata for customer", plan.byCustomer);
          }
        }
      }
    }

    // Everything applied — mark the event processed so replays become no-ops.
    must(
      await admin
        .from("stripe_events")
        .update({ processed_at: new Date().toISOString() })
        .eq("id", event.id),
    );

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    // The event row stays unprocessed, so Stripe's retry (or a manual dashboard
    // resend) reprocesses it instead of being swallowed as a duplicate.
    return new Response(safeErrorMessage(e, "stripe-webhook"), { status: 500 });
  }
});
