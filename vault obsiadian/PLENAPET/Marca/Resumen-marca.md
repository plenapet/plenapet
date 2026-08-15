---
tipo: referencia
proyecto: PlenaPet
fuente: Manual_Interno_de_Marca_PlenaPet.pdf v1.0 (agosto 2026)
actualizado: 2026-08-14
---

# Resumen de marca (uso operativo para diseño/desarrollo)

Condensado del Manual Interno de Marca para que cualquier sesión de desarrollo tenga los datos exactos sin tener que releer el PDF completo. Ante cualquier duda de interpretación, el PDF original manda.

## Esencia

- **Posicionamiento**: "PlenaPet es el petshop digital donde las familias encuentran todo lo que necesitan para cuidar bien a sus perros y gatos, con gran variedad, precios competitivos, orientación confiable y entrega a domicilio."
- **Eslogan**: "Todo para una vida plena." (con punto final si va sola; no combinar con otros lemas en la misma pieza; se puede omitir en espacios reducidos).
- **Personalidad**: confiable, cercana, práctica, moderna, responsable. Mezcla de carácter: 40% experta · 30% cercana · 20% práctica · 10% alegre.
- **No somos**: clínica veterinaria, marca infantil basada en ternura, marketplace sin curaduría, marca de descuentos permanentes/urgencia artificial.

## Paleta de color (usar hex exactos en Tailwind config / design tokens)

| Token | Hex | Uso |
|---|---|---|
| `azul-confianza` | `#17324D` | Logo, títulos, texto, botones primarios (texto blanco sobre este color). |
| `coral-cercania` | `#F47A63` | Huella, acentos, destacados, botones secundarios (texto azul-confianza sobre este color). |
| `aqua-bienestar` | `#77C9C5` | Fondos suaves, indicadores, apoyo visual. NO usar como fondo principal, solo superficie secundaria. |
| `crema-calido` | `#FFF9F2` | Fondo principal y piezas editoriales. |
| `gris-pizarra` | `#52616D` | Texto secundario, info funcional. |

Reglas de contraste (accesibilidad, no negociables):
- Coral y aqua **nunca** para texto pequeño; solo acento/fondo/elementos grandes.
- Botón azul → texto blanco. Botón coral o aqua → texto `azul-confianza`.

## Tipografía

- Principal: **Manrope** (Bold 700 titulares/precios, SemiBold 600 subtítulos/botones/nav, Regular 400 cuerpo).
- Fallback operativo si Manrope no carga: **Arial**.
- Jerarquía sugerida (digital): H1 40-48px Bold · H2 28-32px Bold · H3 20-24px SemiBold · Cuerpo 16-18px Regular · Auxiliar 13-14px Regular.
- **El logotipo NUNCA se recrea con Manrope/Arial ni otra fuente** — es un dibujo marcario, siempre archivo vectorial oficial.

## Logo — reglas duras para implementación

- Escritura: en texto correr `PlenaPet`; en el isotipo/wordmark es `plenapet` en minúscula. Nunca "PLENA PET", "Plena Pet", "Plenapets", "PlenaPets".
- 3 versiones aprobadas: full color (fondo claro), color invertido sobre azul, monocromático azul. Elegir según contraste del fondo — nunca colocar la versión principal sobre fondos con poco contraste o fotos saturadas.
- Con eslogan → piezas institucionales, portadas, empaques. Sin eslogan → header web, facturas, nav, espacios chicos.
- Área de seguridad: espacio libre mínimo = grosor vertical de la "P" alrededor del logo, nada lo puede invadir.
- Tamaños mínimos: logo con eslogan 180px ancho (digital) / 32mm (impresión); logo sin eslogan 120px / 22mm; isotipo 24px / 8mm.
- Avatar oficial: **solo el isotipo** centrado sobre fondo crema. Nunca el logo horizontal metido en un círculo.
- Prohibido: mover/inclinar/redimensionar los dedos de la huella, separar el corazón de la huella, estirar/rotar el logo, sombras/degradados/efectos 3D, cambiar de paleta (verde, morado, etc.), y — crítico para este proyecto — **combinar el logo con VetShipping o imitar su identidad visual**.
- Assets recibidos en esta sesión: PNG renders del logo (full color con/sin eslogan y monocromático). **Falta obtener del usuario los archivos vectoriales maestros (SVG/AI/EPS) y la licencia/archivos de la fuente Manrope** antes de construir el design system real — ver [[Preguntas-abiertas]].

