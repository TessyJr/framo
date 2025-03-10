import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/log-in");
  }

  return <>{children}</>;
}
