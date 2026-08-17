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

- **Probar el flujo completo de PlenaPet Health de punta a punta** (nadie lo ha probado en el navegador todavía): registrar una cuenta de cliente en `/cuenta/registro` → agregar una mascota en `/health/mascotas/nueva` → completar la encuesta de bienestar → como admin, ir a `/admin/salud`, buscar esa mascota, crear un panel de laboratorio, agregar unos analitos y publicarlo → volver a `/health/mascotas/[id]` como cliente y confirmar que el dashboard muestra el puntaje por sistema y la edad biológica estimada correctamente.
- **Desplegar `apps/storefront` en Vercel** como el único proyecto — configurar `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY`.
- El CLI de Vercel de esta máquina está en una cuenta distinta (`juankana98s-projects`) a la que tiene los proyectos de PlenaPet — la gestión de Vercel se está haciendo desde el dashboard del usuario directamente, no desde este CLI. Ver memoria `plenapet-vercel-account`.
- Crear un proyecto/branch de **staging** separado en Supabase — hoy solo existe un proyecto y está haciendo de producción y desarrollo a la vez, lo cual es razonable por ahora pero hay que recordar separarlo antes de tener clientes reales.
- Para futuros push a GitHub desde esta u otra máquina: no hay credenciales guardadas (a propósito), hace falta un token/`gh auth login`/SSH configurado por quien vaya a pushear.

## Bloqueantes para producción (no para empezar a construir)

- **Entidad legal / NIT de PlenaPet**: para facturación, términos y condiciones, política de tratamiento de datos y la cuenta de Wompi. Debe ser distinta de la razón social visible de VetShipping (independencia de marca + separación de flujos de dinero). ¿Ya existe una sociedad/NIT para PlenaPet o hay que constituirla?
- **Dominio**: ¿cuál es el dominio definitivo (`plenapet.com`, `.co`, otro)? Necesario para configurar Vercel/DNS/email transaccional desde Fase 0.
- **Cuenta comercial de Wompi**: se puede arrancar en sandbox sin esto, pero producción la necesita, a nombre de la entidad legal de PlenaPet.

## Necesarios para Fase 1 (diseño/desarrollo)

- **Archivo vectorial maestro del logo** (SVG/AI/EPS de las 3 versiones) — hoy solo se cuenta con los PNG compartidos en el chat, no sirven como fuente de verdad para producción. El código ya corre con un **placeholder explícito** (`packages/ui/src/components/Logo.tsx`, marcado con comentario `PLACEHOLDER`) para no bloquear el desarrollo mientras tanto — debe reemplazarse antes de cualquier entrega real. *(La tipografía Manrope ya se resolvió: es de licencia abierta y se sirve vía `next/font/google`, sin necesidad de archivos aparte.)*
- **Fotografía real de empaques**: todo el catálogo mock hoy usa placeholders de texto en vez de imágenes (regla de marca: nunca inventar/alterar empaques) — se necesitan fotos reales de producto o archivos del fabricante/VetShipping antes de publicar.
- **Mecanismo real de integración con VetShipping** (API, acceso a BD, o exportación) y quién del lado de VetShipping puede construir/exponer eso — mientras tanto se avanza con el adapter CSV (ver [[Integracion-VetShipping]]), que todavía no se ha implementado en código (solo el catálogo mock de `packages/database`).
- **Base de datos maestra actual del catálogo de VetShipping**: estructura, campos disponibles (¿ya distingue especie/etapa de vida/peso/requiere receta?), para diseñar bien el mapeo hacia `product_overrides`.

## A definir con calma (no bloquean el arranque)

- Logística de última milla / zonas de cobertura y tarifas de envío — impacta el cálculo de `shipping_cents` en checkout.
- Política de productos que requieren fórmula/prescripción: ¿PlenaPet los vende libremente con advertencia (como indica el manual de marca) o hay alguna restricción regulatoria colombiana adicional a validar con un abogado?
- Nombre/marca legal para las comunicaciones de WhatsApp Business y remitente de email transaccional.
