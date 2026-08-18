import { Resend } from "resend";

let client: Resend | null = null;

/** Placeholder de Resend hasta verificar un dominio propio — ver Preguntas-abiertas.md. */
const DEFAULT_FROM = "PlenaPet <onboarding@resend.dev>";

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export function getResendClient(): Resend {
  if (!client) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY no está configurada");
    }
    client = new Resend(apiKey);
  }
  return client;
}

export function getEmailFrom(): string {
  return process.env.EMAIL_FROM || DEFAULT_FROM;
}
