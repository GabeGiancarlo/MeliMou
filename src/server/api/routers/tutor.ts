import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { tutorSessions, tutorMessages } from "~/server/db/schema";
import { eq, desc, and } from "drizzle-orm";

export const tutorRouter = createTRPCRouter({
  createSession: protectedProcedure
    .input(z.object({
      topic: z.string().optional(),
      formalityLevel: z.enum(["informal", "formal", "mixed"]),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new Error("User not authenticated");
      }

      // End any existing active sessions
      await ctx.db
        .update(tutorSessions)
        .set({ isActive: false })
        .where(and(
          eq(tutorSessions.userId, ctx.session.user.id),
          eq(tutorSessions.isActive, true)
        ));

      return ctx.db.insert(tutorSessions).values({
        userId: ctx.session.user.id,
        topic: input.topic,
        formalityLevel: input.formalityLevel,
        isActive: true,
      }).returning();
    }),

  getActiveSession: protectedProcedure
    .query(async ({ ctx }) => {
      if (!ctx.session?.user?.id) {
        throw new Error("User not authenticated");
      }

      return ctx.db.query.tutorSessions.findFirst({
        where: and(
          eq(tutorSessions.userId, ctx.session.user.id),
          eq(tutorSessions.isActive, true)
        ),
        with: {
          messages: {
            orderBy: [tutorMessages.createdAt],
          },
        },
      });
    }),

  sendMessage: protectedProcedure
    .input(z.object({
      sessionId: z.number(),
      content: z.string().min(1),
      audioUrl: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new Error("User not authenticated");
      }

      // Verify session belongs to user
      const session = await ctx.db.query.tutorSessions.findFirst({
        where: and(
          eq(tutorSessions.id, input.sessionId),
          eq(tutorSessions.userId, ctx.session.user.id)
        ),
      });

      if (!session) {
        throw new Error("Session not found or unauthorized");
      }

      // Insert user message
      const userMessage = await ctx.db.insert(tutorMessages).values({
        sessionId: input.sessionId,
        isFromUser: true,
        content: input.content,
        audioUrl: input.audioUrl,
      }).returning();

      // Update session message count
      await ctx.db
        .update(tutorSessions)
        .set({ 
          messagesCount: session.messagesCount + 1,
          updatedAt: new Date(),
        })
        .where(eq(tutorSessions.id, input.sessionId));

      // TODO: In a real implementation, this would call an AI service
      // For now, return a mock response
      const mockResponse = generateMockTutorResponse(input.content, session.formalityLevel);
      
      const tutorMessage = await ctx.db.insert(tutorMessages).values({
        sessionId: input.sessionId,
        isFromUser: false,
        content: mockResponse.content,
        feedback: mockResponse.feedback,
      }).returning();

      return {
        userMessage: userMessage[0],
        tutorMessage: tutorMessage[0],
      };
    }),

  endSession: protectedProcedure
    .input(z.object({ sessionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new Error("User not authenticated");
      }

      return ctx.db
        .update(tutorSessions)
        .set({ isActive: false })
        .where(and(
          eq(tutorSessions.id, input.sessionId),
          eq(tutorSessions.userId, ctx.session.user.id)
        ))
        .returning();
    }),

  getSessionHistory: protectedProcedure
    .input(z.object({ 
      limit: z.number().min(1).max(50).default(10),
    }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new Error("User not authenticated");
      }

      return ctx.db.query.tutorSessions.findMany({
        where: eq(tutorSessions.userId, ctx.session.user.id),
        orderBy: [desc(tutorSessions.createdAt)],
        limit: input.limit,
      });
    }),
});

// Mock tutor response generator - replace with real AI integration later
function generateMockTutorResponse(userInput: string, formalityLevel: string) {
  const responses = {
    informal: [
      "Καλά! That's a good start. Try saying it again with more confidence.",
      "Ωραία! You're getting better. Let me help you with the pronunciation.",
      "Μπράβο! Keep practicing, you're doing well!",
    ],
    formal: [
      "Εξαιρετικά. Your effort is commendable. Please continue with the exercise.",
      "Πολύ καλά. I suggest we focus on improving your accent.",
      "Συγχαρητήρια. Your progress is notable.",
    ],
    mixed: [
      "Good job! Καλή δουλειά! Let's work on that phrase together.",
      "That's right! Σωστά! Now try it with different intonation.",
      "Excellent! Τέλεια! You're improving quickly.",
    ],
  };

  const levelResponses = responses[formalityLevel as keyof typeof responses] || responses.mixed;
  const randomResponse = levelResponses[Math.floor(Math.random() * levelResponses.length)];

  return {
    content: randomResponse,
    feedback: {
      corrections: [],
      hints: ["Try speaking more slowly", "Focus on the accent"],
      encouragement: "Keep up the great work!",
    },
  };
} 