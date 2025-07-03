"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export function NavigationBar() {
  const { data: session, status } = useSession();

  return (
    <nav className="flex items-center justify-between p-4 shadow-md bg-gradient-to-b from-[#974cd9] to-[#2e026d] dark:from-[#6b46c1] dark:to-[#1e1b4b] text-white">
      <Link href="/">
        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground dark:hover:bg-white/10 h-9 px-4 py-2 text-lg font-bold">
          Home
        </button>
      </Link>
      <div className="space-x-4">
        {status === "loading" ? (
          <span className="text-sm opacity-70">Loading...</span>
        ) : session ? (
          <>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground dark:hover:bg-white/10 h-9 px-4 py-2"
            >
              Dashboard
            </Link>
            <button
              onClick={() => signOut()}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground dark:hover:bg-white/10 h-9 px-4 py-2"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => signIn()}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground dark:hover:bg-white/10 h-9 px-4 py-2"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
