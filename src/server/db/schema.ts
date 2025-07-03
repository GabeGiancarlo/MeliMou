import {
  relations,
  sql,
  InferSelectModel,
  InferInsertModel,
} from "drizzle-orm";
import {
  integer,
  text,
  sqliteTableCreator,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `melimou_${name}`);

// User table (extended)
export const users = createTable("user", {
  id: text("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name", { length: 255 }),
  email: text("email", { length: 255 }).notNull(),
  emailVerified: integer("email_verified", { mode: "timestamp" }),
  image: text("image", { length: 255 }),
  role: text("role", { enum: ["student", "instructor", "admin"] }).notNull().default("student"),
  formalityPreference: text("formality_preference", { enum: ["informal", "formal", "mixed"] }).default("mixed"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
});

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

// Learning Paths
export const learningPaths = createTable("learning_path", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name", { length: 255 }).notNull(),
  description: text("description"),
  difficulty: text("difficulty", { enum: ["beginner", "intermediate", "advanced"] }).notNull(),
  isPublic: integer("is_public", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
});

export type LearningPath = InferSelectModel<typeof learningPaths>;
export type NewLearningPath = InferInsertModel<typeof learningPaths>;

// Modules
export const modules = createTable("module", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  learningPathId: integer("learning_path_id")
    .notNull()
    .references(() => learningPaths.id),
  name: text("name", { length: 255 }).notNull(),
  description: text("description"),
  orderIndex: integer("order_index").notNull(),
  estimatedDuration: integer("estimated_duration"), // in minutes
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
});

export type Module = InferSelectModel<typeof modules>;
export type NewModule = InferInsertModel<typeof modules>;

// Lessons
export const lessons = createTable("lesson", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  moduleId: integer("module_id")
    .notNull()
    .references(() => modules.id),
  name: text("name", { length: 255 }).notNull(),
  description: text("description"),
  content: text("content", { mode: "json" }), // JSON structure for lesson content
  orderIndex: integer("order_index").notNull(),
  estimatedDuration: integer("estimated_duration"), // in minutes
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
});

export type Lesson = InferSelectModel<typeof lessons>;
export type NewLesson = InferInsertModel<typeof lessons>;

// Cohorts
export const cohorts = createTable("cohort", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name", { length: 255 }).notNull(),
  description: text("description"),
  learningPathId: integer("learning_path_id")
    .notNull()
    .references(() => learningPaths.id),
  instructorId: text("instructor_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  startDate: integer("start_date", { mode: "timestamp" }),
  endDate: integer("end_date", { mode: "timestamp" }),
  maxStudents: integer("max_students").default(30),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
});

export type Cohort = InferSelectModel<typeof cohorts>;
export type NewCohort = InferInsertModel<typeof cohorts>;

// Cohort Members
export const cohortMembers = createTable(
  "cohort_member",
  {
    cohortId: integer("cohort_id")
      .notNull()
      .references(() => cohorts.id),
    userId: text("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    joinedAt: integer("joined_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.cohortId, table.userId] }),
  }),
);

export type CohortMember = InferSelectModel<typeof cohortMembers>;
export type NewCohortMember = InferInsertModel<typeof cohortMembers>;

// User Progress
export const userProgress = createTable("user_progress", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  lessonId: integer("lesson_id")
    .notNull()
    .references(() => lessons.id),
  isCompleted: integer("is_completed", { mode: "boolean" }).notNull().default(false),
  score: integer("score"), // 0-100
  timeSpent: integer("time_spent"), // in minutes
  completedAt: integer("completed_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
});

export type UserProgress = InferSelectModel<typeof userProgress>;
export type NewUserProgress = InferInsertModel<typeof userProgress>;

// Messages (for chat)
export const messages = createTable("message", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  senderId: text("sender_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  content: text("content").notNull(),
  channelId: text("channel_id", { length: 255 }),
  messageType: text("message_type", { enum: ["text", "voice", "image"] }).notNull().default("text"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
});

export type Message = InferSelectModel<typeof messages>;
export type NewMessage = InferInsertModel<typeof messages>;

// Resources
export const resources = createTable("resource", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title", { length: 255 }).notNull(),
  description: text("description"),
  content: text("content", { mode: "json" }),
  resourceType: text("resource_type", { length: 100 }).notNull(),
  difficulty: text("difficulty", { enum: ["beginner", "intermediate", "advanced"] }).notNull(),
  tags: text("tags", { mode: "json" }), // JSON array of tags
  isPublic: integer("is_public", { mode: "boolean" }).notNull().default(true),
  createdBy: text("created_by", { length: 255 })
    .notNull()
    .references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
});

