import { Check, Lock } from "lucide-react";
import type { StepId, StepDef } from "@/lib/clear/steps";

/**
 * Clickable workflow stepper for the project page. Shows the four linear phases
 * (Clarify → Leverage → Full Report → Experiment) with their status, and lets the
 * owner re-open any completed/unlocked step. Locked steps are disabled. Reuses the
 * `.phase-chip` idiom + --phase-* tokens (see Pipeline.tsx / index.css).
 */
interface WorkflowStepperProps {
  steps: readonly StepDef[];
  effectiveStep: StepId;
  done: Record<StepId, boolean>;
  unlocked: Record<StepId, boolean>;
  onStepClick: (id: StepId) => void;
}

const WorkflowStepper = ({ steps, effectiveStep, done, unlocked, onStepClick }: WorkflowStepperProps) => {
  const reachedIndex = steps.findIndex((s) => s.id === effectiveStep);

  return (
    <nav aria-label="Workflow steps" className="no-print mb-8">
      <ol className="flex items-center">
        {steps.map((step, i) => {
          const last = i === steps.length - 1;
          const isCurrent = step.id === effectiveStep;
          const isDone = done[step.id];
          const clickable = isDone || unlocked[step.id];
          return (
            <li key={step.id} className={`flex items-center ${last ? "" : "flex-1"}`}>
              <button
                type="button"
                disabled={!clickable}
                onClick={() => onStepClick(step.id)}
                aria-current={isCurrent ? "step" : undefined}
                title={!clickable ? "Complete the previous steps first" : undefined}
                className={`flex items-center gap-2 rounded-full transition ${
                  clickable ? "cursor-pointer hover:opacity-90" : "cursor-not-allowed"
                }`}
              >
                <span
                  className={`phase-chip ${!clickable ? "bg-muted" : ""} ${
                    isCurrent ? "ring-2 ring-offset-2 ring-primary" : ""
                  }`}
                  style={clickable ? { backgroundColor: `hsl(var(${step.token}))` } : undefined}
                >
                  {isDone ? (
                    <Check className="h-4 w-4" />
                  ) : clickable ? (
                    i + 1
                  ) : (
                    <Lock className="h-3.5 w-3.5 text-foreground/40" />
                  )}
                </span>
                <span
                  className={`text-sm hidden sm:inline ${
                    isCurrent
                      ? "font-semibold text-foreground"
                      : clickable
                        ? "text-foreground/70"
                        : "text-foreground/40"
                  }`}
                >
                  {step.label}
                </span>
              </button>
              {!last && (
                <span
                  aria-hidden
                  className={`h-px flex-1 mx-2 sm:mx-3 ${i < reachedIndex ? "bg-primary/40" : "bg-border"}`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default WorkflowStepper;
