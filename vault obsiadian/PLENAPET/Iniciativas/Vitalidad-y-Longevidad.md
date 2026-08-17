---
tipo: iniciativa
proyecto: PlenaPet
estado: v1 construida (encuesta + laboratorio manual + dashboard), pendiente probar end-to-end
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

## Qué se construyó (2026-08-17) — ver [[Registro-de-decisiones]] para el detalle técnico

Se saltó directo a Fase A + B combinadas (el usuario ya tenía laboratorio aliado resuelto): cuenta de cliente, perfil de mascota, encuesta de bienestar, carga manual de resultados de laboratorio desde `/admin/salud`, dashboard consolidado con puntaje por sistema y edad biológica estimada. Módulo separado en UX como **PlenaPet Health** (`/health`), mismo dominio y cuenta que el petshop.

## Investigación adicional — cómo acercarse a "clínicamente validado" (2026-08-17)

El usuario preguntó explícitamente cómo vincular el algoritmo clínicamente validado (el de Purina/GeroScience) en vez de usar solo una heurística propia. Conclusión de la investigación: **el algoritmo específico de Purina no es replicable ni licenciable** (es investigación con datos propietarios, no se publican los pesos/coeficientes del modelo completo) — pero **sí hay piezas reales, publicadas y gratuitas que se pueden adoptar directamente**, y todas funcionan con los exámenes que sí se pueden hacer en Colombia (hemograma, química sanguínea, orina, coprológico — el usuario confirmó que metilación de ADN no es viable acá, lo cual descarta los relojes epigenéticos sin que eso sea una pérdida real, porque no eran el camino comercial de todas formas):