## Voz y tono

Voz estable, tono adaptable por contexto:

| Contexto | Tono | Ejemplo |
|---|---|---|
| Venta | Útil y seguro | "Encuentra la presentación indicada y recíbela en casa." |
| Promoción | Energético, no desesperado | "Precio especial hasta el domingo o hasta agotar existencias." |
| Soporte | Empático y resolutivo | "Ya revisamos tu pedido. Te confirmamos la nueva hora de entrega." |
| Salud | Responsable y prudente | "Consulta con tu veterinario antes de iniciar o modificar un tratamiento." |
| Error | Transparente y reparador | "Nos equivocamos en la referencia. Te proponemos estas dos soluciones." |

Preferir: "mascota", "perro", "gato", "familia", "cuidado", "bienestar", "producto indicado", "precio especial", "recíbelo en casa".
Usar con moderación (no abusar en UI/copy de producto): "peludito", "consentido", "pet lover", "hijo de cuatro patas", "imperdible", "corre", "última oportunidad".

Nunca prometer resultados clínicos ni dar la impresión de que el chat/IA "formula" tratamientos — siempre remitir a criterio veterinario en productos de salud/medicados. Esto es tanto regla de marca como mitigación legal (venta de medicamentos veterinarios).

## Fotografía / imágenes de producto (regla crítica para el catálogo)

- **Los empaques deben ser reales.** Nunca alterar logos, texto, claims, colores, presentación, especie, tamaño o info regulatoria de un producto vía edición o IA generativa.
- Fondo blanco puro o crema muy claro, producto centrado, sin sombras duras.
- IA solo para fondos conceptuales/ilustraciones decorativas o borradores — nunca para inventar producto, empaque, testimonio o resultado clínico.
- Esto es una restricción **de producto**, no solo de diseño: el pipeline de ingesta de catálogo debe preservar imágenes oficiales del fabricante/VetShipping tal cual, sin pasarlas por generación de imágenes.

## Sistema digital (aplica directo al front del ecommerce)

- Botón primario: fondo `#17324D`, texto blanco. Botón secundario: fondo `#F47A63`, texto `#17324D`.
- Fondos: blanco o crema; aqua solo como superficie secundaria (nunca fondo global).
- Filtros de catálogo prioritarios (deben existir como filtros reales en el PLP): **especie, etapa de vida, peso, necesidad, marca, presentación, precio**.
- Productos de uso delicado (medicados, prescripción) deben mostrar advertencia clara + "consulta profesional" en la ficha — no es opcional, es checklist de gobernanza de marca.
- Formatos de pieza (redes/campañas) están documentados en el manual completo si se necesitan para marketing, no son bloqueantes para el desarrollo del sitio.

## Checklist de marca antes de publicar cualquier pieza/pantalla

(Copiado del manual, sección 17 — usar como QA final de cualquier pantalla del ecommerce)
- Nombre escrito como "PlenaPet".
- Logo con proporciones, colores y área de seguridad correctas (archivo oficial, no reconstruido).
- Huella con cuatro dedos alineados y corazón centrado.
- Producto/empaque real, no alterado.
- Mensaje claro, verificable, sin promesas clínicas.
- CTA con acción concreta.
- Precios/descuentos/unidades/vigencia confirmados.
- **Cero rastro de VetShipping** (ni en código fuente visible al cliente, ni en imágenes, ni en textos legales mal copiados).
- Contraste, zona segura y ortografía correctos.
- Datos legales/contacto corresponden al responsable jurídico real de PlenaPet (ver [[Preguntas-abiertas]] sobre entidad legal).
