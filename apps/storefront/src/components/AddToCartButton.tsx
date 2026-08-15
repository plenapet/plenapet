"use client";

import { useState } from "react";
import { Button } from "@plenapet/ui";
import { useCartStore } from "@/lib/cart-store";

export function AddToCartButton({
  productId,
  slug,
  name,
  priceCents,
  disabled,
}: {
  productId: string;
  slug: string;
  name: string;
  priceCents: number;
  disabled?: boolean;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center rounded-full border border-azul-confianza/20">
        <button
          type="button"
          aria-label="Disminuir cantidad"
          className="px-3 py-2 text-azul-confianza disabled:opacity-40"
          disabled={disabled || quantity <= 1}
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
        >
          −
        </button>
        <span className="w-6 text-center text-sm font-semibold">{quantity}</span>
        <button
          type="button"
          aria-label="Aumentar cantidad"
          className="px-3 py-2 text-azul-confianza disabled:opacity-40"
          disabled={disabled}
          onClick={() => setQuantity((q) => q + 1)}
        >
          +
        </button>
      </div>
      <Button
        disabled={disabled}
        onClick={() => {
          addItem({ productId, slug, name, priceCents }, quantity);
          setAdded(true);
          setTimeout(() => setAdded(false), 1800);
        }}
      >
        {disabled ? "Agotado" : added ? "Agregado ✓" : "Agregar al carrito"}
      </Button>
    </div>
  );
}
