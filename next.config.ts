import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static site: there is no Next.js server to run or patch in production.
  output: "export",
};

export default nextConfig;
