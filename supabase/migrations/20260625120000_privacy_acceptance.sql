-- ─────────────────────────────────────────────────────────────────────────────
-- Privacy Policy acceptance, recorded once per account on the user's profile.
--
-- The New Project setup flow requires a first-time user to accept the Privacy
-- Policy before creating a project. We stamp when they accepted and which policy
-- version they saw, so a later copy change can re-prompt by comparing versions.
--
-- No RLS changes are needed: the existing "own profile read" / "own profile
-- write" policies (20260616184600_init.sql) already scope every profiles column
-- to the owning user, and handle_new_user() guarantees the row exists — so the
-- client records acceptance with an UPDATE (there is no INSERT policy on profiles).
-- ─────────────────────────────────────────────────────────────────────────────

alter table profiles add column if not exists privacy_accepted_at   timestamptz;
alter table profiles add column if not exists privacy_policy_version text;
