import { Suspense } from "react";
import { AcceptInviteClient } from "@/components/auth/accept-invite-client";

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={null}>
      <AcceptInviteClient />
    </Suspense>
  );
}
