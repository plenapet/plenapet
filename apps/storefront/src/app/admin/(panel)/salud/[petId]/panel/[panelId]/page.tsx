import Link from "next/link";
import { notFound } from "next/navigation";
import { getIrisStage, getServiceSupabaseClient, healthSystemLabel } from "@plenapet/database";
import { Badge } from "@plenapet/ui";
import { Topbar } from "@/components/admin/Topbar";
import { AddLabResultForm } from "@/components/admin/AddLabResultForm";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { getCurrentAdmin } from "@/lib/auth/require-admin";
import {
  deleteLabPanelAction,
  deleteLabResultAction,
  publishLabPanelAction,
  unpublishLabPanelAction,
} from "@/lib/actions/admin-health";

export default async function PanelPage({
  params,
}: {
  params: { petId: string; panelId: string };
}) {
  const supabase = getServiceSupabaseClient();
  const currentAdmin = await getCurrentAdmin();
  const isSuperAdmin = currentAdmin?.role === "super_admin";

  const [{ data: pet }, { data: panel }, { data: results }] = await Promise.all([
    supabase.from("pets").select("id, name, species").eq("id", params.petId).maybeSingle(),
    supabase.from("lab_panels").select("*").eq("id", params.panelId).maybeSingle(),
    supabase
      .from("lab_results")
      .select("*")
      .eq("lab_panel_id", params.panelId)
      .order("created_at", { ascending: true }),
  ]);

  if (!pet || !panel) notFound();

  const creatinina = results?.find((r) => r.analyte_key === "creatinina")?.value ?? null;
  const sdma = results?.find((r) => r.analyte_key === "sdma")?.value ?? null;
  const iris = getIrisStage({
    species: pet.species,
    creatinineMgDl: creatinina,
    sdmaUgDl: sdma,
  });

  return (
    <div>
      <Topbar title={`Panel de laboratorio · ${pet.name}`} />
      <div className="space-y-6 p-8">
        <Link
          href={`/admin/salud/${pet.id}`}
          className="text-sm text-gris-pizarra hover:text-azul-confianza"
        >
          ← {pet.name}
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-card border border-azul-confianza/10 bg-white p-5 shadow-card">
          <div>
            <p className="font-semibold text-azul-confianza">
              {panel.lab_name || "Laboratorio"} — {panel.sample_taken_at ?? "sin fecha"}
            </p>
            <Badge tone={panel.status === "published" ? "aqua" : "neutral"}>
              {panel.status === "published" ? "Publicado" : "Borrador"}
            </Badge>
            {iris && (
              <p className="mt-2 text-sm font-semibold text-azul-confianza">
                🩺 {iris.label}{" "}
                <span className="font-normal text-gris-pizarra">
                  (estadificación IRIS, basada en {iris.basedOn})
                </span>
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {panel.status === "draft" ? (
              <form action={publishLabPanelAction}>
                <input type="hidden" name="petId" value={pet.id} />
                <input type="hidden" name="labPanelId" value={panel.id} />
                <button
                  type="submit"
                  className="rounded-full bg-azul-confianza px-4 py-2 text-sm font-semibold text-white"
                >
                  Publicar al propietario
                </button>
              </form>
            ) : (
              isSuperAdmin && (
                <form action={unpublishLabPanelAction}>
                  <input type="hidden" name="petId" value={pet.id} />
                  <input type="hidden" name="labPanelId" value={panel.id} />
                  <ConfirmSubmitButton
                    confirmMessage="El propietario dejará de ver este panel hasta que lo publiques de nuevo. ¿Despublicar para corregirlo?"
                    className="rounded-full border border-azul-confianza/20 px-4 py-2 text-sm font-semibold text-azul-confianza"
                  >
                    Despublicar para editar (super_admin)
                  </ConfirmSubmitButton>
                </form>
              )
            )}
            {isSuperAdmin && (
              <form action={deleteLabPanelAction}>
                <input type="hidden" name="petId" value={pet.id} />
                <input type="hidden" name="labPanelId" value={panel.id} />
                <ConfirmSubmitButton
                  confirmMessage="¿Eliminar este panel completo y todos sus analitos? Esta acción no se puede deshacer."
                  className="text-xs font-semibold text-coral-cercania hover:underline"
                >
                  Eliminar panel (super_admin)
                </ConfirmSubmitButton>
              </form>
            )}
          </div>
        </div>

        <div className="overflow-x-auto rounded-card border border-azul-confianza/10 bg-white shadow-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-gris-pizarra/70">
                <th className="px-4 py-3">Examen</th>
                <th className="px-4 py-3">Analito</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">Rango ref.</th>
                <th className="px-4 py-3">Sistema</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {(results ?? []).map((r) => (
                <tr key={r.id} className="border-t border-azul-confianza/5">
                  <td className="px-4 py-2 text-gris-pizarra">{r.exam_type}</td>
                  <td className="px-4 py-2 font-medium text-azul-confianza">
                    {r.analyte_name}
                  </td>
                  <td className="px-4 py-2">
                    {r.value_text ?? `${r.value ?? "—"} ${r.unit ?? ""}`}
                  </td>
                  <td className="px-4 py-2 text-gris-pizarra">
                    {r.reference_min != null && r.reference_max != null
                      ? `${r.reference_min} – ${r.reference_max}`
                      : "—"}
                  </td>
                  <td className="px-4 py-2 text-gris-pizarra">
                    {healthSystemLabel(r.organ_system)}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {panel.status === "draft" && (
                      <form action={deleteLabResultAction}>
                        <input type="hidden" name="petId" value={pet.id} />
                        <input type="hidden" name="labPanelId" value={panel.id} />
                        <input type="hidden" name="resultId" value={r.id} />
                        <button
                          type="submit"
                          className="text-xs font-semibold text-coral-cercania hover:underline"
                        >
                          Quitar
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
              {(!results || results.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gris-pizarra">
                    Sin analitos cargados todavía.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {panel.status === "draft" && (
          <AddLabResultForm petId={pet.id} labPanelId={panel.id} species={pet.species} />
        )}
      </div>
    </div>
  );
}
