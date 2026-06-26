-- ─────────────────────────────────────────────────────────────────────────────
-- Let the owner answer / document each flagged assumption or open question, and
-- feed those answers back into the next analysis run.
--
-- `assumption_gaps.response` mirrors `research_questions.answer` (the existing
-- "owner answers a question" pattern). `documents.assumption_gap_id` mirrors
-- `documents.invitation_id` — a nullable FK letting an uploaded document attach
-- to one specific item (null = a general project document).
--
-- No RLS changes: assumption_gaps and documents already grant project members
-- full read+write (a `members for all` policy), and the private `documents`
-- storage bucket already grants member read/write/delete.
-- ─────────────────────────────────────────────────────────────────────────────

alter table assumption_gaps add column if not exists response text;

alter table documents
  add column if not exists assumption_gap_id uuid references assumption_gaps on delete set null;

create index if not exists documents_assumption_gap_idx on documents (assumption_gap_id);
