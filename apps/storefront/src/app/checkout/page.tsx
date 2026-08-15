"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, Container, formatCOP } from "@plenapet/ui";
import { cartSubtotalCents, useCartStore } from "@/lib/cart-store";

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <Container className="py-10">
        <div className="rounded-card border border-azul-confianza/10 bg-white p-10 text-center">
          <p className="text-sm text-gris-pizarra">
            Tu carrito está vacío, no hay nada que pagar todavía.
          </p>
          <Link href="/productos" className="mt-4 inline-block">
            <Button>Ir al catálogo</Button>
          </Link>
        </div>
      </Container>
    );
  }

  const subtotal = cartSubtotalCents(items);
  const shipping = subtotal > 15000000 ? 0 : 900000;

  return (
    <Container className="py-10">
      <h1 className="text-3xl font-bold text-azul-confianza">Checkout</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <form className="space-y-5 rounded-card border border-azul-confianza/10 bg-white p-6">
          <h2 className="text-sm font-semibold text-azul-confianza">
            Dirección de entrega
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              placeholder="Nombre completo"
              className="rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm sm:col-span-2"
            />
            <input
              placeholder="Teléfono"
              className="rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
            />
            <input
              placeholder="Ciudad"
              className="rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
            />
            <input
              placeholder="Dirección"
              className="rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm sm:col-span-2"
            />
          </div>

          <div className="rounded-card border border-dashed border-azul-confianza/25 bg-crema-calido p-4 text-sm text-gris-pizarra">
            El pago con Wompi (tarjetas, PSE, Nequi) se conecta en la próxima
            fase, junto con la base de datos en Supabase. Por ahora este
            checkout es solo de interfaz.
          </div>

          <Button type="button" className="w-full" disabled>
            Pagar con Wompi (próximamente)
          </Button>
        </form>

        <div className="h-fit rounded-card border border-azul-confianza/10 bg-white p-6 shadow-card">
          <h2 className="text-sm font-semibold text-azul-confianza">
            Resumen del pedido
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-gris-pizarra">
            {items.map((item) => (
              <li key={item.productId} className="flex justify-between gap-2">
                <span className="line-clamp-1">
                  {item.quantity} × {item.name}
                </span>
                <span>{formatCOP(item.priceCents * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 border-t border-azul-confianza/10 pt-4 text-sm">
            <div className="flex justify-between text-gris-pizarra">
              <span>Subtotal</span>
              <span>{formatCOP(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gris-pizarra">
              <span>Envío</span>
              <span>{shipping === 0 ? "Gratis" : formatCOP(shipping)}</span>
            </div>
            <div className="flex justify-between pt-2 text-base font-bold text-azul-confianza">
              <span>Total</span>
              <span>{formatCOP(subtotal + shipping)}</span>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
