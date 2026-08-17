import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Solo corre sobre /admin (ver `matcher`). Refresca la sesión de Supabase y
 * bloquea el acceso a cualquier ruta de /admin (menos /admin/login) sin
 * sesión. El chequeo fino de si esa sesión pertenece a un admin_users activo
 * pasa en app/admin/(panel)/layout.tsx, que sí puede consultar la base de
 * datos con más contexto.
 */
export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);

  const isLoginPage = request.nextUrl.pathname === "/admin/login";
  if (request.nextUrl.pathname.startsWith("/admin") && !isLoginPage && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
