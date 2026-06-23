import { describe, expect, it } from "vitest";
import {
  collectDictationResults,
  type DictationResultLike,
} from "./dictation-results";

const final = (transcript: string): DictationResultLike => ({
  isFinal: true,
  transcript,
});
const interim = (transcript: string): DictationResultLike => ({
  isFinal: false,
  transcript,
});

describe("collectDictationResults", () => {
  it("emits a freshly finalized segment once", () => {
    const result = collectDictationResults([final("I want")], 0);
    expect(result.finals).toEqual(["I want"]);
    expect(result.interim).toBe("");
    expect(result.emittedFinalCount).toBe(1);
  });

  it("exposes not-yet-final words as interim without emitting them", () => {
    const result = collectDictationResults([interim("I wa")], 0);
    expect(result.finals).toEqual([]);
    expect(result.interim).toBe("I wa");
    expect(result.emittedFinalCount).toBe(0);
  });

  it("does not re-emit a final the engine re-delivers (the mobile bug)", () => {
    // Mobile engines keep replaying already-finalized results on later events
    // and don't advance resultIndex. Feeding the same final back in must NOT
    // produce "I want I want I want".
    let emitted = 0;
    const transcript: string[] = [];

    const events: DictationResultLike[][] = [
      [final("I want")],
      [final("I want"), interim("a")],
      [final("I want"), final("a coffee")],
      [final("I want"), final("a coffee")], // pure replay, nothing new
    ];

    for (const results of events) {
      const out = collectDictationResults(results, emitted);
      emitted = out.emittedFinalCount;
      transcript.push(...out.finals);
    }

    expect(transcript).toEqual(["I want", "a coffee"]);
  });

  it("re-emits leading finals after a session reset (counter back to 0)", () => {
    // After the engine ends and we restart, the results list starts fresh, so
    // the same index-0 final is genuinely new and must be emitted again.
    const first = collectDictationResults([final("I want")], 0);
    expect(first.finals).toEqual(["I want"]);

    // Simulate the restart: counter reset to 0, new session's first final.
    const second = collectDictationResults([final("more please")], 0);
    expect(second.finals).toEqual(["more please"]);
  });

  it("trims finals and drops empty ones while still advancing the counter", () => {
    const result = collectDictationResults([final("  "), final("  hello  ")], 0);
    expect(result.finals).toEqual(["hello"]);
    expect(result.emittedFinalCount).toBe(2);
  });

  it("emits a later final once the interim before it stabilizes", () => {
    // First event: one final + trailing interim.
    const first = collectDictationResults([final("hello"), interim("wor")], 0);
    expect(first.finals).toEqual(["hello"]);
    expect(first.emittedFinalCount).toBe(1);

    // Second event: the interim is now final — emit only the new one.
    const second = collectDictationResults(
      [final("hello"), final("world")],
      first.emittedFinalCount,
    );
    expect(second.finals).toEqual(["world"]);
    expect(second.emittedFinalCount).toBe(2);
  });
});
