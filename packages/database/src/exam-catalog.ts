import type { HealthSystemKey, PetSpecies } from "./health-types";

/**
 * Catálogo de exámenes/analitos estándar de laboratorio veterinario —
 * hemograma completo, química sanguínea, uroanálisis y coprológico. Todos
 * son exámenes que se pueden procesar en Colombia (a diferencia de la
 * metilación de ADN para relojes epigenéticos, que hoy no es viable aquí —
 * ver vault/Iniciativas/Vitalidad-y-Longevidad.md).
 *
 * Los rangos de referencia son valores típicos de referencia veterinaria
 * (adulto sano, en ayuno cuando aplica) tomados de literatura de patología
 * clínica veterinaria de uso común. Son un **punto de partida para agilizar
 * la carga de datos**, no una verdad absoluta: cada laboratorio reporta su
 * propio rango según su analizador, y ese es el que debe quedar registrado
 * en `lab_results` — por eso el admin puede editar el rango sugerido antes
 * de guardar. Antes de operar con pacientes reales, un veterinario debe
 * revisar y confirmar estos valores.
 */

export type ExamType =
  | "hemograma"
  | "quimica_sanguinea"
  | "uroanalisis"
  | "coprologico";

export const EXAM_TYPE_LABEL: Record<ExamType, string> = {
  hemograma: "Hemograma completo",
  quimica_sanguinea: "Química sanguínea",
  uroanalisis: "Uroanálisis",
  coprologico: "Coprológico",
};

export interface AnalyteTemplate {
  key: string;
  examType: ExamType;
  name: string;
  unit: string;
  organSystem: HealthSystemKey;
  /** Ausente cuando el resultado es cualitativo (ej. "presente/ausente"). */
  referenceRanges?: Partial<Record<PetSpecies, { min: number; max: number }>>;
  qualitative?: boolean;
  note?: string;
}

