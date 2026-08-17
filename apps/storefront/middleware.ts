import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Corre sobre /admin y /health (ver `matcher`). Refresca la sesión de
 * Supabase y bloquea el acceso sin sesión:
 * - /admin/* (menos /admin/login): equipo interno. El chequeo fino de si esa
 *   sesión pertenece a un admin_users activo pasa en
 *   app/admin/(panel)/layout.tsx, que sí puede consultar la base de datos.
 * - /health/*: módulo PlenaPet Health, cualquier cliente con cuenta. Sin
 *   sesión se manda a /cuenta/login con `next` de vuelta a donde iba.
 */
export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/health") && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/cuenta/login";
    loginUrl.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/health/:path*"],
};
