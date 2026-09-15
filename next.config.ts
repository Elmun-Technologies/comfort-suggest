import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "*.e2b.app",
    "3000-*.e2b.app",
    "localhost:3000",
    "127.0.0.1:3000",
  ],
};

export default nextConfig;
