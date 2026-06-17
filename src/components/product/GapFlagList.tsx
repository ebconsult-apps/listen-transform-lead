import type { GapFlag } from "@/lib/clear/types";
import { FLAG_LABEL } from "@/lib/clear/labels";

const flagClass: Record<GapFlag["type"], string> = {
  assumption: "bg-amber-500/15 text-amber-600",
  gap: "bg-rose-500/15 text-rose-600",
  input_needed: "bg-sky-500/15 text-sky-600",
  user_input: "bg-sky-500/15 text-sky-600",
  needs_input: "bg-violet-500/15 text-violet-600",
  requires_confirmation: "bg-violet-500/15 text-violet-600",
};

export const FlagBadge = ({ type }: { type: GapFlag["type"] }) => (
  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap ${flagClass[type]}`}>
    {FLAG_LABEL[type]}
  </span>
);

/** Render a list of never-fabricate flags (assumptions, gaps, input-needed, …). */
const GapFlagList = ({ flags }: { flags: GapFlag[] }) => {
  if (!flags.length) return <p className="text-sm text-foreground/50">None recorded.</p>;
  return (
    <ul className="space-y-2.5">
      {flags.map((f, i) => (
        <li key={i} className="flex items-start gap-2 text-sm">
          <FlagBadge type={f.type} />
          <span className="text-foreground/80">
            {f.content}
            {f.source && <span className="text-foreground/45"> — {f.source}</span>}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default GapFlagList;
