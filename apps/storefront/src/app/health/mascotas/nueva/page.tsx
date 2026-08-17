import { Container } from "@plenapet/ui";
import { NewPetForm } from "@/components/health/NewPetForm";

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

      <NewPetForm />
    </Container>
  );
}
