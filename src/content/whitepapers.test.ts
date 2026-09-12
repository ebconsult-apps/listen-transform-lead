import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { whitepapers, whitepaperPath } from "./whitepapers";

/**
 * The whitepaper catalogue feeds four places that can't import it: the PHP
 * download handler, the prerender route list in vite.config.ts, the sitemap,
 * and the PDFs on disk. This keeps them from drifting apart when a paper is
 * added, which is exactly what happened when the first four were wired by hand.
 */
const root = join(__dirname, "..", "..");
const read = (rel: string) => readFileSync(join(root, rel), "utf8");

describe("whitepaper catalogue", () => {
  it("has unique ids that match their PDF filenames", () => {
    const ids = whitepapers.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const w of whitepapers) {
      expect(w.pdfUrl).toBe(`/whitepapers/${w.id}.pdf`);
    }
  });

  it("ships every referenced PDF", () => {
    for (const w of whitepapers) {
      expect(existsSync(join(root, "public", w.pdfUrl)), w.pdfUrl).toBe(true);
    }
  });

  it("is accepted by whitepaper-handler.php", () => {
    const php = read("public/whitepaper-handler.php");
    for (const w of whitepapers) {
      expect(php, `${w.id} missing from handler`).toContain(`"${w.id}"`);
    }
  });

  it("has every overview page prerendered and in the sitemap", () => {
    const viteConfig = read("vite.config.ts");
    const sitemap = read("public/sitemap.xml");
    for (const w of whitepapers) {
      const path = whitepaperPath(w.id);
      expect(viteConfig, `${path} missing from vite.config.ts routes`).toContain(`"${path}"`);
      expect(sitemap, `${path} missing from sitemap.xml`).toContain(
        `<loc>https://clear-framework.com${path}</loc>`,
      );
    }
  });

  it("has enough public overview content for crawlers to quote", () => {
    for (const w of whitepapers) {
      expect(w.summary.length, `${w.id} summary`).toBeGreaterThanOrEqual(2);
      expect(w.keyPoints.length, `${w.id} keyPoints`).toBeGreaterThanOrEqual(2);
      expect(w.faqs.length, `${w.id} faqs`).toBeGreaterThanOrEqual(1);
      expect(w.keywords.length, `${w.id} keywords`).toBeGreaterThanOrEqual(3);
    }
  });
});
