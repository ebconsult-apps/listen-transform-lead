-- Give assumption_gaps a real priority so the Open-questions focus flow can put
-- the most important item to verify/input on in front of the owner. Higher =
-- more important. Defaults are derived from flag_type until a phase (or the AI)
-- sets an explicit rank; the CASE here mirrors FLAG_PRIORITY in
-- src/lib/clear/labels.ts and backfills existing rows.
alter table assumption_gaps add column if not exists priority int not null default 0;

update assumption_gaps set priority = case flag_type
  when 'requires_confirmation' then 5
  when 'needs_input' then 4
  when 'input_needed' then 4
  when 'gap' then 3
  when 'assumption' then 2
  when 'user_input' then 1
  else 0 end
where priority = 0;
