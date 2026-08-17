export function Topbar({ title }: { title: string }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-azul-confianza/10 bg-white px-8">
      <h1 className="text-lg font-bold text-azul-confianza">{title}</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gris-pizarra">Equipo PlenaPet</span>
        <div className="h-8 w-8 rounded-full bg-aqua-bienestar/40" />
      </div>
    </header>
  );
}
