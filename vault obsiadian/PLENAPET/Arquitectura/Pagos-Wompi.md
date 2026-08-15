---
tipo: arquitectura
proyecto: PlenaPet
actualizado: 2026-08-14
---

# Pagos — Wompi

## Enfoque

**Widget de Checkout de Wompi embebido** en la página de pago de PlenaPet (no redirect a un checkout con marca Wompi genérica) — mantiene la experiencia dentro del sitio, alineado con el requisito de una experiencia "muy profesional" que compita con Laika/Animals/Puppis.

## Flujo

1. Cliente arma el carrito y llega a checkout en el storefront.
2. El storefront crea un `order` en estado `pending` (Supabase, vía función server-side, no directo desde el cliente).
3. El backend (Edge Function) genera la **firma de integridad** requerida por Wompi (referencia + monto + moneda + llave secreta) — esto nunca se calcula en el navegador.
4. Se monta el Widget de Wompi en el cliente con la llave pública + la firma, referencia del pedido y monto.
5. Wompi procesa el pago (tarjeta, PSE, Nequi) y notifica por **webhook** a `supabase/functions/wompi-webhook`.
6. El webhook verifica la firma del evento, actualiza `orders.status` / `payments`, de forma **idempotente** por `wompi_transaction_id` (Wompi puede reintentar el webhook).
7. El cliente es redirigido a una página de confirmación que consulta el estado real del pedido en la base de datos (no confía únicamente en el resultado que devuelve el widget en el navegador — el webhook es la fuente de verdad).

## Por qué el webhook manda sobre la respuesta del cliente

Un usuario puede cerrar la pestaña, perder conexión o manipular la respuesta del navegador. El estado de `orders` solo se marca `paid` cuando el webhook firmado de Wompi lo confirma server-side. Esto es estándar de cualquier integración de pagos seria y evita fraude/errores de estado.

## Entornos

- Staging: llaves **sandbox** de Wompi, para probar todo el flujo sin mover dinero real.
- Producción: llaves **live** — requiere que Juan Camilo tenga la cuenta comercial de Wompi ya aprobada para PlenaPet (ver [[Preguntas-abiertas]], la cuenta de Wompi debe estar a nombre de la entidad legal de PlenaPet, no de VetShipping, por independencia de marca y porque el dinero de cada negocio debe liquidarse por separado).

## Notas de UX (alineadas al manual de marca)

- Botón de pago: azul confianza `#17324D` con texto blanco (botón primario, ver [[Resumen-marca]]).
- Mensajes de error de pago deben seguir el tono "transparente y reparador" del manual — nunca un mensaje genérico de error técnico sin salida clara para el usuario.
