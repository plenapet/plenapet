import type { Metadata } from "next";
import { Button, Logo } from "@plenapet/ui";
import { signInAction } from "@/lib/actions/auth";

export const metadata: Metadata = {
  title: "Ingreso al panel | PlenaPet",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-crema-calido px-4">
      <div className="w-full max-w-sm rounded-card border border-azul-confianza/10 bg-white p-8 shadow-card">
        <Logo withTagline />
        <h1 className="mt-6 text-lg font-bold text-azul-confianza">
          Ingreso al panel
        </h1>
        <p className="mt-1 text-sm text-gris-pizarra">
          Acceso exclusivo para el equipo de PlenaPet.
        </p>

        {searchParams.error && (
          <p className="mt-4 rounded-lg bg-[#FFF1E0] px-3 py-2 text-sm text-[#8A4B00]">
            {searchParams.error === "No autorizado"
              ? "Tu usuario no tiene acceso al panel de PlenaPet."
              : "No pudimos iniciar sesión. Revisa tu correo y contraseña."}
          </p>
        )}

        <form action={signInAction} className="mt-6 space-y-4">
          <input
            name="email"
            type="email"
            required
            placeholder="Correo corporativo"
            className="w-full rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Contraseña"
            className="w-full rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm"
          />
          <Button type="submit" className="w-full">
            Ingresar
          </Button>
        </form>
      </div>
    </div>
  );
}
