import { notFound, redirect } from "next/navigation";
import { Button, Container } from "@plenapet/ui";
import { SURVEY_QUESTIONS, healthSystemLabel } from "@plenapet/database";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { submitWellnessSurveyAction } from "@/lib/actions/pets";

export default async function EncuestaPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { error?: string };
}) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/cuenta/login?next=/health/mascotas/${params.id}/encuesta`);

  const { data: pet } = await supabase
    .from("pets")
    .select("id, name")
    .eq("id", params.id)
    .eq("customer_id", user.id)
    .maybeSingle();

  if (!pet) notFound();

  const domains = Array.from(new Set(SURVEY_QUESTIONS.map((q) => q.domain)));

  return (
    <Container className="max-w-2xl py-10">
      <h1 className="text-2xl font-bold text-azul-confianza">
        Encuesta de bienestar de {pet.name}
      </h1>
      <p className="mt-1 text-sm text-gris-pizarra">
        Responde según cómo ha estado {pet.name} en las últimas semanas. Toma
        unos 3 minutos. El cálculo del puntaje sigue la misma fórmula de un
        índice de fragilidad validado en un estudio con 401 perros, publicado
        en <em>Scientific Reports</em> (Banzato et al., 2019).
      </p>

      {searchParams.error && (
        <p className="mt-4 rounded-lg bg-[#FFF1E0] px-3 py-2 text-sm text-[#8A4B00]">
          No pudimos guardar la encuesta: {searchParams.error}
        </p>
      )}

      <form action={submitWellnessSurveyAction} className="mt-6 space-y-8">
        <input type="hidden" name="petId" value={pet.id} />

        {domains.map((domain) => (
          <fieldset
            key={domain}
            className="space-y-5 rounded-card border border-azul-confianza/10 bg-white p-6 shadow-card"
          >
            <legend className="px-1 text-sm font-bold uppercase tracking-wide text-coral-cercania">
              {healthSystemLabel(domain)}
            </legend>
            {SURVEY_QUESTIONS.filter((q) => q.domain === domain).map((q) => (
              <div key={q.id}>
                <p className="text-sm font-medium text-azul-confianza">
                  {q.text}
                </p>
                <div className="mt-2 flex flex-wrap gap-3">
                  {q.options.map((opt) => (
                    <label
                      key={opt.value}
                      className="flex items-center gap-2 rounded-full border border-azul-confianza/15 px-3 py-1.5 text-sm text-gris-pizarra has-[:checked]:border-azul-confianza has-[:checked]:bg-azul-confianza/5 has-[:checked]:text-azul-confianza"
                    >
                      <input
                        type="radio"
                        name={`q_${q.id}`}
                        value={opt.value}
                        required
                        className="accent-azul-confianza"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </fieldset>
        ))}

        <Button type="submit" className="w-full">
          Guardar encuesta
        </Button>
      </form>
    </Container>
  );
}
