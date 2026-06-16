# CLEAR self-serve — respondent collaboration (email invitations)

**Date:** 2026-06-16
**Status:** Design approved, pending spec review
**Area:** `src/pages/app`, `src/pages/respond` (new), `supabase/`

## 1. Summary

Let a project owner invite external **respondents** by email to collaborate on a
single CLEAR project. An invited respondent clicks a tokenized link (no account,
no password) and lands on a focused, single-project page where they can:

1. **Give their input** — a short guided text form ("dictation" is a separate
   workstream; we stub a mic affordance wired to the same fields).
2. **Upload their most relevant documents.**
3. **Review the current Goals & Leverage map** (read-only) and leave
   **structured reactions** per leverage point.

Their contributions accumulate on the owner's side; the owner re-runs the
analysis to incorporate them (owner-curated, cost-aware).

## 2. Goals / Non-goals

**Goals**
- Per-project respondent invitations with scoped, account-less access.
- Capture respondent text input, documents, and structured map reactions.
- Surface contributions to the owner and let them re-run to incorporate.
- Wire document extraction end-to-end via a **stub** (text formats real now,
  binary formats seamed for later).

**Non-goals (explicitly out of scope)**
- Voice-to-text / audio transcription (separate workstream; stubbed seam only).
- Real PDF/DOCX/XLSX text extraction (stub seam only; `DOC_EXTRACT_MODE=live`
  is a future drop-in).
- Auto-incorporation of input (rejected in favor of owner-curated re-run).
- Respondent accounts, return-visit identity, or workspace membership for
  respondents.
- Threaded/open comments on the map (only structured reactions in v1).

## 3. Decisions & rationale

| Decision | Choice | Why |
|---|---|---|
| Respondent access | Signed token link, **no account** | Lowest friction for non-technical stakeholders; no auth user pollution. |
| Respondent input | Guided text + **dictation stub** | Voice is a separate workstream; text ships now, same fields accept transcripts later. |
| Map review | Read-only + **structured reactions** | Listening-first signal without comment-thread overhead; no AI changes. |
| Incorporation | **A — owner-curated re-run** | Keeps owner in control; respects per-workspace AI cost cap; avoids races. |
| Email | **Brevo (reuse)** | Existing verified `clear-framework.com` sender; no new vendor/DNS. |
| Doc extraction | **Stub now** (`DOC_EXTRACT_MODE`) | Mirrors existing `AI_MODE` stub/live pattern; wires pipeline end-to-end. |

## 4. Architecture overview

- **Respondents have no Supabase identity.** Every respondent read/write goes
  through an edge function using the **service-role** client, authorized by the
  token. No respondent ever touches a table directly, so RLS for the new tables
  only needs member-read policies for the owner side.
- **New public route** `/respond/:token` — minimal chrome (CLEAR wordmark, no app
  nav), `noindex`, served by the SPA fallback (not prerendered).
- **Owner UI** — `/app/projects/:id` gains tabs: **Report** (existing) +
  **Collaborate** (new).

## 5. Data model (new migration `supabase/migrations/<ts>_collaboration.sql`)

```sql
create table project_invitations (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references projects on delete cascade,
  email        text not null,
  token_hash   text not null,                       -- sha-256 of the raw token
  status       text not null default 'pending'
               check (status in ('pending','opened','submitted','revoked')),
  invited_by   uuid not null references auth.users,
  created_at   timestamptz default now(),
  expires_at   timestamptz default now() + interval '30 days',
  last_sent_at timestamptz default now(),
  unique (project_id, email)
);
create index on project_invitations (token_hash);

create table project_contributions (
  id             uuid primary key default gen_random_uuid(),
  project_id     uuid not null references projects on delete cascade,
  invitation_id  uuid not null references project_invitations on delete cascade,
  respondent_name text,
  answers        jsonb not null default '{}',       -- { promptKey: text }
  status         text not null default 'draft'
                 check (status in ('draft','submitted')),
  submitted_at   timestamptz,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now(),
  unique (invitation_id)
);

create table leverage_reactions (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references projects on delete cascade,
  invitation_id uuid not null references project_invitations on delete cascade,
  run_id        uuid not null references runs on delete cascade,  -- which map version
  point_rank    int not null,                                     -- leverage point rank
  reaction      text not null check (reaction in ('resonates','unsure','missing')),
  note          text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now(),
  unique (invitation_id, run_id, point_rank)
);

-- attribute respondent uploads (null = owner upload)
alter table documents add column invitation_id uuid references project_invitations on delete set null;
```

**RLS:** enable on all three new tables. Policies: `select using
public.is_project_member(project_id)` (owner/members read). No client write
policies — all respondent writes go through service-role edge functions. The
existing `documents` policies are unchanged (respondent inserts use service role
via signed upload URL, which bypasses RLS).

## 6. Edge functions

