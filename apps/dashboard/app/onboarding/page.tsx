import { redirect } from "next/navigation";
import { getSession } from "@pylon-b2b/auth/server";
import { OnboardingFlow } from "@/components/onboarding/flow";

export default async function OnboardingPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  // If they already have an active org, push them straight in.
  if (session.activeOrg) redirect("/");
  return <OnboardingFlow user={session.user!} />;
}
