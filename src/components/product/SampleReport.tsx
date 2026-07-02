import TeaserReport from "@/components/product/TeaserReport";
import ClarifyCard from "@/components/product/ClarifyCard";
import FullReport from "@/components/product/FullReport";
import type { ClarifyOutput, LeverageTeaser, LeverageFull } from "@/lib/clear/types";
import clarifyFixture from "@/lib/clear/fixtures/clarify.json";
import teaserFixture from "@/lib/clear/fixtures/leverage-teaser.json";
import fullFixture from "@/lib/clear/fixtures/leverage-full.json";

const clarify = clarifyFixture as ClarifyOutput;
const teaser = teaserFixture as LeverageTeaser;
const full = fullFixture as LeverageFull;

/**
 * The worked fixture example — Clarify objective, free leverage teaser, and the
 * full COM-B report — rendered through the same components a live project uses.
 * Shared by the public sample (/product/sample) and the in-app example
 * (/app/projects/sample), which differ only in chrome and CTAs. Fixtures only:
 * no backend, no entitlement, no dev imports — safe in prod.
 */
export default function SampleReport() {
  return (
    <div className="space-y-8">
      <ClarifyCard clarify={clarify} />
      <TeaserReport teaser={teaser} />
      <FullReport full={full} />
    </div>
  );
}
