import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ANALYTE_CATALOG,
  EXAM_TYPE_LABEL,
  getReferenceRange,
  getServiceSupabaseClient,
  type ExamType,
} from "@plenapet/database";
import { Badge } from "@plenapet/ui";
import { Topbar } from "@/components/admin/Topbar";
import {
  addHealthRecommendationAction,
  createLabPanelAction,
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

  const { data: pet } = await supabase
    .from("pets")
    .select("*, profiles(full_name)")
    .eq("id", params.petId)
    .maybeSingle();

  if (!pet) notFound();

  const [{ data: panels }, { data: recommendations }, { data: products }] =
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
    ]);

  return (
    <div>
      <Topbar title={`PlenaPet Health · ${pet.name}`} />
      <div className="space-y-8 p-8">
        <Link href="/admin/salud" className="text-sm text-gris-pizarra hover:text-azul-confianza">
          ← Buscar otra mascota
        </Link>

        <div className="rounded-card border border-azul-confianza/10 bg-white p-5 shadow-card">
          <h2 className="font-bold text-azul-confianza">{pet.name}</h2>
          <p className="text-sm text-gris-pizarra">
            {pet.species === "gato" ? "Gato" : "Perro"}
            {pet.breed ? ` · ${pet.breed}` : ""} · Propietario:{" "}
            {(pet as any).profiles?.full_name ?? "—"}
          </p>
        </div>

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

        {searchParams.error && (
          <p className="rounded-lg bg-[#FFF1E0] px-3 py-2 text-sm text-[#8A4B00]">
            {searchParams.error}
          </p>
        )}

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

        {/* Recomendaciones */}
        <section>
          <h3 className="text-sm font-bold uppercase tracking-wide text-azul-confianza">
            Recomendaciones
          </h3>
          <div className="mt-3 space-y-2">
            {(recommendations ?? []).map((rec) => (
              <div
                key={rec.id}
                className="rounded-card border border-azul-confianza/10 bg-white p-4 shadow-card"
              >
                <div className="flex items-center gap-2">
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
                  <p className="text-sm font-semibold text-azul-confianza">
                    {rec.title}
                  </p>
                </div>
                {rec.description && (
                  <p className="mt-1 text-sm text-gris-pizarra">{rec.description}</p>
                )}
              </div>
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
