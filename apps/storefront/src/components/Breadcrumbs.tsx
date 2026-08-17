import Link from "next/link";

export type Crumb = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Ruta de navegación" className="text-xs text-gris-pizarra">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
            {index > 0 && <span aria-hidden="true">/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-azul-confianza">
                {item.label}
              </Link>
            ) : (
              <span className="text-azul-confianza">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
