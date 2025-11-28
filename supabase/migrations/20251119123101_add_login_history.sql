create extension if not exists pgcrypto;

create table if not exists public.login_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text,
  ip text,
  user_agent text,
  meta jsonb,
  created_at timestamptz not null default now()
);

alter table public.login_history enable row level security;

create policy read_own_login_history
  on public.login_history for select
  using (auth.uid() = user_id);

create policy insert_own_login_history
  on public.login_history for insert
  with check (auth.uid() = user_id);