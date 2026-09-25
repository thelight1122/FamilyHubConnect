-- Constitution, finance, audit log and rate limits (migration 20260924000500).
begin;
create extension if not exists pgtap with schema extensions;
select plan(28);

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

-- Constitution: adult writes -------------------------------------------------
select pg_temp.act_as('00000000-0000-0000-0000-00000000000a');

select lives_ok(
  $$ insert into public.family_constitution (family_id, mission, updated_by)
     values ('10000000-0000-0000-0000-000000000001', 'We listen first.', '00000000-0000-0000-0000-00000000000a') $$,
  'an adult can set the family mission');
select lives_ok(
  $$ insert into public.constitution_values (family_id, title) values ('10000000-0000-0000-0000-000000000001', 'Honesty') $$,
  'an adult can add a value');
select lives_ok(
  $$ insert into public.constitution_rules (family_id, body) values ('10000000-0000-0000-0000-000000000001', 'Phones away at dinner') $$,
  'an adult can add a rule');

-- Constitution: child --------------------------------------------------------
select pg_temp.act_as('00000000-0000-0000-0000-00000000000b');

select is((select mission from public.family_constitution), 'We listen first.', 'a child can read the mission');
select is_empty($$ update public.family_constitution set mission = 'No rules' returning 1 $$,
  'a child cannot change the mission');
select throws_ok(
  $$ insert into public.constitution_rules (family_id, body) values ('10000000-0000-0000-0000-000000000001', 'No homework') $$,
  '42501', null, 'a child cannot add a rule');
select lives_ok(
  $$ insert into public.constitution_amendments (id, family_id, proposed_by, proposal)
     values ('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001',
             '00000000-0000-0000-0000-00000000000b', 'Later bedtime on Fridays') $$,
  'a child can propose an amendment');
select throws_ok(
  $$ insert into public.constitution_amendments (family_id, proposed_by, proposal, status)
     values ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00000000000b', 'Self-adopted', 'adopted') $$,
  '42501', null, 'a child cannot file an already-adopted amendment');
select throws_ok(
  $$ select public.decide_amendment('40000000-0000-0000-0000-000000000001', true) $$,
  '42501', null, 'a child cannot adopt their own amendment');
select lives_ok(
  $$ insert into public.constitution_signatures (family_id, user_id)
     values ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00000000000b') $$,
  'a child can sign the constitution for themself');
select throws_ok(
  $$ insert into public.constitution_signatures (family_id, user_id)
     values ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00000000000c') $$,
  '42501', null, 'a child cannot sign for someone else');

-- Finance: child -------------------------------------------------------------
select throws_ok(
  $$ insert into public.ledger_entries (family_id, member_id, amount_cents, kind)
     values ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00000000000b', 100000, 'deposit') $$,
  '42501', null, 'a child cannot add money to their own balance');
select lives_ok(
  $$ insert into public.loan_requests (id, family_id, borrower_id, amount_cents, purpose)
     values ('50000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001',
             '00000000-0000-0000-0000-00000000000b', 2500, 'New bike pedals') $$,
  'a child can request a loan for themself');
select throws_ok(
  $$ insert into public.loan_requests (family_id, borrower_id, amount_cents, purpose)
     values ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00000000000c', 2500, 'For Other') $$,
  '42501', null, 'a child cannot request a loan for someone else');
select throws_ok(
  $$ select public.decide_loan('50000000-0000-0000-0000-000000000001', true) $$,
  '42501', null, 'a child cannot approve their own loan');
select lives_ok(
  $$ insert into public.savings_goals (family_id, member_id, title, target_cents)
     values ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00000000000b', 'Bike', 15000) $$,
  'a child can set their own savings goal');
select throws_ok(
  $$ insert into public.loan_requests (family_id, borrower_id, amount_cents, purpose)
     values ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00000000000b', -500, 'Negative') $$,
  '23514', null, 'amounts must be positive');

-- Finance: adult -------------------------------------------------------------
select pg_temp.act_as('00000000-0000-0000-0000-00000000000a');

select lives_ok(
  $$ select public.decide_loan('50000000-0000-0000-0000-000000000001', true) $$,
  'an adult can approve a loan');
select lives_ok(
  $$ insert into public.ledger_entries (family_id, member_id, amount_cents, kind, note)
     values ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00000000000c', 1000, 'allowance', 'Weekly') $$,
  'an adult can pay an allowance');
select throws_ok(
  $$ insert into public.ledger_entries (family_id, member_id, amount_cents, kind)
     values ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00000000000d', 1000, 'allowance') $$,
  '23514', null, 'money cannot be filed to someone outside the family');
select is_empty($$ update public.ledger_entries set amount_cents = 1 returning 1 $$,
  'ledger entries cannot be edited, even by an adult');
select lives_ok(
  $$ select public.decide_amendment('40000000-0000-0000-0000-000000000001', true) $$,
  'an adult can adopt an amendment');

-- What each child sees -------------------------------------------------------
select pg_temp.act_as('00000000-0000-0000-0000-00000000000b');
select is((select balance_cents::int from public.member_balances), 2500,
  'the approved loan reaches the child''s balance');
select is((select count(*)::int from public.ledger_entries), 1,
  'a child sees only their own ledger entries');

select pg_temp.act_as('00000000-0000-0000-0000-00000000000c');
select is((select count(*)::int from public.loan_requests), 0, 'a child cannot see a sibling''s loan requests');

-- Audit log ------------------------------------------------------------------
select is((select count(*)::int from public.audit_log), 0, 'a child cannot read the audit log');

select pg_temp.act_as('00000000-0000-0000-0000-00000000000a');
select ok((select count(*) from public.audit_log where table_name = 'loan_requests') >= 2,
  'loan request and decision are in the audit log');

-- Rate limit -----------------------------------------------------------------
reset role;
insert into public.audit_log (family_id, actor, table_name, operation)
select '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00000000000b', 'savings_goals', 'INSERT'
from generate_series(1, 60);
select pg_temp.act_as('00000000-0000-0000-0000-00000000000b');
select throws_ok(
  $$ insert into public.savings_goals (family_id, member_id, title, target_cents)
     values ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00000000000b', 'Spam', 100) $$,
  '54000', null, 'writes are refused past 60 per minute per table');

select * from finish();
rollback;
