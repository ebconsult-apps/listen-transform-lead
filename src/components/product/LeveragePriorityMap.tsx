import type { LeveragePoint, Level } from "@/lib/clear/types";

/**
 * Leverage priority map — plots each lever on an Impact (Y) × Ease (X) grid,
 * sized by confidence. Turns the ranked list into a spatial "do this first"
 * picture. Presentation-only: it reads the scores the engine already produces.
 * Clicking a bubble scrolls to its matching card (id `lever-<rank>`).
 */

const LEVEL_INDEX: Record<Level, number> = { Low: 0, Medium: 1, High: 2 };

// SVG user units; the whole thing scales responsively via the viewBox.
const PAD_LEFT = 96;
const PAD_TOP = 40;
const CELL = 112;
const PLOT = CELL * 3;
const PLOT_RIGHT = PAD_LEFT + PLOT;
const PLOT_BOTTOM = PAD_TOP + PLOT;
const VIEW_W = PLOT_RIGHT + 28;
const VIEW_H = PLOT_BOTTOM + 44;

const TEAL = "hsl(var(--phase-l))";
const INK = "hsl(var(--foreground))";

const scrollToLever = (rank: number) => {
  document.getElementById(`lever-${rank}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
};

const radiusFor = (confidence: number) => {
  const c = Math.max(0, Math.min(100, confidence));
  return 13 + (c / 100) * 19; // 13–32
};

interface Placed extends LeveragePoint {
  x: number;
  y: number;
  r: number;
}

// Position each lever at its impact×ease cell centre, dodging horizontally when
// several levers land in the same cell so bubbles never fully overlap.
function place(points: LeveragePoint[]): Placed[] {
  const byCell = new Map<string, LeveragePoint[]>();
  for (const p of points) {
    const key = `${LEVEL_INDEX[p.ease]}-${LEVEL_INDEX[p.impact]}`;
    const arr = byCell.get(key) ?? [];
    arr.push(p);
    byCell.set(key, arr);
  }
  const placed: Placed[] = [];
  for (const [key, arr] of byCell) {
    const [col, row] = key.split("-").map(Number);
    const cx = PAD_LEFT + (col + 0.5) * CELL;
    const cy = PLOT_BOTTOM - (row + 0.5) * CELL;
    const n = arr.length;
    const spread = n > 1 ? Math.min(34, (CELL - 24) / n) : 0;
    arr.forEach((p, i) => {
      placed.push({ ...p, x: cx + (i - (n - 1) / 2) * spread, y: cy, r: radiusFor(p.confidence) });
    });
  }
  return placed;
}

const TICKS: Level[] = ["Low", "Medium", "High"];

const LeveragePriorityMap = ({ points }: { points: LeveragePoint[] }) => {
  const placed = place(points);
  return (
    <figure className="m-0">
      <div className="mx-auto max-w-[520px]">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="w-full h-auto"
          role="img"
          aria-label="Leverage priority map: each lever plotted by impact and ease, bubble size shows confidence."
        >
          {/* grid */}
          <g stroke="hsl(var(--border))" strokeWidth={1}>
            <rect x={PAD_LEFT} y={PAD_TOP} width={PLOT} height={PLOT} fill="none" />
            <line x1={PAD_LEFT + CELL} y1={PAD_TOP} x2={PAD_LEFT + CELL} y2={PLOT_BOTTOM} />
            <line x1={PAD_LEFT + CELL * 2} y1={PAD_TOP} x2={PAD_LEFT + CELL * 2} y2={PLOT_BOTTOM} />
            <line x1={PAD_LEFT} y1={PAD_TOP + CELL} x2={PLOT_RIGHT} y2={PAD_TOP + CELL} />
            <line x1={PAD_LEFT} y1={PAD_TOP + CELL * 2} x2={PLOT_RIGHT} y2={PAD_TOP + CELL * 2} />
          </g>

          {/* "do first" zone — high impact, high ease */}
          <rect
            x={PLOT_RIGHT - CELL}
            y={PAD_TOP}
            width={CELL}
            height={CELL}
            fill="hsl(var(--phase-l) / 0.08)"
            stroke={TEAL}
            strokeWidth={1}
            strokeDasharray="5 4"
          />
          <text x={PLOT_RIGHT - CELL / 2} y={PAD_TOP + 18} textAnchor="middle" fill={TEAL} style={{ fontSize: 12, fontWeight: 500 }}>
            Do first
          </text>

          {/* axis ticks */}
          {TICKS.map((lab, i) => (
            <text key={`x-${lab}`} x={PAD_LEFT + (i + 0.5) * CELL} y={PLOT_BOTTOM + 20} textAnchor="middle" fill={INK} opacity={0.55} style={{ fontSize: 12 }}>
              {lab}
            </text>
          ))}
          {TICKS.map((lab, i) => (
            <text key={`y-${lab}`} x={PAD_LEFT - 10} y={PLOT_BOTTOM - (i + 0.5) * CELL} textAnchor="end" dominantBaseline="central" fill={INK} opacity={0.55} style={{ fontSize: 12 }}>
              {lab}
            </text>
          ))}

          {/* axis titles */}
          <text x={PAD_LEFT + PLOT / 2} y={VIEW_H - 8} textAnchor="middle" fill={INK} opacity={0.7} style={{ fontSize: 13, fontWeight: 500 }}>
            Ease →
          </text>
          <text transform={`rotate(-90 20 ${PAD_TOP + PLOT / 2})`} x={20} y={PAD_TOP + PLOT / 2} textAnchor="middle" fill={INK} opacity={0.7} style={{ fontSize: 13, fontWeight: 500 }}>
            Impact →
          </text>

          {/* levers */}
          {placed.map((p) => (
            <g
              key={p.rank}
              className="cursor-pointer transition-transform duration-150 hover:scale-110 focus:outline-none focus-visible:scale-110"
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
              role="button"
              tabIndex={0}
              aria-label={`Lever ${p.rank}: ${p.point}. Impact ${p.impact}, ease ${p.ease}, confidence ${p.confidence} percent. Activate to view details.`}
              onClick={() => scrollToLever(p.rank)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  scrollToLever(p.rank);
                }
              }}
            >
              <title>{`${p.point} — impact ${p.impact}, ease ${p.ease}, ${p.confidence}% confidence`}</title>
              <circle cx={p.x} cy={p.y} r={p.r} fill={TEAL} fillOpacity={0.92} />
              <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fill="white" style={{ fontSize: 15, fontWeight: 600 }}>
                {p.rank}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <figcaption className="mt-2 text-xs text-foreground/50 text-center">
        Position = impact × ease · bubble size = confidence · tap a lever for its detail
      </figcaption>
    </figure>
  );
};

export default LeveragePriorityMap;
