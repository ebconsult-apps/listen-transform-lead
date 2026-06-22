// Pure core of the dictation `onresult` handler, split out from `useDictation`
// so it can be unit-tested without a DOM or the Web Speech API.

/** A single recognition result, reduced to just what we consume. */
export interface DictationResultLike {
  /** Whether the engine considers this segment finalized (stable). */
  readonly isFinal: boolean;
  /** The top-alternative transcript for the segment. */
  readonly transcript: string;
}

export interface CollectedDictation {
  /**
   * Newly finalized segments not emitted before, in order, trimmed and
   * non-empty. The caller forwards each of these to `onResult`.
   */
  readonly finals: string[];
  /** Concatenated text of the not-yet-final results, for a live preview. */
  readonly interim: string;
  /** Updated count of leading final results emitted so far this session. */
  readonly emittedFinalCount: number;
}

/**
 * Decide which finalized segments are new for a single `onresult` event.
 *
 * Mobile speech engines (notably Android Chrome and iOS Safari) re-deliver
 * already-finalized results on later `onresult` events and don't reliably
 * advance `SpeechRecognitionEvent.resultIndex`. Looping from `resultIndex`
 * therefore re-emits the same final segment again and again — the classic
 * "I want I want I want" duplication.
 *
 * Instead we track how many leading final results we've already emitted in the
 * current recognition session and skip those, so every final is emitted exactly
 * once no matter how often the engine replays it. Each fresh `recognition.start()`
 * begins a new session with an empty results list, so the caller resets
 * `emittedFinalCount` to 0 at that point.
 *
 * @param results The event's results, in order (finals first, then interim).
 * @param emittedFinalCount How many leading finals were emitted in prior events.
 */
export function collectDictationResults(
  results: readonly DictationResultLike[],
  emittedFinalCount: number,
): CollectedDictation {
  const finals: string[] = [];
  let interim = "";
  let count = emittedFinalCount;

  for (let i = 0; i < results.length; i += 1) {
    const result = results[i];
    if (result.isFinal) {
      // Skip finals we've already emitted; only indices at or past the
      // running count are new this event.
      if (i >= count) {
        const finalText = result.transcript.trim();
        if (finalText) finals.push(finalText);
        count = i + 1;
      }
    } else {
      interim += result.transcript;
    }
  }

  return { finals, interim, emittedFinalCount: count };
}
