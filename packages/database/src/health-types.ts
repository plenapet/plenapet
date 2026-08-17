export type PetSpecies = "perro" | "gato";
export type PetSex = "macho" | "hembra";

export interface Pet {
  id: string;
  customerId: string;
  name: string;
  species: PetSpecies;
  breed?: string | null;
  sex?: PetSex | null;
  sterilized?: boolean | null;
  birthDate?: string | null;
  estimatedAgeYears?: number | null;
  weightKg?: number | null;
  photoUrl?: string | null;
  createdAt: string;
}

/**
 * Vocabulario compartido entre la encuesta de bienestar y los resultados de
 * laboratorio, para poder consolidar ambos en un solo dashboard "por sistema".
 */
export const HEALTH_SYSTEMS = [
  { key: "hematologico", label: "Hematológico" },
  { key: "renal", label: "Renal" },
  { key: "hepatico", label: "Hepático" },
  { key: "metabolico", label: "Metabólico" },
  { key: "digestivo", label: "Digestivo" },
  { key: "urinario", label: "Urinario" },
  { key: "movilidad", label: "Movilidad y articulaciones" },
  { key: "piel_pelo", label: "Piel y pelaje" },
  { key: "comportamiento", label: "Comportamiento y cognición" },
  { key: "general", label: "General" },
] as const;

export type HealthSystemKey = (typeof HEALTH_SYSTEMS)[number]["key"];

export function healthSystemLabel(key: string): string {
  return HEALTH_SYSTEMS.find((s) => s.key === key)?.label ?? key;
}

export interface WellnessSurvey {
  id: string;
  petId: string;
  submittedAt: string;
  answers: Record<string, string>;
  domainScores: Partial<Record<HealthSystemKey, number>>;
  overallScore: number;
}

export type LabPanelStatus = "draft" | "published";

export interface LabResult {
  id: string;
  labPanelId: string;
  analyteKey?: string | null;
  examType: string;
  analyteName: string;
  value?: number | null;
  valueText?: string | null;
  unit?: string | null;
  referenceMin?: number | null;
  referenceMax?: number | null;
  organSystem: HealthSystemKey;
}

export interface LabPanel {
  id: string;
  petId: string;
  labName?: string | null;
  sampleTakenAt?: string | null;
  status: LabPanelStatus;
  notes?: string | null;
  publishedAt?: string | null;
  createdAt: string;
  results: LabResult[];
}

export type RecommendationSeverity = "info" | "atencion" | "urgente";
export type RecommendationSource = "survey" | "lab" | "manual";

export interface HealthRecommendation {
  id: string;
  petId: string;
  source: RecommendationSource;
  title: string;
  description?: string | null;
  severity: RecommendationSeverity;
  relatedProductId?: string | null;
  createdAt: string;
}
