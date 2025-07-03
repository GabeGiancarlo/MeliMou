import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import InstagramProvider from "next-auth/providers/instagram";
import TwitterProvider from "next-auth/providers/twitter";
import LinkedInProvider from "next-auth/providers/linkedin";
import { eq } from "drizzle-orm";

import { env } from "~/env";
import { db } from "~/server/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "~/server/db/schema";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: "student" | "instructor" | "admin";
      hasCompletedOnboarding: boolean;
      subscriptionTier: "free" | "pro" | "premium";
    } & DefaultSession["user"];
  }

  interface User {
    role: "student" | "instructor" | "admin";
    hasCompletedOnboarding: boolean;
    subscriptionTier: "free" | "pro" | "premium";
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        role: user.role,
        hasCompletedOnboarding: user.hasCompletedOnboarding,
        subscriptionTier: user.subscriptionTier,
      },
    }),
    redirect: ({ url, baseUrl }) => {
      // Redirect to onboarding if user hasn't completed it
      if (url === baseUrl && url.includes('callbackUrl=')) {
        return url;
      }
      return baseUrl;
    },
  },
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }) as Adapter,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    FacebookProvider({
      clientId: env.FACEBOOK_CLIENT_ID ?? "",
      clientSecret: env.FACEBOOK_CLIENT_SECRET ?? "",
    }),
    InstagramProvider({
      clientId: env.INSTAGRAM_CLIENT_ID ?? "",
      clientSecret: env.INSTAGRAM_CLIENT_SECRET ?? "",
    }),
    TwitterProvider({
      clientId: env.TWITTER_CLIENT_ID ?? "",
      clientSecret: env.TWITTER_CLIENT_SECRET ?? "",
      version: "2.0", // Use Twitter API v2
    }),
    LinkedInProvider({
      clientId: env.LINKEDIN_CLIENT_ID ?? "",
      clientSecret: env.LINKEDIN_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    newUser: "/onboarding", // Redirect new users to onboarding
  },
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  events: {
    createUser: async ({ user }) => {
      // Set default values for new users
      if (user.email && user.id) {
        await db.update(users).set({
          role: "student",
          hasCompletedOnboarding: false,
          subscriptionTier: "free",
        }).where(eq(users.id, user.id));
      }
    },
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export async function getServerAuthSession() {
  return getServerSession(authOptions);
}
