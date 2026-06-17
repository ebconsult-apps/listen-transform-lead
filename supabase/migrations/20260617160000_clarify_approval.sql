-- ─────────────────────────────────────────────────────────────────────────────
-- Split CLARIFY and LEVERAGE into separate steps: Clarify becomes its own
-- review/edit/approve checkpoint, and Leverage only runs once Clarify is approved.
--
-- phase_approvals holds the owner-approved (possibly edited) phase output, kept
-- separate from the raw AI `runs` so editing an approval and re-running the model
-- don't clobber each other. Member-editable like experiment_designs.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists phase_approvals (
  project_id  uuid not null references projects on delete cascade,
  phase       text not null,                 -- 'clarify' (generalizes for later phases)
  output      jsonb not null,                -- the approved (possibly edited) phase output
  approved_at timestamptz default now(),
  updated_at  timestamptz default now(),
  primary key (project_id, phase)
);

-- Add the Clarify checkpoint statuses.
alter table projects drop constraint if exists projects_status_check;
alter table projects add constraint projects_status_check
  check (status in (
    'draft','running','clarify_ready','clarify_approved','teaser_ready','paid','full_ready',
    'experiment_design','experiment_active','error'
  ));

-- ── RLS: project members read + write (owner-editable approval record) ────────
alter table phase_approvals enable row level security;

create policy "phase_approvals members" on phase_approvals for all
  using (public.is_project_member(project_id))
  with check (public.is_project_member(project_id));
