import * as React from "react";
import { useLayoutEffect, useRef } from "react";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/**
 * Shared Clarify / OKR help affordances — kept in one module so the editable review
 * (ClarifyReview) and the read-only card (ClarifyCard) use identical copy and controls.
 *
 * Every helper is a stable, module-scope component identity. That is what keeps the textarea
 * caret/focus from dropping while typing: React reconciles the same DOM node across renders
 * instead of remounting it. Do NOT inline these into a component body.
 */

/** Per-field copy: what the field is + why it's worth filling in. Single source of truth. */
export const HINTS = {
  why: "Why this matters to the organization. It sets the stakes, keeps the objective honest, and is context for the diagnosis that follows — a sharp 'why' leads to sharper leverage points.",
  objective:
    "The single qualitative outcome you're driving toward, stated plainly (no metrics here). Everything downstream is diagnosed against it, so make it specific and ambitious but real. Required.",
  kr: "A measurable result that proves the objective is met. Phrase it as an outcome, not an activity ('cut onboarding time to under a week', not 'run onboarding workshops'). At least one is required — these are what Leverage and the experiments are built to move.",
  metric:
    "The exact thing you'll measure for this key result (e.g. 'first-contact resolution rate'). Naming it makes the result checkable and tells the rest of the plan what data to watch.",
  baseline:
    "Where that metric stands today, with a date or source if you have one. It's what 'better' is measured against — without it you can't tell whether an intervention worked.",
  target:
    "The value that counts as success, and by when. A concrete target turns a vague hope into a testable bar and lets the experiment phase define a clear pass/fail.",
  timeline:
    "When this key result should be hit (a date or horizon). It sets the pace and scopes the experiments to what's achievable in the window.",
  owner:
    "The role accountable for this key result (a role, not a name). An owner is what makes a result happen rather than drift, and clarifies who acts on the leverage points later.",
  confidence:
    "How confident you are this key result is realistic right now (High / Medium / Low). A low score isn't bad — it flags where assumptions are thin and where a test or discovery should go first.",
} as const;

/** A focusable info icon that reveals `hint` on hover/focus. Standalone (e.g. inline in prose). */
export const HelpTip = ({ hint, label }: { hint: string; label?: string }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <button
        type="button"
        aria-label={label ? `What is "${label}"? ${hint}` : hint}
        className="inline-flex align-middle rounded-full text-foreground/40 hover:text-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <HelpCircle className="h-3.5 w-3.5" />
      </button>
    </TooltipTrigger>
    <TooltipContent className="max-w-xs text-xs leading-relaxed">{hint}</TooltipContent>
  </Tooltip>
);

/** Label + help tooltip + optional/required affordance for an editable field. */
export const FieldLabel = ({
  htmlFor,
  label,
  hint,
  required,
  optional,
  small,
}: {
  htmlFor?: string;
  label: string;
  hint: string;
  required?: boolean;
  optional?: boolean;
  small?: boolean;
}) => (
  <div className="flex items-center gap-1.5 mb-1">
    <label
      htmlFor={htmlFor}
      className={small ? "block text-xs font-medium text-foreground/50" : "block text-sm font-medium"}
    >
      {label}
      {required && (
        <span className="text-rose-600 ml-0.5" aria-hidden="true">
          *
        </span>
      )}
    </label>
    {optional && <span className="text-[10px] font-normal text-foreground/40">optional</span>}
    <HelpTip hint={hint} label={label} />
  </div>
);

/**
 * Auto-growing textarea — height tracks content so long values are never clipped.
 * JS sizing (scrollHeight) because Tailwind 3.4 has no `field-sizing` utility and the CSS
 * property is Chromium-only. `useLayoutEffect` avoids a one-frame height flicker.
 * Callers may pass `rows` to set the empty-state floor (defaults to 2).
 */
export const AutoTextarea = ({
  value,
  className,
  ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto"; // reset first so the box can also shrink
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);
  return (
    <textarea
      ref={ref}
      rows={2}
      value={value}
      className={cn("resize-none overflow-hidden", className)}
      {...rest}
    />
  );
};

/** Always-visible, plain-language explanation of what an OKR is. */
export const OkrExplainer = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "rounded-xl border border-border bg-muted/60 p-4 text-sm leading-relaxed text-foreground/70",
      className,
    )}
  >
    <p className="mb-1 font-medium text-foreground/80">New to OKRs?</p>
    <p>
      An <strong>OKR</strong> pairs one <strong>Objective</strong> — a short, qualitative statement
      of what you want to achieve — with a few <strong>Key Results</strong>: the measurable outcomes
      that prove you got there. The Objective is your direction; each Key Result is a number you can
      check. Everything below is diagnosed against the targets you set here, so it pays to make them
      specific.
    </p>
  </div>
);
