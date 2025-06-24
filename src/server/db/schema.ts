import {
  relations,
  sql,
  InferSelectModel,
  InferInsertModel,
} from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  json,
  pgEnum,
  pgTableCreator,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `melimou_${name}`);

// Enums
export const userRoleEnum = pgEnum("user_role", ["student", "instructor", "admin"]);
export const difficultyEnum = pgEnum("difficulty_level", ["beginner", "intermediate", "advanced"]);
export const alertTypeEnum = pgEnum("alert_type", ["system", "instructor", "achievement"]);
export const messageTypeEnum = pgEnum("message_type", ["text", "voice", "image"]);
export const formalityLevelEnum = pgEnum("formality_level", ["informal", "formal", "mixed"]);

// User table (extended)
export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
  role: userRoleEnum("role").notNull().default("student"),
  formalityPreference: formalityLevelEnum("formality_preference").default("mixed"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

// Learning Paths
export const learningPaths = createTable("learning_path", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  difficulty: difficultyEnum("difficulty").notNull(),
  isPublic: boolean("is_public").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export type LearningPath = InferSelectModel<typeof learningPaths>;
export type NewLearningPath = InferInsertModel<typeof learningPaths>;

// Modules
export const modules = createTable("module", {
  id: serial("id").primaryKey(),
  learningPathId: integer("learning_path_id")
    .notNull()
    .references(() => learningPaths.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  orderIndex: integer("order_index").notNull(),
  estimatedDuration: integer("estimated_duration"), // in minutes
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export type Module = InferSelectModel<typeof modules>;
export type NewModule = InferInsertModel<typeof modules>;

// Lessons
export const lessons = createTable("lesson", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id")
    .notNull()
    .references(() => modules.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  content: json("content"), // JSON structure for lesson content
  orderIndex: integer("order_index").notNull(),
  estimatedDuration: integer("estimated_duration"), // in minutes
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export type Lesson = InferSelectModel<typeof lessons>;
export type NewLesson = InferInsertModel<typeof lessons>;

// Cohorts
export const cohorts = createTable("cohort", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  learningPathId: integer("learning_path_id")
    .notNull()
    .references(() => learningPaths.id),
  instructorId: varchar("instructor_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  startDate: timestamp("start_date", { withTimezone: true }),
  endDate: timestamp("end_date", { withTimezone: true }),
  maxStudents: integer("max_students").default(30),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
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
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
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
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  lessonId: integer("lesson_id")
    .notNull()
    .references(() => lessons.id),
  isCompleted: boolean("is_completed").notNull().default(false),
  score: integer("score"), // 0-100
  timeSpent: integer("time_spent"), // in minutes
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export type UserProgress = InferSelectModel<typeof userProgress>;
export type NewUserProgress = InferInsertModel<typeof userProgress>;

// Messages (for chat)
export const messages = createTable("message", {
  id: serial("id").primaryKey(),
  senderId: varchar("sender_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  cohortId: integer("cohort_id")
    .references(() => cohorts.id), // null for general chat
  content: text("content").notNull(),
  type: messageTypeEnum("type").notNull().default("text"),
  metadata: json("metadata"), // for voice files, images, etc.
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type Message = InferSelectModel<typeof messages>;
export type NewMessage = InferInsertModel<typeof messages>;

// Resources
export const resources = createTable("resource", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  url: varchar("url", { length: 500 }),
  fileUrl: varchar("file_url", { length: 500 }),
  tags: json("tags").$type<string[]>(), // Array of tags
  difficulty: difficultyEnum("difficulty"),
  createdById: varchar("created_by", { length: 255 })
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export type Resource = InferSelectModel<typeof resources>;
export type NewResource = InferInsertModel<typeof resources>;

// Alerts
export const alerts = createTable("alert", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  type: alertTypeEnum("type").notNull(),
  targetUserId: varchar("target_user_id", { length: 255 })
    .references(() => users.id), // null for global alerts
  cohortId: integer("cohort_id")
    .references(() => cohorts.id), // null for non-cohort alerts
  createdById: varchar("created_by", { length: 255 })
    .notNull()
    .references(() => users.id),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type Alert = InferSelectModel<typeof alerts>;
export type NewAlert = InferInsertModel<typeof alerts>;

// Conversational Tutor Sessions
export const tutorSessions = createTable("tutor_session", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  topic: varchar("topic", { length: 255 }),
  formalityLevel: formalityLevelEnum("formality_level").notNull(),
  messagesCount: integer("messages_count").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export type TutorSession = InferSelectModel<typeof tutorSessions>;
export type NewTutorSession = InferInsertModel<typeof tutorSessions>;

// Tutor Messages
export const tutorMessages = createTable("tutor_message", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id")
    .notNull()
    .references(() => tutorSessions.id),
  isFromUser: boolean("is_from_user").notNull(),
  content: text("content").notNull(),
  audioUrl: varchar("audio_url", { length: 500 }), // for voice messages
  feedback: json("feedback"), // corrections, hints, etc.
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type TutorMessage = InferSelectModel<typeof tutorMessages>;
export type NewTutorMessage = InferInsertModel<typeof tutorMessages>;

// Legacy posts table (keeping for now)
export const posts = createTable(
  "post",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    createdById: varchar("created_by", { length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    createdByIdIdx: index("created_by_idx").on(example.createdById),
    nameIndex: index("name_idx").on(example.name),
  }),
);

export type Post = InferSelectModel<typeof posts>;
export type NewPost = InferInsertModel<typeof posts>;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  posts: many(posts),
  userProgress: many(userProgress),
  sentMessages: many(messages),
  createdResources: many(resources),
  createdAlerts: many(alerts),
  tutorSessions: many(tutorSessions),
  cohortMemberships: many(cohortMembers),
  instructedCohorts: many(cohorts),
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
  members: many(cohortMembers),
  messages: many(messages),
  alerts: many(alerts),
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
  cohort: one(cohorts, {
    fields: [messages.cohortId],
    references: [cohorts.id],
  }),
}));

export const resourcesRelations = relations(resources, ({ one }) => ({
  createdBy: one(users, {
    fields: [resources.createdById],
    references: [users.id],
  }),
}));

export const alertsRelations = relations(alerts, ({ one }) => ({
  targetUser: one(users, {
    fields: [alerts.targetUserId],
    references: [users.id],
  }),
  cohort: one(cohorts, {
    fields: [alerts.cohortId],
    references: [cohorts.id],
  }),
  createdBy: one(users, {
    fields: [alerts.createdById],
    references: [users.id],
  }),
}));

export const tutorSessionsRelations = relations(tutorSessions, ({ one, many }) => ({
  user: one(users, {
    fields: [tutorSessions.userId],
    references: [users.id],
  }),
  messages: many(tutorMessages),
}));

export const tutorMessagesRelations = relations(tutorMessages, ({ one }) => ({
  session: one(tutorSessions, {
    fields: [tutorMessages.sessionId],
    references: [tutorSessions.id],
  }),
}));

// Auth tables (existing)
export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);
