/**
 * 🏠 Root Layout - Application Shell and Provider Setup
 * 
 * This is the root layout component for the MeliMou application using Next.js App Router.
 * It sets up the foundational structure and providers that wrap the entire application.
 * 
 * 🏗️ ARCHITECTURE COMPONENTS:
 * ├── 🎨 Global Styling (Tailwind CSS with honey theme)
 * ├── 🔐 Authentication Provider (NextAuth.js session management)
 * ├── 🔗 API Provider (tRPC with React Query)
 * ├── 🍞 Toast Notifications (Shadcn/ui toast system)
 * ├── 🧭 Navigation Bar (Global app navigation)
 * └── 📱 Responsive Layout (Mobile-first design)
 * 
 * 🎨 DESIGN DECISIONS:
 * - Dark theme default with honey/gold accent colors
 * - Geist Sans font for modern, professional appearance
 * - Purple-to-amber gradients maintaining brand consistency
 * - Mobile-first responsive design approach
 * 
 * 🔧 PROVIDER HIERARCHY:
 * AuthProvider (session management)
 *   └── TRPCReactProvider (API client)
 *       └── NavigationBar (global navigation)
 *           └── Page Content (children)
 * 
 * 💡 PERFORMANCE NOTES:
 * - Suspense boundaries prevent loading state waterfalls
 * - Font loading optimized with next/font
 * - Global CSS loaded once at application level
 * - Toast system uses React portals for optimal rendering
 */

import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/toaster";
import { NavigationBar } from "./components/NavigationBar";
import { AuthProvider } from "./components/AuthProvider";
import { Suspense } from "react";

/**
 * 📄 SEO Metadata Configuration
 * 
 * Optimized for Greek language learning discovery:
 * - Descriptive title including key features (AI, tutoring, honey theme)
 * - Comprehensive description highlighting unique value proposition
 * - Multiple favicon formats for cross-browser compatibility
 * - SVG favicon for modern browsers with crisp scaling
 */
export const metadata: Metadata = {
  title: "MeliMou 🍯 - Greek Language Learning",
  description: "Learn Greek through personalized lessons, interactive chat, and AI-powered tutoring. Where language learning meets the sweetness of honey.",
  icons: [
    { rel: "icon", url: "/favicon.svg", type: "image/svg+xml" },
    { rel: "icon", url: "/favicon.svg" },
  ],
};

/**
 * 🏠 Root Layout Component
 * 
 * @param children - Page content to be rendered within the layout
 * @returns Complete application shell with all providers and global components
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} dark`}>
      <body className="bg-background text-foreground">
        {/* 
          🔐 Authentication Provider
          Provides NextAuth.js session context to all child components
          Enables useSession() hook throughout the application
        */}
        <AuthProvider>
          {/* 
            🍞 Global Toast Notification System
            Renders toast messages at the application level
            Uses React portals for optimal z-index management
          */}
          <Toaster />
          
          {/* 
            🔗 tRPC React Provider
            Provides type-safe API client with React Query integration
            Manages query caching, mutations, and optimistic updates
          */}
          <TRPCReactProvider>
            {/* 
              ⏳ Suspense Boundary
              Prevents loading state waterfalls during navigation
              Enables concurrent rendering for better performance
            */}
            <Suspense>
              {/* 
                🧭 Global Navigation Bar
                Persistent navigation across all pages
                Handles authentication state display and routing
              */}
              <NavigationBar />
              
              {/* 
                📄 Page Content
                Dynamic content rendered by Next.js App Router
                Each page component is rendered here based on URL
              */}
              {children}
            </Suspense>
          </TRPCReactProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
