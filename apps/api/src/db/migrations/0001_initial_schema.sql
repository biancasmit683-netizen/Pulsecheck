-- Pulse Check: initial schema
-- Source: 05-DATA-MODEL.md in the Build Kit.
-- Applied by pasting this file into Supabase Dashboard → SQL Editor → Run.

-- =========================================================================
-- Tables
-- =========================================================================

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_email text not null,
  magic_token text unique not null,
  magic_token_expires_at timestamptz not null,
  status text not null default 'created',
    -- created | in_progress | completed | report_failed | archived
  current_part_index int not null default 0,
  current_question_index int not null default 0,
  showing_transition boolean not null default true,
  flow_version text not null,
  metric_library_snapshot_at timestamptz,
  state jsonb not null default '{}'::jsonb,
  drive_folder_url text,
  client_metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz,
  report_generated_at timestamptz
);

create index if not exists idx_sessions_status on sessions(status);
create index if not exists idx_sessions_created_at on sessions(created_at desc);
-- magic_token already has a unique index from the column constraint

create table if not exists responses (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  part_id text not null,
    -- context | data | granularity | users | insights | data_discovery
  question_id text not null,
  question_type text not null,
    -- single | multi | single_with_note | single_with_other | multi_with_other
    -- | drag_to_rank | story_tier | story_followup_grain | story_followup_system
    -- | data_answer
  response_value jsonb not null,
  response_note text,
  metric_id text,
  data_point text,
  granularity text,
  captured_at timestamptz not null default now()
);

create index if not exists idx_responses_session on responses(session_id, captured_at);
create index if not exists idx_responses_metric on responses(session_id, metric_id) where metric_id is not null;

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade,
  event_type text not null,
    -- turn_returned | response_received | adaptive_triggered | adaptive_resolved
    -- | queue_expanded | part_completed | report_generated | report_failed | error
  event_data jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create index if not exists idx_events_session on events(session_id, occurred_at);
create index if not exists idx_events_type on events(event_type, occurred_at);

-- =========================================================================
-- View
-- =========================================================================

create or replace view v_session_summary as
select
  s.id,
  s.client_name,
  s.client_email,
  s.status,
  s.created_at,
  s.completed_at,
  s.drive_folder_url,
  (s.state->>'queue_index')::int as metrics_completed,
  jsonb_array_length(coalesce(s.state->'queue', '[]'::jsonb)) as metrics_total,
  (select count(*) from responses r where r.session_id = s.id) as total_responses,
  (select count(*) from events e where e.session_id = s.id and e.event_type = 'adaptive_triggered') as adaptive_fires
from sessions s;

-- =========================================================================
-- Row Level Security
-- =========================================================================
-- The service_role key used by the backend BYPASSES RLS. These policies exist
-- so that if the publishable (browser) key is ever used against these tables
-- the data stays locked down. v1 does not use the publishable key for
-- session reads (the backend mediates everything) so the policies are
-- intentionally strict.

alter table sessions enable row level security;
alter table responses enable row level security;
alter table events enable row level security;

-- Default: deny. Service role bypasses RLS so backend still works.
drop policy if exists sessions_deny_anon on sessions;
create policy sessions_deny_anon on sessions
  for all to anon, authenticated
  using (false)
  with check (false);

drop policy if exists responses_deny_anon on responses;
create policy responses_deny_anon on responses
  for all to anon, authenticated
  using (false)
  with check (false);

drop policy if exists events_deny_anon on events;
create policy events_deny_anon on events
  for all to anon, authenticated
  using (false)
  with check (false);
