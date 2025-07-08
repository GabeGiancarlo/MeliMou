/**
 * 🗄️ MeliMou Database Schema
 * 
 * This file defines the complete database schema for the MeliMou Greek learning platform.
 * Using Drizzle ORM with PostgreSQL for production-ready, type-safe database operations.
 * 
 * 🏗️ SCHEMA ARCHITECTURE:
 * ├── 👤 Authentication & User Management (NextAuth.js tables + extended user data)
 * ├── 💳 Subscription & Billing (Plans, user subscriptions, Stripe integration)
 * ├── 📚 Learning System (Paths, modules, lessons, progress tracking)
 * ├── 🤖 AI Tutoring (Sessions, messages, conversation history)
 * ├── 👥 Community Features (Cohorts, chat, forum posts)
 * ├── 📖 Content Management (Resources, alerts, notifications)
 * └── 🔗 Relationships (Drizzle relations for type-safe joins)
 * 
 * 🎯 KEY DESIGN PRINCIPLES:
 * - Type safety with TypeScript and Drizzle ORM
 * - Scalable subscription model with feature gating
 * - Comprehensive user progress tracking
 * - Flexible content management system
 * - Multi-tenant architecture ready (table prefixing)
 * - Audit trails with created/updated timestamps
 * 
 * 💡 MAINTENANCE NOTES:
 * - Always run `npm run db:generate` after schema changes
 * - Use enum constraints for data integrity
 * - JSON columns for flexible, evolving data structures
 * - Foreign keys ensure referential integrity
 * - Indexed fields optimized for common queries
 * 
 * @see docs/ARCHITECTURE.md for detailed system design
 * @see docs/API.md for API endpoint documentation
 */

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
 * 🏷️ Table Prefix Configuration
 * 
 * Multi-project schema support - all tables prefixed with 'melimou_'
 * Allows sharing PostgreSQL instance across multiple applications
 * 
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `melimou_${name}`);

// =============================================================================
// 👤 USER MANAGEMENT & AUTHENTICATION
// =============================================================================

/**
 * 👤 Users Table - Core user profiles with comprehensive onboarding data
 * 
 * Extends NextAuth.js user model with:
 * - Greek language learning preferences 
 * - Subscription management
 * - Onboarding workflow tracking
 * - Personal learning preferences
 * 
 * 🔒 Security: Passwords hashed with bcrypt, OAuth via NextAuth.js
 * 🎯 Business Logic: Role-based access, subscription tiers, formality preferences
 */
