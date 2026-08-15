"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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

export function Header() {
  const items = useCartStore((s) => s.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const count = mounted ? cartItemCount(items) : 0;

  return (
    <header className="sticky top-0 z-40 border-b border-azul-confianza/10 bg-white/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link href="/">
          <Logo />
        </Link>
        <nav className="hidden flex-1 items-center gap-5 overflow-x-auto text-sm font-medium text-gris-pizarra lg:flex">
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
        <div className="flex items-center gap-4">
          <Link
            href="/productos"
            className="hidden text-sm font-medium text-gris-pizarra hover:text-azul-confianza sm:block"
          >
            Buscar
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
        </div>
      </Container>
    </header>
  );
}
