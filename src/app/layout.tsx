import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/toaster";
import { NavigationBar } from "./components/NavigationBar";
import { AuthProvider } from "./components/AuthProvider";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "MeliMou 🍯 - Greek Language Learning",
  description: "Learn Greek through personalized lessons, interactive chat, and AI-powered tutoring. Where language learning meets the sweetness of honey.",
  icons: [
    { rel: "icon", url: "/favicon.svg", type: "image/svg+xml" },
    { rel: "icon", url: "/favicon.svg" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} dark`}>
      <body className="bg-background text-foreground">
        <AuthProvider>
          <Toaster />
          <TRPCReactProvider>
            <Suspense>
              <NavigationBar />
              {children}
            </Suspense>
          </TRPCReactProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
