"use client";

import { User } from "@supabase/supabase-js";
import { getProfile } from "./actions";
import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchFromStorage } from "@/utils/supabase/storage/client";
import ProfileDetailSkeleton from "./components/profile-detail-skeleton";

export default function ProfileDetail({ user }: { user: User }) {
  const [avatarUrl, setAvatarUrl] = useState<string>(
    "/images/profile/default.png"
  );
  const [loading, setLoading] = useState<boolean>(true);

  const [profile, setProfile] = useState<Profile>();

  useEffect(() => {
    async function fetchData() {
      const profileData = await getProfile(user.id);

      if (profileData) {
        setProfile(profileData);

        if (profileData.avatar_url) {
          const avatarData = await fetchFromStorage({
            bucket: "avatars",
            path: profileData.avatar_url,
          });

          if (avatarData) {
            setAvatarUrl(avatarData.publicUrl);
          } else {
            setAvatarUrl("/images/profile/default.png");
          }
        }
      }

      setLoading(false);
    }

    fetchData();
  }, [user, avatarUrl]);

  return (
    <section>
      {loading ? (
        <ProfileDetailSkeleton />
      ) : (
        <div className="flex flex-col gap-4">
          <h1 className="text-xl font-bold">Profile</h1>

          <div className="relative h-48 w-48 overflow-hidden rounded-lg border border-zinc-300 shadow-sm">
            <Image
              src={avatarUrl}
              alt={`${profile?.full_name || "User"}'s avatar`}
              className="object-cover"
              fill
            />
          </div>

          <div className="flex w-full flex-col gap-4">
            <div>
              <span className="font-bold">Email: </span> {user.email}
            </div>
            <div>
              <span className="font-bold">Username: </span>
              {profile?.username}
            </div>
            <div>
              <span className="font-bold">Full Name: </span>
              {profile?.full_name}
            </div>
            <div>
              <span className="font-bold">Website: </span>
              {profile?.website}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
