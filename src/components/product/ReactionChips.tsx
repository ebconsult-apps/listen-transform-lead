import { cn } from "@/lib/utils";
import type { ReactionValue } from "@/lib/db";

const OPTIONS: { value: ReactionValue; label: string }[] = [
  { value: "resonates", label: "Resonates" },
  { value: "unsure", label: "Not sure" },
  { value: "missing", label: "Missing something" },
];

/** Three mutually-exclusive reaction chips for a single leverage point. */
const ReactionChips = ({
  value,
  onChange,
}: {
  value?: ReactionValue;
  onChange: (v: ReactionValue) => void;
}) => (
  <div className="flex flex-wrap gap-2">
    {OPTIONS.map((o) => (
      <button
        key={o.value}
        type="button"
        onClick={() => onChange(o.value)}
        aria-pressed={value === o.value}
        className={cn(
          "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
          value === o.value
            ? "border-primary bg-primary/10 text-primary"
            : "border-border text-foreground/60 hover:bg-muted",
        )}
      >
        {o.label}
      </button>
    ))}
  </div>
);

export default ReactionChips;
