import type { Brand, Category } from "@plenapet/database";

type Filters = {
  q?: string;
  categoria?: string;
  especie?: string;
  etapa?: string;
  marca?: string;
  precio_max?: string;
};

export function FilterSidebar({
  categories,
  brands,
  filters,
}: {
  categories: Category[];
  brands: Brand[];
  filters: Filters;
}) {
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <form
      method="get"
      className="space-y-6 rounded-card border border-azul-confianza/10 bg-white p-5 shadow-card"
    >
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-gris-pizarra">
          Buscar
        </label>
        <input
          type="search"
          name="q"
          placeholder="Nombre del producto"
          defaultValue={filters.q ?? ""}
          className="mt-2 w-full rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-gris-pizarra">
          Categoría
        </label>
        <select
          name="categoria"
          defaultValue={filters.categoria ?? ""}
          className="mt-2 w-full rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
        >
          <option value="">Todas</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-gris-pizarra">
          Especie
        </label>
        <select
          name="especie"
          defaultValue={filters.especie ?? ""}
          className="mt-2 w-full rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
        >
          <option value="">Perros y gatos</option>
          <option value="perro">Perro</option>
          <option value="gato">Gato</option>
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-gris-pizarra">
          Etapa de vida
        </label>
        <select
          name="etapa"
          defaultValue={filters.etapa ?? ""}
          className="mt-2 w-full rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
        >
          <option value="">Todas</option>
          <option value="cachorro">Cachorro</option>
          <option value="adulto">Adulto</option>
          <option value="senior">Senior</option>
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-gris-pizarra">
          Marca
        </label>
        <select
          name="marca"
          defaultValue={filters.marca ?? ""}
          className="mt-2 w-full rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
        >
          <option value="">Todas</option>
          {brands.map((b) => (
            <option key={b.id} value={b.slug}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-gris-pizarra">
          Precio máximo
        </label>
        <input
          type="number"
          name="precio_max"
          placeholder="Sin límite"
          defaultValue={filters.precio_max ?? ""}
          className="mt-2 w-full rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="flex-1 rounded-full bg-azul-confianza py-2.5 text-sm font-semibold text-white"
        >
          Filtrar
        </button>
        {hasFilters && (
          <a
            href="/productos"
            className="text-sm font-medium text-gris-pizarra hover:text-coral-cercania"
          >
            Limpiar
          </a>
        )}
      </div>
    </form>
  );
}
