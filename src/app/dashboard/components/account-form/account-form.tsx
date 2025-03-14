"use client";

import { User } from "@supabase/supabase-js";
import {
  getAvatar,
  getProfile,
  signOut,
  updateAvatar,
  updateProfile,
} from "./actions";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function AccountForm({ user }: { user: User }) {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<File>();
  const [loading, setLoading] = useState<boolean>(true);

  const [profile, setProfile] = useState<{
    full_name: string;
    username: string;
    avatar_url: string;
    website: string;
  } | null>(null);

  useEffect(() => {
    async function fetchData() {
      const profileData = await getProfile(user);
      if (profileData) {
        setProfile(profileData);

        if (profileData.avatar_url) {
          const avatarData = await getAvatar(profileData.avatar_url);
          console.log(avatarData);
          setAvatarUrl(avatarData);
        }
      }
      setLoading(false);
    }

    fetchData();
  }, [user]);

  async function handleLogOut() {
    await signOut();
  }

  async function handleUpdateProfile(formData: FormData) {
    await updateProfile(user, formData);
  }

  function handleSelectAvatar(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setLoading(true);

      const filesArray = Array.from(e.target.files);

      setAvatarFile(filesArray[0]);
      setAvatarUrl(URL.createObjectURL(filesArray[0]));
      setLoading(false);
    }
  }

  async function handleUpdateAvatar() {
    if (avatarFile && profile) {
      await updateAvatar(user, avatarFile, profile.avatar_url);
    }
  }

  return (
    <div className="form-widget">
      <h1 className="text-xl font-bold">Profile</h1>

      <div className="space-y-4">
        <form action={handleUpdateAvatar} className="item-center flex flex-col">
          <input
            id="avatarUrl"
            name="avatarUrl"
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            hidden
            ref={avatarInputRef}
            onChange={handleSelectAvatar}
          />

          <div className="relative h-48 w-48 overflow-hidden rounded-lg border border-gray-300 shadow-sm">
            {loading ? (
              <div className="flex h-full w-full animate-pulse items-center justify-center rounded-lg bg-zinc-500">
                <svg
                  className="h-10 w-10 text-zinc-300"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 18"
                >
                  <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                </svg>
              </div>
            ) : (
              <Image
                src={avatarUrl || "/images/profile/default.png"}
                alt={`${profile?.full_name || "User"}'s avatar`}
                className="object-cover"
                fill
              />
            )}
          </div>

          <div className="mt-4 flex gap-4">
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Select Image
            </button>

            <button
              type="submit"
              className="rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
            >
              Save Image
            </button>
          </div>
        </form>

        <form action={handleUpdateProfile} className="space-y-4">
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="text"
              value={user?.email || ""}
              className="w-full border p-2"
              disabled
            />
          </div>

          <div>
            <label htmlFor="fullName">Full Name</label>
            <input
              name="fullName"
              id="fullName"
              type="text"
              className="w-full border p-2"
            />
          </div>

          <div>
            <label htmlFor="username">Username</label>
            <input
              name="username"
              id="username"
              type="text"
              className="w-full border p-2"
            />
          </div>

          <div>
            <label htmlFor="website">Website</label>
            <input
              name="website"
              id="website"
              type="url"
              className="w-full border p-2"
            />
          </div>

          <div>
            <button className="button primary block" type="submit">
              Update Profile
            </button>
          </div>
        </form>
      </div>

      <div>
        <form action={handleLogOut}>
          <button className="button block" type="submit">
            Log out
          </button>
        </form>
      </div>
    </div>
  );
}
