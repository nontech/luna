import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes
const protectedRoutes = ["/classrooms"];
const teacherRoutes = ["/classrooms/@teacher"];
const protectedApiRoutes = ["/api/classrooms", "/api/exercises"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is an API route
  const isApiRoute = pathname.startsWith("/api");

  // Check route types
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isTeacherRoute = teacherRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isProtectedApiRoute = protectedApiRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check for either access_token or refresh_token
  const hasAuthToken =
    request.cookies.has("access_token") ||
    request.cookies.has("refresh_token") ||
    request.cookies.has("sessionid"); // Also check for Django session

  // Handle API routes
  if (isApiRoute && isProtectedApiRoute) {
    if (!hasAuthToken) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
  }

  // Handle page routes
  if (isProtectedRoute && !hasAuthToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Add teacher role check if needed
  // if (isTeacherRoute) {
  //   // Add teacher role verification logic here
  // }

  return NextResponse.next();
}

// Make sure matcher includes all paths we want to protect
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/api/:path*",
  ],
};
