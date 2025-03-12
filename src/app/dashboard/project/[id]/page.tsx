import { getProjectById } from "./actions";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Project({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/log-in");
  }

  const { id } = await params;
  const project = await getProjectById(user, id);

  if (!project) {
    return (
      <div className="p-16">
        <Link href="/dashboard">Go back</Link>
        <h1>Project Not Found!</h1>
      </div>
    );
  }

  return (
    <div className="p-16">
      <Link href="/dashboard">Go back</Link>
      <h1 className="text-lg font-semibold">{project.name}</h1>
      <p className="text-gray-600">{project.description}</p>

      <div>
        <h1>No images</h1>
      </div>
    </div>
  );
}
