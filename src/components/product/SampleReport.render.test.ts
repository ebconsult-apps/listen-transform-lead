import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import SampleReport from "@/components/product/SampleReport";
import { SAMPLE_SEGMENTS } from "@/lib/clear/sample-datasets";

/**
 * End-to-end render smoke test: mounts the full public SampleReport (Clarify +
 * teaser + full COM-B report, the same components a live project uses) for every
 * segment and asserts it produces markup without throwing. Wrapped in
 * TooltipProvider to mirror the global provider in App.tsx. This is the
 * no-browser stand-in for walking each picker tab — a malformed fixture that the
 * renderers choke on fails here rather than in production.
 */
describe("SampleReport renders every segment", () => {
  for (const seg of SAMPLE_SEGMENTS) {
    it(`renders the ${seg.slug} sample without throwing`, () => {
      const html = renderToStaticMarkup(
        createElement(TooltipProvider, null, createElement(SampleReport, { segment: seg.slug })),
      );
      // A real report is substantial; guard against an empty/short render.
      expect(html.length).toBeGreaterThan(2000);
      // The objective and headline text should make it into the markup.
      expect(html).toContain(seg.full.headline.slice(0, 24));
    });
  }
});
