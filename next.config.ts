import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/qrio-scanner",
  assetPrefix: "/qrio-scanner/",
  trailingSlash: true,
};

export default nextConfig;
