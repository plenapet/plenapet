"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sendEmail, welcomeEmailSubject, welcomeEmailHtml } from "@plenapet/email";
import { SITE_URL } from "@/lib/site-url";

export async function signUpAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("fullName") ?? "");
  const next = String(formData.get("next") ?? "/health/mascotas");

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) {
    redirect(`/cuenta/registro?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(next)}`);
  }

  await sendEmail({
    to: email,
    subject: welcomeEmailSubject(),
    html: welcomeEmailHtml({ fullName, ctaUrl: `${SITE_URL}${next}` }),
  });

  if (!data.session) {
    // El proyecto exige confirmar el correo antes de iniciar sesión.
    redirect(`/cuenta/login?confirmar=1&next=${encodeURIComponent(next)}`);
  }

  redirect(next);
}

export async function signInCustomerAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/health/mascotas");

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/cuenta/login?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(next)}`);
  }

  redirect(next);
}

export async function signOutCustomerAction() {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}
