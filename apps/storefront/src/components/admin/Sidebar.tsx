import Link from "next/link";
import { Logo } from "@plenapet/ui";
import { signOutAction } from "@/lib/actions/auth";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/catalogo", label: "Catálogo" },
  { href: "/admin/pedidos", label: "Pedidos" },
];

export function Sidebar({ email }: { email: string }) {
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-azul-confianza/10 bg-white">
      <div className="border-b border-azul-confianza/10 p-5">
        <Logo />
        <p className="mt-1 text-xs font-semibold text-gris-pizarra">
          Panel interno
        </p>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block rounded-lg px-3 py-2 text-sm font-medium text-gris-pizarra hover:bg-azul-confianza/5 hover:text-azul-confianza"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-azul-confianza/10 p-4">
        <p className="truncate text-xs text-gris-pizarra/70">{email}</p>
        <form action={signOutAction}>
          <button
            type="submit"
            className="mt-2 text-xs font-semibold text-coral-cercania hover:underline"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  );
}
