-- =====================================================
--  GORILA CAPS - Migración 002: textos editables
--  Si ya ejecutaste schema.sql antes, ejecuta SOLO este archivo
--  en Supabase > SQL Editor.
-- =====================================================

create table if not exists public.settings (
  id         integer primary key default 1 check (id = 1),
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.settings (id, data) values (1, '{}'::jsonb)
on conflict (id) do nothing;

alter table public.settings enable row level security;

drop policy if exists "public read settings" on public.settings;
create policy "public read settings" on public.settings
  for select using (true);

drop policy if exists "admins insert settings" on public.settings;
create policy "admins insert settings" on public.settings
  for insert with check (public.is_admin());

drop policy if exists "admins update settings" on public.settings;
create policy "admins update settings" on public.settings
  for update using (public.is_admin()) with check (public.is_admin());
