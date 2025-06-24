import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { messages } from "~/server/db/schema";
import { eq, desc, and, isNull } from "drizzle-orm";

export const chatRouter = createTRPCRouter({
  getMessages: publicProcedure
    .input(z.object({ 
      cohortId: z.number().optional(),
      limit: z.number().min(1).max(100).default(50),
    }))
    .query(async ({ ctx, input }) => {
      const whereCondition = input.cohortId 
        ? eq(messages.cohortId, input.cohortId)
        : isNull(messages.cohortId);

      return ctx.db.query.messages.findMany({
        where: whereCondition,
        orderBy: [desc(messages.createdAt)],
        limit: input.limit,
        with: {
          sender: {
            columns: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });
    }),

  sendMessage: protectedProcedure
    .input(z.object({
      content: z.string().min(1),
      cohortId: z.number().optional(),
      type: z.enum(["text", "voice", "image"]).default("text"),
      metadata: z.any().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new Error("User not authenticated");
      }

      return ctx.db.insert(messages).values({
        senderId: ctx.session.user.id,
        content: input.content,
        cohortId: input.cohortId,
        type: input.type,
        metadata: input.metadata,
      }).returning();
    }),

  deleteMessage: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new Error("User not authenticated");
      }

      // Check if user owns the message or is admin
      const message = await ctx.db.query.messages.findFirst({
        where: eq(messages.id, input.id),
      });

      if (!message || (message.senderId !== ctx.session.user.id)) {
        throw new Error("Unauthorized to delete this message");
      }

      return ctx.db.delete(messages).where(eq(messages.id, input.id));
    }),
}); 