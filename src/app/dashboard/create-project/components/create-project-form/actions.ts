"use server";

import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export async function createProject(
  user: User,
  projectName: string,
  projectDescription: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .insert([
      {
        user_id: user.id,
        name: projectName,
        description: projectDescription,
        thumbnail: "",
        images: [],
      },
    ])
    .select("id")
    .single();

  if (error) {
    console.error("Error creating project:", error);
    redirect("/error");
  }

  return data;
}

export async function updateProject(
  projectId: number,
  thumbnailPath: string,
  imagePaths: string[]
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .update({
      thumbnail: thumbnailPath,
      images: imagePaths,
    })
    .eq("id", Number(projectId))
    .select();

  if (error) {
    console.error("Error updating project:", error);
  }
}
