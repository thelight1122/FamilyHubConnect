-- The remaining family modules: health, pets, timeline, sports, creator
-- studio and household maintenance, plus private media storage.
--
-- Same model as 0400-0600: members read their family's data, adults manage
-- it, and members get narrow writes for their own things (their own health
-- log, a walk they took, a message they sent, a vote they cast). Two
-- deliberate privacy choices:
--   * Health: each person sees their own logs; adults also see the
--     children's. Adults do not see each other's.
--   * Timeline: an entry marked private is visible only to its author.
-- Governance needs no tables: it reads accountability sessions, members and
-- the constitution.

-- Helpers ----------------------------------------------------------------------
create or replace function private.member_role(target_family_id uuid, target_user_id uuid)
returns text
language sql
security definer
set search_path = ''
stable
as $$
  select role from public.family_members
  where family_id = target_family_id and user_id = target_user_id;
$$;

revoke all on function private.member_role(uuid, uuid) from public;
grant execute on function private.member_role(uuid, uuid) to authenticated;

-- Health ------------------------------------------------------------------------
create table if not exists public.health_logs (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  member_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('Illness', 'Injury', 'Doctor Visit', 'Medication Change', 'Other')),
  note text not null default '' check (char_length(note) <= 1000),
  logged_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null default auth.uid()
);

create table if not exists public.medications (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  member_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 120),
  dose text not null default '' check (char_length(dose) <= 120),
  schedule text not null default '' check (char_length(schedule) <= 120),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists health_logs_family_member_idx on public.health_logs(family_id, member_id, logged_at desc);
create index if not exists medications_family_member_idx on public.medications(family_id, member_id);

-- Who may see or record health data about member_id.
create or replace function private.can_see_health(target_family_id uuid, target_member_id uuid)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select private.is_family_member(target_family_id) and (
    target_member_id = auth.uid()
    or (private.is_family_adult(target_family_id)
        and private.member_role(target_family_id, target_member_id) = 'child')
  );
$$;

revoke all on function private.can_see_health(uuid, uuid) from public;
grant execute on function private.can_see_health(uuid, uuid) to authenticated;

alter table public.health_logs enable row level security;
alter table public.medications enable row level security;

create policy health_logs_select on public.health_logs
  for select to authenticated using (private.can_see_health(family_id, member_id));
create policy health_logs_insert on public.health_logs
  for insert to authenticated
  with check (private.can_see_health(family_id, member_id) and created_by = auth.uid());
create policy health_logs_update on public.health_logs
  for update to authenticated
  using (private.can_see_health(family_id, member_id))
  with check (private.can_see_health(family_id, member_id));
create policy health_logs_delete on public.health_logs
  for delete to authenticated using (private.can_see_health(family_id, member_id));

create policy medications_all on public.medications
  for all to authenticated
  using (private.can_see_health(family_id, member_id))
  with check (private.can_see_health(family_id, member_id));

-- Pets ----------------------------------------------------------------------------
create table if not exists public.pets (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 60),
  species text not null default '' check (char_length(species) <= 60),
  birth_date date,
  weight_kg numeric(5, 1) check (weight_kg is null or weight_kg > 0),
  created_at timestamptz not null default now(),
  unique (id, family_id)
);

create table if not exists public.pet_feedings (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null,
  family_id uuid not null,
  label text not null check (char_length(trim(label)) between 1 and 80),
  time_of_day time not null,
  foreign key (pet_id, family_id) references public.pets(id, family_id) on delete cascade
);

create table if not exists public.pet_walks (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null,
  family_id uuid not null,
  walked_by uuid not null references auth.users(id) on delete cascade default auth.uid(),
  walked_at timestamptz not null default now(),
  minutes integer not null check (minutes between 1 and 600),
  distance_km numeric(5, 2) check (distance_km is null or distance_km >= 0),
  foreign key (pet_id, family_id) references public.pets(id, family_id) on delete cascade
);

create table if not exists public.vet_appointments (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null,
  family_id uuid not null,
  scheduled_at timestamptz not null,
  reason text not null check (char_length(trim(reason)) between 1 and 200),
  foreign key (pet_id, family_id) references public.pets(id, family_id) on delete cascade
);

