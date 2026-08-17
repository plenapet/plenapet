---
tipo: decisiones
proyecto: PlenaPet
actualizado: 2026-08-14
---

# Registro de decisiones (ADR log)

Formato: fecha · decisión · razón · quién la tomó. Agregar entradas nuevas al final, nunca borrar histórico (si una decisión se revierte, se agrega una entrada nueva que referencia la anterior).

## 2026-08-17 — Bug real encontrado al probar: falta fila en `profiles` para usuarios pre-existentes

Primer bug encontrado por el usuario probando de verdad: al crear una mascota, `insert or update on table "pets" violates foreign key constraint "pets_customer_id_fkey"`.

**Causa**: el trigger `handle_new_user` (migración 0003) solo corre para usuarios **nuevos** de `auth.users`. El usuario de prueba (`juancamilo965@gmail.com`) se había creado *antes* de que existiera ese trigger (cuando se dio de alta como admin) — se quedó sin fila en `profiles`, y `pets.customer_id` referencia `profiles.id`.

**Arreglo inmediato**: se insertó manualmente la fila faltante en `profiles` vía REST con `service_role` (no requirió migración, fue un fix de datos puntual).

**Arreglo estructural** (para que no le pase a nadie más): 
- Migración `0005_profiles_insert_policy.sql` — agrega policy de INSERT en `profiles` (`auth.uid() = id`), que faltaba (0001 solo tenía SELECT y UPDATE).
- `app/health/layout.tsx` ahora hace un `upsert` defensivo de la propia fila de `profiles` en cada carga de `/health/*` (con `ignoreDuplicates: true`, así que no pisa datos si ya existe) — respaldo del trigger para cualquier caso borde futuro.

**Pendiente**: aplicar `0005_profiles_insert_policy.sql` en el SQL Editor.

**De paso**, el usuario pidió que "raza" fuera un selector en vez de texto libre para evitar errores de escritura. Se agregó `packages/database/src/breeds.ts` (catálogo de razas comunes de perro/gato + "Otra" con texto libre como salida) y `NewPetForm.tsx` (client component: el selector de raza cambia según la especie elegida).

## 2026-08-17 — Lección aprendida: nunca comparar slug de URL contra id

Al construir los filtros de categoría/marca del catálogo público y "productos relacionados", se comparó directamente el slug que viene en la URL (`?categoria=desparasitantes`) contra `product.categoryId`. En el mock de desarrollo esto "funcionaba" por coincidencia (el id de cada categoría mock se definió igual a su slug), pero en Supabase real `categoryId`/`brandId` son UUID — la comparación nunca daba match y filtrar por categoría o marca devolvía cero resultados en producción, sin error visible, solo un catálogo vacío.

**Regla a partir de ahora**: cualquier filtro que llegue como slug desde la URL o un formulario debe resolverse primero a su `id` real (buscándolo en la lista de categorías/marcas ya cargada) antes de comparar contra los campos `categoryId`/`brandId` de un producto. Nunca comparar slug contra id directamente, ni asumir que coinciden solo porque el mock los hizo iguales.

**Por qué importa**: es la clase de bug que el mock no detecta pero sí un backend real, y no lanza excepción — silenciosamente muestra "0 resultados". Cualquier función nueva de filtrado/búsqueda debe probarse contra Supabase real, no solo contra el mock, antes de darse por terminada.

## 2026-08-17 — Fusión de storefront y admin en una sola app

El usuario preguntó por qué había dos proyectos de Vercel separados (storefront y admin) si conceptualmente es "una única página con un módulo administrativo". Se le explicaron las razones originales de separarlos (aislar la llave `service_role`, que el público no encuentre el login del equipo, deploys independientes) pero también que **no es la única arquitectura válida**: para el tamaño actual del equipo y del panel, una sola app con `/admin` protegido por login es una alternativa razonable y más simple de operar. El usuario eligió explícitamente unificar.

**Cambio hecho**: se movió todo `apps/admin` a `apps/storefront/src/app/admin/`, y `apps/admin` se eliminó del repo. Detalle técnico completo en [[Arquitectura-tecnica]] (sección "Autenticación y roles").

**Efecto colateral positivo obligado por el cambio**: como `/admin` ahora vive en el mismo dominio público que la tienda (antes estaba en un proyecto de Vercel distinto, con una URL separada — tampoco era seguridad real, pero sí un obstáculo adicional), se implementó de una vez **autenticación real** con Supabase Auth + `@supabase/ssr` en vez de dejar el login como UI de mentira. Antes de este cambio, el checklist de Fase 1 tenía "Autenticación de equipo vía Supabase Auth" como pendiente — se adelantó porque dejar `/admin` completamente abierto en el dominio público habría sido un hueco de seguridad real, no solo una tarea pendiente más.

**Pendiente para el usuario**: crear el primer usuario admin manualmente (Supabase Auth → Authentication → Add User) e insertar su fila en `admin_users` con `active = true` — ver [[Preguntas-abiertas]]. También hay que decidir qué hacer con el proyecto `plenapet-admin` en Vercel (ya no se usa; se puede borrar o dejarlo inactivo) y aplicar la migración `0002_admin_users_self_read.sql` pendiente.

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

## 2026-08-17 — Se construye PlenaPet Health como módulo aparte, dentro de la misma app

El usuario decidió el alcance real de [[Vitalidad-y-Longevidad]] (no solo la Fase A de encuesta que se había recomendado): **encuesta de bienestar + exámenes de laboratorio (hemograma, química sanguínea, uroanálisis, coprológico)**, con laboratorio aliado ya resuelto por el usuario (no había que evaluar opciones). El flujo es: el equipo interno carga manualmente los resultados que entrega el laboratorio, la plataforma consolida todo en un dashboard con estado general, por sistema/órgano y edad biológica estimada.

