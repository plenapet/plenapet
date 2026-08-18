import { renderEmailLayout, renderButton } from "./layout";

export function labResultsReadyEmailSubject(petName: string): string {
  return `Los resultados de ${petName} ya están listos`;
}

export function labResultsReadyEmailHtml({
  petName,
  ctaUrl,
}: {
  petName: string;
  ctaUrl: string;
}): string {
  return renderEmailLayout({
    title: labResultsReadyEmailSubject(petName),
    bodyHtml: `
      <p style="margin:0 0 16px;">Ya publicamos los resultados de laboratorio de <strong>${petName}</strong> en su dashboard de PlenaPet Health.</p>
      <p style="margin:0 0 16px;">Ahí puedes ver el estado de salud por sistema y la edad biológica estimada.</p>
      <p style="margin:0;font-size:13px;color:#52616D;">Este resultado es un apoyo de seguimiento y prevención — no reemplaza el diagnóstico ni el criterio de tu veterinario.</p>
      ${renderButton("Ver resultados", ctaUrl)}
    `,
  });
}
