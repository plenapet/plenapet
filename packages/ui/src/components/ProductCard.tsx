import Link from "next/link";
import { Badge } from "./Badge";
import { formatCOP } from "../format";

export type ProductCardData = {
  slug: string;
  name: string;
  brandName: string;
  priceCents: number;
  compareAtPriceCents?: number | null;
  stockStatus: "in_stock" | "low_stock" | "out_of_stock";
  requiresPrescription: boolean;
};

export function ProductCard({
  product,
  href,
}: {
  product: ProductCardData;
  href: string;
}) {
  const onSale =
    !!product.compareAtPriceCents &&
    product.compareAtPriceCents > product.priceCents;

  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-card border border-azul-confianza/10 bg-white shadow-card transition-transform hover:-translate-y-0.5"
    >
      <div className="relative flex aspect-square items-center justify-center bg-crema-calido">
        {/* TODO: reemplazar por fotografía real de empaque (regla de marca: producto real, sin alterar) */}
        <span className="px-6 text-center text-sm font-medium text-gris-pizarra/60">
          {product.name}
        </span>
        {product.stockStatus === "out_of_stock" && (
          <span className="absolute left-3 top-3">
            <Badge tone="warning">Agotado</Badge>
          </span>
        )}
        {product.requiresPrescription && (
          <span className="absolute right-3 top-3">
            <Badge tone="aqua">Fórmula</Badge>
          </span>
        )}
      </div>
      <div className="space-y-1 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gris-pizarra/70">
          {product.brandName}
        </p>
        <h3 className="line-clamp-2 text-sm font-semibold text-azul-confianza">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-base font-bold text-azul-confianza">
            {formatCOP(product.priceCents)}
          </span>
          {onSale && (
            <span className="text-sm text-gris-pizarra/50 line-through">
              {formatCOP(product.compareAtPriceCents as number)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
