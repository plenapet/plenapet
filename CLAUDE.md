# PlenaPet — Contexto del proyecto

## Qué es esto

PlenaPet es un **ecommerce B2C** (petshop digital) que se está construyendo desde cero: perros y gatos, +550 SKU entre alimentos, farmacia veterinaria, desparasitantes, vitaminas, suplementos, nutracéuticos y cuidado. Compite directamente con **Laika, Animals y Puppis** — marcas experimentadas y bien posicionadas — por lo que el estándar de diseño y ejecución debe ser profesional de verdad, no un MVP genérico.

Se abastece del inventario de **VetShipping**, una distribuidora B2B para profesionales veterinarios, del mismo dueño. **Regla crítica que gobierna todo el proyecto**: PlenaPet debe operar y percibirse como una marca 100% independiente de VetShipping ante el consumidor y ante el mercado — sin co-branding, sin colores/isotipos compartidos, sin dominios/redes/CRM compartidos, sin ninguna referencia visible a VetShipping en el sitio, el código, las imágenes o las comunicaciones.

## Memoria persistente — leer antes de trabajar

Este proyecto usa un **vault de Obsidian como memoria permanente entre sesiones**, en `vault obsiadian/PLENAPET/`. Empezar siempre por [`vault obsiadian/PLENAPET/00-Inicio.md`](vault%20obsiadian/PLENAPET/00-Inicio.md) — es el índice de todo lo demás. Contiene:

- `Marca/Resumen-marca.md` — condensado operativo del Manual Interno de Marca (colores exactos, tipografía, tono, reglas duras del logo, checklist de QA).
- `Arquitectura/Arquitectura-tecnica.md` — stack, estructura de repo, entornos, CI/CD.
- `Arquitectura/Modelo-de-datos.md` — esquema de base de datos.
- `Arquitectura/Integracion-VetShipping.md` — cómo se sincroniza catálogo/stock sin acoplar las dos marcas (adapter pattern).
- `Arquitectura/Pagos-Wompi.md` — flujo de pagos.
- `Plan/Roadmap.md` — fases de trabajo y checklist de entregables, con estado actual.
- `Decisiones/Registro-de-decisiones.md` — ADR log: qué se decidió, cuándo y por qué. **Revisar antes de proponer algo que suene a decisión estructural nueva** — si ya está decidido, no se re-discute sin una razón nueva explícita del usuario.
- `Pendientes/Preguntas-abiertas.md` — cosas que solo el usuario puede resolver (entidad legal, dominio, cuenta Wompi, assets de marca reales, mecanismo real de integración con VetShipping).

**Regla de trabajo**: cualquier decisión estructural nueva (stack, modelo de datos, alcance, marca) o avance de fase se registra en el vault (no solo queda en el chat). El vault es la fuente de verdad de largo plazo; este `CLAUDE.md` es un resumen de arranque rápido.

## Resumen ejecutivo del stack (detalle completo en el vault)

- **Frontend**: Next.js (App Router) + TypeScript + Tailwind + shadcn/ui, dos apps — `storefront` (B2C) y `admin` (back-office) — en un monorepo.
- **Backend**: Supabase (Postgres + Auth + Storage + Edge Functions + `pg_cron`), proyecto **propio e independiente** del que use VetShipping.
- **Pagos**: Wompi, widget embebido + webhook como fuente de verdad del estado de pago.
- **Hosting**: Vercel (dos proyectos, uno por app). **Repo**: GitHub, monorepo.
- **Integración con VetShipping**: patrón adapter desacoplado, sync server-to-server (nunca en tiempo de request del cliente), empezando por un adapter de archivo (CSV) porque el mecanismo definitivo (API/BD/archivo) aún no está decidido por el usuario.

## Estado actual

**Fase 1 en curso.** Repo en `github.com/plenapet/plenapet` (push hecho a `main`) y **Supabase real ya conectado y verificado** (`rgpowmszbotcwrubguek`): esquema + RLS aplicados, seed cargado, ambas apps (`storefront` y `admin`) corriendo contra la base de datos real sin errores. `packages/database` ya no usa el mock por defecto en ninguna de las dos apps — el fallback a mock solo entra si algún día se corre sin `.env.local` configurado (por ejemplo, en una máquina nueva antes de copiar las credenciales). El admin/back-office está incluido desde ya, no diferido, porque PlenaPet lo va a operar un equipo distinto al del dueño. Ver `Plan/Roadmap.md` para el detalle fase por fase.

**Nota de credenciales**: no hay ninguna identidad de git ni credenciales de push guardadas en esta máquina de forma persistente (a propósito, así se decidió). Cualquier push futuro necesita que quien lo haga aporte sus propias credenciales.

```bash
pnpm install
pnpm dev              # storefront en :3000, admin en :3001
```

`packages/database` expone repositorios (`getProductRepository()`, etc.) que hoy devuelven una implementación **mock en memoria** (`packages/database/src/mock`, ~24 productos semilla). Storefront y admin solo conocen las interfaces — cuando se conecte Supabase, se cambia la implementación en un único punto (`packages/database/src/index.ts`) sin tocar el resto del código. Mismo patrón que el adapter de VetShipping.

**Placeholders activos a reemplazar antes de cualquier entrega real** (ambos marcados con `TODO`/comentarios explícitos en el código): el logo (`packages/ui/src/components/Logo.tsx`, a la espera del archivo vectorial oficial) y las imágenes de producto (hoy son cajas con el nombre en texto, a la espera de fotografía real de empaque).

## Cosas que no hay que olvidar nunca en este proyecto

1. **Cero acoplamiento visible con VetShipping** — ni en el bundle del cliente, ni en imágenes, ni en textos legales, ni en nombres de sistema expuestos.
2. **Los empaques de producto son reales y no se alteran** — nunca usar IA generativa para reconstruir un empaque, medicamento o claim de producto (regla de marca, con implicación regulatoria por tratarse de productos veterinarios/farmacia).
3. **Productos de uso delicado (medicados/prescripción) siempre muestran advertencia + remisión a criterio veterinario** — nunca dar a entender que el sitio o un chat "formula" un tratamiento.
4. **El storefront nunca lee VetShipping en vivo** — todo pasa por tablas curadas propias, alimentadas por un job de sincronización asíncrono.
5. Antes de dar por buena una pantalla nueva, pasarla por el checklist de marca en `Marca/Resumen-marca.md`.
