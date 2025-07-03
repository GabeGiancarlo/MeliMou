import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { subscriptionPlans, userSubscriptions, users } from "~/server/db/schema";
import { eq, and, desc } from "drizzle-orm";

export const subscriptionRouter = createTRPCRouter({
  // Get all available subscription plans
  getPlans: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.subscriptionPlans.findMany({
      where: eq(subscriptionPlans.isActive, true),
      orderBy: [subscriptionPlans.price],
    });
  }),

  // Get user's current subscription
  getCurrentSubscription: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user?.id) {
      throw new Error("User not authenticated");
    }

    return ctx.db.query.userSubscriptions.findFirst({
      where: and(
        eq(userSubscriptions.userId, ctx.session.user.id),
        eq(userSubscriptions.status, "active")
      ),
      with: {
        plan: true,
      },
      orderBy: [desc(userSubscriptions.createdAt)],
    });
  }),

  // Get subscription history
  getSubscriptionHistory: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user?.id) {
      throw new Error("User not authenticated");
    }

    return ctx.db.query.userSubscriptions.findMany({
      where: eq(userSubscriptions.userId, ctx.session.user.id),
      with: {
        plan: true,
      },
      orderBy: [desc(userSubscriptions.createdAt)],
    });
  }),

  // Create checkout session (placeholder for Stripe integration)
  createCheckoutSession: protectedProcedure
    .input(z.object({
      planId: z.number(),
      successUrl: z.string().url(),
      cancelUrl: z.string().url(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new Error("User not authenticated");
      }

      // Get the plan
      const plan = await ctx.db.query.subscriptionPlans.findFirst({
        where: eq(subscriptionPlans.id, input.planId),
      });

      if (!plan) {
        throw new Error("Plan not found");
      }

      // In a real implementation, this would create a Stripe checkout session
      // For now, we'll return a mock checkout URL
      return {
        checkoutUrl: `/checkout/mock?planId=${plan.id}&userId=${ctx.session.user.id}`,
        sessionId: `mock_session_${Date.now()}`,
      };
    }),

  // Simulate successful subscription (for development)
  activateSubscription: protectedProcedure
    .input(z.object({
      planId: z.number(),
      stripeSubscriptionId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new Error("User not authenticated");
      }

      const plan = await ctx.db.query.subscriptionPlans.findFirst({
        where: eq(subscriptionPlans.id, input.planId),
      });

      if (!plan) {
        throw new Error("Plan not found");
      }

      // Deactivate any existing active subscriptions
      await ctx.db
        .update(userSubscriptions)
        .set({ status: "inactive" })
        .where(and(
          eq(userSubscriptions.userId, ctx.session.user.id),
          eq(userSubscriptions.status, "active")
        ));

      // Calculate subscription period
      const now = new Date();
      const periodEnd = new Date(now);
      if (plan.intervalType === "month") {
        periodEnd.setMonth(periodEnd.getMonth() + plan.intervalCount);
      } else {
        periodEnd.setFullYear(periodEnd.getFullYear() + plan.intervalCount);
      }

      // Create new subscription
      const subscription = await ctx.db.insert(userSubscriptions).values({
        userId: ctx.session.user.id,
        planId: input.planId,
        stripeSubscriptionId: input.stripeSubscriptionId || `mock_sub_${Date.now()}`,
        status: "active",
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
      }).returning();

      // Update user subscription tier
      const tierMap: Record<string, "free" | "pro" | "premium"> = {
        "Free": "free",
        "Pro": "pro", 
        "Premium": "premium",
      };
      
      const subscriptionTier = tierMap[plan.name] || "free";

      await ctx.db
        .update(users)
        .set({ 
          subscriptionTier,
          subscriptionStatus: "active",
          subscriptionStartDate: now,
          subscriptionEndDate: periodEnd,
        })
        .where(eq(users.id, ctx.session.user.id));

      return subscription[0];
    }),

  // Cancel subscription
  cancelSubscription: protectedProcedure
    .input(z.object({
      subscriptionId: z.number(),
      cancelAtPeriodEnd: z.boolean().default(true),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new Error("User not authenticated");
      }

      // Verify subscription belongs to user
      const subscription = await ctx.db.query.userSubscriptions.findFirst({
        where: and(
          eq(userSubscriptions.id, input.subscriptionId),
          eq(userSubscriptions.userId, ctx.session.user.id)
        ),
      });

      if (!subscription) {
        throw new Error("Subscription not found or unauthorized");
      }

      // Update subscription
      const updatedSubscription = await ctx.db
        .update(userSubscriptions)
        .set({
          cancelAtPeriodEnd: input.cancelAtPeriodEnd,
          status: input.cancelAtPeriodEnd ? "active" : "cancelled",
        })
        .where(eq(userSubscriptions.id, input.subscriptionId))
        .returning();

      // If cancelling immediately, update user tier
      if (!input.cancelAtPeriodEnd) {
        await ctx.db
          .update(users)
          .set({
            subscriptionTier: "free",
            subscriptionStatus: "cancelled",
          })
          .where(eq(users.id, ctx.session.user.id));
      }

      return updatedSubscription[0];
    }),

  // Get subscription features/limits for current user
  getSubscriptionLimits: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user?.id) {
      throw new Error("User not authenticated");
    }

    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.session.user.id),
      columns: {
        subscriptionTier: true,
      },
    });

    const subscription = await ctx.db.query.userSubscriptions.findFirst({
      where: and(
        eq(userSubscriptions.userId, ctx.session.user.id),
        eq(userSubscriptions.status, "active")
      ),
      with: {
        plan: true,
      },
    });

    // Default limits for free tier
    let limits = {
      maxSessions: 3, // per month
      maxResources: 10,
      canAccessCohorts: false,
      canAccessPremiumContent: false,
      hasAITutor: false,
      supportLevel: "community",
    };

    if (user?.subscriptionTier === "pro") {
      limits = {
        maxSessions: subscription?.plan?.maxSessions || 50,
        maxResources: subscription?.plan?.maxResources || 100,
        canAccessCohorts: true,
        canAccessPremiumContent: false,
        hasAITutor: true,
        supportLevel: "email",
      };
    } else if (user?.subscriptionTier === "premium") {
      limits = {
        maxSessions: -1, // unlimited
        maxResources: -1, // unlimited
        canAccessCohorts: true,
        canAccessPremiumContent: true,
        hasAITutor: true,
        supportLevel: "priority",
      };
    }

    return {
      currentTier: user?.subscriptionTier || "free",
      limits,
      subscription,
    };
  }),
}); 