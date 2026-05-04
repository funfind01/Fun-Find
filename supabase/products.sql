-- Fun Find inventory backend schema
-- Run this in the Supabase SQL editor for the project connected by .env.local.

create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(10, 2) not null default 0 check (price >= 0),
  description text not null default '',
  category text not null default 'General',
  image_url text not null default '',
  stock integer not null default 0 check (stock >= 0),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create index if not exists products_created_at_idx on public.products (created_at desc);
create index if not exists products_category_idx on public.products (category);
create index if not exists products_stock_idx on public.products (stock);

alter table public.products enable row level security;

drop policy if exists "Public can read products" on public.products;
create policy "Public can read products"
on public.products for select
using (true);

-- Product writes should go through the Next.js admin API using SUPABASE_SERVICE_ROLE_KEY.
-- Service-role requests bypass RLS, so no public insert/update/delete policies are needed.

insert into public.products (name, price, description, category, image_url, stock, metadata)
values
  (
    'Vector-01 Titanium',
    185.00,
    'A high-end matte black kinetic piece engineered from aerospace-grade titanium.',
    'Keychains',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB41GYsTE-GuylqlU7LH0VJPzArHrFbfWzV89bbqIWjAi_r4v1UhJHkgw5AXLUZve7KQH-C9gnYjLBupTeYg91-hCKk42YtF88P3Ivx8QbM_uTAS9AFvcaOSEIaEqbjFcayc8iC7AwkGrnfguXtqDALERiZF9DsqY-DPftFowgm_gWgh4mVNIHmu36o3Iv7l4xuNJKqf21myGOVujiPF75ukZNOCGw6PJVTTS4_ogWmyMZrdSAY7iHu1TjVQV7iyLCw3jj3hVb4Vk77',
    10,
    '{"material":"Grade 5 Titanium","finish":"Matte black"}'::jsonb
  ),
  (
    'Apex Fun Find Frame',
    320.00,
    'Intricately engineered mechanical frame with precision gear geometry.',
    'Frames',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuANKN2fKcQIYjH7baNTqJadG0D717lZ5XHwpRvne6BeDMP9GzAEIxnyi4zY8pw5gclrQ8TgjfbsV9MOobiJEQqOMNzyNqx9I4PTMwdF05ve4d9r4ynXPeOokh5nKTpDh3j6FFWh3rzEUfDdEQVKcZ3DsLMSAeIwwMTgoHQnso-kggeS22CuKBV0rjoR2fq-krdou5LzWkwFaCgZVeS_7nYJxEFPFbjrl49ckmi8uBJjI2RXQOsYL_SwPPatfG__Yp-R32u1uBVPnNEM',
    8,
    '{"material":"Brushed aluminum","finish":"Gallery polish"}'::jsonb
  ),
  (
    'Carbon Stealth Grip',
    145.00,
    'Carbon-fiber inspired tactile tool with sharp industrial profile.',
    'Fidgets',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBcm4uNiX-mqPu6gxnlt9EuUiqsDRKzgH6khauEs0mbq_fbEcgliQPIbvaw1KTlt8TkL1zJG_8BJ50ehOdRVi8mnWImZBQ9laf27Aq4OEovtv3A68xazhB9djgcAmvjJXZRwveSVifDE6_wMqmbyWHggxzx63EBBIagIXPBYkv0zDLWC6O4cTcsJBWZHQQzjmwp6xkk9GcoP9Hz_bjBnl_QAJmkqZXHCulEoecEdyd5k_csSK83MnVxXymnnURxJoroUR8_c5oyBvzD',
    12,
    '{"material":"Carbon fiber composite","finish":"Neon edge"}'::jsonb
  )
on conflict do nothing;
