import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

// Only /home is gated for now. Every other route stays public.
// Optimistic check: it only looks for the session cookie, it does not validate the session.
export function proxy(request: NextRequest) {
  if (!getSessionCookie(request)) {
    return NextResponse.redirect(new URL("/register", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/home/:path*"],
};