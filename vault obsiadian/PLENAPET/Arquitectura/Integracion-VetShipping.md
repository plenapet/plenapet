---
tipo: arquitectura
proyecto: PlenaPet
actualizado: 2026-08-14
---

# Integración con VetShipping

## Decisión de partida

Juan Camilo aún no ha definido **cómo** va a exponer VetShipping su inventario/catálogo a PlenaPet (¿API propia, acceso a BD, exportación de archivos?). Se decidió explícitamente (ver [[Registro-de-decisiones]]) diseñar una **capa de integración desacoplada (adapter pattern)** para no bloquear el desarrollo del ecommerce mientras esa decisión de negocio/técnica madura, y para poder cambiar de mecanismo de sincronización sin rediseñar el resto del sistema.

## Patrón: adapter + sync job

```
packages/integrations/vetshipping/
├── types.ts          # RawCatalogItem, StockUpdate — contrato estable
├── adapter.ts         # interface VetShippingAdapter { fetchCatalog(), fetchStock() }
├── adapters/
│   ├── csv.ts          # Implementación MVP: parsea un archivo subido/exportado
│   ├── api.ts            # Implementación futura: consume la API REST de VetShipping
│   └── db-replica.ts      # Implementación futura: lee de una réplica/vista de solo lectura
└── sync.ts                # Orquesta: adapter.fetchCatalog() → upsert en vetshipping_raw_catalog → recalcula products
```

Todo el resto del sistema (storefront, admin, checkout, `products`) le habla únicamente a las tablas curadas de PlenaPet (ver [[Modelo-de-datos]]), nunca al adapter directamente. Cambiar de CSV a API el día de mañana es cambiar una implementación detrás de la misma interfaz — cero impacto en el storefront.

## Por qué empezar por el adapter CSV en el MVP

- No depende de que el equipo de VetShipping construya nada nuevo para arrancar.
- Es la opción más desacoplada posible: ni siquiera hay una conexión de red entre los dos sistemas, solo un archivo.
- Da tiempo a decidir con calma (y con el equipo de VetShipping) si vale la pena invertir en una API o acceso a BD — que sí tiene sentido más adelante para reducir el rezago de stock/precio.
- El panel de administración de PlenaPet (Fase 1, ya decidido que existe desde el MVP) puede tener una pantalla simple "Sincronizar catálogo" con carga de archivo + botón, operada por el equipo comercial sin depender de un desarrollador.

## Ejecución del sync

- Supabase Edge Function `sync-catalog`, invocable:
  - Manualmente desde el admin (subida de archivo → llama a la función).
  - Programada vía `pg_cron` (ej. diario) una vez haya un adapter que no dependa de subida manual (API o BD).
- Cada corrida queda registrada en `sync_runs` (ver [[Modelo-de-datos]]) con conteo de filas y errores — necesario para que el equipo operador confíe en el catálogo sin tener que revisar código.
- El cálculo de `products.price_cents` a partir del costo de VetShipping + `pricing_rules` + `product_overrides` ocurre **dentro** de esta función, no en el storefront.

## Reglas no negociables

1. El storefront **jamás** hace una llamada de red hacia VetShipping en tiempo de request de un usuario — todo pasa por las tablas curadas de PlenaPet, alimentadas de forma asíncrona.
2. Ningún identificador, SKU externo, nombre de sistema o URL de VetShipping se expone en ninguna respuesta pública ni en el HTML/JS que llega al navegador del cliente.
3. Las imágenes de producto sincronizadas se preservan tal cual (regla de marca, ver [[Resumen-marca]]) — el pipeline no las reprocesa con IA generativa ni las reetiqueta con datos falsos.
4. El equipo comercial de PlenaPet decide, vía `product_overrides`, qué productos del catálogo de VetShipping se publican, con qué nombre/descripción cara al cliente y con qué margen — la sincronización nunca publica un producto nuevo automáticamente sin pasar por esa curaduría (evita, por ejemplo, publicar por error un producto exclusivo para uso profesional/veterinario que no debería venderse directo a consumidores).

## Pendiente de negocio

Ver [[Preguntas-abiertas]] — falta que Juan Camilo defina con el equipo de VetShipping el mecanismo real y el timeline para pasar del adapter CSV a uno más automatizado.
