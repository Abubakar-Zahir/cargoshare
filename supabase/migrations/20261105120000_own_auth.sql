-- Sign-in moves from Supabase Auth to our backend, so profiles stop depending on auth.users.
-- Existing rows are test accounts with no password in our tables, and there are no real users.
drop trigger on_auth_user_created on auth.users;
drop function public.handle_new_user();
delete from public.profiles;
alter table public.profiles drop constraint profiles_id_fkey;
alter table public.profiles alter column id set default gen_random_uuid();

-- Kept apart from profiles so sign-in secrets can never be loaded with public profile data.
create table public.credentials (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  email extensions.citext not null unique,
  password_hash text not null,
  date_of_birth date not null,
  failed_attempts integer not null default 0,
  locked_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Only the SHA-256 of each token is stored, so a database leak cannot be used to sign in.
create table public.refresh_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index refresh_tokens_user_id_idx on public.refresh_tokens (user_id);

-- RLS on with no policies: the browser roles can never read or write rows.
alter table public.credentials enable row level security;
alter table public.refresh_tokens enable row level security;
revoke all on table public.credentials from anon, authenticated;
revoke all on table public.refresh_tokens from anon, authenticated;

create trigger credentials_set_updated_at
  before update on public.credentials
  for each row execute function public.set_updated_at();
