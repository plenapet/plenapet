import type { Metadata } from "next";
import {
  getBrandRepository,
  getCategoryRepository,
  getProductRepository,
} from "@plenapet/database";
import { Container, ProductCard } from "@plenapet/ui";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SITE_URL } from "@/lib/site-url";

type CatalogSearchParams = {
  q?: string;
  categoria?: string;
  especie?: string;
  etapa?: string;
  marca?: string;
  precio_max?: string;
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: CatalogSearchParams;
}): Promise<Metadata> {
  if (searchParams.categoria) {
    const categories = await getCategoryRepository().listAll();
    const categoria = categories.find((c) => c.slug === searchParams.categoria);
    if (categoria) {
      return {
        title: `${categoria.name} para perros y gatos — Precio y domicilio | PlenaPet`,
        description: `Compra ${categoria.name.toLowerCase()} para tu perro o gato en PlenaPet: precios competitivos, orientación confiable y entrega a domicilio en Colombia.`,
        // Canonical solo con la categoría — los demás filtros (especie, marca,
        // precio) no deben generar variantes indexables aparte.
        alternates: { canonical: `/productos?categoria=${categoria.slug}` },
      };
    }
  }
  if (searchParams.q) {
    // Páginas de resultado de búsqueda interna: no aportan valor único al
    // índice y pueden generar contenido delgado/duplicado.
    return {
      title: `Resultados para "${searchParams.q}" | PlenaPet`,
      robots: { index: false, follow: true },
    };
  }
  return {
    title: "Catálogo de productos veterinarios para perros y gatos | PlenaPet",
    description:
      "Alimentos, farmacia veterinaria, desparasitantes, vitaminas, suplementos, higiene y accesorios para perros y gatos, con entrega a domicilio en Colombia.",
    alternates: { canonical: "/productos" },
  };
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: CatalogSearchParams;
}) {
  const [allProducts, categories, brandRepo] = await Promise.all([
    getProductRepository().listActive(),
    getCategoryRepository().listAll(),
    getBrandRepository(),
  ]);
  const brands = await brandRepo.listAll();

  const query = searchParams.q?.trim().toLocaleLowerCase("es");

  // Los filtros de la URL viajan como slug (legible, compartible); el
  // catálogo identifica categoría/marca por id. Se resuelve slug -> id antes
  // de filtrar en vez de comparar slug contra id directamente.
  const categoriaId = searchParams.categoria
    ? categories.find((c) => c.slug === searchParams.categoria)?.id
    : undefined;
  const marcaId = searchParams.marca
    ? brands.find((b) => b.slug === searchParams.marca)?.id
    : undefined;

  const filtered = allProducts.filter((p) => {
    if (query && !p.name.toLocaleLowerCase("es").includes(query)) return false;
    if (searchParams.categoria && p.categoryId !== categoriaId) return false;
    if (
      searchParams.especie &&
      !p.species.includes(searchParams.especie as "perro" | "gato")
    )
      return false;
    if (searchParams.etapa && p.lifeStage !== searchParams.etapa) return false;
    if (searchParams.marca && p.brandId !== marcaId) return false;
    if (
      searchParams.precio_max &&
      p.priceCents > Number(searchParams.precio_max) * 100
    )
      return false;
    return true;
  });

  const categoriaActual = categories.find(
    (c) => c.slug === searchParams.categoria,
  );

  const titulo = categoriaActual
    ? categoriaActual.name
    : searchParams.q
      ? `Resultados para "${searchParams.q}"`
      : "Catálogo";

  const breadcrumbItems = [
    { label: "Inicio", href: "/" },
    { label: titulo },
  ];

  return (
    <Container className="py-10">
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
      <h1 className="mt-2 text-3xl font-bold text-azul-confianza">{titulo}</h1>
      <p className="mt-1 text-sm text-gris-pizarra">
        {filtered.length} producto{filtered.length !== 1 ? "s" : ""} encontrado
        {filtered.length !== 1 ? "s" : ""}.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside>
          <FilterSidebar
            categories={categories}
            brands={brands}
            filters={searchParams}
          />
        </aside>

        <div>
          {filtered.length === 0 ? (
            <p className="rounded-card border border-azul-confianza/10 bg-white p-8 text-center text-sm text-gris-pizarra">
              No encontramos productos con esos filtros. Prueba ajustando la
              búsqueda.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
              {await Promise.all(
                filtered.map(async (product) => {
                  const brand = await brandRepo.getById(product.brandId);
                  return (
                    <ProductCard
                      key={product.id}
                      href={`/productos/${product.slug}`}
                      product={{
                        slug: product.slug,
                        name: product.name,
                        brandName: brand?.name ?? "",
                        priceCents: product.priceCents,
                        compareAtPriceCents: product.compareAtPriceCents,
                        stockStatus: product.stockStatus,
                        requiresPrescription: product.requiresPrescription,
                      }}
                    />
                  );
                }),
              )}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