El usuario pidió explícitamente que esto se viera como **"PlenaPet Health"**, un módulo aparte del petshop, aunque viva en el mismo dominio y la misma cuenta de cliente. Se implementó como:
- Una sola cuenta de cliente (Supabase Auth, `/cuenta/login` y `/cuenta/registro`) para comprar Y para PlenaPet Health — no dos sistemas de login separados.
- `/health/*` como namespace de URL distinto, con su propio layout/header (`HealthHeader`, badge "Health" en aqua-bienestar) — visualmente separado del Header/Footer de la tienda, protegido por su propio chequeo de sesión en `middleware.ts`.
- Un enlace visible desde el Header de la tienda hacia `/health` (píldora en color aqua), para que se descubra como algo distinto sin salir del sitio.
- Del lado admin, una sección nueva `/admin/salud` (mismo patrón de auth ya existente para `/admin`), donde el equipo interno busca una mascota, crea un panel de laboratorio en borrador, carga analitos uno por uno, y lo publica cuando está listo (el dueño no ve nada hasta que se publica).

**Sobre la "edad biológica"**: se implementó como un **indicador propio, transparente y explicable** (deducido de qué tan lejos están los valores de laboratorio de su rango de referencia + el puntaje de la encuesta), **no como un modelo clínicamente validado**. La investigación en [[Vitalidad-y-Longevidad]] encontró un algoritmo publicado (Purina/GeroScience) pero no es replicable sin sus datos/coeficientes originales. Se decidió ser honestos con esto en la UI (texto explícito: "indicador orientativo, no un diagnóstico clínico, consulta a tu veterinario") en vez de aparentar una validación científica que no existe — coincide con la regla ya existente del manual de marca de no prometer resultados clínicos.

**Decisión técnica de alcance, no discutida explícitamente con el usuario pero razonable dado el tiempo**: las nuevas entidades (`pets`, `wellness_surveys`, `lab_panels`, `lab_results`, `health_recommendations`) no tienen implementación mock — se construyeron directo contra Supabase real, a diferencia del catálogo/pedidos que sí mantienen mock. Justificación: el mock existía para poder desarrollar antes de tener Supabase conectado; ese momento ya pasó, y buena parte de este módulo (autenticación de cliente) no se puede mockear de forma significativa de todas formas.

**Pendiente bloqueante**: la migración `supabase/migrations/0003_pet_health.sql` fue escrita pero el usuario todavía no la ha aplicado en el SQL Editor — sin eso, `/health` y `/admin/salud` no funcionan (fallarán al consultar tablas que no existen). Ver [[Preguntas-abiertas]].

## 2026-08-17 — Catálogo clínico de exámenes + estadificación IRIS real

El usuario pidió específicamente que el sistema le diga qué exámenes pedir al laboratorio (no texto libre), confirmando que en Colombia se pueden hacer hemograma, química sanguínea, uroanálisis y coprológico, pero no metilación de ADN.

**Construido**:
- `packages/database/src/exam-catalog.ts` — catálogo estándar de analitos por tipo de examen (hemograma, química, uroanálisis, coprológico), cada uno con sistema/órgano y rango de referencia por especie (perro/gato), basado en literatura de patología clínica veterinaria de uso común. Son valores de partida para agilizar la carga, no la verdad absoluta — el admin puede ajustarlos, y el rango que reporta el laboratorio real sigue siendo el autoritativo por panel.
- `getIrisStage()` en `health-scoring.ts` — **estadificación IRIS real** (estándar clínico veterinario mundial para enfermedad renal crónica, no un invento de PlenaPet), a partir de creatinina y/o SDMA. Cortes tomados de las guías IRIS más citadas — pendiente confirmar contra la tabla vigente en iris-kidney.com antes de uso clínico real.
- Migración `0004_lab_results_analyte_key.sql`: agrega `analyte_key` a `lab_results` para poder identificar analitos estándar (ej. creatinina, SDMA) de forma confiable en vez de comparar texto libre.
- Admin (`AddLabResultForm`): ahora selecciona del catálogo (autocompleta sistema/rango/unidad) en vez de texto libre en todos los campos; sigue existiendo "otro analito" para lo que no está en el catálogo.
- `/admin/salud/[petId]`: bloque colapsable "Exámenes recomendados" — lista completa del catálogo por tipo de examen con rangos para la especie de esa mascota, para que el admin sepa qué pedir al laboratorio antes de crear el panel.
- Dashboard del propietario y panel del admin muestran el estadio IRIS junto al puntaje del sistema renal cuando hay creatinina/SDMA cargados.

Ver investigación completa (fuentes, qué SÍ es adoptable de la ciencia publicada y qué no) en [[Vitalidad-y-Longevidad]].

**Pendiente**: aplicar `0004_lab_results_analyte_key.sql` en Supabase (mismo flujo SQL Editor de siempre) — sin eso, el estadio IRIS no puede calcularse porque no hay forma de identificar cuál resultado es la creatinina.

## 2026-08-14 — Separación de datos con VetShipping

- Decisión: el proyecto de Supabase de PlenaPet debe ser **independiente** del que use VetShipping (si aplica), no una instancia compartida. Razón: independencia de marca ante el consumidor + aislamiento de seguridad entre un negocio B2B y uno B2C con datos de pago de consumidores finales.
