import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import SEO from "@/components/SEO";
import Pipeline from "@/components/product/Pipeline";
import TeaserReport from "@/components/product/TeaserReport";
import ClarifyCard from "@/components/product/ClarifyCard";
import FullReport from "@/components/product/FullReport";
import type { ClarifyOutput, LeverageTeaser, LeverageFull } from "@/lib/clear/types";
import clarifyFixture from "@/lib/clear/fixtures/clarify.json";
import teaserFixture from "@/lib/clear/fixtures/leverage-teaser.json";
import fullFixture from "@/lib/clear/fixtures/leverage-full.json";

/**
 * In-app worked example for signed-in users. Renders the real CLEAR fixtures
 * through the same ClarifyCard / TeaserReport / FullReport components a live
 * project uses, so a brand-new user can see the exact shape of the deliverable
 * — Clarify objective, free leverage teaser, and the full COM-B report — without
 * filling the New Project form or waiting on a run. Fixtures only: no backend,
 * no entitlement, nothing to unlock, so it ships safely in prod (no dev imports).
 */
const SampleProject = () => {
  const clarify = clarifyFixture as ClarifyOutput;
  const teaser = teaserFixture as LeverageTeaser;
  const full = fullFixture as LeverageFull;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <SEO
        title="Example CLEAR project"
        description="A worked CLEAR project: the Clarify objective, the free leverage teaser, and the full COM-B barrier report — the same output you get on your own challenge."
        path="/app/projects/sample"
        noindex
      />

      <Link
        to="/app"
        className="inline-flex items-center text-sm text-foreground/50 hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> All projects
      </Link>

      {/* Orientation banner — this is an example, not the user's own project */}
      <div className="glass-card p-6 sm:p-8 mb-8 border-primary/20 bg-primary/5">
        <div className="flex items-start gap-3 mb-5">
          <div className="h-9 w-9 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="tag mb-2">Example project</span>
            <h1 className="heading-md">This is what CLEAR produces for your challenge</h1>
            <p className="body-md mt-2">
              A finished example, rendered exactly as your own report will be. Every phase below —
              Clarify, the free leverage teaser, and the full report — is real CLEAR output.
            </p>
          </div>
        </div>
        <Pipeline />
      </div>

      <div className="space-y-8">
        <ClarifyCard clarify={clarify} />
        <TeaserReport teaser={teaser} />
        <FullReport full={full} />
      </div>

      <div className="glass-card p-8 text-center mt-10">
        <h2 className="heading-md mb-2">Run this on your own challenge</h2>
        <p className="body-md mb-6">
          The Clarify objective and leverage teaser are always free. Start in minutes.
        </p>
        <Link to="/app/projects/new" className="btn-primary text-lg px-8 py-3">
          Start your own project
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </div>
  );
};

export default SampleProject;
