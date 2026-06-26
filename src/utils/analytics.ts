import { GOOGLE_ADS_ID } from "@/config/site";

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

/**
 * Send a custom event to GA4.
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, string>,
): void {
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}

// ---------------------------------------------------------------------------
// Conversion tracking helpers
// ---------------------------------------------------------------------------

/** Track a form submission (contact, lead, whitepaper, book, etc.) */
export function trackFormSubmission(formName: string): void {
  trackEvent("form_submission", { form_name: formName });
}

/**
 * Fire a distinct GA4 event per lead form (lead_contact, lead_free_chapter, ...).
 * Distinct event names can be marked as key events in GA4 (Admin → Events)
 * and imported into Google Ads as conversions — no conversion labels needed.
 */
export function trackLead(formName: string): void {
  trackEvent(`lead_${formName}`, { form_name: formName });
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
