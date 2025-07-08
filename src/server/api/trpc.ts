/**
 * 🔗 tRPC Server Configuration - Type-Safe API Foundation
 * 
 * This file configures the tRPC server for the MeliMou platform, providing type-safe API 
 * communication between client and server. It establishes the foundation for all API endpoints
 * with authentication, validation, and performance monitoring.
 * 
 * 🏗️ ARCHITECTURE COMPONENTS:
 * ├── 🌐 Request Context (Database, authentication, headers)
 * ├── 🔧 Initialization (Transformer, error handling)
 * ├── 🛡️ Middleware (Authentication, timing, validation)
 * ├── 📡 Procedures (Public and protected endpoints)
 * └── 🎯 Router Factory (API endpoint organization)
 * 
 * 🎯 KEY FEATURES:
 * - End-to-end type safety with TypeScript inference
 * - Automatic serialization/deserialization with SuperJSON
 * - Built-in authentication middleware
 * - Comprehensive error handling with Zod validation
 * - Performance monitoring and artificial delays in development
 * - Session management integration with NextAuth.js
 * 
 * 🔧 CUSTOMIZATION POINTS:
 * 1. Request Context - Add global dependencies (Redis, external APIs)
 * 2. Middleware - Add logging, rate limiting, analytics
 * 3. Procedures - Create role-based or subscription-based procedures
 * 
 * 💡 USAGE:
 * - Import `createTRPCRouter`, `publicProcedure`, `protectedProcedure` in router files
 * - Use `createTRPCContext` in API handlers and RSC clients
 * - Export router types for client-side inference
 * 
 * @see https://trpc.io/docs for comprehensive tRPC documentation
 * @see ~/server/api/routers/ for endpoint implementations
 */

import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";

// =============================================================================
// 🌐 REQUEST CONTEXT CREATION
// =============================================================================

/**
 * 🌐 tRPC Context Factory
 * 
 * Creates the request context that's available in every tRPC procedure.
 * This context provides access to shared resources like database connections,
 * user sessions, and request metadata.
 * 
 * 🔧 Context Components:
 * - `db`: Drizzle ORM database client for type-safe queries
 * - `session`: NextAuth.js session with user authentication data
 * - `headers`: HTTP request headers for metadata and debugging
 * 
 * 🚀 Performance: Context is created once per request and reused across procedures
 * 🔒 Security: Session validation happens here for protected routes
 * 
 * @param opts - Request options including HTTP headers
 * @returns Context object available in all tRPC procedures
 * 
 * @example
 * // In a procedure:
 * async ({ ctx }) => {
 *   const user = await ctx.db.query.users.findFirst({
 *     where: eq(users.id, ctx.session.user.id)
 *   });
 * }
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await getServerAuthSession();

  return {
    db,      // 🗄️ Database client (Drizzle ORM)
    session, // 🔐 User authentication session
    ...opts, // 📨 Request headers and metadata
  };
};

// =============================================================================
// 🔧 tRPC INITIALIZATION & CONFIGURATION
// =============================================================================

/**
 * 🔧 tRPC Instance Initialization
 * 
 * Configures the core tRPC instance with MeliMou-specific settings:
 * - SuperJSON transformer for Date, Map, Set, BigInt serialization
 * - Enhanced error formatting with Zod validation details
 * - Type inference from the context factory
 * 
 * 🎯 Benefits:
 * - Automatic serialization of complex JavaScript types
 * - Client-side TypeScript errors for validation failures
 * - Consistent error format across the application
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  /**
   * 🔄 SuperJSON Transformer
   * Handles serialization of complex types that JSON.stringify cannot handle:
   * - Date objects (preserves timezone information)
   * - BigInt numbers (for large integers)
   * - Map and Set collections
   * - undefined values (vs null)
   */
  transformer: superjson,
  
  /**
   * 🚨 Enhanced Error Formatting
   * Provides detailed error information for debugging and client-side handling:
   * - Preserves original error shape
   * - Adds flattened Zod validation errors
   * - Enables client-side form validation display
   */
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * 🏭 Server-Side Caller Factory
 * 
 * Creates server-side callers for direct procedure invocation without HTTP.
 * Useful for:
 * - Server-side rendering (SSR)
 * - API route to tRPC procedure calls
 * - Background jobs and scheduled tasks
 * - Testing tRPC procedures directly
 * 
 * @example
 * const caller = createCaller(await createTRPCContext({ headers: new Headers() }));
 * const users = await caller.user.getAll();
 */
export const createCallerFactory = t.createCallerFactory;

// =============================================================================
// 🎯 ROUTER & PROCEDURE BUILDERS
// =============================================================================

/**
 * 🧭 tRPC Router Factory
 * 
 * Creates new routers and sub-routers for organizing API endpoints.
 * Each router groups related functionality (users, auth, learning paths, etc.)
 * 
 * @example
 * export const userRouter = createTRPCRouter({
 *   getProfile: protectedProcedure.query(...),
 *   updateProfile: protectedProcedure.mutation(...),
 * });
 */
export const createTRPCRouter = t.router;

// =============================================================================
// 🛡️ MIDDLEWARE CONFIGURATION
// =============================================================================

/**
 * ⏱️ Performance Monitoring Middleware
 * 
 * Tracks procedure execution time and simulates network latency in development:
 * - Logs execution time for performance optimization
 * - Adds artificial delay in dev to catch race conditions
 * - Helps identify slow database queries or external API calls
 * 
 * 🔧 Development Benefits:
 * - Simulates real-world network conditions
 * - Catches UI loading state issues
 * - Identifies performance bottlenecks early
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    // 🐌 Artificial delay in development (100-500ms)
    // Simulates network latency to catch loading state issues
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});

// =============================================================================
// 📡 PROCEDURE TYPES - API ENDPOINT BUILDERS
// =============================================================================

/**
 * 🌐 Public Procedure - Unauthenticated Endpoints
 * 
 * Base procedure for endpoints that don't require authentication:
 * - Landing page data (subscription plans, public content)
 * - Authentication endpoints (login, register)
 * - Public learning path previews
 * - Marketing and informational content
 * 
 * 🔒 Security Note: Session data is available if user is logged in,
 * but no authentication is enforced. Check `ctx.session` manually if needed.
 * 
 * @example
 * getPublicPaths: publicProcedure
 *   .query(async ({ ctx }) => {
 *     return ctx.db.query.learningPaths.findMany({
 *       where: eq(learningPaths.isPublic, true)
 *     });
 *   })
 */
export const publicProcedure = t.procedure.use(timingMiddleware);

/**
 * 🔐 Protected Procedure - Authenticated Endpoints
 * 
 * Secured procedure that requires valid user authentication:
 * - User dashboard and profile management
 * - Learning progress tracking
 * - AI tutoring sessions
 * - Subscription management
 * - Administrative functions
 * 
 * 🛡️ Security Features:
 * - Validates session existence and user data
 * - Throws UNAUTHORIZED error for invalid sessions
 * - Provides type-safe access to user information
 * - Infers non-nullable session in procedure context
 * 
 * 🎯 Context Enhancement:
 * After middleware, `ctx.session.user` is guaranteed to be non-null,
 * providing TypeScript safety and eliminating null checks.
 * 
 * @example
 * getUserProfile: protectedProcedure
 *   .query(async ({ ctx }) => {
 *     // ctx.session.user is guaranteed to exist
 *     return ctx.db.query.users.findFirst({
 *       where: eq(users.id, ctx.session.user.id)
 *     });
 *   })
 */
export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
      ctx: {
        // 🎯 Type inference: session.user is now non-nullable
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  });
