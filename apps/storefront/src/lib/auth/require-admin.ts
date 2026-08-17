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

/**
 * Igual que `requireAdminUserId`, pero además exige rol `super_admin`.
 * Reservado para acciones destructivas o que revierten una publicación ya
 * visible para el propietario (borrar mascota, borrar/despublicar un panel
 * de laboratorio, borrar una recomendación) — el resto de operaciones
 * (crear, agregar, publicar) las puede hacer cualquier admin activo.
 */
export async function requireSuperAdminUserId(): Promise<string> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("active, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!adminUser?.active) redirect("/admin/login?error=No%20autorizado");
  if (adminUser.role !== "super_admin") {
    redirect(
      "/admin?error=" +
        encodeURIComponent("Esta acción requiere permisos de super_admin."),
    );
  }

  return user.id;
}

/**
 * Lectura del admin actualmente logueado (id + rol), para decidir en la UI
 * qué mostrar (ej. ocultar botones destructivos a quien no es super_admin).
 * No es un guard — no redirige, solo informa. La seguridad real la hacen
 * `requireAdminUserId`/`requireSuperAdminUserId` dentro de cada server action.
 */
export async function getCurrentAdmin(): Promise<{
  id: string;
  role: string;
} | null> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("admin_users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return data ? { id: user.id, role: data.role } : null;
}
