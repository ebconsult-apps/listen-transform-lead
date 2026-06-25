import { useEffect, useState } from "react";
import { Check, Clock, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { buildProgress, type BuildStep } from "@/lib/clear/report-loader";

/**
 * A "building your report" loader for long AI generations. Instead of a bare
 * spinner, it shows a staged checklist that visibly advances through the real
 * build phases plus a (capped) progress bar and an explicit time expectation, so
 * a 30–60s wait reads as work-in-progress rather than "stuck".
 *
 * There is no backend sub-phase signal to poll, so advancement is estimated on a
 * client-side timer (see `report-loader.ts`). The model is engineered to never
 * claim completion — the bar caps below 100 and the final step keeps spinning —
 * because the parent swaps this component out the instant the real result lands.
 *
 * Reusable via props (`steps` / `title` / `estimate`); currently wired for the
 * full report, but the Clarify / Leverage loaders can adopt it as-is.
 */
interface ReportBuildingLoaderProps {
  /** Heading, e.g. "Building your full report". */
  title: string;
  /** Ordered build steps. The last one never self-completes. */
  steps: BuildStep[];
  /** Time-expectation line, e.g. "This usually takes 30–60 seconds…". */
  estimate: string;
  className?: string;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const ReportBuildingLoader = ({ title, steps, estimate, className }: ReportBuildingLoaderProps) => {
  const [reduced] = useState(prefersReducedMotion);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    // Discrete step/percentage updates (not continuous motion) run for everyone;
    // only the spinning glyph below is suppressed under reduced motion.
    const start = Date.now();
    const id = window.setInterval(() => setElapsed(Date.now() - start), 250);
    return () => window.clearInterval(id); // cleanup on unmount — no setState-after-unmount
  }, [steps]);

  const { current, pct, done } = buildProgress(steps, elapsed);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn("glass-card p-8 sm:p-10 text-center", className)}
    >
      <h2 className="heading-md mb-5">{title}</h2>

      <div className="mx-auto max-w-sm text-left">
        <Progress value={pct} aria-label="Report generation progress" className="h-2 mb-5" />

        <ol className="space-y-3">
          {steps.map((step, i) => {
            const isDone = done(i);
            const isCurrent = i === current;
            return (
              <li
                key={step.label}
                aria-current={isCurrent ? "step" : undefined}
                className="flex items-center gap-3"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center" aria-hidden>
                  {isDone ? (
                    <Check className="h-5 w-5 text-primary" />
                  ) : isCurrent ? (
                    reduced ? (
                      <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                    ) : (
                      <RefreshCw className="h-4 w-4 text-primary animate-spin motion-reduce:animate-none" />
                    )
                  ) : (
                    <span className="h-4 w-4 rounded-full border-2 border-foreground/20" />
                  )}
                </span>
                <span
                  className={cn(
                    "text-sm",
                    isCurrent
                      ? "font-semibold text-foreground"
                      : isDone
                        ? "text-foreground/70"
                        : "text-foreground/40",
                  )}
                >
                  {step.label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <p className="mt-6 flex items-center justify-center gap-2 text-sm text-foreground/60">
        <Clock className="h-4 w-4 shrink-0" aria-hidden /> {estimate}
      </p>
    </div>
  );
};

export default ReportBuildingLoader;
