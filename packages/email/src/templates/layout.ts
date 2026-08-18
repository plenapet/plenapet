const COLORS = {
  azulConfianza: "#17324D",
  coralCercania: "#F47A63",
  cremaCalido: "#FFF9F2",
  grisPizarra: "#52616D",
};

export function renderButton(label: string, href: string): string {
  return `<a href="${href}" style="display:inline-block;margin-top:20px;padding:12px 28px;background-color:${COLORS.azulConfianza};color:#ffffff;font-weight:600;font-size:14px;text-decoration:none;border-radius:999px;">${label}</a>`;
}

export function renderEmailLayout({
  title,
  bodyHtml,
}: {
  title: string;
  bodyHtml: string;
}): string {
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
  </head>
  <body style="margin:0;padding:0;background-color:${COLORS.cremaCalido};font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.cremaCalido};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="width:480px;max-width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="background-color:${COLORS.azulConfianza};padding:20px 32px;">
                <span style="color:#ffffff;font-size:20px;font-weight:700;">plena<span style="color:${COLORS.coralCercania};">pet</span></span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;color:${COLORS.azulConfianza};font-size:15px;line-height:1.6;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;background-color:${COLORS.cremaCalido};color:${COLORS.grisPizarra};font-size:12px;line-height:1.5;">
                Recibiste este correo porque tienes una cuenta o una mascota registrada en PlenaPet.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
