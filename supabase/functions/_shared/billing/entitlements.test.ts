import { describe, it, expect } from "vitest";
import { planForEvent, tierFromMetadata, tierFromPriceId, type NormalizedEvent } from "./entitlements.ts";

const prices = { solo: "price_solo", team: "price_team", business: "price_biz" };

describe("tierFromMetadata", () => {
  it("accepts paid tiers, rejects anything else", () => {
    expect(tierFromMetadata({ tier: "team" })).toBe("team");
    expect(tierFromMetadata({ tier: "free" })).toBeNull();
    expect(tierFromMetadata({})).toBeNull();
    expect(tierFromMetadata(null)).toBeNull();
  });
});

describe("tierFromPriceId", () => {
  it("maps a known price id to its tier, else null", () => {
    expect(tierFromPriceId("price_biz", prices)).toBe("business");
    expect(tierFromPriceId("price_unknown", prices)).toBeNull();
    expect(tierFromPriceId(null, prices)).toBeNull();
  });
});

describe("planForEvent — checkout.session.completed", () => {
  it("one-off payment with project_id → unlock", () => {
    const e: NormalizedEvent = {
      type: "checkout.session.completed",
      mode: "payment",
      metadata: { project_id: "proj-1" },
      paymentIntent: "pi_123",
    };
    expect(planForEvent(e, prices)).toEqual({ kind: "unlock", projectId: "proj-1", paymentIntent: "pi_123" });
  });

  it("subscription with workspace_id → entitlement upsert with mapped tier", () => {
    const e: NormalizedEvent = {
      type: "checkout.session.completed",
      mode: "subscription",
      metadata: { workspace_id: "ws-1", tier: "team" },
      customerId: "cus_1",
      subscriptionId: "sub_1",
    };
    expect(planForEvent(e, prices)).toEqual({
      kind: "entitlement",
      workspaceId: "ws-1",
      byCustomer: null,
      patch: { stripe_customer_id: "cus_1", stripe_subscription_id: "sub_1", tier: "team", status: "active" },
    });
  });

  it("subscription with no tier metadata defaults to solo", () => {
    const plan = planForEvent(
      { type: "checkout.session.completed", mode: "subscription", metadata: { workspace_id: "ws-1" } },
      prices,
    );
    expect(plan).toMatchObject({ kind: "entitlement", patch: { tier: "solo", status: "active" } });
  });

  it("payment with no project_id → null (nothing to do)", () => {
    expect(planForEvent({ type: "checkout.session.completed", mode: "payment", metadata: {} }, prices)).toBeNull();
  });
});

describe("planForEvent — subscription lifecycle", () => {
  it("deleted → tier free + canceled status, keyed by customer", () => {
    const e: NormalizedEvent = {
      type: "customer.subscription.deleted",
      customerId: "cus_9",
      subscriptionId: "sub_9",
      subStatus: "canceled",
    };
    expect(planForEvent(e, prices)).toEqual({
      kind: "entitlement",
      workspaceId: null,
      byCustomer: "cus_9",
      patch: { status: "canceled", stripe_subscription_id: "sub_9", tier: "free" },
    });
  });

  it("updated + active + a known price → follows the new tier (portal plan change)", () => {
    const e: NormalizedEvent = {
      type: "customer.subscription.updated",
      customerId: "cus_2",
      subscriptionId: "sub_2",
      subStatus: "active",
      periodEnd: 1893456000, // 2030-01-01
      priceId: "price_biz",
    };
    const plan = planForEvent(e, prices);
    expect(plan).toMatchObject({ kind: "entitlement", byCustomer: "cus_2", patch: { status: "active", tier: "business" } });
    expect((plan as { patch: { current_period_end: string } }).patch.current_period_end).toContain("2030");
  });

  it("updated + active + unmapped price → status syncs, tier left unchanged", () => {
    const plan = planForEvent(
      { type: "customer.subscription.updated", customerId: "cus_3", subStatus: "active", priceId: "price_x" },
      prices,
    );
    expect(plan).toMatchObject({ kind: "entitlement", patch: { status: "active" } });
    expect((plan as { patch: { tier?: string } }).patch.tier).toBeUndefined();
  });
});

describe("planForEvent — ignored events", () => {
  it("returns null for unrelated event types", () => {
    expect(planForEvent({ type: "invoice.paid" }, prices)).toBeNull();
  });
});
