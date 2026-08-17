import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/admin/Sidebar";

export const metadata: Metadata = {
  title: "Panel interno | PlenaPet",
  robots: { index: false, follow: false },
};

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  // RLS de admin_users solo permite a un usuario leer su propia fila
  // (auth.uid() = id) — ver supabase/migrations/0002_admin_users_self_read.sql.
  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("active")
    .eq("id", user.id)
    .maybeSingle();

  if (!adminUser?.active) {
    redirect("/admin/login?error=No%20autorizado");
  }

  return (
    <div className="flex min-h-screen bg-[#F4F6F7]">
      <Sidebar email={user.email ?? ""} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
