import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SEO from "@/components/SEO";
import SampleReport from "@/components/product/SampleReport";

/**
 * Public, unauthenticated sample of a CLEAR report — the worked fixture example
 * rendered through the same TeaserReport/FullReport components the app uses, so
 * the leverage priority map and visual systems map are visible without signing up.
 */
const Sample = () => (
  <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <SEO
      title="Sample CLEAR report: leverage priority map & systems map"
      description="See a worked CLEAR leverage report: the leverage priority map, the visual systems map of cause and effect, and the full COM-B barrier analysis."
      path="/product/sample"
    />

    <Link to="/product" className="inline-flex items-center text-sm text-foreground/50 hover:text-foreground mb-4">
      <ArrowLeft className="h-4 w-4 mr-1" /> Back to product
    </Link>

    <div className="mb-8">
      <span className="tag mb-3">Sample report</span>
      <h1 className="heading-lg">How a CLEAR report looks</h1>
      <p className="body-md mt-2">
        A worked example: the leverage priority map, the systems map of cause and effect, and the
        full COM-B barrier analysis, the same output you get on your own challenge.
      </p>
    </div>

    <SampleReport />

    <div className="glass-card p-8 text-center mt-10">
      <h2 className="heading-md mb-2">Run this on your own challenge</h2>
      <p className="body-md mb-6">The teaser is always free. Start in minutes.</p>
      <Link to="/signup" className="btn-primary text-lg px-8 py-3">
        Start free
      </Link>
    </div>
  </div>
);

export default Sample;
