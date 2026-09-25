-- Constitution and finance data, plus the server-side safeguards every family
-- table shares: an audit log, per-user write rate limits and input checks.
--
-- Access model (same as 0400): members read their family's data, adults
-- write it. The exceptions are deliberate and narrow:
--   * any member may propose a constitution amendment and sign the
--     constitution for themself;
--   * any member may request a loan for themself and keep savings goals for
--     themself;
--   * money only moves through ledger rows adults write (directly or by
--     approving a loan), so a balance is always the sum of its history.

-- Audit log ------------------------------------------------------------------
-- Records who changed what and when. Row content is deliberately not copied
-- here: the log answers "what happened" without becoming a second store of
-- family conversations.
create table if not exists public.audit_log (
  id bigint generated always as identity primary key,
  family_id uuid,
  actor uuid,
  table_name text not null,
  operation text not null check (operation in ('INSERT', 'UPDATE', 'DELETE')),
  row_id text,
  created_at timestamptz not null default now()
);

create index if not exists audit_log_family_created_idx on public.audit_log(family_id, created_at desc);
create index if not exists audit_log_actor_table_created_idx on public.audit_log(actor, table_name, created_at desc);

alter table public.audit_log enable row level security;

drop policy if exists audit_log_adult_select on public.audit_log;
create policy audit_log_adult_select
  on public.audit_log for select to authenticated
  using (family_id is not null and private.is_family_adult(family_id));
-- No insert/update/delete policies: only the trigger below writes, and the
-- log cannot be edited from the app.

create or replace function private.write_audit_log()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  rec jsonb := to_jsonb(coalesce(new, old));
begin
  insert into public.audit_log (family_id, actor, table_name, operation, row_id)
  values (
    coalesce((rec ->> 'family_id')::uuid, case when tg_table_name = 'families' then (rec ->> 'id')::uuid end),
    auth.uid(),
    tg_table_name,
    tg_op,
    coalesce(rec ->> 'id', rec ->> 'user_id')
  );
  return null;
end;
$$;

-- Rate limit -----------------------------------------------------------------
-- Caps how many writes one user makes to one table per minute. Counts come
-- from the audit log, so the limit and the record share one source.
create or replace function private.enforce_write_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  max_per_minute integer := coalesce(tg_argv[0]::integer, 60);
  recent integer;
begin
  if auth.uid() is null then
    return coalesce(new, old); -- service role and migrations are not limited
  end if;

  select count(*) into recent
  from public.audit_log
  where actor = auth.uid()
    and table_name = tg_table_name
    and created_at > now() - interval '1 minute';

  if recent >= max_per_minute then
    raise exception 'Too many changes in a short time. Please wait a minute and try again.'
      using errcode = '54000';
  end if;

  return coalesce(new, old);
end;
$$;

