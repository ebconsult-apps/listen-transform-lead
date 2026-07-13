import { useSearchParams } from "react-router-dom";
import { getSampleSegment, type SampleSegment } from "@/lib/clear/sample-datasets";

/**
 * Reads the active sample segment from the `?segment=` query param (falling back
 * to the strongest general-purpose default), so both the picker and the page that
 * renders the report agree on which dataset to show and share the same URL.
 */
export function useActiveSampleSegment(): SampleSegment {
  const [params] = useSearchParams();
  return getSampleSegment(params.get("segment"));
}
