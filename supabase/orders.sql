-- Fun Find Orders Schema

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid, -- Optional, if linked to auth
  customer_name text not null,
  customer_email text not null,
  shipping_address jsonb not null,
  items jsonb not null,
  subtotal numeric(10, 2) not null,
  gst numeric(10, 2) not null,
  discount numeric(10, 2) not null default 0,
  total numeric(10, 2) not null,
  payment_method text not null,
  payment_status text not null default 'Pending',
  shiprocket_order_id text,
  shiprocket_shipment_id text,
  shiprocket_awb text,
  fulfillment_status text not null default 'Unfulfilled',
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

alter table public.orders enable row level security;

-- Only authenticated users can read their own orders
drop policy if exists "Users can view their own orders" on public.orders;
create policy "Users can view their own orders"
on public.orders for select
using (auth.uid() = user_id);

-- Anyone can insert an order (or we can use service role for creation)
-- In this setup, we will use the Next.js API route with service_role key to insert securely.
