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
import CredentialsProvider from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

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
      age?: number;
      gender?: "male" | "female" | "non_binary" | "prefer_not_to_say";
    } & DefaultSession["user"];
  }

  interface User {
    role: "student" | "instructor" | "admin";
    hasCompletedOnboarding: boolean;
    subscriptionTier: "free" | "pro" | "premium";
    age?: number;
    gender?: "male" | "female" | "non_binary" | "prefer_not_to_say";
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.hasCompletedOnboarding = user.hasCompletedOnboarding;
        token.subscriptionTier = user.subscriptionTier;
        token.age = user.age;
        token.gender = user.gender;
      }
      return token;
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.id as string,
        role: token.role as "student" | "instructor" | "admin",
        hasCompletedOnboarding: token.hasCompletedOnboarding as boolean,
        subscriptionTier: token.subscriptionTier as "free" | "pro" | "premium",
        age: token.age as number | undefined,
        gender: token.gender as "male" | "female" | "non_binary" | "prefer_not_to_say" | undefined,
      },
    }),
    redirect: ({ url, baseUrl }) => {
      // Handle redirect after signin
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      // Allow callback URLs
      if (url.startsWith(baseUrl)) {
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
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email),
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          hasCompletedOnboarding: user.hasCompletedOnboarding,
          subscriptionTier: user.subscriptionTier,
        };
      }
    }),
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
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
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
