/**
 * Server-side auth helpers used by Next.js Server Components and
 * route handlers. Reads the session cookie, optionally calls Pylon
 * to resolve user + active org.
 */
import "server-only";
import { cookies } from "next/headers";
import type { Organization, User } from "@pylon-b2b/backend";

export const SESSION_COOKIE = "pylon-session";
export const ACTIVE_ORG_COOKIE = "pylon-active-org";

const PYLON_URL = process.env.PYLON_BASE_URL ?? "http://localhost:4321";

export type Session = {
  token: string;
  userId: string;
  user: User | null;
  activeOrgId: string | null;
  activeOrg: Organization | null;
};

export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  // Resolve the token against Pylon. Returns user_id even if the user
  // hasn't picked an active org yet.
  const meRes = await fetch(`${PYLON_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!meRes.ok) return null;
  const me = (await meRes.json()) as {
    user_id?: string;
    tenant_id?: string;
  };
  if (!me.user_id) return null;

  const userId = me.user_id;
  const activeOrgId = jar.get(ACTIVE_ORG_COOKIE)?.value ?? me.tenant_id ?? null;

  const [user, org] = await Promise.all([
    fetchEntity<User>(token, "User", userId),
    activeOrgId ? fetchEntity<Organization>(token, "Organization", activeOrgId) : null,
  ]);

  return {
    token,
    userId,
    user,
    activeOrgId,
    activeOrg: org,
  };
}

export async function requireSession(): Promise<Session> {
  const s = await getSession();
  if (!s) throw new Error("UNAUTHENTICATED");
  return s;
}

async function fetchEntity<T>(
  token: string,
  entity: string,
  id: string,
): Promise<T | null> {
  const res = await fetch(
    `${PYLON_URL}/api/entities/${entity}/${encodeURIComponent(id)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );
  if (!res.ok) return null;
  return (await res.json()) as T;
}

/**
 * Server action helper: hand the Pylon login response, set the cookie.
 * Pass the `cookies()` jar from the calling action since cookies are
 * mutable in actions but not in server components.
 */
export function pylonUrl(): string {
  return PYLON_URL;
}
