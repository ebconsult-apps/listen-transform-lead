import { describe, it, expect } from "vitest";
import {
  checkIntakeBudget,
  estimateIntakeInputTokens,
  estimateTokens,
  MAX_DOCUMENTS,
  MAX_INTAKE_CHARS,
  OVERHEAD_INPUT_TOKENS,
  PER_DOCUMENT_CHAR_SLICE,
  projectedCostUsd,
} from "./intake-budget.ts";

const doc = (chars: number, filename = "f.txt") => ({
  filename,
  text: "x".repeat(chars),
});

describe("checkIntakeBudget", () => {
  it("passes within limits", () => {
    const r = checkIntakeBudget([doc(1000), doc(2000)]);
    expect(r.ok).toBe(true);
    expect(r.docCount).toBe(2);
    expect(r.totalChars).toBe(3000);
  });

  it("rejects too many documents (counts full text, not the slice)", () => {
    const docs = Array.from({ length: MAX_DOCUMENTS + 1 }, () => doc(10));
    const r = checkIntakeBudget(docs);
    expect(r.ok).toBe(false);
    expect(r.reason).toMatch(/too many documents/i);
  });

  it("rejects total size over the char cap", () => {
    const r = checkIntakeBudget([doc(MAX_INTAKE_CHARS + 1)]);
    expect(r.ok).toBe(false);
    expect(r.reason).toMatch(/too large/i);
  });

  it("honours custom limits", () => {
    expect(checkIntakeBudget([doc(50), doc(60)], { maxDocs: 1 }).ok).toBe(false);
    expect(checkIntakeBudget([doc(50)], { maxChars: 10 }).ok).toBe(false);
  });
});

describe("estimateTokens", () => {
  it("~4 chars per token, clamped at 0", () => {
    expect(estimateTokens(0)).toBe(0);
    expect(estimateTokens(-100)).toBe(0);
    expect(estimateTokens(4)).toBe(1);
    expect(estimateTokens(10)).toBe(3); // ceil(10/4)
  });
});

describe("estimateIntakeInputTokens", () => {
  it("adds overhead and slices each doc to the per-doc cap", () => {
    const challenge = "y".repeat(400); // 100 tokens
    // One doc far larger than the slice — only PER_DOCUMENT_CHAR_SLICE counts.
    const docs = [doc(PER_DOCUMENT_CHAR_SLICE * 5)];
    const expected =
      estimateTokens(400 + PER_DOCUMENT_CHAR_SLICE) + OVERHEAD_INPUT_TOKENS;
    expect(estimateIntakeInputTokens(challenge, docs)).toBe(expected);
  });

  it("a tiny intake is ~overhead", () => {
    expect(estimateIntakeInputTokens("", [])).toBe(OVERHEAD_INPUT_TOKENS);
  });
});

describe("projectedCostUsd", () => {
  it("prices input + worst-case output per million", () => {
    // 10k input + 6k output at Sonnet ($3/$15): 0.03 + 0.09 = 0.12
    expect(projectedCostUsd(10_000, 6_000, { in: 3, out: 15 })).toBeCloseTo(0.12, 6);
  });
});
