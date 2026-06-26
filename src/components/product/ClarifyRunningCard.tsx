import { useEffect, useState } from "react";
import {
  Target,
  FileText,
  Crosshair,
  Flag,
  ListChecks,
  Gauge,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";

/**
 * Waiting state for the first Clarify run. The run takes anywhere from a few
 * seconds up to ~a minute, so the old single spinner + "this takes a few
 * seconds" read as a stall once it ran long. This narrates what Clarify is
 * actually doing — a radar-pulse target (Clarify defines your *measurable
 * target*), a rotating line of the real steps, and an indeterminate bar — so
 * the wait reads as deliberate work. Monochrome in the Clarify phase accent;
 * all motion is gated on prefers-reduced-motion via motion-safe:.
 */

// Representative steps, grounded in the real ClarifyOutput shape (objective →
// key results → baselines/targets → assumptions). They cycle to convey ongoing
// work — deliberately not a one-way "step N done" bar we can't truthfully fill.
const STEPS: { icon: LucideIcon; label: string }[] = [
  { icon: FileText, label: "Reading your challenge and context" },
  { icon: Crosshair, label: "Pinpointing the behavior to shift" },
  { icon: Flag, label: "Shaping a clear objective" },
  { icon: ListChecks, label: "Defining measurable key results" },
  { icon: Gauge, label: "Setting baselines and targets" },
  { icon: Lightbulb, label: "Flagging assumptions to check" },
];

const STEP_MS = 2600;

export default function ClarifyRunningCard() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep((n) => (n + 1) % STEPS.length), STEP_MS);
    return () => clearInterval(id);
  }, []);

  const Icon = STEPS[step].icon;

  return (
    <div
      role="status"
      className="glass-card relative overflow-hidden p-10 text-center sm:p-12"
      style={{ boxShadow: "0 24px 60px -28px hsl(var(--phase-c) / 0.5)" }}
    >
      {/* Phase-tinted wash, anchored top so the light reads from above */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 h-48 blur-3xl"
        style={{
          background:
            "radial-gradient(50% 100% at 50% 0%, hsl(var(--phase-c) / 0.16), transparent 70%)",
        }}
      />

      {/* Focal element — radar pulse around the Clarify target */}
      <div className="relative mx-auto mb-7 grid h-24 w-24 place-items-center">
        <span
          aria-hidden
          className="absolute inset-0 rounded-full motion-safe:animate-ping"
          style={{ background: "hsl(var(--phase-c) / 0.12)", animationDuration: "2.6s" }}
        />
        <span
          aria-hidden
          className="absolute inset-2 rounded-full motion-safe:animate-ping"
          style={{
            background: "hsl(var(--phase-c) / 0.16)",
            animationDuration: "2.6s",
            animationDelay: "0.7s",
          }}
        />
        <span
          className="relative grid h-16 w-16 place-items-center rounded-full"
          style={{ background: "hsl(var(--phase-c) / 0.12)", color: "hsl(var(--phase-c))" }}
        >
          <Target className="h-7 w-7" strokeWidth={2.25} />
        </span>
      </div>

      <h2 className="heading-md mb-2">Running Clarify</h2>

      {/* Rotating "what's happening" line — keyed so it re-animates each step */}
      <div className="flex min-h-[1.75rem] items-center justify-center">
        <div key={step} className="flex items-center gap-2 motion-safe:animate-blur-in">
          <Icon
            aria-hidden
            className="h-4 w-4 shrink-0"
            style={{ color: "hsl(var(--phase-c))" }}
            strokeWidth={2.25}
          />
          <span className="text-sm font-medium text-foreground/70 sm:text-base">
            {STEPS[step].label}
          </span>
        </div>
      </div>

      {/* Indeterminate progress — GPU-friendly translateX sweep */}
      <div
        aria-hidden
        className="mx-auto mt-7 h-1.5 w-full max-w-xs overflow-hidden rounded-full"
        style={{ background: "hsl(var(--phase-c) / 0.12)" }}
      >
        <div
          className="h-full w-2/5 rounded-full motion-safe:animate-[progress-sweep_1.5s_ease-in-out_infinite] motion-reduce:w-full"
          style={{ background: "hsl(var(--phase-c))" }}
        />
      </div>

      <p className="mt-4 text-xs text-foreground/40">This usually takes under a minute.</p>
    </div>
  );
}
