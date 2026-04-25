import type { NextConfig } from "next";

const config: NextConfig = {
  transpilePackages: ["@pylon-b2b/ui", "@pylon-b2b/config"],
  images: { unoptimized: true },
};

export default config;
