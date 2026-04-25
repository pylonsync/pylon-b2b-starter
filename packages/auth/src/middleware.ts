import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "./server";

/**
 * Edge middleware for the dashboard. Anything not under `/login`,
 * `/signup`, `/accept-invite`, or `/api/auth/*` requires a session.
 * If the user is logged in but hasn't picked an org yet, push them to
 * `/onboarding`.
 */
export function authMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublic =
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/accept-invite") ||
    pathname.startsWith("/api/auth/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon");

  const token = req.cookies.get(SESSION_COOKIE)?.value;

  if (isPublic) return NextResponse.next();
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
