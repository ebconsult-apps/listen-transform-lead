import { describe, it, expect } from "vitest";
import { pickClarify } from "./clarify";
import type { ClarifyOutput } from "./clear/types";

const approved = { objective: "approved" } as ClarifyOutput;
const latest = { objective: "latest run" } as ClarifyOutput;

describe("pickClarify", () => {
  it("prefers the owner-approved Clarify over the latest run", () => {
    expect(pickClarify(approved, latest)).toBe(approved);
  });
  it("falls back to the latest run when there is no approval", () => {
    expect(pickClarify(null, latest)).toBe(latest);
  });
  it("returns null when neither exists", () => {
    expect(pickClarify(null, null)).toBeNull();
  });
});
