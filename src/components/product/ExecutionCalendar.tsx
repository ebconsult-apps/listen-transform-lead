import type { TestCardRow } from "@/lib/db";

const statusClass: Record<string, string> = {
  planned: "bg-secondary text-foreground/60",
  running: "bg-sky-500/15 text-sky-600",
  done: "bg-emerald-500/15 text-emerald-600",
  archived: "bg-secondary text-foreground/40",
};

/** Week-by-week execution view derived from the test cards. */
const ExecutionCalendar = ({ cards }: { cards: TestCardRow[] }) => {
  if (!cards.length) return null;
  const sorted = [...cards].sort((a, b) => (a.calendar_week ?? 99) - (b.calendar_week ?? 99));
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-foreground/50 border-b border-border">
            <th className="py-2 pr-4 font-medium w-16">Week</th>
            <th className="py-2 pr-4 font-medium">Test</th>
            <th className="py-2 pr-4 font-medium">Owner</th>
            <th className="py-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((c) => (
            <tr key={c.id} className="border-b border-border/60">
              <td className="py-2.5 pr-4 text-foreground/70">{c.calendar_week ?? "—"}</td>
              <td className="py-2.5 pr-4 font-medium">{c.leverage_point || c.action || "Untitled test"}</td>
              <td className="py-2.5 pr-4 text-foreground/60">{c.owner_role || "—"}</td>
              <td className="py-2.5">
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${statusClass[c.status] ?? statusClass.planned}`}>
                  {c.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExecutionCalendar;
