import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Badge, Button, Container } from "@plenapet/ui";
import {
  HEALTH_SYSTEMS,
  aggregateSystemScores,
  estimateBiologicalAge,
  getIrisStage,
  healthSystemLabel,
  mergeSystemScores,
  scoreLabResult,
  scoreToStatus,
  type HealthSystemKey,
} from "@plenapet/database";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const STATUS_LABEL: Record<string, string> = {
  optimo: "Óptimo",
  bien: "Bien",
  atencion: "Atención",
  prioritario: "Prioritario",
};

const STATUS_TONE: Record<string, "neutral" | "aqua" | "coral" | "warning"> = {
  optimo: "aqua",
  bien: "neutral",
  atencion: "warning",
  prioritario: "coral",
};

function ageInYears(birthDate: string | null, estimated: number | null) {
  if (birthDate) {
    const ms = Date.now() - new Date(birthDate).getTime();
    return Math.round((ms / (1000 * 60 * 60 * 24 * 365.25)) * 10) / 10;
  }
  return estimated;
}

export default async function PetDashboardPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/cuenta/login?next=/health/mascotas/${params.id}`);

  const { data: pet } = await supabase
    .from("pets")
    .select("*")
    .eq("id", params.id)
    .eq("customer_id", user.id)
    .maybeSingle();

  if (!pet) notFound();

  const [{ data: lastSurvey }, { data: labPanels }, { data: recommendations }] =
    await Promise.all([
      supabase
        .from("wellness_surveys")
        .select("*")
        .eq("pet_id", pet.id)
        .order("submitted_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("lab_panels")
        .select("*, lab_results(*)")
        .eq("pet_id", pet.id)
        .eq("status", "published")
        .order("sample_taken_at", { ascending: false }),
      supabase
        .from("health_recommendations")
        .select("*, products(name, slug)")
        .eq("pet_id", pet.id)
        .order("created_at", { ascending: false }),
    ]);

  const allLabResults = (labPanels ?? []).flatMap((panel) => panel.lab_results ?? []);
  const labScoreEntries = allLabResults
    .map((r) => {
      const score = scoreLabResult({
        value: r.value,
        referenceMin: r.reference_min,
        referenceMax: r.reference_max,
      });
      return score == null
        ? null
        : { system: r.organ_system as HealthSystemKey, score };
    })
    .filter((e): e is { system: HealthSystemKey; score: number } => e !== null);

  const creatinina = allLabResults.find((r) => r.analyte_key === "creatinina")?.value ?? null;
  const sdma = allLabResults.find((r) => r.analyte_key === "sdma")?.value ?? null;
  const iris = getIrisStage({
    species: pet.species,
    creatinineMgDl: creatinina,
    sdmaUgDl: sdma,
  });

  const labSystemScores = aggregateSystemScores(labScoreEntries);
  const surveyDomainScores = (lastSurvey?.domain_scores ?? {}) as Partial<
    Record<HealthSystemKey, number>
  >;
  const systemScores = mergeSystemScores(surveyDomainScores, labSystemScores);
  const systemsWithData = HEALTH_SYSTEMS.filter((s) => systemScores[s.key] != null);
  const systemsWithoutData = HEALTH_SYSTEMS.filter((s) => systemScores[s.key] == null);

  const scoreValues = Object.values(systemScores).filter(
    (v): v is number => v != null,
  );
  const overallScore =
    scoreValues.length > 0
      ? Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length)
      : null;

  const chronologicalAge = ageInYears(pet.birth_date, pet.estimated_age_years);
  const biologicalAge =
    chronologicalAge != null && overallScore != null
      ? estimateBiologicalAge(chronologicalAge, overallScore)
      : null;

  return (
    <Container className="py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/health" className="text-sm text-gris-pizarra hover:text-azul-confianza">
            ← Mis mascotas
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-azul-confianza">
            {pet.name}
          </h1>
          <p className="text-sm text-gris-pizarra">
            {pet.breed || (pet.species === "gato" ? "Gato" : "Perro")}
            {chronologicalAge != null && ` · ${chronologicalAge} años`}
          </p>
        </div>
        <Link href={`/health/mascotas/${pet.id}/encuesta`}>
          <Button variant="secondary">
            {lastSurvey ? "Repetir encuesta de bienestar" : "Completar encuesta de bienestar"}
          </Button>
        </Link>
      </div>

      {/* Resumen general */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-card border border-azul-confianza/10 bg-white p-6 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-gris-pizarra/70">
            Índice de vitalidad general
          </p>
          {overallScore != null ? (
            <>
              <p className="mt-2 text-4xl font-bold text-azul-confianza">
                {overallScore}
                <span className="text-lg text-gris-pizarra">/100</span>
              </p>
              <Badge tone={STATUS_TONE[scoreToStatus(overallScore)]}>
                {STATUS_LABEL[scoreToStatus(overallScore)]}
              </Badge>
              {overallScore < 60 && (
                <p className="mt-2 text-xs text-gris-pizarra">
                  Un puntaje bajo como este correspondió, en el estudio en
                  que se basa esta encuesta (Banzato et al. 2019, 401
                  perros), a un riesgo de mortalidad a 6 meses hasta 18 veces
                  mayor — vale la pena una consulta veterinaria.
                </p>
              )}
            </>
          ) : (
            <p className="mt-2 text-sm text-gris-pizarra">
              Completa la encuesta de bienestar para ver el primer puntaje.
            </p>
          )}
        </div>

        <div className="rounded-card border border-aqua-bienestar/40 bg-aqua-bienestar/10 p-6 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-azul-confianza/70">
            Edad biológica estimada
          </p>
          {biologicalAge != null ? (
            <p className="mt-2 text-4xl font-bold text-azul-confianza">
              {biologicalAge}
              <span className="text-lg text-gris-pizarra"> años</span>
            </p>
          ) : (
            <p className="mt-2 text-sm text-azul-confianza/80">
              Necesitamos fecha de nacimiento y al menos un puntaje de
              vitalidad para estimarla.
            </p>
          )}
          <p className="mt-2 text-xs text-azul-confianza/70">
            Indicador orientativo propio de PlenaPet, no un diagnóstico
            clínico — combina el índice de vitalidad (que sí replica una
            fórmula publicada y validada, ver abajo) y, si existen,
            resultados de laboratorio. Ante cualquier duda, consulta con tu
            veterinario.
          </p>
        </div>
      </div>

      {/* Por sistema */}
      <div className="mt-10">
        <h2 className="text-lg font-bold text-azul-confianza">
          Salud por sistema
        </h2>
        {systemsWithData.length === 0 ? (
          <p className="mt-3 text-sm text-gris-pizarra">
            Todavía no hay suficientes datos. Completa la encuesta de
            bienestar para empezar.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {systemsWithData.map((system) => {
              const score = systemScores[system.key]!;
              const status = scoreToStatus(score);
              return (
                <div
                  key={system.key}
                  className="rounded-card border border-azul-confianza/10 bg-white p-5 shadow-card"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-azul-confianza">
                      {system.label}
                    </h3>
                    <Badge tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</Badge>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-azul-confianza">
                    {score}
                    <span className="text-sm text-gris-pizarra">/100</span>
                  </p>
                  {system.key === "renal" && iris && (
                    <p className="mt-2 text-xs font-semibold text-azul-confianza">
                      🩺 {iris.label}
                      <span className="block font-normal text-gris-pizarra">
                        Estadificación IRIS — estándar clínico veterinario mundial.
                      </span>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {systemsWithoutData.length > 0 && (
          <p className="mt-4 text-xs text-gris-pizarra/70">
            Sin datos todavía: {systemsWithoutData.map((s) => s.label).join(", ")}.
            {" "}Un panel de laboratorio ayuda a completar el resto del cuadro.
          </p>
        )}
      </div>

      {/* Recomendaciones */}
      {recommendations && recommendations.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-bold text-azul-confianza">
            Recomendaciones
          </h2>
          <div className="mt-4 space-y-3">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="flex items-start justify-between gap-4 rounded-card border border-azul-confianza/10 bg-white p-4 shadow-card"
              >
                <div>
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
                    <h3 className="text-sm font-semibold text-azul-confianza">
                      {rec.title}
                    </h3>
                  </div>
                  {rec.description && (
                    <p className="mt-1 text-sm text-gris-pizarra">
                      {rec.description}
                    </p>
                  )}
                </div>
                {rec.products && (
                  <Link
                    href={`/productos/${rec.products.slug}`}
                    className="whitespace-nowrap text-sm font-semibold text-azul-confianza hover:underline"
                  >
                    Ver producto →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Historial de laboratorio */}
      <div className="mt-10">
        <h2 className="text-lg font-bold text-azul-confianza">
          Paneles de laboratorio
        </h2>
        {!labPanels || labPanels.length === 0 ? (
          <p className="mt-3 text-sm text-gris-pizarra">
            Todavía no hay resultados de laboratorio publicados para{" "}
            {pet.name}.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {labPanels.map((panel) => (
              <details
                key={panel.id}
                className="rounded-card border border-azul-confianza/10 bg-white p-4 shadow-card"
              >
                <summary className="cursor-pointer text-sm font-semibold text-azul-confianza">
                  {panel.lab_name || "Laboratorio"} ·{" "}
                  {panel.sample_taken_at ?? "fecha sin registrar"} ·{" "}
                  {panel.lab_results?.length ?? 0} analitos
                </summary>
                <table className="mt-3 w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-gris-pizarra/70">
                      <th className="py-1 pr-3">Analito</th>
                      <th className="py-1 pr-3">Valor</th>
                      <th className="py-1 pr-3">Rango</th>
                      <th className="py-1">Sistema</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(panel.lab_results ?? []).map((r: any) => (
                      <tr key={r.id} className="border-t border-azul-confianza/5">
                        <td className="py-1.5 pr-3">{r.analyte_name}</td>
                        <td className="py-1.5 pr-3">
                          {r.value_text ?? `${r.value ?? "—"} ${r.unit ?? ""}`}
                        </td>
                        <td className="py-1.5 pr-3 text-gris-pizarra">
                          {r.reference_min != null && r.reference_max != null
                            ? `${r.reference_min} – ${r.reference_max}`
                            : "—"}
                        </td>
                        <td className="py-1.5 text-gris-pizarra">
                          {healthSystemLabel(r.organ_system)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </details>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