create index if not exists pets_family_idx on public.pets(family_id);
create index if not exists pet_walks_pet_idx on public.pet_walks(pet_id, walked_at desc);
create index if not exists vet_appointments_pet_idx on public.vet_appointments(pet_id, scheduled_at);

alter table public.pets enable row level security;
alter table public.pet_feedings enable row level security;
alter table public.pet_walks enable row level security;
alter table public.vet_appointments enable row level security;

create policy pets_member_select on public.pets for select to authenticated using (private.is_family_member(family_id));
create policy pets_adult_write on public.pets for all to authenticated
  using (private.is_family_adult(family_id)) with check (private.is_family_adult(family_id));

create policy pet_feedings_member_select on public.pet_feedings for select to authenticated using (private.is_family_member(family_id));
create policy pet_feedings_adult_write on public.pet_feedings for all to authenticated
  using (private.is_family_adult(family_id)) with check (private.is_family_adult(family_id));

create policy vet_appointments_member_select on public.vet_appointments for select to authenticated using (private.is_family_member(family_id));
create policy vet_appointments_adult_write on public.vet_appointments for all to authenticated
  using (private.is_family_adult(family_id)) with check (private.is_family_adult(family_id));

-- Anyone can log a walk they took; they (or an adult) can remove it.
create policy pet_walks_member_select on public.pet_walks for select to authenticated using (private.is_family_member(family_id));
create policy pet_walks_self_insert on public.pet_walks for insert to authenticated
  with check (private.is_family_member(family_id) and walked_by = auth.uid());
create policy pet_walks_delete on public.pet_walks for delete to authenticated
  using (walked_by = auth.uid() or private.is_family_adult(family_id));

-- Timeline ----------------------------------------------------------------------
create table if not exists public.timeline_entries (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  kind text not null check (kind in ('achievement', 'memory', 'journal', 'milestone')),
  title text not null default '' check (char_length(title) <= 120),
  body text not null default '' check (char_length(body) <= 2000),
  occurred_on date not null default current_date,
  visibility text not null default 'family' check (visibility in ('family', 'private')),
  photo_path text check (photo_path is null or char_length(photo_path) <= 300),
  created_at timestamptz not null default now(),
  check (char_length(trim(title)) > 0 or char_length(trim(body)) > 0)
);

create index if not exists timeline_entries_family_idx on public.timeline_entries(family_id, occurred_on desc);

alter table public.timeline_entries enable row level security;

create policy timeline_entries_select on public.timeline_entries for select to authenticated
  using (private.is_family_member(family_id) and (visibility = 'family' or author_id = auth.uid()));
create policy timeline_entries_self_insert on public.timeline_entries for insert to authenticated
  with check (private.is_family_member(family_id) and author_id = auth.uid());
create policy timeline_entries_self_update on public.timeline_entries for update to authenticated
  using (author_id = auth.uid()) with check (author_id = auth.uid() and private.is_family_member(family_id));
-- Authors remove their own; adults can remove shared (not private) entries.
create policy timeline_entries_delete on public.timeline_entries for delete to authenticated
  using (author_id = auth.uid() or (visibility = 'family' and private.is_family_adult(family_id)));

-- Sports -------------------------------------------------------------------------
create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 80),
  league text not null default '' check (char_length(league) <= 120),
  record text not null default '' check (char_length(record) <= 40),
  created_at timestamptz not null default now(),
  unique (id, family_id)
);

create table if not exists public.team_events (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null,
  family_id uuid not null,
  kind text not null default 'practice' check (kind in ('game', 'practice', 'other')),
  title text not null check (char_length(trim(title)) between 1 and 120),
  starts_at timestamptz not null,
  location text not null default '' check (char_length(location) <= 200),
  foreign key (team_id, family_id) references public.teams(id, family_id) on delete cascade
);

create table if not exists public.team_contacts (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null,
  family_id uuid not null,
  name text not null check (char_length(trim(name)) between 1 and 80),
  role text not null default '' check (char_length(role) <= 80),
  phone text not null default '' check (char_length(phone) <= 40),
  email text not null default '' check (char_length(email) <= 120),
  foreign key (team_id, family_id) references public.teams(id, family_id) on delete cascade
);

