import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: true, // Speeds up build significantly on AWS
  },
};

export default nextConfig;
