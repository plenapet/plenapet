"use client";

import { useMemo, useState } from "react";
import {
  ANALYTE_CATALOG,
  EXAM_TYPE_LABEL,
  HEALTH_SYSTEMS,
  getAnalyteTemplate,
  getReferenceRange,
  type ExamType,
  type PetSpecies,
} from "@plenapet/database";
import { addLabResultAction } from "@/lib/actions/admin-health";

const EXAM_TYPES: ExamType[] = [
  "hemograma",
  "quimica_sanguinea",
  "uroanalisis",
  "coprologico",
];

export function AddLabResultForm({
  petId,
  labPanelId,
  species,
}: {
  petId: string;
  labPanelId: string;
  species: PetSpecies;
}) {
  const [analyteKey, setAnalyteKey] = useState<string>("otro");

  const template = analyteKey !== "otro" ? getAnalyteTemplate(analyteKey) : undefined;
  const range = template ? getReferenceRange(template.key, species) : null;

  const groupedCatalog = useMemo(() => {
    return EXAM_TYPES.map((type) => ({
      type,
      analytes: ANALYTE_CATALOG.filter((a) => a.examType === type),
    }));
  }, []);

  return (
    <form
      action={addLabResultAction}
      className="grid gap-3 rounded-card border border-dashed border-azul-confianza/25 bg-white p-5 sm:grid-cols-3"
    >
      <input type="hidden" name="petId" value={petId} />
      <input type="hidden" name="labPanelId" value={labPanelId} />
      <input type="hidden" name="analyteKey" value={analyteKey === "otro" ? "" : analyteKey} />

      <div className="sm:col-span-3">
        <label className="text-xs font-semibold uppercase tracking-wide text-gris-pizarra">
          Analito (catálogo estándar)
        </label>
        <select
          value={analyteKey}
          onChange={(e) => setAnalyteKey(e.target.value)}
          className="mt-1 w-full rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
        >
          {groupedCatalog.map((group) => (
            <optgroup key={group.type} label={EXAM_TYPE_LABEL[group.type]}>
              {group.analytes.map((a) => (
                <option key={a.key} value={a.key}>
                  {a.name}
                  {a.qualitative ? " (cualitativo)" : ""}
                </option>
              ))}
            </optgroup>
          ))}
          <option value="otro">Otro analito (no está en el catálogo)</option>
        </select>
        {template && (
          <p className="mt-1 text-xs text-gris-pizarra">
            Sistema sugerido: {HEALTH_SYSTEMS.find((s) => s.key === template.organSystem)?.label}
            {range && ` · Rango de referencia sugerido (${species}): ${range.min}–${range.max} ${template.unit}`}
            {template.qualitative && " · Resultado cualitativo (usa el campo de texto)"}
          </p>
        )}
      </div>

      {analyteKey === "otro" ? (
        <>
          <select
            name="examType"
            required
            className="rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
          >
            {EXAM_TYPES.map((t) => (
              <option key={t} value={t}>
                {EXAM_TYPE_LABEL[t]}
              </option>
            ))}
          </select>
          <input
            name="analyteName"
            placeholder="Nombre del analito"
            required
            className="rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
          />
          <select
            name="organSystem"
            required
            className="rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
          >
            {HEALTH_SYSTEMS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </>
      ) : (
        <>
          <input type="hidden" name="examType" value={template?.examType} />
          <input type="hidden" name="analyteName" value={template?.name} />
          <input type="hidden" name="organSystem" value={template?.organSystem} />
        </>
      )}

      {template?.qualitative ? (
        <input
          name="valueText"
          placeholder="Resultado (ej. 'presente', 'negativo')"
          required
          className="rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm sm:col-span-2"
        />
      ) : (
        <>
          <input
            name="value"
            type="number"
            step="any"
            placeholder="Valor numérico"
            className="rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
          />
          <input
            name="unit"
            placeholder="Unidad"
            defaultValue={template?.unit ?? ""}
            key={template?.unit ?? "unit-empty"}
            className="rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
          />
          <input
            name="valueText"
            placeholder="O valor no numérico"
            className="rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
          />
          <input
            name="referenceMin"
            type="number"
            step="any"
            placeholder="Rango ref. mínimo"
            defaultValue={range?.min ?? ""}
            key={`min-${range?.min ?? "empty"}`}
            className="rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
          />
          <input
            name="referenceMax"
            type="number"
            step="any"
            placeholder="Rango ref. máximo"
            defaultValue={range?.max ?? ""}
            key={`max-${range?.max ?? "empty"}`}
            className="rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
          />
        </>
      )}

      <button
        type="submit"
        className="rounded-full bg-azul-confianza px-4 py-2 text-sm font-semibold text-white sm:col-span-3"
      >
        Agregar analito
      </button>
    </form>
  );
}
