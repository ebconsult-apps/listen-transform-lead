import { requireSupabase } from "./supabase";

type CheckoutMode = "subscription" | "payment";

/**
 * Create a Stripe Checkout Session via the edge function and redirect. The
 * function holds the secret key; the client only ever sees the session URL.
 */
export async function startCheckout(opts: {
  mode: CheckoutMode;
  priceId?: string;
  tier?: string;
  projectId?: string;
}): Promise<void> {
  const sb = requireSupabase();
  const { data, error } = await sb.functions.invoke("stripe-checkout", {
    body: {
      ...opts,
      successUrl: `${window.location.origin}${window.location.pathname}?checkout=success`,
      cancelUrl: `${window.location.origin}${window.location.pathname}?checkout=cancel`,
    },
  });
  if (error) throw error;
  const url = (data as { url?: string })?.url;
  if (!url) throw new Error("No checkout URL returned");
  window.location.href = url;
}

/** Open the Stripe customer portal (manage subscription). */
export async function openBillingPortal(): Promise<void> {
  const sb = requireSupabase();
  const { data, error } = await sb.functions.invoke("stripe-checkout", {
    body: { mode: "portal", returnUrl: window.location.href },
  });
  if (error) throw error;
  const url = (data as { url?: string })?.url;
  if (url) window.location.href = url;
}
