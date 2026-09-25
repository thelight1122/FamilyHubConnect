-- Accountability foundation (docs/SPEC-ACCOUNTABILITY-REFRAME-2026-09-18.md).
--
-- The data shape the Arbiter will work inside. No engine writes here yet;
-- this migration fixes the rules the engine must live under:
--
--   * Impersonal: a session names a topic ("a question of accountability is
--     open"), never a defendant. There is no "accused" column.
--   * Mutual: every participant, adult or child, gives an account the same way.
--   * Account before conclusion: while any participant has not given their
--     account, each person sees only their own; and a session cannot close
--     until everyone has been heard.
--   * Two doors: 'support' (an outcome, no account owed) and
--     'accountability' (an unmet commitment or possible concealment).
--   * Records are growth, not a rap sheet: an Arbiter session record is
--     visible only to the person it describes, only after a cooldown, and
--     cannot be written from the app. The engine's write path is designed
--     with the IRG port.

create table if not exists public.accountability_sessions (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  door text not null check (door in ('support', 'accountability')),
  topic text not null check (char_length(trim(topic)) between 1 and 200),
  status text not null default 'open' check (status in ('open', 'closed')),
  opened_by uuid references auth.users(id) on delete set null,
  opened_at timestamptz not null default now(),
  closed_by uuid references auth.users(id) on delete set null,
  closed_at timestamptz,
  common_ground text not null default '' check (char_length(common_ground) <= 2000)
);

create table if not exists public.session_participants (
  session_id uuid not null references public.accountability_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  primary key (session_id, user_id)
);

create table if not exists public.session_accounts (
  session_id uuid not null references public.accountability_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(trim(body)) between 1 and 4000),
  created_at timestamptz not null default now(),
  primary key (session_id, user_id)
);

create table if not exists public.session_records (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.accountability_sessions(id) on delete cascade,
  subject_id uuid not null references auth.users(id) on delete cascade,
  engine text not null check (char_length(engine) between 1 and 80),
  -- Observations only: e.g. {"virtues":[{"name":"Honesty","score":72,"reason":"..."}],
  -- "signal":"...","energy":"...","synthesis":"..."}. No verdict field exists.
  observations jsonb not null check (jsonb_typeof(observations) = 'object' and not observations ? 'verdict'),
  available_after timestamptz not null default now() + interval '2 hours',
  acknowledged_at timestamptz,
  reflection text not null default '' check (char_length(reflection) <= 4000),
  created_at timestamptz not null default now(),
  unique (session_id, subject_id)
);

create index if not exists accountability_sessions_family_idx on public.accountability_sessions(family_id, status, opened_at desc);
create index if not exists session_participants_user_idx on public.session_participants(user_id);
create index if not exists session_records_subject_idx on public.session_records(subject_id);

alter table public.accountability_sessions enable row level security;
alter table public.session_participants enable row level security;
alter table public.session_accounts enable row level security;
alter table public.session_records enable row level security;

create or replace function private.is_session_participant(target_session_id uuid)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1 from public.session_participants
    where session_id = target_session_id and user_id = auth.uid()
  );
$$;

create or replace function private.all_accounts_given(target_session_id uuid)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select not exists (
    select 1
    from public.session_participants p
    where p.session_id = target_session_id
      and not exists (
        select 1 from public.session_accounts a
        where a.session_id = p.session_id and a.user_id = p.user_id
      )
  );
$$;

revoke all on function private.is_session_participant(uuid) from public;
revoke all on function private.all_accounts_given(uuid) from public;
grant execute on function private.is_session_participant(uuid) to authenticated;
grant execute on function private.all_accounts_given(uuid) to authenticated;

-- Sessions and participant lists are visible to the whole family, so no one
-- is held in a question they cannot see; what was said stays with the
-- participants.
create policy accountability_sessions_member_select on public.accountability_sessions
  for select to authenticated using (private.is_family_member(family_id));

create policy session_participants_member_select on public.session_participants
  for select to authenticated
  using (exists (
    select 1 from public.accountability_sessions s
    where s.id = session_id and private.is_family_member(s.family_id)
  ));

create policy session_accounts_select on public.session_accounts
  for select to authenticated
  using (
    user_id = auth.uid()
    or (private.is_session_participant(session_id) and private.all_accounts_given(session_id))
  );

create policy session_accounts_self_give on public.session_accounts
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and private.is_session_participant(session_id)
    and exists (select 1 from public.accountability_sessions s where s.id = session_id and s.status = 'open')
  );

