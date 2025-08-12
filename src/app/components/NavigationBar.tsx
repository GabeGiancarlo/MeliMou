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
 * - Authenticated: Show user profile, sign-out option (in dropdown)
 * - Loading: Handle session loading gracefully
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { Bell, LogOut, User as UserIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Small helper to render a nav tab link with active styling
 */
function NavTab({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={[
        "px-3 py-2 text-sm font-medium transition-colors",
        "rounded-md",
        isActive
          ? "bg-white/15 text-yellow-200"
          : "text-white/90 hover:text-yellow-200 hover:bg-white/10",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

/**
 * Profile dropdown composed of the pill and a flyout menu
 */
function ProfileDropdown({ name, email }: { name?: string | null; email?: string | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const displayName = name ?? email ?? "User";
  const initial = (displayName?.trim()[0] ?? "U").toUpperCase();

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Single styled container to avoid nested-pill visuals */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-white hover:bg-white/15 transition-colors"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        {/* Avatar */}
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-500 text-black font-semibold">
          {initial}
        </div>
        {/* Name/Email - single line, truncate to avoid height growth */}
        <span className="max-w-[12rem] truncate text-sm leading-none">
          {displayName}
        </span>
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-md bg-white text-black shadow-lg ring-1 ring-black/10"
        >
          <div className="px-3 py-2 text-sm text-gray-700">
            <div className="truncate font-medium">{displayName}</div>
            {email ? <div className="truncate text-xs text-gray-500">{email}</div> : null}
          </div>
          <div className="h-px bg-gray-200" />
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100"
            role="menuitem"
            onClick={() => setIsOpen(false)}
          >
            <UserIcon className="h-4 w-4" /> Profile
          </Link>
          <button
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-100"
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              signOut();
            }}
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

export function NavigationBar() {
  const { data: session, status } = useSession();
  const isAuthed = status === "authenticated" && !!session;

  return (
    <nav className="w-full border-b border-amber-400/30 bg-gradient-to-b from-[#5a3d16] via-[#4a3314] to-[#2f2316] text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Left: Brand + Tabs */}
        <div className="flex items-center gap-6">
          {/* Brand */}
          <Link href={isAuthed ? "/dashboard" : "/"} className="flex items-center gap-2">
            <span className="text-xl font-extrabold tracking-tight">MeliMou</span>
            <span role="img" aria-label="honey" className="text-2xl">🍯</span>
          </Link>

          {/* Tabs */}
          <div className="hidden md:flex items-center gap-1">
            <NavTab href="/dashboard" label="Dashboard" />
            <NavTab href="/my-learning-path" label="Your Learning Path" />
            <NavTab href="/resources" label="Resources" />
            <NavTab href="/culture" label="Culture" />
            <NavTab href="/chat" label="Group" />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {status === "loading" && (
            <span className="text-sm text-gray-200/80">Loading...</span>
          )}

          {isAuthed ? (
            <>
              {/* Notifications */}
              <Link
                href="/alerts"
                className="rounded-full bg-white/10 p-2 hover:bg-white/15 transition-colors"
                aria-label="Notifications"
                title="Notifications"
              >
                <Bell className="h-5 w-5 honey-icon" />
              </Link>

              {/* Profile dropdown */}
              <ProfileDropdown
                name={session.user?.name}
                email={session.user?.email}
              />
            </>
          ) : (
            <>
              <div className="md:hidden">
                <Link href="/dashboard" className="text-sm underline underline-offset-4">Dashboard</Link>
              </div>
              <button
                onClick={() => signIn()}
                className="inline-flex items-center rounded-md bg-yellow-500 px-3 py-1.5 text-sm font-medium text-black hover:bg-yellow-600 transition-colors"
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
