"use client";

import { signIn, getProviders } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import Link from "next/link";

interface Provider {
  id: string;
  name: string;
  type: string;
}

export default function SignInPage() {
  const [providers, setProviders] = useState<Record<string, Provider> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [credentialsError, setCredentialsError] = useState("");
  const [showCredentials, setShowCredentials] = useState(false);

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    fetchProviders();
  }, []);

  const handleSignIn = async (providerId: string) => {
    setIsLoading(true);
    try {
      await signIn(providerId, { 
        callbackUrl: "/onboarding",
        redirect: true 
      });
    } catch (error) {
      console.error("Sign in error:", error);
      setIsLoading(false);
    }
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setCredentialsError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setCredentialsError("Invalid email or password");
        setIsLoading(false);
      } else {
        // Successful login, redirect
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Credentials sign in error:", error);
      setCredentialsError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const getProviderIcon = (providerId: string) => {
    switch (providerId) {
      case "google":
        return (
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        );
      case "facebook":
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        );
      case "instagram":
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        );
      case "twitter":
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        );
      case "linkedin":
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const getProviderColor = (providerId: string) => {
    switch (providerId) {
      case "google":
        return "hover:bg-red-600/20 border-red-500/30";
      case "facebook":
        return "hover:bg-blue-600/20 border-blue-500/30";
      case "instagram":
        return "hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20 border-purple-500/30";
      case "twitter":
        return "hover:bg-blue-500/20 border-blue-400/30";
      case "linkedin":
        return "hover:bg-blue-700/20 border-blue-600/30";
      default:
        return "hover:bg-gray-600 border-gray-600";
    }
  };

  return (
    <div className="min-h-screen honey-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md honey-card">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 honey-gradient rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">🍯</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold honey-text bg-clip-text text-transparent">
            MeliMou 🍯
          </CardTitle>
          <CardDescription className="text-lg text-yellow-200 font-medium">
            Καλώς ήρθατε! Welcome!
          </CardDescription>
          <CardDescription className="text-gray-300">
            Sign in to start your sweet Greek language journey
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Email/Password Form */}
          <div className="space-y-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCredentials(!showCredentials)}
              className="w-full h-12 bg-gradient-to-r from-amber-600 to-yellow-600 text-white border-yellow-500 hover:from-amber-700 hover:to-yellow-700"
            >
              <div className="flex items-center gap-2">
                🍯 Sign in with Email & Password
                <span className={`transform transition-transform ${showCredentials ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </div>
            </Button>

            {showCredentials && (
              <form onSubmit={handleCredentialsSubmit} className="space-y-4 p-4 bg-gray-700/50 rounded-lg border border-yellow-500/20">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-200">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="gabe@melimou.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-200">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                {credentialsError && (
                  <div className="text-red-400 text-sm bg-red-500/10 p-2 rounded border border-red-500/20">
                    {credentialsError}
                  </div>
                )}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white"
                >
                  {isLoading ? "Signing in..." : "🍯 Sign In"}
                </Button>
                <div className="text-xs text-yellow-300 bg-yellow-500/10 p-2 rounded border border-yellow-500/20">
                  <strong>Admin Login:</strong> gabe@melimou.com / admin123
                </div>
              </form>
            )}
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-gray-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-800 px-2 text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          {/* OAuth Providers */}
          <div className="space-y-3">
            {providers &&
              Object.values(providers)
                .filter(provider => provider.id !== "credentials")
                .map((provider) => (
                <Button
                  key={provider.name}
                  onClick={() => handleSignIn(provider.id)}
                  disabled={isLoading}
                  className={`w-full h-12 bg-gray-700 text-white border transition-all duration-200 ${getProviderColor(provider.id)}`}
                  variant="outline"
                >
                  <div className="flex items-center gap-3">
                    {getProviderIcon(provider.id)}
                    <span>Continue with {provider.name}</span>
                  </div>
                </Button>
              ))}
          </div>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-gray-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-800 px-2 text-yellow-300">
                ✨ Sweet Learning Awaits ✨
              </span>
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-400">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="underline text-yellow-400 hover:text-yellow-300">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline text-yellow-400 hover:text-yellow-300">
              Privacy Policy
            </Link>
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 rounded-lg border border-yellow-500/20">
            <h3 className="text-sm font-medium text-yellow-300 mb-2 flex items-center gap-2">
              🍯 What happens next?
            </h3>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• 🎯 Tell us about your Greek learning goals</li>
              <li>• 💳 Choose your subscription plan (free option available)</li>
              <li>• 🚀 Start learning with personalized content</li>
              <li>• 🏛️ Explore Greek culture and traditions</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 