create policy session_accounts_self_revise on public.session_accounts
  for update to authenticated
  using (
    user_id = auth.uid()
    and not private.all_accounts_given(session_id)
  )
  with check (user_id = auth.uid());

create policy session_records_subject_select on public.session_records
  for select to authenticated
  using (subject_id = auth.uid() and available_after <= now());
-- No insert/update/delete policies. Acknowledgement goes through
-- public.acknowledge_session_record.

-- Opening a session: any member, for participants in their own family. The
-- opener is always a participant, so no one opens a question they stand
-- outside of.
create or replace function public.open_accountability_session(
  target_family_id uuid,
  session_door text,
  session_topic text,
  participant_ids uuid[]
)
returns public.accountability_sessions
language plpgsql
security definer
set search_path = ''
as $$
declare
  session public.accountability_sessions;
  everyone uuid[] := array(select distinct unnest(array_append(coalesce(participant_ids, '{}'), auth.uid())));
begin
  if not private.is_family_member(target_family_id) then
    raise exception 'Family not found.' using errcode = 'no_data_found';
  end if;
  if exists (
    select 1 from unnest(everyone) as p(uid)
    where not exists (
      select 1 from public.family_members m
      where m.family_id = target_family_id and m.user_id = p.uid
    )
  ) then
    raise exception 'Every participant must be a member of this family.' using errcode = 'check_violation';
  end if;

  insert into public.accountability_sessions (family_id, door, topic, opened_by)
  values (target_family_id, session_door, session_topic, auth.uid())
  returning * into session;

  insert into public.session_participants (session_id, user_id)
  select session.id, uid from unnest(everyone) as uid;

  return session;
end;
$$;

-- Closing: any participant, and only once every participant has been heard.
create or replace function public.close_accountability_session(target_session_id uuid, agreed_common_ground text)
returns public.accountability_sessions
language plpgsql
security definer
set search_path = ''
as $$
declare
  session public.accountability_sessions;
begin
  if not private.is_session_participant(target_session_id) then
    raise exception 'Only a participant can close this session.' using errcode = 'insufficient_privilege';
  end if;
  if not private.all_accounts_given(target_session_id) then
    raise exception 'Everyone must give their account before the session can close.' using errcode = 'check_violation';
  end if;

  update public.accountability_sessions
     set status = 'closed',
         closed_by = auth.uid(),
         closed_at = now(),
         common_ground = coalesce(agreed_common_ground, '')
   where id = target_session_id
     and status = 'open'
  returning * into session;

  if session.id is null then
    raise exception 'This session is already closed.' using errcode = 'check_violation';
  end if;
  return session;
end;
$$;

create or replace function public.acknowledge_session_record(target_record_id uuid, personal_reflection text)
returns public.session_records
language plpgsql
security definer
set search_path = ''
as $$
declare
  record public.session_records;
begin
  update public.session_records
     set acknowledged_at = now(),
         reflection = coalesce(personal_reflection, '')
   where id = target_record_id
     and subject_id = auth.uid()
     and available_after <= now()
  returning * into record;

  if record.id is null then
    raise exception 'Record not found.' using errcode = 'no_data_found';
  end if;
  return record;
end;
$$;

revoke all on function public.open_accountability_session(uuid, text, text, uuid[]) from public, anon;
revoke all on function public.close_accountability_session(uuid, text) from public, anon;
revoke all on function public.acknowledge_session_record(uuid, text) from public, anon;
grant execute on function public.open_accountability_session(uuid, text, text, uuid[]) to authenticated;
grant execute on function public.close_accountability_session(uuid, text) to authenticated;
grant execute on function public.acknowledge_session_record(uuid, text) to authenticated;

do $$
declare
  t text;
begin
  foreach t in array array['accountability_sessions', 'session_participants', 'session_accounts', 'session_records'] loop
    execute format('drop trigger if exists %I on public.%I', t || '_audit', t);
    execute format(
      'create trigger %I after insert or update or delete on public.%I
         for each row execute function private.write_audit_log()',
      t || '_audit', t);
    execute format('drop trigger if exists %I on public.%I', t || '_rate_limit', t);
    execute format(
      'create trigger %I before insert on public.%I
         for each row execute function private.enforce_write_rate_limit(%L)',
      t || '_rate_limit', t, 60);
  end loop;
end;
$$;
