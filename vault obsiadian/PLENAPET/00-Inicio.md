---
tipo: moc
proyecto: PlenaPet
actualizado: 2026-08-14
---

# PlenaPet — Mapa del proyecto

Esta bóveda es la **memoria permanente** del proyecto PlenaPet. Cualquier sesión nueva (con Claude o con otra persona del equipo) debe empezar leyendo estas notas antes de tocar código, para no perder contexto ni repetir decisiones ya tomadas.

## Qué es PlenaPet

Petshop digital B2C (perros y gatos), +550 SKU entre alimentos, medicados, desparasitantes, vitaminas, suplementos, nutracéuticos, medicamentos y cuidado. Compite con Laika, Chiper... más precisamente con **Laika, Animals y Puppis**. Se abastece del inventario de **VetShipping** (distribuidora B2B del mismo dueño) pero debe operar como marca 100% independiente ante el consumidor — ver [[Independencia-de-marca]].

## Índice

- **Marca**
  - [[Resumen-marca]] — condensado operativo del Manual Interno de Marca (colores, tipografía, tono, reglas de uso del logo).
- **Arquitectura**
  - [[Arquitectura-tecnica]] — stack, estructura de repo, entornos, CI/CD.
  - [[Modelo-de-datos]] — esquema de base de datos (Supabase/Postgres).
  - [[Integracion-VetShipping]] — cómo se sincroniza el catálogo/stock sin acoplar las dos marcas.
  - [[Pagos-Wompi]] — flujo de pagos.
- **Plan**
  - [[Roadmap]] — fases de trabajo, entregables, estado actual.
- **Decisiones**
  - [[Registro-de-decisiones]] — ADR log: qué se decidió, cuándo y por qué.
- **Pendientes**
  - [[Preguntas-abiertas]] — cosas que solo Juan Camilo puede resolver (legal, dominio, accesos) y que bloquean o condicionan el trabajo.
- **Iniciativas** (líneas de negocio nuevas, todavía en investigación/decisión — no confundir con el roadmap de la tienda base)
  - [[Vitalidad-y-Longevidad]] — dashboard de salud/edad biológica de mascotas (biomarcadores + encuestas), inspirado en Humanolab.

## Estado actual (2026-08-17)

Una sola app Next.js (`apps/storefront`): tienda pública, `/admin` (equipo interno, login real) y `/health` (**PlenaPet Health**, módulo nuevo de bienestar/edad biológica de mascotas — cuenta de cliente + encuesta + resultados de laboratorio cargados por el admin + dashboard). Supabase real conectado, migraciones `0001`–`0003` aplicadas. Ver [[Roadmap]] para el detalle de fases y [[Registro-de-decisiones]] para las decisiones ya cerradas. **Falta probar PlenaPet Health de punta a punta en el navegador** — ver [[Preguntas-abiertas]].

## Regla de oro para cualquier sesión futura

Antes de proponer o cambiar algo estructural, revisar [[Registro-de-decisiones]] — si ya se decidió, no se re-discute sin una razón nueva y explícita del usuario. Si se toma una decisión nueva relevante (stack, modelo de datos, alcance, marca), **añadirla al registro**, no dejarla solo en el historial de chat.
