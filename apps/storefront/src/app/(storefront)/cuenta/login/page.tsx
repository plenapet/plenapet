import Link from "next/link";
import { Button, Container } from "@plenapet/ui";
import { signInCustomerAction } from "@/lib/actions/customer-auth";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; next?: string; confirmar?: string };
}) {
  const next = searchParams.next ?? "/health/mascotas";

  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm rounded-card border border-azul-confianza/10 bg-white p-8 shadow-card">
        <h1 className="text-xl font-bold text-azul-confianza">Ingresa a tu cuenta</h1>
        <p className="mt-1 text-sm text-gris-pizarra">
          Con tu cuenta PlenaPet accedes a tus pedidos y a PlenaPet Health.
        </p>

        {searchParams.confirmar && (
          <p className="mt-4 rounded-lg bg-aqua-bienestar/15 px-3 py-2 text-sm text-azul-confianza">
            Te enviamos un correo de confirmación. Confírmalo y vuelve a
            iniciar sesión.
          </p>
        )}
        {searchParams.error && (
          <p className="mt-4 rounded-lg bg-[#FFF1E0] px-3 py-2 text-sm text-[#8A4B00]">
            No pudimos iniciar sesión. Revisa tu correo y contraseña.
          </p>
        )}

        <form action={signInCustomerAction} className="mt-6 space-y-4">
          <input type="hidden" name="next" value={next} />
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
            placeholder="Contraseña"
            className="w-full rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
          />
          <Button type="submit" className="w-full">
            Ingresar
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-gris-pizarra">
          ¿Primera vez?{" "}
          <Link
            href={`/cuenta/registro?next=${encodeURIComponent(next)}`}
            className="font-semibold text-azul-confianza hover:underline"
          >
            Crea tu cuenta
          </Link>
        </p>
      </div>
    </Container>
  );
}