create table if not exists public.team_checklist (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null,
  family_id uuid not null,
  label text not null check (char_length(trim(label)) between 1 and 80),
  critical boolean not null default false,
  packed boolean not null default false,
  foreign key (team_id, family_id) references public.teams(id, family_id) on delete cascade
);

create table if not exists public.team_messages (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null,
  family_id uuid not null,
  author_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  body text not null default '' check (char_length(body) <= 2000),
  attachment_path text check (attachment_path is null or char_length(attachment_path) <= 300),
  created_at timestamptz not null default now(),
  check (char_length(trim(body)) > 0 or attachment_path is not null),
  foreign key (team_id, family_id) references public.teams(id, family_id) on delete cascade
);

create index if not exists teams_family_idx on public.teams(family_id);
create index if not exists team_events_team_idx on public.team_events(team_id, starts_at);
create index if not exists team_messages_team_idx on public.team_messages(team_id, created_at);

alter table public.teams enable row level security;
alter table public.team_events enable row level security;
alter table public.team_contacts enable row level security;
alter table public.team_checklist enable row level security;
alter table public.team_messages enable row level security;

create policy teams_member_select on public.teams for select to authenticated using (private.is_family_member(family_id));
create policy teams_adult_write on public.teams for all to authenticated
  using (private.is_family_adult(family_id)) with check (private.is_family_adult(family_id));

create policy team_events_member_select on public.team_events for select to authenticated using (private.is_family_member(family_id));
create policy team_events_adult_write on public.team_events for all to authenticated
  using (private.is_family_adult(family_id)) with check (private.is_family_adult(family_id));

create policy team_contacts_member_select on public.team_contacts for select to authenticated using (private.is_family_member(family_id));
create policy team_contacts_adult_write on public.team_contacts for all to authenticated
  using (private.is_family_adult(family_id)) with check (private.is_family_adult(family_id));

-- Adults manage the checklist; anyone in the family can tick "packed".
create policy team_checklist_member_select on public.team_checklist for select to authenticated using (private.is_family_member(family_id));
create policy team_checklist_adult_insert on public.team_checklist for insert to authenticated
  with check (private.is_family_adult(family_id));
create policy team_checklist_adult_delete on public.team_checklist for delete to authenticated
  using (private.is_family_adult(family_id));
create policy team_checklist_member_update on public.team_checklist for update to authenticated
  using (private.is_family_member(family_id)) with check (private.is_family_member(family_id));
revoke update on public.team_checklist from authenticated;
grant update (packed) on public.team_checklist to authenticated;

create policy team_messages_member_select on public.team_messages for select to authenticated using (private.is_family_member(family_id));
create policy team_messages_self_insert on public.team_messages for insert to authenticated
  with check (private.is_family_member(family_id) and author_id = auth.uid());
create policy team_messages_self_delete on public.team_messages for delete to authenticated
  using (author_id = auth.uid());

-- Creator studio -------------------------------------------------------------------
create table if not exists public.creator_posts (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  kind text not null check (kind in ('photo', 'voice', 'poll')),
  caption text not null default '' check (char_length(caption) <= 500),
  media_path text check (media_path is null or char_length(media_path) <= 300),
  duration_seconds integer check (duration_seconds is null or duration_seconds between 0 and 3600),
  created_at timestamptz not null default now(),
  unique (id, family_id),
  check (kind = 'poll' or media_path is not null),
  check (kind <> 'poll' or char_length(trim(caption)) > 0)
);

create table if not exists public.poll_options (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null,
  family_id uuid not null,
  label text not null check (char_length(trim(label)) between 1 and 120),
  position integer not null default 0,
  unique (id, post_id),
  foreign key (post_id, family_id) references public.creator_posts(id, family_id) on delete cascade
);

create table if not exists public.poll_votes (
  post_id uuid not null,
  option_id uuid not null,
  family_id uuid not null,
  voter_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  created_at timestamptz not null default now(),
  primary key (post_id, voter_id),
  foreign key (option_id, post_id) references public.poll_options(id, post_id) on delete cascade,
  foreign key (post_id, family_id) references public.creator_posts(id, family_id) on delete cascade
);

create table if not exists public.post_likes (
  post_id uuid not null,
  family_id uuid not null,
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  created_at timestamptz not null default now(),
  primary key (post_id, user_id),
  foreign key (post_id, family_id) references public.creator_posts(id, family_id) on delete cascade
);

