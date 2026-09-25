-- Accountability foundation (migration 20260924000600).
begin;
create extension if not exists pgtap with schema extensions;
select plan(18);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-00000000000a', 'parent@test.local'),
  ('00000000-0000-0000-0000-00000000000b', 'kid@test.local'),
  ('00000000-0000-0000-0000-00000000000c', 'other@test.local'),
  ('00000000-0000-0000-0000-00000000000d', 'stranger@test.local');

insert into public.families (id, name, created_by)
values ('10000000-0000-0000-0000-000000000001', 'Test Family', '00000000-0000-0000-0000-00000000000a');
insert into public.family_members (family_id, user_id, role, display_name) values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00000000000a', 'adult', 'Parent'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00000000000b', 'child', 'Kid'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00000000000c', 'child', 'Other');

create or replace function pg_temp.act_as(uid uuid) returns void language sql as $$
  select set_config('request.jwt.claims', json_build_object('sub', uid, 'role', 'authenticated')::text, true),
         set_config('role', 'authenticated', true);
$$;

create temp table ids (session_id uuid);
grant all on ids to authenticated;

-- A child can open a question that includes a parent: it applies equally.
select pg_temp.act_as('00000000-0000-0000-0000-00000000000b');

select lives_ok(
  $$ insert into ids select id from public.open_accountability_session(
       '10000000-0000-0000-0000-000000000001', 'accountability', 'The screen-time agreement',
       array['00000000-0000-0000-0000-00000000000a']::uuid[]) $$,
  'any member can open a session, including one with a parent in it');
select is(
  (select count(*)::int from public.session_participants where session_id = (select session_id from ids)), 2,
  'the opener is always a participant');
select throws_ok(
  $$ select public.open_accountability_session('10000000-0000-0000-0000-000000000001', 'accountability', 'x',
       array['00000000-0000-0000-0000-00000000000d']::uuid[]) $$,
  '23514', null, 'participants must be in the family');
select throws_ok(
  $$ select public.open_accountability_session('10000000-0000-0000-0000-000000000001', 'court', 'x', null) $$,
  '23514', null, 'a session goes through one of the two doors');

select lives_ok(
  $$ insert into public.session_accounts (session_id, user_id, body)
     values ((select session_id from ids), '00000000-0000-0000-0000-00000000000b', 'I thought the limit was two hours.') $$,
  'a participant gives their account');
select throws_ok(
  $$ select public.close_accountability_session((select session_id from ids), 'Agreed') $$,
  '23514', null, 'a session cannot close before everyone is heard');

-- Parent has not given an account yet: sees only their own (none).
select pg_temp.act_as('00000000-0000-0000-0000-00000000000a');
select is((select count(*)::int from public.session_accounts), 0,
  'before giving their own account, a participant cannot read the others''');
select throws_ok(
  $$ insert into public.session_accounts (session_id, user_id, body)
     values ((select session_id from ids), '00000000-0000-0000-0000-00000000000b', 'Rewriting the kid') $$,
  '42501', null, 'no one can write another person''s account');
select lives_ok(
  $$ insert into public.session_accounts (session_id, user_id, body)
     values ((select session_id from ids), '00000000-0000-0000-0000-00000000000a', 'I said one hour but never wrote it down.') $$,
  'the parent gives their account the same way');
select is((select count(*)::int from public.session_accounts), 2,
  'once everyone has been heard, participants read every account');
select is_empty(
  $$ update public.session_accounts set body = 'changed' where user_id = '00000000-0000-0000-0000-00000000000a' returning 1 $$,
  'accounts are fixed once everyone has been heard');

-- A family member outside the session sees that it exists, not what was said.
select pg_temp.act_as('00000000-0000-0000-0000-00000000000c');
select is((select count(*)::int from public.accountability_sessions), 1, 'the family can see the session exists');
select is((select count(*)::int from public.session_accounts), 0, 'non-participants cannot read the accounts');
select throws_ok(
  $$ select public.close_accountability_session((select session_id from ids), 'x') $$,
  '42501', null, 'non-participants cannot close the session');

select pg_temp.act_as('00000000-0000-0000-0000-00000000000b');
select lives_ok(
  $$ select public.close_accountability_session((select session_id from ids), 'Write limits on the fridge.') $$,
  'a participant closes the session once all are heard');

-- Session records: written outside the app, shown only to their subject after cooldown.
reset role;
insert into public.session_records (session_id, subject_id, engine, observations, available_after)
select session_id, '00000000-0000-0000-0000-00000000000b'::uuid, 'test-engine', '{"virtues":[]}'::jsonb, now() - interval '1 minute' from ids
union all
select session_id, '00000000-0000-0000-0000-00000000000a'::uuid, 'test-engine', '{"virtues":[]}'::jsonb, now() + interval '2 hours' from ids;

select pg_temp.act_as('00000000-0000-0000-0000-00000000000b');
select is((select count(*)::int from public.session_records), 1,
  'a person sees only their own record');

select pg_temp.act_as('00000000-0000-0000-0000-00000000000a');
select is((select count(*)::int from public.session_records), 0,
  'a parent cannot read the child''s record, and their own waits for the cooldown');
select throws_ok(
  $$ insert into public.session_records (session_id, subject_id, engine, observations)
     values ((select session_id from ids), '00000000-0000-0000-0000-00000000000b', 'parent', '{"virtues":[]}') $$,
  '42501', null, 'records cannot be written from the app');

select * from finish();
rollback;
