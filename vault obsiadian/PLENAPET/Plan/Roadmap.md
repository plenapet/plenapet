---
tipo: plan
proyecto: PlenaPet
actualizado: 2026-08-14
---

# Roadmap y fases

Estado global: **Fase 1 en curso — construcción local con datos mock**, sin Supabase todavía (a propósito, ver [[Registro-de-decisiones]]).

## Fase 0 — Fundaciones (setup)

- [x] Scaffold del monorepo (pnpm workspaces + Turborepo) — `apps/storefront` (tienda + `/admin`), `packages/ui`, `packages/database`, `packages/config`. *(Originalmente `apps/admin` era una app separada; se fusionó el 2026-08-17, ver [[Registro-de-decisiones]]).*
- [x] Design system base (tokens de color/tipografía de [[Resumen-marca]]) implementado en `packages/ui` + preset de Tailwind compartido.
- [x] Crear repositorio en GitHub (`github.com/plenapet/plenapet`) y hacer el primer push (2026-08-15).
- [x] Crear proyecto Supabase (`rgpowmszbotcwrubguek`) — falta aplicar el esquema, ver [[Preguntas-abiertas]].
- [x] Escribir la migración inicial (`supabase/migrations/0001_init.sql`) y el seed (`supabase/seed.sql`) a partir de [[Modelo-de-datos]] — **pendiente de ejecutar** en el proyecto real.
- [x] Implementar los repositorios Supabase en `packages/database` detrás de las mismas interfaces que el mock (se activan solos cuando el esquema esté aplicado y las env vars descomentadas).
- [x] **Migración y seed aplicados en el proyecto real de Supabase** (2026-08-15, confirmado por REST API) — `.env.local` de storefront y admin activados, ambas apps verificadas corriendo contra Supabase real sin errores, RLS confirmado bloqueando `vetshipping_raw_catalog` para el rol anon.
- [ ] Crear proyecto/branch de staging en Supabase (separado de producción) — hoy solo existe el proyecto único, se está usando como si fuera producción/desarrollo a la vez.
- [x] ~~Proyecto `plenapet-admin` creado y desplegado en Vercel~~ (2026-08-15) — **obsoleto desde la fusión del 2026-08-17**, ver [[Preguntas-abiertas]] sobre qué hacer con ese proyecto ahora.
- [ ] Desplegar el proyecto único (`apps/storefront`, tienda + `/admin`) en Vercel y configurar sus variables de entorno (incluye `SUPABASE_SERVICE_ROLE_KEY`, que antes solo vivía en el admin separado).
- [ ] Conectar dominios propios cuando estén definidos (ver [[Preguntas-abiertas]] sobre el dominio de PlenaPet).
- [ ] Resolver [[Preguntas-abiertas]] bloqueantes: entidad legal/NIT, dominio, cuenta Wompi (al menos sandbox).
- [ ] Obtener el archivo vectorial maestro del logo (SVG/AI/EPS) — hoy el sitio corre con un placeholder de marca, ver nota en [[Preguntas-abiertas]].

## Fase 1 — MVP

Objetivo: tienda funcional de punta a punta + panel de administración operable por el equipo que va a manejar la marca. **Primera pasada construida en local con datos mock** (`packages/database/src/mock`), antes de conectar Supabase — así el equipo ya puede navegar y validar la experiencia sin esperar la infraestructura.

**Storefront** (`apps/storefront`, corre en `localhost:3000`)
- [x] Home (hero con eslogan, 4 pilares, categorías, productos destacados).
- [x] Listado de categoría (`/productos`) con filtros: especie, etapa de vida, marca, categoría, precio máximo, búsqueda por nombre (vía formulario GET, sin JS necesario).
- [x] Ficha de producto (`/productos/[slug]`) con badges de presentación/etapa/especie, advertencia de "consulta a tu veterinario" en productos de fórmula, y sección de productos relacionados de la misma categoría.
- [x] Navegación móvil (menú hamburguesa) y buscador funcional en el Header (2026-08-17).
- [x] Breadcrumbs y metadata SEO dinámica (`generateMetadata`) en catálogo y ficha de producto.
- [x] Página 404 con identidad de marca (`not-found.tsx`).
- [x] Carrito (`/carrito`, estado con Zustand + localStorage) y checkout (`/checkout`) — **UI completa, pago con Wompi todavía no conectado** (botón deshabilitado con nota explícita).
- [ ] Cuenta de cliente: pedidos, direcciones (pendiente de Supabase Auth).
- [ ] Páginas legales (T&C, política de datos, garantías) — contenido pendiente de la entidad legal real, ver [[Preguntas-abiertas]].
- [ ] Fotografía real de producto (hoy placeholders de texto, ver [[Preguntas-abiertas]]).

