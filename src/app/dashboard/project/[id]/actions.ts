import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";

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
