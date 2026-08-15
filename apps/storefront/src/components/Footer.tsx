import Link from "next/link";
import { Container, Logo } from "@plenapet/ui";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-azul-confianza/10 bg-white">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo withTagline />
          <p className="mt-4 max-w-xs text-sm text-gris-pizarra">
            El petshop digital donde las familias encuentran todo lo que
            necesitan para cuidar bien a sus perros y gatos.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-azul-confianza">Categorías</h4>
          <ul className="mt-3 space-y-2 text-sm text-gris-pizarra">
            <li><Link href="/productos?categoria=alimentos">Alimentos</Link></li>
            <li><Link href="/productos?categoria=farmacia-veterinaria">Farmacia veterinaria</Link></li>
            <li><Link href="/productos?categoria=desparasitantes">Desparasitantes</Link></li>
            <li><Link href="/productos?categoria=accesorios">Accesorios</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-azul-confianza">Ayuda</h4>
          <ul className="mt-3 space-y-2 text-sm text-gris-pizarra">
            <li><Link href="/carrito">Mi carrito</Link></li>
            <li>Envíos y entregas</li>
            <li>Preguntas frecuentes</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-azul-confianza">Legal</h4>
          <ul className="mt-3 space-y-2 text-sm text-gris-pizarra">
            <li>Términos y condiciones</li>
            <li>Política de tratamiento de datos</li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-azul-confianza/10 py-6 text-center text-xs text-gris-pizarra/70">
        © {new Date().getFullYear()} PlenaPet. Todo para una vida plena.
      </div>
    </footer>
  );
}
