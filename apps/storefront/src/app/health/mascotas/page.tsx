import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@plenapet/ui";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Mis mascotas | PlenaPet Health",
  robots: { index: false, follow: false },
};

export default async function MisMascotasPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/cuenta/login?next=/health/mascotas");

  const { data: pets } = await supabase
    .from("pets")
    .select("id, name, species, breed")
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <Container className="py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-azul-confianza">
            Mis mascotas
          </h1>
          <p className="mt-1 text-sm text-gris-pizarra">
            Seguimiento de bienestar, salud por sistemas y edad biológica
            estimada de tus mascotas.
          </p>
        </div>
        <Link
          href="/health/mascotas/nueva"
          className="whitespace-nowrap rounded-full bg-azul-confianza px-4 py-2 text-sm font-semibold text-white"
        >
          Agregar mascota
        </Link>
      </div>

      {!pets || pets.length === 0 ? (
        <div className="mt-10 rounded-card border border-dashed border-azul-confianza/25 bg-white p-10 text-center">
          <p className="text-sm text-gris-pizarra">
            Todavía no has registrado ninguna mascota.
          </p>
          <Link
            href="/health/mascotas/nueva"
            className="mt-4 inline-block rounded-full bg-azul-confianza px-4 py-2 text-sm font-semibold text-white"
          >
            Registrar mi primera mascota
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => (
            <Link
              key={pet.id}
              href={`/health/mascotas/${pet.id}`}
              className="rounded-card border border-azul-confianza/10 bg-white p-5 shadow-card transition-transform hover:-translate-y-0.5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-aqua-bienestar/25 text-lg">
                {pet.species === "gato" ? "🐱" : "🐶"}
              </div>
              <h2 className="mt-3 font-bold text-azul-confianza">{pet.name}</h2>
              <p className="text-sm text-gris-pizarra">
                {pet.breed || (pet.species === "gato" ? "Gato" : "Perro")}
              </p>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}
