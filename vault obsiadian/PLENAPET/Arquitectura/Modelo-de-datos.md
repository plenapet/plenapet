---
tipo: arquitectura
proyecto: PlenaPet
actualizado: 2026-08-14
---

# Modelo de datos (Supabase / Postgres) — v1

Esquema de referencia para arrancar. Se traduce a migraciones SQL en `supabase/migrations/` cuando empiece la Fase 1. Los nombres de columnas son orientativos, ajustables al escribir la migración real.

## Principio de diseño clave

El storefront **nunca lee directamente** datos crudos de VetShipping. Todo lo público (`products`, `categories`, `brands`) es una **proyección curada** que PlenaPet controla, alimentada por un job de sincronización. Esto separa "lo que VetShipping tiene en inventario" de "lo que PlenaPet decide vender, cómo lo llama, y a qué precio" — ver [[Integracion-VetShipping]].

## Tablas públicas (expuestas al storefront vía RLS, solo lectura para `anon`/`authenticated`)

- **products**: `id, slug, name, description, short_description, brand_id, category_id, species text[]` (`perro`/`gato`), `life_stage, presentation, weight, price_cents, compare_at_price_cents, currency (COP), stock_status (in_stock|low_stock|out_of_stock), requires_prescription bool, images jsonb, active bool, created_at, updated_at`.
  - **No** incluye ninguna referencia visible a VetShipping. El mapeo vive en `product_overrides` (tabla interna).
- **product_variants**: variantes de presentación/peso de un mismo producto (`product_id, sku_internal, attribute_label, price_cents, stock_status`).
- **categories**: `id, name, slug, parent_id` — jerarquía para navegación (alimentos, farmacia, suplementos, higiene, accesorios, bienestar, por especie/etapa de vida).
- **brands**: marca del fabricante del producto (Royal Canin, Hill's, etc. — **no confundir con la marca PlenaPet**). `id, name, slug, logo_url`.
- **promotions** / **banners**: piezas de merchandising del home/categoría (`title, image_url, cta_label, cta_url, starts_at, ends_at, active`).

## Tablas de cliente/pedido (RLS: cada `customer` solo ve lo suyo)

- **profiles**: 1:1 con `auth.users` (`auth_user_id, full_name, phone, accepts_marketing`).
- **addresses**: `customer_id, line1, line2, city, department, phone, is_default`.
- **cart_items** (si se persiste carrito de usuarios logueados): `customer_id, product_id, variant_id, quantity`.
- **orders**: `id, customer_id, status (pending|paid|processing|shipped|delivered|cancelled|refunded), subtotal_cents, shipping_cents, total_cents, wompi_transaction_id, wompi_status, shipping_address jsonb, placed_at`.
- **order_items**: `order_id, product_id, variant_id, quantity, unit_price_cents, name_snapshot` (snapshot del nombre/precio al momento de compra, para no depender de cambios futuros del catálogo).
- **payments**: `order_id, provider ('wompi'), reference, status, raw_payload jsonb, processed_at` — auditoría de cada evento de pago recibido por webhook.

## Tablas internas (sin acceso `anon`/`authenticated`; solo `service_role` / `admin_users`)

- **vetshipping_raw_catalog**: espejo crudo de lo último sincronizado (`external_sku, name_raw, cost_price_cents, stock_qty, category_raw, species_raw, image_urls_raw, last_synced_at, source`).
- **product_overrides**: capa de curaduría que conecta lo crudo con `products` (`product_id, external_sku, custom_name, custom_description, custom_images, margin_percent_override, hidden bool, requires_prescription_override`).
- **pricing_rules**: reglas para calcular `price_cents` de PlenaPet a partir del costo de VetShipping (`scope_type (global|category|brand), scope_id, margin_percent, fixed_markup_cents, priority`).
- **sync_runs**: observabilidad de cada corrida del job de sincronización (`source, started_at, finished_at, status, rows_processed, errors jsonb`).
- **admin_users**: `auth_user_id, role (super_admin|catalog_manager|order_manager|support), active`.
- **audit_log**: `actor_id, action, entity, entity_id, diff jsonb, created_at` — trazabilidad de cambios hechos desde el admin (quién cambió qué precio, quién ocultó qué producto, etc.).

## Tablas de PlenaPet Health (implementadas en `supabase/migrations/0003_pet_health.sql`)

Módulo aparte del petshop (mismo dominio, misma cuenta de cliente, secciones distintas — ver [[Vitalidad-y-Longevidad]] y [[Registro-de-decisiones]] 2026-08-17). Dueño de la fila = `pets.customer_id = auth.uid()` vía `profiles`.

- **pets**: `id, customer_id, name, species (perro|gato), breed, sex, sterilized, birth_date, estimated_age_years, weight_kg, photo_url, created_at`.
- **wellness_surveys**: `id, pet_id, submitted_at, answers jsonb, domain_scores jsonb, overall_score numeric` — resultado de la encuesta de bienestar (`packages/database/src/wellness-survey.ts`), calculado por deficit-accumulation (mismo enfoque que el "índice de fragilidad" del Dog Aging Project).
- **lab_panels**: `id, pet_id, lab_name, sample_taken_at, status (draft|published), notes, created_by (admin_users), published_at, created_at` — una orden/evento de laboratorio (hemograma + química + orina + coprológico del mismo día, por ejemplo). El dueño solo ve paneles `published`.
- **lab_results**: `id, lab_panel_id, exam_type, analyte_name, value, value_text, unit, reference_min, reference_max, organ_system, created_at` — un analito individual, cargado manualmente por el equipo interno desde `/admin/salud`. `reference_min/max` los define el laboratorio aliado en su reporte, PlenaPet no inventa rangos clínicos.
- **health_recommendations**: `id, pet_id, source (survey|lab|manual), title, description, severity (info|atencion|urgente), related_product_id, created_at` — enlazable a un producto del catálogo para cross-sell.
- **profiles** ahora se llena automáticamente vía un trigger (`handle_new_user`) al registrarse un cliente nuevo — antes existía en el esquema pero nada lo alimentaba, porque no había signup de cliente.

`organ_system`/`domain` usan el mismo vocabulario compartido (`HEALTH_SYSTEMS` en `packages/database/src/health-types.ts`) para poder consolidar encuesta + laboratorio en un solo dashboard "por sistema".

## RLS — reglas generales

- `anon` / `authenticated` (clientes): `SELECT` solo sobre `products`, `product_variants`, `categories`, `brands`, `promotions` donde `active = true`; sobre sus propios `orders`, `order_items`, `addresses`, `profiles`, `cart_items` (filtrado por `auth.uid()`).
- Ninguna política pública sobre `vetshipping_raw_catalog`, `product_overrides`, `pricing_rules`, `sync_runs`, `admin_users`, `audit_log` — cero excepciones, ni siquiera de solo lectura.
- Escritura en `orders`/`payments` únicamente desde Edge Functions con `service_role` (checkout y webhook de Wompi), nunca directo desde el cliente.

## Flujo resumido de precio

`vetshipping_raw_catalog.cost_price_cents` + `pricing_rules` (según categoría/marca o global) − `product_overrides.margin_percent_override` (si existe) → recalcula `products.price_cents` en cada corrida de sync. Esto permite que el equipo comercial ajuste márgenes por categoría sin tocar código.
