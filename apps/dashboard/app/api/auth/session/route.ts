import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@pylon-b2b/auth/server";

const ONE_WEEK_SECONDS = 60 * 60 * 24 * 7;

/**
 * Mirror the Pylon-issued session token into an HttpOnly cookie so
 * server components can read it. Called from the login/signup forms
 * after they hit `/api/auth/password/...` directly.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    token?: string;
    userId?: string;
  };
  if (!body.token) {
    return NextResponse.json({ error: "missing token" }, { status: 400 });
  }
  const jar = await cookies();
  jar.set({
    name: SESSION_COOKIE,
    value: body.token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ONE_WEEK_SECONDS,
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  return NextResponse.json({ ok: true });
}
