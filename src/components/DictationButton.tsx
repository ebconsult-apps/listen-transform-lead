import { useCallback, useState } from "react";
import { Mic, MicOff, Square } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useDictation } from "@/hooks/useDictation";

type DictationLang = "en-US" | "sv-SE";

const LANG_STORAGE_KEY = "clear.dictation.lang";
const LANGS: { code: DictationLang; label: string }[] = [
  { code: "en-US", label: "EN" },
  { code: "sv-SE", label: "SV" },
];

function loadInitialLang(): DictationLang {
  if (typeof window === "undefined") return "en-US";
  const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
  return stored === "sv-SE" || stored === "en-US" ? stored : "en-US";
}

export interface DictationButtonProps {
  /** Receives each finalized transcript segment so the parent can append it. */
  onResult: (text: string) => void;
  className?: string;
}

/**
 * Mic control for dictating into a nearby text field, with an EN/SV language
 * toggle. Browser-native (Web Speech API) — see {@link useDictation}. When the
 * browser doesn't support it, renders a quiet "type instead" hint.
 */
export function DictationButton({ onResult, className }: DictationButtonProps) {
  const [lang, setLang] = useState<DictationLang>(loadInitialLang);
  const { supported, listening, interimTranscript, start, stop } = useDictation({
    onResult,
    onError: (message) => toast.error(message),
  });

  const toggle = useCallback(() => {
    if (listening) stop();
    else start(lang);
  }, [listening, start, stop, lang]);

  const changeLang = useCallback((next: DictationLang) => {
    setLang(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LANG_STORAGE_KEY, next);
    }
  }, []);

  if (!supported) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 text-xs text-foreground/40",
          className,
        )}
        title="Voice input isn't supported in this browser. Type instead."
      >
        <MicOff className="h-4 w-4" />
        Voice input unavailable
      </span>
    );
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center gap-2">
        <div
          className="inline-flex overflow-hidden rounded-md border border-border"
          role="group"
          aria-label="Dictation language"
        >
          {LANGS.map((l) => (
            <button
              key={l.code}
              type="button"
              disabled={listening}
              onClick={() => changeLang(l.code)}
              aria-pressed={lang === l.code}
              className={cn(
                "px-2 py-1 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                lang === l.code
                  ? "bg-primary text-primary-foreground"
                  : "bg-transparent text-foreground/60 hover:bg-muted",
              )}
            >
              {l.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={toggle}
          aria-pressed={listening}
          aria-label={listening ? "Stop dictation" : "Start dictation"}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
            listening
              ? "border-destructive bg-destructive/10 text-destructive"
              : "border-border text-foreground/70 hover:bg-muted",
          )}
        >
          {listening ? (
            <Square className="h-3.5 w-3.5 animate-pulse" />
          ) : (
            <Mic className="h-3.5 w-3.5" />
          )}
          {listening ? "Listening…" : "Dictate"}
        </button>
      </div>

      {listening && (
        <p
          aria-live="polite"
          className="min-h-[1rem] text-xs italic text-foreground/50"
        >
          {interimTranscript || "Listening… speak now."}
        </p>
      )}
    </div>
  );
}

export default DictationButton;
