import { renderEmailLayout, renderButton } from "./layout";

export function welcomeEmailSubject(): string {
  return "Bienvenido a PlenaPet";
}

export function welcomeEmailHtml({
  fullName,
  ctaUrl,
}: {
  fullName: string;
  ctaUrl: string;
}): string {
  const firstName = fullName.trim().split(" ")[0] || "";
  return renderEmailLayout({
    title: welcomeEmailSubject(),
    bodyHtml: `
      <p style="margin:0 0 16px;">${firstName ? `Hola ${firstName},` : "Hola,"}</p>
      <p style="margin:0 0 16px;">Gracias por crear tu cuenta en PlenaPet — todo para una vida plena de tu perro o gato: alimentos, farmacia veterinaria, desparasitantes y suplementos, con entrega a domicilio.</p>
      <p style="margin:0;">Tu cuenta también te da acceso a <strong>PlenaPet Health</strong>: registra a tu mascota y sigue su bienestar y edad biológica con datos reales.</p>
      ${renderButton("Ir a mi cuenta", ctaUrl)}
    `,
  });
}
