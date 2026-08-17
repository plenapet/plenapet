import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ANALYTE_CATALOG,
  EXAM_TYPE_LABEL,
  SURVEY_QUESTIONS,
  breedsForSpecies,
  getReferenceRange,
  getServiceSupabaseClient,
  healthSystemLabel,
  type ExamType,
  type PetSpecies,
} from "@plenapet/database";
import { Badge } from "@plenapet/ui";
import { Topbar } from "@/components/admin/Topbar";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { getCurrentAdmin } from "@/lib/auth/require-admin";
import {
  addHealthRecommendationAction,
  createLabPanelAction,
  deleteHealthRecommendationAction,
  deletePetAction,
  updateHealthRecommendationAction,
  updatePetAction,
} from "@/lib/actions/admin-health";

const EXAM_TYPES: ExamType[] = [
  "hemograma",
  "quimica_sanguinea",
  "uroanalisis",
  "coprologico",
];

export default async function SaludMascotaPage({
  params,
  searchParams,
}: {
  params: { petId: string };
  searchParams: { error?: string };
}) {
  const supabase = getServiceSupabaseClient();
  const currentAdmin = await getCurrentAdmin();
  const isSuperAdmin = currentAdmin?.role === "super_admin";

  const { data: pet } = await supabase
    .from("pets")
    .select("*, profiles(full_name)")
    .eq("id", params.petId)
    .maybeSingle();

  if (!pet) notFound();

  const [{ data: panels }, { data: recommendations }, { data: products }, { data: surveys }] =
    await Promise.all([
      supabase
        .from("lab_panels")
        .select("*, lab_results(id)")
        .eq("pet_id", pet.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("health_recommendations")
        .select("*")
        .eq("pet_id", pet.id)
        .order("created_at", { ascending: false }),
      supabase.from("products").select("id, name").order("name").limit(200),
      supabase
        .from("wellness_surveys")
        .select("*")
        .eq("pet_id", pet.id)
        .order("submitted_at", { ascending: false }),
    ]);

  return (
    <div>
      <Topbar title={`PlenaPet Health · ${pet.name}`} />
      <div className="space-y-8 p-8">
        <Link href="/admin/salud" className="text-sm text-gris-pizarra hover:text-azul-confianza">
          ← Buscar otra mascota
        </Link>

        {searchParams.error && (
          <p className="rounded-lg bg-[#FFF1E0] px-3 py-2 text-sm text-[#8A4B00]">
            {searchParams.error}
          </p>
        )}

        {/* Datos de la mascota — editar / borrar */}
        <details className="rounded-card border border-azul-confianza/10 bg-white p-5 shadow-card">
          <summary className="cursor-pointer">
            <span className="font-bold text-azul-confianza">{pet.name}</span>{" "}
            <span className="text-sm text-gris-pizarra">
              — {pet.species === "gato" ? "Gato" : "Perro"}
              {pet.breed ? ` · ${pet.breed}` : ""} · Propietario:{" "}
              {(pet as any).profiles?.full_name ?? "—"} (click para editar)
            </span>
          </summary>

          <form action={updatePetAction} className="mt-4 grid gap-3 sm:grid-cols-2">
            <input type="hidden" name="petId" value={pet.id} />
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-gris-pizarra">
                Nombre
              </label>
              <input
                name="name"
                defaultValue={pet.name}
                required
                className="mt-1 w-full rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-gris-pizarra">
                Especie
              </label>
              <select
                name="species"
                defaultValue={pet.species}
                className="mt-1 w-full rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
              >
                <option value="perro">Perro</option>
                <option value="gato">Gato</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-gris-pizarra">
                Raza
              </label>
              <select
                name="breed"
                defaultValue={pet.breed ?? ""}
                className="mt-1 w-full rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
              >
                <option value="">Sin especificar</option>
                {breedsForSpecies(pet.species as PetSpecies)
                  .filter((b) => b !== "Otra")
                  .map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                {pet.breed &&
                  !breedsForSpecies(pet.species as PetSpecies).includes(pet.breed) && (
                    <option value={pet.breed}>{pet.breed}</option>
                  )}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-gris-pizarra">
                Sexo
              </label>
              <select
                name="sex"
                defaultValue={pet.sex ?? ""}
                className="mt-1 w-full rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
              >
                <option value="">Sin especificar</option>
                <option value="macho">Macho</option>
                <option value="hembra">Hembra</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-gris-pizarra">
                Fecha de nacimiento
              </label>
              <input
                type="date"
                name="birthDate"
                defaultValue={pet.birth_date ?? ""}
                className="mt-1 w-full rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-gris-pizarra">
                Peso (kg)
              </label>
              <input
                type="number"
                step="0.1"
                name="weightKg"
                defaultValue={pet.weight_kg ?? ""}
                className="mt-1 w-full rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-gris-pizarra sm:col-span-2">
              <input
                type="checkbox"
                name="sterilized"
                defaultChecked={pet.sterilized ?? false}
                className="rounded"
              />
              Está esterilizado/a
            </label>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="rounded-full bg-azul-confianza px-4 py-2 text-sm font-semibold text-white"
              >
                Guardar cambios
              </button>
            </div>
          </form>

          {isSuperAdmin && (
            <form action={deletePetAction} className="mt-4 border-t border-azul-confianza/10 pt-4">
              <input type="hidden" name="petId" value={pet.id} />
              <ConfirmSubmitButton
                confirmMessage={`¿Borrar a ${pet.name} y todo su historial (encuestas, paneles, recomendaciones)? Esta acción no se puede deshacer.`}
                className="text-xs font-semibold text-coral-cercania hover:underline"
              >
                Eliminar mascota (super_admin)
              </ConfirmSubmitButton>
            </form>
          )}
        </details>

        <details className="rounded-card border border-aqua-bienestar/40 bg-aqua-bienestar/10 p-5">
          <summary className="cursor-pointer text-sm font-bold text-azul-confianza">
            Exámenes recomendados para un chequeo completo de {pet.name}
          </summary>
          <p className="mt-2 text-xs text-azul-confianza/80">
            Pídele esto al laboratorio antes de crear el panel. Rangos de
            referencia sugeridos para {pet.species === "gato" ? "gatos" : "perros"}
            {" "}— confírmalos siempre contra lo que reporte el laboratorio.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {EXAM_TYPES.map((type) => (
              <div key={type}>
                <h4 className="text-xs font-bold uppercase tracking-wide text-azul-confianza">
                  {EXAM_TYPE_LABEL[type]}
                </h4>
                <ul className="mt-1 space-y-0.5 text-xs text-azul-confianza/80">
                  {ANALYTE_CATALOG.filter((a) => a.examType === type).map((a) => {
                    const range = getReferenceRange(a.key, pet.species);
                    return (
                      <li key={a.key}>
                        {a.name}
                        {range && ` (${range.min}–${range.max} ${a.unit})`}
                        {a.qualitative && " (cualitativo)"}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </details>

        {/* Paneles de laboratorio */}
        <section>
          <h3 className="text-sm font-bold uppercase tracking-wide text-azul-confianza">
            Paneles de laboratorio
          </h3>
          <div className="mt-3 space-y-2">
            {(panels ?? []).map((panel: any) => (
              <Link
                key={panel.id}
                href={`/admin/salud/${pet.id}/panel/${panel.id}`}
                className="flex items-center justify-between rounded-card border border-azul-confianza/10 bg-white p-4 shadow-card hover:border-azul-confianza/30"
              >
                <span className="text-sm text-azul-confianza">
                  {panel.lab_name || "Laboratorio"} ·{" "}
                  {panel.sample_taken_at ?? "sin fecha"} ·{" "}
                  {panel.lab_results?.length ?? 0} analitos
                </span>
                <Badge tone={panel.status === "published" ? "aqua" : "neutral"}>
                  {panel.status === "published" ? "Publicado" : "Borrador"}
                </Badge>
              </Link>
            ))}
            {(!panels || panels.length === 0) && (
              <p className="text-sm text-gris-pizarra">Sin paneles todavía.</p>
            )}
          </div>

          <form
            action={createLabPanelAction}
            className="mt-4 flex flex-wrap items-end gap-3 rounded-card border border-dashed border-azul-confianza/25 bg-white p-4"
          >
            <input type="hidden" name="petId" value={pet.id} />
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-gris-pizarra">
                Laboratorio
              </label>
              <input
                name="labName"
                className="mt-1 rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-gris-pizarra">
                Fecha de toma de muestra
              </label>
              <input
                type="date"
                name="sampleTakenAt"
                className="mt-1 rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              className="rounded-full bg-azul-confianza px-4 py-2 text-sm font-semibold text-white"
            >
              Crear panel nuevo
            </button>
          </form>
        </section>

        {/* Encuestas de bienestar */}
        <section>
          <h3 className="text-sm font-bold uppercase tracking-wide text-azul-confianza">
            Encuestas de bienestar del propietario
          </h3>
          <div className="mt-3 space-y-2">
            {(surveys ?? []).map((survey) => (
              <details
                key={survey.id}
                className="rounded-card border border-azul-confianza/10 bg-white p-4 shadow-card"
              >
                <summary className="cursor-pointer text-sm font-semibold text-azul-confianza">
                  {new Date(survey.submitted_at).toLocaleString("es-CO")} · Puntaje
                  general: {survey.overall_score}/100
                </summary>
                <div className="mt-3 space-y-3">
                  {Array.from(new Set(SURVEY_QUESTIONS.map((q) => q.domain))).map(
                    (domain) => (
                      <div key={domain}>
                        <p className="text-xs font-bold uppercase tracking-wide text-coral-cercania">
                          {healthSystemLabel(domain)} — {survey.domain_scores?.[domain] ?? "—"}/100
                        </p>
                        <ul className="mt-1 space-y-0.5 text-xs text-gris-pizarra">
                          {SURVEY_QUESTIONS.filter((q) => q.domain === domain).map((q) => {
                            const answerValue = (survey.answers as Record<string, string>)?.[q.id];
                            const answerLabel = q.options.find((o) => o.value === answerValue)?.label;
                            return (
                              <li key={q.id}>
                                {q.text} — <span className="font-medium text-azul-confianza">{answerLabel ?? "sin responder"}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ),
                  )}
                </div>
              </details>
            ))}
            {(!surveys || surveys.length === 0) && (
              <p className="text-sm text-gris-pizarra">
                El propietario todavía no ha completado ninguna encuesta.
              </p>
            )}
          </div>
        </section>

        {/* Recomendaciones */}
        <section>
          <h3 className="text-sm font-bold uppercase tracking-wide text-azul-confianza">
            Recomendaciones
          </h3>
          <div className="mt-3 space-y-2">
            {(recommendations ?? []).map((rec) => (
              <details
                key={rec.id}
                className="rounded-card border border-azul-confianza/10 bg-white p-4 shadow-card"
              >
                <summary className="flex cursor-pointer items-center gap-2">
                  <Badge
                    tone={
                      rec.severity === "urgente"
                        ? "coral"
                        : rec.severity === "atencion"
                          ? "warning"
                          : "neutral"
                    }
                  >
                    {rec.severity}
                  </Badge>
                  <span className="text-sm font-semibold text-azul-confianza">
                    {rec.title}
                  </span>
                </summary>
                {rec.description && (
                  <p className="mt-2 text-sm text-gris-pizarra">{rec.description}</p>
                )}

                <form action={updateHealthRecommendationAction} className="mt-3 space-y-3">
                  <input type="hidden" name="petId" value={pet.id} />
                  <input type="hidden" name="recommendationId" value={rec.id} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      name="title"
                      defaultValue={rec.title}
                      required
                      className="rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
                    />
                    <select
                      name="severity"
                      defaultValue={rec.severity}
                      className="rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
                    >
                      <option value="info">Info</option>
                      <option value="atencion">Atención</option>
                      <option value="urgente">Urgente</option>
                    </select>
                  </div>
                  <textarea
                    name="description"
                    defaultValue={rec.description ?? ""}
                    className="w-full rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
                    rows={2}
                  />
                  <select
                    name="relatedProductId"
                    defaultValue={rec.related_product_id ?? ""}
                    className="w-full rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
                  >
                    <option value="">Sin producto relacionado</option>
                    {(products ?? []).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center justify-between">
                    <button
                      type="submit"
                      className="rounded-full bg-azul-confianza px-4 py-2 text-sm font-semibold text-white"
                    >
                      Guardar cambios
                    </button>
                  </div>
                </form>
                {isSuperAdmin && (
                  <form action={deleteHealthRecommendationAction} className="mt-2">
                    <input type="hidden" name="petId" value={pet.id} />
                    <input type="hidden" name="recommendationId" value={rec.id} />
                    <ConfirmSubmitButton
                      confirmMessage="¿Eliminar esta recomendación?"
                      className="text-xs font-semibold text-coral-cercania hover:underline"
                    >
                      Eliminar (super_admin)
                    </ConfirmSubmitButton>
                  </form>
                )}
              </details>
            ))}
            {(!recommendations || recommendations.length === 0) && (
              <p className="text-sm text-gris-pizarra">Sin recomendaciones todavía.</p>
            )}
          </div>

          <form
            action={addHealthRecommendationAction}
            className="mt-4 space-y-3 rounded-card border border-dashed border-azul-confianza/25 bg-white p-4"
          >
            <input type="hidden" name="petId" value={pet.id} />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                name="title"
                placeholder="Título"
                required
                className="rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
              />
              <select
                name="severity"
                className="rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
              >
                <option value="info">Info</option>
                <option value="atencion">Atención</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>
            <textarea
              name="description"
              placeholder="Descripción para el propietario"
              className="w-full rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
              rows={2}
            />
            <select
              name="relatedProductId"
              className="w-full rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
            >
              <option value="">Sin producto relacionado</option>
              {(products ?? []).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-full bg-azul-confianza px-4 py-2 text-sm font-semibold text-white"
            >
              Agregar recomendación
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
