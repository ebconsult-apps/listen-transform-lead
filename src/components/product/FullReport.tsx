import type { LeverageFull } from "@/lib/clear/types";

/** Paid sections: COM-B matrix + evidence, barrier narratives, gap log, discovery. */
const FullReport = ({ full }: { full: LeverageFull }) => {
  return (
    <div className="space-y-6">
      {/* COM-B */}
      <div className="glass-card p-6 sm:p-8">
        <h3 className="heading-md mb-4">COM-B barrier analysis</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-foreground/50 border-b border-border">
                <th className="py-2 pr-4 font-medium">Factor</th>
                <th className="py-2 pr-4 font-medium">Barrier</th>
                <th className="py-2 font-medium">Evidence</th>
              </tr>
            </thead>
            <tbody>
              {full.comb.map((c, i) => (
                <tr key={i} className="border-b border-border/60 align-top">
                  <td className="py-3 pr-4 font-medium whitespace-nowrap">{c.factor}</td>
                  <td className="py-3 pr-4 text-foreground/80">{c.barrier}</td>
                  <td className="py-3 text-foreground/60">{c.evidence ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Barrier narratives */}
      <div className="glass-card p-6 sm:p-8">
        <h3 className="heading-md mb-4">Why each lever works</h3>
        <div className="space-y-4">
          {full.barrierNarratives.map((b, i) => (
            <div key={i} className="border-l-2 border-primary/30 pl-4">
              <p className="font-semibold">{b.point}</p>
              <p className="text-sm text-foreground/70 mt-1">{b.narrative}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Gap log + discovery */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card p-6 sm:p-8">
          <h3 className="heading-md mb-4">Gap log</h3>
          <ul className="space-y-2 list-disc pl-5 text-sm text-foreground/80">
            {full.gapLog.map((g, i) => (
              <li key={i}>{g}</li>
            ))}
          </ul>
        </div>
        <div className="glass-card p-6 sm:p-8">
          <h3 className="heading-md mb-4">Discovery activities</h3>
          <ul className="space-y-2 list-disc pl-5 text-sm text-foreground/80">
            {full.discoveryActivities.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FullReport;
