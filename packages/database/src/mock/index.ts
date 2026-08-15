import type {
  BrandRepository,
  CategoryRepository,
  OrderRepository,
  ProductRepository,
} from "../repositories";
import { brands, categories, orders, products } from "./seed";

export class MockProductRepository implements ProductRepository {
  async listActive() {
    return products.filter((p) => p.active);
  }

  async listByCategory(categorySlug: string) {
    return products.filter((p) => p.active && p.categoryId === categorySlug);
  }

  async getBySlug(slug: string) {
    return products.find((p) => p.slug === slug) ?? null;
  }
}

export class MockCategoryRepository implements CategoryRepository {
  async listAll() {
    return categories;
  }
}

export class MockBrandRepository implements BrandRepository {
  async listAll() {
    return brands;
  }

  async getById(id: string) {
    return brands.find((b) => b.id === id) ?? null;
  }
}

export class MockOrderRepository implements OrderRepository {
  async listAll() {
    return orders;
  }
}
