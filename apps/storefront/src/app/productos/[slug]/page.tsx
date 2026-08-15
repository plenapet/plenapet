import { notFound } from "next/navigation";
import {
  getBrandRepository,
  getCategoryRepository,
  getProductRepository,
} from "@plenapet/database";
import { Badge, Container, formatCOP } from "@plenapet/ui";
import { AddToCartButton } from "@/components/AddToCartButton";

const LIFE_STAGE_LABEL: Record<string, string> = {
  cachorro: "Cachorro",
  adulto: "Adulto",
  senior: "Senior",
  todas: "Todas las etapas",
};

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductRepository().getBySlug(params.slug);
  if (!product) notFound();

  const [brand, categories] = await Promise.all([
    getBrandRepository().getById(product.brandId),
    getCategoryRepository().listAll(),
  ]);
  const category = categories.find((c) => c.id === product.categoryId);

  return (
    <Container className="py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="flex aspect-square items-center justify-center rounded-card border border-azul-confianza/10 bg-crema-calido">
          {/* TODO: fotografía real de empaque — ver regla de marca sobre imágenes de producto */}
          <span className="px-10 text-center text-sm font-medium text-gris-pizarra/60">
            {product.name}
          </span>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gris-pizarra/70">
            {brand?.name} · {category?.name}
          </p>
          <h1 className="mt-1 text-3xl font-bold text-azul-confianza">
            {product.name}
          </h1>
          <p className="mt-3 text-base text-gris-pizarra">
            {product.shortDescription}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Badge>{product.presentation}</Badge>
            <Badge>{LIFE_STAGE_LABEL[product.lifeStage]}</Badge>
            {product.species.map((s) => (
              <Badge key={s}>{s === "perro" ? "Perro" : "Gato"}</Badge>
            ))}
            {product.stockStatus === "low_stock" && (
              <Badge tone="warning">Pocas unidades</Badge>
            )}
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-azul-confianza">
              {formatCOP(product.priceCents)}
            </span>
            {product.compareAtPriceCents && (
              <span className="text-lg text-gris-pizarra/50 line-through">
                {formatCOP(product.compareAtPriceCents)}
              </span>
            )}
          </div>

          {product.requiresPrescription && (
            <div className="mt-5 rounded-card border border-aqua-bienestar/40 bg-aqua-bienestar/10 p-4 text-sm text-azul-confianza">
              Este es un producto de fórmula veterinaria. Consulta con tu
              veterinario antes de iniciar o modificar un tratamiento.
            </div>
          )}

          <div className="mt-7">
            <AddToCartButton
              productId={product.id}
              slug={product.slug}
              name={product.name}
              priceCents={product.priceCents}
              disabled={product.stockStatus === "out_of_stock"}
            />
          </div>

          <div className="mt-10 border-t border-azul-confianza/10 pt-6">
            <h2 className="text-sm font-semibold text-azul-confianza">
              Descripción
            </h2>
            <p className="mt-2 text-sm text-gris-pizarra">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
