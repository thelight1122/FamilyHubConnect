drop policy if exists family_members_creator_insert on public.family_members;
create policy family_members_creator_insert
  on public.family_members for insert
  with check (
    user_id = auth.uid()
    and exists (
      select 1
      from public.families
      where families.id = family_members.family_id
        and families.created_by = auth.uid()
    )
  );
