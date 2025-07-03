import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { users, onboardingResponses, userSubscriptions } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";

export const userRouter = createTRPCRouter({
  // Get current user profile
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user?.id) {
      throw new Error("User not authenticated");
    }

    return ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.session.user.id),
      with: {
        subscriptions: {
          with: {
            plan: true,
          },
        },
      },
    });
  }),

  // Complete onboarding
  completeOnboarding: protectedProcedure
    .input(z.object({
      role: z.enum(["student", "instructor"]),
      greekLevel: z.enum(["absolute_beginner", "beginner", "elementary", "intermediate", "advanced", "native"]),
      learningGoals: z.array(z.string()).min(1),
      studyTimePerWeek: z.number().min(1).max(50),
      previousExperience: z.string().optional(),
      interests: z.array(z.string()).optional(),
      howHeardAboutUs: z.string().optional(),
      wantsPracticeTest: z.boolean().default(false),
      formalityPreference: z.enum(["informal", "formal", "mixed"]).default("mixed"),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new Error("User not authenticated");
      }

      // Update user profile
      const updatedUser = await ctx.db
        .update(users)
        .set({
          role: input.role,
          greekLevel: input.greekLevel,
          learningGoals: input.learningGoals,
          studyTimePerWeek: input.studyTimePerWeek,
          previousExperience: input.previousExperience,
          interests: input.interests || [],
          howHeardAboutUs: input.howHeardAboutUs,
          wantsPracticeTest: input.wantsPracticeTest,
          formalityPreference: input.formalityPreference,
          hasCompletedOnboarding: true,
        })
        .where(eq(users.id, ctx.session.user.id))
        .returning();

      // Store detailed onboarding responses for analytics
      const responses = [
        { questionKey: "role", response: input.role },
        { questionKey: "greek_level", response: input.greekLevel },
        { questionKey: "learning_goals", response: input.learningGoals },
        { questionKey: "study_time_per_week", response: input.studyTimePerWeek },
        { questionKey: "previous_experience", response: input.previousExperience || "" },
        { questionKey: "interests", response: input.interests || [] },
        { questionKey: "how_heard_about_us", response: input.howHeardAboutUs || "" },
        { questionKey: "wants_practice_test", response: input.wantsPracticeTest },
        { questionKey: "formality_preference", response: input.formalityPreference },
      ];

      for (const response of responses) {
        await ctx.db.insert(onboardingResponses).values({
          userId: ctx.session.user.id,
          questionKey: response.questionKey,
          response: response.response,
        });
      }

      return updatedUser[0];
    }),

  // Update profile
  updateProfile: protectedProcedure
    .input(z.object({
      name: z.string().optional(),
      greekLevel: z.enum(["absolute_beginner", "beginner", "elementary", "intermediate", "advanced", "native"]).optional(),
      learningGoals: z.array(z.string()).optional(),
      studyTimePerWeek: z.number().min(1).max(50).optional(),
      interests: z.array(z.string()).optional(),
      formalityPreference: z.enum(["informal", "formal", "mixed"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new Error("User not authenticated");
      }

      return ctx.db
        .update(users)
        .set(input)
        .where(eq(users.id, ctx.session.user.id))
        .returning();
    }),

  // Check onboarding status
  getOnboardingStatus: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user?.id) {
      throw new Error("User not authenticated");
    }

    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.session.user.id),
      columns: {
        hasCompletedOnboarding: true,
        role: true,
        subscriptionTier: true,
      },
    });

    return {
      hasCompletedOnboarding: user?.hasCompletedOnboarding || false,
      role: user?.role || "student",
      subscriptionTier: user?.subscriptionTier || "free",
    };
  }),

  // Get user analytics for instructors/admins
  getUserAnalytics: protectedProcedure
    .input(z.object({
      userId: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new Error("User not authenticated");
      }

      // Only allow admins or the user themselves to view analytics
      const targetUserId = input.userId || ctx.session.user.id;
      if (targetUserId !== ctx.session.user.id) {
        const currentUser = await ctx.db.query.users.findFirst({
          where: eq(users.id, ctx.session.user.id),
          columns: { role: true },
        });
        
        if (currentUser?.role !== "admin") {
          throw new Error("Unauthorized to view user analytics");
        }
      }

      const responses = await ctx.db.query.onboardingResponses.findMany({
        where: eq(onboardingResponses.userId, targetUserId),
      });

      return responses;
    }),
}); 