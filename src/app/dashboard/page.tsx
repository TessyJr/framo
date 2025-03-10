import { createClient } from "@/utils/supabase/server";
import AccountForm from "./components/account-form/account-form";
import ProjectForm from "./components/project-form/project-form";
import ProjectsList from "./components/projects-list/projects-list";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/log-in");
  }

  return (
    <div className="p-16">
      <AccountForm user={user} />

      <br />

      <ProjectForm user={user} />

      <br />

      <ProjectsList />
    </div>
  );
}
