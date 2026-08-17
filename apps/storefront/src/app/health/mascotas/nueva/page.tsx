import { Button, Container } from "@plenapet/ui";
import { createPetAction } from "@/lib/actions/pets";

export default function NuevaMascotaPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <Container className="max-w-lg py-10">
      <h1 className="text-2xl font-bold text-azul-confianza">
        Registrar mascota
      </h1>
      <p className="mt-1 text-sm text-gris-pizarra">
        Estos datos son la base de su perfil de salud en PlenaPet Health.
      </p>

      {searchParams.error && (
        <p className="mt-4 rounded-lg bg-[#FFF1E0] px-3 py-2 text-sm text-[#8A4B00]">
          No pudimos guardar: {searchParams.error}
        </p>
      )}

      <form action={createPetAction} className="mt-6 space-y-4 rounded-card border border-azul-confianza/10 bg-white p-6 shadow-card">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-gris-pizarra">
            Nombre
          </label>
          <input
            name="name"
            required
            className="mt-2 w-full rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gris-pizarra">
              Especie
            </label>
            <select
              name="species"
              className="mt-2 w-full rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
            >
              <option value="perro">Perro</option>
              <option value="gato">Gato</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gris-pizarra">
              Sexo
            </label>
            <select
              name="sex"
              className="mt-2 w-full rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
            >
              <option value="">Sin especificar</option>
              <option value="macho">Macho</option>
              <option value="hembra">Hembra</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-gris-pizarra">
            Raza
          </label>
          <input
            name="breed"
            className="mt-2 w-full rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gris-pizarra">
              Fecha de nacimiento
            </label>
            <input
              type="date"
              name="birthDate"
              className="mt-2 w-full rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gris-pizarra">
              Peso (kg)
            </label>
            <input
              type="number"
              step="0.1"
              name="weightKg"
              className="mt-2 w-full rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-gris-pizarra">
          <input type="checkbox" name="sterilized" className="rounded" />
          Está esterilizado/a
        </label>

        <Button type="submit" className="w-full">
          Guardar mascota
        </Button>
      </form>
    </Container>
  );
}
