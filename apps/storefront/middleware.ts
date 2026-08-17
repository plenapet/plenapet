import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Corre sobre /admin y /health/mascotas (ver `matcher`). Refresca la sesión
 * de Supabase y bloquea el acceso sin sesión:
 * - /admin/* (menos /admin/login): equipo interno. El chequeo fino de si esa
 *   sesión pertenece a un admin_users activo pasa en
 *   app/admin/(panel)/layout.tsx, que sí puede consultar la base de datos.
 * - /health/mascotas/*: la app de PlenaPet Health que sí requiere cuenta de
 *   cliente. `/health` (la landing) queda deliberadamente fuera de esta
 *   protección — tiene que ser pública/indexable para SEO, ver
 *   app/health/layout.tsx.
 */
export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/health/mascotas") && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/cuenta/login";
    loginUrl.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/health/mascotas/:path*"],
};
