-- =====================================================
--  GORILA CAPS - Esquema de base de datos (Supabase)
--  Ejecuta este script en: Supabase > SQL Editor > New query
-- =====================================================

-- 1) Tabla de productos
create table if not exists public.products (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  description  text default '',
  price        numeric(12,2) not null default 0,
  category     text not null default 'Snapback',
  image_url    text,
  stock        integer not null default 0,
  featured     boolean not null default false,
  active       boolean not null default true,
  created_at   timestamptz not null default now()
);

-- 2) Tabla de administradores (solo los usuarios aquí listados pueden editar)
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- 2b) Tabla de textos y configuración editable desde el admin
create table if not exists public.settings (
  id         integer primary key default 1 check (id = 1),
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.settings (id, data) values (1, '{}'::jsonb)
on conflict (id) do nothing;

-- Función auxiliar
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- 3) Seguridad a nivel de fila (RLS)
alter table public.products enable row level security;
alter table public.admins   enable row level security;
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

drop policy if exists "public read active products" on public.products;
create policy "public read active products" on public.products
  for select using (active = true or public.is_admin());

drop policy if exists "admins insert products" on public.products;
create policy "admins insert products" on public.products
  for insert with check (public.is_admin());

drop policy if exists "admins update products" on public.products;
create policy "admins update products" on public.products
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins delete products" on public.products;
create policy "admins delete products" on public.products
  for delete using (public.is_admin());

drop policy if exists "admins read self" on public.admins;
create policy "admins read self" on public.admins
  for select using (user_id = auth.uid());

-- 4) Storage: bucket público para imágenes de productos
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

drop policy if exists "public read product images" on storage.objects;
create policy "public read product images" on storage.objects
  for select using (bucket_id = 'products');

drop policy if exists "admins upload product images" on storage.objects;
create policy "admins upload product images" on storage.objects
  for insert with check (bucket_id = 'products' and public.is_admin());

drop policy if exists "admins update product images" on storage.objects;
create policy "admins update product images" on storage.objects
  for update using (bucket_id = 'products' and public.is_admin());

drop policy if exists "admins delete product images" on storage.objects;
create policy "admins delete product images" on storage.objects
  for delete using (bucket_id = 'products' and public.is_admin());

-- 5) Productos de ejemplo (opcional)
insert into public.products (name, description, price, category, stock, featured, image_url) values
  ('Silverback Classic', 'Snapback negra con bordado de gorila en 3D. Visera plana y ajuste trasero.', 89000, 'Snapback', 25, true, null),
  ('Alpha Trucker', 'Trucker blanca con malla negra. Para el líder de la manada.', 79000, 'Trucker', 18, true, null),
  ('Jungle Dad Hat', 'Dad hat de algodón lavado, logo minimalista.', 69000, 'Dad Hat', 30, false, null),
  ('Kong Fitted', 'Fitted premium de lana con parche frontal.', 109000, 'Fitted', 12, true, null),
  ('Banana Split Beanie', 'Gorro tejido blanco y negro para la temporada fría.', 59000, 'Beanie', 20, false, null),
  ('Primate Snapback', 'Snapback blanca con logo negro de alto contraste.', 89000, 'Snapback', 15, false, null);

-- =====================================================
-- 6) CREAR TU ADMIN:
--   a) Supabase > Authentication > Users > "Add user" (email + contraseña,
--      marca "Auto Confirm User").
--   b) Copia el UUID del usuario y ejecuta:
--
--   insert into public.admins (user_id) values ('PEGA-AQUI-EL-UUID');
-- =====================================================
