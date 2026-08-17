import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { HealthHeader } from "@/components/health/HealthHeader";

export const metadata: Metadata = {
  title: "PlenaPet Health",
  description:
    "Seguimiento de bienestar y salud de tu mascota: encuesta de vitalidad, resultados de laboratorio y recomendaciones.",
};

export default async function HealthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // El middleware ya protege /health, esto es una segunda capa de defensa.
  if (!user) redirect("/cuenta/login?next=/health");

  // Respaldo del trigger handle_new_user (migración 0003): ese trigger solo
  // corre para usuarios nuevos de auth.users. Si por cualquier motivo un
  // usuario llega hasta acá sin fila en profiles (ej. se creó antes de que
  // existiera el trigger), se crea acá — pets.customer_id la necesita.
  // Requiere la policy de inserción de la migración 0005_profiles_insert_policy.sql.
  await supabase
    .from("profiles")
    .upsert(
      { id: user.id, full_name: user.user_metadata?.full_name ?? null },
      { onConflict: "id", ignoreDuplicates: true },
    );

  return (
    <div className="min-h-screen bg-[#F7FBFB]">
      <HealthHeader email={user.email ?? ""} />
      <main>{children}</main>
    </div>
  );
}