export const users = createTable("user", {
  // Core NextAuth.js fields
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("email_verified"),
  image: text("image"),
  password: text("password"), // For email/password authentication (bcrypt hashed)
  
  // Role-based access control
  role: text("role", { enum: ["student", "instructor", "admin"] }).notNull().default("student"),
  formalityPreference: text("formality_preference", { enum: ["informal", "formal", "mixed"] }).default("mixed"),
  
  // Personal information (optional, for personalization)
  age: integer("age"),
  gender: text("gender", { enum: ["male", "female", "non_binary", "prefer_not_to_say"] }),
  dateOfBirth: timestamp("date_of_birth"),
  
  // Onboarding workflow tracking
  hasCompletedOnboarding: boolean("has_completed_onboarding").notNull().default(false),
  greekLevel: text("greek_level", { enum: ["absolute_beginner", "beginner", "elementary", "intermediate", "advanced", "native"] }),
  learningGoals: json("learning_goals"), // Array of goals: ["conversation", "business", "travel", etc.]
  studyTimePerWeek: integer("study_time_per_week"), // Hours per week commitment
  previousExperience: text("previous_experience"), // Free text description
  interests: json("interests"), // Array of interests: ["mythology", "cuisine", "history", etc.]
  howHeardAboutUs: text("how_heard_about_us"), // Marketing attribution
  wantsPracticeTest: boolean("wants_practice_test").default(false),
  
  // Subscription management (denormalized for performance)
  subscriptionTier: text("subscription_tier", { enum: ["free", "pro", "premium"] }).notNull().default("free"),
  subscriptionStatus: text("subscription_status", { enum: ["active", "inactive", "cancelled", "past_due"] }).default("active"),
  subscriptionStartDate: timestamp("subscription_start_date"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  stripeCustomerId: text("stripe_customer_id"), // Stripe customer ID for billing
  
  // Audit fields
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(
    () => new Date(),
  ),
});

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

// =============================================================================
// 💳 SUBSCRIPTION & BILLING MANAGEMENT
// =============================================================================

/**
 * 💳 Subscription Plans - Available pricing tiers and features
 * 
 * Defines the subscription products available to users:
 * - Free: Limited AI sessions, basic content
 * - Pro: Increased limits, premium content  
 * - Premium: Unlimited access, 1-on-1 sessions
 * 
 * 🔧 Integration: Stripe pricing IDs for automated billing
 * 📊 Analytics: Feature usage limits for business intelligence
 */
export const subscriptionPlans = createTable("subscription_plan", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(), // "Free", "Pro", "Premium"
  description: text("description"), // Marketing description
  price: integer("price").notNull(), // Price in cents (e.g., 1999 = $19.99)
  currency: varchar("currency", { length: 3 }).notNull().default("USD"),
  intervalType: text("interval_type", { enum: ["month", "year"] }).notNull(),
  intervalCount: integer("interval_count").notNull().default(1), // Usually 1, could be 3 for quarterly
  stripePriceId: text("stripe_price_id"), // Stripe Price ID for automated billing
  features: json("features"), // Array of feature descriptions for marketing
  maxSessions: integer("max_sessions").default(-1), // AI tutor sessions per month (-1 = unlimited)
  maxResources: integer("max_resources").default(-1), // Resource downloads per month
  isActive: boolean("is_active").notNull().default(true), // For deprecating old plans
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type SubscriptionPlan = InferSelectModel<typeof subscriptionPlans>;
export type NewSubscriptionPlan = InferInsertModel<typeof subscriptionPlans>;

/**
 * 💳 User Subscriptions - Active subscription tracking
 * 
 * Tracks individual user subscriptions with Stripe integration:
 * - Current billing period
 * - Cancellation status
 * - Stripe subscription management
 * 
 * 🔄 Sync: Webhook updates from Stripe for real-time status
 * 🚨 Important: Cancel at period end allows graceful downgrades
 */
export const userSubscriptions = createTable("user_subscription", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  planId: integer("plan_id")
    .notNull()
    .references(() => subscriptionPlans.id),
  stripeSubscriptionId: text("stripe_subscription_id"), // Stripe Subscription ID
  status: text("status", { enum: ["active", "inactive", "cancelled", "past_due", "trialing"] }).notNull(),
  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false), // Graceful cancellation
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(
    () => new Date(),
  ),
});

export type UserSubscription = InferSelectModel<typeof userSubscriptions>;
export type NewUserSubscription = InferInsertModel<typeof userSubscriptions>;

/**
 * 📊 Onboarding Responses - Analytics and personalization data
 * 
 * Stores detailed onboarding responses for:
 * - Product analytics and optimization
 * - Personalized learning path recommendations
 * - User experience research
 * 
 * 🔍 Analytics: Question keys allow flexible analysis
 * 🎯 Personalization: Response data drives content recommendations
 */
