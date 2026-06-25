import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import prerender from "@prerenderer/rollup-plugin";
import PuppeteerRenderer from "@prerenderer/renderer-puppeteer";

const routes = [
  "/",
  // Self-serve product marketing (static). Auth + /app/* + /account/* are
  // intentionally excluded — they are dynamic/auth-gated and render client-side.
  "/product",
  "/pricing",
  "/about",
  "/services",
  "/framework",
  "/methodology",
  "/faq",
  "/resources",
  "/contact",
  "/get-the-book",
  "/book-call",
  "/booking-confirmed",
  "/assessment",
  "/lp/organizational-change",
  "/lp/clear-whitepaper",
  "/lp/sustainability",
  "/lp/change-management",
  "/lp/leadership-development",
  "/lp/organizational-psychology",
  "/lp/merger-integration",
  "/consulting/change-management-stockholm",
  "/consulting/change-management-europe",
  "/consulting/organizational-psychology-consulting",
  "/consulting/manufacturing-change-management",
  "/consulting/healthcare-change-management",
  "/consulting/sustainability-change-management",
  "/consulting/merger-integration-consulting",
  "/thank-you",
  "/services/change-management",
  "/services/leadership-development",
  "/services/executive-coaching",
  "/services/psychometric-assessments",
  "/services/workshops",
  "/services/speaking",
  "/insights",
];

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  build: {
    rollupOptions: {
      plugins: [
        mode === 'production' && prerender({
          routes,
          renderer: new PuppeteerRenderer({
            renderAfterTime: 3000,
          }),
          postProcess(renderedRoute) {
            // Fix SPA routing - ensure trailing content works
            renderedRoute.html = renderedRoute.html.replace(
              /<script/g,
              '<script'
            );
            return renderedRoute;
          },
        }),
      ].filter(Boolean),
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Build-time literal for the dev/QA access gate. Defaults to false so the mock
  // layer tree-shakes out of normal production builds; set VITE_DEV_BYPASS=true
  // to keep it in a preview/staging build.
  define: {
    __DEV_BYPASS__: JSON.stringify((process.env.VITE_DEV_BYPASS ?? "false") === "true"),
  },
}));
