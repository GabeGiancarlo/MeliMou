/**
 * 🔐 NextAuth.js Authentication Configuration
 * 
 * Comprehensive authentication system for the MeliMou platform supporting multiple OAuth providers
 * and email/password authentication. Integrates with Drizzle ORM for user data persistence.
 * 
 * 🏗️ AUTHENTICATION FEATURES:
 * ├── 🌐 Multiple OAuth Providers (Google, Facebook, Instagram, Twitter, LinkedIn)
 * ├── 📧 Email/Password Authentication (with bcrypt hashing)
 * ├── 🗄️ Database Integration (Drizzle ORM adapter)
 * ├── 🎫 JWT Session Management (30-day expiration)
 * ├── 🎯 Custom User Properties (role, onboarding, subscription)
 * ├── 🔄 Onboarding Flow Integration
 * └── 🛡️ Type Safety (TypeScript module augmentation)
 * 
 * 🎯 USER FLOW:
 * 1. User signs in via OAuth or email/password
 * 2. Account linked to database user record
 * 3. Session created with custom user properties
 * 4. New users redirected to onboarding
 * 5. JWT tokens include platform-specific data
 * 
 * 🔧 SECURITY FEATURES:
 * - Secure password hashing with bcrypt
 * - JWT tokens with configurable expiration
 * - OAuth state validation
 * - CSRF protection built-in
 * - Secure cookie settings
 * 
 * 💡 CUSTOMIZATION:
 * - Add new OAuth providers in providers array
 * - Extend user properties in module augmentation
 * - Modify session data in callbacks
 * - Add authentication events for user lifecycle
 * 
 * @see https://next-auth.js.org for NextAuth.js documentation
 * @see ~/server/db/schema.ts for user data models
 */

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

// =============================================================================
// 🎯 TYPE SYSTEM EXTENSIONS
// =============================================================================

