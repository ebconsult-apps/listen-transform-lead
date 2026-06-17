import { defineConfig } from "vitest/config";

// Isolated test config — deliberately does NOT load the app's React / prerender
// plugins. The only things under test are pure helper functions (the prep-prompt
// builders), so a plain Node environment keeps the suite fast and dependency-free.
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts", "supabase/functions/**/*.test.ts"],
    environment: "node",
  },
});
