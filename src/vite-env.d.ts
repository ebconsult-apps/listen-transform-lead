/// <reference types="vite/client" />

// Build-time flag (defined in vite.config / vitest.config). True only when
// VITE_DEV_BYPASS=true at build time; enables the fully-mocked dev/QA mode in a
// production-style build. A literal so the dev guards fold and the mock graph
// tree-shakes out of normal production bundles.
declare const __DEV_BYPASS__: boolean;
