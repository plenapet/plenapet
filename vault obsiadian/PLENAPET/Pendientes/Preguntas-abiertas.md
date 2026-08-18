---
tipo: pendientes
proyecto: PlenaPet
actualizado: 2026-08-14
---

# Preguntas abiertas / pendientes del usuario

Cosas que bloquean o condicionan el trabajo y que solo Juan Camilo (o su equipo legal/comercial) puede resolver. No asumir respuestas — preguntar cuando se llegue a la tarea que las necesita.

## Resuelto — Supabase ya está conectado (2026-08-15)

La migración y el seed se aplicaron en el proyecto real (`rgpowmszbotcwrubguek`) y ambas apps ya corren contra Supabase de verdad, no mock. Ver [[Registro-de-decisiones]].

## Resuelto — admin real y PlenaPet Health desplegados en código (2026-08-17)

Migraciones `0002_admin_users_self_read.sql` y `0003_pet_health.sql` aplicadas. Primer usuario admin creado (`juancamilo965@gmail.com`, `super_admin`). Proyecto `plenapet-admin` de Vercel borrado por el usuario (quedó obsoleto tras fusionar todo en `apps/storefront`).

## Siguiente paso inmediato

- **Aplicar las migraciones `0004_lab_results_analyte_key.sql` y `0005_profiles_insert_policy.sql`** en el SQL Editor de Supabase — sin la 0004 no se puede calcular el estadio IRIS; sin la 0005 el respaldo defensivo de `profiles` en `/health/mascotas/layout.tsx` no puede insertar (aunque el usuario de prueba actual ya quedó arreglado manualmente).
- **Seguir probando el flujo completo de PlenaPet Health de punta a punta**: ya se encontró y arregló un bug real (fila de `profiles` faltante); falta terminar de probar completar la encuesta, cargar resultados de laboratorio (creatinina/SDMA para ver el estadio IRIS) y publicar, y confirmar que el dashboard se ve bien.
- **Conseguir el Anexo 1 de Banzato et al. 2019** (el listado literal de los 33 ítems — el PDF del artículo principal que ya se leyó no lo incluye) desde "Supplementary information" en la página del artículo — para replicar fielmente la encuesta en vez de los 16 ítems propios usados como primera versión. Ver [[Vitalidad-y-Longevidad]].
- **Decidir si la encuesta de bienestar necesita revisión veterinaria** antes de mostrarse al dueño (como ya pasa con los paneles de laboratorio) — el estudio en que se basa el puntaje fue calculado por un veterinario, no autorreportado por el dueño; hoy PlenaPet lo deja como autorreporte puro.
- **Confirmar los cortes de estadificación IRIS** (`getIrisStage()`) contra la tabla vigente en iris-kidney.com antes de usarlos con pacientes reales — idealmente con el veterinario aliado.

## Resuelto — dominio `plenapet.com` confirmado y verificado en Resend (2026-08-18)

`plenapet.com` es el dominio real. Se verificó en resend.com/domains y ya se probó envío real sin restricción de sandbox. Actualizado en código: `EMAIL_FROM="PlenaPet <notificaciones@plenapet.com>"` y `NEXT_PUBLIC_SITE_URL=https://plenapet.com` (antes placeholder `plenapet.co`) en `.env.local`/`.env.example`. **Pendiente**: replicar estas mismas env vars en el proyecto de Vercel (hoy solo están locales) y conectar el dominio real en Vercel (DNS) — hasta entonces el sitio en producción sigue en `plenapet-storefront.vercel.app`.

## Email transaccional / Resend (2026-08-17, actualizado 2026-08-18)

- **`RESEND_API_KEY` solo está en `.env.local`** (no commiteado) — falta agregarla también como env var en el proyecto de Vercel para que los emails funcionen en producción (mismo paso que se hizo para las de Supabase). Ahora que el dominio está verificado, también hay que actualizar `EMAIL_FROM` en Vercel a `notificaciones@plenapet.com`.
- No se ha probado el flujo completo end-to-end en el navegador (registrarse y confirmar que llega el correo de bienvenida con el remitente real) — sí se confirmó por fuera que la API de Resend, la key y ahora el dominio verificado funcionan (envíos de prueba exitosos, incluido uno a un destinatario fuera de la cuenta de Resend).

## SEO (2026-08-17, actualizado 2026-08-18) — ver [[SEO]] para el detalle completo

