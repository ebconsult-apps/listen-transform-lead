import { describe, it, expect } from "vitest";
import { buildOwnerPrepPrompt, type OwnerPrepContext } from "./prep-prompt";

const base: OwnerPrepContext = {
  challenge: "Reduce trial-to-paid churn in the first 14 days",
  stakeholders: [
    { role: "Product manager" },
    { role: "Customer success lead", name: "Sam" },
  ],
  timeline: "Pilot within one quarter",
  targetGroup: "trial users",
  useCase: "churn",
};

describe("buildOwnerPrepPrompt (EN)", () => {
  it("includes the challenge text", () => {
    expect(buildOwnerPrepPrompt(base, "en")).toContain(
      "Reduce trial-to-paid churn in the first 14 days",
    );
  });

  it("lists every stakeholder role", () => {
    const out = buildOwnerPrepPrompt(base, "en");
    expect(out).toContain("Product manager");
    expect(out).toContain("Customer success lead");
  });

  it("names the three C/L/E deliverable files", () => {
    const out = buildOwnerPrepPrompt(base, "en");
    expect(out).toContain("clarity-brief.md");
    expect(out).toContain("leverage-evidence.md");
    expect(out).toContain("experimentation-options.md");
  });

  it("covers the COM-B components for the leverage deliverable", () => {
    const out = buildOwnerPrepPrompt(base, "en");
    expect(out).toContain("Capability");
    expect(out).toContain("Opportunity");
    expect(out).toContain("Motivation");
  });

  it("asks for the experimentation resource envelope", () => {
    const out = buildOwnerPrepPrompt(base, "en").toLowerCase();
    expect(out).toContain("budget");
    expect(out).toContain("people");
    expect(out).toContain("time");
  });

  it("carries the never-fabricate rule (flag gaps, don't invent)", () => {
    const out = buildOwnerPrepPrompt(base, "en");
    expect(out).toMatch(/never (make up|invent|fabricate)/i);
    expect(out.toLowerCase()).toContain("gap");
  });

  it("interpolates the target group into the prompt", () => {
    expect(buildOwnerPrepPrompt(base, "en")).toContain("trial users");
  });
});

describe("buildOwnerPrepPrompt (edge cases)", () => {
  it("omits optional fields cleanly when absent", () => {
    const out = buildOwnerPrepPrompt(
      { challenge: "Increase form completion", stakeholders: [] },
      "en",
    );
    expect(out).not.toContain("undefined");
    expect(out).not.toMatch(/Timeline:\s*$/m);
    expect(out).toContain("Increase form completion");
  });
});

describe("buildOwnerPrepPrompt (SV)", () => {
  it("produces a different, Swedish-language prompt but keeps English filenames", () => {
    const en = buildOwnerPrepPrompt(base, "en");
    const sv = buildOwnerPrepPrompt(base, "sv");
    expect(sv).not.toEqual(en);
    // A Swedish function/word that won't appear in the English template.
    expect(sv).toMatch(/\b(du|dina|dokument|underlag)\b/i);
    // Upload filenames stay in English so they map to the intake.
    expect(sv).toContain("clarity-brief.md");
  });
});
