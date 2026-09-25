-- Family invites (migration 20260925000800).
begin;
create extension if not exists pgtap with schema extensions;
select plan(20);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-00000000000a', 'parent@test.local'),
  ('00000000-0000-0000-0000-00000000000b', 'kid@test.local'),
  ('00000000-0000-0000-0000-00000000000c', 'alex@test.local'),
  ('00000000-0000-0000-0000-00000000000d', 'stranger@test.local'),
  ('00000000-0000-0000-0000-00000000000f', 'guesser@test.local');

insert into public.families (id, name, created_by)
values ('10000000-0000-0000-0000-000000000001', 'Test Family', '00000000-0000-0000-0000-00000000000a');
insert into public.family_members (family_id, user_id, role, display_name) values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00000000000a', 'adult', 'Parent');

create or replace function pg_temp.act_as(uid uuid, email text) returns void language sql as $$
  select set_config('request.jwt.claims', json_build_object('sub', uid, 'role', 'authenticated', 'email', email)::text, true),
         set_config('role', 'authenticated', true);
$$;

create temp table codes (label text primary key, code text);
grant all on codes to authenticated;

-- Creating ---------------------------------------------------------------------
select pg_temp.act_as('00000000-0000-0000-0000-00000000000a', 'parent@test.local');

select lives_ok(
  $$ insert into codes select 'kid', code from public.create_family_invite('10000000-0000-0000-0000-000000000001', 'child', 'Kid') $$,
  'an adult creates an invite');
select matches((select code from codes where label = 'kid'), '^[A-HJ-NP-Z2-9]{10}$', 'codes are 10 unambiguous characters');
select lives_ok(
  $$ insert into codes select 'alex', code from public.create_family_invite('10000000-0000-0000-0000-000000000001', 'adult', 'Alex', 'Alex@Test.local') $$,
  'an adult creates an invite locked to one email');
select lives_ok(
  $$ insert into codes select 'revoked', code from public.create_family_invite('10000000-0000-0000-0000-000000000001', 'child', 'Later') $$,
  'a third invite, to revoke');
select lives_ok(
  $$ update public.family_invites set revoked_at = now() where code = (select code from codes where label = 'revoked') $$,
  'an adult revokes an invite');
select throws_ok(
  $$ update public.family_invites set role = 'adult' where code = (select code from codes where label = 'kid') $$,
  '42501', null, 'an invite''s role cannot be changed after creation');
select throws_ok(
  $$ insert into public.family_members (family_id, user_id, role, display_name)
     values ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00000000000d', 'adult', 'Added') $$,
  '42501', null, 'an adult cannot add someone without an invite');

-- Accepting ------------------------------------------------------------------------
select pg_temp.act_as('00000000-0000-0000-0000-00000000000b', 'kid@test.local');

select is((select count(*)::int from public.family_invites), 0, 'people outside the family cannot list its invites');
select throws_ok(
  $$ select public.create_family_invite('10000000-0000-0000-0000-000000000001', 'adult', 'Me') $$,
  '42501', null, 'a non-member cannot create invites');
select is(
  (select public.accept_family_invite((select code from codes where label = 'alex')) ->> 'ok'), 'false',
  'an email-locked invite refuses a different email');
select is(
  (select public.accept_family_invite((select code from codes where label = 'revoked')) ->> 'ok'), 'false',
  'a revoked invite is refused');
select is(
  (select public.accept_family_invite(lower((select code from codes where label = 'kid'))) ->> 'role'), 'child',
  'the invited child joins (codes are case-insensitive)');
select is(
  (select role from public.family_members where user_id = '00000000-0000-0000-0000-00000000000b'), 'child',
  'the child joins with the role the adult chose');

select pg_temp.act_as('00000000-0000-0000-0000-00000000000d', 'stranger@test.local');
select is(
  (select public.accept_family_invite((select code from codes where label = 'kid')) ->> 'ok'), 'false',
  'a used invite cannot be used again');

select pg_temp.act_as('00000000-0000-0000-0000-00000000000c', 'alex@test.local');
select is(
  (select public.accept_family_invite((select code from codes where label = 'alex')) ->> 'role'), 'adult',
  'the named email accepts its invite (email match ignores case)');

-- One family per person.
select pg_temp.act_as('00000000-0000-0000-0000-00000000000a', 'parent@test.local');
insert into codes select 'second', code from public.create_family_invite('10000000-0000-0000-0000-000000000001', 'child', 'Twice');
select pg_temp.act_as('00000000-0000-0000-0000-00000000000b', 'kid@test.local');
select alike(
  (select public.accept_family_invite((select code from codes where label = 'second')) ->> 'message'), '%already in a family%',
  'someone already in a family cannot join another');

-- Expired.
reset role;
update public.family_invites set expires_at = now() - interval '1 minute' where code = (select code from codes where label = 'second');
select pg_temp.act_as('00000000-0000-0000-0000-00000000000d', 'stranger@test.local');
select is(
  (select public.accept_family_invite((select code from codes where label = 'second')) ->> 'ok'), 'false',
  'an expired invite is refused');

-- Guessing -------------------------------------------------------------------------------
select pg_temp.act_as('00000000-0000-0000-0000-00000000000f', 'guesser@test.local');
select is(
  (select count(*)::int from generate_series(1, 10) g where (public.accept_family_invite('AAAAAAAAA' || g) ->> 'ok') = 'false'),
  10, 'ten wrong guesses are each refused');
select alike(
  (select public.accept_family_invite('BBBBBBBBBB') ->> 'message'), 'Too many attempts%',
  'the eleventh attempt in ten minutes is blocked');
select is(
  (select count(*)::int from public.invite_attempts), 0,
  'attempt records are not readable from the app');

select * from finish();
rollback;
