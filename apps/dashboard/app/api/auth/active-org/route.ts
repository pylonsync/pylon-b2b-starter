import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ACTIVE_ORG_COOKIE,
  SESSION_COOKIE,
  pylonUrl,
} from "@pylon-b2b/auth/server";

/**
 * Switch the active org. Sets the cookie + tells Pylon so the
 * tenant_id on subsequent auth resolves to the new org.
 */
export async function POST(req: Request) {
  const { orgId } = (await req.json().catch(() => ({}))) as {
    orgId?: string | null;
  };
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ error: "no session" }, { status: 401 });
  }
  await fetch(`${pylonUrl()}/api/auth/select-org`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ orgId }),
  });
  if (orgId)
    jar.set({
      name: ACTIVE_ORG_COOKIE,
      value: orgId,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  else jar.delete(ACTIVE_ORG_COOKIE);
  return NextResponse.json({ ok: true });
}
