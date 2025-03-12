import { getUser } from "@/utils/supabase/server";
import AccountForm from "./components/account-form/account-form";
import ProjectForm from "./components/project-form/project-form";
import ProjectsList from "./components/projects-list/projects-list";

export default async function Dashboard() {
  const user = await getUser();

  if (!user) {
    return (
      <div>
        <p>Loading... </p>
      </div>
    );
  }

  return (
    <div className="p-16">
      <AccountForm user={user} />

      <br />

      <ProjectForm user={user} />

      <br />

      <ProjectsList user={user} />
    </div>
  );
}
