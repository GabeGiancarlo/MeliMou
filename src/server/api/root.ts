import { postRouter } from "~/server/api/routers/post";
import { learningPathRouter } from "~/server/api/routers/learning-path";
import { lessonRouter } from "~/server/api/routers/lesson";
import { chatRouter } from "~/server/api/routers/chat";
import { alertRouter } from "~/server/api/routers/alert";
import { resourceRouter } from "~/server/api/routers/resource";
import { tutorRouter } from "~/server/api/routers/tutor";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  learningPath: learningPathRouter,
  lesson: lessonRouter,
  chat: chatRouter,
  alert: alertRouter,
  resource: resourceRouter,
  tutor: tutorRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
