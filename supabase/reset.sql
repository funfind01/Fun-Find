-- Fun Find — Full Reset Script
-- Run this FIRST in Supabase SQL Editor to wipe everything clean,
-- then run products.sql to rebuild from scratch.

-- Drop trigger
drop trigger if exists set_products_updated_at on public.products;

-- Drop function
drop function if exists public.set_updated_at();

-- Drop indexes
drop index if exists public.products_created_at_idx;
drop index if exists public.products_category_idx;
drop index if exists public.products_stock_idx;

-- Drop RLS policies
drop policy if exists "Public can read products" on public.products;

-- Drop the table (cascades all dependencies)
drop table if exists public.products cascade;
