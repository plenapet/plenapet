---
tipo: arquitectura
proyecto: PlenaPet
actualizado: 2026-08-14
---

# Arquitectura técnica

## Stack

| Capa | Elección | Por qué |
|---|---|---|
| Frontend | **Next.js 14+ (App Router) + TypeScript** | SSR/ISR para SEO (crítico para competir con Laika/Animals/Puppis en búsqueda orgánica), buen soporte de imágenes, despliegue nativo en Vercel. |
| Estilos / UI | **Tailwind CSS** con tokens de marca + **shadcn/ui** como base de componentes (headless, se re-skinnea 100% con la paleta PlenaPet) | Velocidad de desarrollo sin sacrificar un diseño propio y "premium". |
| Base de datos / backend | **Supabase** (Postgres + Auth + Storage + Edge Functions + `pg_cron`) | Un solo proveedor para DB, auth, storage y jobs programados; RLS nativo de Postgres para separar datos públicos/admin/internos. |
| Pagos | **Wompi** (Colombia): Widget de Checkout embebido + Webhooks | Tarjetas, PSE, Nequi. Firma de integridad generada server-side, nunca en el cliente. |
| Hosting/deploy | **Vercel** (un solo proyecto) | Preview deployments por PR. Se evaluó separar storefront/admin en dos proyectos y se decidió unificar el 2026-08-17 — ver [[Registro-de-decisiones]]. |
| Repo | **GitHub**, monorepo | Un solo lugar para todo el código; permisos por CODEOWNERS cuando el equipo externo entre a operar la marca. |
| Automatización de catálogo | **Supabase Edge Functions + pg_cron** | Job de sincronización de catálogo desacoplado de VetShipping en tiempo de ejecución del sitio (ver [[Integracion-VetShipping]]). |

Decisión registrada en [[Registro-de-decisiones]].

## Estructura de repositorio (monorepo, pnpm workspaces + Turborepo)

Ya implementada — cuelga directamente de la raíz del proyecto (`WEB PLENAPET/`), junto a `CLAUDE.md` y este vault, sin una carpeta `plenapet/` intermedia.

```
WEB PLENAPET/            (raíz del repo)
├── apps/
│   └── storefront/          # Next.js — una sola app: tienda pública + /admin (panel interno)
│       ├── src/app/(storefront)/   # Rutas públicas: home, /productos, /carrito, /checkout
│       ├── src/app/admin/           # Panel interno: /admin/login (pública) + /admin/(panel)/* (protegida)
│       └── middleware.ts             # Gate de sesión para /admin/*
├── packages/
│   ├── ui/                   # Design system: tokens de marca, componentes compartidos
│   ├── database/              # Tipos generados de Supabase, queries compartidas, migraciones SQL
│   ├── integrations/
│   │   └── vetshipping/       # Adapter pattern de sincronización de catálogo (ver nota dedicada)
│   ├── payments/               # Cliente Wompi, verificación de firma, tipos de webhook
│   └── config/                  # eslint, tsconfig, tailwind preset compartidos
├── supabase/
│   ├── migrations/              # Historial de esquema (source of truth de la DB)
│   └── functions/                # Edge Functions: sync-catalog, wompi-webhook, etc.
├── .github/workflows/             # CI: lint, typecheck, test, build
├── CLAUDE.md
├── turbo.json
└── pnpm-workspace.yaml
```

**Por qué monorepo y no dos repos separados**: hoy el mismo dueño y equipo tocan storefront + admin + integración; comparten design system y tipos de datos. Cuando el equipo externo que va a operar PlenaPet crezca, se puede restringir acceso por carpeta con CODEOWNERS sin migrar de repo. Si en algún momento se decide separar (p. ej. por aislar credenciales de forma más estricta), es una decisión a registrar en [[Registro-de-decisiones]], no un default silencioso.

