import {
  MockBrandRepository,
  MockCategoryRepository,
  MockOrderRepository,
  MockProductRepository,
} from "./mock";
import {
  getPublicSupabaseClient,
  getServiceSupabaseClient,
  isSupabaseConfigured,
} from "./supabase/client";
import {
  SupabaseBrandRepository,
  SupabaseCategoryRepository,
  SupabaseOrderRepository,
  SupabaseProductRepository,
} from "./supabase/repositories";

export * from "./types";
export * from "./repositories";
export * from "./health-types";
export * from "./wellness-survey";
export * from "./health-scoring";
export { isSupabaseConfigured, getServiceSupabaseClient } from "./supabase/client";

/**
 * Punto único de acceso a los repositorios.
 *
 * Si hay credenciales de Supabase configuradas (NEXT_PUBLIC_SUPABASE_URL +
 * NEXT_PUBLIC_SUPABASE_ANON_KEY en el .env del app que llama), se usan las
 * implementaciones reales. Si no, se cae automáticamente a los datos mock —
 * así el storefront/admin siguen funcionando en cualquier máquina sin
 * necesidad de credenciales para desarrollo rápido.
 *
 * `context: "admin"` usa el cliente con `service_role` (ignora RLS) — es lo
 * que necesita el panel de administración para ver catálogo oculto/inactivo
 * y tablas internas. `context: "public"` (default) usa el cliente `anon`,
 * sujeto a RLS — es lo que debe usar siempre el storefront.
 */
type RepoContext = "public" | "admin";

function client(context: RepoContext) {
  return context === "admin"
    ? getServiceSupabaseClient()
    : getPublicSupabaseClient();
}

export function getProductRepository(context: RepoContext = "public") {
  if (isSupabaseConfigured()) {
    return new SupabaseProductRepository(client(context));
  }
  return new MockProductRepository();
}

export function getCategoryRepository(context: RepoContext = "public") {
  if (isSupabaseConfigured()) {
    return new SupabaseCategoryRepository(client(context));
  }
  return new MockCategoryRepository();
}

export function getBrandRepository(context: RepoContext = "public") {
  if (isSupabaseConfigured()) {
    return new SupabaseBrandRepository(client(context));
  }
  return new MockBrandRepository();
}

export function getOrderRepository() {
  // Hoy solo lo consume el admin — siempre con service_role, porque listar
  // todos los pedidos de todos los clientes no puede pasar por RLS de anon.
  if (isSupabaseConfigured()) {
    return new SupabaseOrderRepository(getServiceSupabaseClient());
  }
  return new MockOrderRepository();
}
