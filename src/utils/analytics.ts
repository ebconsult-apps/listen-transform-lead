const GA4_MEASUREMENT_ID = "G-0P6CY2BME8";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

/**
 * Load the GA4 script and initialize tracking.
 * Only call this after the user has accepted cookies.
 */
export function initGA4(measurementId: string = GA4_MEASUREMENT_ID): void {
  if (document.querySelector(`script[src*="googletagmanager.com/gtag"]`)) {
    return; // already loaded
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };

  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    anonymize_ip: true,
  });
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
