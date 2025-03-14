import { getUser } from "@/utils/supabase/server";
import AccountForm from "./components/account-form/account-form";
import ProjectsList from "./components/projects-list/projects-list";
import Link from "next/link";

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
      <AccountForm user={user} />

      <div>
        <Link
          href="/dashboard/create-project"
          className="rounded bg-blue-500 p-4 text-white"
        >
          Create Project
        </Link>
      </div>

      <ProjectsList user={user} />
    </div>
  );
}
