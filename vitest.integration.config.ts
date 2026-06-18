import { defineConfig } from "vitest/config";

/**
 * Integration suite — runs against a LOCAL Supabase stack (Postgres + Auth +
 * served edge functions) booted with `supabase start`. Kept separate from the
 * fast unit config (vitest.config.ts) so `npm test` stays Docker-free; the suite
 * auto-skips when the stack env vars are absent (see tests/integration/helpers.ts).
 *
 * Run locally:  supabase start  &&  npm run test:integration
 */
export default defineConfig({
  test: {
    include: ["tests/integration/**/*.test.ts"],
    environment: "node",
    testTimeout: 30000,
    hookTimeout: 60000,
    // Edge functions mutate shared project state — keep files sequential.
    fileParallelism: false,
  },
});
