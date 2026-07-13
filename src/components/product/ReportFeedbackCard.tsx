import { MessageSquare } from "lucide-react";
import { CONTACT_EMAIL } from "@/config/site";

/**
 * Compact "was this useful?" prompt shown at the bottom of a report. No backend:
 * it opens the user's mail client with a prefilled subject and body asking for a
 * 1–5 rating plus one line. Two copy variants — the real in-app report, and the
 * public/in-app sample (where the reader has no report of their own yet).
 */
const COPY = {
  report: {
    heading: "Was this report useful?",
    body: "A quick 1–5 and one line on what would make it sharper helps us improve every report.",
    cta: "Send feedback",
    subject: "Report feedback",
    mailBody:
      "How useful was this CLEAR report, on a scale of 1 (not useful) to 5 (very useful)?\n\nMy rating: \n\nOne thing that would have made it more useful: \n",
  },
  sample: {
    heading: "Questions about what you'd get for your own challenge?",
    body: "Tell us what you're trying to change, or rate this sample 1–5 and say what you'd want to see. We read every note.",
    cta: "Email us",
    subject: "Report feedback",
    mailBody:
      "I looked at the CLEAR sample report and have a question / some feedback.\n\nMy challenge (the behaviour I'd want to change): \n\nRating of the sample, 1 (not useful) to 5 (very useful): \n\nOne thing I'd want to see for my own challenge: \n",
  },
} as const;

export default function ReportFeedbackCard({
  variant = "report",
  className = "",
}: {
  variant?: "report" | "sample";
  className?: string;
}) {
  const copy = COPY[variant];
  const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    copy.subject,
  )}&body=${encodeURIComponent(copy.mailBody)}`;

  return (
    <div
      className={`no-print glass-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 ${className}`}
    >
      <div className="flex items-start gap-3 flex-grow">
        <div className="h-9 w-9 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <MessageSquare className="h-5 w-5" aria-hidden />
        </div>
        <div>
          <p className="font-semibold">{copy.heading}</p>
          <p className="text-sm text-foreground/60 mt-0.5">{copy.body}</p>
        </div>
      </div>
      <a href={href} className="btn-secondary shrink-0 self-start sm:self-center whitespace-nowrap">
        {copy.cta}
      </a>
    </div>
  );
}