### `invite-respondents` (owner JWT)
`POST { projectId, emails: string[], note?: string }`
- Verify caller membership of the project's workspace.
- For each email: generate a 32-byte random token, store `sha-256(token)`,
  **insert** the invitation row, send the email via Brevo with the link
  `https://clear-framework.com/respond/<token>`.
- **Upsert-vs-resend boundary:** the initial `invite` is insert-only on the new
  `(project_id, email)` pair — re-inviting an existing email is a no-op that
  routes the caller to `resend`. Re-issuing a token for an existing invitation
  happens **only** via `action: 'resend'` (new token, new `last_sent_at`,
  status → `pending`). This keeps one code path for new invites and one for
  re-issuing.
- Returns per-email status. Never returns the raw token after send.
- Also handles `action: 'resend'` and `action: 'revoke'` (status → revoked) for
  the owner UI.

### `respondent` (public, token-authed, `action`-based)
`POST { token, action, ... }`
- `load` — hash token, look up non-revoked, non-expired invitation; mark
  `opened`; return `{ projectName, prompts, map | null, currentRunId | null,
  points[], existing: { answers, reactions, respondentName, documents } }`.
  **The "current map" is the latest `leverage_teaser` run** (the same selection
  the owner UI already uses: `latestOutput(runs, "leverage_teaser")` in
  ProjectDetail.tsx). `currentRunId` is that run's id; every reaction the
  respondent leaves is keyed to it. If a later owner re-run produces a new teaser
  run, prior reactions stay anchored to the older `run_id` (historical) and the
  owner's reaction summary reflects the current run.
- `save` — upsert draft `answers` / `respondentName` / `reactions`.
- `submit` — set contribution `status='submitted'`, `submitted_at=now()`,
  invitation `status='submitted'`.
- `upload` — issue a short-lived **signed upload URL** for
  `{workspace_id}/{project_id}/{uuid}-{safeName}`; after the client uploads,
  record the `documents` row with `invitation_id`, then invoke
  `extract-document`.

### `extract-document` (service role)
`POST { documentId }`
- Loads the document, runs the selected extractor (`DOC_EXTRACT_MODE`), writes
  `extracted_text` + `status='parsed'` (or `'failed'`).
- Mirrors the CLEAR engine's stub/live split.

## 7. Document extraction stub

New shared module `supabase/functions/_shared/extract/` mirroring
`_shared/clear/`:

```
types.ts   -> interface DocumentExtractor { extract(file, mime, filename): Promise<{ text: string|null }> }
stub.ts    -> StubExtractor:  text/* and .md/.csv/.txt -> decoded text; binaries -> { text: null }
live.ts    -> LiveExtractor:  TODO (PDF/DOCX/XLSX) — future drop-in
index.ts   -> getDocumentExtractor() selects by Deno.env DOC_EXTRACT_MODE (default 'stub')
```

- The stub returns **real text for text formats** (so respondent and owner text
  files flow into the engine immediately) and `null` for binaries (engine skips
  them exactly as today — no synthetic noise).
- Called from both upload paths so the pipeline is identical for owner and
  respondent documents.

## 8. Engine integration (Approach A)

- Extend the intake builder in `supabase/functions/project-run/index.ts`:
  - Append **submitted contributions** (`answers`) as additional stakeholder
    voice entries in `IntakeInput`.
  - Summarize **reactions** into the intake (e.g. "stakeholders flagged leverage
    point #2 as 'missing something': <notes>").
  - Respondent documents are already returned by the existing `documents` query
    (no change) and now carry `extracted_text` for text formats via the stub.
- **Intended owner-side behavior change (not a regression):** today nothing
  populates `extracted_text`, so documents contribute *nothing* to any run. Once
  `extract-document` runs on the owner upload path too (§14), owner-uploaded
  **text** files (`.txt/.md/.csv`) start contributing to intake on the next run.
  Binary files remain skipped until `DOC_EXTRACT_MODE=live`. Call this out in the
  plan so existing projects' richer output isn't mistaken for a regression.
- **No automatic re-run.** `ProjectDetail` computes "new contributions since
  last run" (`contributions.submitted_at > latest run.created_at`) and shows a
  **"Re-run to incorporate"** CTA that calls the existing `project-run` teaser
  phase. The owner reaction summary (§10) groups reactions by the current teaser
  `run_id`.

## 9. Respondent page (`src/pages/respond/RespondentPortal.tsx`, route `/respond/:token`)

Sections, top to bottom:
1. **Header** — "{Workspace} invited you to help shape '{project name}'."
2. **Consent (GDPR)** — what's collected, who sees it; a required acknowledgment
   checkbox gating Submit.
3. **Current thinking** — if a map exists (latest `leverage_teaser` run), render
   the read-only Goals + ranked Leverage points with a reaction control under each
   point: three chips (*resonates / not sure / missing something*) + optional
   note, keyed by `point_rank` + `currentRunId`. If no map yet: a friendly "the
   team is preparing this — your input below will shape it."
   - **Rendering note:** `TeaserReport` renders points via `LeverageTable`, which
     is closed (no per-point slot), so it can't host chips as-is. Two options for
     the plan to choose: (a) thread a per-point render slot through `TeaserReport`
     → `LeverageTable` and reuse them, or (b) build a small parallel read-only
     `RespondentMap` component. Either way the Goals/Clarify block can reuse
     existing presentation. Budget for touching `LeverageTable` if (a).
4. **Your input** — 3–4 guided open prompts (text). A disabled mic affordance
   ("voice input coming soon") wired to the same `answers` fields for the
   dictation workstream.
5. **Documents** — upload reusing NewProject's accept list/limits (≤10 files /
   50 MB) via signed upload URLs.
