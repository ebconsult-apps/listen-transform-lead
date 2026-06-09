import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import {
  trackFormSubmission,
  trackLead,
  setEnhancedConversionData,
  trackGoogleAdsConversion,
} from "@/utils/analytics";

interface UseFormSubmitOptions {
  /** PHP endpoint to POST the payload to, e.g. "/mail-handler.php" */
  endpoint: string;
  /** Analytics form name, e.g. "contact" or "free_chapter" */
  formName: string;
  /** Google Ads conversion label from CONVERSION_LABELS in config/site.ts */
  conversionLabel: string;
}

/**
 * Shared submit flow for all lead-capture forms: POST JSON to a PHP handler,
 * surface errors via state + toast, and fire the analytics/conversion events
 * on success. Returns true from submit() when the submission succeeded so
 * callers can run their own success behavior (toast, redirect, reset).
 */
export function useFormSubmit({ endpoint, formName, conversionLabel }: UseFormSubmitOptions) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (
    payload: Record<string, unknown> & { email?: string },
  ): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // The handler may return an HTML error page instead of JSON, so only
        // use the body's message when it parses.
        let message = "Something went wrong. Please try again.";
        try {
          const body = await response.json();
          if (body?.message) message = body.message;
        } catch {
          // keep the generic message
        }
        throw new Error(message);
      }

      setSubmitted(true);
      trackFormSubmission(formName);
      trackLead(formName);
      if (payload.email) {
        setEnhancedConversionData(payload.email);
      }
      trackGoogleAdsConversion(conversionLabel);
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submit, isSubmitting, submitted, setSubmitted, error };
}
