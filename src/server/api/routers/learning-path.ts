import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { learningPaths, modules, lessons } from "~/server/db/schema";
import { eq, desc } from "drizzle-orm";

export const learningPathRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.learningPaths.findMany({
      where: eq(learningPaths.isPublic, true),
      orderBy: [desc(learningPaths.createdAt)],
      with: {
        modules: {
          with: {
            lessons: true,
          },
        },
      },
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.learningPaths.findFirst({
        where: eq(learningPaths.id, input.id),
        with: {
          modules: {
            with: {
              lessons: true,
            },
            orderBy: [modules.orderIndex],
          },
        },
      });
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      difficulty: z.enum(["beginner", "intermediate", "advanced"]),
      isPublic: z.boolean().default(true),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(learningPaths).values(input).returning();
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(1).optional(),
      description: z.string().optional(),
      difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
      isPublic: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      return ctx.db
        .update(learningPaths)
        .set(updateData)
        .where(eq(learningPaths.id, id))
        .returning();
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.delete(learningPaths).where(eq(learningPaths.id, input.id));
    }),
}); 