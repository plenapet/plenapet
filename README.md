# PlenaPet

Monorepo del ecommerce PlenaPet (petshop digital B2C). Contexto completo del proyecto en [`CLAUDE.md`](./CLAUDE.md) y memoria de largo plazo en [`vault obsiadian/PLENAPET/00-Inicio.md`](<./vault obsiadian/PLENAPET/00-Inicio.md>).

## Estructura

```
apps/
  storefront/   # Una sola app Next.js: tienda pública + /admin (panel interno, protegido por login)
packages/
  ui/             # Design system compartido (tokens de marca + componentes)
  database/        # Tipos + capa de acceso a datos (mock o Supabase, según haya env vars)
  config/           # Presets compartidos de Tailwind/TypeScript
```

`apps/storefront/src/app/(storefront)/` es la tienda pública (sin autenticación). `apps/storefront/src/app/admin/` es el panel interno: `admin/login` es pública, todo lo demás bajo `admin/(panel)` exige sesión de Supabase Auth + una fila activa en `admin_users` (ver `middleware.ts` y `admin/(panel)/layout.tsx`).

## Estado

Fase actual: Supabase real conectado (esquema + RLS aplicados). Ver `Plan/Roadmap.md` en el vault para el detalle de fases.

## Requisitos

- Node.js 20+
- pnpm 10+ (`corepack enable` si no lo tienes)

## Uso

```bash
pnpm install
pnpm dev   # http://localhost:3000 — tienda pública en /, panel interno en /admin
```
