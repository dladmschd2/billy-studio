-- Billy's Writer Room / Supabase setup
create table if not exists public.studio_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.studio_data enable row level security;
drop policy if exists "Users can read own studio" on public.studio_data;
create policy "Users can read own studio" on public.studio_data for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Users can insert own studio" on public.studio_data;
create policy "Users can insert own studio" on public.studio_data for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Users can update own studio" on public.studio_data;
create policy "Users can update own studio" on public.studio_data for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
grant select, insert, update on table public.studio_data to authenticated;
