import { useState } from "react";
import { Copy, Check, Sparkles, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { buildOwnerPrepPrompt, type OwnerPrepContext, type PrepLang } from "@/lib/clear/prep-prompt";

// Reuse the language preference the dictation control already persists, so a user
// who picked Swedish for voice input also gets a Swedish prompt by default.
const LANG_STORAGE_KEY = "clear.dictation.lang";

function loadLang(): PrepLang {
  if (typeof window === "undefined") return "en";
  return window.localStorage.getItem(LANG_STORAGE_KEY) === "sv-SE" ? "sv" : "en";
}

function persistLang(lang: PrepLang) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(LANG_STORAGE_KEY, lang === "sv" ? "sv-SE" : "en-US");
  }
}

const COPY = {
  en: {
    owner: {
      title: "Prepare your inputs with AI",
      blurb:
        "Sharper inputs → sharper analysis. Paste this prompt into your own AI assistant (Claude, ChatGPT, Copilot) along with your documents — it returns three briefs you can upload below.",
    },
    respondent: {
      title: "Short on time? Prepare your input with AI",
      blurb:
        "Paste this prompt into your own AI assistant along with any notes or documents — it helps you turn what you know into a clear contribution to paste below.",
    },
    show: "Show prompt",
    hide: "Hide prompt",
    copy: "Copy prompt",
    copied: "Copied",
    copiedToast: "Prompt copied — paste it into your AI assistant.",
    copyError: "Couldn't copy to the clipboard.",
    footer: "Nothing is sent to CLEAR — the prompt just guides your own AI tool.",
  },
  sv: {
    owner: {
      title: "Förbered ditt underlag med AI",
      blurb:
        "Skarpare underlag → skarpare analys. Klistra in prompten i din egen AI-assistent (Claude, ChatGPT, Copilot) tillsammans med dina dokument — den ger tre underlag som du kan ladda upp nedan.",
    },
    respondent: {
      title: "Ont om tid? Förbered ditt bidrag med AI",
      blurb:
        "Klistra in prompten i din egen AI-assistent tillsammans med anteckningar eller dokument — den hjälper dig att forma det du vet till ett tydligt bidrag att klistra in nedan.",
    },
    show: "Visa prompt",
    hide: "Dölj prompt",
    copy: "Kopiera prompt",
    copied: "Kopierad",
    copiedToast: "Prompt kopierad — klistra in den i din AI-assistent.",
    copyError: "Kunde inte kopiera till urklipp.",
    footer: "Inget skickas till CLEAR — prompten vägleder bara ditt eget AI-verktyg.",
  },
} as const;

interface PrepPromptCardProps {
  variant: "owner" | "respondent";
  /** Owner variant: build the prompt client-side from the intake context. */
  ctx?: OwnerPrepContext;
  /** Respondent variant: server-built prompt strings, one per language. */
  prebuilt?: { en: string; sv: string };
  className?: string;
}

/**
 * Surfaces a copy-pasteable "prep your inputs" prompt with an EN/SV toggle. Used
 * on the owner intake + project page (variant="owner", builds from `ctx`) and on
 * the respondent portal (variant="respondent", renders server `prebuilt` text).
 */
export function PrepPromptCard({ variant, ctx, prebuilt, className }: PrepPromptCardProps) {
  const [lang, setLang] = useState<PrepLang>(loadLang);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const t = COPY[lang];
  const prompt =
    variant === "owner"
      ? ctx
        ? buildOwnerPrepPrompt(ctx, lang)
        : ""
      : prebuilt?.[lang] ?? "";

  const changeLang = (next: PrepLang) => {
    setLang(next);
    persistLang(next);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      toast.success(t.copiedToast);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t.copyError);
    }
  };

  if (!prompt) return null;

  return (
    <div className={cn("glass-card p-5 sm:p-6", className)}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 h-9 w-9 flex-shrink-0 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold">{t[variant].title}</h3>
          <p className="text-sm text-foreground/60 mt-1">{t[variant].blurb}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div
          className="inline-flex overflow-hidden rounded-md border border-border"
          role="group"
          aria-label="Prompt language"
        >
          {(["en", "sv"] as const).map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => changeLang(code)}
              aria-pressed={lang === code}
              className={cn(
                "px-2.5 py-1 text-xs font-medium transition-colors",
                lang === code
                  ? "bg-primary text-primary-foreground"
                  : "bg-transparent text-foreground/60 hover:bg-muted",
              )}
            >
              {code.toUpperCase()}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? t.copied : t.copy}
        </button>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="inline-flex items-center gap-1 text-sm text-foreground/60 hover:text-foreground transition-colors"
        >
          <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
          {open ? t.hide : t.show}
        </button>
      </div>

      {open && (
        <textarea
          readOnly
          value={prompt}
          rows={14}
          onFocus={(e) => e.currentTarget.select()}
          className="input mt-3 font-mono text-xs leading-relaxed whitespace-pre-wrap"
        />
      )}

      <p className="mt-3 text-xs text-foreground/40">{t.footer}</p>
    </div>
  );
}

export default PrepPromptCard;
