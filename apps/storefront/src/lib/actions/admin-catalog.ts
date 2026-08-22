"use server";

import { redirect } from "next/navigation";
import { parse } from "csv-parse/sync";
import {
  getServiceSupabaseClient,
  fixMojibake,
  slugify,
  computePriceCents,
  mapCategorySlug,
  inferSpecies,
  isNonProductRow,
  normalizeBrandKey,
} from "@plenapet/database";
import { requireAdminUserId, requireSuperAdminUserId } from "@/lib/auth/require-admin";

/**
 * Placeholder hasta que VetShipping quede como env var propia — es la URL
 * pública del proyecto de Supabase de VetShipping (confirmada 2026-08-22,
 * bucket "product-images" público). Server-only: nunca se expone al cliente.
 */
const VETSHIPPING_SUPABASE_URL =
  process.env.VETSHIPPING_SUPABASE_URL || "https://jbrozseeadqcnlviqqxi.supabase.co";

interface VetShippingProductRow {
  id: string;
  name: string;
  description: string;
  base_cost: string;
  category_id: string;
  requires_rx: string;
  controlled_substance: string;
  is_active: string;
  brand_id: string;
}

interface VetShippingBrandRow {
  id: string;
  name: string;
}

interface VetShippingImageRow {
  product_id: string;
  storage_path: string;
  sort_order: string;
}

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

async function readCsvFile<T>(file: File | null): Promise<T[]> {
  if (!file || file.size === 0) return [];
  const text = await file.text();
  return parse(text, { columns: true, skip_empty_lines: true, relax_quotes: true }) as T[];
}

/**
 * Primera migración de catálogo desde VetShipping (adapter CSV, ver
 * Arquitectura/Integracion-VetShipping.md). Sube 3 CSV exportados del
 * Supabase de VetShipping (productos, marcas, imágenes) y los convierte en
 * filas de `vetshipping_raw_catalog` + `products` (siempre active=false,
 * quedan ocultos para revisión) + `product_overrides`.
 *
 * Idempotente: si un producto (por su id de VetShipping) ya se importó antes
 * (existe en product_overrides.external_sku), se salta — así reintentar por
 * error no duplica el catálogo.
 *
 * Las imágenes NO se descargan acá — solo se guarda la URL pública de
 * VetShipping en vetshipping_raw_catalog.image_urls_raw (tabla interna, sin
 * política pública). Migrarlas al Storage propio de PlenaPet es un paso
 * aparte (nunca se expone una URL de VetShipping en products.images, que sí
 * es público — ver regla en Integracion-VetShipping.md).
 */
