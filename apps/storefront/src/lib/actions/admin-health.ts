"use server";

import { redirect } from "next/navigation";
import { getServiceSupabaseClient } from "@plenapet/database";
import { requireAdminUserId } from "@/lib/auth/require-admin";

export async function createLabPanelAction(formData: FormData) {
  await requireAdminUserId();
  const petId = String(formData.get("petId") ?? "");
  const labName = String(formData.get("labName") ?? "").trim() || null;
  const sampleTakenAt = String(formData.get("sampleTakenAt") ?? "") || null;

  const supabase = getServiceSupabaseClient();
  const { data, error } = await supabase
    .from("lab_panels")
    .insert({ pet_id: petId, lab_name: labName, sample_taken_at: sampleTakenAt })
    .select("id")
    .single();

  if (error || !data) {
    redirect(`/admin/salud/${petId}?error=${encodeURIComponent(error?.message ?? "No se pudo crear el panel")}`);
  }

  redirect(`/admin/salud/${petId}/panel/${data.id}`);
}

export async function addLabResultAction(formData: FormData) {
  await requireAdminUserId();
  const petId = String(formData.get("petId") ?? "");
  const labPanelId = String(formData.get("labPanelId") ?? "");

  const supabase = getServiceSupabaseClient();
  const { error } = await supabase.from("lab_results").insert({
    lab_panel_id: labPanelId,
    analyte_key: String(formData.get("analyteKey") ?? "").trim() || null,
    exam_type: String(formData.get("examType") ?? "").trim(),
    analyte_name: String(formData.get("analyteName") ?? "").trim(),
    value: formData.get("value") ? Number(formData.get("value")) : null,
    value_text: String(formData.get("valueText") ?? "").trim() || null,
    unit: String(formData.get("unit") ?? "").trim() || null,
    reference_min: formData.get("referenceMin")
      ? Number(formData.get("referenceMin"))
      : null,
    reference_max: formData.get("referenceMax")
      ? Number(formData.get("referenceMax"))
      : null,
    organ_system: String(formData.get("organSystem") ?? "general"),
  });

  if (error) {
    redirect(
      `/admin/salud/${petId}/panel/${labPanelId}?error=${encodeURIComponent(error.message)}`,
    );
  }

  redirect(`/admin/salud/${petId}/panel/${labPanelId}`);
}

export async function deleteLabResultAction(formData: FormData) {
  await requireAdminUserId();
  const petId = String(formData.get("petId") ?? "");
  const labPanelId = String(formData.get("labPanelId") ?? "");
  const resultId = String(formData.get("resultId") ?? "");

  const supabase = getServiceSupabaseClient();
  await supabase.from("lab_results").delete().eq("id", resultId);

  redirect(`/admin/salud/${petId}/panel/${labPanelId}`);
}

export async function publishLabPanelAction(formData: FormData) {
  const adminId = await requireAdminUserId();
  const petId = String(formData.get("petId") ?? "");
  const labPanelId = String(formData.get("labPanelId") ?? "");

  const supabase = getServiceSupabaseClient();
  await supabase
    .from("lab_panels")
    .update({
      status: "published",
      published_at: new Date().toISOString(),
      created_by: adminId,
    })
    .eq("id", labPanelId);

  redirect(`/admin/salud/${petId}`);
}

export async function addHealthRecommendationAction(formData: FormData) {
  await requireAdminUserId();
  const petId = String(formData.get("petId") ?? "");

  const supabase = getServiceSupabaseClient();
  const relatedProductId = String(formData.get("relatedProductId") ?? "").trim();
  const { error } = await supabase.from("health_recommendations").insert({
    pet_id: petId,
    source: "manual",
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim() || null,
    severity: String(formData.get("severity") ?? "info"),
    related_product_id: relatedProductId || null,
  });

  if (error) {
    redirect(`/admin/salud/${petId}?error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/admin/salud/${petId}`);
}
