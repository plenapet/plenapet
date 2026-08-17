import type { HealthSystemKey } from "./health-types";

/**
 * Encuesta de bienestar propia de PlenaPet — preguntas propias, pero la
 * fórmula de puntaje replica exactamente el "Frailty Index" (FI) validado
 * en perros por Banzato et al. 2019 (Scientific Reports, revisado por
 * pares, open access): suma de los puntajes de déficit dividida entre el
 * número de ítems, dando un valor 0–1 (acá lo mostramos invertido a 0–100,
 * donde 100 = sin déficits). Ver vault/Iniciativas/Vitalidad-y-Longevidad.md
 * para el detalle completo de la investigación.
 *
 * Diferencia honesta con el estudio original: allí el FI lo calculaba un
 * veterinario combinando el examen clínico + la entrevista al dueño; acá es
 * autorreporte del dueño desde un formulario web. Es una adaptación
 * razonable del método, no una réplica exacta de la validación (que exigiría
 * evaluación veterinaria). El listado literal de los 33 ítems del estudio
 * (Anexo 1) no estaba disponible al construir esta versión — estos 16 ítems
 * propios se diseñaron siguiendo los mismos 3 criterios de inclusión que usó
 * el estudio: (1) el déficit se relaciona negativamente con la salud, (2)
 * aumenta con la edad, (3) no es ni demasiado raro ni demasiado frecuente.
 *
 * Cortes de riesgo citables (del estudio, N=401 perros, seguimiento 6 meses):
 * FI < 0.2 (score > 80) = fragilidad baja · FI 0.2–0.4 (score 60–80) =
 * fragilidad moderada, HR=9.21 de mortalidad vs. baja · FI ≥ 0.4 (score < 60)
 * = fragilidad alta, HR=18.06. El AUC de predicción de mortalidad a 6 meses
 * fue 0.852 usando el punto de corte FI=0.25 (score=75).
 *
 * Cada opción de respuesta tiene un `deficit` de 0 (sin señal de alerta) a 1
 * (señal de alerta clara). El puntaje de un dominio es 100 menos el promedio
 * de déficits de sus preguntas, en porcentaje.
 */

export interface SurveyOption {
  value: string;
  label: string;
  deficit: number;
}

export interface SurveyQuestion {
  id: string;
  domain: HealthSystemKey;
  text: string;
  options: SurveyOption[];
}

const FREQUENCY_OPTIONS: SurveyOption[] = [
  { value: "nunca", label: "Nunca", deficit: 0 },
  { value: "a_veces", label: "A veces", deficit: 0.5 },
  { value: "frecuente", label: "Frecuentemente", deficit: 1 },
];

const SI_ES_ALERTA: SurveyOption[] = [
  { value: "no", label: "No", deficit: 0 },
  { value: "si", label: "Sí", deficit: 1 },
];

