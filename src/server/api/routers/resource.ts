import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { resources } from "~/server/db/schema";
import { eq, desc, ilike, and } from "drizzle-orm";

export const resourceRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ 
      limit: z.number().min(1).max(100).default(20),
      search: z.string().optional(),
      difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
      tags: z.array(z.string()).optional(),
    }))
    .query(async ({ ctx, input }) => {
      let whereConditions = [];

      if (input.search) {
        whereConditions.push(
          ilike(resources.title, `%${input.search}%`)
        );
      }

      if (input.difficulty) {
        whereConditions.push(eq(resources.difficulty, input.difficulty));
      }

      const whereCondition = whereConditions.length > 0 
        ? and(...whereConditions) 
        : undefined;

      return ctx.db.query.resources.findMany({
        where: whereCondition,
        orderBy: [desc(resources.createdAt)],
        limit: input.limit,
        with: {
          createdBy: {
            columns: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.resources.findFirst({
        where: eq(resources.id, input.id),
        with: {
          createdBy: {
            columns: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });
    }),

  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      url: z.string().url().optional(),
      fileUrl: z.string().url().optional(),
      tags: z.array(z.string()).optional(),
      difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new Error("User not authenticated");
      }

      return ctx.db.insert(resources).values({
        ...input,
        createdById: ctx.session.user.id,
      }).returning();
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().min(1).optional(),
      description: z.string().optional(),
      url: z.string().url().optional(),
      fileUrl: z.string().url().optional(),
      tags: z.array(z.string()).optional(),
      difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new Error("User not authenticated");
      }

      const { id, ...updateData } = input;
      
      // Check if user owns the resource or is admin
      const resource = await ctx.db.query.resources.findFirst({
        where: eq(resources.id, id),
      });

      if (!resource || resource.createdById !== ctx.session.user.id) {
        throw new Error("Unauthorized to update this resource");
      }

      return ctx.db
        .update(resources)
        .set(updateData)
        .where(eq(resources.id, id))
        .returning();
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new Error("User not authenticated");
      }

      // Check if user owns the resource or is admin
      const resource = await ctx.db.query.resources.findFirst({
        where: eq(resources.id, input.id),
      });

      if (!resource || resource.createdById !== ctx.session.user.id) {
        throw new Error("Unauthorized to delete this resource");
      }

      return ctx.db.delete(resources).where(eq(resources.id, input.id));
    }),

  getTags: publicProcedure.query(async ({ ctx }) => {
    const allResources = await ctx.db.query.resources.findMany({
      columns: {
        tags: true,
      },
    });

    const allTags = new Set<string>();
    allResources.forEach(resource => {
      if (resource.tags && Array.isArray(resource.tags)) {
        resource.tags.forEach(tag => allTags.add(tag));
      }
    });

    return Array.from(allTags);
  }),
}); 