-- ─────────────────────────────────────────────────────────────────────────────
-- Stage-1 self-serve CLEAR app — schema, RLS, storage, and first-login trigger.
-- Apply with: supabase db push   (or paste into the SQL editor).
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Tables ──────────────────────────────────────────────────────────────────

create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  created_at timestamptz default now()
);

create table if not exists workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'My workspace',
  owner_id uuid not null references auth.users,
  created_at timestamptz default now()
);

create table if not exists memberships (
  workspace_id uuid references workspaces on delete cascade,
  user_id uuid references auth.users on delete cascade,
  role text not null check (role in ('owner','member')),
  primary key (workspace_id, user_id)
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces on delete cascade,
  name text not null,
  target_group text,
  use_case text,
  status text not null default 'draft'
    check (status in ('draft','running','teaser_ready','paid','full_ready','error')),
  created_by uuid not null references auth.users,
  created_at timestamptz default now()
);

create table if not exists project_inputs (
  project_id uuid primary key references projects on delete cascade,
  challenge text not null,
  stakeholders jsonb default '[]',
  timeline text
);

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects on delete cascade,
  storage_path text not null,
  filename text not null,
  mime text,
  bytes int,
  status text not null default 'uploaded'
    check (status in ('uploaded','parsed','failed')),
  extracted_text text,
  created_at timestamptz default now()
);

create table if not exists runs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects on delete cascade,
  phase text not null check (phase in ('clarify','leverage_teaser','leverage_full')),
  status text not null default 'pending'
    check (status in ('pending','running','done','error')),
  ai_mode text not null,
  output jsonb,
  tokens_used int,
  cost_usd numeric,
  created_at timestamptz default now()
);

create table if not exists entitlements (
  workspace_id uuid primary key references workspaces on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  tier text not null default 'free'
    check (tier in ('free','solo','team','business')),
  status text,
  current_period_end timestamptz
);

create table if not exists project_unlocks (
  project_id uuid primary key references projects on delete cascade,
  unlocked boolean not null default false,
  stripe_payment_intent text,
  unlocked_at timestamptz
);

-- ── Helper: is the current user a member of a workspace? ─────────────────────
-- SECURITY DEFINER avoids recursive RLS evaluation on memberships.
create or replace function public.is_member(ws uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from memberships m
    where m.workspace_id = ws and m.user_id = auth.uid()
  );
$$;

create or replace function public.is_project_member(p uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from projects pr
    join memberships m on m.workspace_id = pr.workspace_id
    where pr.id = p and m.user_id = auth.uid()
  );
$$;

-- ── RLS ──────────────────────────────────────────────────────────────────────
alter table profiles        enable row level security;
alter table workspaces      enable row level security;
alter table memberships     enable row level security;
alter table projects        enable row level security;
alter table project_inputs  enable row level security;
alter table documents       enable row level security;
alter table runs            enable row level security;
alter table entitlements    enable row level security;
alter table project_unlocks enable row level security;

-- profiles: a user reads/writes only their own row
create policy "own profile read"  on profiles for select using (id = auth.uid());
create policy "own profile write" on profiles for update using (id = auth.uid());

-- workspaces: members can read; the owner can update
create policy "ws members read" on workspaces for select using (public.is_member(id));
create policy "ws owner write"  on workspaces for update using (owner_id = auth.uid());

-- memberships: a user sees their own membership rows
create policy "own memberships read" on memberships for select using (user_id = auth.uid());

-- projects: members read + write (insert/update/delete) within their workspace
create policy "projects members read" on projects for select using (public.is_member(workspace_id));
create policy "projects members write" on projects for all
  using (public.is_member(workspace_id))
  with check (public.is_member(workspace_id));

-- child tables gate via parent project → workspace
create policy "inputs members" on project_inputs for all
  using (public.is_project_member(project_id))
  with check (public.is_project_member(project_id));

create policy "documents members" on documents for all
  using (public.is_project_member(project_id))
  with check (public.is_project_member(project_id));

-- runs: members read; stub mode writes from the client, so allow member insert
create policy "runs members read" on runs for select using (public.is_project_member(project_id));
create policy "runs members write" on runs for all
  using (public.is_project_member(project_id))
  with check (public.is_project_member(project_id));

-- billing rows: members read only. Writes happen via service-role (webhook).
create policy "entitlements members read" on entitlements for select using (public.is_member(workspace_id));
create policy "unlocks members read" on project_unlocks for select using (public.is_project_member(project_id));

-- ── First-login trigger: profile + personal workspace + owner membership ─────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  ws_id uuid;
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;

  insert into public.workspaces (name, owner_id)
  values ('My workspace', new.id)
  returning id into ws_id;

  insert into public.memberships (workspace_id, user_id, role)
  values (ws_id, new.id, 'owner');

  insert into public.entitlements (workspace_id, tier, status)
  values (ws_id, 'free', 'active')
  on conflict (workspace_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Storage: private 'documents' bucket scoped to workspace members ──────────
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

-- Object path convention: {workspace_id}/{project_id}/{uuid}-{filename}
-- The first path segment is the workspace id; restrict to its members.
create policy "documents bucket members read" on storage.objects for select
  using (bucket_id = 'documents' and public.is_member((storage.foldername(name))[1]::uuid));

create policy "documents bucket members write" on storage.objects for insert
  with check (bucket_id = 'documents' and public.is_member((storage.foldername(name))[1]::uuid));

create policy "documents bucket members delete" on storage.objects for delete
  using (bucket_id = 'documents' and public.is_member((storage.foldername(name))[1]::uuid));
