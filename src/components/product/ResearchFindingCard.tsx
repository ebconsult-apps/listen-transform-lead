import { type ReactNode } from "react";
import { ExternalLink, Library } from "lucide-react";
import type { ResearchFindingRow } from "@/lib/db";

/** Evidence-provenance styles for a finding's flag badge. */
const FLAG_STYLE: Record<string, string> = {
  V: "bg-emerald-500/15 text-emerald-700",
  A: "bg-amber-500/15 text-amber-700",
  G: "bg-rose-500/15 text-rose-700",
  NA: "bg-foreground/10 text-foreground/60",
};
const FLAG_LABEL: Record<string, string> = {
  V: "Verified",
  A: "Assumption",
  G: "Gap",
  NA: "N/A",
};

/**
 * One research finding: evidence flag, phase target, confidence, status, claim,
 * detail, and citations. Presentation only — pass curate/promote controls as
 * `children` (the Research tab does; the gaps panel renders it read-only).
 */
const ResearchFindingCard = ({
  finding: f,
  className,
  children,
}: {
  finding: ResearchFindingRow;
  className?: string;
  children?: ReactNode;
}) => (
  <div className={`glass-card p-5 ${className ?? ""}`}>
    <div className="flex items-center gap-2 flex-wrap">
      <span
        className={`text-xs font-medium px-2 py-0.5 rounded ${FLAG_STYLE[f.evidence_flag] ?? FLAG_STYLE.NA}`}
      >
        {FLAG_LABEL[f.evidence_flag] ?? f.evidence_flag}
      </span>
      <span className="text-xs uppercase tracking-wide text-foreground/40">{f.phase_target}</span>
      {typeof f.confidence === "number" && (
        <span className="text-xs text-foreground/40">· {f.confidence}% confidence</span>
      )}
      {f.status === "accepted" && (
        <span className="text-xs font-medium text-emerald-700">· Accepted</span>
      )}
      {f.status === "promoted" && (
        <span className="inline-flex items-center text-xs font-medium text-primary">
          <Library className="h-3 w-3 mr-1" /> In shared library
        </span>
      )}
    </div>

    <p className="body-md mt-2 font-medium">{f.claim}</p>
    {f.detail && <p className="text-sm text-foreground/70 mt-1">{f.detail}</p>}

    {f.citations?.length > 0 && (
      <ul className="mt-2 space-y-1">
        {f.citations.map((c, i) => (
          <li key={i} className="text-xs text-foreground/60">
            {c.url ? (
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center hover:text-primary"
              >
                {c.title} <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            ) : (
              <span>{c.title}</span>
            )}
            {c.note && <span className="text-foreground/40">: {c.note}</span>}
          </li>
        ))}
      </ul>
    )}

    {children}
  </div>
);

export default ResearchFindingCard;