6. **Save draft (autosave) + Submit** → thank-you state. The link stays
   re-openable to edit until revoked or expired.

## 10. Owner "Collaborate" tab (`src/components/product/CollaborateTab.tsx`)

- **Invite box** — one or many emails + optional note → Send.
- **Invitations list** — email, status, sent date; actions **resend / revoke /
  copy link**.
- **Contributions** — per submitted respondent: their answers + uploaded docs.
- **Reaction summary** — per leverage point: counts of resonates/unsure/missing
  + notes.
- **"N new contributions since last run → Re-run to incorporate"** CTA.

## 11. Email (Brevo)

- Shared helper `supabase/functions/_shared/email.ts` → `POST
  https://api.brevo.com/v3/smtp/email` with `api-key: BREVO_API_KEY`.
- Sender: verified `clear-framework.com` address.
- Invite email: who invited them, project name, what they're asked to do, the
  link, expiry note. Simple branded inline HTML + plaintext fallback.
- New secret: `BREVO_API_KEY` (edge function secret).

## 12. Security & privacy

- Token: 32 random bytes (base64url); only `sha-256(token)` stored. Raw token
  exists only in the emailed link.
- Expiry (30 days), revoke (status), single-project scope.
- Basic abuse protection: constant-time-ish lookup by hash; reject
  revoked/expired; consider per-IP rate limiting on `respondent.load`.
- Respondents never receive a Supabase session.
- GDPR: data already in EU region; explicit consent checkbox; contributions and
  documents are visible only to workspace members.

## 13. Routing & build

- Add top-level `<Route path="/respond/:token" element={<RespondentPortal />} />`
  in `src/App.tsx`, outside `ProtectedRoute` and the marketing `Layout`.
- `noindex` via the `SEO` component; ensure the prerender config does not attempt
  to prerender the dynamic token route (SPA fallback serves it).

## 14. File inventory

**New**
- `supabase/migrations/<ts>_collaboration.sql`
- `supabase/functions/invite-respondents/index.ts`
- `supabase/functions/respondent/index.ts`
- `supabase/functions/extract-document/index.ts`
- `supabase/functions/_shared/extract/{types,stub,live,index}.ts`
- `supabase/functions/_shared/email.ts`
- `src/pages/respond/RespondentPortal.tsx`
- `src/components/product/CollaborateTab.tsx`
- `src/components/product/ReactionChips.tsx`
- `src/components/product/RespondentMap.tsx` (read-only map + per-point reaction
  slots — needed if §9.3 option (b); skip if reusing `TeaserReport` via option (a))
- `src/lib/collab.ts` (owner-side data access + function invokers)

**Modified**
- `supabase/functions/project-run/index.ts` (intake += contributions + reactions)
- `src/pages/app/ProjectDetail.tsx` (tabs: Report | Collaborate)
- `src/pages/app/NewProject.tsx` (invoke `extract-document` after upload)
- `src/lib/db.ts` (types for new tables; `documents.invitation_id`)
- `src/App.tsx` (respondent route)
- `src/components/product/TeaserReport.tsx` + `LeverageTable.tsx` (only if §9.3
  option (a): add a per-point render slot)
- `supabase/README.md` (BREVO_API_KEY, DOC_EXTRACT_MODE, new functions)

## 15. Testing

- **Unit:** token hash/verify; `StubExtractor` for text vs binary; intake builder
  includes submitted contributions + reaction summary; "new contributions since
  last run" computation.
- **Edge (stub mode / Supabase local):** `respondent` action routing
  (load/save/submit/upload) honors token validity, expiry, revoke; `invite`
  enforces membership; signed-upload path records `documents` with
  `invitation_id`.
- **RLS:** a non-member cannot read invitations/contributions/reactions; a member
  can.
- **Manual E2E checklist:** owner invites → email arrives → respondent loads,
  reacts, types, uploads, submits → owner sees contribution + reactions →
  re-run incorporates → revoke kills the link.

## 16. Open questions / future work

- Real document extraction (`DOC_EXTRACT_MODE=live`) for PDF/DOCX/XLSX.
- Voice dictation workstream writes transcripts into `contributions.answers`.
- Optional: notify the owner by email when a respondent submits.
- Optional: per-IP rate limiting / captcha on `respondent.load` if abused.