- **Canine Frailty Index** (Banzato et al. 2019, *Scientific Reports*, revisado por pares, validado contra mortalidad real) — 33 ítems clínicos sumados y divididos entre el total, exactamente el mismo principio de "acumulación de déficits" que ya usa la encuesta de PlenaPet. **Pendiente**: conseguir el paper completo (Anexo 1) para replicar fielmente los 33 ítems exactos en vez de los 16 propios que se usaron como primera versión — no se pudo extraer el listado completo por las herramientas de investigación disponibles en esta sesión. ([PubMed](https://pubmed.ncbi.nlm.nih.gov/31727920/))
- **IRIS Staging** (International Renal Interest Society) para enfermedad renal crónica — el estándar clínico que usa cualquier veterinario en el mundo, gratuito, basado en creatinina y/o SDMA (ambos ya están en el catálogo de química sanguínea). **Ya implementado** (`getIrisStage` en `packages/database/src/health-scoring.ts`), con los cortes de las guías IRIS más citadas — deben confirmarse contra la tabla vigente en [iris-kidney.com](https://www.iris-kidney.com/iris-staging-system) antes de usarse con pacientes reales. ([IDEXX](https://www.idexx.com/en/veterinary/reference-laboratories/sdma/sdma-iris/), [IRIS Kidney](https://www.iris-kidney.com/iris-staging-system))
- Hay más investigación reciente que confirma que el camino de "hemograma + química" es donde está la ciencia activa: un estudio de 2026 en *GeroScience* entrenó un modelo de edad con 3+ millones de valores de laboratorio de ~145.000 labradores (XGBoost) — tampoco es un modelo que se pueda "instalar", pero refuerza que el enfoque de PlenaPet (hemograma + química como base) es el correcto.

**Decisión de cómo presentarlo**: en vez de un solo número "mágico" fingiendo validación total, PlenaPet debe ser honesto pieza por pieza — citar el Canine Frailty Index para la encuesta, IRIS para renal (ambos reales y verificables), y dejar claro que la "edad biológica" consolidada es la síntesis propia de PlenaPet de esas piezas. Es más creíble que inventar una validación que no existe, y es coherente con la regla de marca de nunca prometer resultados clínicos.

## El paper de Banzato et al. 2019 — leído completo (2026-08-17)

El usuario compartió el PDF completo del artículo (*Scientific Reports* 9:16749, open access CC-BY 4.0 — se puede citar y reutilizar la metodología libremente citando la fuente). Esto confirma y precisa lo que antes era una referencia genérica:

**Metodología exacta del Frailty Index (FI)**:
- 33 déficits de salud, elegidos con 3 criterios: (1) se relacionan negativamente con la salud, (2) aumentan con la edad, (3) ni muy raros ni muy frecuentes (evitan saturación). No se restringen a un solo sistema — deben cubrir varios, igual que hace `HEALTH_SYSTEMS` en el código.
- Cada déficit se puntúa 0 (ausente), 0.5 (leve) o 1 (presente/severo) — **exactamente el mismo esquema de "deficit" 0/0.5/1 que ya usa `wellness-survey.ts`**.
- FI = suma de puntajes / 33 (número de ítems) → valor 0–1. PlenaPet lo muestra invertido a escala 0–100 (100 = sin déficits) — conversión directa, mismo cálculo.
- Basado en el "standard procedure" de Searle et al. 2008 (*BMC Geriatrics*, también open access) — el método genérico de construcción de índices de fragilidad, reutilizado y adaptado a perros por Banzato.

**Resultados citables (N=401 perros, seguimiento 6 meses, Hospital Veterinario Universidad de Padua)**:
- FI medio general: 0.14 (DE 0.13). Por edad: jóvenes (2-6a) 0.08, medianos (7-10a) 0.11, viejos (10+a) 0.23.
- Correlación FI-edad: Spearman rho=0.51, p<0.001 — pero al combinar FI y edad en el modelo de riesgo, la edad sola dejó de ser significativa (p=0.343): **el FI captura más información pronóstica que la edad cronológica sola**, justificación directa de por qué PlenaPet combina encuesta + laboratorio en vez de mostrar solo la edad.
- Predicción de mortalidad a 6 meses: AUC=0.852 (IC95% 0.814–0.885) con punto de corte FI=0.25 (score=75 en nuestra escala invertida): sensibilidad 70%, especificidad 88.56%.
- Categorías de riesgo (usadas para Kaplan-Meier): FI<0.2 (score>80) referencia · FI 0.2–0.4 (score 60–80) HR=9.21 (IC95% 4.05–20.96) · FI≥0.4 (score<60) HR=18.06 (IC95% 6.54–49.88). **Estos cortes (80 y 60) ya coinciden exactamente con los umbrales que `scoreToStatus()` tenía implementados de antes** — coincidencia útil, ya no hace falta cambiar el código, solo citar la fuente real en vez de una justificación genérica.
- Condición corporal (BCS, escala WSAVA 1-9): protectora — sobrepeso (BCS>6) tuvo HR=0.38 vs. bajo peso (BCS<5) ("paradoja de la obesidad", también descrita en humanos). **No se implementó como "sobrepeso = bueno"** en el puntaje de PlenaPet a propósito: el sobrepeso sigue siendo un riesgo real y bien documentado para articulaciones/diabetes a mediano plazo, y sería irresponsable como marca sugerir lo contrario solo por este hallazgo puntual de un estudio. Se agregó como pregunta nueva de la encuesta (`general_condicion_corporal`) con un deficit leve (0.3) para sobrepeso, con el razonamiento documentado en el código.

**Dos brechas honestas que quedan (no resueltas, hay que decidir qué hacer)**:
1. **El Anexo 1 (listado literal de los 33 ítems) no vino en el PDF compartido** — el artículo principal no lo incluye, solo lo referencia ("attached as Annex 1"). Habría que conseguirlo desde el link de "Supplementary information" en la página del artículo en nature.com (`doi.org/10.1038/s41598-019-52585-9`), que normalmente es un PDF/documento aparte del artículo principal. Mientras tanto, los 16 ítems propios de PlenaPet siguen los mismos 3 criterios de inclusión del estudio, pero no son una réplica literal.
2. **El FI del estudio lo calculaba un veterinario** combinando examen clínico + entrevista al dueño + a veces pruebas diagnósticas — no es un autorreporte puro del dueño desde un formulario web, que es como está construido hoy en PlenaPet. Esto es una adaptación razonable pero reduce la confianza de que el puntaje de PlenaPet tenga exactamente la misma precisión predictiva reportada en el estudio. Una mejora futura sería que el puntaje de la encuesta también pueda ser revisado/ajustado por un veterinario antes de mostrarse como definitivo (mismo patrón `draft`/`published` que ya existe para los paneles de laboratorio).

**Caminos de mediano/largo plazo (no implementados, quedan para cuando haya tracción)**:
- Escribir a los autores del estudio de Purina/GeroScience para explorar colaboración académica (bajo costo, sin garantía de respuesta).
- Alianza con una universidad veterinaria colombiana para co-validar el modelo propio con datos reales.
- La única forma de tener un algoritmo *verdaderamente* validado por PlenaPet es replicar lo que hicieron Purina (12 años, 829 perros) y el Dog Aging Project: acumular datos propios de las mismas mascotas a lo largo del tiempo y correlacionarlos con desenlaces reales. No hay atajo — es función de tiempo y volumen de datos, no de ingeniería. Cada encuesta y panel cargado hoy es, sin saberlo, el primer dato de esa futura cohorte propia.
