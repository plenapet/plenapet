# PlenaPet

Monorepo del ecommerce PlenaPet (petshop digital B2C). Contexto completo del proyecto en [`CLAUDE.md`](./CLAUDE.md) y memoria de largo plazo en [`vault obsiadian/PLENAPET/00-Inicio.md`](<./vault obsiadian/PLENAPET/00-Inicio.md>).

## Estructura

```
apps/
  storefront/   # Sitio B2C (Next.js)
  admin/         # Back-office del equipo operador (Next.js)
packages/
  ui/             # Design system compartido (tokens de marca + componentes)
  database/        # Tipos + capa de acceso a datos (mock hoy, Supabase después)
  config/           # Presets compartidos de Tailwind/TypeScript
```

## Estado

Fase actual: construcción local con **datos mock** (sin Supabase todavía). Ver `Plan/Roadmap.md` en el vault para el detalle de fases.

## Requisitos

- Node.js 20+
- pnpm 10+ (`corepack enable` si no lo tienes)

## Uso

```bash
pnpm install
pnpm dev              # storefront (3000) + admin (3001)
pnpm dev:storefront    # solo storefront
pnpm dev:admin          # solo admin
```
