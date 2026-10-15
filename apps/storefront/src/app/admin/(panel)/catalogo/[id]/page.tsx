import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getBrandRepository,
  getCategoryRepository,
  getProductRepository,
} from "@plenapet/database";
import { Badge } from "@plenapet/ui";
import { Topbar } from "@/components/admin/Topbar";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { ProductImagesField } from "@/components/admin/ProductImagesField";
import { getCurrentAdmin } from "@/lib/auth/require-admin";
import {
  updateProductAction,
  publishProductAction,
  unpublishProductAction,
  deleteProductAction,
} from "@/lib/actions/admin-catalog";

const SPECIES_OPTIONS = [
  { value: "perro", label: "Perro" },
  { value: "gato", label: "Gato" },
];

const LIFE_STAGE_OPTIONS = [
  { value: "cachorro", label: "Cachorro" },
  { value: "adulto", label: "Adulto" },
  { value: "senior", label: "Senior" },
  { value: "todas", label: "Todas las etapas" },
];

const STOCK_STATUS_OPTIONS = [
  { value: "in_stock", label: "En stock" },
  { value: "low_stock", label: "Bajo stock" },
  { value: "out_of_stock", label: "Agotado" },
];

const inputClass =
  "mt-1 block w-full rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm text-azul-confianza focus:border-azul-confianza/40 focus:outline-none";
const labelClass = "text-sm font-semibold text-azul-confianza";

export default async function ProductoAdminPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { error?: string; ok?: string; from?: string };
}) {
  const [product, categories, brands, currentAdmin] = await Promise.all([
    getProductRepository("admin").getById(params.id),
    getCategoryRepository("admin").listAll(),
    getBrandRepository("admin").listAll(),
    getCurrentAdmin(),
  ]);

  if (!product) notFound();

  const isSuperAdmin = currentAdmin?.role === "super_admin";
  const listReturnTo =
    searchParams.from?.startsWith("/admin/catalogo") ? searchParams.from : "/admin/catalogo";
  const selfReturnTo = `/admin/catalogo/${product.id}${
    searchParams.from ? `?from=${encodeURIComponent(searchParams.from)}` : ""
  }`;

  return (
    <div>
      <Topbar title={product.name} />
      <div className="mx-auto max-w-3xl p-8">
        <Link href={listReturnTo} className="text-sm text-azul-confianza underline">
          ← Volver al catálogo
        </Link>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <Badge tone={product.active ? "neutral" : "coral"}>
            {product.active ? "Publicado" : "Oculto (borrador)"}
          </Badge>
          <div className="flex items-center gap-2">
            {product.active ? (
              isSuperAdmin && (
                <form action={unpublishProductAction}>
                  <input type="hidden" name="productId" value={product.id} />
                  <input type="hidden" name="redirectTo" value={listReturnTo} />
                  <ConfirmSubmitButton
                    confirmMessage="¿Ocultar este producto de la tienda?"
                    className="whitespace-nowrap rounded-full border border-azul-confianza/20 px-3 py-1.5 text-xs font-semibold text-azul-confianza"
                  >
                    Ocultar
                  </ConfirmSubmitButton>
                </form>
              )
            ) : (
              <form action={publishProductAction}>
                <input type="hidden" name="productId" value={product.id} />
                <input type="hidden" name="redirectTo" value={selfReturnTo} />
                <button
                  type="submit"
                  className="whitespace-nowrap rounded-full bg-azul-confianza px-3 py-1.5 text-xs font-semibold text-white"
                >
                  Publicar
                </button>
              </form>
            )}
            {isSuperAdmin && (
              <form action={deleteProductAction}>
                <input type="hidden" name="productId" value={product.id} />
                <input type="hidden" name="redirectTo" value={listReturnTo} />
                <ConfirmSubmitButton
                  confirmMessage={`¿Borrar "${product.name}"? No se puede deshacer.`}
                  className="whitespace-nowrap rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600"
                >
                  Borrar
                </ConfirmSubmitButton>
              </form>
            )}
          </div>
        </div>

        {searchParams.error && (
          <div className="mt-4 rounded-card border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {searchParams.error}
          </div>
        )}
        {searchParams.ok && (
          <div className="mt-4 rounded-card border border-aqua-bienestar/40 bg-aqua-bienestar/10 p-4 text-sm text-azul-confianza">
            Cambios guardados.
          </div>
        )}

        <form
          action={updateProductAction}
          className="mt-6 space-y-5 rounded-card border border-azul-confianza/10 bg-white p-6 shadow-card"
        >
          <input type="hidden" name="productId" value={product.id} />
          <input type="hidden" name="redirectTo" value={selfReturnTo} />

          <div>
            <label className={labelClass}>Nombre</label>
            <input name="name" defaultValue={product.name} required className={inputClass} />
            <p className="mt-1 text-xs text-gris-pizarra">
              Slug: <code>{product.slug}</code> (no editable)
            </p>
          </div>

          <div>
            <label className={labelClass}>Descripción corta</label>
            <input
              name="shortDescription"
              defaultValue={product.shortDescription}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Descripción</label>
            <textarea
              name="description"
              defaultValue={product.description}
              rows={6}
              className={inputClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Marca</label>
              <select name="brandId" defaultValue={product.brandId ?? ""} className={inputClass}>
                <option value="">— Sin marca —</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Categoría</label>
              <select
                name="categoryId"
                defaultValue={product.categoryId ?? ""}
                className={inputClass}
              >
                <option value="">— Sin categoría —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Precio (COP)</label>
              <input
                type="number"
                name="pricePesos"
                defaultValue={Math.round(product.priceCents / 100)}
                min={0}
                step={1}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Precio antes de descuento (opcional)</label>
              <input
                type="number"
                name="compareAtPesos"
                defaultValue={
                  product.compareAtPriceCents
                    ? Math.round(product.compareAtPriceCents / 100)
                    : ""
                }
                min={0}
                step={1}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Etapa de vida</label>
              <select name="lifeStage" defaultValue={product.lifeStage} className={inputClass}>
                {LIFE_STAGE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Stock</label>
              <select
                name="stockStatus"
                defaultValue={product.stockStatus}
                className={inputClass}
              >
                {STOCK_STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Presentación</label>
            <input
              name="presentation"
              defaultValue={product.presentation ?? ""}
              placeholder="ej. Bulto 15 kg"
              className={inputClass}
            />
          </div>

          <div>
            <span className={labelClass}>Especie</span>
            <div className="mt-1 flex gap-4">
              {SPECIES_OPTIONS.map((o) => (
                <label key={o.value} className="flex items-center gap-1.5 text-sm text-gris-pizarra">
                  <input
                    type="checkbox"
                    name="species"
                    value={o.value}
                    defaultChecked={product.species.includes(o.value as "perro" | "gato")}
                  />
                  {o.label}
                </label>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gris-pizarra">
            <input
              type="checkbox"
              name="requiresPrescription"
              defaultChecked={product.requiresPrescription}
            />
            Requiere fórmula / venta con prescripción veterinaria
          </label>

          <ProductImagesField existingImages={product.images ?? []} />

          <button
            type="submit"
            className="w-full rounded-full bg-azul-confianza px-4 py-2.5 text-sm font-semibold text-white"
          >
            Guardar cambios
          </button>
        </form>
      </div>
    </div>
  );
}
