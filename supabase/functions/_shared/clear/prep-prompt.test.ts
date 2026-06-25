import { describe, it, expect } from "vitest";
import { buildRespondentPrepPrompt, type RespondentPrepContext } from "./prep-prompt";

const base: RespondentPrepContext = {
  projectName: "Trial churn project",
  challenge: "Reduce trial-to-paid churn",
  targetGroup: "trial users",
  topLeveragePoints: [
    { rank: 1, point: "Onboarding friction in week one" },
    { rank: 2, point: "Unclear pricing at upgrade" },
  ],
  invitationNote: "Focus on EU customers please",
};

describe("buildRespondentPrepPrompt (EN)", () => {
  it("includes the project name and challenge", () => {
    const out = buildRespondentPrepPrompt(base, "en");
    expect(out).toContain("Trial churn project");
    expect(out).toContain("Reduce trial-to-paid churn");
  });

  it("lists the current top leverage points", () => {
    const out = buildRespondentPrepPrompt(base, "en");
    expect(out).toContain("Onboarding friction in week one");
    expect(out).toContain("Unclear pricing at upgrade");
  });

  it("asks what gets in the way in plain terms, without COM-B labels", () => {
    const out = buildRespondentPrepPrompt(base, "en");
    expect(out).toMatch(/in the way|friction|barrier/i);
    // COM-B categorisation is the LEVERAGE engine's job, not the stakeholder's AI.
    expect(out).not.toContain("Capability");
  });

  it("asks for the respondent's perspective and ideas", () => {
    const out = buildRespondentPrepPrompt(base, "en").toLowerCase();
    expect(out).toContain("perspective");
    expect(out).toMatch(/idea|what would help|test/);
  });

  it("includes the invitation note when provided", () => {
    expect(buildRespondentPrepPrompt(base, "en")).toContain("Focus on EU customers please");
  });
});

describe("buildRespondentPrepPrompt (edge cases)", () => {
  it("omits the leverage section gracefully when no map exists yet", () => {
    const out = buildRespondentPrepPrompt(
      { projectName: "Early project", challenge: "Improve adoption" },
      "en",
    );
    expect(out).not.toContain("undefined");
    expect(out.toLowerCase()).toContain("perspective");
  });

  it("omits the note line when absent", () => {
    const out = buildRespondentPrepPrompt(
      { projectName: "P", challenge: "C", topLeveragePoints: [] },
      "en",
    );
    expect(out).not.toContain("undefined");
  });
});

describe("buildRespondentPrepPrompt (SV)", () => {
  it("produces a different, Swedish-language prompt", () => {
    const en = buildRespondentPrepPrompt(base, "en");
    const sv = buildRespondentPrepPrompt(base, "sv");
    expect(sv).not.toEqual(en);
    expect(sv).toMatch(/\b(du|dina|perspektiv|underlag)\b/i);
  });
});