**Admin** (`apps/storefront/src/app/admin`, sección `/admin` de la misma app — fusionada el 2026-08-17, ver [[Registro-de-decisiones]])
- [x] Layout con sidebar/topbar y navegación (Dashboard, Catálogo, Pedidos).
- [x] Dashboard con métricas básicas (productos activos, bajo stock, agotados, pedidos pendientes, ventas).
- [x] Vista de catálogo (solo lectura por ahora) con marca, categoría, precio, stock y si requiere fórmula.
- [x] Vista de pedidos (datos de demostración).
- [x] **Autenticación real** con Supabase Auth (`@supabase/ssr`) — `middleware.ts` protege todo `/admin/*` excepto `/admin/login`; el layout del panel además exige una fila activa en `admin_users`. Falta crear el primer usuario admin (ver [[Preguntas-abiertas]]).
- [ ] Roles diferenciados (`super_admin`, `catalog_manager`, `order_manager`, `support`) — hoy solo se valida `active`, no el rol específico.
- [ ] Curaduría de catálogo editable (publicar/ocultar, nombre/descripción/imágenes, márgenes) — hoy es de solo lectura porque no hay UI de edición todavía (la base de datos ya lo soporta vía `product_overrides`/`pricing_rules`).
- [ ] Botón "Sincronizar catálogo" conectado al adapter real (hoy está deshabilitado en la UI).

**Diseño**
- [x] Tokens de marca (color/tipografía) aplicados consistentemente en toda la app vía `packages/ui`.
- [ ] QA de marca completo contra el checklist de [[Resumen-marca]] — pendiente hasta tener el logo real y fotografía de producto real (hoy hay placeholders marcados con `TODO` en el código).

**Siguiente paso concreto**: crear el primer usuario admin (ver [[Preguntas-abiertas]]) y decidir qué hacer con el proyecto `plenapet-admin` de Vercel, que quedó obsoleto tras la fusión.

## Fase 2 — Crecimiento

- [ ] **Cuenta de cliente (Supabase Auth para compradores)** — se vuelve prerequisito real, no solo "nice to have", en cuanto arranque [[Vitalidad-y-Longevidad]] (Fase A de esa iniciativa necesita perfil de mascota atado a una cuenta).
- [ ] [[Vitalidad-y-Longevidad]] — dashboard de salud/edad biológica de mascotas (investigación hecha 2026-08-17, alcance todavía sin decidir por el usuario).
- [ ] Automatizar sincronización (pasar de adapter CSV a API o BD replica, según lo que se resuelva con VetShipping).
- [ ] Búsqueda mejorada (full-text de Postgres o motor dedicado si el catálogo lo justifica).
- [ ] Recompra/suscripción para consumibles (alimento, desparasitantes) — fuerte diferenciador de retención frente a Laika/Animals/Puppis.
- [ ] WhatsApp para soporte/campañas (canal ya contemplado en el manual de marca).
- [ ] Email transaccional y marketing.
- [ ] Reseñas/calificaciones de producto.
- [ ] SEO técnico y contenido editorial (blog de cuidado responsable, coherente con el arquetipo "Sabio cercano").

## Fase 3 — Escala

- [ ] Observabilidad (logs, alertas de fallos de sync/pago), backups y plan de recuperación.
- [ ] Revisión de roles/permisos del admin a medida que el equipo operador crece.
- [ ] Monitoreo antifraude en pagos.
- [ ] Bases para expansión a Latinoamérica (visión de marca) — internacionalización de precios/moneda/logística.

## Cómo actualizar este roadmap

Cada sesión de trabajo que cierre un ítem debe marcarlo aquí mismo (no solo en el chat). Si aparece una tarea nueva no prevista, agregarla a la fase correspondiente en vez de dejarla suelta en el historial de conversación.
