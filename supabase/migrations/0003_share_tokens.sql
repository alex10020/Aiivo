-- =============================================================================
-- AIIVO ENGINE — shareable report tokens (workstream C/I, report deliverable)
-- A record's share_token is an unguessable capability URL: anyone with the
-- link can view the read-only report at /r/<token>. Rotating = regenerating.
-- =============================================================================

alter table records
  add column if not exists share_token uuid unique not null default gen_random_uuid();

create index if not exists records_share_token_idx on records (share_token);
