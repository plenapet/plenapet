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

  return (
    <div className="min-h-screen bg-[#F7FBFB]">
      <HealthHeader email={user.email ?? ""} />
      <main>{children}</main>
    </div>
  );
}
