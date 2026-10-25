import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // receipt screenshots exceed the 1MB Server Action default
  experimental: { serverActions: { bodySizeLimit: "6mb" } },
};

export default nextConfig;
