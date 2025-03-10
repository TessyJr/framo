import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";
import cloudinary from "cloudinary";

export async function getProjectById(user: User, projectId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .eq("id", projectId)
    .single();

  if (error) {
    console.error("Error fetching project:", error);
    return null;
  }

  return data;
}

export async function getImagesFromCloudinary(
  userId: string,
  projectId: string
) {
  const results = await cloudinary.v2.search
    .expression(`folder:${userId}/${projectId} AND resource_type:image`)
    .sort_by("created_at", "desc")
    .max_results(5)
    .execute();

  return results.resources;
}
