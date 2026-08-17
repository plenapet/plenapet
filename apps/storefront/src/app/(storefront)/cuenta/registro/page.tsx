import Link from "next/link";
import { Button, Container } from "@plenapet/ui";
import { signUpAction } from "@/lib/actions/customer-auth";

export default function RegistroPage({
  searchParams,
}: {
  searchParams: { error?: string; next?: string };
}) {
  const next = searchParams.next ?? "/health/mascotas";

  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm rounded-card border border-azul-confianza/10 bg-white p-8 shadow-card">
        <h1 className="text-xl font-bold text-azul-confianza">Crea tu cuenta</h1>
        <p className="mt-1 text-sm text-gris-pizarra">
          Una sola cuenta PlenaPet para comprar y para llevar el seguimiento
          de salud de tu mascota en PlenaPet Health.
        </p>

        {searchParams.error && (
          <p className="mt-4 rounded-lg bg-[#FFF1E0] px-3 py-2 text-sm text-[#8A4B00]">
            No pudimos crear tu cuenta: {searchParams.error}
          </p>
        )}

        <form action={signUpAction} className="mt-6 space-y-4">
          <input type="hidden" name="next" value={next} />
          <input
            name="fullName"
            type="text"
            required
            placeholder="Nombre completo"
            className="w-full rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
          />
          <input
            name="email"
            type="email"
            required
            placeholder="Correo electrónico"
            className="w-full rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
          />
          <input
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="Contraseña (mínimo 6 caracteres)"
            className="w-full rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
          />
          <Button type="submit" className="w-full">
            Crear cuenta
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-gris-pizarra">
          ¿Ya tienes cuenta?{" "}
          <Link
            href={`/cuenta/login?next=${encodeURIComponent(next)}`}
            className="font-semibold text-azul-confianza hover:underline"
          >
            Ingresa
          </Link>
        </p>
      </div>
    </Container>
  );
}