export const onboardingResponses = createTable("onboarding_response", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  questionKey: varchar("question_key", { length: 100 }).notNull(), // "role", "greek_level", etc.
  response: json("response").notNull(), // Flexible JSON for any response type
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type OnboardingResponse = InferSelectModel<typeof onboardingResponses>;
export type NewOnboardingResponse = InferInsertModel<typeof onboardingResponses>;

// =============================================================================
// 📚 LEARNING SYSTEM - STRUCTURED CURRICULUM
// =============================================================================

/**
 * 📚 Learning Paths - Structured course curricula
 * 
 * Defines learning curricula from beginner to advanced:
 * - Greek Alphabet Mastery
 * - Conversational Greek Fundamentals  
 * - Business Greek
 * - Ancient Greek Literature
 * 
 * 🎯 Business Logic: Subscription tier gating for premium content
 * 📈 Scalability: Public/private paths for custom corporate training
 */
export const learningPaths = createTable("learning_path", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // "Greek Alphabet Mastery", "Business Greek"
  description: text("description"), // Marketing/educational description
  difficulty: text("difficulty", { enum: ["beginner", "intermediate", "advanced"] }).notNull(),
  isPublic: boolean("is_public").notNull().default(true), // Private paths for custom content
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

/**
 * 📖 Modules - Course sections within learning paths
 * 
 * Organizes learning paths into logical sections:
 * - "Introduction to Greek Alphabet" (Module 1)
 * - "Basic Vowels and Consonants" (Module 2)
 * - "Reading Practice" (Module 3)
 * 
 * 🔢 Order: Sequential progression with orderIndex
 * ⏱️ Estimation: Duration helps users plan study time
 */
export const modules = createTable("module", {
  id: serial("id").primaryKey(),
  learningPathId: integer("learning_path_id")
    .notNull()
    .references(() => learningPaths.id),
  name: text("name").notNull(), // Module title
  description: text("description"), // Module overview
  orderIndex: integer("order_index").notNull(), // Sequential order within path
  estimatedDuration: integer("estimated_duration"), // Total minutes for module
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(
    () => new Date(),
  ),
});

export type Module = InferSelectModel<typeof modules>;
export type NewModule = InferInsertModel<typeof modules>;

/**
 * 📝 Lessons - Individual lesson content and exercises
 * 
 * Core learning content with rich multimedia:
 * - Text content, audio pronunciation, video examples
 * - Interactive exercises and quizzes
 * - Cultural context and real-world applications
 * 
 * 🎨 Content: JSON structure supports rich multimedia content
 * 🔒 Access: Subscription tier gating for premium lessons
 * 📊 Tracking: Estimated duration for progress calculation
 */
export const lessons = createTable("lesson", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id")
    .notNull()
    .references(() => modules.id),
  name: text("name").notNull(), // Lesson title
  description: text("description"), // Lesson overview
  content: json("content"), // Rich JSON structure: text, audio URLs, video, exercises
  orderIndex: integer("order_index").notNull(), // Sequential order within module
  estimatedDuration: integer("estimated_duration"), // Minutes to complete
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

// =============================================================================
// 👥 COMMUNITY FEATURES - COHORTS & COLLABORATION  
// =============================================================================

/**
 * 👥 Cohorts - Live learning groups with instructors
 * 
 * Structured group learning with native speakers:
 * - 8-week intensive programs
 * - Small groups (max 8-12 students)
 * - Live video sessions with instructors
 * - Peer support and accountability
 * 
 * 📅 Scheduling: Date-based cohort management
 * 👥 Capacity: Member limits ensure quality instruction
 */
export const cohorts = createTable("cohort", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // "Spring 2024 Beginner Greek", "Advanced Business Greek"
  description: text("description"), // Cohort details and expectations
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"), // null for ongoing cohorts
  maxMembers: integer("max_members").default(50), // Enrollment cap
  isActive: boolean("is_active").notNull().default(true), // For archiving old cohorts
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(
    () => new Date(),
  ),
});

export type Cohort = InferSelectModel<typeof cohorts>;
export type NewCohort = InferInsertModel<typeof cohorts>;

/**
 * 👤 Cohort Members - User enrollment in learning groups
 * 
 * Tracks user participation in cohorts:
 * - Member: Regular student
 * - Leader: Peer mentor role
 * - Instructor: Professional teacher
 * 
 * 📊 Analytics: Join dates track enrollment patterns
 * 🎯 Engagement: Active status for attendance tracking
 */
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
  isActive: boolean("is_active").notNull().default(true), // For handling dropouts
});

export type CohortMember = InferSelectModel<typeof cohortMembers>;
export type NewCohortMember = InferInsertModel<typeof cohortMembers>;

// =============================================================================
// 📊 PROGRESS TRACKING & ANALYTICS
// =============================================================================

/**
 * 📊 User Progress - Individual lesson completion tracking
 * 
 * Comprehensive progress analytics:
 * - Completion status and timestamps
 * - Performance scores and time spent
 * - Learning velocity calculation
 * - Achievement milestone tracking
 * 
 * 🎯 Gamification: Scores enable leaderboards and achievements  
 * 📈 Analytics: Time spent optimizes content difficulty
 * 🔄 Resumption: In-progress status enables lesson resumption
 */
