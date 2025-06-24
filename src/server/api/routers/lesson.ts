import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { lessons, userProgress } from "~/server/db/schema";
import { eq, desc, and } from "drizzle-orm";

export const lessonRouter = createTRPCRouter({
  getByModuleId: publicProcedure
    .input(z.object({ moduleId: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.lessons.findMany({
        where: eq(lessons.moduleId, input.moduleId),
        orderBy: [lessons.orderIndex],
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.lessons.findFirst({
        where: eq(lessons.id, input.id),
        with: {
          module: {
            with: {
              learningPath: true,
            },
          },
        },
      });
    }),

  create: protectedProcedure
    .input(z.object({
      moduleId: z.number(),
      name: z.string().min(1),
      description: z.string().optional(),
      content: z.any().optional(),
      orderIndex: z.number(),
      estimatedDuration: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(lessons).values(input).returning();
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(1).optional(),
      description: z.string().optional(),
      content: z.any().optional(),
      orderIndex: z.number().optional(),
      estimatedDuration: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      return ctx.db
        .update(lessons)
        .set(updateData)
        .where(eq(lessons.id, id))
        .returning();
    }),

  markComplete: protectedProcedure
    .input(z.object({
      lessonId: z.number(),
      score: z.number().min(0).max(100).optional(),
      timeSpent: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new Error("User not authenticated");
      }

      const existingProgress = await ctx.db.query.userProgress.findFirst({
        where: and(
          eq(userProgress.userId, ctx.session.user.id),
          eq(userProgress.lessonId, input.lessonId)
        ),
      });

      if (existingProgress) {
        return ctx.db
          .update(userProgress)
          .set({
            isCompleted: true,
            score: input.score,
            timeSpent: input.timeSpent,
            completedAt: new Date(),
          })
          .where(eq(userProgress.id, existingProgress.id))
          .returning();
      } else {
        return ctx.db.insert(userProgress).values({
          userId: ctx.session.user.id,
          lessonId: input.lessonId,
          isCompleted: true,
          score: input.score,
          timeSpent: input.timeSpent,
          completedAt: new Date(),
        }).returning();
      }
    }),

  getUserProgress: protectedProcedure
    .input(z.object({ lessonId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new Error("User not authenticated");
      }

      return ctx.db.query.userProgress.findFirst({
        where: and(
          eq(userProgress.userId, ctx.session.user.id),
          eq(userProgress.lessonId, input.lessonId)
        ),
      });
    }),
}); 