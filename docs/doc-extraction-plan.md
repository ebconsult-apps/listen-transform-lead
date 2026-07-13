# A3.3 — Real document extraction: assessment & implementation plan

_Owner: product. Status: **plan (not yet implemented)**. Written 2026-07-13 while
shipping A3.1/A3.2. Decision: deliver this plan rather than half-build a fragile
Deno-side PDF/DOCX parser — see "Why a plan, not code" below._

## TL;DR

- **PDF/DOCX/XLSX already contribute to intake today** — extracted **browser-native**
  on both upload paths. The ROADMAP/north-star line "today binary extraction is a
  stub" is **stale**: it describes the `DOC_EXTRACT_MODE=live` *server-side* extractor
  from the collaboration design spec, which was **never built** (the code took the
  browser-native route instead, as `docs/unit-economics.md` notes: "Document text
  extraction … browser-native and cost nothing").
- The genuine residual gap is a **server-side fallback + trust removal**: when the
  browser can't extract (parse failure, an old/non-browser client, a scanned PDF),
  the binary lands with `extracted_text = null` and contributes nothing, and the
  server currently **trusts** whatever `extractedText` the client sends (the exact
  surface ROADMAP **B4** wants closed).
- A robust Deno-edge extractor for **all** of PDF + DOCX + XLSX is a real chunk of
  work with a wide failure surface (scanned/encrypted PDFs, huge files, the 150s edge
  wall clock). It does **not** fit in the remaining capacity of the A3 session, and a
  partial version (only text/XLSX, PDF/DOCX left stubbed) would be the "half-implement"
  the task forbids. Hence: this plan + estimate.

## Current reality (with file references)

| Path | Where | Extraction | Result |
|---|---|---|---|
| Owner upload | `src/lib/db.ts` `addDocument()` → `extractText(file)` (`src/lib/extract-text.ts`) | Browser: `pdfjs-dist` (PDF), `mammoth` (DOCX), `xlsx` (XLSX/XLS), `File.text()` (txt/md/csv) | `documents.extracted_text` stored |
| Respondent upload | `src/lib/collab.ts` `respondentUpload()` → same `extractText()` | Same browser pipeline | client sends `extractedText`; `supabase/functions/respondent/index.ts` (`upload-complete`) stores it verbatim |
| Intake assembly | `supabase/functions/project-run/index.ts` | Filters `documents` to those with non-null `extracted_text`, maps to `IntakeInput.documents` | Binaries with `null` text are silently skipped |

So a PDF a user uploads in the browser **is** read and **does** reach the model
today. What is missing is any server-side path that (a) recovers when the browser
extraction returns `null`, and (b) lets the server derive the text itself instead of
trusting the client (`respondent/index.ts` line ~199: `body.extractedText`).

The design spec (`docs/superpowers/specs/2026-06-16-clear-respondent-collaboration-design.md`
§6-7) specified `supabase/functions/_shared/extract/` (`types.ts`/`stub.ts`/`live.ts`/
`index.ts`) + an `extract-document` edge function keyed by `DOC_EXTRACT_MODE`.
Confirmed **absent**: `supabase/functions/_shared/extract/` does not exist and there
is no `extract-document` function.

## The residual gap (what "live" should add)

1. **Server-side extraction as source of truth for binaries.** On upload, the server
   downloads the stored object and extracts text itself, writing `extracted_text` +
   `status='parsed'|'failed'`. The client hint becomes advisory, not trusted (closes
   the B4 "stop trusting client-supplied `extractedText`" item for binary types).
2. **Fallback for failed browser extraction.** Recovers null-text binaries so they
   still contribute to intake.
3. **Uniform behaviour across owner and respondent paths.**

## Why a plan, not code

- **The primary value already ships** (browser-native), so this is hardening, not a
  hole — lower urgency than A3.1/A3.2.
- **Deno-edge PDF/DOCX is the risky part.** `pdfjs-dist` needs a worker + DOM-ish
  globals; `mammoth`'s browser build needs browser globals and its Node build needs
  `fs` — neither is clean in the Deno edge runtime. A correct implementation must
  swap to Deno-friendly libs (below) and handle scanned/encrypted/huge files and the
  150s wall clock. That is a **1-2 session** effort with a real test surface, not a
  tail-end add-on. Half-doing it (module + stub, PDF/DOCX still unsupported) is
  explicitly out of bounds for this task.

## Proposed design

Mirror the CLEAR engine's stub/live seam, as the design spec intended, but with
Deno-native parsers.

```
supabase/functions/_shared/extract/
  types.ts   export interface DocumentExtractor {
             extract(bytes: Uint8Array, filename: string, mime: string|null):
               Promise<{ text: string|null; kind: "text"|"pdf"|"docx"|"xlsx"|"unsupported" }>
             }
  stub.ts    StubExtractor  — text/* + .md/.csv/.txt via TextDecoder; binaries -> null
             (parity with today's server behaviour; safe default, no new deps)
  live.ts    LiveExtractor  — PDF via unpdf, DOCX via fflate + <w:t> parse, XLSX via
             the existing `xlsx` (SheetJS, Deno-compatible), text via TextDecoder
  index.ts   getDocumentExtractor(): reads Deno.env DOC_EXTRACT_MODE (default "stub")
```

New edge function `supabase/functions/extract-document/index.ts` (service role):
`POST { documentId }` → load `documents` row → download object from the `documents`
storage bucket → `getDocumentExtractor().extract(...)` → update `extracted_text`,
`status`. Invoked (fire-and-forget, then reconciled) from both upload completions.

## Library assessment (Deno edge runtime)

| Format | Today (browser) | Deno-edge recommendation | Risk |
|---|---|---|---|
| TXT/MD/CSV | `File.text()` | `new TextDecoder().decode(bytes)` | none |
| XLSX/XLS | `xlsx` (SheetJS) | **`xlsx` (SheetJS)** via `npm:` — already a dep, runs in Deno | low |
| PDF | `pdfjs-dist` (+ worker) | **`unpdf`** (`npm:unpdf`) — serverless/Deno pdfjs build, no DOM/worker; `extractText()` | medium (scanned PDFs have no text layer → return null + `status='failed'`, do **not** OCR in v1) |
| DOCX | `mammoth` browser build | **`fflate`** (`npm:fflate`, pure-JS unzip) → read `word/document.xml` → concatenate `<w:t>` runs (+ paragraph breaks) | medium (tables/numbering need care; good enough for intake prose) |

New deps are **edge-only** (`supabase/functions`, deployed by the Supabase CLI) — the
Vite **app bundle is untouched**, satisfying the "no new heavy app deps" bar. `unpdf`
and `fflate` are both small and Deno-friendly; `mammoth`/`pdfjs-dist` are **not**
added to the edge.

## File-level implementation plan

1. **`supabase/functions/_shared/extract/types.ts`** _(new, ~15 LoC)_ — the interface
   above + a `DocKind` type.
2. **`supabase/functions/_shared/extract/stub.ts`** _(new, ~25 LoC)_ — text formats
   decode; binaries → `{ text: null }`. Pure; unit-testable in vitest.
3. **`supabase/functions/_shared/extract/live.ts`** _(new, ~90 LoC)_ — `unpdf` for
   PDF, `fflate` + `<w:t>` for DOCX, `xlsx` for spreadsheets, `TextDecoder` for text.
   Cap output at `MAX_CHARS` (mirror `extract-text.ts`'s 50k). Catch-and-null on any
   parser throw (never fail the upload).
4. **`supabase/functions/_shared/extract/index.ts`** _(new, ~15 LoC)_ —
   `getDocumentExtractor()` by `Deno.env.get("DOC_EXTRACT_MODE") ?? "stub"`.
5. **`supabase/functions/extract-document/index.ts`** _(new, ~70 LoC)_ — service-role
   function: validate `documentId`, load row, download from storage, extract, update
   `extracted_text` + `status`, safe error via `_shared/errors.ts`. `verify_jwt=false`
   guarded by service-role + internal invocation only.
6. **`supabase/functions/respondent/index.ts`** _(edit, `upload-complete`)_ — stop
   storing `body.extractedText` for **binary** mimes; instead insert the row with
   `status='uploaded'` and invoke `extract-document`. Keep trusting client text only
   for `text/*` (cheap, low-risk) or drop it entirely (B4 decision).
7. **`src/lib/db.ts` `addDocument()` / `src/lib/collab.ts` `respondentUpload()`**
   _(edit)_ — keep the browser extraction as a fast path/hint, but have the server
   reconcile. Simplest v1: server extraction is authoritative for binaries; browser
   text is kept only as an immediate preview.
8. **`supabase/config.toml`** _(edit)_ — register `extract-document`
   (`verify_jwt=false`); add to the deploy list in `supabase/README.md` §3 and
   `.github/workflows/supabase-deploy.yml`.
9. **`.env.example` / `supabase/README.md`** _(edit)_ — document `DOC_EXTRACT_MODE`
   (`stub`|`live`, default `stub`).
10. **Async reconciliation** — set `status` to `parsed`/`failed`; surface `failed` in
    the owner UI (a small "couldn't read <file>" note, mirroring `NewProject.tsx`'s
    existing toast). A stale-`uploaded` sweeper can pigg-back on B2's worker sweeper.

## Test plan

- **Unit (vitest, no network)** — `StubExtractor`: text vs binary. `LiveExtractor`
  against small checked-in fixtures: a 1-page text PDF, a trivial DOCX, a 2-sheet
  XLSX, a CSV; assert extracted substrings; assert a scanned/no-text PDF and a
  garbage blob both return `{ text: null }` without throwing. (Fixtures are tiny
  binaries under `supabase/functions/_shared/extract/__fixtures__/`.)
- **Integration** — upload each type via the respondent + owner paths against the
  local stack; assert `documents.extracted_text` is populated server-side and a
  subsequent `project-run` includes the text (extend `tests/integration`).
- **Eval tie-in** — once live, add a fixture to `evals/` whose intake includes an
  uploaded-doc-derived block, so the rubric catches extraction regressions that
  silently drop document context.

## Effort estimate & sequencing

| Slice | Effort |
|---|---|
| Module (`_shared/extract/*`) + stub + unit tests | **~0.4 session** |
| `LiveExtractor`: XLSX + text (SheetJS already in) | **~0.2 session** |
| `LiveExtractor`: PDF (`unpdf`) + DOCX (`fflate`) + fixtures/tests | **~0.6 session** |
| `extract-document` fn + both call sites + config/deploy + B4 trust removal | **~0.5 session** |
| Integration tests + UI `failed` surfacing | **~0.3 session** |
| **Total** | **~2 sessions (L)** — split PDF/DOCX from the rest |

Recommended order: (1) module + stub + XLSX/text live (low risk, immediately closes
the "server derives text" trust gap for the easy formats and pairs with B4); (2) PDF
via `unpdf`; (3) DOCX via `fflate`. Ship behind `DOC_EXTRACT_MODE` so each format can
be enabled independently once its tests are green.

## Open decisions for Erik

- **OCR for scanned PDFs** — out of scope for v1 (return `failed`; the browser path
  already can't read them either). Revisit only if real uploads are image-PDFs.
- **B4 coupling** — server-side extraction is the natural home for "stop trusting
  client `extractedText`". Do this slice **with** B4 rather than twice.
- **Cost** — extraction is CPU-only (no model tokens), so no `docs/unit-economics.md`
  change; only edge CPU-seconds, bounded by the existing 15-doc / 80k-char intake
  ceiling (`intake-budget.ts`).
