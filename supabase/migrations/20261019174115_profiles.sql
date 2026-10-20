-- The one definition of a valid username (3 to 30 of a-z, 0-9, _), used by the table
-- check and by the signup trigger below.
create function public.is_valid_username(value text)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select value ~ '^[a-z0-9_]{3,30}$';
$$;

-- The one definition of a valid display name (1 to 60 characters, no spaces around it),
-- used by the table check and by the signup trigger below.
create function public.is_valid_display_name(value text)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select char_length(value) between 1 and 60 and value = btrim(value);
$$;

-- One profile per Supabase Auth user: the app's data about a person.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username extensions.citext not null unique,
  display_name text,
  avatar_path text,
  is_traveler boolean not null default true,
  is_sender boolean not null default true,
  is_verified boolean not null default false,
  is_admin boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_format check (public.is_valid_username(username::text)),
  constraint profiles_display_name_format check (
    display_name is null or public.is_valid_display_name(display_name)
  ),
  constraint profiles_has_a_role check (is_traveler or is_sender)
);

-- RLS on with no policies: the browser roles can never read or write rows.
alter table public.profiles enable row level security;
revoke all on table public.profiles from anon, authenticated;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Creates the profile when Supabase Auth creates a user.
-- raw_user_meta_data is written by the person signing up, so only the username,
-- display name and the two roles are read from it. Admin, verified and active
-- flags always start at their safe defaults.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_username text := lower(btrim(new.raw_user_meta_data ->> 'username'));
  requested_display_name text := btrim(new.raw_user_meta_data ->> 'display_name');
  chosen_username text;
begin
  if public.is_valid_username(requested_username)
     and not exists (select 1 from public.profiles where username = requested_username) then
    chosen_username := requested_username;
  else
    chosen_username := 'user_' || left(replace(new.id::text, '-', ''), 8);
  end if;

  insert into public.profiles (id, username, display_name, is_traveler, is_sender)
  values (
    new.id,
    chosen_username,
    case when public.is_valid_display_name(requested_display_name) then requested_display_name end,
    (new.raw_user_meta_data ->> 'is_traveler') is distinct from 'false',
    (new.raw_user_meta_data ->> 'is_sender') is distinct from 'false'
  );
  return new;
end;
$$;

-- Explicit, not only via the defaults above: this function runs with the owner's rights.
revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
