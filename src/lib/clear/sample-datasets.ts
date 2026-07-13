/**
 * Segment-specific sample report datasets. Each segment is a complete fixture set
 * (Clarify OKR + free Leverage teaser + full COM-B report) matching the exact
 * shapes the report renderers consume, so a likely buyer sees a full, credible
 * report framed as THEIR problem rather than a generic one.
 *
 * These are the public sample only — the stub AI engine and dev mock still use the
 * generic `fixtures/*.json`. All organizations and people are fictional and the
 * page labels the output as an illustrative sample; never add real-company refs.
 *
 * The Product & Growth dataset is adapted from the recorded eval outputs that
 * scored 4.6+ on the quality rubric (evals/recorded/saas-churn.*).
 */
import type { ClarifyOutput, LeverageTeaser, LeverageFull } from "@/lib/clear/types";

import productGrowthClarify from "@/lib/clear/fixtures/samples/product-growth.clarify.json";
import productGrowthTeaser from "@/lib/clear/fixtures/samples/product-growth.leverage-teaser.json";
import productGrowthFull from "@/lib/clear/fixtures/samples/product-growth.leverage-full.json";

import peopleCultureClarify from "@/lib/clear/fixtures/samples/people-culture.clarify.json";
import peopleCultureTeaser from "@/lib/clear/fixtures/samples/people-culture.leverage-teaser.json";
import peopleCultureFull from "@/lib/clear/fixtures/samples/people-culture.leverage-full.json";

import healthcareClarify from "@/lib/clear/fixtures/samples/healthcare.clarify.json";
import healthcareTeaser from "@/lib/clear/fixtures/samples/healthcare.leverage-teaser.json";
import healthcareFull from "@/lib/clear/fixtures/samples/healthcare.leverage-full.json";

import manufacturingClarify from "@/lib/clear/fixtures/samples/manufacturing.clarify.json";
import manufacturingTeaser from "@/lib/clear/fixtures/samples/manufacturing.leverage-teaser.json";
import manufacturingFull from "@/lib/clear/fixtures/samples/manufacturing.leverage-full.json";

export type SampleSegmentSlug =
  | "product-growth"
  | "people-culture"
  | "healthcare"
  | "manufacturing";

export interface SampleSegment {
  slug: SampleSegmentSlug;
  /** Short pill-button label. */
  label: string;
  /** Who this sample is for — shown on the picker. */
  audience: string;
  /** One-line scenario descriptor shown under the report heading. */
  scenario: string;
  clarify: ClarifyOutput;
  teaser: LeverageTeaser;
  full: LeverageFull;
}

export const SAMPLE_SEGMENTS: SampleSegment[] = [
  {
    slug: "product-growth",
    label: "Product & Growth",
    audience: "Product & growth leaders",
    scenario:
      "A B2B SaaS trial converts only 6% to paid — most teams never get past solo setup to a shared workspace.",
    clarify: productGrowthClarify as ClarifyOutput,
    teaser: productGrowthTeaser as LeverageTeaser,
    full: productGrowthFull as LeverageFull,
  },
  {
    slug: "people-culture",
    label: "People & Culture",
    audience: "HR / People / L&D leaders",
    scenario:
      "Only 38% of direct reports had a manager 1:1 last month, even though managers agree they matter.",
    clarify: peopleCultureClarify as ClarifyOutput,
    teaser: peopleCultureTeaser as LeverageTeaser,
    full: peopleCultureFull as LeverageFull,
  },
  {
    slug: "healthcare",
    label: "Healthcare",
    audience: "Healthcare operations & quality leads",
    scenario:
      "Audited hand-hygiene compliance sits at 52% against a 90% target, collapsing at the before-contact moment.",
    clarify: healthcareClarify as ClarifyOutput,
    teaser: healthcareTeaser as LeverageTeaser,
    full: healthcareFull as LeverageFull,
  },
  {
    slug: "manufacturing",
    label: "Manufacturing & Safety",
    audience: "HSE & operations leaders",
    scenario:
      "Near-miss reporting is ~4/month across 180 operators while injuries creep up — classic under-reporting.",
    clarify: manufacturingClarify as ClarifyOutput,
    teaser: manufacturingTeaser as LeverageTeaser,
    full: manufacturingFull as LeverageFull,
  },
];

/** Strongest general-purpose sample; the default when no `?segment=` is given. */
export const DEFAULT_SAMPLE_SEGMENT: SampleSegmentSlug = "product-growth";

/** Resolve a slug (e.g. from a `?segment=` query param) to a segment, falling back to the default. */
export function getSampleSegment(slug?: string | null): SampleSegment {
  const found = slug ? SAMPLE_SEGMENTS.find((s) => s.slug === slug) : undefined;
  return found ?? SAMPLE_SEGMENTS.find((s) => s.slug === DEFAULT_SAMPLE_SEGMENT)!;
}
