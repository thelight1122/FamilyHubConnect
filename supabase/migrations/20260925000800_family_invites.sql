-- Family invites.
--
-- An adult creates an invite: a role, a display name, and optionally the one
-- email address allowed to use it. The app shares a link carrying a random
-- 10-character code (32^10 possibilities). Whoever opens the link signs in
-- and accepts; accept_family_invite() checks everything in one place:
--   * the code exists, is unused, unrevoked and not expired (7 days);
--   * the email matches, when the invite names one;
--   * the person is not already in a family (one family per person for now:
--     the app shows only a person's first family);
--   * no more than 10 attempts per person per 10 minutes, so codes cannot
--     be guessed. Attempts are recorded even when they fail.

create table if not exists public.family_invites (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  code text not null unique check (code ~ '^[A-HJ-NP-Z2-9]{10}$'),
  role text not null check (role in ('adult', 'child')),
  display_name text not null check (char_length(trim(display_name)) between 1 and 120),
  email text check (email is null or email ~ '^[^@\s]+@[^@\s]+$'),
  created_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '7 days',
  accepted_by uuid references auth.users(id) on delete set null,
  accepted_at timestamptz,
  revoked_at timestamptz
);

create table if not exists public.invite_attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  succeeded boolean not null,
  created_at timestamptz not null default now()
);

create index if not exists family_invites_family_idx on public.family_invites(family_id, created_at desc);
create index if not exists invite_attempts_user_idx on public.invite_attempts(user_id, created_at desc);

alter table public.family_invites enable row level security;
alter table public.invite_attempts enable row level security;
-- invite_attempts has no policies: only accept_family_invite() touches it.

create policy family_invites_adult_select on public.family_invites
  for select to authenticated using (private.is_family_adult(family_id));
-- Revoking sets revoked_at; nothing else about an invite changes after creation.
create policy family_invites_adult_revoke on public.family_invites
  for update to authenticated
  using (private.is_family_adult(family_id) and accepted_at is null)
  with check (private.is_family_adult(family_id));
revoke update on public.family_invites from authenticated;
grant update (revoked_at) on public.family_invites to authenticated;
-- Creating goes through create_family_invite(), which generates the code.

create or replace function public.create_family_invite(
  target_family_id uuid,
  invite_role text,
  invite_name text,
  invite_email text default null
)
returns public.family_invites
language plpgsql
security definer
set search_path = ''
as $$
declare
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  new_code text;
  invite public.family_invites;
  bytes bytea;
begin
  if not private.is_family_adult(target_family_id) then
    raise exception 'Only an adult can invite people to the family.' using errcode = 'insufficient_privilege';
  end if;

  loop
    bytes := extensions.gen_random_bytes(10);
    new_code := '';
    for i in 0..9 loop
      new_code := new_code || substr(alphabet, (get_byte(bytes, i) % 32) + 1, 1);
    end loop;
    exit when not exists (select 1 from public.family_invites where code = new_code);
  end loop;

  insert into public.family_invites (family_id, code, role, display_name, email, created_by)
  values (
    target_family_id,
    new_code,
    invite_role,
    trim(invite_name),
    nullif(lower(trim(coalesce(invite_email, ''))), ''),
    auth.uid()
  )
  returning * into invite;
  return invite;
end;
$$;

-- Returns {ok, message} rather than raising, so a failed attempt is still
-- recorded (a raised error would roll the attempt back).
create or replace function public.accept_family_invite(invite_code text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller uuid := auth.uid();
  caller_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
  invite public.family_invites;
  recent integer;
  family_name text;
begin
  if caller is null then
    return jsonb_build_object('ok', false, 'message', 'Sign in to accept an invite.');
  end if;

  select count(*) into recent
  from public.invite_attempts
  where user_id = caller and created_at > now() - interval '10 minutes';
  if recent >= 10 then
    return jsonb_build_object('ok', false, 'message', 'Too many attempts. Wait ten minutes and try again.');
  end if;

  select * into invite
  from public.family_invites
  where code = upper(regexp_replace(coalesce(invite_code, ''), '[^A-Za-z0-9]', '', 'g'))
  for update;

  if invite.id is null
     or invite.revoked_at is not null
     or invite.accepted_at is not null
     or invite.expires_at < now()
     or (invite.email is not null and invite.email <> caller_email)
  then
    insert into public.invite_attempts (user_id, succeeded) values (caller, false);
    return jsonb_build_object('ok', false, 'message',
      'This invite code is not valid. It may have expired, been used, or been meant for a different email.');
  end if;

  if exists (select 1 from public.family_members where user_id = caller) then
    insert into public.invite_attempts (user_id, succeeded) values (caller, false);
    return jsonb_build_object('ok', false, 'message',
      'You are already in a family. Belonging to more than one family is not supported yet.');
  end if;

  insert into public.family_members (family_id, user_id, role, display_name)
  values (invite.family_id, caller, invite.role, invite.display_name);

  update public.family_invites
     set accepted_by = caller, accepted_at = now()
   where id = invite.id;

  insert into public.invite_attempts (user_id, succeeded) values (caller, true);

  select name into family_name from public.families where id = invite.family_id;
  return jsonb_build_object(
    'ok', true,
    'family_id', invite.family_id,
    'family_name', family_name,
    'role', invite.role,
    'display_name', invite.display_name
  );
end;
$$;

revoke all on function public.create_family_invite(uuid, text, text, text) from public, anon;
revoke all on function public.accept_family_invite(text) from public, anon;
grant execute on function public.create_family_invite(uuid, text, text, text) to authenticated;
grant execute on function public.accept_family_invite(text) to authenticated;

drop trigger if exists family_invites_audit on public.family_invites;
create trigger family_invites_audit
  after insert or update or delete on public.family_invites
  for each row execute function private.write_audit_log();
drop trigger if exists family_invites_rate_limit on public.family_invites;
create trigger family_invites_rate_limit
  before insert on public.family_invites
  for each row execute function private.enforce_write_rate_limit('30');

-- With invites in place, nobody is added to a family without agreeing to it:
-- people join by creating the family (bootstrap) or accepting an invite.
-- Adults keep update/delete on members (roles, names, removal).
drop policy if exists family_members_adult_insert on public.family_members;
