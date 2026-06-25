import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Shared loading / error states for data views. Replaces the
 * `<div className="animate-pulse text-foreground/50">Loading…</div>` string that
 * was copy-pasted across every fetch surface, and generalizes the bespoke error
 * card from RespondentPortal so a failed load looks the same everywhere.
 */

export function LoadingState({
  label = "Loading…",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div className={cn("animate-pulse text-foreground/50", className)}>{label}</div>
  );
}

export function ErrorState({
  message = "Something went wrong while loading this.",
  onRetry,
  className,
}: {
  message?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("glass-card p-8 text-center", className)}>
      <h2 className="heading-md mb-2">Couldn't load this</h2>
      <p className="body-md">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary mt-5">
          <RefreshCw className="h-4 w-4 mr-1.5" /> Try again
        </button>
      )}
    </div>
  );
}
