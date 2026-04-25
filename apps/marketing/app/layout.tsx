import type { Metadata } from "next";
import "./globals.css";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const NAME = "Pylon B2B";
const TAG = "The realtime backend for B2B SaaS.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: `${NAME} — ${TAG}`, template: `%s · ${NAME}` },
  description:
    "Multi-tenant out of the box. Live queries, policies, organizations, billing, audit log — all wired up. Ship in a weekend.",
  applicationName: NAME,
  openGraph: {
    type: "website",
    siteName: NAME,
    title: `${NAME} — ${TAG}`,
    description:
      "Multi-tenant SaaS starter. Live queries + organizations + billing wired up.",
    url: SITE,
  },
  twitter: { card: "summary_large_image", title: NAME, description: TAG },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  );
}
