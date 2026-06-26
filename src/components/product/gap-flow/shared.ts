/**
 * Small constants + helpers shared by the Open-questions focus flow
 * (GapFocusFlow, GapEditor) and the panel that hosts it. Pulled out of
 * OpenQuestionsPanel so the editor and the flow render one consistent visual
 * language for status, attachments, and icon buttons.
 */
import type { AssumptionGapStatus } from "@/lib/db";

export const STATUS_CLASS: Record<AssumptionGapStatus, string> = {
  open: "bg-amber-500/15 text-amber-600",
  resolved: "bg-emerald-500/15 text-emerald-600",
  carried: "bg-sky-500/15 text-sky-600",
};

export const STATUS_LABEL: Record<AssumptionGapStatus, string> = {
  open: "Open",
  resolved: "Answered",
  carried: "Carried",
};

/** Accepted supporting-document types for the attach control. */
export const ACCEPT = ".pdf,.docx,.xlsx,.md,.txt,.csv";

/** Icon-button base: real hit target + a visible focus ring (a11y). */
export const iconBtn =
  "p-1.5 rounded-md text-foreground/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function formatBytes(n: number | null | undefined): string {
  if (!n) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}
