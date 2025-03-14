import { createClient } from "../client";

type UploadProps = {
  file: File;
  bucket: string;
  folder: string;
  fileName: string;
};

type DeleteProps = {
  bucket: string;
  paths: string[];
};

function getStorage() {
  const { storage } = createClient();
  return storage;
}

export async function uploadToStorage({
  file,
  bucket,
  folder,
  fileName,
}: UploadProps) {
  const fileExt = file.name.split(".").pop();
  const path = `${folder}/${fileName}.${fileExt}`;

  const storage = getStorage();

  const { data, error } = await storage
    .from(bucket)
    .upload(path, file, { upsert: true });

  if (error) {
    console.error("Error uploading to storage:", error);
    return null;
  }

  return path;
}

export async function deleteFromStorage({ bucket, paths }: DeleteProps) {
  const storage = getStorage();

  const { error } = await storage.from(bucket).remove(paths);

  if (error) {
    console.error("Error deleting from storage:", error);
    return;
  }
}
