import {
  getBrandRepository,
  getCategoryRepository,
  getProductRepository,
} from "@plenapet/database";
import { Badge, formatCOP } from "@plenapet/ui";
import { Topbar } from "@/components/admin/Topbar";

const STOCK_LABEL: Record<string, string> = {
  in_stock: "En stock",
  low_stock: "Bajo stock",
  out_of_stock: "Agotado",
};

export default async function CatalogoPage() {
  const [products, categories, brands] = await Promise.all([
    getProductRepository("admin").listActive(),
    getCategoryRepository("admin").listAll(),
    getBrandRepository("admin").listAll(),
  ]);

  const categoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? id;
  const brandName = (id: string) =>
    brands.find((b) => b.id === id)?.name ?? id;

  return (
    <div>
      <Topbar title="Catálogo" />
      <div className="p-8">
        <div className="flex items-center justify-between gap-4 rounded-card border border-dashed border-azul-confianza/25 bg-white p-4 text-sm text-gris-pizarra">
          <span>
            Esto muestra el catálogo semilla de desarrollo. La sincronización
            real con VetShipping y la edición de curaduría/márgenes se
            conectan en la fase de Supabase.
          </span>
          <button
            disabled
            className="whitespace-nowrap rounded-full bg-azul-confianza/10 px-4 py-2 text-sm font-semibold text-azul-confianza/50"
          >
            Sincronizar catálogo
          </button>
        </div>

        <div className="mt-6 overflow-x-auto rounded-card border border-azul-confianza/10 bg-white shadow-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-gris-pizarra/70">
                <th className="px-5 py-3">Producto</th>
                <th className="px-5 py-3">Marca</th>
                <th className="px-5 py-3">Categoría</th>
                <th className="px-5 py-3">Precio</th>
                <th className="px-5 py-3">Stock</th>
                <th className="px-5 py-3">Fórmula</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-azul-confianza/5">
                  <td className="max-w-xs px-5 py-3 font-medium text-azul-confianza">
                    {product.name}
                  </td>
                  <td className="px-5 py-3 text-gris-pizarra">
                    {brandName(product.brandId)}
                  </td>
                  <td className="px-5 py-3 text-gris-pizarra">
                    {categoryName(product.categoryId)}
                  </td>
                  <td className="px-5 py-3 font-semibold text-azul-confianza">
                    {formatCOP(product.priceCents)}
                  </td>
                  <td className="px-5 py-3">
                    <Badge
                      tone={
                        product.stockStatus === "out_of_stock"
                          ? "warning"
                          : product.stockStatus === "low_stock"
                            ? "coral"
                            : "neutral"
                      }
                    >
                      {STOCK_LABEL[product.stockStatus]}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-gris-pizarra">
                    {product.requiresPrescription ? "Sí" : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
