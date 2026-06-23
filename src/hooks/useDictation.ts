import { useCallback, useEffect, useRef, useState } from "react";
import {
  collectDictationResults,
  type DictationResultLike,
} from "./dictation-results";

/**
 * Browser-native voice dictation via the Web Speech API (`SpeechRecognition`).
 *
 * No backend or API key: transcription happens in the browser where supported
 * (Chrome, Edge, Android, iOS Safari). Where it isn't (Firefox, some desktop
 * Safari), `supported` is false and callers should fall back to typing.
 *
 * The hook is UI-agnostic — it reports finalized segments through `onResult`
 * (so the consumer decides how to merge them) and exposes the live, not-yet-
 * final `interimTranscript` for an optional preview.
 */
export interface UseDictationOptions {
  /** Called with each finalized transcript segment (already trimmed). */
  onResult: (text: string) => void;
  /** Called with a friendly message when recognition fails (e.g. mic blocked). */
  onError?: (message: string) => void;
}

export interface UseDictation {
  /** Whether this browser supports the Web Speech API at all. */
  supported: boolean;
  /** Whether a recognition session is currently active. */
  listening: boolean;
  /** Live, not-yet-finalized words for an on-screen preview. */
  interimTranscript: string;
  /** Begin listening in the given BCP-47 locale (e.g. "en-US", "sv-SE"). */
  start: (lang: string) => void;
  /** Stop listening. */
  stop: () => void;
}

function getSpeechRecognition(): SpeechRecognitionStatic | undefined {
  if (typeof window === "undefined") return undefined;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition;
}

function messageForError(code: SpeechRecognitionErrorCode): string {
  switch (code) {
    case "not-allowed":
    case "service-not-allowed":
      return "Microphone access is blocked. Allow it in your browser settings, or type instead.";
    case "audio-capture":
      return "No microphone was found. Check your device, or type instead.";
    case "network":
      return "Voice input needs a network connection. Try again, or type instead.";
    default:
      return "Voice input stopped unexpectedly. Please try again, or type instead.";
  }
}

export function useDictation({ onResult, onError }: UseDictationOptions): UseDictation {
  const supported = Boolean(getSpeechRecognition());

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const shouldListenRef = useRef(false);
  // How many leading final results we've already emitted this session. Reset to
  // 0 on every fresh `recognition.start()` (each start clears the results list).
  const emittedFinalCountRef = useRef(0);
  const onResultRef = useRef(onResult);
  const onErrorRef = useRef(onError);

  const [listening, setListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");

  // Keep the latest callbacks without re-binding the recognition handlers.
  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);
  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  const stop = useCallback(() => {
    shouldListenRef.current = false;
    setInterimTranscript("");
    const rec = recognitionRef.current;
    if (rec) {
      try {
        rec.stop();
      } catch {
        // stop() throws if recognition isn't running — safe to ignore.
      }
    }
    setListening(false);
  }, []);

  const start = useCallback((lang: string) => {
    const Recognition = getSpeechRecognition();
    if (!Recognition) return;

    // Tear down any previous instance (e.g. a language switch).
    const previous = recognitionRef.current;
    if (previous) {
      shouldListenRef.current = false;
      previous.onresult = null;
      previous.onerror = null;
      previous.onend = null;
      previous.abort();
    }

    const rec = new Recognition();
    rec.lang = lang;
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onresult = (event) => {
      // Snapshot the live results list, then dedupe against what we've already
      // emitted this session. Mobile engines re-deliver finalized results on
      // later events and don't reliably advance `resultIndex`, so emitting per
      // `resultIndex` would repeat finals ("I want I want I want").
      const results: DictationResultLike[] = [];
      for (let i = 0; i < event.results.length; i += 1) {
        const result = event.results[i];
        results.push({
          isFinal: result.isFinal,
          transcript: result[0]?.transcript ?? "",
        });
      }
      const { finals, interim, emittedFinalCount } = collectDictationResults(
        results,
        emittedFinalCountRef.current,
      );
      emittedFinalCountRef.current = emittedFinalCount;
      for (const finalText of finals) onResultRef.current(finalText);
      setInterimTranscript(interim);
    };

    rec.onerror = (event) => {
      // Transient or self-induced: let onend decide whether to restart.
      if (event.error === "no-speech" || event.error === "aborted") return;
      shouldListenRef.current = false;
      setListening(false);
      setInterimTranscript("");
      onErrorRef.current?.(messageForError(event.error));
    };

    rec.onend = () => {
      // The engine stops on its own after pauses; restart to stay continuous.
      // Each restart begins a fresh results list, so reset the dedupe counter —
      // otherwise the new session's leading finals would be skipped and lost.
      if (shouldListenRef.current) {
        try {
          emittedFinalCountRef.current = 0;
          rec.start();
          return;
        } catch {
          // fall through to the stopped state
        }
      }
      setListening(false);
      setInterimTranscript("");
    };

    recognitionRef.current = rec;
    shouldListenRef.current = true;
    emittedFinalCountRef.current = 0;
    try {
      rec.start();
      setListening(true);
    } catch {
      // start() throws if already started; reset to a clean stopped state.
      shouldListenRef.current = false;
      setListening(false);
    }
  }, []);

  // Abort any active recognition on unmount.
  useEffect(() => {
    return () => {
      shouldListenRef.current = false;
      const rec = recognitionRef.current;
      if (rec) {
        rec.onresult = null;
        rec.onerror = null;
        rec.onend = null;
        rec.abort();
        recognitionRef.current = null;
      }
    };
  }, []);

  return { supported, listening, interimTranscript, start, stop };
}
