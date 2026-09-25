-- Health, pets, timeline, sports, creator studio, maintenance and media
-- storage (migration 20260925000700).
begin;
create extension if not exists pgtap with schema extensions;
select plan(38);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-00000000000a', 'parent@test.local'),
  ('00000000-0000-0000-0000-00000000000e', 'coparent@test.local'),
  ('00000000-0000-0000-0000-00000000000b', 'kid@test.local'),
  ('00000000-0000-0000-0000-00000000000c', 'other@test.local'),
  ('00000000-0000-0000-0000-00000000000d', 'stranger@test.local');

insert into public.families (id, name, created_by)
values ('10000000-0000-0000-0000-000000000001', 'Test Family', '00000000-0000-0000-0000-00000000000a');
insert into public.family_members (family_id, user_id, role, display_name) values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00000000000a', 'adult', 'Parent'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00000000000e', 'adult', 'Co-parent'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00000000000b', 'child', 'Kid'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00000000000c', 'child', 'Other');

create or replace function pg_temp.act_as(uid uuid) returns void language sql as $$
  select set_config('request.jwt.claims', json_build_object('sub', uid, 'role', 'authenticated')::text, true),
         set_config('role', 'authenticated', true);
$$;

-- Health ------------------------------------------------------------------------
select pg_temp.act_as('00000000-0000-0000-0000-00000000000b');
select lives_ok(
  $$ insert into public.health_logs (family_id, member_id, kind, note)
     values ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00000000000b', 'Illness', 'Sore throat') $$,
  'a child logs their own health event');
select throws_ok(
  $$ insert into public.health_logs (family_id, member_id, kind)
     values ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00000000000c', 'Injury') $$,
  '42501', null, 'a child cannot log for a sibling');

select pg_temp.act_as('00000000-0000-0000-0000-00000000000a');
select lives_ok(
  $$ insert into public.health_logs (family_id, member_id, kind, note)
     values ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00000000000a', 'Doctor Visit', 'Checkup') $$,
  'an adult logs their own health event');
select lives_ok(
  $$ insert into public.medications (family_id, member_id, name, dose)
     values ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00000000000c', 'Inhaler', '2 puffs') $$,
  'an adult records a child''s medication');
select is((select count(*)::int from public.health_logs), 2, 'an adult sees their own and the children''s health logs');

select pg_temp.act_as('00000000-0000-0000-0000-00000000000e');
select is((select count(*)::int from public.health_logs), 1, 'a co-parent sees the child''s log but not the other adult''s');
select throws_ok(
  $$ insert into public.health_logs (family_id, member_id, kind)
     values ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00000000000a', 'Other') $$,
  '42501', null, 'an adult cannot log health data for another adult');

select pg_temp.act_as('00000000-0000-0000-0000-00000000000c');
select is((select count(*)::int from public.health_logs), 0, 'a child cannot see a sibling''s health log');
select is((select count(*)::int from public.medications), 1, 'a child sees their own medication');

-- Pets --------------------------------------------------------------------------
select pg_temp.act_as('00000000-0000-0000-0000-00000000000a');
select lives_ok(
  $$ insert into public.pets (id, family_id, name, species)
     values ('60000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Rex', 'Dog') $$,
  'an adult adds a pet');

select pg_temp.act_as('00000000-0000-0000-0000-00000000000b');
select throws_ok(
  $$ insert into public.pets (family_id, name) values ('10000000-0000-0000-0000-000000000001', 'Dragon') $$,
  '42501', null, 'a child cannot add a pet');
