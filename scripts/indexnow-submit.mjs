#!/usr/bin/env node
/**
 * Submit the site's URLs to IndexNow (https://www.indexnow.org/), which feeds
 * Bing (and so ChatGPT search), Yandex, Naver and Seznam. Google does not use
 * IndexNow; it reads the sitemap referenced from robots.txt.
 *
 * No account is needed. The protocol is: host a key file at
 * https://<host>/<key>.txt whose body is the key, then POST the URLs with that
 * key. The key file lives in public/ (found by pattern, so the key is never
 * hard-coded here) and ships with every build.
 *
 * Usage:
 *   node scripts/indexnow-submit.mjs            # submit every URL in public/sitemap.xml
 *   node scripts/indexnow-submit.mjs --dry-run  # print the payload, send nothing
 *   node scripts/indexnow-submit.mjs https://clear-framework.com/resources/x ...
 *
 * Run it after the deploy has finished, so the key file is live when IndexNow
 * verifies it. Exit code is non-zero on a non-2xx response so CI surfaces it.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const HOST = "clear-framework.com";
const ENDPOINT = "https://api.indexnow.org/indexnow";
const PUBLIC_DIR = join(process.cwd(), "public");

function findKey() {
  const candidates = readdirSync(PUBLIC_DIR).filter((f) => /^[a-f0-9]{32}\.txt$/.test(f));
  if (candidates.length !== 1) {
    throw new Error(
      `Expected exactly one IndexNow key file (32 hex chars + .txt) in public/, found ${candidates.length}. ` +
        `Generate one with: node -e "process.stdout.write(require('crypto').randomBytes(16).toString('hex'))"`,
    );
  }
  const file = candidates[0];
  const key = readFileSync(join(PUBLIC_DIR, file), "utf8").trim();
  if (key !== file.replace(/\.txt$/, "")) {
    throw new Error(`Key file public/${file} must contain exactly its own key.`);
  }
  return key;
}

function urlsFromSitemap() {
  const xml = readFileSync(join(PUBLIC_DIR, "sitemap.xml"), "utf8");
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const explicit = args.filter((a) => a.startsWith("http"));
  const urlList = explicit.length ? explicit : urlsFromSitemap();

  const offHost = urlList.filter((u) => new URL(u).host !== HOST);
  if (offHost.length) {
    throw new Error(`IndexNow only accepts URLs on ${HOST}; got ${offHost.join(", ")}`);
  }

  const key = findKey();
  const payload = {
    host: HOST,
    key,
    keyLocation: `https://${HOST}/${key}.txt`,
    urlList,
  };

  console.log(`IndexNow: ${urlList.length} URL(s) for ${HOST}${dryRun ? " (dry run)" : ""}`);
  if (dryRun) {
    console.log(JSON.stringify({ ...payload, key: "<redacted>" }, null, 2));
    return;
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  // 200 = submitted, 202 = accepted pending key validation (normal on first use).
  if (res.status === 200 || res.status === 202) {
    console.log(`IndexNow accepted the submission (HTTP ${res.status}).`);
    return;
  }
  const body = await res.text().catch(() => "");
  throw new Error(`IndexNow rejected the submission: HTTP ${res.status} ${body}`.trim());
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