export const userProgress = createTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  lessonId: integer("lesson_id")
    .notNull()
    .references(() => lessons.id),
  status: text("status", { enum: ["not_started", "in_progress", "completed"] }).notNull().default("not_started"),
  completedAt: timestamp("completed_at"), // null until completed
  score: integer("score"), // Percentage score (0-100) for assessments
  timeSpent: integer("time_spent"), // Minutes spent on lesson
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(
    () => new Date(),
  ),
});

export type UserProgress = InferSelectModel<typeof userProgress>;
export type NewUserProgress = InferInsertModel<typeof userProgress>;

// =============================================================================
// 💬 COMMUNITY COMMUNICATION
// =============================================================================

/**
 * 💬 Messages - Community chat and forum system
 * 
 * Multi-purpose messaging system:
 * - Chat: Real-time community conversations
 * - Forum: Structured discussion threads  
 * - Announcements: Official platform updates
 * 
 * 🌐 Community: Supports threaded discussions with parentId
 * 📢 Announcements: Official communication channel
 * 👀 Read Status: Notification management
 */
export const messages = createTable("message", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  content: text("content").notNull(), // Message text content
  messageType: text("message_type", { enum: ["chat", "forum", "announcement"] }).notNull().default("chat"),
  parentId: integer("parent_id"), // For threaded replies, references messages.id
  isRead: boolean("is_read").notNull().default(false), // For notification management
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type Message = InferSelectModel<typeof messages>;
export type NewMessage = InferInsertModel<typeof messages>;

// =============================================================================
// 📖 CONTENT & RESOURCE MANAGEMENT
// =============================================================================

/**
 * 📖 Resources - Learning materials and downloads
 * 
 * Curated learning resources:
 * - PDFs: Grammar guides, vocabulary lists
 * - Videos: Pronunciation tutorials, cultural content
 * - Audio: Listening exercises, music, podcasts
 * - Links: External websites and tools
 * 
 * 🔒 Access Control: Subscription tier gating for premium resources
 * 👤 Attribution: Track resource contributors
 * 🌐 Visibility: Public/private resource management
 */
export const resources = createTable("resource", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // Resource title
  description: text("description"), // Resource description
  type: text("type", { enum: ["pdf", "video", "audio", "link", "text"] }).notNull(),
  url: text("url").notNull(), // File URL or external link
  isPublic: boolean("is_public").notNull().default(true), // Visibility control
  requiredSubscriptionTier: text("required_subscription_tier", { enum: ["free", "pro", "premium"] }).default("free"),
  uploadedBy: text("uploaded_by")
    .notNull()
    .references(() => users.id), // Resource contributor
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type Resource = InferSelectModel<typeof resources>;
export type NewResource = InferInsertModel<typeof resources>;

/**
 * 🔔 Alert System - Notifications and announcements
 * 
 * Comprehensive notification system:
 * - Global: Platform-wide announcements
 * - Personal: Individual user notifications
 * - Typed: Info, warnings, errors, success messages
 * - Expiring: Time-limited announcements
 * 
 * 📢 Communication: Critical platform updates
 * 🎯 Targeting: Global vs individual notifications
 * ⏰ Lifecycle: Expiration dates for time-sensitive alerts
 */
export const alerts = createTable("alert", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(), // Alert headline
  message: text("message").notNull(), // Alert content
  type: text("type", { enum: ["info", "warning", "error", "success"] }).notNull().default("info"),
  isGlobal: boolean("is_global").notNull().default(false), // Platform-wide vs individual
  targetUserId: text("target_user_id").references(() => users.id), // null for global alerts
  isRead: boolean("is_read").notNull().default(false), // Read status tracking
  expiresAt: timestamp("expires_at"), // null for permanent alerts
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type Alert = InferSelectModel<typeof alerts>;
export type NewAlert = InferInsertModel<typeof alerts>;

// =============================================================================
// 🤖 AI TUTORING SYSTEM
// =============================================================================

/**
 * 🤖 Tutor Sessions - AI conversation tracking
 * 
 * Manages AI-powered tutoring conversations:
 * - Session lifecycle (active, completed, abandoned)
 * - Topic-based conversations 
 * - Performance analytics
 * - Subscription usage tracking
 * 
 * 💡 AI Integration: Ready for OpenAI/Anthropic API
 * 📊 Analytics: Session data optimizes AI responses
 * 💳 Billing: Session counts enforce subscription limits
 */
export const tutorSessions = createTable("tutor_session", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  sessionTopic: text("session_topic"), // "Ordering food", "Business meeting", etc.
  startedAt: timestamp("started_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  endedAt: timestamp("ended_at"), // null for active sessions
  status: text("status", { enum: ["active", "completed", "abandoned"] }).notNull().default("active"),
});

export type TutorSession = InferSelectModel<typeof tutorSessions>;
export type NewTutorSession = InferInsertModel<typeof tutorSessions>;

/**
 * 💬 Tutor Messages - AI conversation history
 * 
 * Stores complete AI conversation transcripts:
 * - User messages and AI responses
 * - Conversation context preservation
 * - Performance analysis data
 * - Learning progress tracking
 * 
 * 🧠 Context: Message history enables coherent conversations
 * 📈 Learning: User messages reveal learning patterns
 * 🎯 Improvement: AI responses can be analyzed and optimized
 */
export const tutorMessages = createTable("tutor_message", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id")
    .notNull()
    .references(() => tutorSessions.id),
  content: text("content").notNull(), // Message text
  role: text("role", { enum: ["user", "assistant"] }).notNull(), // Who sent the message
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type TutorMessage = InferSelectModel<typeof tutorMessages>;
export type NewTutorMessage = InferInsertModel<typeof tutorMessages>;

// =============================================================================
// 🔐 NEXTAUTH.JS AUTHENTICATION TABLES
// =============================================================================

/**
 * 🔐 NextAuth.js OAuth Account Linking
 * 
 * Manages OAuth provider accounts (Google, Facebook, etc.):
 * - Multiple OAuth providers per user
 * - Refresh token management
 * - Provider-specific data storage
 * 
 * 🔗 Integration: Seamless social login experience
 * 🔄 Tokens: Automatic refresh token handling
 * 🆔 Linking: Users can connect multiple providers
 */
export const accounts = createTable(
  "account",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(), // "google", "facebook", etc.
    providerAccountId: text("provider_account_id").notNull(), // Provider's user ID
    refresh_token: text("refresh_token"), // OAuth refresh token
    access_token: text("access_token"), // OAuth access token
    expires_at: integer("expires_at"), // Token expiration timestamp
    token_type: text("token_type"), // "Bearer", etc.
    scope: text("scope"), // OAuth permission scopes
    id_token: text("id_token"), // OpenID Connect ID token
    session_state: text("session_state"), // OAuth session state
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

/**
 * 🎫 User Sessions - Active login tracking
 * 
 * Manages user authentication sessions:
 * - Session token for authentication
 * - Expiration management
 * - Security and logout handling
 * 
 * 🔒 Security: HTTP-only cookies prevent XSS
 * ⏰ Expiration: Automatic session cleanup
 * 🚪 Logout: Clean session termination
 */
export const sessions = createTable("session", {
  sessionToken: text("session_token").notNull().primaryKey(), // Unique session identifier
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expires: timestamp("expires").notNull(), // Session expiration time
});

/**
 * ✅ Email Verification Tokens
 * 
 * Manages email verification process:
 * - Account verification tokens
 * - Password reset tokens  
 * - Secure token expiration
 * 
 * 📧 Verification: Confirms email ownership
 * 🔄 Reset: Secure password reset flow
 * ⏰ Expiration: Security through token expiry
 */
export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: text("identifier").notNull(), // Email address
    token: text("token").notNull(), // Verification token
    expires: timestamp("expires").notNull(), // Token expiration
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

// =============================================================================
// 📝 COMMUNITY FORUM POSTS
// =============================================================================

/**
 * 📝 Community Posts - Forum discussion threads
 * 
 * Basic forum post system for community discussions:
 * - Question and answer threads
 * - Learning tips and strategies
 * - Cultural discussions
 * - Student showcases
 * 
 * 👥 Community: Encourages peer learning
 * 🧠 Knowledge: Collective learning resource
 * 🎯 Engagement: Increases platform stickiness
 */
export const posts = createTable("post", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // Post title
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

// =============================================================================
// 🔗 DRIZZLE ORM RELATIONS - TYPE-SAFE JOINS
// =============================================================================

/**
 * 🔗 Database Relations Configuration
 * 
 * Defines type-safe relationships between tables for:
 * - Automatic JOIN query generation
 * - Type inference in query results
 * - Referential integrity enforcement
 * - IDE autocompletion support
 * 
 * 💡 Usage: ctx.db.query.users.findFirst({ with: { subscriptions: true } })
 * 🎯 Performance: Optimized queries with selective loading
 * 🔒 Safety: Compile-time relationship validation
 */

// Users have many related entities
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

// OAuth accounts belong to users
export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

// Sessions belong to users
export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

// Posts belong to users
export const postsRelations = relations(posts, ({ one }) => ({
  createdBy: one(users, {
    fields: [posts.createdById],
    references: [users.id],
  }),
}));

// Subscription plans have many user subscriptions
export const subscriptionPlansRelations = relations(subscriptionPlans, ({ many }) => ({
  userSubscriptions: many(userSubscriptions),
}));

// User subscriptions link users and plans
export const userSubscriptionsRelations = relations(userSubscriptions, ({ one }) => ({
  user: one(users, { fields: [userSubscriptions.userId], references: [users.id] }),
  plan: one(subscriptionPlans, { fields: [userSubscriptions.planId], references: [subscriptionPlans.id] }),
}));

// Onboarding responses belong to users
export const onboardingResponsesRelations = relations(onboardingResponses, ({ one }) => ({
  user: one(users, { fields: [onboardingResponses.userId], references: [users.id] }),
}));

// Learning paths have many modules
export const learningPathsRelations = relations(learningPaths, ({ many }) => ({
  modules: many(modules),
}));

// Modules belong to learning paths and have many lessons
export const modulesRelations = relations(modules, ({ one, many }) => ({
  learningPath: one(learningPaths, { fields: [modules.learningPathId], references: [learningPaths.id] }),
  lessons: many(lessons),
}));

// Lessons belong to modules and have progress tracking
export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  module: one(modules, { fields: [lessons.moduleId], references: [modules.id] }),
  userProgress: many(userProgress),
}));

// Cohorts have many members
export const cohortsRelations = relations(cohorts, ({ many }) => ({
  members: many(cohortMembers),
}));

// Cohort members link cohorts and users
export const cohortMembersRelations = relations(cohortMembers, ({ one }) => ({
  cohort: one(cohorts, { fields: [cohortMembers.cohortId], references: [cohorts.id] }),
  user: one(users, { fields: [cohortMembers.userId], references: [users.id] }),
}));

// User progress links users and lessons
export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, { fields: [userProgress.userId], references: [users.id] }),
  lesson: one(lessons, { fields: [userProgress.lessonId], references: [lessons.id] }),
}));

// Messages belong to users
export const messagesRelations = relations(messages, ({ one }) => ({
  user: one(users, { fields: [messages.userId], references: [users.id] }),
}));

// Resources belong to users (who uploaded them)
export const resourcesRelations = relations(resources, ({ one }) => ({
  uploadedBy: one(users, { fields: [resources.uploadedBy], references: [users.id] }),
}));

// Alerts can target specific users
export const alertsRelations = relations(alerts, ({ one }) => ({
  targetUser: one(users, { fields: [alerts.targetUserId], references: [users.id] }),
}));

// Tutor sessions belong to users and have many messages
export const tutorSessionsRelations = relations(tutorSessions, ({ one, many }) => ({
  user: one(users, { fields: [tutorSessions.userId], references: [users.id] }),
  messages: many(tutorMessages),
}));

// Tutor messages belong to tutor sessions
export const tutorMessagesRelations = relations(tutorMessages, ({ one }) => ({
  session: one(tutorSessions, { fields: [tutorMessages.sessionId], references: [tutorSessions.id] }),
}));
