import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nczpunqhniggzvbjllxp.supabase.co",
      },
    ],
  },
};

export default nextConfig;
