/**
 * Pure helpers for the first-party `track` edge function. No Deno or Supabase
 * imports, so the same code is unit-tested under Node (track.test.ts).
 *
 * See supabase/migrations/20260913120000_analytics_events.sql for the data
 * model and the privacy rationale.
 */

export type PropValue = string | number | boolean;

export interface TrackPayload {
  event: string;
  props: Record<string, PropValue>;
  path: string | null;
  referrer: string | null;
}

export type Source =
  | "chatgpt"
  | "claude"
  | "perplexity"
  | "copilot"
  | "gemini"
  | "other_ai"
  | "google"
  | "bing"
  | "duckduckgo"
  | "linkedin"
  | "social"
  | "internal"
  | "direct"
  | "other";

export type Device = "mobile" | "tablet" | "desktop" | "bot" | "unknown";

export const AI_SOURCES: ReadonlySet<Source> = new Set<Source>([
  "chatgpt",
  "claude",
  "perplexity",
  "copilot",
  "gemini",
  "other_ai",
]);

/** Fraction of requests on which the function runs the 14-month prune. */
export const PRUNE_PROBABILITY = 0.005;

const EVENT_RE = /^[a-z][a-z0-9_]{0,63}$/;
const PROP_KEY_RE = /^[a-z][a-z0-9_]{0,39}$/;
const MAX_PROPS = 20;
const MAX_STRING = 200;
const MAX_PATH = 300;
const MAX_REFERRER = 500;

/**
 * Validate and normalise an incoming body. Returns null for anything that is
 * not a well-formed event, so the function can 400 without ever storing junk.
 * Only short scalar props survive; objects, arrays and long strings are dropped.
 */
export function parseTrackPayload(input: unknown): TrackPayload | null {
  if (!input || typeof input !== "object") return null;
  const body = input as Record<string, unknown>;

  const event = typeof body.event === "string" ? body.event : "";
  if (!EVENT_RE.test(event)) return null;

  const props: Record<string, PropValue> = {};
  if (body.props && typeof body.props === "object" && !Array.isArray(body.props)) {
    for (const [key, value] of Object.entries(body.props as Record<string, unknown>)) {
      if (Object.keys(props).length >= MAX_PROPS) break;
      if (!PROP_KEY_RE.test(key)) continue;
      if (typeof value === "string") {
        if (value.length === 0 || value.length > MAX_STRING) continue;
        props[key] = value;
      } else if (typeof value === "number") {
        if (Number.isFinite(value)) props[key] = value;
      } else if (typeof value === "boolean") {
        props[key] = value;
      }
    }
  }

  let path: string | null = null;
  if (typeof body.path === "string" && body.path.startsWith("/") && body.path.length <= MAX_PATH) {
    // Strip query strings: they can carry tokens (e.g. /respond/<token>?x) or PII.
    path = body.path.split("?")[0].split("#")[0];
  }

  let referrer: string | null = null;
  if (typeof body.referrer === "string" && body.referrer.length > 0 && body.referrer.length <= MAX_REFERRER) {
    referrer = body.referrer;
  }

  return { event, props, path, referrer };
}

/** Lower-cased host of a referrer URL without a leading "www.", or null. */
export function referrerHost(referrer: string | null): string | null {
  if (!referrer) return null;
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    return host.replace(/^www\./, "") || null;
  } catch {
    return null;
  }
}

const AI_UA_PATTERNS: Array<[RegExp, Source]> = [
  [/chatgpt-user|oai-searchbot|gptbot/i, "chatgpt"],
  [/claude-user|claude-searchbot|claudebot|anthropic-ai/i, "claude"],
  [/perplexitybot|perplexity-user/i, "perplexity"],
];

const SOCIAL_HOSTS = [
  "facebook.com",
  "fb.com",
  "instagram.com",
  "t.co",
  "twitter.com",
  "x.com",
  "reddit.com",
  "youtube.com",
  "threads.net",
  "mastodon.social",
  "news.ycombinator.com",
];

function hostMatches(host: string, domain: string): boolean {
  return host === domain || host.endsWith("." + domain);
}

/**
 * Where did this visit come from? AI assistants are detected by referrer (a
 * human clicking a citation in ChatGPT arrives with a chatgpt.com referrer) and
 * by user agent (the assistants' own live-fetch agents), then classic search,
 * LinkedIn, social, internal, direct, other.
 */
export function classifySource(
  host: string | null,
  userAgent: string | null,
  siteHost = "clear-framework.com",
): Source {
  if (userAgent) {
    for (const [pattern, source] of AI_UA_PATTERNS) {
      if (pattern.test(userAgent)) return source;
    }
  }

  if (!host) return "direct";
  if (hostMatches(host, siteHost)) return "internal";

  if (hostMatches(host, "chatgpt.com") || hostMatches(host, "chat.openai.com") || hostMatches(host, "openai.com")) {
    return "chatgpt";
  }
  if (hostMatches(host, "claude.ai") || hostMatches(host, "anthropic.com")) return "claude";
  if (hostMatches(host, "perplexity.ai")) return "perplexity";
  if (hostMatches(host, "copilot.microsoft.com") || hostMatches(host, "copilot.cloud.microsoft")) return "copilot";
  if (hostMatches(host, "gemini.google.com") || hostMatches(host, "bard.google.com")) return "gemini";
  if (
    hostMatches(host, "you.com") ||
    hostMatches(host, "phind.com") ||
    hostMatches(host, "poe.com") ||
    hostMatches(host, "chat.mistral.ai") ||
    hostMatches(host, "meta.ai") ||
    hostMatches(host, "kagi.com") ||
    hostMatches(host, "duck.ai")
  ) {
    return "other_ai";
  }

  if (/^(google\.[a-z.]+|.*\.google\.[a-z.]+)$/.test(host)) return "google";
  if (hostMatches(host, "bing.com")) return "bing";
  if (hostMatches(host, "duckduckgo.com")) return "duckduckgo";
  if (hostMatches(host, "linkedin.com") || hostMatches(host, "lnkd.in")) return "linkedin";
  if (SOCIAL_HOSTS.some((d) => hostMatches(host, d))) return "social";

  return "other";
}

/** Coarse device class from the user agent. Bots are excluded from the views. */
export function deviceType(userAgent: string | null): Device {
  if (!userAgent) return "unknown";
  const ua = userAgent.toLowerCase();
  if (/bot|crawl|spider|slurp|headlesschrome|lighthouse|pingdom|uptime|python-requests|curl\/|wget\//.test(ua)) {
    return "bot";
  }
  if (/ipad|tablet|(android(?!.*mobile))/.test(ua)) return "tablet";
  if (/mobi|iphone|ipod|android/.test(ua)) return "mobile";
  return "desktop";
}

/** First address in X-Forwarded-For, or the fallback header, or "". */
export function clientIp(headers: { get(name: string): string | null }): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0].trim();
    if (first) return first;
  }
  return headers.get("x-real-ip")?.trim() ?? "";
}

/**
 * Pseudonymous daily visitor key: sha256(salt | ip | ua | yyyy-mm-dd), first 16
 * hex chars. The IP never leaves this function; the key rotates every day so it
 * supports "distinct visitors today" and nothing more.
 */
export async function visitorHash(
  ip: string,
  userAgent: string,
  salt: string,
  now: Date = new Date(),
): Promise<string> {
  const day = now.toISOString().slice(0, 10);
  const data = new TextEncoder().encode(`${salt}|${ip}|${userAgent}|${day}`);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
}
