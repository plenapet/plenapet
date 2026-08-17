import type { HealthSystemKey } from "./health-types";

/**
 * Encuesta de bienestar propia de PlenaPet — preguntas propias, pero el
 * enfoque de puntaje (acumulación de déficits de salud observables) sigue
 * la misma lógica que el "índice de fragilidad" publicado por el Dog Aging
 * Project. Ver vault/Iniciativas/Vitalidad-y-Longevidad.md.
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
