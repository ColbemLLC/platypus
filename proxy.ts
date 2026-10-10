import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

// Gates the dashboard only: /home and the (authorized-sections) pages. Everything else stays public.
// Optimistic check: it only looks for the session cookie, it does not validate the session.
export function proxy(request: NextRequest) {
  if (!getSessionCookie(request)) {
    return NextResponse.redirect(new URL("/register", request.url));
  }
  return NextResponse.next();
}

// Must be literal strings. Keep in step with the folders in (authorized-sections).
export const config = {
  matcher: [
    "/home/:path*",
    "/user-profile/:path*",
    "/user-settings/:path*",
    "/dm/:path*",
    "/user-communities/:path*",
    "/guilds/:path*",
    "/organization/:path*",
    "/badges/:path*",
  ],
};