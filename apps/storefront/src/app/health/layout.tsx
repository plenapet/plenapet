import { createSupabaseServerClient } from "@/lib/supabase/server";
import { HealthHeader } from "@/components/health/HealthHeader";

/**
 * Layout público de todo /health — a propósito NO exige sesión acá. La
 * landing (/health) tiene que ser indexable por buscadores para el
 * posicionamiento de PlenaPet Health; el guard de autenticación real vive
 * en /health/mascotas/layout.tsx, un nivel más adentro, que es donde
 * arranca la app que sí requiere cuenta.
 */
export default async function HealthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-[#F7FBFB]">
      <HealthHeader email={user?.email ?? null} />
      <main>{children}</main>
    </div>
  );
}
