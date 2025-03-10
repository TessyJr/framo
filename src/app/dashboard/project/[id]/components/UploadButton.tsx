"use client";

import {
  CldUploadButton,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { useRouter } from "next/navigation";

export default function UploadButton({
  userId,
  projectId,
}: {
  userId: string;
  projectId: string;
}) {
  const router = useRouter();

  const handleUploadSuccess = (results: CloudinaryUploadWidgetResults) => {
    if (
      results.info &&
      typeof results.info !== "string" &&
      "public_id" in results.info
    ) {
      router.refresh();
    } else {
      console.error("Upload failed or unexpected result structure:", results);
    }
  };

  return (
    <CldUploadButton
      uploadPreset="oqnmglg8"
      options={{ folder: `${userId}/${projectId}` }}
      onSuccess={handleUploadSuccess}
    />
  );
}
