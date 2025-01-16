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

  // Check for auth token
  const authToken = request.cookies.get("access_token");

  // Handle API routes
  if (isApiRoute && isProtectedApiRoute) {
    if (!authToken) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
  }

  // Handle page routes
  if (isProtectedRoute && !authToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Add teacher role check if needed
  // if (isTeacherRoute) {
  //   // Add teacher role verification logic here
  // }

  return NextResponse.next();
}

// Update config to include API routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
