import Link from "next/link";
import { getServiceSupabaseClient } from "@plenapet/database";
import { Topbar } from "@/components/admin/Topbar";

export default async function SaludPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const supabase = getServiceSupabaseClient();

  let query = supabase
    .from("pets")
    .select("id, name, species, breed, profiles(full_name)")
    .order("created_at", { ascending: false })
    .limit(50);

  if (searchParams.q) {
    query = query.ilike("name", `%${searchParams.q}%`);
  }

  const { data: pets } = await query;

  return (
    <div>
      <Topbar title="PlenaPet Health" />
      <div className="p-8">
        <form className="flex gap-3">
          <input
            type="search"
            name="q"
            defaultValue={searchParams.q ?? ""}
            placeholder="Buscar mascota por nombre..."
            className="w-full max-w-sm rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-full bg-azul-confianza px-4 py-2 text-sm font-semibold text-white"
          >
            Buscar
          </button>
        </form>

        <div className="mt-6 overflow-x-auto rounded-card border border-azul-confianza/10 bg-white shadow-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-gris-pizarra/70">
                <th className="px-5 py-3">Mascota</th>
                <th className="px-5 py-3">Especie/Raza</th>
                <th className="px-5 py-3">Propietario</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {(pets ?? []).map((pet: any) => (
                <tr key={pet.id} className="border-t border-azul-confianza/5">
                  <td className="px-5 py-3 font-medium text-azul-confianza">
                    {pet.name}
                  </td>
                  <td className="px-5 py-3 text-gris-pizarra">
                    {pet.species === "gato" ? "Gato" : "Perro"}
                    {pet.breed ? ` · ${pet.breed}` : ""}
                  </td>
                  <td className="px-5 py-3 text-gris-pizarra">
                    {pet.profiles?.full_name ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/admin/salud/${pet.id}`}
                      className="font-semibold text-azul-confianza hover:underline"
                    >
                      Gestionar →
                    </Link>
                  </td>
                </tr>
              ))}
              {(!pets || pets.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-gris-pizarra">
                    No hay mascotas registradas todavía.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
