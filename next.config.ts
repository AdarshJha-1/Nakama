import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    staleTimes: {
      dynamic: 30
    }
  },
  images: {
    domains: ["img.clerk.com"],
  }
};

export default nextConfig;
