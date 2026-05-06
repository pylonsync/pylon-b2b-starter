import type { NextConfig } from "next";

const PYLON_TARGET = process.env.PYLON_TARGET ?? "http://localhost:4321";

const config: NextConfig = {
  // Same-origin proxy so the browser never makes cross-origin
  // requests to the Pylon backend. Without this rewrite the dashboard
  // at :3001 hits :4321 directly and CORS blocks every fetch
  // (signup, /api/auth/me, /api/sync/pull, /api/fn/*). With it, the
  // browser sees /api/* on its own origin and Next forwards.
  //
  // Override `PYLON_TARGET` in production (e.g. https://api.your.app)
  // and the same rewrites carry over.
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${PYLON_TARGET}/api/:path*` },
      { source: "/studio", destination: `${PYLON_TARGET}/studio` },
      { source: "/studio/:path*", destination: `${PYLON_TARGET}/studio/:path*` },
    ];
  },
  // Empty string = client uses relative paths (`/api/...`) which the
  // rewrite above forwards same-origin to PYLON_TARGET. Setting this
  // to PYLON_TARGET would defeat the rewrite — the browser would
  // fetch :4321 directly and CORS would block again. Server-side
  // code (packages/auth/src/server.ts) reads PYLON_BASE_URL
  // directly for SSR fetches; that one keeps the explicit URL.
  env: {
    NEXT_PUBLIC_PYLON_URL: "",
  },
  transpilePackages: [
    "@pylon-b2b/ui",
    "@pylon-b2b/auth",
    "@pylon-b2b/backend",
    "@pylon-b2b/config",
    "@pylonsync/react",
    "@pylonsync/sync",
    "@pylonsync/sdk",
    "@pylonsync/functions",
  ],
  images: { unoptimized: true },
};

export default config;
