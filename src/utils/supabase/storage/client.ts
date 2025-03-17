import imageCompression from "browser-image-compression";
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

type FetchProps = {
  bucket: string;
  path: string;
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

  try {
    file = await imageCompression(file, {
      maxSizeMB: 1,
    });
  } catch (error) {
    console.error("Error compressing image:", error);
    return null;
  }

  const storage = getStorage();

  const { error } = await storage
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

export async function fetchFromStorage({ bucket, path }: FetchProps) {
  const storage = getStorage();

  const { data } = storage.from(bucket).getPublicUrl(path);

  if (!data) {
    console.error("Nothing to fetch from storage");
    return null;
  }

  return data;
}
