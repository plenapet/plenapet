import type { MetadataRoute } from "next";
import { getCategoryRepository, getProductRepository } from "@plenapet/database";
import { SITE_URL } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    getProductRepository().listActive(),
    getCategoryRepository().listAll(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/productos`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/health`, changeFrequency: "weekly", priority: 0.9 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${SITE_URL}/productos?categoria=${c.slug}`,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/productos/${p.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
