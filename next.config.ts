import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project. Without this, Next may infer the
  // root from an unrelated lockfile higher up in the home directory.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
