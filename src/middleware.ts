/**
 * 🛡️ Next.js Middleware - Authentication & Route Protection
 * 
 * This middleware handles authentication, authorization, and routing logic for the MeliMou platform.
 * It runs on every request before the page loads, enabling server-side security and user flow control.
 * 
 * 🔒 SECURITY FEATURES:
 * ├── 🎫 Session Validation (NextAuth.js token verification)
 * ├── 🚧 Route Protection (Public vs protected routes)
 * ├── 🎯 Onboarding Flow (Redirect incomplete users)
 * ├── 🔄 Smart Redirects (Prevent auth loops)
 * └── 📱 Preview Access (Public feature exploration)
 * 
 * 🎯 USER FLOW LOGIC:
 * 1. Anonymous users → Access public pages and feature previews
 * 2. Authenticated but incomplete → Redirect to onboarding
 * 3. Authenticated and complete → Access dashboard and protected features
 * 4. Completed users accessing onboarding → Redirect to dashboard
 * 
 * 🌐 ROUTE CATEGORIES:
 * - Public: Home, auth pages, feature previews (no login required)
 * - Protected: Dashboard, admin, user-specific features (login required)
 * - Onboarding: Setup flow for new users (login required, incomplete users only)
 * 
 * 🚀 PERFORMANCE CONSIDERATIONS:
 * - Lightweight checks to minimize request latency
 * - Early returns to avoid unnecessary processing
 * - Token validation cached by NextAuth.js
 * 
 * 💡 BUSINESS LOGIC:
 * - Preview access encourages user exploration before signup
 * - Onboarding completion gates full platform access
 * - Smart redirects prevent infinite redirect loops
 */

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/**
 * 🛡️ Main Middleware Function with Authentication Integration
 * 
 * Uses NextAuth.js withAuth wrapper to handle token validation and provide
 * user context. The inner function receives the enhanced request with auth data.
 */
export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // 🔓 Allow unrestricted access to authentication pages
    // Users need to access signin/signup without being redirected
    if (pathname.startsWith("/auth/")) {
      return NextResponse.next();
    }

    /**
     * 🌐 Public Pages & Feature Preview System
     * 
     * These pages are accessible without authentication to encourage exploration:
     * - "/" - Landing page with feature overview
     * - "/terms", "/privacy" - Legal pages required for compliance
     * - Feature previews: "/tutor", "/learning-paths", etc.
     * 
     * 🎯 Strategy: Let users experience the platform before requiring signup
     */
    const publicPages = [
      "/", 
      "/terms", 
      "/privacy",
      "/tutor",           // AI tutor preview
      "/learning-paths",  // Course catalog preview
      "/resources",       // Resource library preview
      "/certification",   // Certificate system preview
      "/culture",         // Greek culture content preview
      "/chat"            // Community chat preview
    ];
    
    if (publicPages.includes(pathname)) {
      return NextResponse.next();
    }

    /**
     * 🎯 Onboarding Flow Management
     * 
     * New authenticated users must complete onboarding before accessing
     * the main platform. This ensures we have necessary learning preferences.
     * 
     * Business Logic:
     * - Incomplete users → Redirect to onboarding (except if already there)
     * - Complete users → Redirect away from onboarding to dashboard
     */
    if (token && !token.hasCompletedOnboarding && pathname !== "/onboarding") {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    // Prevent completed users from accessing onboarding again
    if (token && token.hasCompletedOnboarding && pathname === "/onboarding") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // ✅ Allow access to all other routes for properly authenticated users
    return NextResponse.next();
  },
  {
    /**
     * 🔐 Authorization Callback Configuration
     * 
     * Determines which requests require authentication tokens.
     * This function runs before the main middleware and decides
     * whether to proceed with or reject the request.
     */
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        /**
         * 🌐 Public Route Authorization
         * 
         * Allow access without authentication for:
         * - Authentication pages (signin, signup)
         * - Legal pages (terms, privacy)
         * - Feature preview pages (marketing strategy)
         * - Landing page
         */
        const publicPages = [
          "/", 
          "/auth/signin", 
          "/terms", 
          "/privacy",
          "/tutor",
          "/learning-paths", 
          "/resources",
          "/certification",
          "/culture",
          "/chat"
        ];
        
        if (publicPages.includes(pathname)) {
          return true; // ✅ Allow access without authentication
        }

        /**
         * 🔒 Protected Route Authorization
         * 
         * All other routes require valid authentication token:
         * - /dashboard - User dashboard
         * - /onboarding - User setup flow
         * - /admin - Administrative functions
         * - Any future protected routes
         */
        return !!token; // ✅ Require authentication token
      },
    },
  }
);

/**
 * 🎯 Middleware Configuration
 * 
 * Defines which routes this middleware should run on.
 * Using matcher pattern to include all routes except static assets.
 * 
 * Performance: Excludes _next/static, _next/image, favicon.ico
 * to avoid unnecessary middleware execution on asset requests.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes - handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}; 