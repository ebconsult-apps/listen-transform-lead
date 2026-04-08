declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
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
 * Replace the send_to value with your actual Google Ads conversion ID/label
 * once you create the conversion action in Google Ads.
 *
 * To set up:
 * 1. Create a conversion action in Google Ads
 * 2. Replace 'AW-XXXXXXXXX/YYYYYYY' with your conversion ID/label
 * 3. Optionally pass a value and currency
 */
export function trackGoogleAdsConversion(
  conversionLabel: string,
  value?: number,
): void {
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
