import { Topbar } from "@/components/admin/Topbar";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { importVetShippingCatalogAction } from "@/lib/actions/admin-catalog";

export default async function ImportarCatalogoPage({
  searchParams,
}: {
  searchParams: { ok?: string; error?: string; duplicados?: string; noProducto?: string; costoInvalido?: string; errores?: string };
}) {
  return (
    <div>
      <Topbar title="Importar catálogo de VetShipping" />
      <div className="mx-auto max-w-2xl p-8">
        <div className="rounded-card border border-dashed border-azul-confianza/25 bg-white p-4 text-sm text-gris-pizarra">
          Sube los 3 CSV exportados del Supabase de VetShipping. Los productos
          quedan <strong>ocultos</strong> (sin publicar) para que los revises
          en{" "}
          <a href="/admin/catalogo" className="underline">
            /admin/catalogo
          </a>{" "}
          antes de que aparezcan en la tienda. Se puede volver a subir sin
          duplicar — los productos que ya se importaron antes se saltan.
        </div>

        {searchParams.error && (
          <div className="mt-4 rounded-card border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {searchParams.error}
          </div>
        )}

        {searchParams.ok && (
          <div className="mt-4 rounded-card border border-aqua-bienestar/40 bg-aqua-bienestar/10 p-4 text-sm text-azul-confianza">
            <p className="font-semibold">Importación terminada</p>
            <ul className="mt-2 space-y-1 text-gris-pizarra">
              <li>{searchParams.ok} productos nuevos creados (ocultos)</li>
              <li>{searchParams.duplicados ?? 0} ya importados antes, saltados</li>
              <li>{searchParams.noProducto ?? 0} filas descartadas (no son productos, ej. domicilios)</li>
              <li>{searchParams.costoInvalido ?? 0} filas con costo inválido</li>
              <li>{searchParams.errores ?? 0} errores — ver logs del servidor / sync_runs</li>
            </ul>
            <a href="/admin/catalogo/borradores" className="mt-3 inline-block underline">
              Ir a revisar los borradores →
            </a>
          </div>
        )}

        <form
          action={importVetShippingCatalogAction}
          className="mt-6 space-y-5 rounded-card border border-azul-confianza/10 bg-white p-6 shadow-card"
        >
          <div>
            <label className="block text-sm font-semibold text-azul-confianza">
              CSV de productos (requerido)
            </label>
            <p className="text-xs text-gris-pizarra">
              Export de la tabla <code>products</code> del Supabase de VetShipping.
            </p>
            <input
              type="file"
              name="productsFile"
              accept=".csv,text/csv"
              required
              className="mt-2 block w-full text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-azul-confianza">
              CSV de marcas
            </label>
            <p className="text-xs text-gris-pizarra">
              Export de <code>brands</code> — para asignar el nombre real de marca. Sin esto, los productos quedan sin marca.
            </p>
            <input
              type="file"
              name="brandsFile"
              accept=".csv,text/csv"
              className="mt-2 block w-full text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-azul-confianza">
              CSV de imágenes
            </label>
            <p className="text-xs text-gris-pizarra">
              Export de <code>product_images</code> — guarda la URL de VetShipping
              internamente; migrarlas al Storage propio de PlenaPet es un paso aparte.
            </p>
            <input
              type="file"
              name="imagesFile"
              accept=".csv,text/csv"
              className="mt-2 block w-full text-sm"
            />
          </div>

          <ConfirmSubmitButton
            confirmMessage="¿Importar el catálogo? Va a crear productos ocultos a partir de estos CSV."
            className="w-full rounded-full bg-azul-confianza px-4 py-2.5 text-sm font-semibold text-white"
          >
            Importar catálogo
          </ConfirmSubmitButton>
        </form>
      </div>
    </div>
  );
}