export async function importVetShippingCatalogAction(formData: FormData) {
  await requireSuperAdminUserId();

  const productsFile = formData.get("productsFile") as File | null;
  const brandsFile = formData.get("brandsFile") as File | null;
  const imagesFile = formData.get("imagesFile") as File | null;

  if (!productsFile || productsFile.size === 0) {
    redirect(
      `/admin/catalogo/importar?error=${encodeURIComponent("Falta el CSV de productos")}`,
    );
  }

  const supabase = getServiceSupabaseClient();
  const startedAt = new Date().toISOString();
  const errors: string[] = [];

  let productRows: VetShippingProductRow[];
  try {
    productRows = await readCsvFile<VetShippingProductRow>(productsFile);
  } catch (err) {
    redirect(
      `/admin/catalogo/importar?error=${encodeURIComponent(
        `No se pudo leer el CSV de productos: ${err instanceof Error ? err.message : String(err)}`,
      )}`,
    );
  }

  const brandRows = await readCsvFile<VetShippingBrandRow>(brandsFile);
  const brandNameById = new Map(brandRows.map((b) => [b.id, fixMojibake(b.name)]));

  const imageRows = await readCsvFile<VetShippingImageRow>(imagesFile);
  const imagesByProduct = new Map<string, { path: string; sortOrder: number }[]>();
  for (const row of imageRows) {
    const list = imagesByProduct.get(row.product_id) ?? [];
    list.push({ path: row.storage_path, sortOrder: Number(row.sort_order) || 0 });
    imagesByProduct.set(row.product_id, list);
  }
  for (const list of imagesByProduct.values()) {
    list.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  // Categorías reales ya existentes — nunca se crean nuevas acá.
  const { data: categories } = await supabase.from("categories").select("id, slug");
  const categoryIdBySlug = new Map((categories ?? []).map((c) => [c.slug, c.id as string]));

  // Marcas: reusar por nombre normalizado (evita duplicar "Virbac" si ya existe), crear las que falten.
  const { data: existingBrands } = await supabase.from("brands").select("id, name");
  const brandIdByKey = new Map(
    (existingBrands ?? []).map((b) => [normalizeBrandKey(b.name), b.id as string]),
  );

  const vsBrandIdToPlenaPetBrandId = new Map<string, string>();
  const brandsToCreate: { slug: string; name: string }[] = [];
  const seenNewBrandKeys = new Set<string>();
  for (const [vsId, name] of brandNameById.entries()) {
    const key = normalizeBrandKey(name);
    const existingId = brandIdByKey.get(key);
    if (existingId) {
      vsBrandIdToPlenaPetBrandId.set(vsId, existingId);
    } else if (!seenNewBrandKeys.has(key)) {
      seenNewBrandKeys.add(key);
      brandsToCreate.push({ slug: slugify(name), name });
    }
  }

  if (brandsToCreate.length > 0) {
    const { data: createdBrands, error: brandsError } = await supabase
      .from("brands")
      .insert(brandsToCreate)
      .select("id, name");
    if (brandsError) errors.push(`Marcas: ${brandsError.message}`);
    for (const b of createdBrands ?? []) {
      brandIdByKey.set(normalizeBrandKey(b.name), b.id);
    }
    for (const [vsId, name] of brandNameById.entries()) {
      if (!vsBrandIdToPlenaPetBrandId.has(vsId)) {
        const id = brandIdByKey.get(normalizeBrandKey(name));
        if (id) vsBrandIdToPlenaPetBrandId.set(vsId, id);
      }
    }
  }

  // Idempotencia: no volver a crear productos ya importados en una corrida anterior.
  const { data: existingOverrides } = await supabase
    .from("product_overrides")
    .select("external_sku");
  const alreadyImported = new Set(
    (existingOverrides ?? []).map((o) => o.external_sku).filter(Boolean),
  );

  const existingSlugs = new Set<string>();
  const rawCatalogRows: Record<string, unknown>[] = [];
  const productRowsToInsert: Record<string, unknown>[] = [];
  const overrideRows: Record<string, unknown>[] = [];
  let skippedDuplicates = 0;
  let skippedNonProduct = 0;
  let skippedInvalidCost = 0;

  for (const row of productRows) {
    const name = fixMojibake((row.name ?? "").trim());
    if (!name || isNonProductRow(name)) {
      skippedNonProduct += 1;
      continue;
    }
    if (alreadyImported.has(row.id)) {
      skippedDuplicates += 1;
      continue;
    }

    const baseCost = Number(row.base_cost);
    if (!Number.isFinite(baseCost) || baseCost <= 0) {
      skippedInvalidCost += 1;
      errors.push(`Producto ${row.id} (${name}): base_cost inválido ("${row.base_cost}")`);
      continue;
    }

    const description = fixMojibake((row.description ?? "").trim());

    let slugBase = slugify(name);
    if (!slugBase) slugBase = row.id;
    let uniqueSlug = slugBase;
    let suffix = 2;
    while (existingSlugs.has(uniqueSlug)) {
      uniqueSlug = `${slugBase}-${suffix}`;
      suffix += 1;
    }
    existingSlugs.add(uniqueSlug);

    const categorySlug = mapCategorySlug(row.category_id);
    const categoryId = categoryIdBySlug.get(categorySlug) ?? null;
    const brandId = vsBrandIdToPlenaPetBrandId.get(row.brand_id) ?? null;
    const species = inferSpecies(`${name} ${description}`);
    const requiresPrescription =
      row.requires_rx === "true" || row.controlled_substance === "true";
    const stockStatus = row.is_active === "true" ? "in_stock" : "out_of_stock";
    const priceCents = computePriceCents(baseCost);
    const costPriceCents = Math.round(baseCost * 100);

    const imageUrls = (imagesByProduct.get(row.id) ?? []).map(
      (img) => `${VETSHIPPING_SUPABASE_URL}/storage/v1/object/public/${img.path}`,
    );

    const productId = crypto.randomUUID();

    productRowsToInsert.push({
      id: productId,
      slug: uniqueSlug,
      name,
      short_description: description.slice(0, 160),
      description,
      brand_id: brandId,
      category_id: categoryId,
      species,
      life_stage: "todas",
      price_cents: priceCents,
      stock_status: stockStatus,
      requires_prescription: requiresPrescription,
      active: false,
    });

    rawCatalogRows.push({
      external_sku: row.id,
      name_raw: name,
      cost_price_cents: costPriceCents,
      category_raw: row.category_id,
      species_raw: species.join(","),
      image_urls_raw: imageUrls,
      last_synced_at: startedAt,
      source: "csv-vetshipping",
    });

    overrideRows.push({
      product_id: productId,
      external_sku: row.id,
    });
  }

  for (const batch of chunk(rawCatalogRows, 200)) {
    const { error } = await supabase
      .from("vetshipping_raw_catalog")
      .upsert(batch, { onConflict: "external_sku" });
    if (error) errors.push(`vetshipping_raw_catalog: ${error.message}`);
  }

  for (const batch of chunk(productRowsToInsert, 200)) {
    const { error } = await supabase.from("products").insert(batch);
    if (error) errors.push(`products: ${error.message}`);
  }

  for (const batch of chunk(overrideRows, 200)) {
    const { error } = await supabase.from("product_overrides").insert(batch);
    if (error) errors.push(`product_overrides: ${error.message}`);
  }

  await supabase.from("sync_runs").insert({
    source: "csv-vetshipping",
    started_at: startedAt,
    finished_at: new Date().toISOString(),
    status: errors.length > 0 ? "completed_with_errors" : "completed",
    rows_processed: productRowsToInsert.length,
    errors: errors.length > 0 ? errors.slice(0, 200) : null,
  });

  const params = new URLSearchParams({
    ok: String(productRowsToInsert.length),
    duplicados: String(skippedDuplicates),
    noProducto: String(skippedNonProduct),
    costoInvalido: String(skippedInvalidCost),
    errores: String(errors.length),
  });
  redirect(`/admin/catalogo/importar?${params.toString()}`);
}

/** Publica un producto importado (active=false -> true) tras revisarlo. */
export async function publishProductDraftAction(formData: FormData) {
  await requireAdminUserId();
  const productId = String(formData.get("productId") ?? "");

  const supabase = getServiceSupabaseClient();
  await supabase.from("products").update({ active: true }).eq("id", productId);

  redirect("/admin/catalogo/borradores");
}

/** Solo super_admin: borra un borrador que no vale la pena publicar (ej. mal categorizado, duplicado real). */
export async function deleteProductDraftAction(formData: FormData) {
  await requireSuperAdminUserId();
  const productId = String(formData.get("productId") ?? "");

  const supabase = getServiceSupabaseClient();
  await supabase.from("product_overrides").delete().eq("product_id", productId);
  await supabase.from("products").delete().eq("id", productId);

  redirect("/admin/catalogo/borradores");
}
