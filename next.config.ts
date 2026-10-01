import type { NextConfig } from "next";

const DOCS_URL = (process.env.DOCS_URL ?? "http://localhost:3001").replace(
  /\/+$/,
  "",
);

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: ["192.168.8.19"],
  async rewrites() {
    return [{ source: "/docs/:path*", destination: `${DOCS_URL}/docs/:path*` }];
  },
};

export default nextConfig;