const NO_ES_ALERTA: SurveyOption[] = [
  { value: "si", label: "Sí", deficit: 0 },
  { value: "no", label: "No", deficit: 1 },
];

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  // Movilidad y articulaciones
  {
    id: "movilidad_dificultad",
    domain: "movilidad",
    text: "¿Tiene dificultad para subir escaleras, saltar o levantarse?",
    options: FREQUENCY_OPTIONS,
  },
  {
    id: "movilidad_cojera",
    domain: "movilidad",
    text: "¿Cojea o se ve rígido después de descansar?",
    options: FREQUENCY_OPTIONS,
  },
  {
    id: "movilidad_actividad",
    domain: "movilidad",
    text: "¿Su nivel de actividad ha bajado notablemente en los últimos 6 meses?",
    options: FREQUENCY_OPTIONS,
  },
  // Digestivo
  {
    id: "digestivo_vomito",
    domain: "digestivo",
    text: "¿Ha tenido vómito o diarrea en el último mes?",
    options: FREQUENCY_OPTIONS,
  },
  {
    id: "digestivo_apetito",
    domain: "digestivo",
    text: "¿Su apetito es normal y estable?",
    options: NO_ES_ALERTA,
  },
  {
    id: "digestivo_peso",
    domain: "digestivo",
    text: "¿Ha cambiado de peso de forma notoria en los últimos meses (sin que sea buscado)?",
    options: SI_ES_ALERTA,
  },
  // Piel y pelaje
  {
    id: "piel_rascado",
    domain: "piel_pelo",
    text: "¿Se rasca, lame o muerde excesivamente alguna zona del cuerpo?",
    options: FREQUENCY_OPTIONS,
  },
  {
    id: "piel_aspecto",
    domain: "piel_pelo",
    text: "¿Su pelaje se ve opaco, con caspa o hay zonas sin pelo?",
    options: SI_ES_ALERTA,
  },
  {
    id: "piel_olor",
    domain: "piel_pelo",
    text: "¿Tiene mal olor persistente en piel u oídos?",
    options: SI_ES_ALERTA,
  },
  // Comportamiento y cognición
  {
    id: "comportamiento_cambios",
    domain: "comportamiento",
    text: "¿Ha notado cambios de comportamiento (ansiedad, desorientación, agresividad nueva)?",
    options: FREQUENCY_OPTIONS,
  },
  {
    id: "comportamiento_sueno",
    domain: "comportamiento",
    text: "¿Duerme notablemente más de lo esperado para su edad?",
    options: FREQUENCY_OPTIONS,
  },
  {
    id: "comportamiento_respuesta",
    domain: "comportamiento",
    text: "¿Responde con normalidad a su nombre, sonidos o al jugar?",
    options: NO_ES_ALERTA,
  },
  // General
  {
    id: "general_agua",
    domain: "general",
    text: "¿Bebe agua en una cantidad notablemente mayor o menor a lo usual?",
    options: SI_ES_ALERTA,
  },
  {
    id: "general_dental",
    domain: "general",
    text: "¿Tiene mal aliento persistente o problemas dentales visibles?",
    options: SI_ES_ALERTA,
  },
  {
    id: "general_preventivo",
    domain: "general",
    text: "¿Tiene al día vacunas y desparasitación?",
    options: NO_ES_ALERTA,
  },
  {
    id: "general_condicion_corporal",
    domain: "general",
    text: "¿Cómo describirías su condición corporal al tacto (costillas, cintura)?",
    // Categorías tomadas literalmente de Banzato et al. 2019 (escala WSAVA:
    // bajo peso <5, normal 5-6, sobrepeso >6 sobre 9). En ese estudio el
    // sobrepeso tuvo un efecto protector sobre la mortalidad a 6 meses
    // (HR=0.38 vs. bajo peso, la llamada "paradoja de la obesidad") — pero
    // seguimos marcándolo como déficit leve porque el sobrepeso sí es un
    // riesgo real y bien documentado para articulaciones, diabetes y otras
    // condiciones a mediano/largo plazo; no sería responsable que PlenaPet
    // diera a entender que el sobrepeso "no importa".
    options: [
      { value: "bajo_peso", label: "Se notan las costillas y la columna fácilmente (bajo peso)", deficit: 1 },
      { value: "normal", label: "Cintura visible, costillas se sienten con presión leve (normal)", deficit: 0 },
      { value: "sobrepeso", label: "Cuesta sentir las costillas, poca o ninguna cintura (sobrepeso)", deficit: 0.3 },
    ],
  },
  {
    id: "general_energia",
    domain: "general",
    text: "En general, ¿cómo calificarías su ánimo y energía en el día a día?",
    options: [
      { value: "excelente", label: "Excelente", deficit: 0 },
      { value: "bueno", label: "Bueno", deficit: 0.25 },
      { value: "regular", label: "Regular", deficit: 0.5 },
      { value: "bajo", label: "Bajo", deficit: 1 },
    ],
  },
];

export function computeSurveyScore(answers: Record<string, string>) {
  const deficitsByDomain: Partial<Record<HealthSystemKey, number[]>> = {};

  for (const question of SURVEY_QUESTIONS) {
    const answerValue = answers[question.id];
    const option = question.options.find((o) => o.value === answerValue);
    const deficit = option?.deficit ?? 1; // sin responder cuenta como señal de alerta
    (deficitsByDomain[question.domain] ??= []).push(deficit);
  }

  const domainScores: Partial<Record<HealthSystemKey, number>> = {};
  let totalDeficit = 0;
  let totalQuestions = 0;

  for (const [domain, deficits] of Object.entries(deficitsByDomain)) {
    const sum = deficits.reduce((a, b) => a + b, 0);
    domainScores[domain as HealthSystemKey] = Math.round(
      100 - (sum / deficits.length) * 100,
    );
    totalDeficit += sum;
    totalQuestions += deficits.length;
  }

  const overallScore = Math.round(100 - (totalDeficit / totalQuestions) * 100);

  return { domainScores, overallScore };
}
