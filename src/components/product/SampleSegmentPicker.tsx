import { useSearchParams } from "react-router-dom";
import {
  SAMPLE_SEGMENTS,
  getSampleSegment,
  DEFAULT_SAMPLE_SEGMENT,
} from "@/lib/clear/sample-datasets";

/**
 * Pill buttons that switch the sample report between buyer segments. Each pill
 * writes a shareable `?segment=` URL (the default segment keeps the param clean).
 */
export default function SampleSegmentPicker({ className = "" }: { className?: string }) {
  const [params, setParams] = useSearchParams();
  const active = getSampleSegment(params.get("segment")).slug;

  const select = (slug: string) => {
    const next = new URLSearchParams(params);
    if (slug === DEFAULT_SAMPLE_SEGMENT) {
      next.delete("segment");
    } else {
      next.set("segment", slug);
    }
    setParams(next, { replace: true });
    // Bring the report into view from the top after switching.
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={className}>
      <p className="text-sm font-medium text-foreground/60 mb-2">See the sample for:</p>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Sample report segment">
        {SAMPLE_SEGMENTS.map((s) => {
          const isActive = s.slug === active;
          return (
            <button
              key={s.slug}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => select(s.slug)}
              title={s.audience}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                isActive
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-white/50 text-foreground/70 hover:border-primary/40 hover:bg-primary/5"
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
