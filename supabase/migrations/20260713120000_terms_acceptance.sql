-- ─────────────────────────────────────────────────────────────────────────────
-- Terms of Service acceptance, recorded once per account on the user's profile.
--
-- Mirrors the Privacy Policy acceptance pattern (20260625120000_privacy_acceptance.sql):
-- the signup flow requires a first-time user to accept the Terms of Service. We
-- stamp when they accepted and which terms version they saw, so a later copy change
-- can re-prompt by comparing versions (TERMS_VERSION in src/content/terms-of-service.tsx).
--
-- No RLS changes are needed: the existing "own profile read" / "own profile write"
-- policies (20260616184600_init.sql) already scope every profiles column to the
-- owning user, and handle_new_user() guarantees the row exists — so the client
-- records acceptance with an UPDATE (there is no INSERT policy on profiles).
-- ─────────────────────────────────────────────────────────────────────────────

alter table profiles add column if not exists terms_accepted_at timestamptz;
alter table profiles add column if not exists terms_version     text;
