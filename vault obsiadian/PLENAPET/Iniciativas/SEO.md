---
tipo: iniciativa
proyecto: PlenaPet
estado: v1 técnica implementada (2026-08-17) — falta contenido/dominio real y medición
actualizado: 2026-08-17
---

# SEO — Petshop y PlenaPet Health

Objetivo del usuario: aparecer primero cuando alguien busca dónde comprar productos veterinarios, y que PlenaPet Health aparezca cuando alguien busca prevención para su mascota.

## Investigación — competencia

| Competidor | Perfil | Fortaleza SEO |
|---|---|---|
| **Laika** (laika.com.co) | Líder de categoría en Colombia/LatAm, +4.000 productos, omnicanal (app + tiendas físicas) | Domain Rating muy alto, blog de contenido activo (`blog.laika.com.co`, artículos por especie/tema: nutrición, alergias, cuidado). Imposible superarlos en términos genéricos como "comida para perros" a corto plazo. |
| **Puppis** (puppis.com.co) | Cadena física con 34 tiendas + online, presencia en Rappi/Mercado Libre/Merqueo | Fuerte en marca física + marketplaces, menos enfocado en contenido/blog. |
| **Animal's** (animalsveterinaria.com) | 28 años, fuerte en Bogotá, domicilio local | Marca local consolidada, SEO probablemente más débil fuera de Bogotá. |
| Otros relevantes | Agrocampo, KeikoPets, Petcol, Cruz Pet, Ceba, DoctorPet, Livepetter, Petus, Pet Gold, La Res, Petit Paws | Mercado fragmentado — ningún jugador domina "long tail" de forma abrumadora fuera de Laika. |

**Conclusión clave** (coincide con lo que recomienda cualquier fuente seria de SEO para pet shops): competir de frente contra Laika en términos genéricos de cabeza ("comida para perros", "veterinaria online Colombia") es una batalla de presupuesto que Laika ya ganó. La oportunidad real está en **long-tail + especialización + un ángulo que ningún competidor tiene todavía: prevención basada en datos (PlenaPet Health)**. Ninguno de los competidores listados ofrece algo parecido a un dashboard de edad biológica/salud por sistemas — es terreno prácticamente vacío en Colombia.

## Investigación — patrones de búsqueda reales encontrados

**Petshop / transaccional** (intención de compra):
- `[producto] + [especie] + precio/comprar/domicilio/online` — ej. "desparasitante para perros precio", "antipulgas para gatos comprar online", "farmacia veterinaria a domicilio Bogotá".
- Fuerte componente **local**: muchas búsquedas incluyen ciudad ("Bogotá", "Medellín") — oportunidad para contenido/landing con foco geográfico más adelante.
- Cabezas de categoría con mucho volumen pero muy competidas: "alimento para perros", "comida para gatos", "veterinaria online".

**PlenaPet Health / prevención** (intención informativa, mucho menos competida):
- "edad biológica de mi perro/gato" — búsqueda real confirmada, con contenido existente pero genérico (tablas de conversión tipo "1 año perro = 7 años humanos"), nada con datos reales del animal.
- "chequeo preventivo mascota", "chequeo veterinario anual", "medicina preventiva perros y gatos".
- "prevención de enfermedades en mascotas", "salud preventiva mascota Colombia".
- Cola larga por sistema: "salud renal en perros", "exámenes de sangre para mascotas", etc.

## Qué se implementó (2026-08-17)

### 1. Arreglo estructural crítico: `/health` era 100% invisible para buscadores

Antes, **toda** la ruta `/health/*` exigía sesión — cualquier visitante no autenticado (incluido Googlebot) era redirigido de inmediato a `/cuenta/login`, una página sin contenido sobre qué es PlenaPet Health. Era literalmente imposible que apareciera en resultados de búsqueda, sin importar qué tan bien optimizado estuviera el contenido.

**Arreglo**: se separó el namespace en dos:
- `/health` — landing pública, indexable, con contenido real orientado a las keywords de prevención investigadas (hero, cómo funciona, por qué importa la prevención citando el Frailty Index e IRIS, FAQ con schema `FAQPage`).
- `/health/mascotas/*` — la app real (lista de mascotas, encuesta, dashboard), sigue exigiendo cuenta, con `robots: noindex` explícito.

El middleware, el header (`HealthHeader`, ahora funciona logueado o no) y todos los enlaces/redirecciones internas se actualizaron para reflejar el split. Ver `Registro-de-decisiones.md`.

### 2. Técnico

- `app/sitemap.ts` — sitemap dinámico: home, `/productos`, `/health`, todas las categorías y todos los productos activos.
- `app/robots.ts` — permite todo excepto `/admin`, `/cuenta`, `/health/mascotas`, `/carrito`, `/checkout`.
- `src/lib/site-url.ts` — constante `SITE_URL` (env `NEXT_PUBLIC_SITE_URL`, con placeholder `https://plenapet.co` hasta que haya dominio real — **actualizar ahí, no en cada archivo**).
- **JSON-LD**: `OnlineStore` + `SearchAction` en home; `Product` (con `Offer`, precio, disponibilidad) y `BreadcrumbList` en ficha de producto y catálogo; `FAQPage` en la landing de Health.
- **Metadata**: `metadataBase`, Open Graph y Twitter card por defecto en el layout raíz; `canonical` explícito en producto, catálogo y categorías (los filtros que no son categoría —marca, precio, etapa— no generan variantes canónicas aparte, para no diluir con contenido casi-duplicado); páginas de búsqueda interna (`?q=`) marcadas `noindex` a propósito.
- Títulos/descripciones reescritos con las keywords reales investigadas (precio, domicilio, Colombia, por especie) sin caer en keyword stuffing — se mantiene el tono del manual de marca.

## Qué falta (pendiente, no bloquea lo ya construido)

- **Dominio real** — sitemap/robots/OG usan el placeholder `plenapet.co`; hay que actualizar `NEXT_PUBLIC_SITE_URL` en Vercel en cuanto haya dominio confirmado (ver `Preguntas-abiertas.md`).
- **Fotografía real de producto** — Google Shopping/rich results de `Product` funcionan mucho mejor con imagen; hoy no hay `image` en el schema porque no hay fotos reales todavía.
- **Contenido/blog** — Laika gana gran parte de su tráfico orgánico con contenido educativo. PlenaPet Health ya tiene el ángulo diferenciador (prevención con datos); falta escribir artículos long-tail reales (ej. "cómo saber si mi perro tiene enfermedad renal temprana", "qué es un hemograma en perros") — no se escribió contenido de blog en esta pasada, solo la landing.
- **SEO local** (páginas o contenido por ciudad) — se identificó como oportunidad pero no se construyó.
- **Google Search Console / Analytics** — no hay forma de medir qué tan bien está funcionando nada de esto sin verificar el dominio en Search Console una vez exista. Sin esto, cualquier afirmación de "estamos rankeando #1" es imposible de comprobar.
- **Google Business Profile** — recomendado en la investigación para SEO local de petshops; no aplica todavía sin dirección física/logística definida.

Ver también [[Vitalidad-y-Longevidad]] para el contexto de negocio de PlenaPet Health.
