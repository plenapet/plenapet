"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, Container, formatCOP } from "@plenapet/ui";
import { cartSubtotalCents, useCartStore } from "@/lib/cart-store";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const subtotal = cartSubtotalCents(items);

  return (
    <Container className="py-10">
      <h1 className="text-3xl font-bold text-azul-confianza">Tu carrito</h1>

      {items.length === 0 ? (
        <div className="mt-8 rounded-card border border-azul-confianza/10 bg-white p-10 text-center">
          <p className="text-sm text-gris-pizarra">Tu carrito está vacío.</p>
          <Link href="/productos" className="mt-4 inline-block">
            <Button>Ir al catálogo</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <ul className="divide-y divide-azul-confianza/10 rounded-card border border-azul-confianza/10 bg-white">
            {items.map((item) => (
              <li
                key={item.productId}
                className="flex flex-wrap items-center justify-between gap-4 p-5"
              >
                <div>
                  <Link
                    href={`/productos/${item.slug}`}
                    className="font-semibold text-azul-confianza hover:underline"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-gris-pizarra">
                    {formatCOP(item.priceCents)} c/u
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      setQuantity(
                        item.productId,
                        Math.max(1, Number(e.target.value)),
                      )
                    }
                    className="w-16 rounded-lg border border-azul-confianza/15 px-2 py-1 text-center text-sm"
                  />
                  <span className="w-28 text-right text-sm font-semibold text-azul-confianza">
                    {formatCOP(item.priceCents * item.quantity)}
                  </span>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-sm text-gris-pizarra hover:text-coral-cercania"
                  >
                    Quitar
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="h-fit rounded-card border border-azul-confianza/10 bg-white p-6 shadow-card">
            <h2 className="text-sm font-semibold text-azul-confianza">
              Resumen
            </h2>
            <div className="mt-4 flex justify-between text-sm text-gris-pizarra">
              <span>Subtotal</span>
              <span>{formatCOP(subtotal)}</span>
            </div>
            <p className="mt-1 text-xs text-gris-pizarra/70">
              El envío se calcula en el siguiente paso.
            </p>
            <Link href="/checkout" className="mt-5 block">
              <Button className="w-full">Continuar al pago</Button>
            </Link>
          </div>
        </div>
      )}
    </Container>
  );
}
