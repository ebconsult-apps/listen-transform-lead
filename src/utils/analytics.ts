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
