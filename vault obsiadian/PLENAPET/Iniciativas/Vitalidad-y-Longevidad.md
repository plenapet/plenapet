---
tipo: iniciativa
proyecto: PlenaPet
estado: investigación inicial — sin decisión de alcance todavía
actualizado: 2026-08-17
---

# Iniciativa: Vitalidad y Longevidad (edad biológica de mascotas)

## Origen

Juan Camilo propuso llevar a PlenaPet un modelo inspirado en **Humanolab** (Colombia): biomarcadores sanguíneos + encuestas de vida para estimar edad biológica y salud por sistema/órgano, con acompañamiento médico. La idea es un dashboard para el dueño con el estado de salud de su mascota + recomendaciones de bienestar/longevidad, y más adelante vender el examen como servicio.

## Qué hace Humanolab (referencia)

Analiza 100+ biomarcadores (73 medidos dos veces en un ciclo de 90 días), calcula una **edad biológica** y un **índice de longevidad**, y lo acompaña de consulta médica personalizada y un plan de seguimiento — no es solo "aquí están tus números", incluye un médico interpretando y guiando. ([humanolab.ai/co](https://www.humanolab.ai/co))

## Qué tan trasladable es esto a mascotas — resumen de la investigación

**1. La ciencia de "edad biológica" en perros/gatos existe y tiene dos caminos, con madurez muy distinta:**

- **Relojes epigenéticos (metilación del ADN)**: extremadamente precisos (error medio menor a 7 meses prediciendo edad cronológica en perros), pero son tecnología de laboratorio genómico especializado, cara y todavía de uso mayormente académico/investigación, no un test comercial masivo y barato hoy. ([PNAS](https://www.pnas.org/doi/10.1073/pnas.2120887119), [PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5391218/))
- **Algoritmos de edad biológica sobre exámenes de sangre estándar (hemograma + química sanguínea)**: mucho más viable comercialmente. Ya existe un algoritmo validado (Purina/Nestlé, publicado en *GeroScience*) entrenado con 829 perros seguidos 12 años, usando hemograma + perfil bioquímico + historia clínica — es decir, **los mismos exámenes que cualquier laboratorio veterinario ya hace hoy**, con una capa de interpretación/algoritmo encima. Este es el camino realista para un MVP.

**2. El componente de "encuesta de vida" también tiene un modelo científico público de referencia**: el *Dog Aging Project* (financiado por NIH, EE. UU.) usa una encuesta de 200+ preguntas (HLES: hábitos, ambiente, comportamiento, salud) para calcular un **índice de fragilidad** (acumulación de déficits de salud) — validado y publicado. No se debe copiar literalmente su encuesta (es propiedad de ese proyecto), pero sí la metodología general (índice de fragilidad por acumulación de déficits) es un enfoque científico estándar y replicable con preguntas propias. ([Nature Scientific Reports](https://www.nature.com/articles/s41598-025-28382-y), [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC10306367/))

**3. Ya existen laboratorios veterinarios clínicos en Colombia que hacen hemograma + química sanguínea, y al menos uno con toma de muestra a domicilio** (Pet Clinic Lab) — esto es clave: **PlenaPet no necesita construir ni operar un laboratorio**, puede asociarse con uno que ya opera y ya tiene logística de toma de muestra. Otros encontrados: Zoodiagnostic, Punto Vet, Idivet, Lab for Vets, Animals Center (todos Bogotá). Falta validar cuál tiene mejor cobertura/precio/calidad y si alguno ya ofrece un "panel de bienestar" empaquetado.

**4. Comparables comerciales**: Basepaws (comprado por Zoetis) vende test de ADN (no biomarcadores sanguíneos) con reporte de riesgos genéticos vía app/dashboard por suscripción — valida que **sí existe disposición de pago de dueños de mascota por este tipo de insight**, aunque la tecnología de base es distinta (genética, no bioquímica sanguínea). Zoetis también publica calculadoras de "edad fisiológica" simples (tablas de conversión), sin biomarcadores — un techo bajo que PlenaPet superaría fácilmente con un enfoque basado en datos reales del animal.

**5. Regulatorio (visto en investigación preliminar, no es asesoría legal)**: el ICA regula principalmente laboratorios de diagnóstico veterinario orientados a sanidad agropecuaria/enfermedades de reporte obligatorio (acreditación ISO/IEC 17025). Los laboratorios clínicos veterinarios de mascotas (los listados arriba) parecen operar bajo la práctica veterinaria general, no bajo un régimen especial adicional visible en esta investigación. **Esto no está confirmado con un abogado o con el gremio veterinario** — antes de vender el servicio hay que validarlo formalmente. Independientemente del resultado, **el patrón de Humanolab (biomarcadores + interpretación por un profesional) es el correcto a copiar por razones de responsabilidad, no solo de regulación**: un algoritmo solo, sin revisión veterinaria, entregando "tu mascota tiene esta edad biológica" sin acompañamiento, es un riesgo de marca y de credibilidad (choca directo con la regla ya existente en [[Resumen-marca]]: nunca prometer resultados clínicos, siempre remitir a criterio veterinario).

## Enfoque recomendado — por fases, no todo de una vez

### Fase A — Índice de bienestar por encuesta (sin sangre, sin laboratorio, rápido de construir)

Cuestionario propio (inspirado en la metodología de índice de fragilidad, no copiado) sobre hábitos, alimentación, actividad, síntomas observables, historia — produce un **puntaje de bienestar/vitalidad** + recomendaciones (alimentación, actividad, chequeos preventivos) + **cross-sell natural al catálogo** (ej. si el puntaje de movilidad es bajo, recomendar un condroprotector que ya está en el catálogo). Cero dependencia de laboratorios externos, cero fricción operativa, valida el apetito del usuario por esto antes de invertir en el componente de sangre.

**Requisito previo real, no opcional**: esto necesita que exista un perfil de mascota y una cuenta de cliente — hoy el storefront **no tiene ni una cosa ni la otra** (no hay tabla `pets`, no hay login de cliente, ver [[Modelo-de-datos]] y el roadmap). Este componente obliga a adelantar "cuenta de cliente" en el roadmap, no es un nice-to-have aparte.

### Fase B — Panel de sangre con laboratorio aliado

PlenaPet vende el "chequeo de vitalidad" como producto en el catálogo → coordina la toma de muestra a domicilio con el laboratorio aliado → el laboratorio entrega hemograma + química sanguínea → PlenaPet interpreta con un algoritmo propio (basado en el enfoque publicado de biomarcadores + rangos de referencia por especie/edad/raza) → un veterinario (propio o del aliado) revisa y aprueba el reporte antes de mostrarlo al dueño → dashboard con edad biológica estimada + salud por sistema (renal, hepático, hematológico, etc.) + recomendaciones, con el mismo patrón de acompañamiento profesional que usa Humanolab.

### Fase C — Diferenciación propia (horizonte largo, especulativo)

Con datos propios acumulados (y consentimiento), refinar el algoritmo; explorar biomarcadores adicionales (genéticos tipo Basepaws, o eventualmente epigenéticos si el costo baja). No comprometerse con esto todavía — es investigación, no producto.

## Qué necesitaría el modelo de datos (boceto, no implementado)

- `pets` — mascota del cliente: nombre, especie, raza, fecha de nacimiento/edad estimada, sexo, esterilizado, peso. **No existe hoy.**
- `wellness_surveys` — respuestas de la encuesta + puntaje calculado + fecha, por mascota.
- `biomarker_panels` / `biomarker_results` — orden del panel de sangre, estado de la muestra, valores por biomarcador + rango de referencia + laboratorio de origen.
- `health_recommendations` — recomendaciones generadas por una evaluación, idealmente enlazadas a productos del catálogo (`product_id`) para el cross-sell.
- `vet_reviews` — qué veterinario revisó/aprobó un reporte y cuándo, antes de publicarlo al dueño (control de calidad + responsabilidad profesional).

Esto es una extensión de [[Modelo-de-datos]], no un rediseño — se integra con lo que ya existe (`products`, `customers`).

## Qué NO se ha decidido todavía (para no perder esto entre sesiones)

- Con cuál laboratorio asociarse (Pet Clinic Lab es el candidato más fuerte por tener toma de muestra a domicilio ya operando, pero no está validado con ellos).
- Si ya hay o hace falta reclutar un veterinario asesor/revisor para el sign-off de los reportes.
- Precio y modelo comercial del panel (pago único vs. suscripción tipo Humanolab con seguimiento).
- Validación legal/regulatoria formal antes de vender el servicio (no solo la lectura preliminar de esta investigación).
- Si se arranca por Fase A (encuesta) antes de negociar cualquier cosa con laboratorios, que es la recomendación de este documento.

Ver [[Registro-de-decisiones]] para cuando el usuario resuelva estos puntos — se debe registrar ahí, no solo aquí.
