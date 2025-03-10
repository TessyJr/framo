"use server";

import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProject(user: User, formData: FormData) {
  const supabase = await createClient();

  const projectName = formData.get("projectName") as string;
  const projectDescription = formData.get("projectDescription") as string;

  const { error } = await supabase.from("projects").insert([
    {
      name: projectName,
      description: projectDescription,
      user_id: user.id,
    },
  ]);

  if (error) {
    console.log(error);
    redirect("/error");
  }

  revalidatePath("/dashboard"); // Force re-fetch of projects
}
