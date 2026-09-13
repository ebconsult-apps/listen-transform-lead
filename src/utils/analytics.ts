import { GOOGLE_ADS_ID } from "@/config/site";
import { devActive } from "@/lib/dev/config";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

/**
 * Configure the Google Ads tag alongside the GA4 tag loaded in index.html.
 * Without this config call, native Google Ads conversion events are dropped
 * even when valid conversion labels are passed to trackGoogleAdsConversion().
 * Call once on app startup; no-ops until GOOGLE_ADS_ID is set in config/site.ts.
 */
export function initGoogleAds(): void {
  if (GOOGLE_ADS_ID && typeof window.gtag === "function") {
    window.gtag("config", GOOGLE_ADS_ID);
  }
}

/**
 * Grant analytics consent after the user accepts cookies.
 * The gtag.js script is loaded in index.html with consent mode
 * defaulting to "denied", so this upgrades to full tracking.
 */
export function initGA4(): void {
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
    });
  }
}

/**
 * Withdraw analytics/advertising consent (e.g. when the user changes their
 * choice via the "Cookie settings" control). Updates Consent Mode v2 back to
 * "denied" so gtag stops using non-essential storage. Withdrawal must be as
 * easy as granting (ePrivacy/GDPR).
 */
export function revokeAnalyticsConsent(): void {
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  }
}

// ---------------------------------------------------------------------------
// First-party, cookieless event mirror (Supabase `track` edge function)
// ---------------------------------------------------------------------------

/**
 * Every event sent to GA4 is also POSTed to our own `track` edge function, which
 * writes it to the `analytics_events` table (see
 * supabase/migrations/20260913120000_analytics_events.sql). That gives us the
 * per-whitepaper funnel and AI-assistant referral traffic as plain SQL, without
 * depending on GA4 custom dimensions or its UI.
 *
 * It is cookieless and sends no identifiers: event name, the props the caller
 * attached (ids and labels only, never names or emails), the path, and the
 * document referrer. The function derives a daily pseudonymous visitor key
 * server-side and never stores the IP. Because nothing is set on the device,
 * it is not gated on the cookie-consent choice (privacy policy §3, §8).
 *
 * Skipped when there is no Supabase URL (fresh clone), outside a browser
 * (tests), in dev/QA mock mode (would pollute real data), and inside the
 * headless prerender browser (`navigator.webdriver`).
 */
const FIRST_PARTY_TRACK_URL: string | null = (() => {
  const base = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  return base ? `${base.replace(/\/$/, "")}/functions/v1/track` : null;
})();

function sendFirstParty(eventName: string, params?: Record<string, string>): void {
  if (!FIRST_PARTY_TRACK_URL || typeof window === "undefined") return;
  if (devActive() || navigator.webdriver) return;
  try {
    const body = JSON.stringify({
      event: eventName,
      props: params ?? {},
      path: window.location.pathname,
      referrer: document.referrer || null,
    });
    // keepalive lets the request complete when the click navigates away.
    void fetch(FIRST_PARTY_TRACK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {
      /* analytics is best-effort */
    });
  } catch {
    /* never let analytics throw into UI code */
  }
}

/**
 * Send a custom event to GA4 and to the first-party event log.
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, string>,
): void {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
  sendFirstParty(eventName, params);
}

// ---------------------------------------------------------------------------
// Conversion tracking helpers
// ---------------------------------------------------------------------------

/**
 * Track a form submission (contact, lead, whitepaper, book, etc.).
 * `params` adds per-form dimensions (e.g. which whitepaper) to the event.
 */
export function trackFormSubmission(
  formName: string,
  params: Record<string, string> = {},
): void {
  trackEvent("form_submission", { form_name: formName, ...params });
}

/**
 * Fire a distinct GA4 event per lead form (lead_contact, lead_free_chapter, ...).
 * Distinct event names can be marked as key events in GA4 (Admin → Events)
 * and imported into Google Ads as conversions — no conversion labels needed.
 * `params` adds per-form dimensions (e.g. which whitepaper) to the event.
 */
export function trackLead(
  formName: string,
  params: Record<string, string> = {},
): void {
  trackEvent(`lead_${formName}`, { form_name: formName, ...params });
}

// ---------------------------------------------------------------------------
// Whitepaper funnel
// ---------------------------------------------------------------------------

