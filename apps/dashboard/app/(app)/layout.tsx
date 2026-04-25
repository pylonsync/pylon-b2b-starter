import { redirect } from "next/navigation";
import { getSession } from "@pylon-b2b/auth/server";
import { SessionProvider } from "@pylon-b2b/auth/client";
import { AppShell } from "@/components/app/app-shell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session?.user) redirect("/login");
  if (!session.activeOrg) redirect("/onboarding");

  return (
    <SessionProvider
      value={{
        user: session.user,
        activeOrgId: session.activeOrgId,
        activeOrg: session.activeOrg,
      }}
    >
      <AppShell>{children}</AppShell>
    </SessionProvider>
  );
}
