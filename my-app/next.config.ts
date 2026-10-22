import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },
  experimental: {
    // Keep multipart uploads below Vercel's 4.5 MB function request limit.
    serverActions: {
      bodySizeLimit: "4.4mb",
    },
  },
};

export default nextConfig;
