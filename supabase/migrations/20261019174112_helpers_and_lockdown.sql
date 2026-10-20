-- Lockdown: Supabase grants the browser roles (anon, authenticated) every right on
-- anything created in public. Remove those defaults so every future table, sequence
-- and function starts closed to the browser.
alter default privileges for role postgres in schema public
  revoke all on tables from anon, authenticated;
alter default privileges for role postgres in schema public
  revoke all on sequences from anon, authenticated;
alter default privileges for role postgres in schema public
  revoke all on functions from anon, authenticated;
-- Postgres also lets everyone (PUBLIC) run every new function. That default is global,
-- so it is removed globally; a per-schema rule cannot take it away.
alter default privileges for role postgres
  revoke execute on functions from public;

-- Case-insensitive text, used for usernames ("Sana" and "sana" are the same name).
create extension if not exists citext with schema extensions;

-- Keeps updated_at current on every UPDATE of a table that uses it.
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
