import { Button, Logo } from "@plenapet/ui";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-crema-calido px-4">
      <div className="w-full max-w-sm rounded-card border border-azul-confianza/10 bg-white p-8 shadow-card">
        <Logo withTagline />
        <h1 className="mt-6 text-lg font-bold text-azul-confianza">
          Ingreso al panel
        </h1>
        <p className="mt-1 text-sm text-gris-pizarra">
          Autenticación de equipo pendiente de conectar con Supabase Auth.
        </p>
        <form className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Correo corporativo"
            disabled
            className="w-full rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm disabled:bg-gris-pizarra/5"
          />
          <input
            type="password"
            placeholder="Contraseña"
            disabled
            className="w-full rounded-lg border border-azul-confianza/15 px-3 py-2 text-sm disabled:bg-gris-pizarra/5"
          />
          <Button type="button" className="w-full" disabled>
            Ingresar (próximamente)
          </Button>
        </form>
      </div>
    </div>
  );
}
