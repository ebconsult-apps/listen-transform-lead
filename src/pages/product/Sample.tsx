import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SEO from "@/components/SEO";
import SampleReport from "@/components/product/SampleReport";
import SampleSegmentPicker from "@/components/product/SampleSegmentPicker";
import { useActiveSampleSegment } from "@/hooks/use-sample-segment";

/**
 * Public, unauthenticated sample of a CLEAR report — a segment-specific worked
 * example rendered through the same TeaserReport/FullReport components the app
 * uses, so the leverage priority map and visual systems map are visible without
 * signing up. The `?segment=` param picks which buyer's challenge is shown.
 */
const Sample = () => {
  const segment = useActiveSampleSegment();
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <SEO
        title={`Sample CLEAR report: ${segment.label} — leverage & COM-B analysis`}
        description={`See a worked CLEAR report for ${segment.audience}: ${segment.scenario} The leverage priority map, the visual systems map, and the full COM-B barrier analysis.`}
        path="/product/sample"
      />

      <Link to="/product" className="inline-flex items-center text-sm text-foreground/50 hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to product
      </Link>

      <div className="mb-6">
        <span className="tag mb-3">Sample report</span>
        <h1 className="heading-lg">How a CLEAR report looks</h1>
        <p className="body-md mt-2">
          A worked example: the leverage priority map, the systems map of cause and effect, and the
          full COM-B barrier analysis — the same output you get on your own challenge. Pick the
          version closest to yours.
        </p>
      </div>

      <SampleSegmentPicker className="mb-6" />

      {/* Scenario line for the active segment — this is an illustrative example. */}
      <div className="mb-8 rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground/70">
        <span className="font-medium text-foreground/80">Illustrative example — {segment.label}:</span>{" "}
        {segment.scenario}
      </div>

      <SampleReport segment={segment.slug} />

      <div className="glass-card p-8 text-center mt-10">
        <h2 className="heading-md mb-2">Run this on your own challenge</h2>
        <p className="body-md mb-6">The teaser is always free. Start in minutes.</p>
        <Link to="/signup" className="btn-primary text-lg px-8 py-3">
          Start free
        </Link>
      </div>
    </div>
  );
};

export default Sample;