-- Constitution -----------------------------------------------------------------
create table if not exists public.family_constitution (
  family_id uuid primary key references public.families(id) on delete cascade,
  mission text not null default '' check (char_length(mission) <= 2000),
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table if not exists public.constitution_values (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 80),
  description text not null default '' check (char_length(description) <= 500),
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.constitution_rules (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  body text not null check (char_length(trim(body)) between 1 and 300),
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.constitution_amendments (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  proposed_by uuid not null references auth.users(id) on delete cascade,
  proposal text not null check (char_length(trim(proposal)) between 1 and 1000),
  rationale text not null default '' check (char_length(rationale) <= 1000),
  status text not null default 'proposed' check (status in ('proposed', 'adopted', 'declined', 'withdrawn')),
  decided_by uuid references auth.users(id) on delete set null,
  decided_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.constitution_signatures (
  family_id uuid not null references public.families(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  signed_at timestamptz not null default now(),
  primary key (family_id, user_id)
);

create index if not exists constitution_values_family_idx on public.constitution_values(family_id, position);
create index if not exists constitution_rules_family_idx on public.constitution_rules(family_id, position);
create index if not exists constitution_amendments_family_idx on public.constitution_amendments(family_id, created_at desc);

alter table public.family_constitution enable row level security;
alter table public.constitution_values enable row level security;
alter table public.constitution_rules enable row level security;
alter table public.constitution_amendments enable row level security;
alter table public.constitution_signatures enable row level security;

create policy family_constitution_member_select on public.family_constitution
  for select to authenticated using (private.is_family_member(family_id));
create policy family_constitution_adult_write on public.family_constitution
  for all to authenticated
  using (private.is_family_adult(family_id))
  with check (private.is_family_adult(family_id) and updated_by = auth.uid());

create policy constitution_values_member_select on public.constitution_values
  for select to authenticated using (private.is_family_member(family_id));
create policy constitution_values_adult_write on public.constitution_values
  for all to authenticated
  using (private.is_family_adult(family_id))
  with check (private.is_family_adult(family_id));

create policy constitution_rules_member_select on public.constitution_rules
  for select to authenticated using (private.is_family_member(family_id));
create policy constitution_rules_adult_write on public.constitution_rules
  for all to authenticated
  using (private.is_family_adult(family_id))
  with check (private.is_family_adult(family_id));

create policy constitution_amendments_member_select on public.constitution_amendments
  for select to authenticated using (private.is_family_member(family_id));
create policy constitution_amendments_member_propose on public.constitution_amendments
  for insert to authenticated
  with check (
    private.is_family_member(family_id)
    and proposed_by = auth.uid()
    and status = 'proposed'
    and decided_by is null
    and decided_at is null
  );
-- Deciding (adopt/decline) and withdrawing go through
-- public.decide_amendment / public.withdraw_amendment below.

create policy constitution_signatures_member_select on public.constitution_signatures
  for select to authenticated using (private.is_family_member(family_id));
create policy constitution_signatures_self_sign on public.constitution_signatures
  for insert to authenticated
  with check (private.is_family_member(family_id) and user_id = auth.uid());
create policy constitution_signatures_self_unsign on public.constitution_signatures
  for delete to authenticated
  using (user_id = auth.uid());

create or replace function public.decide_amendment(target_amendment_id uuid, adopt boolean)
returns public.constitution_amendments
language plpgsql
security definer
set search_path = ''
as $$
declare
  amendment public.constitution_amendments;
begin
  select * into amendment from public.constitution_amendments where id = target_amendment_id;
  if amendment.id is null or not private.is_family_member(amendment.family_id) then
    raise exception 'Amendment not found.' using errcode = 'no_data_found';
  end if;
  if not private.is_family_adult(amendment.family_id) then
    raise exception 'Only an adult can adopt or decline an amendment.' using errcode = 'insufficient_privilege';
  end if;
  if amendment.status <> 'proposed' then
    raise exception 'This amendment has already been decided.' using errcode = 'check_violation';
  end if;

  update public.constitution_amendments
     set status = case when adopt then 'adopted' else 'declined' end,
         decided_by = auth.uid(),
         decided_at = now()
   where id = target_amendment_id
  returning * into amendment;
  return amendment;
end;
$$;

create or replace function public.withdraw_amendment(target_amendment_id uuid)
returns public.constitution_amendments
language plpgsql
security definer
set search_path = ''
as $$
declare
  amendment public.constitution_amendments;
begin
  update public.constitution_amendments
     set status = 'withdrawn'
   where id = target_amendment_id
     and proposed_by = auth.uid()
     and status = 'proposed'
  returning * into amendment;
  if amendment.id is null then
    raise exception 'Only an open amendment you proposed can be withdrawn.' using errcode = 'insufficient_privilege';
  end if;
  return amendment;
end;
$$;

-- Finance ----------------------------------------------------------------------
-- Amounts are whole cents. A single entry is capped at $10,000.
create table if not exists public.ledger_entries (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  member_id uuid not null references auth.users(id) on delete cascade,
  amount_cents integer not null check (amount_cents <> 0 and abs(amount_cents) <= 1000000),
  kind text not null check (kind in ('allowance', 'deposit', 'withdrawal', 'reward', 'loan_disbursement', 'loan_repayment', 'adjustment')),
  note text not null default '' check (char_length(note) <= 200),
  loan_id uuid,
  created_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now()
);

create table if not exists public.savings_goals (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  member_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 80),
  target_cents integer not null check (target_cents > 0 and target_cents <= 10000000),
  created_at timestamptz not null default now()
);

create table if not exists public.loan_requests (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  borrower_id uuid not null references auth.users(id) on delete cascade,
  amount_cents integer not null check (amount_cents > 0 and amount_cents <= 1000000),
  purpose text not null check (char_length(trim(purpose)) between 1 and 500),
  status text not null default 'pending' check (status in ('pending', 'approved', 'declined', 'withdrawn')),
  decided_by uuid references auth.users(id) on delete set null,
  decided_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.ledger_entries
  drop constraint if exists ledger_entries_loan_id_fkey,
  add constraint ledger_entries_loan_id_fkey foreign key (loan_id) references public.loan_requests(id) on delete set null;

create index if not exists ledger_entries_family_member_idx on public.ledger_entries(family_id, member_id, created_at desc);
create index if not exists savings_goals_family_member_idx on public.savings_goals(family_id, member_id);
create index if not exists loan_requests_family_status_idx on public.loan_requests(family_id, status, created_at desc);

alter table public.ledger_entries enable row level security;
alter table public.savings_goals enable row level security;
alter table public.loan_requests enable row level security;

-- Members see their own money; adults see the whole family's.
create policy ledger_entries_select on public.ledger_entries
  for select to authenticated
  using (member_id = auth.uid() and private.is_family_member(family_id) or private.is_family_adult(family_id));
create policy ledger_entries_adult_insert on public.ledger_entries
  for insert to authenticated
  with check (private.is_family_adult(family_id) and created_by = auth.uid());
-- No update/delete: corrections are new 'adjustment' entries, so history stays whole.

create policy savings_goals_select on public.savings_goals
  for select to authenticated
  using (member_id = auth.uid() and private.is_family_member(family_id) or private.is_family_adult(family_id));
create policy savings_goals_write on public.savings_goals
  for all to authenticated
  using (member_id = auth.uid() and private.is_family_member(family_id) or private.is_family_adult(family_id))
  with check (member_id = auth.uid() and private.is_family_member(family_id) or private.is_family_adult(family_id));

create policy loan_requests_select on public.loan_requests
  for select to authenticated
  using (borrower_id = auth.uid() and private.is_family_member(family_id) or private.is_family_adult(family_id));
create policy loan_requests_self_request on public.loan_requests
  for insert to authenticated
  with check (
    borrower_id = auth.uid()
    and private.is_family_member(family_id)
    and status = 'pending'
    and decided_by is null
    and decided_at is null
  );
-- Approve/decline/withdraw go through the functions below.

-- Ledger and goal owners must belong to the family the row is filed under.
create or replace function private.check_member_in_family()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  subject uuid := (to_jsonb(new) ->> tg_argv[0])::uuid;
begin
  if not exists (
    select 1 from public.family_members where family_id = new.family_id and user_id = subject
  ) then
    raise exception 'That person is not a member of this family.' using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

create trigger ledger_entries_member_in_family
  before insert on public.ledger_entries
  for each row execute function private.check_member_in_family('member_id');
create trigger savings_goals_member_in_family
  before insert or update on public.savings_goals
  for each row execute function private.check_member_in_family('member_id');

create or replace view public.member_balances
with (security_invoker = true) as
  select family_id, member_id, sum(amount_cents)::bigint as balance_cents
  from public.ledger_entries
  group by family_id, member_id;

grant select on public.member_balances to authenticated;

create or replace function public.decide_loan(target_loan_id uuid, approve boolean)
returns public.loan_requests
language plpgsql
security definer
set search_path = ''
as $$
declare
  loan public.loan_requests;
begin
  select * into loan from public.loan_requests where id = target_loan_id;
  if loan.id is null or not private.is_family_member(loan.family_id) then
    raise exception 'Loan request not found.' using errcode = 'no_data_found';
  end if;
  if not private.is_family_adult(loan.family_id) then
    raise exception 'Only an adult can approve or decline a loan.' using errcode = 'insufficient_privilege';
  end if;
  if loan.status <> 'pending' then
    raise exception 'This loan request has already been decided.' using errcode = 'check_violation';
  end if;

  update public.loan_requests
     set status = case when approve then 'approved' else 'declined' end,
         decided_by = auth.uid(),
         decided_at = now()
   where id = target_loan_id
  returning * into loan;

  if approve then
    insert into public.ledger_entries (family_id, member_id, amount_cents, kind, note, loan_id, created_by)
    values (loan.family_id, loan.borrower_id, loan.amount_cents, 'loan_disbursement', left(loan.purpose, 200), loan.id, auth.uid());
  end if;

  return loan;
end;
$$;

create or replace function public.withdraw_loan(target_loan_id uuid)
returns public.loan_requests
language plpgsql
security definer
set search_path = ''
as $$
declare
  loan public.loan_requests;
begin
  update public.loan_requests
     set status = 'withdrawn'
   where id = target_loan_id
     and borrower_id = auth.uid()
     and status = 'pending'
  returning * into loan;
  if loan.id is null then
    raise exception 'Only a pending request you made can be withdrawn.' using errcode = 'insufficient_privilege';
  end if;
  return loan;
end;
$$;

-- Function grants -------------------------------------------------------------
revoke all on function public.decide_amendment(uuid, boolean) from public, anon;
revoke all on function public.withdraw_amendment(uuid) from public, anon;
revoke all on function public.decide_loan(uuid, boolean) from public, anon;
revoke all on function public.withdraw_loan(uuid) from public, anon;
grant execute on function public.decide_amendment(uuid, boolean) to authenticated;
grant execute on function public.withdraw_amendment(uuid) to authenticated;
grant execute on function public.decide_loan(uuid, boolean) to authenticated;
grant execute on function public.withdraw_loan(uuid) to authenticated;

-- Audit + rate-limit triggers on every family table --------------------------
do $$
declare
  t text;
begin
  foreach t in array array[
    'families', 'family_members', 'chores', 'rewards',
    'family_constitution', 'constitution_values', 'constitution_rules',
    'constitution_amendments', 'constitution_signatures',
    'ledger_entries', 'savings_goals', 'loan_requests'
  ] loop
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
