---
tipo: decisiones
proyecto: PlenaPet
actualizado: 2026-08-14
---

# Registro de decisiones (ADR log)

Formato: fecha · decisión · razón · quién la tomó. Agregar entradas nuevas al final, nunca borrar histórico (si una decisión se revierte, se agrega una entrada nueva que referencia la anterior).

## 2026-08-14 — Alcance y marca

- **PlenaPet es B2C**, se abastece del inventario de VetShipping (B2B, del mismo dueño) pero debe operar como marca independiente: dominio, redes, WhatsApp, CRM y servicio al cliente propios; sin co-branding ni referencias visuales/textuales cruzadas. Fuente: Manual Interno de Marca v1.0 + instrucción explícita del usuario.
- El ecommerce será operado por un equipo distinto al del usuario — implica que el admin/back-office no es opcional ni "para después", debe ser usable por gente no técnica desde el día uno de producción.

## 2026-08-14 — Stack técnico

- **Supabase** como base de datos/auth/storage/functions, **Vercel** como hosting, **GitHub** como repo — indicado explícitamente por el usuario.
- **Wompi** como pasarela de pagos — indicado explícitamente por el usuario.
- Se añadió (decisión técnica, no pedida explícitamente pero necesaria): **Next.js (App Router) + TypeScript + Tailwind + shadcn/ui** para el frontend, por SEO/SSR y velocidad de desarrollo sin perder control del diseño. Ver [[Arquitectura-tecnica]].
- **Monorepo** (storefront + admin + paquetes compartidos) en vez de repos separados — se comparte design system y tipos de datos; se puede restringir acceso por carpeta más adelante sin migrar de repo.

## 2026-08-14 — Integración con VetShipping

- Pregunta hecha al usuario: ¿cómo se va a conectar PlenaPet al inventario de VetShipping (API, acceso a BD, exportación de archivos)? **Respuesta: aún no lo sabe, se pidió diseñar un enfoque flexible.**
- Decisión resultante: **patrón adapter** desacoplado (`packages/integrations/vetshipping`) con una interfaz estable (`fetchCatalog`, `fetchStock`) y múltiples implementaciones intercambiables. Se arranca con un **adapter de exportación de archivo (CSV)** para no bloquear el desarrollo del MVP; API o acceso a BD replica quedan como implementaciones futuras del mismo contrato. Ver [[Integracion-VetShipping]].
- El storefront nunca consulta VetShipping en tiempo real; todo pasa por tablas curadas propias de PlenaPet (`products`, alimentadas por un job de sync). Esto es tanto una decisión de arquitectura (resiliencia/desacople) como de marca (independencia).

## 2026-08-14 — Panel de administración

- Pregunta hecha al usuario: ¿el panel admin propio debe estar en el MVP o se puede operar al inicio desde Supabase Studio? **Respuesta: debe estar en el MVP (Fase 1).**
- Decisión resultante: la Fase 1 incluye una app `admin` completa (Next.js separado) con auth de equipo, roles, curaduría de catálogo, gestión de pedidos y dashboard básico. Ver [[Roadmap]] Fase 1.

## 2026-08-15 — Construcción local primero, con capa de datos mockeable

- Instrucción del usuario: construir el código de la web/módulos en local primero; la migración a Supabase y el push a GitHub vienen después.
- Decisión resultante: se implementó `packages/database` con **interfaces de repositorio** (`ProductRepository`, `CategoryRepository`, `BrandRepository`, `OrderRepository`) y una **implementación mock en memoria** con datos semilla representativos (24 productos, 7 categorías, 8 marcas). El resto del código (storefront, admin) consume únicamente las interfaces vía `getProductRepository()` etc. Cuando se conecte Supabase, solo cambia la implementación detrás de esas funciones factory en `packages/database/src/index.ts` — mismo patrón que el adapter de VetShipping. Ver [[Roadmap]].
- El repo vive directamente en la raíz del proyecto (`WEB PLENAPET/`), no en una carpeta `plenapet/` anidada — la estructura de `apps/` y `packages/` descrita en [[Arquitectura-tecnica]] cuelga de esa raíz, junto con `CLAUDE.md` y el vault.
- **Manrope se resuelve vía `next/font/google`** (es una fuente de código abierto, licencia SIL Open Font License) en vez de requerir archivos de licencia aparte — se cierra ese pendiente de [[Preguntas-abiertas]].
- El logo real (archivo vectorial oficial) sigue sin estar disponible: se construyó un **componente `Logo` marcado explícitamente como placeholder** en `packages/ui/src/components/Logo.tsx`, para poder navegar el sitio en desarrollo. Debe reemplazarse antes de cualquier entrega o despliegue real — ver [[Preguntas-abiertas]].
- El checkout de storefront tiene toda la interfaz (resumen de pedido, formulario de dirección) pero el botón de pago está deshabilitado con una nota visible — se decidió **no simular un flujo de pago falso** para no construir algo que pudiera confundirse con un pago real.

## 2026-08-15 — Repo de GitHub y proyecto de Supabase reales conectados

- El usuario entregó: URL del repo (`https://github.com/plenapet/plenapet.git`), URL del proyecto Supabase (`https://rgpowmszbotcwrubguek.supabase.co`), `anon key`, `service_role key` y un token clásico de GitHub para push.
- Se hizo **push del primer commit a `main`** en `github.com/plenapet/plenapet` con el estado completo del monorepo. El token de GitHub se usó de forma efímera (inline en la URL de push) y **no quedó guardado** en `.git/config` ni en ningún archivo del repo — quien vuelva a hacer push desde esta máquina necesita configurar sus propias credenciales (token, `gh auth login`, o SSH).
- La máquina no tenía identidad de git configurada (`~/.gitconfig` no existía). Por regla propia, Claude nunca modifica la configuración de git — el commit se hizo con `git -c user.name=... -c user.email=...` (override efímero solo para ese comando), usando el nombre/correo que el usuario autorizó, sin tocar la config global.
- **El esquema de Supabase (`supabase/migrations/0001_init.sql` + `supabase/seed.sql`) todavía NO está aplicado en el proyecto vivo** — se verificó con una consulta a la REST API y la tabla `products` no existe todavía (404). El usuario eligió aplicarlo él mismo pegando el SQL en el SQL Editor del dashboard de Supabase (opción más segura: no requiere compartir el password de la base de datos). Ver [[Preguntas-abiertas]] para el paso pendiente exacto.
- Las credenciales de Supabase quedaron guardadas en `apps/storefront/.env.local` y `apps/admin/.env.local` (gitignorados, nunca committeados) pero **comentadas/inactivas a propósito** — se activan solo cuando se confirme que la migración corrió, para no romper el desarrollo local apuntando a tablas que no existen. `packages/database` ya tiene implementaciones Supabase completas (`packages/database/src/supabase/`) detrás de las mismas interfaces que las mock — activar Supabase es literalmente descomentar dos líneas en cada `.env.local`.

## 2026-08-14 — Separación de datos con VetShipping

- Decisión: el proyecto de Supabase de PlenaPet debe ser **independiente** del que use VetShipping (si aplica), no una instancia compartida. Razón: independencia de marca ante el consumidor + aislamiento de seguridad entre un negocio B2B y uno B2C con datos de pago de consumidores finales.
