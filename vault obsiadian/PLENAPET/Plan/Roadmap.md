---
tipo: plan
proyecto: PlenaPet
actualizado: 2026-08-14
---

# Roadmap y fases

Estado global: **Fase 1 en curso — construcción local con datos mock**, sin Supabase todavía (a propósito, ver [[Registro-de-decisiones]]).

## Fase 0 — Fundaciones (setup)

- [x] Scaffold del monorepo (pnpm workspaces + Turborepo) — `apps/storefront`, `apps/admin`, `packages/ui`, `packages/database`, `packages/config`.
- [x] Design system base (tokens de color/tipografía de [[Resumen-marca]]) implementado en `packages/ui` + preset de Tailwind compartido.
- [x] Crear repositorio en GitHub (`github.com/plenapet/plenapet`) y hacer el primer push (2026-08-15).
- [x] Crear proyecto Supabase (`rgpowmszbotcwrubguek`) — falta aplicar el esquema, ver [[Preguntas-abiertas]].
- [x] Escribir la migración inicial (`supabase/migrations/0001_init.sql`) y el seed (`supabase/seed.sql`) a partir de [[Modelo-de-datos]] — **pendiente de ejecutar** en el proyecto real.
- [x] Implementar los repositorios Supabase en `packages/database` detrás de las mismas interfaces que el mock (se activan solos cuando el esquema esté aplicado y las env vars descomentadas).
- [x] **Migración y seed aplicados en el proyecto real de Supabase** (2026-08-15, confirmado por REST API) — `.env.local` de storefront y admin activados, ambas apps verificadas corriendo contra Supabase real sin errores, RLS confirmado bloqueando `vetshipping_raw_catalog` para el rol anon.
- [ ] Crear proyecto/branch de staging en Supabase (separado de producción) — hoy solo existe el proyecto único, se está usando como si fuera producción/desarrollo a la vez.
- [ ] Crear dos proyectos en Vercel (storefront, admin) y conectar dominios.
- [ ] Resolver [[Preguntas-abiertas]] bloqueantes: entidad legal/NIT, dominio, cuenta Wompi (al menos sandbox).
- [ ] Obtener el archivo vectorial maestro del logo (SVG/AI/EPS) — hoy el sitio corre con un placeholder de marca, ver nota en [[Preguntas-abiertas]].

## Fase 1 — MVP

Objetivo: tienda funcional de punta a punta + panel de administración operable por el equipo que va a manejar la marca. **Primera pasada construida en local con datos mock** (`packages/database/src/mock`), antes de conectar Supabase — así el equipo ya puede navegar y validar la experiencia sin esperar la infraestructura.

**Storefront** (`apps/storefront`, corre en `localhost:3000`)
- [x] Home (hero con eslogan, 4 pilares, categorías, productos destacados).
- [x] Listado de categoría (`/productos`) con filtros: especie, etapa de vida, marca, categoría, precio máximo (vía formulario GET, sin JS necesario).
- [x] Ficha de producto (`/productos/[slug]`) con badges de presentación/etapa/especie y advertencia de "consulta a tu veterinario" en productos de fórmula.
- [x] Carrito (`/carrito`, estado con Zustand + localStorage) y checkout (`/checkout`) — **UI completa, pago con Wompi todavía no conectado** (botón deshabilitado con nota explícita).
- [ ] Cuenta de cliente: pedidos, direcciones (pendiente de Supabase Auth).
- [ ] Páginas legales (T&C, política de datos, garantías) — contenido pendiente de la entidad legal real, ver [[Preguntas-abiertas]].

**Admin** (`apps/admin`, corre en `localhost:3001`)
- [x] Layout con sidebar/topbar y navegación (Dashboard, Catálogo, Pedidos).
- [x] Dashboard con métricas básicas (productos activos, bajo stock, agotados, pedidos pendientes, ventas) sobre datos mock.
- [x] Vista de catálogo (solo lectura por ahora) con marca, categoría, precio, stock y si requiere fórmula.
- [x] Vista de pedidos (datos de demostración).
- [x] Pantalla de login — **UI únicamente, sin autenticación real todavía**.
- [ ] Autenticación de equipo + roles (`super_admin`, `catalog_manager`, `order_manager`, `support`) vía Supabase Auth.
- [ ] Curaduría de catálogo editable (publicar/ocultar, nombre/descripción/imágenes, márgenes) — hoy es de solo lectura porque no hay dónde persistir los cambios sin base de datos.
- [ ] Botón "Sincronizar catálogo" conectado al adapter real (hoy está deshabilitado en la UI).

**Diseño**
- [x] Tokens de marca (color/tipografía) aplicados consistentemente en ambas apps vía `packages/ui`.
- [ ] QA de marca completo contra el checklist de [[Resumen-marca]] — pendiente hasta tener el logo real y fotografía de producto real (hoy hay placeholders marcados con `TODO` en el código).

**Siguiente paso concreto**: conectar Supabase (schema de [[Modelo-de-datos]], RLS) y reemplazar las implementaciones `Mock*Repository` de `packages/database` por implementaciones Supabase detrás de la misma interfaz — el resto del código (páginas, componentes) no debería necesitar cambios por ese swap.

## Fase 2 — Crecimiento

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
