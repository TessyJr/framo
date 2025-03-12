import { User } from "@supabase/supabase-js";
import { getProjectsByUserId } from "../../actions";
import Link from "next/link";

export default async function ProjectsList({ user }: { user: User }) {
  const projects = await getProjectsByUserId(user);

  return (
    <div className="flex flex-col">
      <h1 className="text-xl font-bold">Your Projects</h1>

      <div className="grid grid-cols-4 gap-4">
        {projects.length > 0 ? (
          projects.map((project) => (
            <Link
              href={`/dashboard/project/${project.id}`}
              key={project.id}
              className="rounded border p-4"
            >
              <h2 className="text-lg font-semibold">{project.name}</h2>
              <p className="text-gray-600">{project.description}</p>
            </Link>
          ))
        ) : (
          <p className="text-gray-500">No projects found.</p>
        )}
      </div>
    </div>
  );
}
