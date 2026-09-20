create extension if not exists pgcrypto;

create table if not exists public.families (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 120),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table if not exists public.family_members (
  family_id uuid not null references public.families(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('adult', 'child')),
  display_name text not null check (char_length(trim(display_name)) between 1 and 120),
  created_at timestamptz not null default now(),
  primary key (family_id, user_id)
);

create table if not exists public.chores (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 160),
  assigned_to uuid references auth.users(id) on delete set null,
  points integer not null default 0 check (points >= 0),
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.rewards (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 160),
  points integer not null check (points > 0),
  created_at timestamptz not null default now()
);

create index if not exists family_members_user_id_idx on public.family_members(user_id);
create index if not exists chores_family_id_idx on public.chores(family_id);
create index if not exists chores_assigned_to_idx on public.chores(assigned_to);
create index if not exists rewards_family_id_idx on public.rewards(family_id);

create or replace function public.is_family_member(target_family_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.family_members
    where family_id = target_family_id
      and user_id = auth.uid()
  );
$$;

alter table public.families enable row level security;
alter table public.family_members enable row level security;
alter table public.chores enable row level security;
alter table public.rewards enable row level security;

drop policy if exists families_member_select on public.families;
create policy families_member_select
  on public.families for select
  using (public.is_family_member(id) or created_by = auth.uid());

drop policy if exists families_creator_insert on public.families;
create policy families_creator_insert
  on public.families for insert
  with check (created_by = auth.uid());

drop policy if exists family_members_member_select on public.family_members;
create policy family_members_member_select
  on public.family_members for select
  using (public.is_family_member(family_id) or user_id = auth.uid());

drop policy if exists family_members_adult_write on public.family_members;
create policy family_members_adult_write
  on public.family_members for all
  using (public.is_family_member(family_id))
  with check (public.is_family_member(family_id));

drop policy if exists chores_member_select on public.chores;
create policy chores_member_select
  on public.chores for select
  using (public.is_family_member(family_id));

drop policy if exists chores_member_write on public.chores;
create policy chores_member_write
  on public.chores for all
  using (public.is_family_member(family_id))
  with check (public.is_family_member(family_id));

drop policy if exists rewards_member_select on public.rewards;
create policy rewards_member_select
  on public.rewards for select
  using (public.is_family_member(family_id));

drop policy if exists rewards_member_write on public.rewards;
create policy rewards_member_write
  on public.rewards for all
  using (public.is_family_member(family_id))
  with check (public.is_family_member(family_id));
