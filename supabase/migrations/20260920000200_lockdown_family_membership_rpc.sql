-- Keep the helper available to RLS policies, but do not expose it as an RPC.
revoke execute on function public.is_family_member(uuid) from public, anon, authenticated;
