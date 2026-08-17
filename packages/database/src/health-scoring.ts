import type { HealthSystemKey, PetSpecies } from "./health-types";

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

export interface IrisStageResult {
  stage: 1 | 2 | 3 | 4;
  label: string;
  basedOn: "creatinina" | "sdma" | "creatinina+sdma";
}

/**
 * Estadificación IRIS (International Renal Interest Society) de enfermedad
 * renal crónica en perros y gatos — a diferencia de `estimateBiologicalAge`,
 * **esta sí es una escala clínica publicada y usada mundialmente por
 * veterinarios** (no un invento de PlenaPet), basada en creatinina y/o SDMA.
 *
 * Los puntos de corte usados acá son los valores de referencia comúnmente
 * publicados de la guía IRIS — deben confirmarse contra la tabla vigente en
 * iris-kidney.com/iris-guidelines-1 antes de usarse para decisiones clínicas
 * reales; esto no reemplaza el criterio de un veterinario.
 */
export function getIrisStage(input: {
  species: PetSpecies;
  creatinineMgDl?: number | null;
  sdmaUgDl?: number | null;
}): IrisStageResult | null {
  const { species, creatinineMgDl, sdmaUgDl } = input;

  const stageFromCreatinine = (): 1 | 2 | 3 | 4 | null => {
    if (creatinineMgDl == null) return null;
    const cutoffs =
      species === "gato"
        ? { s1: 1.6, s2: 2.8, s3: 5.0 }
        : { s1: 1.4, s2: 2.8, s3: 5.0 };
    if (creatinineMgDl < cutoffs.s1) return 1;
    if (creatinineMgDl <= cutoffs.s2) return 2;
    if (creatinineMgDl <= cutoffs.s3) return 3;
    return 4;
  };

  const stageFromSdma = (): 1 | 2 | 3 | 4 | null => {
    if (sdmaUgDl == null) return null;
    if (sdmaUgDl < 18) return 1;
    if (sdmaUgDl <= 25) return 2;
    if (sdmaUgDl <= 38) return 3;
    return 4;
  };

  const creatinineStage = stageFromCreatinine();
  const sdmaStage = stageFromSdma();

  if (creatinineStage == null && sdmaStage == null) return null;

  // IRIS recomienda usar ambos marcadores juntos cuando están disponibles y
  // tomar el estadio más avanzado (más severo) que sugiera cualquiera de los dos.
  const stage = Math.max(creatinineStage ?? 0, sdmaStage ?? 0) as 1 | 2 | 3 | 4;
  const basedOn =
    creatinineStage != null && sdmaStage != null
      ? "creatinina+sdma"
      : creatinineStage != null
        ? "creatinina"
        : "sdma";

  const labels: Record<1 | 2 | 3 | 4, string> = {
    1: "IRIS Estadio 1 — función renal normal o daño subclínico",
    2: "IRIS Estadio 2 — enfermedad renal leve",
    3: "IRIS Estadio 3 — enfermedad renal moderada",
    4: "IRIS Estadio 4 — enfermedad renal severa",
  };

  return { stage, label: labels[stage], basedOn };
}
