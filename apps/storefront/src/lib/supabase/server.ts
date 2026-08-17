import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Cliente de Supabase con sesión (cookies) para Server Components / Server
 * Actions dentro de /admin. Usa la anon key — la sesión del usuario logueado
 * es lo que autoriza, no una llave privilegiada. No confundir con
 * getServiceSupabaseClient() de @plenapet/database, que es para las lecturas
 * de datos del admin (sin sesión, con service_role).
 */
export function createSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Se llama desde un Server Component (no se pueden setear
            // cookies ahí); el middleware se encarga de refrescar la sesión.
          }
        },
      },
    },
  );
}
