-- ─────────────────────────────────────────────────────────────────────────────
-- Respondent collaboration: email invitations + tokenized portal.
--
-- A project owner invites external respondents (no account) to a single project.
-- Respondents open a tokenized link and submit text answers, document uploads, and
-- structured reactions to the current Goals & Leverage map. Every respondent write
-- goes through the service-role `respondent` edge function (which bypasses RLS), so
-- these tables only need member-read policies for the owner side — no public read
-- and no client write policies.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists project_invitations (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references projects on delete cascade,
  email        text not null,
  token_hash   text not null,                        -- sha-256(raw token); raw lives only in the email link
  status       text not null default 'pending'
               check (status in ('pending','opened','submitted','revoked')),
  invited_by   uuid not null references auth.users,
  note         text,
  created_at   timestamptz default now(),
  expires_at   timestamptz default now() + interval '30 days',
  last_sent_at timestamptz default now(),
  unique (project_id, email)
);
create index if not exists project_invitations_token_hash_idx on project_invitations (token_hash);

create table if not exists project_contributions (
  id              uuid primary key default gen_random_uuid(),
  project_id      uuid not null references projects on delete cascade,
  invitation_id   uuid not null references project_invitations on delete cascade,
  respondent_name text,
  answers         jsonb not null default '{}',        -- { promptKey: text }
  status          text not null default 'draft'
                  check (status in ('draft','submitted')),
  submitted_at    timestamptz,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),
  unique (invitation_id)
);

create table if not exists leverage_reactions (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references projects on delete cascade,
  invitation_id uuid not null references project_invitations on delete cascade,
  run_id        uuid not null references runs on delete cascade,   -- which map version was reacted to
  point_rank    int not null,
  reaction      text not null check (reaction in ('resonates','unsure','missing')),
  note          text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now(),
  unique (invitation_id, run_id, point_rank)
);

-- Attribute respondent uploads (null = owner upload). The existing engine document
-- query is by project_id, so respondent docs flow into runs with no further change.
alter table documents
  add column if not exists invitation_id uuid references project_invitations on delete set null;

-- ── RLS: owner-side member read only ─────────────────────────────────────────
alter table project_invitations  enable row level security;
alter table project_contributions enable row level security;
alter table leverage_reactions    enable row level security;

create policy "invitations members read" on project_invitations for select
  using (public.is_project_member(project_id));
create policy "contributions members read" on project_contributions for select
  using (public.is_project_member(project_id));
create policy "reactions members read" on leverage_reactions for select
  using (public.is_project_member(project_id));
