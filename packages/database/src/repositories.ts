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
}

export interface CategoryRepository {
  listAll(): Promise<Category[]>;
}

export interface BrandRepository {
  listAll(): Promise<Brand[]>;
  getById(id: string): Promise<Brand | null>;
}

export interface OrderRepository {
  listAll(): Promise<Order[]>;
}
