"use client";

import { createContext, useContext } from "react";
import type { Organization, User } from "@pylon-b2b/backend";

type SessionShape = {
  user: User;
  activeOrgId: string | null;
  activeOrg: Organization | null;
};

const SessionContext = createContext<SessionShape | null>(null);

export function SessionProvider({
  value,
  children,
}: {
  value: SessionShape | null;
  children: React.ReactNode;
}) {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

/** Read the SSR-hydrated session. Throws when called outside `SessionProvider`. */
export function useSession(): SessionShape {
  const v = useContext(SessionContext);
  if (!v) throw new Error("useSession requires SessionProvider with a value");
  return v;
}

/** Same but tolerates an unauthenticated render (e.g. login page). */
export function useOptionalSession(): SessionShape | null {
  return useContext(SessionContext);
}
