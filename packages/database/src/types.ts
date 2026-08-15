/**
 * Tipos de dominio. Reflejan `vault obsiadian/PLENAPET/Arquitectura/Modelo-de-datos.md`.
 * Estos son los tipos de la capa "curada" (lo que ve el storefront). En producción,
 * `Product` se llena vía el job de sincronización con VetShipping + `product_overrides` +
 * `pricing_rules` — nunca se escribe directo desde el storefront ni desde el admin.
 */

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";
export type Species = "perro" | "gato";
export type LifeStage = "cachorro" | "adulto" | "senior" | "todas";

export interface Category {
  id: string;
  slug: string;
  name: string;
  parentId?: string | null;
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
}

export interface ProductVariant {
  id: string;
  label: string;
  priceCents: number;
  stockStatus: StockStatus;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  brandId: string;
  categoryId: string;
  species: Species[];
  lifeStage: LifeStage;
  presentation: string;
  priceCents: number;
  compareAtPriceCents?: number | null;
  stockStatus: StockStatus;
  requiresPrescription: boolean;
  active: boolean;
  variants?: ProductVariant[];
}

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface OrderItem {
  productId: string;
  nameSnapshot: string;
  quantity: number;
  unitPriceCents: number;
}

export interface Order {
  id: string;
  customerName: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  placedAt: string;
}
