/**
 * Tiny dependency-free helpers for the dev/QA mock layer. Kept separate so both
 * the seed and the live mock store can share them without import cycles.
 */

let counter = 0;

/** Stable-ish unique id. Uses crypto.randomUUID when present, else a counter. */
export function uid(prefix = "dev"): string {
  const g = globalThis as { crypto?: { randomUUID?: () => string } };
  if (g.crypto?.randomUUID) return `${prefix}-${g.crypto.randomUUID()}`;
  counter += 1;
  return `${prefix}-${counter}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}

/** ISO timestamp `daysAgo` days in the past — used to give seeded rows a history. */
export function daysAgoIso(daysAgo: number): string {
  return new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
}

export const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
