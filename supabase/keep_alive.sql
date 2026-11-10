-- Keep-alive for the free-tier Supabase project.
-- Run once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
--
-- Creates a one-row table and a function that updates that row's timestamp.
-- The GitHub Actions workflow (.github/workflows/supabase-keepalive.yml)
-- calls the function twice a day, so the project sees a real database
-- write - not just a read - on a regular schedule.
--
-- Safety: RLS is on with no policies, so the public (anon) key cannot read
-- or change the table directly. The only thing the anon key can do is call
-- keep_alive_ping(), which only ever updates the single row with id = 1.

create table if not exists public.keep_alive (
  id         int primary key,
  pinged_at  timestamptz not null default now()
);

insert into public.keep_alive (id) values (1)
on conflict (id) do nothing;

alter table public.keep_alive enable row level security;

create or replace function public.keep_alive_ping()
returns timestamptz
language sql
security definer
set search_path = public
as $$
  update public.keep_alive set pinged_at = now() where id = 1
  returning pinged_at;
$$;

revoke all on function public.keep_alive_ping() from public;
grant execute on function public.keep_alive_ping() to anon;
