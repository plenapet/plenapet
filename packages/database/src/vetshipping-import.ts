import type { Species } from "./types";

/**
 * Helpers puros para la primera migración de catálogo desde VetShipping
 * (adapter CSV, ver Arquitectura/Integracion-VetShipping.md). Separados del
 * server action para poder probarlos sin tocar Supabase.
 */

/**
 * Repara el caso típico de un CSV UTF-8 que se decodificó como Latin-1
 * ("inflamación" -> "inflamaciÃ³n"). Si el texto no tiene el patrón, lo
 * devuelve tal cual.
 */
export function fixMojibake(text: string): string {
  if (!text || !/[ÃÂ]/.test(text)) return text;
  try {
    const repaired = Buffer.from(text, "latin1").toString("utf8");
    if (!repaired.includes("�")) return repaired;
  } catch {
    // texto no reparable con este método — se deja como está
  }
  return text;
}

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * VetShipping vende a PlenaPet con 10% de margen sobre su costo, y PlenaPet
 * vende al público con otro 10% adicional sobre lo que le cuesta a PlenaPet
 * — confirmado explícitamente por el usuario (2026-08-22), no una regla
 * inventada. 1.10 * 1.10 = 1.21.
 */
export const VETSHIPPING_MARGIN_MULTIPLIER = 1.21;

export function computePriceCents(baseCostPesos: number): number {
  return Math.round(baseCostPesos * VETSHIPPING_MARGIN_MULTIPLIER) * 100;
}

/**
 * VetShipping no nos dio un export de su tabla de categorías (solo el uuid
 * en cada producto) — este mapeo es una clasificación manual a partir de
 * agrupar productos por category_id y revisar qué contiene cada grupo.
 * Revisable/corregible desde el admin de PlenaPet, ya que todo producto
 * importado queda oculto (active=false) hasta revisión — ver
 * Registro-de-decisiones.md (2026-08-22).
 */
export const VETSHIPPING_CATEGORY_MAP: Record<string, string> = {
  "18992735-7ace-40f1-8563-77abf11a77aa": "farmacia-veterinaria",
  "2d91a0fa-70d4-4bab-a1c1-1e206caecef0": "farmacia-veterinaria",
  "36237f69-035c-45a2-8bae-d903b28867d6": "farmacia-veterinaria",
  "20f6f15d-0bfc-4d44-b5e3-c2c8ef11c5c9": "farmacia-veterinaria",
  "a3a9d964-148e-47c4-bfbd-e90737001270": "alimentos",
  "b8a582d2-e243-4ae5-838b-9b3c23d885b9": "desparasitantes",
  "d797f385-8c7b-4df6-a0a2-0cd271463462": "desparasitantes",
  "e2556aea-a183-445a-bc3f-9b0eb324cf88": "desparasitantes",
  "2736942e-d2fc-449f-ba34-c82cb4e18ea3": "vitaminas-suplementos",
  "8c4eec26-6e38-4233-8f75-c9d8a6ec44ad": "vitaminas-suplementos",
  "6b26b681-6522-4f3f-8014-6035872416b3": "higiene",
  "498102ca-854f-4775-8236-1ac9730150e3": "higiene",
  "0d40b08f-8e99-46fc-8f5c-89902b9f7433": "accesorios",
};

export const DEFAULT_CATEGORY_SLUG = "farmacia-veterinaria";

export function mapCategorySlug(vetShippingCategoryId: string | null | undefined): string {
  if (!vetShippingCategoryId) return DEFAULT_CATEGORY_SLUG;
  return VETSHIPPING_CATEGORY_MAP[vetShippingCategoryId] ?? DEFAULT_CATEGORY_SLUG;
}

export function inferSpecies(text: string): Species[] {
  const lower = text.toLowerCase();
  const hasDog = /\bperr|\bcanin/.test(lower);
  const hasCat = /\bgat|\bfelin/.test(lower);
  if (hasDog && !hasCat) return ["perro"];
  if (hasCat && !hasDog) return ["gato"];
  return ["perro", "gato"];
}

/** Filas como "Domicilio adicional" son cargos de envío del sistema de VetShipping, no productos. */
export function isNonProductRow(name: string): boolean {
  return /^domicili/i.test(name.trim());
}

/** Clave normalizada para hacer match de nombres de marca sin importar mayúsculas/tildes/puntuación. */
export function normalizeBrandKey(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "");
}