export const ANALYTE_CATALOG: AnalyteTemplate[] = [
  // Hemograma completo — hematológico
  { key: "hematocrito", examType: "hemograma", name: "Hematocrito (HCT)", unit: "%", organSystem: "hematologico", referenceRanges: { perro: { min: 37, max: 55 }, gato: { min: 24, max: 45 } } },
  { key: "hemoglobina", examType: "hemograma", name: "Hemoglobina (HGB)", unit: "g/dL", organSystem: "hematologico", referenceRanges: { perro: { min: 12, max: 18 }, gato: { min: 8, max: 15 } } },
  { key: "eritrocitos", examType: "hemograma", name: "Eritrocitos (RBC)", unit: "x10^6/µL", organSystem: "hematologico", referenceRanges: { perro: { min: 5.5, max: 8.5 }, gato: { min: 5, max: 10 } } },
  { key: "leucocitos", examType: "hemograma", name: "Leucocitos (WBC)", unit: "x10^3/µL", organSystem: "hematologico", referenceRanges: { perro: { min: 6, max: 17 }, gato: { min: 5.5, max: 19.5 } } },
  { key: "neutrofilos", examType: "hemograma", name: "Neutrófilos segmentados", unit: "x10^3/µL", organSystem: "hematologico", referenceRanges: { perro: { min: 3, max: 11.5 }, gato: { min: 2.5, max: 12.5 } } },
  { key: "linfocitos", examType: "hemograma", name: "Linfocitos", unit: "x10^3/µL", organSystem: "hematologico", referenceRanges: { perro: { min: 1, max: 4.8 }, gato: { min: 1.5, max: 7 } } },
  { key: "plaquetas", examType: "hemograma", name: "Plaquetas", unit: "x10^3/µL", organSystem: "hematologico", referenceRanges: { perro: { min: 200, max: 500 }, gato: { min: 300, max: 800 } } },

  // Química sanguínea — renal, hepático, metabólico
  { key: "bun", examType: "quimica_sanguinea", name: "Nitrógeno ureico (BUN)", unit: "mg/dL", organSystem: "renal", referenceRanges: { perro: { min: 7, max: 27 }, gato: { min: 16, max: 36 } } },
  { key: "creatinina", examType: "quimica_sanguinea", name: "Creatinina", unit: "mg/dL", organSystem: "renal", referenceRanges: { perro: { min: 0.5, max: 1.5 }, gato: { min: 0.8, max: 2.1 } }, note: "Usada además para estadificación IRIS (ver health-scoring.ts)." },
  { key: "sdma", examType: "quimica_sanguinea", name: "SDMA", unit: "µg/dL", organSystem: "renal", referenceRanges: { perro: { min: 0, max: 14 }, gato: { min: 0, max: 14 } }, note: "Marcador temprano de función renal, base de la estadificación IRIS." },
  { key: "alt", examType: "quimica_sanguinea", name: "ALT (alanina aminotransferasa)", unit: "U/L", organSystem: "hepatico", referenceRanges: { perro: { min: 10, max: 100 }, gato: { min: 12, max: 130 } } },
  { key: "fosfatasa_alcalina", examType: "quimica_sanguinea", name: "Fosfatasa alcalina (ALP)", unit: "U/L", organSystem: "hepatico", referenceRanges: { perro: { min: 23, max: 212 }, gato: { min: 14, max: 111 } } },
  { key: "proteinas_totales", examType: "quimica_sanguinea", name: "Proteínas totales", unit: "g/dL", organSystem: "metabolico", referenceRanges: { perro: { min: 5.4, max: 7.5 }, gato: { min: 5.7, max: 8.9 } } },
  { key: "albumina", examType: "quimica_sanguinea", name: "Albúmina", unit: "g/dL", organSystem: "hepatico", referenceRanges: { perro: { min: 2.6, max: 4 }, gato: { min: 2.3, max: 3.9 } } },
  { key: "glucosa", examType: "quimica_sanguinea", name: "Glucosa", unit: "mg/dL", organSystem: "metabolico", referenceRanges: { perro: { min: 65, max: 118 }, gato: { min: 64, max: 170 } } },
  { key: "colesterol", examType: "quimica_sanguinea", name: "Colesterol", unit: "mg/dL", organSystem: "metabolico", referenceRanges: { perro: { min: 130, max: 370 }, gato: { min: 65, max: 220 } } },

  // Uroanálisis — urinario
  { key: "densidad_urinaria", examType: "uroanalisis", name: "Densidad urinaria", unit: "", organSystem: "urinario", referenceRanges: { perro: { min: 1.015, max: 1.045 }, gato: { min: 1.015, max: 1.06 } } },
  { key: "ph_urinario", examType: "uroanalisis", name: "pH urinario", unit: "", organSystem: "urinario", referenceRanges: { perro: { min: 5.5, max: 7.5 }, gato: { min: 5.5, max: 7.5 } } },
  { key: "proteina_orina", examType: "uroanalisis", name: "Proteína en orina", unit: "", organSystem: "urinario", qualitative: true },
  { key: "glucosa_orina", examType: "uroanalisis", name: "Glucosa en orina", unit: "", organSystem: "urinario", qualitative: true },
  { key: "sangre_orina", examType: "uroanalisis", name: "Sangre/hemoglobina en orina", unit: "", organSystem: "urinario", qualitative: true },

  // Coprológico — digestivo
  { key: "parasitos_directo", examType: "coprologico", name: "Parásitos (examen directo)", unit: "", organSystem: "digestivo", qualitative: true },
  { key: "parasitos_flotacion", examType: "coprologico", name: "Parásitos (flotación)", unit: "", organSystem: "digestivo", qualitative: true },
  { key: "sangre_oculta", examType: "coprologico", name: "Sangre oculta en heces", unit: "", organSystem: "digestivo", qualitative: true },
  { key: "consistencia_heces", examType: "coprologico", name: "Consistencia de las heces", unit: "", organSystem: "digestivo", qualitative: true },
];

export function getAnalyteTemplate(key: string): AnalyteTemplate | undefined {
  return ANALYTE_CATALOG.find((a) => a.key === key);
}

export function getReferenceRange(key: string, species: PetSpecies) {
  return getAnalyteTemplate(key)?.referenceRanges?.[species] ?? null;
}

export function analytesByExamType(examType: ExamType) {
  return ANALYTE_CATALOG.filter((a) => a.examType === examType);
}
