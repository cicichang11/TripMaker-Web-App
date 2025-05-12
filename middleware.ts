import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the pathname starts with these protected routes
  const isProtectedRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/trips") || pathname.startsWith("/groups")

  // Check if the pathname is an auth route
  const isAuthRoute = pathname.startsWith("/auth/login") || pathname.startsWith("/auth/signup")

  // Get the token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // If it's a protected route and no token exists, redirect to login
  if (isProtectedRoute && !token) {
    const url = new URL("/auth/login", request.url)
    url.searchParams.set("callbackUrl", encodeURI(request.url))
    return NextResponse.redirect(url)
  }

  // If it's an auth route and token exists, redirect to dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: ["/dashboard/:path*", "/trips/:path*", "/groups/:path*", "/auth/login", "/auth/signup"],
}
