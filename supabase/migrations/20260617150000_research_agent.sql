-- ─────────────────────────────────────────────────────────────────────────────
-- RESEARCH agent: cited evidence enrichment for CLARIFY & LEVERAGE, plus a shared
-- de-identified knowledge library reused across projects.
--
-- research_findings + research_questions are owner-editable (project members
-- read+write, mirroring intervention_candidates). knowledge_base is GLOBAL-read
-- but service-role-write only — client data only ever reaches it through the
-- owner-confirmed, de-identified promotion path in the project-research edge
-- function (no client write policy).
-- ─────────────────────────────────────────────────────────────────────────────

-- Research runs persist to `runs` for uniform token/cost accounting + the cap.
alter table runs drop constraint if exists runs_phase_check;
alter table runs add constraint runs_phase_check
  check (phase in ('clarify','leverage_teaser','leverage_full','experiment','research'));

-- Shared, de-identified knowledge library. Created first so research_findings
-- can FK to it. Curated entries (Erik-authored) and promoted entries (generalised
-- from a project finding) both land here via the service role.
create table if not exists knowledge_base (
  id                uuid primary key default gen_random_uuid(),
  kind              text not null default 'curated' check (kind in ('curated','promoted')),
  title             text not null,
  summary           text not null,
  tags              jsonb not null default '{}',     -- { useCase, targetGroup, topic, comBComponent }
  citations         jsonb not null default '[]',     -- [{ title, url, note }]
  evidence_strength text,                             -- 'strong' | 'moderate' | 'weak'
  origin_note       text,
  created_by        uuid references auth.users on delete set null,
  review_status     text not null default 'approved'
                    check (review_status in ('approved','pending')),
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);
create index if not exists knowledge_base_kind_idx on knowledge_base (kind);
create index if not exists knowledge_base_tags_idx on knowledge_base using gin (tags);

-- Per-project findings: AI-proposed, then owner-curated (accept / edit / dismiss /
-- promote). Mirrors intervention_candidates.
create table if not exists research_findings (
  id                uuid primary key default gen_random_uuid(),
  project_id        uuid not null references projects on delete cascade,
  phase_target      text not null default 'leverage'
                    check (phase_target in ('clarify','leverage')),
  claim             text not null,
  detail            text,
  source_kind       text not null default 'web'
                    check (source_kind in ('web','knowledge_base','dialogue')),
  citations         jsonb not null default '[]',     -- [{ title, url, note }]
  evidence_flag     text not null default 'A'
                    check (evidence_flag in ('V','A','G','NA')),
  confidence        int,
  tags              jsonb not null default '{}',
  status            text not null default 'proposed'
                    check (status in ('proposed','accepted','dismissed','promoted')),
  shared_finding_id uuid references knowledge_base on delete set null,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);
create index if not exists research_findings_project_idx on research_findings (project_id);

-- The agent's follow-up questions to the owner (the "deeper dialogue" source).
-- An answered question can resolve a matching assumption_gaps row.
create table if not exists research_questions (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects on delete cascade,
  question    text not null,
  rationale   text,
  answer      text,
  status      text not null default 'open' check (status in ('open','answered','dismissed')),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
create index if not exists research_questions_project_idx on research_questions (project_id);

-- ── RLS ───────────────────────────────────────────────────────────────────────
alter table knowledge_base      enable row level security;
alter table research_findings   enable row level security;
alter table research_questions  enable row level security;

-- knowledge_base: any signed-in user may read the shared library; writes go
-- through the service role only (no insert/update/delete policy).
create policy "knowledge_base read" on knowledge_base for select
  using (auth.uid() is not null);

-- Per-project tables: project members read + write.
create policy "research_findings members" on research_findings for all
  using (public.is_project_member(project_id))
  with check (public.is_project_member(project_id));

create policy "research_questions members" on research_questions for all
  using (public.is_project_member(project_id))
  with check (public.is_project_member(project_id));

-- ── Seed a small starter set of curated entries ───────────────────────────────
-- Real, well-known behavioural-science references that align with the CLEAR
-- methodology (COM-B, EAST, APEASE). Editable later in Supabase Studio / an admin UI.
insert into knowledge_base (kind, title, summary, tags, citations, evidence_strength, origin_note)
values
  (
    'curated',
    'COM-B: behaviour needs Capability, Opportunity and Motivation',
    'The COM-B model (the hub of the Behaviour Change Wheel) holds that any behaviour (B) occurs only when Capability (C), Opportunity (O) and Motivation (M) are all sufficient. Diagnose which of the six sub-components is the binding constraint before designing an intervention — this is the backbone of the LEVERAGE phase.',
    '{"topic":"com_b"}',
    '[{"title":"Michie, van Stralen & West (2011), \"The behaviour change wheel\", Implementation Science 6:42","url":"https://doi.org/10.1186/1748-5908-6-42"}]',
    'strong',
    'Seed entry'
  ),
  (
    'curated',
    'EAST: make it Easy, Attractive, Social, Timely',
    'The Behavioural Insights Team''s EAST framework: behaviour change is most reliable when the desired action is Easy (remove friction/sludge, use defaults), Attractive, Social (honest descriptive norms — "most people do X"), and Timely (cue it at the moment of decision). A practical checklist for generating leverage points and intervention candidates.',
    '{"topic":"east"}',
    '[{"title":"Behavioural Insights Team (2014), \"EAST: Four simple ways to apply behavioural insights\"","url":"https://www.bi.team/publications/east-four-simple-ways-to-apply-behavioural-insights/"}]',
    'strong',
    'Seed entry'
  ),
  (
    'curated',
    'APEASE: the criteria for screening interventions',
    'APEASE screens candidate interventions on Affordability, Practicability, Effectiveness/cost-effectiveness, Acceptability, Side-effects/safety, and Equity. Acceptability, Safety and Equity act as veto gates — a failure there parks an idea regardless of its effectiveness score. This is the basis of the EXPERIMENT phase''s screening.',
    '{"topic":"apease"}',
    '[{"title":"Michie, Atkins & West (2014), \"The Behaviour Change Wheel: A Guide to Designing Interventions\", Silverback Publishing"}]',
    'strong',
    'Seed entry'
  );
