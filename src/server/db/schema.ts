import {
  relations,
  sql,
  InferSelectModel,
  InferInsertModel,
} from "drizzle-orm";
import {
  integer,
  text,
  timestamp,
  boolean,
  json,
  serial,
  pgTableCreator,
  primaryKey,
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

// User table (extended with onboarding and subscription data)
export const users = createTable("user", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("email_verified"),
  image: text("image"),
  password: text("password"), // For email/password authentication
  role: text("role", { enum: ["student", "instructor", "admin"] }).notNull().default("student"),
  formalityPreference: text("formality_preference", { enum: ["informal", "formal", "mixed"] }).default("mixed"),
  
  // Personal information
  age: integer("age"),
  gender: text("gender", { enum: ["male", "female", "non_binary", "prefer_not_to_say"] }),
  dateOfBirth: timestamp("date_of_birth"),
  
  // Onboarding information
  hasCompletedOnboarding: boolean("has_completed_onboarding").notNull().default(false),
  greekLevel: text("greek_level", { enum: ["absolute_beginner", "beginner", "elementary", "intermediate", "advanced", "native"] }),
  learningGoals: json("learning_goals"), // Array of goals
  studyTimePerWeek: integer("study_time_per_week"), // Hours per week
  previousExperience: text("previous_experience"),
  interests: json("interests"), // Array of interests
  howHeardAboutUs: text("how_heard_about_us"),
  wantsPracticeTest: boolean("wants_practice_test").default(false),
  
  // Subscription information  
  subscriptionTier: text("subscription_tier", { enum: ["free", "pro", "premium"] }).notNull().default("free"),
  subscriptionStatus: text("subscription_status", { enum: ["active", "inactive", "cancelled", "past_due"] }).default("active"),
  subscriptionStartDate: timestamp("subscription_start_date"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  stripeCustomerId: text("stripe_customer_id"),
  
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(
    () => new Date(),
  ),
});

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

// Subscription Plans
export const subscriptionPlans = createTable("subscription_plan", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  price: integer("price").notNull(), // Price in cents
  currency: varchar("currency", { length: 3 }).notNull().default("USD"),
  intervalType: text("interval_type", { enum: ["month", "year"] }).notNull(),
  intervalCount: integer("interval_count").notNull().default(1),
  stripePriceId: text("stripe_price_id"),
  features: json("features"), // Array of features
  maxSessions: integer("max_sessions").default(-1), // -1 = unlimited
  maxResources: integer("max_resources").default(-1),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type SubscriptionPlan = InferSelectModel<typeof subscriptionPlans>;
export type NewSubscriptionPlan = InferInsertModel<typeof subscriptionPlans>;

// User Subscriptions
export const userSubscriptions = createTable("user_subscription", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  planId: integer("plan_id")
    .notNull()
    .references(() => subscriptionPlans.id),
  stripeSubscriptionId: text("stripe_subscription_id"),
  status: text("status", { enum: ["active", "inactive", "cancelled", "past_due", "trialing"] }).notNull(),
  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(
    () => new Date(),
  ),
});

export type UserSubscription = InferSelectModel<typeof userSubscriptions>;
export type NewUserSubscription = InferInsertModel<typeof userSubscriptions>;

// Onboarding Responses (for analytics and personalization)
export const onboardingResponses = createTable("onboarding_response", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  questionKey: varchar("question_key", { length: 100 }).notNull(),
  response: json("response").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type OnboardingResponse = InferSelectModel<typeof onboardingResponses>;
export type NewOnboardingResponse = InferInsertModel<typeof onboardingResponses>;

// Learning Paths
export const learningPaths = createTable("learning_path", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  difficulty: text("difficulty", { enum: ["beginner", "intermediate", "advanced"] }).notNull(),
  isPublic: boolean("is_public").notNull().default(true),
  requiredSubscriptionTier: text("required_subscription_tier", { enum: ["free", "pro", "premium"] }).default("free"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(
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
  name: text("name").notNull(),
  description: text("description"),
  orderIndex: integer("order_index").notNull(),
  estimatedDuration: integer("estimated_duration"), // in minutes
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(
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
  name: text("name").notNull(),
  description: text("description"),
  content: json("content"), // JSON structure for lesson content
  orderIndex: integer("order_index").notNull(),
  estimatedDuration: integer("estimated_duration"), // in minutes
  requiredSubscriptionTier: text("required_subscription_tier", { enum: ["free", "pro", "premium"] }).default("free"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(
    () => new Date(),
  ),
});

export type Lesson = InferSelectModel<typeof lessons>;
export type NewLesson = InferInsertModel<typeof lessons>;

// Cohorts
export const cohorts = createTable("cohort", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  maxMembers: integer("max_members").default(50),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(
    () => new Date(),
  ),
});

export type Cohort = InferSelectModel<typeof cohorts>;
export type NewCohort = InferInsertModel<typeof cohorts>;

// Cohort Members
export const cohortMembers = createTable("cohort_member", {
  id: serial("id").primaryKey(),
  cohortId: integer("cohort_id")
    .notNull()
    .references(() => cohorts.id),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  joinedAt: timestamp("joined_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  role: text("role", { enum: ["member", "leader", "instructor"] }).notNull().default("member"),
  isActive: boolean("is_active").notNull().default(true),
});

export type CohortMember = InferSelectModel<typeof cohortMembers>;
export type NewCohortMember = InferInsertModel<typeof cohortMembers>;

// User Progress
export const userProgress = createTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  lessonId: integer("lesson_id")
    .notNull()
    .references(() => lessons.id),
  status: text("status", { enum: ["not_started", "in_progress", "completed"] }).notNull().default("not_started"),
  completedAt: timestamp("completed_at"),
  score: integer("score"), // Percentage score if applicable
  timeSpent: integer("time_spent"), // Time spent in minutes
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(
    () => new Date(),
  ),
});

export type UserProgress = InferSelectModel<typeof userProgress>;
export type NewUserProgress = InferInsertModel<typeof userProgress>;

// Messages (for chat/forum features)
export const messages = createTable("message", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  content: text("content").notNull(),
  messageType: text("message_type", { enum: ["chat", "forum", "announcement"] }).notNull().default("chat"),
  parentId: integer("parent_id"), // For replies
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type Message = InferSelectModel<typeof messages>;
export type NewMessage = InferInsertModel<typeof messages>;

// Resources (PDFs, videos, etc.)
export const resources = createTable("resource", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type", { enum: ["pdf", "video", "audio", "link", "text"] }).notNull(),
  url: text("url").notNull(),
  isPublic: boolean("is_public").notNull().default(true),
  requiredSubscriptionTier: text("required_subscription_tier", { enum: ["free", "pro", "premium"] }).default("free"),
  uploadedBy: text("uploaded_by")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type Resource = InferSelectModel<typeof resources>;
export type NewResource = InferInsertModel<typeof resources>;

// Alert System
export const alerts = createTable("alert", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type", { enum: ["info", "warning", "error", "success"] }).notNull().default("info"),
  isGlobal: boolean("is_global").notNull().default(false),
  targetUserId: text("target_user_id").references(() => users.id), // null for global alerts
  isRead: boolean("is_read").notNull().default(false),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type Alert = InferSelectModel<typeof alerts>;
export type NewAlert = InferInsertModel<typeof alerts>;

// Tutor Sessions
export const tutorSessions = createTable("tutor_session", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  sessionTopic: text("session_topic"),
  startedAt: timestamp("started_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  endedAt: timestamp("ended_at"),
  status: text("status", { enum: ["active", "completed", "abandoned"] }).notNull().default("active"),
});

export type TutorSession = InferSelectModel<typeof tutorSessions>;
export type NewTutorSession = InferInsertModel<typeof tutorSessions>;

// Tutor Messages
export const tutorMessages = createTable("tutor_message", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id")
    .notNull()
    .references(() => tutorSessions.id),
  content: text("content").notNull(),
  role: text("role", { enum: ["user", "assistant"] }).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type TutorMessage = InferSelectModel<typeof tutorMessages>;
export type NewTutorMessage = InferInsertModel<typeof tutorMessages>;

// Next.js Auth tables
export const accounts = createTable(
  "account",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = createTable("session", {
  sessionToken: text("session_token").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expires: timestamp("expires").notNull(),
});

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires").notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

// Community Posts
export const posts = createTable("post", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdById: text("created_by")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export type Post = InferSelectModel<typeof posts>;
export type NewPost = InferInsertModel<typeof posts>;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  posts: many(posts),
  userSubscriptions: many(userSubscriptions),
  onboardingResponses: many(onboardingResponses),
  userProgress: many(userProgress),
  messages: many(messages),
  resources: many(resources),
  alerts: many(alerts),
  tutorSessions: many(tutorSessions),
  cohortMembers: many(cohortMembers),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  createdBy: one(users, {
    fields: [posts.createdById],
    references: [users.id],
  }),
}));

export const subscriptionPlansRelations = relations(subscriptionPlans, ({ many }) => ({
  userSubscriptions: many(userSubscriptions),
}));

export const userSubscriptionsRelations = relations(userSubscriptions, ({ one }) => ({
  user: one(users, { fields: [userSubscriptions.userId], references: [users.id] }),
  plan: one(subscriptionPlans, { fields: [userSubscriptions.planId], references: [subscriptionPlans.id] }),
}));

export const onboardingResponsesRelations = relations(onboardingResponses, ({ one }) => ({
  user: one(users, { fields: [onboardingResponses.userId], references: [users.id] }),
}));

export const learningPathsRelations = relations(learningPaths, ({ many }) => ({
  modules: many(modules),
}));

export const modulesRelations = relations(modules, ({ one, many }) => ({
  learningPath: one(learningPaths, { fields: [modules.learningPathId], references: [learningPaths.id] }),
  lessons: many(lessons),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  module: one(modules, { fields: [lessons.moduleId], references: [modules.id] }),
  userProgress: many(userProgress),
}));

export const cohortsRelations = relations(cohorts, ({ many }) => ({
  members: many(cohortMembers),
}));

export const cohortMembersRelations = relations(cohortMembers, ({ one }) => ({
  cohort: one(cohorts, { fields: [cohortMembers.cohortId], references: [cohorts.id] }),
  user: one(users, { fields: [cohortMembers.userId], references: [users.id] }),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, { fields: [userProgress.userId], references: [users.id] }),
  lesson: one(lessons, { fields: [userProgress.lessonId], references: [lessons.id] }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  user: one(users, { fields: [messages.userId], references: [users.id] }),
}));

export const resourcesRelations = relations(resources, ({ one }) => ({
  uploadedBy: one(users, { fields: [resources.uploadedBy], references: [users.id] }),
}));

export const alertsRelations = relations(alerts, ({ one }) => ({
  targetUser: one(users, { fields: [alerts.targetUserId], references: [users.id] }),
}));

export const tutorSessionsRelations = relations(tutorSessions, ({ one, many }) => ({
  user: one(users, { fields: [tutorSessions.userId], references: [users.id] }),
  messages: many(tutorMessages),
}));

export const tutorMessagesRelations = relations(tutorMessages, ({ one }) => ({
  session: one(tutorSessions, { fields: [tutorMessages.sessionId], references: [tutorSessions.id] }),
}));
