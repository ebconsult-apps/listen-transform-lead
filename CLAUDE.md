# CLAUDE.md

Guidance for AI agents (and humans) working in this repo.

## What this is

**CLEAR** — a self-serve behavioral-analysis web app. A user creates a project, runs the
CLEAR engine (Clarify → Leverage → Experiment → Research) on it, and gets reports gated by a
Stripe paywall. Stack: **Vite + React + TypeScript**, **shadcn-ui + Tailwind**, **Supabase**
(Postgres/RLS + Edge Functions) for the backend, **Stripe** for billing, and **Claude** (via an
edge function) for AI generation. Path alias: `@/` → `src/`.

## Commands

```sh
npm run dev              # Vite dev server (dev/QA mock mode is always available here)
npm run build            # production build
npm run lint             # eslint
npm test                 # vitest unit tests — run before pushing
npm run test:integration # vitest integration (skips without a live Supabase stack)
```

## Developer / QA mock mode ← read this before "QA the app" / "review every screen state"

There is a guarded, **fully-mocked, no-backend** mode that walks the entire self-serve flow
(`/app`, projects, billing, every report state) with **no Supabase, no login, no Stripe**. Use
it whenever you need to see or verify UI states end-to-end without standing up a backend.

**How to enter:**
- **Locally:** `npm run dev` with an empty `.env` → on `/login` click **"Enter dev / QA mode
  (mock data)"**, or use the floating **DEV** panel (bottom-right). It is always available under
  `vite dev`.
- **Preview/staging:** build with `VITE_DEV_BYPASS=true` (a prod-style build that keeps the mode).
- A persistent **"DEV / QA MODE — mock data"** banner shows whenever it is active, so mock data
  is never mistaken for real.

The seeded dataset has one project per state (draft, clarify-ready, clarify-approved,
teaser/paywalled, full/unlocked, with-contributions, experiments, research, error) — click into
each from the dashboard. Mock data resets on reload by design; the DevPanel switches datasets and
flips AI stub↔live.

**AI in mock mode:** `stub` (canned fixtures) works fully offline. `live` needs a real login +
backend (a mock session's token is fake), so the DevPanel disables `live` without a real backend
and `src/lib/clear/run.ts` throws a clear error rather than a silent 401.

## ⚠️ Data-layer seam — the rule new code MUST follow

Mock mode works by a **one-line guard at the top of every data-access function** that delegates to
the in-memory mock store. When you add or change a data-access function, keep this pattern or mock
mode silently breaks (it will hit a real backend on a fake session):

```ts
// near the top of the file
const DEV_CAP = import.meta.env.DEV || __DEV_BYPASS__;
import { devActive } from "@/lib/dev/config";
import * as mockStore from "@/lib/dev/mock-store";

export async function getThing(id: string): Promise<Thing> {
  if (DEV_CAP && devActive()) return mockStore.getThing(id);   // ← add this line
  const sb = requireSupabase();
  // ...real query...
}
```

…and add a matching `getThing` to `src/lib/dev/mock-store.ts` (reads return seeded/fixture data;
writes mutate the in-memory arrays so transitions work within a session).

**Files that already follow the seam — mirror them:**
- Data libs: `src/lib/db.ts`, `clarify.ts`, `collab.ts`, `experiment.ts`, `research.ts`,
  `billing.ts`, and the run phases in `src/lib/clear/run.ts`.
- Page that writes directly to Supabase: `src/pages/app/NewProject.tsx`.
- Auth / UI: `src/hooks/useAuth.tsx`, `src/components/auth/ProtectedRoute.tsx`,
  `src/components/product/Paywall.tsx`.

> **Why this matters (real drift this prevents):** a `getMyProfile()` added to `db.ts` for the
> Privacy-Policy step once shipped *without* this guard, so in mock mode the New Project page made
> a failing backend call and gated the QA walkthrough behind a consent checkbox. The fix was the
> one-line guard + a mock-store entry. Don't let new data functions skip the seam.

AI mode rides the same seam: read it via `effectiveAiMode()` from `@/lib/dev/config` (never the raw
`AI_MODE`/`VITE_AI_MODE` env) so the DevPanel's runtime stub↔live switch works.

## Dev module map (`src/lib/dev/`)

- `config.ts` — capability flag + reactive store. Key exports: `DEV_ACCESS_ENABLED`,
  `devActive()`, `effectiveAiMode()`, `enterDevMode()/exitDevMode()`,
  `setDevAiMode()/setDevDataset()`, `useDevState()`.
- `mock-store.ts` — in-memory data layer (the guard target). Imports are deliberately
  one-directional: it must never value-import the data libs (they import it), only `import type`.
- `seed.ts` builds the seeded dataset; `fixtures.ts` reuses the real CLEAR fixtures verbatim;
  `mock-session.ts` is the fake session; `util.ts` has helpers.
- `src/components/dev/DevPanel.tsx` — the floating panel + banner, mounted in `src/App.tsx`
  behind `{DEV_ACCESS_ENABLED && <DevPanel />}`.

## Production safety — don't break the gate

`DEV_ACCESS_ENABLED = import.meta.env.DEV || __DEV_BYPASS__`, where `__DEV_BYPASS__` is a
**build-time literal** define (`false` unless `VITE_DEV_BYPASS=true`). In a normal `vite build` it
folds to `false`, every guard dies, and the whole `src/lib/dev/*` + DevPanel graph **tree-shakes
out** (verified: prod build ships zero dev strings / no mock chunk). Keep the gate as a build-time
literal **AND** `devActive()`, so a stale `localStorage` flag stays inert in production. See
`.env.example` — `VITE_DEV_BYPASS` is local/preview only and must be absent or `false` in prod.
