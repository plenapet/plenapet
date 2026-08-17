"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { computeSurveyScore } from "@plenapet/database";

export async function createPetAction(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/cuenta/login?next=/health/mascotas");

  const name = String(formData.get("name") ?? "").trim();
  const species = String(formData.get("species") ?? "perro");
  const breed = String(formData.get("breed") ?? "").trim() || null;
  const sex = String(formData.get("sex") ?? "") || null;
  const sterilized = formData.get("sterilized") === "on";
  const birthDate = String(formData.get("birthDate") ?? "") || null;
  const weightKg = formData.get("weightKg")
    ? Number(formData.get("weightKg"))
    : null;

  const { data: pet, error } = await supabase
    .from("pets")
    .insert({
      customer_id: user.id,
      name,
      species,
      breed,
      sex,
      sterilized,
      birth_date: birthDate,
      weight_kg: weightKg,
    })
    .select("id")
    .single();

  if (error || !pet) {
    redirect(`/health/mascotas/nueva?error=${encodeURIComponent(error?.message ?? "No se pudo guardar")}`);
  }

  redirect(`/health/mascotas/${pet.id}`);
}

export async function submitWellnessSurveyAction(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/cuenta/login?next=/health/mascotas");

  const petId = String(formData.get("petId") ?? "");
  const answers: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("q_")) {
      answers[key.replace("q_", "")] = String(value);
    }
  }

  const { domainScores, overallScore } = computeSurveyScore(answers);

  const { error } = await supabase.from("wellness_surveys").insert({
    pet_id: petId,
    answers,
    domain_scores: domainScores,
    overall_score: overallScore,
  });

  if (error) {
    redirect(`/health/mascotas/${petId}/encuesta?error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/health/mascotas/${petId}`);
}
