import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { alerts } from "~/server/db/schema";
import { eq, desc, and, or, isNull } from "drizzle-orm";

export const alertRouter = createTRPCRouter({
  getUserAlerts: protectedProcedure
    .input(z.object({ 
      limit: z.number().min(1).max(100).default(20),
      unreadOnly: z.boolean().default(false),
    }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new Error("User not authenticated");
      }

      const baseCondition = or(
        eq(alerts.targetUserId, ctx.session.user.id),
        isNull(alerts.targetUserId) // Global alerts
      );

      const whereCondition = input.unreadOnly 
        ? and(baseCondition, eq(alerts.isRead, false))
        : baseCondition;

      return ctx.db.query.alerts.findMany({
        where: whereCondition,
        orderBy: [desc(alerts.createdAt)],
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

  markAsRead: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new Error("User not authenticated");
      }

      return ctx.db
        .update(alerts)
        .set({ isRead: true })
        .where(and(
          eq(alerts.id, input.id),
          or(
            eq(alerts.targetUserId, ctx.session.user.id),
            isNull(alerts.targetUserId)
          )
        ))
        .returning();
    }),

  markAllAsRead: protectedProcedure
    .mutation(async ({ ctx }) => {
      if (!ctx.session?.user?.id) {
        throw new Error("User not authenticated");
      }

      return ctx.db
        .update(alerts)
        .set({ isRead: true })
        .where(or(
          eq(alerts.targetUserId, ctx.session.user.id),
          isNull(alerts.targetUserId)
        ));
    }),

  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1),
      content: z.string().min(1),
      type: z.enum(["system", "instructor", "achievement"]),
      targetUserId: z.string().optional(),
      cohortId: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new Error("User not authenticated");
      }

      return ctx.db.insert(alerts).values({
        ...input,
        createdById: ctx.session.user.id,
      }).returning();
    }),
}); 