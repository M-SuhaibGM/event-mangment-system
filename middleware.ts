import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Better Auth stores the session token in a cookie
  // Standard name is "better-auth.session_token" or similar 
  const sessionCookie = request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__secure-better-auth.session_token");

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*) , /dashboard", "/profile", "/settings", "/events/:path*", "/orders", "/"],

};