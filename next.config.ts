import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nervgnxcanvlxxwafnwh.supabase.co",
      },
    ],
  },
};

export default nextConfig;