**Por qué una sola app y no dos (storefront/admin separados)**: se evaluaron ambas opciones (ver [[Registro-de-decisiones]], 2026-08-17). Con el tamaño actual del equipo y del panel administrativo, separar en dos proyectos de Vercel agregaba gestión operativa (dos deploys, dos dominios, dos configuraciones de env vars) sin un beneficio claro todavía, porque de todas formas viven en el mismo repo y el mismo proyecto de Supabase. Se optó por una sola app Next.js con `/admin` como sección protegida por Supabase Auth. Si el panel crece mucho o un equipo externo necesita desplegar el admin sin tocar la tienda, separar de nuevo es una opción abierta — no hay que rehacer el design system ni la capa de datos para eso, solo mover carpetas otra vez.

## Entornos

| Entorno | Supabase | Vercel | Uso |
|---|---|---|---|
| Local | Supabase CLI (Docker) | `next dev` | Desarrollo día a día. |
| Staging | Proyecto Supabase separado (o branch de Supabase) | Preview deployments automáticos por PR | QA antes de producción, pruebas de integración con Wompi **sandbox**. |
| Producción | Proyecto Supabase de producción | Deploy en `main` | Sitio real, Wompi en modo **live**. |

Importante: **el proyecto de Supabase de PlenaPet debe ser distinto e independiente del de VetShipping** (si VetShipping ya usa Supabase). No compartir instancia — es tanto una medida de independencia de marca como de aislamiento de seguridad/blast radius entre el negocio B2B y el B2C.

## Autenticación y roles

- Clientes (B2C): Supabase Auth (email/password + posible login social más adelante), tabla `profiles` 1:1 con `auth.users` — **todavía no implementado**, el storefront no tiene login de cliente aún.
- Equipo operador (admin): Supabase Auth (email/password) + tabla `admin_users` con rol (`super_admin`, `catalog_manager`, `order_manager`, `support`, hoy solo se valida `active`, los roles finos quedan para más adelante). Implementado con `@supabase/ssr`:
  - `middleware.ts` (matcher `/admin/:path*`): refresca la sesión y redirige a `/admin/login` si no hay usuario logueado.
  - `src/app/admin/(panel)/layout.tsx`: además verifica que el usuario tenga una fila activa en `admin_users` (si no, redirige con `?error=No autorizado`). Esta verificación usa el cliente con sesión (anon key), habilitado por una policy de RLS que solo deja a cada usuario leer su propia fila (`supabase/migrations/0002_admin_users_self_read.sql`).
  - Las páginas del panel siguen leyendo catálogo/pedidos con el cliente `service_role` de `@plenapet/database` (sin cambios) — la sesión de `@supabase/ssr` es solo para la puerta de acceso, no para las queries de datos.
  - `/admin/login` lleva `robots: noindex` porque ahora vive en el mismo dominio público que la tienda.
  - **Aprovisionar el primer admin es manual**: crear el usuario en Supabase Auth (dashboard) e insertar su fila en `admin_users` con `active = true`. No hay pantalla de self-signup a propósito (es una herramienta interna).

## CI/CD

- GitHub Actions en cada PR: lint, typecheck, build.
- Vercel: preview deployment automático por PR (un solo proyecto).
- Migraciones de Supabase: aplicadas vía SQL Editor del dashboard por ahora (ver [[Preguntas-abiertas]]) — **no auto-aplicar migraciones de producción sin revisión**, dado que hay datos de pagos/pedidos reales en juego.

## Seguridad e independencia de marca (aplica a nivel de arquitectura, no solo de diseño)

Ver también [[Independencia-de-marca]] (si no existe aún, crear al profundizar gobernanza) y la sección "Independencia y arquitectura de marca" del Manual de Marca.

- Dominio, DNS, cuentas de redes, WhatsApp Business, CRM/helpdesk y proveedor de email transaccional: cuentas propias de PlenaPet, no compartidas con VetShipping.
- Ningún identificador de VetShipping (analytics ID, pixel, dominio, nombre de empresa) debe aparecer en el bundle del cliente, en headers de respuesta, en facturas o en comunicaciones — es un ítem del checklist de QA de marca y también debería ser un check automatizable (grep de strings prohibidos en CI) una vez haya código.
- La sincronización de catálogo con VetShipping ocurre **server-to-server**, nunca desde el navegador del cliente ni expuesta en ninguna API pública de PlenaPet.
