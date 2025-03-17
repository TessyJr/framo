import { getUser } from "@/utils/supabase/server";
import ProjectsList from "./components/projects-list/projects-list";
import ProfileDetail from "./components/profile-details/profile-details";

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
    <div className="flex flex-col gap-8 p-16">
      <ProfileDetail user={user} />

      <ProjectsList user={user} />
    </div>
  );
}
