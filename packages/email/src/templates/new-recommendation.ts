import { renderEmailLayout, renderButton } from "./layout";

export function newRecommendationEmailSubject(petName: string): string {
  return `Nueva recomendación para ${petName}`;
}

export function newRecommendationEmailHtml({
  petName,
  title,
  description,
  ctaUrl,
}: {
  petName: string;
  title: string;
  description: string | null;
  ctaUrl: string;
}): string {
  return renderEmailLayout({
    title: newRecommendationEmailSubject(petName),
    bodyHtml: `
      <p style="margin:0 0 16px;">Agregamos una nueva recomendación de cuidado para <strong>${petName}</strong>:</p>
      <p style="margin:0 0 8px;font-weight:700;">${title}</p>
      ${description ? `<p style="margin:0 0 16px;color:#52616D;">${description}</p>` : ""}
      ${renderButton("Ver en PlenaPet Health", ctaUrl)}
    `,
  });
}