- ~~Dominio real~~ — **resuelto**: `plenapet.com` ya está confirmado, `NEXT_PUBLIC_SITE_URL` actualizado. Falta conectarlo de verdad en Vercel (DNS) para que sitemap.xml/robots.txt/Open Graph/canonical sirvan URLs que respondan en producción y no solo en `.vercel.app`.
- **Verificar el sitio en Google Search Console** ahora que ya hay dominio confirmado — sin esto no hay forma de medir si el SEO está funcionando ni de saber qué keywords realmente traen tráfico.
- **Decidir si se invierte en contenido/blog**: la investigación confirmó que Laika gana buena parte de su tráfico con contenido educativo (`blog.laika.com.co`). PlenaPet Health tiene un ángulo diferenciador real (prevención con datos, nadie más lo ofrece en Colombia) pero hoy solo existe la landing — no se escribieron artículos de blog todavía.
- **Fotografía real de producto**: bloquea que el rich result de `Product` en Google se vea completo (hoy no manda `image` porque no hay fotos reales) — mismo pendiente de siempre, ahora con impacto directo en SEO también.
- **Desplegar `apps/storefront` en Vercel** como el único proyecto — configurar `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY`.
- El CLI de Vercel de esta máquina está en una cuenta distinta (`juankana98s-projects`) a la que tiene los proyectos de PlenaPet — la gestión de Vercel se está haciendo desde el dashboard del usuario directamente, no desde este CLI. Ver memoria `plenapet-vercel-account`.
- Crear un proyecto/branch de **staging** separado en Supabase — hoy solo existe un proyecto y está haciendo de producción y desarrollo a la vez, lo cual es razonable por ahora pero hay que recordar separarlo antes de tener clientes reales.
- Para futuros push a GitHub desde esta u otra máquina: no hay credenciales guardadas (a propósito), hace falta un token/`gh auth login`/SSH configurado por quien vaya a pushear.

## Bloqueantes para producción (no para empezar a construir)

- **Entidad legal / NIT de PlenaPet**: para facturación, términos y condiciones, política de tratamiento de datos y la cuenta de Wompi. Debe ser distinta de la razón social visible de VetShipping (independencia de marca + separación de flujos de dinero). ¿Ya existe una sociedad/NIT para PlenaPet o hay que constituirla?
- ~~Dominio~~ — **resuelto (2026-08-18)**: `plenapet.com`. Falta conectarlo en Vercel (DNS), ver sección de arriba.
- **Cuenta comercial de Wompi**: se puede arrancar en sandbox sin esto, pero producción la necesita, a nombre de la entidad legal de PlenaPet.

## Necesarios para Fase 1 (diseño/desarrollo)

- **Archivo vectorial maestro del logo** (SVG/AI/EPS de las 3 versiones) — hoy solo se cuenta con los PNG compartidos en el chat, no sirven como fuente de verdad para producción. El código ya corre con un **placeholder explícito** (`packages/ui/src/components/Logo.tsx`, marcado con comentario `PLACEHOLDER`) para no bloquear el desarrollo mientras tanto — debe reemplazarse antes de cualquier entrega real. *(La tipografía Manrope ya se resolvió: es de licencia abierta y se sirve vía `next/font/google`, sin necesidad de archivos aparte.)*
- **Fotografía real de empaques**: todo el catálogo mock hoy usa placeholders de texto en vez de imágenes (regla de marca: nunca inventar/alterar empaques) — se necesitan fotos reales de producto o archivos del fabricante/VetShipping antes de publicar.
- **Mecanismo real de integración con VetShipping** (API, acceso a BD, o exportación) y quién del lado de VetShipping puede construir/exponer eso — mientras tanto se avanza con el adapter CSV (ver [[Integracion-VetShipping]]), que todavía no se ha implementado en código (solo el catálogo mock de `packages/database`).
- **Base de datos maestra actual del catálogo de VetShipping**: estructura, campos disponibles (¿ya distingue especie/etapa de vida/peso/requiere receta?), para diseñar bien el mapeo hacia `product_overrides`.

## A definir con calma (no bloquean el arranque)

- Logística de última milla / zonas de cobertura y tarifas de envío — impacta el cálculo de `shipping_cents` en checkout.
- Política de productos que requieren fórmula/prescripción: ¿PlenaPet los vende libremente con advertencia (como indica el manual de marca) o hay alguna restricción regulatoria colombiana adicional a validar con un abogado?
- Nombre/marca legal para las comunicaciones de WhatsApp Business (el remitente de email transaccional ya quedó definido: `notificaciones@plenapet.com`).
