import Link from "next/link";
import { Container, Logo } from "@plenapet/ui";
import { signOutCustomerAction } from "@/lib/actions/customer-auth";

export function HealthHeader({ email }: { email: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-azul-confianza/10 bg-white">
      <Container className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/health">
            <Logo />
          </Link>
          <span className="rounded-full bg-aqua-bienestar/25 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-azul-confianza">
            Health
          </span>
        </div>

        <nav className="hidden items-center gap-5 text-sm font-medium text-gris-pizarra sm:flex">
          <Link href="/health" className="hover:text-azul-confianza">
            Mis mascotas
          </Link>
          <Link href="/productos" className="hover:text-azul-confianza">
            Ir a la tienda
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden max-w-[160px] truncate text-xs text-gris-pizarra/70 sm:block">
            {email}
          </span>
          <form action={signOutCustomerAction}>
            <button
              type="submit"
              className="text-xs font-semibold text-coral-cercania hover:underline"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </Container>
    </header>
  );
}
