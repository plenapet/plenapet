import type { Brand, Category, Order, Product } from "./types";

/**
 * Contratos de acceso a datos. La implementación mock (src/mock) es la que
 * se usa hoy en desarrollo local. Cuando se conecte Supabase, se agrega una
 * implementación `supabase/` que cumpla estas mismas interfaces y se cambia
 * el factory en `index.ts` — el resto de la app no se entera del cambio.
 * Mismo patrón que el adapter de VetShipping (ver Arquitectura/Integracion-VetShipping.md).
 */
export interface ProductRepository {
  listActive(): Promise<Product[]>;
  listByCategory(categorySlug: string): Promise<Product[]>;
  getBySlug(slug: string): Promise<Product | null>;
  /** Admin only: productos ocultos (active=false), ej. recién importados de VetShipping, pendientes de revisión. */
  listInactive(): Promise<Product[]>;
  /** Admin only: por id, sin filtrar por active — para la pantalla de detalle/edición. */
  getById(id: string): Promise<Product | null>;
}

export interface CategoryRepository {
  listAll(): Promise<Category[]>;
}

export interface BrandRepository {
  listAll(): Promise<Brand[]>;
  /**
   * `null`/`undefined` cuando un producto importado no tiene marca asignada
   * (pasa seguido con el catálogo real de VetShipping) — devuelve `null` sin
   * consultar, nunca enviar eso a Supabase: `.eq("id", null)` no genera
   * `IS NULL`, genera `id = 'null'` y Postgres revienta (columna uuid).
   */
  getById(id: string | null | undefined): Promise<Brand | null>;
}

export interface OrderRepository {
  listAll(): Promise<Order[]>;
}
