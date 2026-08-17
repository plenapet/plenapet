import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Guard de autenticación para la app real de PlenaPet Health (todo lo que
 * cuelga de /health/mascotas). El layout padre (`/health/layout.tsx`) es
 * público a propósito — esta es la frontera entre la landing indexable y la
 * app que requiere cuenta. El middleware ya protege /health/mascotas/*,
 * esto es una segunda capa de defensa.
 */
export default async function MisMascotasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/cuenta/login?next=/health/mascotas");

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

  return <>{children}</>;
}
