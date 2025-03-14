"use server";

import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.log(error);
    redirect("/error");
  }

  redirect("/log-in");
}

export async function getProfile(user: User) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error.message);
    return null;
  }

  return data;
}

export async function updateProfile(user: User, formData: FormData) {
  const username = formData.get("username") as string;
  const fullName = formData.get("fullName") as string;
  const website = formData.get("website") as string;

  const supabase = await createClient();

  const { error } = await supabase.from("profiles").upsert({
    id: user?.id as string,
    username: username,
    full_name: fullName,
    website: website,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.log(error);
    redirect("/error");
  }

  console.log("Profile Updated");
}

export async function getAvatar(path: string) {
  if (!path) return "/images/profile/default.png";

  const supabase = await createClient();

  const { data } = supabase.storage.from("avatars").getPublicUrl(path);

  return data.publicUrl;
}

export async function updateAvatar(
  user: User,
  avatarFile: File,
  currentAvatarFilePath: string
) {
  const fileExt = avatarFile.name.split(".").pop();
  const avatarFilePath = `${user.id}.${fileExt}`;

  const supabase = await createClient();

  const { error: deleteError } = await supabase.storage
    .from("avatars")
    .remove([currentAvatarFilePath]);

  if (deleteError) {
    console.error("Error deleting old avatar:", deleteError);
    return;
  }

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(avatarFilePath, avatarFile, {
      upsert: true,
    });

  if (uploadError) {
    console.error("Error uploading new avatar:", uploadError);
    return;
  }

  const updates = {
    id: user.id,
    avatar_url: avatarFilePath,
    updated_at: new Date(),
  };

  const { error } = await supabase.from("profiles").upsert(updates);

  if (error) {
    console.error("Error updating profile:", error);
  }
}
