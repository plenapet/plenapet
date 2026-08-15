import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  BrandRepository,
  CategoryRepository,
  OrderRepository,
  ProductRepository,
} from "../repositories";
import { mapBrand, mapCategory, mapOrder, mapProduct } from "./mappers";

export class SupabaseProductRepository implements ProductRepository {
  constructor(private client: SupabaseClient) {}

  async listActive() {
    const { data, error } = await this.client
      .from("products")
      .select("*")
      .eq("active", true)
      .order("name");
    if (error) throw error;
    return (data ?? []).map(mapProduct);
  }

  async listByCategory(categorySlug: string) {
    const { data: category } = await this.client
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .maybeSingle();
    if (!category) return [];
    const { data, error } = await this.client
      .from("products")
      .select("*")
      .eq("active", true)
      .eq("category_id", category.id)
      .order("name");
    if (error) throw error;
    return (data ?? []).map(mapProduct);
  }

  async getBySlug(slug: string) {
    const { data, error } = await this.client
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    return data ? mapProduct(data) : null;
  }
}

export class SupabaseCategoryRepository implements CategoryRepository {
  constructor(private client: SupabaseClient) {}

  async listAll() {
    const { data, error } = await this.client
      .from("categories")
      .select("*")
      .order("name");
    if (error) throw error;
    return (data ?? []).map(mapCategory);
  }
}

export class SupabaseBrandRepository implements BrandRepository {
  constructor(private client: SupabaseClient) {}

  async listAll() {
    const { data, error } = await this.client
      .from("brands")
      .select("*")
      .order("name");
    if (error) throw error;
    return (data ?? []).map(mapBrand);
  }

  async getById(id: string) {
    const { data, error } = await this.client
      .from("brands")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ? mapBrand(data) : null;
  }
}

export class SupabaseOrderRepository implements OrderRepository {
  constructor(private client: SupabaseClient) {}

  async listAll() {
    const { data, error } = await this.client
      .from("orders")
      .select("*, order_items(*)")
      .order("placed_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapOrder);
  }
}
