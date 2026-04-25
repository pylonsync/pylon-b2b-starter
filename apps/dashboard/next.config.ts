import type { NextConfig } from "next";

const config: NextConfig = {
  transpilePackages: [
    "@pylon-b2b/ui",
    "@pylon-b2b/auth",
    "@pylon-b2b/db",
    "@pylon-b2b/config",
    "@pylonsync/react",
    "@pylonsync/sync",
    "@pylonsync/sdk",
    "@pylonsync/functions",
  ],
  images: { unoptimized: true },
};

export default config;
