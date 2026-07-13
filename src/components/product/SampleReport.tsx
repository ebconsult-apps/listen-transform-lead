import TeaserReport from "@/components/product/TeaserReport";
import ClarifyCard from "@/components/product/ClarifyCard";
import FullReport from "@/components/product/FullReport";
import AiGeneratedNotice from "@/components/product/AiGeneratedNotice";
import ReportFeedbackCard from "@/components/product/ReportFeedbackCard";
import {
  getSampleSegment,
  type SampleSegmentSlug,
} from "@/lib/clear/sample-datasets";

/**
 * A worked, segment-specific fixture example — Clarify objective, free leverage
 * teaser, and the full COM-B report — rendered through the same components a live
 * project uses. Shared by the public sample (/product/sample) and the in-app
 * example (/app/projects/sample), which differ only in chrome, CTAs, and the
 * segment picker. Fixtures only: no backend, no entitlement, no dev imports —
 * safe in prod. Pass `segment` (from a `?segment=` param) to pick the dataset.
 */
export default function SampleReport({ segment }: { segment?: SampleSegmentSlug | string | null }) {
  const { clarify, teaser, full } = getSampleSegment(segment);
  return (
    <div className="space-y-8">
      <AiGeneratedNotice />
      <ClarifyCard clarify={clarify} />
      <TeaserReport teaser={teaser} />
      <FullReport full={full} />
      <ReportFeedbackCard variant="sample" />
    </div>
  );
}
