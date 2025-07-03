import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Allow access to auth pages
    if (pathname.startsWith("/auth/")) {
      return NextResponse.next();
    }

    // Allow access to public pages
    const publicPages = ["/", "/terms", "/privacy"];
    if (publicPages.includes(pathname)) {
      return NextResponse.next();
    }

    // If user is authenticated but hasn't completed onboarding
    if (token && !token.hasCompletedOnboarding && pathname !== "/onboarding") {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    // If user has completed onboarding but is trying to access onboarding page
    if (token && token.hasCompletedOnboarding && pathname === "/onboarding") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow access to public pages without authentication
        const publicPages = ["/", "/auth/signin", "/terms", "/privacy"];
        if (publicPages.includes(pathname)) {
          return true;
        }

        // Require authentication for all other pages
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}; 