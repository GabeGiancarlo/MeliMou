/**
 * 🧭 Navigation Bar Component - Global Application Navigation
 * 
 * Primary navigation component that provides consistent navigation across all pages.
 * Integrates with NextAuth.js for authentication state and displays user-specific options.
 * 
 * 🏗️ COMPONENT FEATURES:
 * ├── 🔐 Authentication Integration (NextAuth.js session handling)
 * ├── 🎨 Honey Theme Styling (Purple-to-amber gradients)
 * ├── 📱 Responsive Design (Mobile-first approach)
 * ├── 🧭 Consistent Navigation (Persistent across all routes)
 * └── 🎯 Dynamic Content (Shows different options based on auth state)
 * 
 * 🎯 NAVIGATION STATES:
 * - Anonymous: Show sign-in and main navigation links
 * - Authenticated: Show user profile, sign-out option
 * - Loading: Handle session loading gracefully
 * 
 * 🎨 STYLING APPROACH:
 * - Gradient background with honey theme colors
 * - Hover effects for interactive elements
 * - Consistent with overall application branding
 * - Accessible color contrast and touch targets
 * 
 * 💡 INTEGRATION POINTS:
 * - useSession hook for authentication state
 * - Next.js Link for client-side navigation
 * - Shadcn/ui Button component for consistency
 * 
 * @see ~/server/auth.ts for authentication configuration
 * @see ~/styles/globals.css for honey theme styles
 */

"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

/**
 * 🧭 Navigation Bar Component
 * 
 * Renders the main navigation bar with authentication-aware content.
 * Provides consistent navigation experience across the entire application.
 * 
 * @returns JSX element containing the complete navigation bar
 */
export function NavigationBar() {
  const { data: session, status } = useSession();

  return (
    <nav className="flex items-center justify-between p-4 shadow-md bg-gradient-to-b from-[#974cd9] to-[#2e026d] dark:from-[#6b46c1] dark:to-[#1e1b4b] text-white">
      {/* 
        🏠 Home/Logo Link
        Primary navigation anchor point that returns users to the main page
      */}
      <Link href="/">
        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground dark:hover:bg-white/10 h-9 px-4 py-2 text-lg font-bold">
          Home
        </button>
      </Link>

      {/* 
        🔐 Authentication-Aware Navigation Section
        Displays different content based on user authentication status
      */}
      <div className="flex items-center gap-4">
        {/* 
          ⏳ Loading State Handler
          Shows loading indicator while session status is being determined
        */}
        {status === "loading" && (
          <span className="text-sm text-gray-300">Loading...</span>
        )}

        {/* 
          🚪 Anonymous User Navigation
          Displayed when user is not authenticated - encourages sign-in
        */}
        {status === "unauthenticated" && (
          <>
            {/* Feature Navigation Links - Allow exploration before signup */}
            <Link href="/tutor" className="text-white hover:text-yellow-300 transition-colors">
              AI Tutor
            </Link>
            <Link href="/learning-paths" className="text-white hover:text-yellow-300 transition-colors">
              Learning
            </Link>
            <Link href="/culture" className="text-white hover:text-yellow-300 transition-colors">
              Culture
            </Link>
            
            {/* Sign In Call-to-Action */}
            <button
              onClick={() => signIn()}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-2 rounded-md transition-colors"
            >
              Sign In
            </button>
          </>
        )}

        {/* 
          👤 Authenticated User Navigation
          Displayed when user is logged in - provides access to personal features
        */}
        {status === "authenticated" && session && (
          <>
            {/* User Greeting with Profile Information */}
            <span className="text-sm text-gray-300">
              Hello, {session.user?.name || session.user?.email}
            </span>
            
            {/* Dashboard Access - Primary authenticated landing page */}
            <Link href="/dashboard">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                Dashboard
              </button>
            </Link>
            
            {/* Sign Out Option */}
            <button
              onClick={() => signOut()}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Sign Out
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
