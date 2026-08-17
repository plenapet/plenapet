"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Logo } from "@plenapet/ui";
import { useCartStore, cartItemCount } from "@/lib/cart-store";

const NAV_LINKS = [
  { href: "/productos?categoria=alimentos", label: "Alimentos" },
  { href: "/productos?categoria=farmacia-veterinaria", label: "Farmacia veterinaria" },
  { href: "/productos?categoria=desparasitantes", label: "Desparasitantes" },
  { href: "/productos?categoria=vitaminas-suplementos", label: "Vitaminas y suplementos" },
  { href: "/productos?categoria=higiene", label: "Higiene" },
  { href: "/productos?categoria=accesorios", label: "Accesorios" },
];

function SearchForm({
  className = "",
  onSubmit,
}: {
  className?: string;
  onSubmit?: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (query.trim()) params.set("q", query.trim());
        router.push(`/productos?${params.toString()}`);
        onSubmit?.();
      }}
    >
      <label className="sr-only" htmlFor="buscar-productos">
        Buscar productos
      </label>
      <input
        id="buscar-productos"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Busca alimentos, marcas, referencias..."
        className="w-full rounded-full border border-azul-confianza/15 bg-white px-4 py-2 text-sm text-azul-confianza placeholder:text-gris-pizarra/50 focus:border-azul-confianza/40 focus:outline-none"
      />
    </form>
  );
}

export function Header() {
  const items = useCartStore((s) => s.items);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const count = mounted ? cartItemCount(items) : 0;

  return (
    <header className="sticky top-0 z-40 border-b border-azul-confianza/10 bg-white/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link href="/" onClick={() => setMenuOpen(false)}>
          <Logo />
        </Link>

        <SearchForm className="hidden max-w-md flex-1 lg:block" />

        <div className="flex items-center gap-3">
          <Link
            href="/health"
            className="hidden items-center gap-1.5 rounded-full border border-aqua-bienestar/50 bg-aqua-bienestar/15 px-3 py-1.5 text-sm font-semibold text-azul-confianza sm:inline-flex"
          >
            🩺 PlenaPet Health
          </Link>
          <Link
            href="/carrito"
            className="relative inline-flex items-center rounded-full bg-azul-confianza px-4 py-2 text-sm font-semibold text-white"
          >
            Carrito
            {count > 0 && (
              <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-coral-cercania px-1.5 text-xs font-bold text-azul-confianza">
                {count}
              </span>
            )}
          </Link>
          <button
            type="button"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-azul-confianza/15 text-azul-confianza lg:hidden"
          >
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
                <path d="M0 1h18M0 7h18M0 13h18" stroke="currentColor" strokeWidth="2" />
              </svg>
            )}
          </button>
        </div>
      </Container>

      <div className="hidden border-t border-azul-confianza/10 lg:block">
        <Container>
          <nav className="flex h-11 items-center justify-center gap-7 text-sm font-medium text-gris-pizarra">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="whitespace-nowrap transition-colors hover:text-azul-confianza"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </Container>
      </div>

      {menuOpen && (
        <div className="border-t border-azul-confianza/10 bg-white lg:hidden">
          <Container className="space-y-4 py-4">
            <SearchForm onSubmit={() => setMenuOpen(false)} />
            <Link
              href="/health"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-1.5 rounded-full border border-aqua-bienestar/50 bg-aqua-bienestar/15 px-3 py-2 text-sm font-semibold text-azul-confianza"
            >
              🩺 PlenaPet Health
            </Link>
            <nav className="flex flex-col divide-y divide-azul-confianza/5 text-sm font-medium text-gris-pizarra">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="py-2.5 transition-colors hover:text-azul-confianza"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
