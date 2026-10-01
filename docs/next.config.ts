import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  basePath: "/docs",
  allowedDevOrigins: ["192.168.8.19"],
};

export default nextConfig;
