create extension if not exists pgcrypto;

-- Ensure table exists with a text-based user_id compatible with Firebase/app IDs
create table if not exists public.login_history (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  provider text,
  ip text,
  user_agent text,
  meta jsonb,
  created_at timestamptz not null default now()
);

-- If table already exists with uuid user_id, transform it safely
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'login_history'
      and column_name = 'user_id'
      and data_type = 'uuid'
  ) then
    begin
      drop policy if exists read_own_login_history on public.login_history;
      drop policy if exists insert_own_login_history on public.login_history;
      alter table public.login_history drop constraint if exists login_history_user_id_fkey;
      alter table public.login_history alter column user_id type text using user_id::text;
    exception when others then
      -- no-op: keep going if already transformed
      null;
    end;
  end if;
end $$;

-- Enable RLS and deny direct access; all reads/writes via service-role functions
alter table public.login_history enable row level security;
drop policy if exists allow_none_select on public.login_history;
drop policy if exists allow_none_insert on public.login_history;
create policy allow_none_select on public.login_history for select using (false);
create policy allow_none_insert on public.login_history for insert with check (false);