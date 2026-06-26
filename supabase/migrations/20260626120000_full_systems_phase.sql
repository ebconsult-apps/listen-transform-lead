-- Pass 1 of the chunked FULL report (the systems map + behaviours) persists
-- server-side as a scratch run with phase 'leverage_full_systems', so Pass 2 can
-- read it from the DB instead of the request body. This lets the report survive a
-- browser tab closing between the two requests, and records Pass-1 cost even if
-- Pass 2 never fires. The scratch run is deleted once the final leverage_full is
-- assembled, and project-run excludes it from the free-run quota count.
alter table runs drop constraint if exists runs_phase_check;
alter table runs add constraint runs_phase_check
  check (phase in ('clarify','leverage_teaser','leverage_full','leverage_full_systems','experiment','research'));
