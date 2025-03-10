"use server";

import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";

export async function getProjectsByUserId(user: User) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id); // Filters projects for this user

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  return data;
}
