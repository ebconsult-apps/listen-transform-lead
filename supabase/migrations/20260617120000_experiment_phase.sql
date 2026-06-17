-- ─────────────────────────────────────────────────────────────────────────────
-- EXPERIMENT phase (CLEAR phase 3): turn ranked leverage points into APEASE-
-- screened intervention candidates and editable Test Cards, then PAUSE for
-- real-world execution. Plus a persistent, cross-phase assumptions/gaps log.
--
-- These records are owner-editable from the app (unlike the service-role-only
-- respondent tables), so RLS grants project members full read+write, mirroring
-- project_inputs.
-- ─────────────────────────────────────────────────────────────────────────────

-- Extend the phase/status enums to cover EXPERIMENT.
alter table runs drop constraint if exists runs_phase_check;
alter table runs add constraint runs_phase_check
  check (phase in ('clarify','leverage_teaser','leverage_full','experiment'));

alter table projects drop constraint if exists projects_status_check;
alter table projects add constraint projects_status_check
  check (status in (
    'draft','running','teaser_ready','paid','full_ready',
    'experiment_design','experiment_active','error'
  ));

-- One row per project: the human-supplied resource envelope + phase sub-status.
create table if not exists experiment_designs (
  project_id uuid primary key references projects on delete cascade,
  envelope   jsonb not null default '{}',          -- { budget, people, time }
  status     text not null default 'design'
             check (status in ('design','active')),
  updated_at timestamptz default now()
);

-- AI-proposed (then owner-edited) intervention candidates with an APEASE screen.
create table if not exists intervention_candidates (
  id                  uuid primary key default gen_random_uuid(),
  project_id          uuid not null references projects on delete cascade,
  leverage_point_rank int,
  barrier             text,                          -- the named COM-B barrier addressed
  title               text not null,
  description         text,
  apease              jsonb not null default '{}',   -- 3 scores 1-5 + 3 gates pass/flag/fail
  parked              boolean not null default false,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);
create index if not exists intervention_candidates_project_idx
  on intervention_candidates (project_id);

-- Editable Test Cards promoted from surviving candidates. `results` is reserved
-- for ANALYSE (phase 4) and stays null here — experiments run in the real world.
create table if not exists test_cards (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references projects on delete cascade,
  candidate_id  uuid references intervention_candidates on delete set null,
  leverage_point text,
  hypothesis    text,
  action        text,
  metric        text,
  threshold     text,
  duration      text,
  risk_level    text,
  kr_ref        text,
  ethics_notes  text,
  calendar_week int,
  owner_role    text,
  status        text not null default 'planned'
                check (status in ('planned','running','done','archived')),
  results       jsonb,                               -- reserved for ANALYSE
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);
create index if not exists test_cards_project_idx on test_cards (project_id);

-- Persistent, cross-phase assumptions/gaps log (never-fabricate flag taxonomy).
create table if not exists assumption_gaps (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects on delete cascade,
  phase      text,
  flag_type  text not null
             check (flag_type in (
               'assumption','gap','input_needed','user_input','needs_input','requires_confirmation'
             )),
  content    text not null,
  source     text,
  status     text not null default 'open'
             check (status in ('open','resolved','carried')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists assumption_gaps_project_idx on assumption_gaps (project_id);

-- ── RLS: project members read + write ────────────────────────────────────────
alter table experiment_designs       enable row level security;
alter table intervention_candidates  enable row level security;
alter table test_cards               enable row level security;
alter table assumption_gaps          enable row level security;

create policy "experiment_designs members" on experiment_designs for all
  using (public.is_project_member(project_id))
  with check (public.is_project_member(project_id));

create policy "intervention_candidates members" on intervention_candidates for all
  using (public.is_project_member(project_id))
  with check (public.is_project_member(project_id));

create policy "test_cards members" on test_cards for all
  using (public.is_project_member(project_id))
  with check (public.is_project_member(project_id));

create policy "assumption_gaps members" on assumption_gaps for all
  using (public.is_project_member(project_id))
  with check (public.is_project_member(project_id));
