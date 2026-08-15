import {
  getBrandRepository,
  getCategoryRepository,
  getProductRepository,
} from "@plenapet/database";
import { Container, ProductCard } from "@plenapet/ui";
import { FilterSidebar } from "@/components/FilterSidebar";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: {
    categoria?: string;
    especie?: string;
    etapa?: string;
    marca?: string;
    precio_max?: string;
  };
}) {
  const [allProducts, categories, brandRepo] = await Promise.all([
    getProductRepository().listActive(),
    getCategoryRepository().listAll(),
    getBrandRepository(),
  ]);
  const brands = await brandRepo.listAll();

  const filtered = allProducts.filter((p) => {
    if (searchParams.categoria && p.categoryId !== searchParams.categoria)
      return false;
    if (
      searchParams.especie &&
      !p.species.includes(searchParams.especie as "perro" | "gato")
    )
      return false;
    if (searchParams.etapa && p.lifeStage !== searchParams.etapa) return false;
    if (searchParams.marca && p.brandId !== searchParams.marca) return false;
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

  return (
    <Container className="py-10">
      <h1 className="text-3xl font-bold text-azul-confianza">
        {categoriaActual ? categoriaActual.name : "Catálogo"}
      </h1>
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
