-- Role-aware family access (migration 20260924000400).
-- Run with: npx supabase test db
begin;
create extension if not exists pgtap with schema extensions;
select plan(24);

-- Users: parent (adult), kid (child), other (another child), stranger.
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-00000000000a', 'parent@test.local'),
  ('00000000-0000-0000-0000-00000000000b', 'kid@test.local'),
  ('00000000-0000-0000-0000-00000000000c', 'other@test.local'),
  ('00000000-0000-0000-0000-00000000000d', 'stranger@test.local');

create or replace function pg_temp.act_as(uid uuid) returns void language sql as $$
  select set_config('request.jwt.claims', json_build_object('sub', uid, 'role', 'authenticated')::text, true),
         set_config('role', 'authenticated', true);
$$;

-- Bootstrap: parent creates a family and joins as its first adult ----------
select pg_temp.act_as('00000000-0000-0000-0000-00000000000a');

select lives_ok(
  $$ insert into public.families (id, name, created_by)
     values ('10000000-0000-0000-0000-000000000001', 'Test Family', '00000000-0000-0000-0000-00000000000a') $$,
  'a signed-in user can create a family');

select throws_ok(
  $$ insert into public.family_members (family_id, user_id, role, display_name)
     values ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00000000000a', 'child', 'Parent') $$,
  '42501', null,
  'the creator cannot join their new family as a child');

select lives_ok(
  $$ insert into public.family_members (family_id, user_id, role, display_name)
     values ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00000000000a', 'adult', 'Parent') $$,
  'the creator joins as the first adult');

select lives_ok(
  $$ insert into public.family_members (family_id, user_id, role, display_name) values
     ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00000000000b', 'child', 'Kid'),
     ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00000000000c', 'child', 'Other') $$,
  'an adult can add children');

select lives_ok(
  $$ insert into public.chores (id, family_id, title, points, assigned_to) values
     ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Kid chore', 5, '00000000-0000-0000-0000-00000000000b'),
     ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Other chore', 5, '00000000-0000-0000-0000-00000000000c'),
     ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'Anyone chore', 5, null) $$,
  'an adult can add chores');

select throws_ok(
  $$ insert into public.chores (family_id, title, assigned_to)
     values ('10000000-0000-0000-0000-000000000001', 'Bad', '00000000-0000-0000-0000-00000000000d') $$,
  '23514', null,
  'a chore cannot be assigned to someone outside the family');

select lives_ok(
  $$ insert into public.rewards (id, family_id, title, points)
     values ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Movie night', 20) $$,
  'an adult can add rewards');

select throws_ok(
  $$ delete from public.family_members
     where user_id = '00000000-0000-0000-0000-00000000000a' $$,
  '23514', null,
  'the last adult cannot be removed');

select throws_ok(
  $$ update public.family_members set role = 'child'
     where user_id = '00000000-0000-0000-0000-00000000000a' $$,
  '23514', null,
  'the last adult cannot be demoted');

-- Child: can read, cannot change membership, chores or rewards ------------
select pg_temp.act_as('00000000-0000-0000-0000-00000000000b');

select is((select count(*)::int from public.family_members), 3, 'a child can see the family members');
select is((select count(*)::int from public.chores), 3, 'a child can see the chores');

select is_empty(
  $$ update public.family_members set role = 'adult'
     where user_id = '00000000-0000-0000-0000-00000000000b' returning 1 $$,
  'a child cannot promote themself to adult');

select throws_ok(
  $$ insert into public.family_members (family_id, user_id, role, display_name)
     values ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00000000000d', 'adult', 'Stranger') $$,
  '42501', null,
  'a child cannot add someone to the family');

select is_empty(
  $$ delete from public.family_members
     where user_id = '00000000-0000-0000-0000-00000000000a' returning 1 $$,
  'a child cannot remove a parent');

select is_empty(
  $$ update public.chores set points = 999 returning 1 $$,
  'a child cannot change chore points');

select throws_ok(
  $$ insert into public.chores (family_id, title, points)
     values ('10000000-0000-0000-0000-000000000001', 'Free points', 999) $$,
  '42501', null,
  'a child cannot add chores');

select is_empty(
  $$ delete from public.rewards returning 1 $$,
  'a child cannot delete rewards');

select lives_ok(
  $$ select public.set_chore_completed('20000000-0000-0000-0000-000000000001', true) $$,
  'a child can complete their own chore');

select lives_ok(
  $$ select public.set_chore_completed('20000000-0000-0000-0000-000000000003', true) $$,
  'a child can complete an unassigned chore');

select throws_ok(
  $$ select public.set_chore_completed('20000000-0000-0000-0000-000000000002', true) $$,
  '42501', null,
  'a child cannot complete another child''s chore');

-- Stranger: sees nothing, can do nothing ----------------------------------
select pg_temp.act_as('00000000-0000-0000-0000-00000000000d');

select is((select count(*)::int from public.chores), 0, 'a non-member sees no chores');

select throws_ok(
  $$ select public.set_chore_completed('20000000-0000-0000-0000-000000000003', false) $$,
  'P0002', null,
  'a non-member cannot complete a chore');

-- Checks as the owner, outside RLS ------------------------------------------
reset role;

select is(
  (select count(*)::int from public.chores where completed_at is not null),
  2, 'exactly the two permitted completions were saved');

select is(
  (select role from public.family_members where user_id = '00000000-0000-0000-0000-00000000000b'),
  'child', 'the child is still a child');

select * from finish();
rollback;
