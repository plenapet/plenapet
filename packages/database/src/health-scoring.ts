import type { HealthSystemKey } from "./health-types";

/**
 * Puntaje de un resultado de laboratorio individual: 100 si está dentro del
 * rango de referencia que entregó el laboratorio; baja proporcionalmente a
 * qué tan lejos está el valor de ese rango. No es una fórmula clínica
 * validada — es un indicador orientativo de desviación, pensado para
 * consolidar muchos analitos distintos en un solo puntaje por sistema.
 */
export function scoreLabResult(result: {
  value?: number | null;
  referenceMin?: number | null;
  referenceMax?: number | null;
}): number | null {
  const { value, referenceMin, referenceMax } = result;
  if (value == null || referenceMin == null || referenceMax == null) {
    return null;
  }
  if (value >= referenceMin && value <= referenceMax) return 100;

  const range = referenceMax - referenceMin || 1;
  const deviation =
    value < referenceMin ? referenceMin - value : value - referenceMax;
  const ratio = deviation / range;
  return Math.max(0, Math.round(100 - ratio * 100));
}

export function aggregateSystemScores(
  entries: { system: HealthSystemKey; score: number }[],
): Partial<Record<HealthSystemKey, number>> {
  const bySystem: Partial<Record<HealthSystemKey, number[]>> = {};
  for (const entry of entries) {
    (bySystem[entry.system] ??= []).push(entry.score);
  }
  const out: Partial<Record<HealthSystemKey, number>> = {};
  for (const [system, scores] of Object.entries(bySystem)) {
    out[system as HealthSystemKey] = Math.round(
      scores!.reduce((a, b) => a + b, 0) / scores!.length,
    );
  }
  return out;
}

/** Combina puntajes de encuesta y de laboratorio por sistema (promedio si hay ambos). */
export function mergeSystemScores(
  ...sources: Partial<Record<HealthSystemKey, number>>[]
): Partial<Record<HealthSystemKey, number>> {
  const merged: Partial<Record<HealthSystemKey, number[]>> = {};
  for (const source of sources) {
    for (const [key, value] of Object.entries(source)) {
      if (value == null) continue;
      (merged[key as HealthSystemKey] ??= []).push(value);
    }
  }
  const out: Partial<Record<HealthSystemKey, number>> = {};
  for (const [key, values] of Object.entries(merged)) {
    out[key as HealthSystemKey] = Math.round(
      values!.reduce((a, b) => a + b, 0) / values!.length,
    );
  }
  return out;
}

/**
 * Estimación de edad biológica: heurística propia y transparente (no un
 * modelo clínicamente validado), inspirada en el enfoque de los estudios de
 * biomarcadores/fragilidad — a menor puntaje de vitalidad, mayor el ajuste
 * sobre la edad cronológica. Se muestra siempre como indicador orientativo,
 * nunca como diagnóstico. Ver vault/Iniciativas/Vitalidad-y-Longevidad.md.
 */
export function estimateBiologicalAge(
  chronologicalAgeYears: number,
  vitalityScore: number,
): number {
  const factor = 1 + ((100 - vitalityScore) / 100) * 0.5;
  return Math.round(chronologicalAgeYears * factor * 10) / 10;
}

export function scoreToStatus(
  score: number,
): "optimo" | "bien" | "atencion" | "prioritario" {
  if (score >= 80) return "optimo";
  if (score >= 60) return "bien";
  if (score >= 40) return "atencion";
  return "prioritario";
}
