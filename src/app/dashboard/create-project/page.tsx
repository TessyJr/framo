import { getUser } from "@/utils/supabase/server";
import CreateProjectForm from "./components/create-project-form/create-project-form";

export default async function CreateProject() {
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
      <CreateProjectForm user={user} />
    </div>
  );
}
