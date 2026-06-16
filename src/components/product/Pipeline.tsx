/**
 * C-L-E-A-R pipeline visual. Stage 1 delivers C + partial L; E/A/R are shown
 * dimmed as "coming later". Phase colours map the deck's c1–c5 onto the
 * light-theme --phase-* tokens defined in index.css.
 */
const PHASES = [
  { letter: "C", name: "Clarify", token: "--phase-c", active: true, desc: "Objective + Key Results" },
  { letter: "L", name: "Leverage", token: "--phase-l", active: true, desc: "Systems map + leverage points" },
  { letter: "E", name: "Experiment", token: "--phase-e", active: false, desc: "Test cards" },
  { letter: "A", name: "Analyse", token: "--phase-a", active: false, desc: "Read the signal" },
  { letter: "R", name: "Refine", token: "--phase-r", active: false, desc: "Iterate" },
] as const;

const Pipeline = ({ compact = false }: { compact?: boolean }) => {
  return (
    <div className="flex flex-wrap items-stretch justify-center gap-3 sm:gap-4">
      {PHASES.map((p) => (
        <div
          key={p.letter}
          className={`flex flex-col items-center text-center ${p.active ? "" : "opacity-40"}`}
          style={{ minWidth: compact ? 64 : 110 }}
        >
          <div
            className="phase-chip"
            style={{ backgroundColor: `hsl(var(${p.token}))` }}
            aria-hidden
          >
            {p.letter}
          </div>
          <span className="mt-2 text-sm font-semibold">{p.name}</span>
          {!compact && (
            <span className="text-xs text-foreground/50 mt-0.5 max-w-[120px]">
              {p.active ? p.desc : "Later"}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default Pipeline;
