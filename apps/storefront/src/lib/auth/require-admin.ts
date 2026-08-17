import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Guard reutilizable para server actions de /admin. La página ya está
 * protegida por el layout, pero una server action es técnicamente un
 * endpoint invocable aparte — se vuelve a verificar acá por defensa en
 * profundidad, no por desconfianza del layout.
 */
export async function requireAdminUserId(): Promise<string> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("active")
    .eq("id", user.id)
    .maybeSingle();

  if (!adminUser?.active) redirect("/admin/login?error=No%20autorizado");

  return user.id;
}
