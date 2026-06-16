import type { LeveragePoint, Level } from "@/lib/clear/types";

const levelClass: Record<Level, string> = {
  High: "bg-[hsl(var(--phase-l))]/15 text-[hsl(var(--phase-l))]",
  Medium: "bg-[hsl(var(--phase-a))]/15 text-amber-600",
  Low: "bg-secondary text-foreground/60",
};

const Badge = ({ level }: { level: Level }) => (
  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${levelClass[level]}`}>
    {level}
  </span>
);

const LeverageTable = ({ points }: { points: LeveragePoint[] }) => {
  return (
    <div className="space-y-4">
      {points.map((p) => (
        <div key={p.rank} className="border border-border rounded-xl p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 h-7 w-7 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
              {p.rank}
            </div>
            <div className="flex-grow">
              <h4 className="font-semibold text-foreground">{p.point}</h4>
              <p className="text-sm text-foreground/70 mt-1">{p.currentState}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="text-foreground/50">Impact</span>
                  <Badge level={p.impact} />
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-foreground/50">Ease</span>
                  <Badge level={p.ease} />
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-foreground/50">Confidence</span>
                  <span className="font-medium text-foreground/80">{p.confidence}%</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeverageTable;
