import { useState } from "react";
import { Play } from "lucide-react";
import type { ResourceEnvelope } from "@/lib/clear/types";

/**
 * Human-supplied resource envelope (budget · people · time). APEASE's
 * Affordability and Practicability are meaningless without it, so this gates the
 * intervention generation. Leaving a field blank tells the model to assume a
 * conservative default and flag it.
 */
const ResourceEnvelopeForm = ({
  initial,
  busy,
  onGenerate,
}: {
  initial?: ResourceEnvelope;
  busy: boolean;
  onGenerate: (envelope: ResourceEnvelope) => void;
}) => {
  const [budget, setBudget] = useState(initial?.budget ?? "");
  const [people, setPeople] = useState(initial?.people ?? "");
  const [time, setTime] = useState(initial?.time ?? "");

  return (
    <div className="glass-card p-6 sm:p-8">
      <h3 className="heading-md mb-1">Resource envelope</h3>
      <p className="body-md mb-5">
        Experiments are screened against what you can actually spend. Tell us the rough budget,
        people, and time available — leave a field blank and we'll assume a conservative default and
        flag it.
      </p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Budget</label>
          <input
            className="input"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="e.g. Minimal — no new spend, existing tools"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">People</label>
          <input
            className="input"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            placeholder="e.g. One engineer + a product lead, part-time"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Time</label>
          <input
            className="input"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="e.g. Two-week test window"
          />
        </div>
      </div>
      <button
        onClick={() => onGenerate({ budget, people, time })}
        disabled={busy}
        className="btn-primary mt-6"
      >
        <Play className="h-4 w-4 mr-1.5" /> {busy ? "Generating…" : "Generate interventions"}
      </button>
    </div>
  );
};

export default ResourceEnvelopeForm;
