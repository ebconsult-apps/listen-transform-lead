import { defineConfig } from "vitest/config";
import path from "path";

// Isolated test config — deliberately does NOT load the app's React / prerender
// plugins. The only things under test are pure helper functions (the prep-prompt
// builders), so a plain Node environment keeps the suite fast and dependency-free.
// The `@` alias mirrors vite.config so src modules that import siblings via `@/`
// (e.g. the data libs' dev-mode guards) resolve under test too.
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts", "supabase/functions/**/*.test.ts"],
    environment: "node",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Mirror vite.config's build-time flag so modules referencing it load under test.
  define: {
    __DEV_BYPASS__: JSON.stringify((process.env.VITE_DEV_BYPASS ?? "false") === "true"),
  },
});
