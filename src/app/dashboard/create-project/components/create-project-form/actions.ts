"use server";

import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export async function createProject(
  user: User,
  formData: FormData,
  thumbnailFile: File,
  imageFiles: File[]
) {
  const projectName = formData.get("projectName") as string;
  const projectDescription = formData.get("projectDescription") as string;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .insert([
      {
        name: projectName,
        description: projectDescription,
        user_id: user.id,
        thumbnail: "",
        images: [""],
      },
    ])
    .select("id");

  if (error) {
    console.log(error);
    redirect("/error");
  }

  // Delete old thumbnail from storage
  const { error: deleteThumbnailError } = await supabase.storage
    .from("projects")
    .remove([`${user.id}/${data[0].id}/thumbnail`]);

  if (deleteThumbnailError) {
    console.error("Error deleting thumbnail:", deleteThumbnailError);
    return;
  }

  const thumbnailFileExt = thumbnailFile.name.split(".").pop();
  const thumbnailFilePath = `${user.id}/${data[0].id}/thumbnail/thumbnail.${thumbnailFileExt}`;
  console.log(thumbnailFilePath);

  // Insert new thumbnail to storage
  const { error: uploadThumbnailError } = await supabase.storage
    .from("projects")
    .upload(thumbnailFilePath, thumbnailFile, {
      upsert: true,
    });

  if (uploadThumbnailError) {
    console.error("Error uploading new avatar:", uploadThumbnailError);
    return;
  }

  // Delete old iamges from storage
  const { error: deleteImagesError } = await supabase.storage
    .from("projects")
    .remove([`${user.id}/${data[0].id}/images`]);

  if (deleteImagesError) {
    console.error("Error deleting thumbnail:", deleteImagesError);
    return;
  }

  imageFiles.map(async (imageFile, index) => {
    const imageFileExt = imageFile.name.split(".").pop();
    const imageFilePath = `${user.id}/${data[0].id}/images/image_${index}.${imageFileExt}`;

    // Insert new image to storage
    const { error: uploadImageError } = await supabase.storage
      .from("projects")
      .upload(imageFilePath, imageFile, {
        upsert: true,
      });

    if (uploadImageError) {
      console.error(`Error uploading image: ${index}`, uploadImageError);
      return;
    }
  });

  redirect("/dashboard");
}
