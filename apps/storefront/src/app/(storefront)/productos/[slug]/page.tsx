import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getBrandRepository,
  getCategoryRepository,
  getProductRepository,
} from "@plenapet/database";
import { Badge, Container, ProductCard, formatCOP } from "@plenapet/ui";
import { AddToCartButton } from "@/components/AddToCartButton";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SITE_URL } from "@/lib/site-url";

const LIFE_STAGE_LABEL: Record<string, string> = {
  cachorro: "Cachorro",
  adulto: "Adulto",
  senior: "Senior",
  todas: "Todas las etapas",
};

const SPECIES_LABEL: Record<string, string> = { perro: "perros", gato: "gatos" };

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProductRepository().getBySlug(params.slug);
  if (!product) return { title: "Producto no encontrado | PlenaPet" };

  const speciesText = product.species.map((s) => SPECIES_LABEL[s]).join(" y ");
  const description =
    product.shortDescription ||
    `Compra ${product.name} para ${speciesText} en PlenaPet, con entrega a domicilio en Colombia.`;

  return {
    title: `${product.name} — Comprar online con domicilio | PlenaPet`,
    description,
    alternates: { canonical: `/productos/${product.slug}` },
    openGraph: { title: product.name, description, type: "website" },
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const productRepo = getProductRepository();
  const product = await productRepo.getBySlug(params.slug);
  if (!product) notFound();

  const brandRepo = getBrandRepository();
  const [brand, categories] = await Promise.all([
    brandRepo.getById(product.brandId),
    getCategoryRepository().listAll(),
  ]);
  const category = categories.find((c) => c.id === product.categoryId);
  const sameCategoryProducts = category
    ? await productRepo.listByCategory(category.slug)
    : [];
  const related = sameCategoryProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const availability =
    product.stockStatus === "out_of_stock"
      ? "https://schema.org/OutOfStock"
      : product.stockStatus === "low_stock"
        ? "https://schema.org/LimitedAvailability"
        : "https://schema.org/InStock";

  const breadcrumbItems = [
    { label: "Inicio", href: "/" },
    ...(category
      ? [{ label: category.name, href: `/productos?categoria=${category.slug}` }]
      : []),
    { label: product.name },
  ];

  return (
    <Container className="py-10">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.shortDescription || product.description,
            brand: brand ? { "@type": "Brand", name: brand.name } : undefined,
            offers: {
              "@type": "Offer",
              url: `${SITE_URL}/productos/${product.slug}`,
              priceCurrency: "COP",
              price: (product.priceCents / 100).toFixed(0),
              availability,
              itemCondition: "https://schema.org/NewCondition",
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: breadcrumbItems.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: item.label,
              item: item.href ? `${SITE_URL}${item.href}` : undefined,
            })),
          }),
        }}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="mt-4 grid gap-10 lg:grid-cols-2">
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

      {related.length > 0 && (
        <div className="mt-16 border-t border-azul-confianza/10 pt-10">
          <h2 className="text-xl font-bold text-azul-confianza">
            También te puede interesar
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {await Promise.all(
              related.map(async (item) => {
                const itemBrand = await brandRepo.getById(item.brandId);
                return (
                  <ProductCard
                    key={item.id}
                    href={`/productos/${item.slug}`}
                    product={{
                      slug: item.slug,
                      name: item.name,
                      brandName: itemBrand?.name ?? "",
                      priceCents: item.priceCents,
                      compareAtPriceCents: item.compareAtPriceCents,
                      stockStatus: item.stockStatus,
                      requiresPrescription: item.requiresPrescription,
                    }}
                  />
                );
              }),
            )}
          </div>
        </div>
      )}
    </Container>
  );
}
