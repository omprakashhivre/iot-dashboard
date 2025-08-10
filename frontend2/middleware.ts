import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

    console.log("--------- pathname", pathname)
  // Allow access to static assets and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // static files
  ) {
    return NextResponse.next()
  }

  // Public routes that don't require authentication
  const publicRoutes = ["/login","/register", "/"]

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Check for token in cookies or redirect to login
  // const token = request.cookies.get("token")?.value || request.headers.get("authorization")?.replace("Bearer ", "")

  // if (!token && pathname !== "/login") {
  //   return NextResponse.redirect(new URL("/login", request.url))
  // }

  // For protected routes, let the client-side handle authentication
  // The ProtectedRoute component will handle redirects
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
