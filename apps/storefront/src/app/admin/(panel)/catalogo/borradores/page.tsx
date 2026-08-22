import Link from "next/link";
import {
  getBrandRepository,
  getCategoryRepository,
  getProductRepository,
} from "@plenapet/database";
import { formatCOP } from "@plenapet/ui";
import { Topbar } from "@/components/admin/Topbar";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { getCurrentAdmin } from "@/lib/auth/require-admin";
import {
  publishProductDraftAction,
  deleteProductDraftAction,
} from "@/lib/actions/admin-catalog";

export default async function BorradoresCatalogoPage() {
  const currentAdmin = await getCurrentAdmin();
  const isSuperAdmin = currentAdmin?.role === "super_admin";

  const [products, categories, brands] = await Promise.all([
    getProductRepository("admin").listInactive(),
    getCategoryRepository("admin").listAll(),
    getBrandRepository("admin").listAll(),
  ]);

  const categoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? "—";
  const brandName = (id: string) =>
    brands.find((b) => b.id === id)?.name ?? "—";

  return (
    <div>
      <Topbar title="Borradores de catálogo" />
      <div className="p-8">
        <div className="flex items-center justify-between gap-4 rounded-card border border-dashed border-azul-confianza/25 bg-white p-4 text-sm text-gris-pizarra">
          <span>
            Productos importados de VetShipping todavía ocultos. Revisa
            nombre, precio, categoría y marca antes de publicar — una vez
            publicado, el producto aparece de inmediato en la tienda.
          </span>
          <Link
            href="/admin/catalogo/importar"
            className="whitespace-nowrap rounded-full bg-azul-confianza/10 px-4 py-2 text-sm font-semibold text-azul-confianza"
          >
            Importar más
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="mt-6 text-sm text-gris-pizarra">
            No hay borradores pendientes de revisión.
          </p>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-card border border-azul-confianza/10 bg-white shadow-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-gris-pizarra/70">
                  <th className="px-5 py-3">Producto</th>
                  <th className="px-5 py-3">Marca</th>
                  <th className="px-5 py-3">Categoría</th>
                  <th className="px-5 py-3">Precio</th>
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
                    <td className="px-5 py-3 text-gris-pizarra">
                      {product.requiresPrescription ? "Sí" : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <form action={publishProductDraftAction}>
                          <input type="hidden" name="productId" value={product.id} />
                          <button
                            type="submit"
                            className="whitespace-nowrap rounded-full bg-azul-confianza px-3 py-1.5 text-xs font-semibold text-white"
                          >
                            Publicar
                          </button>
                        </form>
                        {isSuperAdmin && (
                          <form action={deleteProductDraftAction}>
                            <input type="hidden" name="productId" value={product.id} />
                            <ConfirmSubmitButton
                              confirmMessage={`¿Borrar "${product.name}"? No se puede deshacer.`}
                              className="whitespace-nowrap rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600"
                            >
                              Borrar
                            </ConfirmSubmitButton>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
