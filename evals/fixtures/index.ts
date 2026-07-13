import type { IntakeInput, ResourceEnvelope } from "../../supabase/functions/_shared/clear/types.ts";
import * as saasChurn from "./saas-churn.ts";
import * as handHygiene from "./hospital-hand-hygiene.ts";
import * as manufacturingSafety from "./manufacturing-safety.ts";

export interface Fixture {
  /** Stable slug used in filenames (recorded outputs, results) and CLI filters. */
  id: string;
  label: string;
  intake: IntakeInput;
  /** Resource envelope for the EXPERIMENT phase (APEASE needs it). */
  envelope: ResourceEnvelope;
}

export const FIXTURES: Fixture[] = [
  { id: "saas-churn", label: "B2B SaaS trial-to-paid churn", intake: saasChurn.intake, envelope: saasChurn.envelope },
  {
    id: "hospital-hand-hygiene",
    label: "Hospital hand-hygiene compliance",
    intake: handHygiene.intake,
    envelope: handHygiene.envelope,
  },
  {
    id: "manufacturing-safety",
    label: "Manufacturing near-miss reporting",
    intake: manufacturingSafety.intake,
    envelope: manufacturingSafety.envelope,
  },
];

export function fixtureById(id: string): Fixture | undefined {
  return FIXTURES.find((f) => f.id === id);
}
