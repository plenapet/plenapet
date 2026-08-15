-- PlenaPet — esquema inicial
-- Ver vault obsiadian/PLENAPET/Arquitectura/Modelo-de-datos.md para el diseño y el razonamiento de RLS.

create extension if not exists "pgcrypto";

-- =========================================================================
-- Catálogo público (curado) — lo único que lee el storefront
-- =========================================================================

create table categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  parent_id uuid references categories(id)
);

create table brands (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  logo_url text
);

create table products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  short_description text,
  description text,
  brand_id uuid references brands(id),
  category_id uuid references categories(id),
  species text[] not null default '{}',
  life_stage text not null default 'todas',
  presentation text,
  price_cents integer not null,
  compare_at_price_cents integer,
  stock_status text not null default 'in_stock',
  requires_prescription boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  label text not null,
  price_cents integer not null,
  stock_status text not null default 'in_stock'
);

create table promotions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text,
  cta_label text,
  cta_url text,
  starts_at timestamptz,
  ends_at timestamptz,
  active boolean not null default true
);

-- =========================================================================
-- Cliente / pedido — cada cliente ve solo lo suyo (RLS por auth.uid())
-- =========================================================================

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  accepts_marketing boolean not null default false
);

create table addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references profiles(id) on delete cascade,
  line1 text not null,
  line2 text,
  city text not null,
  department text,
  phone text,
  is_default boolean not null default false
);

create table cart_items (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references profiles(id) on delete cascade,
  product_id uuid not null references products(id),
  variant_id uuid references product_variants(id),
  quantity integer not null default 1
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references profiles(id),
  status text not null default 'pending',
  subtotal_cents integer not null,
  shipping_cents integer not null default 0,
  total_cents integer not null,
  wompi_transaction_id text,
  wompi_status text,
  shipping_address jsonb,
  placed_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id),
  variant_id uuid references product_variants(id),
  quantity integer not null,
  unit_price_cents integer not null,
  name_snapshot text not null
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  provider text not null default 'wompi',
  reference text,
  status text,
  raw_payload jsonb,
  processed_at timestamptz
);

-- =========================================================================
-- Interno — jamás accesible desde anon/authenticated, solo service_role
-- =========================================================================

create table vetshipping_raw_catalog (
  id uuid primary key default gen_random_uuid(),
  external_sku text unique not null,
  name_raw text,
  cost_price_cents integer,
  stock_qty integer,
  category_raw text,
  species_raw text,
  image_urls_raw text[],
  last_synced_at timestamptz,
  source text
);

create table product_overrides (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id),
  external_sku text references vetshipping_raw_catalog(external_sku),
  custom_name text,
  custom_description text,
  custom_images text[],
  margin_percent_override numeric,
  hidden boolean not null default false,
  requires_prescription_override boolean
);

create table pricing_rules (
  id uuid primary key default gen_random_uuid(),
  scope_type text not null check (scope_type in ('global', 'category', 'brand')),
  scope_id uuid,
  margin_percent numeric,
  fixed_markup_cents integer,
  priority integer not null default 0
);

create table sync_runs (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status text not null default 'running',
  rows_processed integer not null default 0,
  errors jsonb
);

create table admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'support' check (role in ('super_admin', 'catalog_manager', 'order_manager', 'support')),
  active boolean not null default true
);

create table audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  action text not null,
  entity text not null,
  entity_id uuid,
  diff jsonb,
  created_at timestamptz not null default now()
);

-- =========================================================================
-- Row Level Security
-- =========================================================================

alter table categories enable row level security;
alter table brands enable row level security;
alter table products enable row level security;
alter table product_variants enable row level security;
alter table promotions enable row level security;
alter table profiles enable row level security;
alter table addresses enable row level security;
alter table cart_items enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table payments enable row level security;
alter table vetshipping_raw_catalog enable row level security;
alter table product_overrides enable row level security;
alter table pricing_rules enable row level security;
alter table sync_runs enable row level security;
alter table admin_users enable row level security;
alter table audit_log enable row level security;

-- Catálogo público: lectura abierta de lo activo, sin escritura para anon/authenticated
-- (la escritura la hace el job de sync / el admin con service_role, que ignora RLS).
create policy "public read categories" on categories for select using (true);
create policy "public read brands" on brands for select using (true);
create policy "public read active products" on products for select using (active = true);
create policy "public read variants of active products" on product_variants for select
  using (exists (select 1 from products p where p.id = product_variants.product_id and p.active = true));
create policy "public read active promotions" on promotions for select using (active = true);

-- Cliente: cada quien ve y gestiona únicamente lo suyo.
create policy "own profile" on profiles for select using (auth.uid() = id);
create policy "update own profile" on profiles for update using (auth.uid() = id);

create policy "own addresses" on addresses for select using (auth.uid() = customer_id);
create policy "manage own addresses" on addresses for all using (auth.uid() = customer_id);

create policy "own cart" on cart_items for select using (auth.uid() = customer_id);
create policy "manage own cart" on cart_items for all using (auth.uid() = customer_id);

create policy "own orders" on orders for select using (auth.uid() = customer_id);
create policy "own order items" on order_items for select
  using (exists (select 1 from orders o where o.id = order_items.order_id and o.customer_id = auth.uid()));
create policy "own payments" on payments for select
  using (exists (select 1 from orders o where o.id = payments.order_id and o.customer_id = auth.uid()));

-- vetshipping_raw_catalog, product_overrides, pricing_rules, sync_runs,
-- admin_users y audit_log: sin políticas para anon/authenticated a propósito.
-- RLS activo + cero policies = acceso denegado por defecto; solo service_role
-- (que ignora RLS) puede leerlas o escribirlas. No agregar policies aquí sin
-- revisar Arquitectura/Modelo-de-datos.md primero.