/**
 * 🎯 NextAuth.js Module Augmentation
 * 
 * Extends the default NextAuth types to include MeliMou-specific user properties.
 * This ensures type safety throughout the application when accessing user data.
 * 
 * 🔧 Custom Properties:
 * - `role`: User access level (student, instructor, admin)
 * - `hasCompletedOnboarding`: Onboarding flow completion status
 * - `subscriptionTier`: Current subscription level (free, pro, premium)
 * - `age`: Optional user age for personalization
 * - `gender`: Optional demographic information
 * 
 * 💡 Usage: These properties are available in session objects throughout the app
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

// =============================================================================
// 🔧 NEXTAUTH.JS CONFIGURATION
// =============================================================================

/**
 * 🔧 NextAuth.js Configuration Options
 * 
 * Comprehensive authentication configuration for the MeliMou platform.
 * Handles OAuth providers, session management, callbacks, and user lifecycle events.
 * 
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  // ===========================================================================
  // 📞 AUTHENTICATION CALLBACKS
  // ===========================================================================

  callbacks: {
    /**
     * 🎫 JWT Token Callback
     * 
     * Enriches JWT tokens with custom user properties from the database.
     * Called whenever a JWT is created, updated, or accessed.
     * 
     * 🔄 Flow: User data → JWT token → Session
     * 🎯 Purpose: Include MeliMou-specific properties in the token
     */
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

    /**
     * 🌐 Session Callback
     * 
     * Transforms JWT token data into the session object available in the client.
     * Ensures type safety and provides consistent user data across the application.
     * 
     * 🎯 Purpose: Create type-safe session with custom properties
     * 💡 Usage: Accessible via useSession() hook in React components
     */
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

    /**
     * 🔄 Redirect Callback
     * 
     * Controls where users are redirected after authentication actions.
     * Handles both relative and absolute URLs securely.
     * 
     * 🛡️ Security: Prevents open redirect vulnerabilities
     * 🎯 Logic: Allows internal redirects and approved callback URLs
     */
    redirect: ({ url, baseUrl }) => {
      // Handle relative URLs (internal redirects)
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      // Allow callback URLs that match the base URL
      if (url.startsWith(baseUrl)) {
        return url;
      }
      // Default to home page for external URLs
      return baseUrl;
    },
  },

  // ===========================================================================
  // 🗄️ DATABASE ADAPTER CONFIGURATION
  // ===========================================================================

  /**
   * 🗄️ Drizzle Database Adapter
   * 
   * Integrates NextAuth.js with Drizzle ORM for user data persistence.
   * Maps authentication tables to our database schema.
   * 
   * 🔗 Table Mapping:
   * - users → User profiles and authentication data
   * - accounts → OAuth provider account linking
   * - sessions → Active user sessions
   * - verificationTokens → Email verification and password reset
   */
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }) as Adapter,

  // ===========================================================================
  // 🌐 AUTHENTICATION PROVIDERS
  // ===========================================================================

  providers: [
    /**
     * 📧 Email/Password Authentication
     * 
     * Allows users to sign in with email and password credentials.
     * Passwords are hashed with bcrypt for security.
     * 
     * 🔒 Security Features:
     * - Password hashing with bcrypt
     * - Email validation
     * - User existence verification
     */
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

        // Find user by email
        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email),
        });

        if (!user || !user.password) {
          return null;
        }

        // Verify password with bcrypt
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

    /**
     * 🔍 Google OAuth Provider
     * 
     * Enables sign-in with Google accounts.
     * Configured for offline access and consent prompt.
     * 
     * 🎯 Features: Seamless Google account integration
     * 🔧 Config: Offline access for refresh tokens
     */
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

    /**
     * 📘 Facebook OAuth Provider
     * 
     * Enables sign-in with Facebook accounts.
     * Standard OAuth configuration.
     */
    FacebookProvider({
      clientId: env.FACEBOOK_CLIENT_ID ?? "",
      clientSecret: env.FACEBOOK_CLIENT_SECRET ?? "",
    }),

    /**
     * 📸 Instagram OAuth Provider
     * 
     * Enables sign-in with Instagram accounts.
     * Useful for content creators and social engagement.
     */
    InstagramProvider({
      clientId: env.INSTAGRAM_CLIENT_ID ?? "",
      clientSecret: env.INSTAGRAM_CLIENT_SECRET ?? "",
    }),

    /**
     * 🐦 Twitter OAuth Provider
     * 
     * Enables sign-in with Twitter/X accounts.
     * Uses Twitter API v2 for modern authentication.
     */
    TwitterProvider({
      clientId: env.TWITTER_CLIENT_ID ?? "",
      clientSecret: env.TWITTER_CLIENT_SECRET ?? "",
      version: "2.0", // Use Twitter API v2
    }),

    /**
     * 💼 LinkedIn OAuth Provider
     * 
     * Enables sign-in with LinkedIn accounts.
     * Configured with OpenID Connect scopes.
     * 
     * 🎯 Target: Professional users and business learners
     */
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

  // ===========================================================================
  // 📄 CUSTOM PAGES
  // ===========================================================================

  /**
   * 📄 Custom Authentication Pages
   * 
   * Defines custom pages for authentication flows.
   * Ensures consistent branding and user experience.
   */
  pages: {
    signIn: "/auth/signin",        // Custom sign-in page with honey theme
    newUser: "/onboarding",        // Redirect new users to onboarding flow
  },

  // ===========================================================================
  // 🎫 SESSION CONFIGURATION
  // ===========================================================================

  /**
   * 🎫 Session Management Configuration
   * 
   * Configures session behavior, expiration, and update frequency.
   * Uses JWT strategy for scalability and performance.
   */
  session: {
    strategy: "jwt",                 // JWT strategy for stateless sessions
    maxAge: 30 * 24 * 60 * 60,      // 30 days session duration
    updateAge: 24 * 60 * 60,        // Update session every 24 hours
  },

  /**
   * 🔑 JWT Configuration
   * 
   * Configures JWT token behavior and expiration.
   * Matches session duration for consistency.
   */
  jwt: {
    maxAge: 30 * 24 * 60 * 60,      // 30 days JWT token duration
  },

  // ===========================================================================
  // 🎭 AUTHENTICATION EVENTS
  // ===========================================================================

  /**
   * 🎭 Authentication Events
   * 
   * Handles user lifecycle events for business logic integration.
   * Sets up new users with default values and onboarding flow.
   */
  events: {
    /**
     * 👤 User Creation Event
     * 
     * Called when a new user is created (first sign-in).
     * Sets default values for MeliMou-specific properties.
     * 
     * 🎯 Setup: Ensures all new users have proper defaults
     * 🔄 Flow: User creation → Default values → Onboarding redirect
     */
    createUser: async ({ user }) => {
      // Set default values for new users
      if (user.email && user.id) {
        await db.update(users).set({
          role: "student",                    // Default to student role
          hasCompletedOnboarding: false,      // Require onboarding completion
          subscriptionTier: "free",           // Start with free tier
        }).where(eq(users.id, user.id));
      }
    },
  },
};

// =============================================================================
// 🛠️ AUTHENTICATION UTILITIES
// =============================================================================

/**
 * 🛠️ Server-Side Session Helper
 * 
 * Wrapper for getServerSession with pre-configured auth options.
 * Provides consistent session access across server components and API routes.
 * 
 * 🎯 Usage: Server components, API routes, middleware
 * 🔧 Benefits: Type safety, consistent configuration
 * 
 * @returns Promise<Session | null> - Current user session or null
 * 
 * @example
 * const session = await getServerAuthSession();
 * if (session?.user) {
 *   console.log(`User: ${session.user.email}, Role: ${session.user.role}`);
 * }
 */
export async function getServerAuthSession() {
  return getServerSession(authOptions);
}
