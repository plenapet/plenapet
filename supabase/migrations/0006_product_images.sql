-- Agrega soporte de imágenes reales de producto (hoy el catálogo solo tiene
-- placeholders de texto, ver Roadmap.md) y el bucket de Storage donde viven,
-- como parte de la primera migración de catálogo desde VetShipping.
-- Ver vault obsiadian/PLENAPET/Arquitectura/Integracion-VetShipping.md.

alter table products add column if not exists images text[] not null default '{}';

-- Bucket público de solo-lectura: las imágenes de producto no son sensibles,
-- y servirlas públicamente es lo que necesita el storefront para renderizarlas.
-- Solo service_role (el importador/migrador) puede escribir en él.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "public read product images" on storage.objects
  for select using (bucket_id = 'product-images');
