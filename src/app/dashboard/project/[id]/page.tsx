import { getImagesFromCloudinary, getProjectById } from "./actions";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import UploadButton from "./components/UploadButton";
import { CloudinaryImage } from "./components/CloudinaryImage";

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

  const results = await getImagesFromCloudinary(user.id, project.id);

  return (
    <div className="p-16">
      <Link href="/dashboard">Go back</Link>
      <h1 className="text-lg font-semibold">{project.name}</h1>
      <p className="text-gray-600">{project.description}</p>

      <UploadButton userId={user.id} projectId={project.id} />

      {results.length > 0 ? (
        <div className="grid grid-cols-4 gap-4">
          {results.map((result: any) => (
            <CloudinaryImage
              key={result.public_id}
              width={400}
              height={300}
              src={result.public_id}
              sizes="100vw"
              alt="Uploaded image"
            />
          ))}
        </div>
      ) : (
        <div>
          <h1>No images</h1>
        </div>
      )}
    </div>
  );
}
