import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },
  experimental: {
    // News and event forms accept images up to 10 MB; leave room for the
    // multipart/form-data headers included in the Server Action request.
    serverActions: {
      bodySizeLimit: "12mb",
    },
  },
};

export default nextConfig;
