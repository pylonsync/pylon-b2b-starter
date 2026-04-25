import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE, priority: 1.0, changeFrequency: "weekly" },
    { url: `${SITE}/#features`, priority: 0.8 },
    { url: `${SITE}/#pricing`, priority: 0.9 },
  ];
}
