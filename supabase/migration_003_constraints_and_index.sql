-- =====================================================
--  GORILA CAPS - Migración 003: restricciones e índice
--  Ejecuta este archivo en Supabase > SQL Editor si ya
--  creaste las tablas anteriormente.
-- =====================================================

alter table public.products
  drop constraint if exists products_price_non_negative,
  add constraint products_price_non_negative check (price >= 0);

alter table public.products
  drop constraint if exists products_stock_non_negative,
  add constraint products_stock_non_negative check (stock >= 0);

create index if not exists products_catalog_idx
  on public.products (active, featured desc, created_at desc);
