import { describe, it, expect } from "vitest";
import {
  classifySource,
  clientIp,
  deviceType,
  parseTrackPayload,
  referrerHost,
  visitorHash,
} from "./track";

describe("parseTrackPayload", () => {
  it("accepts a well-formed event and keeps scalar props", () => {
    const p = parseTrackPayload({
      event: "whitepaper_gate_view",
      props: { whitepaper_id: "clear-goldilocks", placement: "page", n: 2, ok: true },
      path: "/resources/clear-goldilocks?utm_source=x#download",
      referrer: "https://chatgpt.com/",
    });
    expect(p).toEqual({
      event: "whitepaper_gate_view",
      props: { whitepaper_id: "clear-goldilocks", placement: "page", n: 2, ok: true },
      path: "/resources/clear-goldilocks",
      referrer: "https://chatgpt.com/",
    });
  });

  it("rejects malformed event names and non-object bodies", () => {
    expect(parseTrackPayload(null)).toBeNull();
    expect(parseTrackPayload("page_view")).toBeNull();
    expect(parseTrackPayload({ event: "Page View" })).toBeNull();
    expect(parseTrackPayload({ event: "1abc" })).toBeNull();
    expect(parseTrackPayload({ event: "x".repeat(65) })).toBeNull();
  });

  it("drops props that could smuggle structures, long strings or odd keys", () => {
    const p = parseTrackPayload({
      event: "cta_click",
      props: {
        cta_name: "book_call",
        nested: { a: 1 },
        list: [1, 2],
        long: "y".repeat(201),
        empty: "",
        "Bad-Key": "x",
        nan: Number.NaN,
      },
    });
    expect(p?.props).toEqual({ cta_name: "book_call" });
  });

  it("caps the number of props and ignores paths that are not site-relative", () => {
    const props = Object.fromEntries(Array.from({ length: 30 }, (_, i) => [`k${i}`, "v"]));
    const p = parseTrackPayload({ event: "e", props, path: "https://evil.example/x", referrer: "" });
    expect(Object.keys(p!.props)).toHaveLength(20);
    expect(p!.path).toBeNull();
    expect(p!.referrer).toBeNull();
  });
});

describe("referrerHost", () => {
  it("lower-cases and strips www.", () => {
    expect(referrerHost("https://WWW.ChatGPT.com/c/abc")).toBe("chatgpt.com");
    expect(referrerHost("https://www.google.se/")).toBe("google.se");
  });
  it("returns null for missing or unparseable referrers", () => {
    expect(referrerHost(null)).toBeNull();
    expect(referrerHost("not a url")).toBeNull();
  });
});

describe("classifySource", () => {
  const desktopUa = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/128 Safari/537.36";

  it("recognises AI assistants by referrer", () => {
    expect(classifySource("chatgpt.com", desktopUa)).toBe("chatgpt");
    expect(classifySource("chat.openai.com", desktopUa)).toBe("chatgpt");
    expect(classifySource("claude.ai", desktopUa)).toBe("claude");
    expect(classifySource("perplexity.ai", desktopUa)).toBe("perplexity");
    expect(classifySource("copilot.microsoft.com", desktopUa)).toBe("copilot");
    expect(classifySource("gemini.google.com", desktopUa)).toBe("gemini");
    expect(classifySource("you.com", desktopUa)).toBe("other_ai");
  });

  it("recognises AI assistants by user agent even without a referrer", () => {
    expect(classifySource(null, "Mozilla/5.0 ChatGPT-User/1.0 +https://openai.com/bot")).toBe("chatgpt");
    expect(classifySource(null, "Mozilla/5.0 Claude-User")).toBe("claude");
    expect(classifySource("google.com", "PerplexityBot/1.0")).toBe("perplexity");
  });

  it("classifies search, LinkedIn, social, internal, direct and other", () => {
    expect(classifySource("google.se", desktopUa)).toBe("google");
    expect(classifySource("google.com", desktopUa)).toBe("google");
    expect(classifySource("bing.com", desktopUa)).toBe("bing");
    expect(classifySource("duckduckgo.com", desktopUa)).toBe("duckduckgo");
    expect(classifySource("linkedin.com", desktopUa)).toBe("linkedin");
    expect(classifySource("lnkd.in", desktopUa)).toBe("linkedin");
    expect(classifySource("t.co", desktopUa)).toBe("social");
    expect(classifySource("clear-framework.com", desktopUa)).toBe("internal");
    expect(classifySource("app.clear-framework.com", desktopUa)).toBe("internal");
    expect(classifySource(null, desktopUa)).toBe("direct");
    expect(classifySource("example.org", desktopUa)).toBe("other");
  });

  it("does not mistake gemini.google.com for plain Google search", () => {
    expect(classifySource("gemini.google.com", desktopUa)).toBe("gemini");
  });
});

describe("deviceType", () => {
  it("separates bots, mobile, tablet and desktop", () => {
    expect(deviceType("Mozilla/5.0 (compatible; Googlebot/2.1)")).toBe("bot");
    expect(deviceType("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Mobile/15E148")).toBe("mobile");
    expect(deviceType("Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)")).toBe("tablet");
    expect(deviceType("Mozilla/5.0 (Linux; Android 14; Pixel Tablet)")).toBe("tablet");
    expect(deviceType("Mozilla/5.0 (Linux; Android 14; Pixel 8) Mobile")).toBe("mobile");
    expect(deviceType("Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128")).toBe("desktop");
    expect(deviceType(null)).toBe("unknown");
  });
});

describe("clientIp", () => {
  it("takes the first X-Forwarded-For hop, then X-Real-IP, else empty", () => {
    const h = (m: Record<string, string>) => ({ get: (k: string) => m[k.toLowerCase()] ?? null });
    expect(clientIp(h({ "x-forwarded-for": "203.0.113.9, 10.0.0.1" }))).toBe("203.0.113.9");
    expect(clientIp(h({ "x-real-ip": "198.51.100.2" }))).toBe("198.51.100.2");
    expect(clientIp(h({}))).toBe("");
  });
});

describe("visitorHash", () => {
  const ua = "Mozilla/5.0";
  it("is stable within a day and differs across days, IPs and salts", async () => {
    const d1 = new Date("2026-09-13T08:00:00Z");
    const d1later = new Date("2026-09-13T22:00:00Z");
    const d2 = new Date("2026-09-14T08:00:00Z");
    const a = await visitorHash("203.0.113.9", ua, "salt", d1);
    expect(a).toMatch(/^[0-9a-f]{16}$/);
    expect(await visitorHash("203.0.113.9", ua, "salt", d1later)).toBe(a);
    expect(await visitorHash("203.0.113.9", ua, "salt", d2)).not.toBe(a);
    expect(await visitorHash("203.0.113.10", ua, "salt", d1)).not.toBe(a);
    expect(await visitorHash("203.0.113.9", ua, "other", d1)).not.toBe(a);
  });
});