/**
 * Three steps, all carrying `whitepaper_id` (and `placement` where relevant) so
 * GA4 can report per paper rather than one undifferentiated "whitepaper" lead:
 *
 *   whitepaper_gate_view       the download gate rendered (placement: "modal" on
 *                              /resources, "page" on /resources/:id)
 *   lead_whitepaper_download   the existing lead event, now with whitepaper_id
 *   whitepaper_download        the unlocked "Download PDF" link was clicked
 *
 * To see these by paper in GA4: Admin → Custom definitions → create an
 * event-scoped custom dimension named `whitepaper_id` (and `placement`). Until
 * the dimension exists GA4 still stores the parameter, it just can't be used in
 * reports, so register it early.
 */
export type WhitepaperGatePlacement = "modal" | "page";

export function trackWhitepaperGateView(
  whitepaperId: string,
  placement: WhitepaperGatePlacement,
): void {
  trackEvent("whitepaper_gate_view", { whitepaper_id: whitepaperId, placement });
}

export function trackWhitepaperDownload(whitepaperId: string): void {
  trackEvent("whitepaper_download", { whitepaper_id: whitepaperId });
}

/** Track a CTA click (booking, whitepaper download, etc.) */
export function trackCTAClick(ctaName: string): void {
  trackEvent("cta_click", { cta_name: ctaName });
}

/** Manual page view tracking for SPA navigation */
export function trackPageView(pagePath: string): void {
  trackEvent("page_view", { page_path: pagePath });
}

// ---------------------------------------------------------------------------
// Self-serve product funnel
// ---------------------------------------------------------------------------

/**
 * Fire a self-serve product funnel event. These are the only three steps of the
 * /product funnel GA4 can currently see (the app itself has no product analytics
 * — roadmap B5), and they are what the paid-traffic experiment reads. Marked as
 * key events in GA4 and imported into Google Ads via GA4 import, so no Google Ads
 * conversion label is referenced here (see content/ads/google-ads-experiment.md).
 *
 * Two deliberate guards, on top of the `window.gtag` check in trackEvent():
 * - Dev/QA mock mode walks the entire product against an in-memory store, so
 *   counting it would inflate the exact funnel the experiment is judged on.
 *   `devActive()` folds to a build-time `false` in production builds.
 * - No `window` (Node tests) — these run inside data/UI modules that are also
 *   imported outside the browser.
 *
 * Consent: identical to every other event on the site. gtag.js loads in
 * index.html with Consent Mode v2 defaulting all storage to denied, and
 * CookieConsent upgrades it on Accept — so this adds no tracking that the
 * existing `lead_*` events don't already do.
 */
function trackProductEvent(eventName: string): void {
  if (typeof window === "undefined" || devActive()) return;
  trackEvent(eventName);
}

/**
 * A new account finished the magic-link / OAuth round-trip. Signup only —
 * returning logins go through the same callback but are not counted.
 */
export function trackProductSignupComplete(): void {
  trackProductEvent("product_signup_complete");
}

/**
 * A free Leverage teaser finished generating — the last free step before the
 * paywall, and the activation metric for the ads experiment. Also fires on a
 * regeneration of an existing teaser, so read it as GA4 *users* rather than
 * event count when using it as a funnel step.
 */
export function trackProductTeaserGenerated(): void {
  trackProductEvent("product_teaser_generated");
}

/** The unlock paywall rendered over the locked full report (intent to buy). */
export function trackProductPaywallViewed(): void {
  trackProductEvent("product_paywall_viewed");
}

// ---------------------------------------------------------------------------
// Google Ads native conversion tracking
// ---------------------------------------------------------------------------

/**
 * Fire a native Google Ads conversion event.
 * Conversion labels live in src/config/site.ts (CONVERSION_LABELS); while they
 * are still placeholders this is a no-op so no invalid conversions are sent.
 */
export function trackGoogleAdsConversion(
  conversionLabel: string,
  value?: number,
): void {
  if (!conversionLabel || conversionLabel.startsWith("AW-XXXXXXXXX")) {
    return;
  }
  if (typeof window.gtag === "function") {
    window.gtag("event", "conversion", {
      send_to: conversionLabel,
      value: value || 0,
      currency: "EUR",
    });
  }
}

/**
 * Send hashed user data for Enhanced Conversions.
 * Call this right before trackGoogleAdsConversion in form handlers.
 * The email is sent in plaintext — gtag.js hashes it automatically
 * when Enhanced Conversions is enabled in the Google Ads account.
 */
export function setEnhancedConversionData(email: string): void {
  if (typeof window.gtag === "function") {
    window.gtag("set", "user_data", {
      email: email,
    });
  }
}
