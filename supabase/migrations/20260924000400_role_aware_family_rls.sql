-- Role-aware family access.
--
-- Before this migration any family member (including a child) could insert,
-- update or delete family_members, chores and rewards: the policy named
-- "family_members_adult_write" only checked membership. Migration 0200 also
-- revoked EXECUTE on public.is_family_member from `authenticated`, which the
-- RLS policies themselves need, so policies calling it would fail.
--
-- This migration:
--   * moves the membership helpers into a `private` schema that PostgREST does
--     not expose, so policies can call them without exposing them as RPCs;
--   * limits every write on family_members, chores and rewards to adults;
--   * lets the family creator add exactly one row: themself, as an adult,
--     into a family that has no members yet (the bootstrap step);
--   * keeps at least one adult in every family;
--   * gives children one narrow write: marking a chore assigned to them (or
--     unassigned) complete or not, through public.set_chore_completed.

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create or replace function private.is_family_member(target_family_id uuid)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1
    from public.family_members
    where family_id = target_family_id
      and user_id = auth.uid()
  );
$$;

create or replace function private.is_family_adult(target_family_id uuid)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1
    from public.family_members
    where family_id = target_family_id
      and user_id = auth.uid()
      and role = 'adult'
  );
$$;

create or replace function private.family_has_members(target_family_id uuid)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1 from public.family_members where family_id = target_family_id
  );
$$;

revoke all on function private.is_family_member(uuid) from public;
revoke all on function private.is_family_adult(uuid) from public;
revoke all on function private.family_has_members(uuid) from public;
grant execute on function private.is_family_member(uuid) to authenticated;
grant execute on function private.is_family_adult(uuid) to authenticated;
grant execute on function private.family_has_members(uuid) to authenticated;

-- families -----------------------------------------------------------------
drop policy if exists families_member_select on public.families;
create policy families_member_select
  on public.families for select to authenticated
  using (private.is_family_member(id) or created_by = auth.uid());

drop policy if exists families_creator_insert on public.families;
create policy families_creator_insert
  on public.families for insert to authenticated
  with check (created_by = auth.uid());

drop policy if exists families_adult_update on public.families;
create policy families_adult_update
  on public.families for update to authenticated
  using (private.is_family_adult(id))
  with check (private.is_family_adult(id));

drop policy if exists families_adult_delete on public.families;
create policy families_adult_delete
  on public.families for delete to authenticated
  using (private.is_family_adult(id));

-- family_members -----------------------------------------------------------
drop policy if exists family_members_adult_write on public.family_members;
drop policy if exists family_members_creator_insert on public.family_members;
drop policy if exists family_members_member_select on public.family_members;

create policy family_members_member_select
  on public.family_members for select to authenticated
  using (private.is_family_member(family_id) or user_id = auth.uid());

create policy family_members_adult_insert
  on public.family_members for insert to authenticated
  with check (private.is_family_adult(family_id));

create policy family_members_creator_bootstrap
  on public.family_members for insert to authenticated
  with check (
    user_id = auth.uid()
    and role = 'adult'
    and not private.family_has_members(family_id)
    and exists (
      select 1
      from public.families
      where families.id = family_members.family_id
        and families.created_by = auth.uid()
    )
  );

create policy family_members_adult_update
  on public.family_members for update to authenticated
  using (private.is_family_adult(family_id))
  with check (private.is_family_adult(family_id));

create policy family_members_adult_delete
  on public.family_members for delete to authenticated
  using (private.is_family_adult(family_id));

-- Every family keeps at least one adult. Skipped when the whole family is
-- being deleted (the parent row is already gone during the cascade).
create or replace function private.keep_one_adult()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.role = 'adult'
     and (tg_op = 'DELETE' or new.role <> 'adult' or new.family_id <> old.family_id)
     and exists (select 1 from public.families where id = old.family_id)
     and not exists (
       select 1
       from public.family_members
       where family_id = old.family_id
         and role = 'adult'
         and user_id <> old.user_id
     )
  then
    raise exception 'A family must keep at least one adult member.'
      using errcode = 'check_violation';
  end if;
  return coalesce(new, old);
end;
$$;

drop trigger if exists family_members_keep_one_adult on public.family_members;
create trigger family_members_keep_one_adult
  before update or delete on public.family_members
  for each row execute function private.keep_one_adult();

-- chores -------------------------------------------------------------------
drop policy if exists chores_member_write on public.chores;
drop policy if exists chores_member_select on public.chores;

create policy chores_member_select
  on public.chores for select to authenticated
  using (private.is_family_member(family_id));

create policy chores_adult_write
  on public.chores for all to authenticated
  using (private.is_family_adult(family_id))
  with check (private.is_family_adult(family_id));

-- A chore can only be assigned to a member of its own family.
create or replace function private.check_chore_assignee()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.assigned_to is not null and not exists (
    select 1
    from public.family_members
    where family_id = new.family_id
      and user_id = new.assigned_to
  ) then
    raise exception 'A chore can only be assigned to a member of its family.'
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

drop trigger if exists chores_check_assignee on public.chores;
create trigger chores_check_assignee
  before insert or update of assigned_to, family_id on public.chores
  for each row execute function private.check_chore_assignee();

-- The one write children have: complete (or reopen) a chore that is theirs
-- or unassigned. Adults can do this for any chore in their family.
create or replace function public.set_chore_completed(target_chore_id uuid, completed boolean)
returns public.chores
language plpgsql
security definer
set search_path = ''
as $$
declare
  chore public.chores;
begin
  select * into chore from public.chores where id = target_chore_id;

  if chore.id is null or not private.is_family_member(chore.family_id) then
    raise exception 'Chore not found.' using errcode = 'no_data_found';
  end if;

  if not private.is_family_adult(chore.family_id)
     and chore.assigned_to is not null
     and chore.assigned_to <> auth.uid()
  then
    raise exception 'Only the assigned member or an adult can update this chore.'
      using errcode = 'insufficient_privilege';
  end if;

  update public.chores
     set completed_at = case when completed then now() else null end
   where id = target_chore_id
  returning * into chore;

  return chore;
end;
$$;

revoke all on function public.set_chore_completed(uuid, boolean) from public, anon;
grant execute on function public.set_chore_completed(uuid, boolean) to authenticated;

-- rewards ------------------------------------------------------------------
drop policy if exists rewards_member_write on public.rewards;
drop policy if exists rewards_member_select on public.rewards;

create policy rewards_member_select
  on public.rewards for select to authenticated
  using (private.is_family_member(family_id));

create policy rewards_adult_write
  on public.rewards for all to authenticated
  using (private.is_family_adult(family_id))
  with check (private.is_family_adult(family_id));

-- The old public helper is no longer used by any policy.
drop function if exists public.is_family_member(uuid);
