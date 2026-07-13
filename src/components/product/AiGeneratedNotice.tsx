import { Sparkles } from "lucide-react";

/**
 * AI-transparency label (EU AI Act Art. 50). One shared, factual, non-alarming
 * notice reused across every report-rendering surface — the in-app report, the
 * public/in-app sample, and (as text) the Markdown/PDF exports. Intentionally NOT
 * marked `no-print`, so it also appears in the printed PDF.
 */
export default function AiGeneratedNotice({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-start gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-foreground/60 ${className}`}
    >
      <Sparkles className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary/70" aria-hidden />
      <span>
        <span className="font-medium text-foreground/80">AI-generated.</span> This report is
        generated with Claude (Anthropic) and may be incomplete or inaccurate — verify critical
        claims before acting on them.
      </span>
    </div>
  );
}
