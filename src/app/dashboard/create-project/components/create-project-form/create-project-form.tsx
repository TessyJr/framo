"use client";

import Image from "next/image";
import { createProject, updateProject } from "./actions";
import { User } from "@supabase/supabase-js";
import { ChangeEvent, useRef, useState } from "react";
import { uploadToStorage } from "@/utils/supabase/storage/client";
import { redirect } from "next/navigation";

export default function CreateProjectForm({ user }: { user: User }) {
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [thumbnailFile, setThumbnailFile] = useState<File>();

  const imagesInputRef = useRef<HTMLInputElement>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const handleCreateProject = async (formData: FormData) => {
    if (thumbnailFile) {
      const projectName = formData.get("projectName") as string;
      const projectDescription = formData.get("projectDescription") as string;

      const projectData = await createProject(
        user,
        projectName,
        projectDescription
      );

      const thumbnailPath = await uploadToStorage({
        file: thumbnailFile,
        bucket: "projects",
        folder: `${user.id}/${projectData.id}/thumbnail`,
        fileName: "thumbnail",
      });

      const imagePaths = (
        await Promise.all(
          imageFiles.map(async (imageFile, index) => {
            return await uploadToStorage({
              file: imageFile,
              bucket: "projects",
              folder: `${user.id}/${projectData.id}/images`,
              fileName: `image-${index}`,
            });
          })
        )
      ).filter((path): path is string => path !== null);

      if (thumbnailPath && imagePaths) {
        await updateProject(projectData.id, thumbnailPath, imagePaths);
      }

      redirect("/dashboard");
    }
  };

  function handleUploadThumbnail(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setThumbnailFile(filesArray[0]);
      setThumbnailUrl(URL.createObjectURL(filesArray[0]));
    }
  }

  function handleUploadImages(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImageUrls = filesArray.map((file) => URL.createObjectURL(file));
      setImageUrls([...imageUrls, ...newImageUrls]);
      setImageFiles([...imageFiles, ...filesArray]);
    }
  }

  function handleRemoveImage(index: number) {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-xl font-bold">Project Form</h1>

      <form action={handleCreateProject} className="space-y-4">
        <div>
          <input
            id="thumbnail"
            name="thumbnail"
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            hidden
            ref={thumbnailInputRef}
            onChange={handleUploadThumbnail}
          />

          <div className="relative aspect-[4/3] w-96 overflow-hidden rounded-lg border border-gray-300">
            <Image
              src={thumbnailUrl || "/images/profile/default.png"}
              alt={"project's thumbnail"}
              className="object-cover"
              fill
            />
          </div>

          <div className="mt-4 flex gap-4">
            <button
              type="button"
              onClick={() => thumbnailInputRef.current?.click()}
              className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Upload Thumbnail
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="projectName">Project Name</label>
          <input
            id="projectName"
            name="projectName"
            type="text"
            className="w-full border p-2"
            required
          />
        </div>

        <div>
          <label htmlFor="projectDescription">Project Description</label>
          <input
            id="projectDescription"
            name="projectDescription"
            type="text"
            className="w-full border p-2"
            required
          />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <input
              id="images"
              name="images"
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              hidden
              multiple
              ref={imagesInputRef}
              onChange={handleUploadImages}
            />

            <h1>Images</h1>

            <button
              type="button"
              onClick={() => imagesInputRef.current?.click()}
              className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Upload Images
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {imageUrls.map((imageUrl, index) => (
              <div key={index} className="group/image relative">
                <Image
                  src={imageUrl}
                  alt={`Project image ${index + 1}`}
                  className="w-full"
                  width={100}
                  height={100}
                />

                <div className="absolute inset-0 m-auto flex h-full w-full items-center justify-center bg-black/50 opacity-0 transition-all group-hover/image:opacity-100">
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          className="group/button transition-d rounded-md bg-zinc-400 shadow-[0_5px] shadow-zinc-200 outline-2 outline-black transition hover:shadow-[0_4px] active:shadow-[0_0]"
          type="submit"
        >
          <div className="-translate-y-1.5 rounded-md bg-zinc-50 px-4 py-2 font-semibold text-black outline-2 outline-black transition group-hover/button:-translate-y-1 group-active/button:-translate-y-0">
            Create Project
          </div>
        </button>
      </form>
    </div>
  );
}
