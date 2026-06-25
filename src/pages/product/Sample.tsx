import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SEO from "@/components/SEO";
import TeaserReport from "@/components/product/TeaserReport";
import ClarifyCard from "@/components/product/ClarifyCard";
import FullReport from "@/components/product/FullReport";
import type { ClarifyOutput, LeverageTeaser, LeverageFull } from "@/lib/clear/types";
import clarifyFixture from "@/lib/clear/fixtures/clarify.json";
import teaserFixture from "@/lib/clear/fixtures/leverage-teaser.json";
import fullFixture from "@/lib/clear/fixtures/leverage-full.json";

/**
 * Public, unauthenticated sample of a CLEAR report — the worked fixture example
 * rendered through the same TeaserReport/FullReport components the app uses, so
 * the leverage priority map and visual systems map are visible without signing up.
 */
const Sample = () => {
  const clarify = clarifyFixture as ClarifyOutput;
  const teaser = teaserFixture as LeverageTeaser;
  const full = fullFixture as LeverageFull;

  return (
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

      <div className="space-y-8">
        <ClarifyCard clarify={clarify} />
        <TeaserReport teaser={teaser} />
        <FullReport full={full} />
      </div>

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
