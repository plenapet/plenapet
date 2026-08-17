import Link from "next/link";
import {
  getBrandRepository,
  getCategoryRepository,
  getProductRepository,
} from "@plenapet/database";
import { Button, Container, ProductCard, pilares } from "@plenapet/ui";
import { SITE_URL } from "@/lib/site-url";

export default async function HomePage() {
  const [products, categories, brandRepo] = await Promise.all([
    getProductRepository().listActive(),
    getCategoryRepository().listAll(),
    getBrandRepository(),
  ]);

  const destacados = products.slice(0, 8);

  return (
    <div>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "OnlineStore",
            name: "PlenaPet",
            url: SITE_URL,
            description:
              "Petshop digital en Colombia: alimentos, farmacia veterinaria, desparasitantes, suplementos, higiene y accesorios para perros y gatos, con entrega a domicilio.",
            areaServed: "CO",
            potentialAction: {
              "@type": "SearchAction",
              target: `${SITE_URL}/productos?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
      <section className="bg-crema-calido">
        <Container className="grid gap-10 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-coral-cercania">
              Todo para una vida plena.
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight text-azul-confianza sm:text-5xl">
              Todo lo que necesitan tus perros y gatos, en un solo lugar.
            </h1>
            <p className="mt-4 max-w-xl text-base text-gris-pizarra">
              Gran variedad, precios competitivos, orientación confiable y
              entrega a domicilio. Alimentos, farmacia veterinaria,
              suplementos, higiene y accesorios.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/productos">
                <Button size="lg">Explorar catálogo</Button>
              </Link>
              <Link href="/productos?categoria=farmacia-veterinaria">
                <Button size="lg" variant="secondary">
                  Farmacia veterinaria
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {pilares.map((pilar) => (
              <div
                key={pilar.titulo}
                className="rounded-card border border-azul-confianza/10 bg-white p-5 shadow-card"
              >
                <h3 className="text-sm font-bold text-azul-confianza">
                  {pilar.titulo}
                </h3>
                <p className="mt-1.5 text-xs text-gris-pizarra">
                  {pilar.descripcion}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Container className="py-14">
        <h2 className="text-2xl font-bold text-azul-confianza">Categorías</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
          {categories.map((categoria) => (
            <Link
              key={categoria.id}
              href={`/productos?categoria=${categoria.slug}`}
              className="rounded-card border border-azul-confianza/10 bg-white px-4 py-6 text-center text-sm font-semibold text-azul-confianza shadow-card transition-transform hover:-translate-y-0.5"
            >
              {categoria.name}
            </Link>
          ))}
        </div>
      </Container>

      <Container className="py-14">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-azul-confianza">
            Productos destacados
          </h2>
          <Link
            href="/productos"
            className="text-sm font-semibold text-azul-confianza hover:underline"
          >
            Ver todo
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {await Promise.all(
            destacados.map(async (product) => {
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
      </Container>
    </div>
  );
}
