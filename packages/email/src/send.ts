import { getResendClient, getEmailFrom, isEmailConfigured } from "./client";

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

/**
 * Envío best-effort: nunca lanza. Un email de notificación que falla no
 * puede tumbar la acción real (crear cuenta, publicar resultados, etc.) —
 * no hay cola/reintentos todavía, así que por ahora un fallo solo queda
 * en los logs del server.
 */
export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<void> {
  if (!isEmailConfigured()) {
    console.warn(`[email] RESEND_API_KEY no configurada — se omite "${subject}" a ${to}`);
    return;
  }

  try {
    const resend = getResendClient();
    const { error } = await resend.emails.send({
      from: getEmailFrom(),
      to,
      subject,
      html,
    });

    if (error) {
      console.error(`[email] Resend rechazó "${subject}" a ${to}:`, error);
    }
  } catch (err) {
    console.error(`[email] Fallo inesperado enviando "${subject}" a ${to}:`, err);
  }
}
