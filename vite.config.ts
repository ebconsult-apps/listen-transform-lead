import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import prerender from "@prerenderer/rollup-plugin";
import PuppeteerRenderer from "@prerenderer/renderer-puppeteer";

const routes = [
  "/",
  "/about",
  "/services",
  "/framework",
  "/methodology",
  "/faq",
  "/resources",
  "/contact",
  "/get-the-book",
  "/booking-confirmed",
  "/assessment",
  "/lp/organizational-change",
  "/lp/clear-whitepaper",
  "/lp/sustainability",
  "/consulting/change-management-stockholm",
  "/consulting/change-management-europe",
  "/consulting/organizational-psychology-consulting",
  "/consulting/manufacturing-change-management",
  "/consulting/healthcare-change-management",
  "/consulting/sustainability-change-management",
  "/consulting/merger-integration-consulting",
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
}));
