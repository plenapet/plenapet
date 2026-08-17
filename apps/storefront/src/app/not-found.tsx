import Link from "next/link";
import { Button, Container, Logo } from "@plenapet/ui";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <Logo />
      <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-coral-cercania">
        Error 404
      </p>
      <h1 className="mt-2 text-3xl font-bold text-azul-confianza">
        No encontramos esta página
      </h1>
      <p className="mt-3 max-w-md text-sm text-gris-pizarra">
        El producto o la página que buscas pudo haberse movido o ya no está
        disponible. Prueba explorando el catálogo completo.
      </p>
      <Link href="/productos" className="mt-7">
        <Button>Ir al catálogo</Button>
      </Link>
    </Container>
  );
}
