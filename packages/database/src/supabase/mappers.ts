import type { Brand, Category, Order, OrderItem, Product } from "../types";

/* eslint-disable @typescript-eslint/no-explicit-any */

export function mapProduct(row: any): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortDescription: row.short_description ?? "",
    description: row.description ?? "",
    brandId: row.brand_id,
    categoryId: row.category_id,
    species: row.species ?? [],
    lifeStage: row.life_stage,
    presentation: row.presentation ?? "",
    priceCents: row.price_cents,
    compareAtPriceCents: row.compare_at_price_cents,
    stockStatus: row.stock_status,
    requiresPrescription: row.requires_prescription,
    active: row.active,
  };
}

export function mapCategory(row: any): Category {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    parentId: row.parent_id,
  };
}

export function mapBrand(row: any): Brand {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
  };
}

export function mapOrder(row: any): Order {
  const items: OrderItem[] = (row.order_items ?? []).map((item: any) => ({
    productId: item.product_id,
    nameSnapshot: item.name_snapshot,
    quantity: item.quantity,
    unitPriceCents: item.unit_price_cents,
  }));
  return {
    id: row.id,
    customerName: row.customer_name ?? row.customer_id ?? "Cliente",
    status: row.status,
    items,
    subtotalCents: row.subtotal_cents,
    shippingCents: row.shipping_cents,
    totalCents: row.total_cents,
    placedAt: row.placed_at,
  };
}
