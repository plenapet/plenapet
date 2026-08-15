import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Dos niveles de acceso, a propósito:
 * - Cliente "público" (anon key): respeta RLS, es lo que usa el storefront.
 * - Cliente "de servicio" (service_role key): ignora RLS, solo para el admin
 *   y para procesos server-side de confianza (sync de catálogo, checkout).
 *   NUNCA debe llegar al bundle del cliente — solo se lee desde código server.
 */

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

let publicClient: SupabaseClient | null = null;
let serviceClient: SupabaseClient | null = null;

export function getPublicSupabaseClient(): SupabaseClient {
  if (!publicClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anonKey) {
      throw new Error(
        "Faltan NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      );
    }
    publicClient = createClient(url, anonKey, {
      auth: { persistSession: false },
    });
  }
  return publicClient;
}

export function getServiceSupabaseClient(): SupabaseClient {
  if (!serviceClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceKey) {
      throw new Error(
        "Faltan NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY. Este cliente es solo para código server-side de confianza (admin, jobs de sync).",
      );
    }
    serviceClient = createClient(url, serviceKey, {
      auth: { persistSession: false },
    });
  }
  return serviceClient;
}
