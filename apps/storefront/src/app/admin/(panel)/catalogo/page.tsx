import Link from "next/link";
import {
  getBrandRepository,
  getCategoryRepository,
  getProductRepository,
} from "@plenapet/database";
import { Badge, formatCOP } from "@plenapet/ui";
import { Topbar } from "@/components/admin/Topbar";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { getCurrentAdmin } from "@/lib/auth/require-admin";
import { unpublishProductAction, deleteProductAction } from "@/lib/actions/admin-catalog";

const STOCK_LABEL: Record<string, string> = {
  in_stock: "En stock",
  low_stock: "Bajo stock",
  out_of_stock: "Agotado",
};

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const [products, categories, brands, currentAdmin] = await Promise.all([
    getProductRepository("admin").listActive(),
    getCategoryRepository("admin").listAll(),
    getBrandRepository("admin").listAll(),
    getCurrentAdmin(),
  ]);

  const isSuperAdmin = currentAdmin?.role === "super_admin";

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
            Este listado solo muestra productos activos. Los que se importan
            desde VetShipping quedan ocultos hasta que se revisan y publican.
          </span>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/admin/catalogo/borradores"
              className="whitespace-nowrap rounded-full bg-azul-confianza/10 px-4 py-2 text-sm font-semibold text-azul-confianza"
            >
              Ver borradores
            </Link>
            <Link
              href="/admin/catalogo/importar"
              className="whitespace-nowrap rounded-full bg-azul-confianza px-4 py-2 text-sm font-semibold text-white"
            >
              Sincronizar catálogo
            </Link>
          </div>
        </div>

        {searchParams.error && (
          <div className="mt-4 rounded-card border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {searchParams.error}
          </div>
        )}

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
                <th className="px-5 py-3"></th>
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
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/catalogo/${product.id}?from=/admin/catalogo`}
                        className="whitespace-nowrap rounded-full bg-azul-confianza/10 px-3 py-1.5 text-xs font-semibold text-azul-confianza"
                      >
                        Ver / Editar
                      </Link>
                      {isSuperAdmin && (
                        <>
                          <form action={unpublishProductAction}>
                            <input type="hidden" name="productId" value={product.id} />
                            <input type="hidden" name="redirectTo" value="/admin/catalogo" />
                            <ConfirmSubmitButton
                              confirmMessage={`¿Ocultar "${product.name}" de la tienda?`}
                              className="whitespace-nowrap rounded-full border border-azul-confianza/20 px-3 py-1.5 text-xs font-semibold text-azul-confianza"
                            >
                              Ocultar
                            </ConfirmSubmitButton>
                          </form>
                          <form action={deleteProductAction}>
                            <input type="hidden" name="productId" value={product.id} />
                            <input type="hidden" name="redirectTo" value="/admin/catalogo" />
                            <ConfirmSubmitButton
                              confirmMessage={`¿Borrar "${product.name}"? No se puede deshacer.`}
                              className="whitespace-nowrap rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600"
                            >
                              Borrar
                            </ConfirmSubmitButton>
                          </form>
                        </>
                      )}
                    </div>
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