export type Resource = InferSelectModel<typeof resources>;
export type NewResource = InferInsertModel<typeof resources>;

// Alerts
export const alerts = createTable("alert", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  title: text("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  alertType: text("alert_type", { enum: ["system", "instructor", "achievement"] }).notNull(),
  isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
});

export type Alert = InferSelectModel<typeof alerts>;
export type NewAlert = InferInsertModel<typeof alerts>;

// Tutor Sessions
export const tutorSessions = createTable("tutor_session", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  topic: text("topic", { length: 255 }),
  formalityLevel: text("formality_level", { enum: ["informal", "formal", "mixed"] }).notNull().default("mixed"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
});

export type TutorSession = InferSelectModel<typeof tutorSessions>;
export type NewTutorSession = InferInsertModel<typeof tutorSessions>;

// Tutor Messages
export const tutorMessages = createTable("tutor_message", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sessionId: integer("session_id")
    .notNull()
    .references(() => tutorSessions.id),
  content: text("content").notNull(),
  isFromUser: integer("is_from_user", { mode: "boolean" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
});

export type TutorMessage = InferSelectModel<typeof tutorMessages>;
export type NewTutorMessage = InferInsertModel<typeof tutorMessages>;

// NextAuth.js Tables
export const accounts = createTable(
  "account",
  {
    userId: text("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: text("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: text("provider", { length: 255 }).notNull(),
    providerAccountId: text("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type", { length: 255 }),
    scope: text("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: text("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = createTable("session", {
  sessionToken: text("session_token", { length: 255 }).notNull().primaryKey(),
  userId: text("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  expires: integer("expires", { mode: "timestamp" }).notNull(),
});

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: text("identifier", { length: 255 }).notNull(),
    token: text("token", { length: 255 }).notNull(),
    expires: integer("expires", { mode: "timestamp" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

// Posts table (for the existing post functionality)
export const posts = createTable("post", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name", { length: 256 }),
  createdBy: text("created_by", { length: 255 })
    .notNull()
    .references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
});

export type Post = InferSelectModel<typeof posts>;
export type NewPost = InferInsertModel<typeof posts>;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  posts: many(posts),
  alerts: many(alerts),
  tutorSessions: many(tutorSessions),
  userProgress: many(userProgress),
  messages: many(messages),
  resources: many(resources),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  createdBy: one(users, {
    fields: [posts.createdBy],
    references: [users.id],
  }),
}));

export const learningPathsRelations = relations(learningPaths, ({ many }) => ({
  modules: many(modules),
  cohorts: many(cohorts),
}));

export const modulesRelations = relations(modules, ({ one, many }) => ({
  learningPath: one(learningPaths, {
    fields: [modules.learningPathId],
    references: [learningPaths.id],
  }),
  lessons: many(lessons),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  module: one(modules, {
    fields: [lessons.moduleId],
    references: [modules.id],
  }),
  userProgress: many(userProgress),
}));

export const cohortsRelations = relations(cohorts, ({ one, many }) => ({
  learningPath: one(learningPaths, {
    fields: [cohorts.learningPathId],
    references: [learningPaths.id],
  }),
  instructor: one(users, {
    fields: [cohorts.instructorId],
    references: [users.id],
  }),
  cohortMembers: many(cohortMembers),
}));

export const cohortMembersRelations = relations(cohortMembers, ({ one }) => ({
  cohort: one(cohorts, {
    fields: [cohortMembers.cohortId],
    references: [cohorts.id],
  }),
  user: one(users, {
    fields: [cohortMembers.userId],
    references: [users.id],
  }),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
  lesson: one(lessons, {
    fields: [userProgress.lessonId],
    references: [lessons.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}));

export const resourcesRelations = relations(resources, ({ one }) => ({
  createdBy: one(users, {
    fields: [resources.createdBy],
    references: [users.id],
  }),
}));

export const alertsRelations = relations(alerts, ({ one }) => ({
  user: one(users, {
    fields: [alerts.userId],
    references: [users.id],
  }),
}));

export const tutorSessionsRelations = relations(tutorSessions, ({ one, many }) => ({
  user: one(users, {
    fields: [tutorSessions.userId],
    references: [users.id],
  }),
  tutorMessages: many(tutorMessages),
}));

export const tutorMessagesRelations = relations(tutorMessages, ({ one }) => ({
  session: one(tutorSessions, {
    fields: [tutorMessages.sessionId],
    references: [tutorSessions.id],
  }),
}));
