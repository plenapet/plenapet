import Link from "next/link";
import { Logo } from "@plenapet/ui";

const LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/pedidos", label: "Pedidos" },
];

export function Sidebar() {
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
      <div className="border-t border-azul-confianza/10 p-4 text-xs text-gris-pizarra/70">
        Autenticación de equipo pendiente de conectar con Supabase Auth.
      </div>
    </aside>
  );
}