select lives_ok(
  $$ insert into public.pet_walks (pet_id, family_id, minutes)
     values ('60000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 20) $$,
  'a child logs a walk they took');
select throws_ok(
  $$ insert into public.pet_walks (pet_id, family_id, minutes, walked_by)
     values ('60000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 20,
             '00000000-0000-0000-0000-00000000000c') $$,
  '42501', null, 'a child cannot log a walk as someone else');
select throws_ok(
  $$ insert into public.vet_appointments (pet_id, family_id, scheduled_at, reason)
     values ('60000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', now(), 'Shots') $$,
  '42501', null, 'a child cannot book a vet appointment');

-- Timeline ------------------------------------------------------------------------
select lives_ok(
  $$ insert into public.timeline_entries (family_id, kind, body, visibility)
     values ('10000000-0000-0000-0000-000000000001', 'journal', 'Today was hard.', 'private') $$,
  'a child writes a private journal entry');
select lives_ok(
  $$ insert into public.timeline_entries (family_id, kind, title)
     values ('10000000-0000-0000-0000-000000000001', 'achievement', 'Learned to swim') $$,
  'a child shares an achievement');

select pg_temp.act_as('00000000-0000-0000-0000-00000000000a');
select is((select count(*)::int from public.timeline_entries), 1, 'a parent sees shared entries but not a child''s private journal');
select is_empty($$ delete from public.timeline_entries where visibility = 'private' returning 1 $$,
  'a parent cannot delete a private entry');

-- Sports ---------------------------------------------------------------------------
select lives_ok(
  $$ insert into public.teams (id, family_id, name) values ('70000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Tigers') $$,
  'an adult adds a team');
select lives_ok(
  $$ insert into public.team_checklist (id, team_id, family_id, label, critical)
     values ('71000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Shin guards', true) $$,
  'an adult adds a checklist item');

select pg_temp.act_as('00000000-0000-0000-0000-00000000000b');
select throws_ok(
  $$ insert into public.teams (family_id, name) values ('10000000-0000-0000-0000-000000000001', 'My Team') $$,
  '42501', null, 'a child cannot add a team');
select lives_ok(
  $$ update public.team_checklist set packed = true where id = '71000000-0000-0000-0000-000000000001' $$,
  'a child ticks an item packed');
select throws_ok(
  $$ update public.team_checklist set label = 'Nothing' where id = '71000000-0000-0000-0000-000000000001' $$,
  '42501', null, 'a child cannot rename a checklist item');
select lives_ok(
  $$ insert into public.team_messages (team_id, family_id, body)
     values ('70000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Ready!') $$,
  'a child posts to the team chat');
select throws_ok(
  $$ insert into public.team_messages (team_id, family_id, body, author_id)
     values ('70000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Fake', '00000000-0000-0000-0000-00000000000a') $$,
  '42501', null, 'a child cannot post as a parent');

-- Creator studio ----------------------------------------------------------------------
select pg_temp.act_as('00000000-0000-0000-0000-00000000000a');
select lives_ok(
  $$ insert into public.creator_posts (id, family_id, kind, caption)
     values ('80000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'poll', 'Pizza or tacos?') $$,
  'an adult creates a poll');
select lives_ok(
  $$ insert into public.poll_options (id, post_id, family_id, label, position) values
     ('81000000-0000-0000-0000-000000000001', '80000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Pizza', 0),
     ('81000000-0000-0000-0000-000000000002', '80000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Tacos', 1) $$,
  'the poll author adds options');
select throws_ok(
  $$ insert into public.creator_posts (family_id, kind, caption) values ('10000000-0000-0000-0000-000000000001', 'photo', 'No photo') $$,
  '23514', null, 'a photo post needs a photo');

select pg_temp.act_as('00000000-0000-0000-0000-00000000000b');
select throws_ok(
  $$ insert into public.poll_options (post_id, family_id, label)
     values ('80000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Ice cream') $$,
  '42501', null, 'only the poll author adds options');
select lives_ok(
  $$ insert into public.poll_votes (post_id, option_id, family_id)
     values ('80000000-0000-0000-0000-000000000001', '81000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001') $$,
  'a child votes');
select throws_ok(
  $$ insert into public.poll_votes (post_id, option_id, family_id)
     values ('80000000-0000-0000-0000-000000000001', '81000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001') $$,
  '23505', null, 'one vote per person per poll');

-- Maintenance -------------------------------------------------------------------------
select pg_temp.act_as('00000000-0000-0000-0000-00000000000a');
select lives_ok(
  $$ insert into public.maintenance_items (family_id, section, title, due_on)
     values ('10000000-0000-0000-0000-000000000001', 'vehicles', 'Oil change', current_date + 7) $$,
  'an adult adds a maintenance item');
select pg_temp.act_as('00000000-0000-0000-0000-00000000000b');
select is((select count(*)::int from public.maintenance_items), 0, 'maintenance is adults-only');

-- Media storage -------------------------------------------------------------------------
select lives_ok(
  $$ insert into storage.objects (bucket_id, name, owner_id)
     values ('family-media', '10000000-0000-0000-0000-000000000001/kid-photo.jpg', '00000000-0000-0000-0000-00000000000b') $$,
  'a member uploads into their family''s folder');
select throws_ok(
  $$ insert into storage.objects (bucket_id, name, owner_id)
     values ('family-media', '99999999-0000-0000-0000-000000000009/elsewhere.jpg', '00000000-0000-0000-0000-00000000000b') $$,
  '42501', null, 'no one uploads into another family''s folder');

select pg_temp.act_as('00000000-0000-0000-0000-00000000000d');
select is((select count(*)::int from storage.objects where bucket_id = 'family-media'), 0, 'a non-member sees none of the family''s media');
select is((select count(*)::int from public.teams), 0, 'a non-member sees no teams');

select pg_temp.act_as('00000000-0000-0000-0000-00000000000a');
select is((select count(*)::int from storage.objects where bucket_id = 'family-media'), 1, 'family members see the family''s media');

select * from finish();
rollback;
