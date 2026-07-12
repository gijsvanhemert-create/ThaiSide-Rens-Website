import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project. Without this, Next may infer the
  // root from an unrelated lockfile higher up in the home directory.
  turbopack: {
    root: __dirname,
  },
  images: {
    // Sanity serves uploaded images from its image CDN.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
      {
        // YouTube video thumbnails.
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
    ],
  },
};

export default nextConfig;