create index if not exists creator_posts_family_idx on public.creator_posts(family_id, created_at desc);

alter table public.creator_posts enable row level security;
alter table public.poll_options enable row level security;
alter table public.poll_votes enable row level security;
alter table public.post_likes enable row level security;

create policy creator_posts_member_select on public.creator_posts for select to authenticated using (private.is_family_member(family_id));
create policy creator_posts_self_insert on public.creator_posts for insert to authenticated
  with check (private.is_family_member(family_id) and author_id = auth.uid());
create policy creator_posts_delete on public.creator_posts for delete to authenticated
  using (author_id = auth.uid() or private.is_family_adult(family_id));

create policy poll_options_member_select on public.poll_options for select to authenticated using (private.is_family_member(family_id));
create policy poll_options_author_insert on public.poll_options for insert to authenticated
  with check (exists (
    select 1 from public.creator_posts p
    where p.id = post_id and p.family_id = poll_options.family_id and p.author_id = auth.uid() and p.kind = 'poll'
  ));

create policy poll_votes_member_select on public.poll_votes for select to authenticated using (private.is_family_member(family_id));
create policy poll_votes_self_vote on public.poll_votes for insert to authenticated
  with check (private.is_family_member(family_id) and voter_id = auth.uid());
create policy poll_votes_self_retract on public.poll_votes for delete to authenticated using (voter_id = auth.uid());

create policy post_likes_member_select on public.post_likes for select to authenticated using (private.is_family_member(family_id));
create policy post_likes_self_like on public.post_likes for insert to authenticated
  with check (private.is_family_member(family_id) and user_id = auth.uid());
create policy post_likes_self_unlike on public.post_likes for delete to authenticated using (user_id = auth.uid());

-- Maintenance (adults only) ---------------------------------------------------------
create table if not exists public.maintenance_items (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  section text not null check (section in ('vehicles', 'home', 'subscriptions')),
  title text not null check (char_length(trim(title)) between 1 and 120),
  detail text not null default '' check (char_length(detail) <= 300),
  due_on date,
  monthly_cost_cents integer check (monthly_cost_cents is null or monthly_cost_cents between 0 and 10000000),
  handled_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists maintenance_items_family_idx on public.maintenance_items(family_id, section);

alter table public.maintenance_items enable row level security;

create policy maintenance_items_adult_all on public.maintenance_items for all to authenticated
  using (private.is_family_adult(family_id)) with check (private.is_family_adult(family_id));

-- Media storage --------------------------------------------------------------------
-- Private bucket; every object lives under "<family_id>/...". Family members
-- read; members upload into their own family's folder; the uploader or an
-- adult deletes.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'family-media', 'family-media', false, 20971520,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'audio/webm', 'audio/ogg', 'audio/mp4', 'audio/mpeg']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create or replace function private.media_family(object_name text)
returns uuid
language plpgsql
immutable
set search_path = ''
as $$
begin
  return (split_part(object_name, '/', 1))::uuid;
exception when invalid_text_representation then
  return null;
end;
$$;

revoke all on function private.media_family(text) from public;
grant execute on function private.media_family(text) to authenticated;

drop policy if exists family_media_member_read on storage.objects;
create policy family_media_member_read on storage.objects for select to authenticated
  using (bucket_id = 'family-media' and private.is_family_member(private.media_family(name)));

drop policy if exists family_media_member_upload on storage.objects;
create policy family_media_member_upload on storage.objects for insert to authenticated
  with check (bucket_id = 'family-media' and private.is_family_member(private.media_family(name)));

drop policy if exists family_media_delete on storage.objects;
create policy family_media_delete on storage.objects for delete to authenticated
  using (
    bucket_id = 'family-media'
    and (owner_id = auth.uid()::text or private.is_family_adult(private.media_family(name)))
  );

-- Audit + rate limits ---------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array[
    'health_logs', 'medications', 'pets', 'pet_feedings', 'pet_walks', 'vet_appointments',
    'timeline_entries', 'teams', 'team_events', 'team_contacts', 'team_checklist', 'team_messages',
    'creator_posts', 'poll_options', 'poll_votes', 'post_likes', 'maintenance_items'
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
