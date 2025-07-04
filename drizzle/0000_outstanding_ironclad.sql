CREATE TABLE IF NOT EXISTS "melimou_account" (
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "melimou_account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "melimou_alert" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"type" text DEFAULT 'info' NOT NULL,
	"is_global" boolean DEFAULT false NOT NULL,
	"target_user_id" text,
	"is_read" boolean DEFAULT false NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "melimou_cohort_member" (
	"id" serial PRIMARY KEY NOT NULL,
	"cohort_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"joined_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "melimou_cohort" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"max_members" integer DEFAULT 50,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "melimou_learning_path" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"difficulty" text NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL,
	"required_subscription_tier" text DEFAULT 'free',
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "melimou_lesson" (
	"id" serial PRIMARY KEY NOT NULL,
	"module_id" integer NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"content" json,
	"order_index" integer NOT NULL,
	"estimated_duration" integer,
	"required_subscription_tier" text DEFAULT 'free',
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "melimou_message" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"content" text NOT NULL,
	"message_type" text DEFAULT 'chat' NOT NULL,
	"parent_id" integer,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "melimou_module" (
	"id" serial PRIMARY KEY NOT NULL,
	"learning_path_id" integer NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"order_index" integer NOT NULL,
	"estimated_duration" integer,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "melimou_onboarding_response" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"question_key" varchar(100) NOT NULL,
	"response" json NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "melimou_post" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "melimou_resource" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"type" text NOT NULL,
	"url" text NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL,
	"required_subscription_tier" text DEFAULT 'free',
	"uploaded_by" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "melimou_session" (
	"session_token" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "melimou_subscription_plan" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"price" integer NOT NULL,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"interval_type" text NOT NULL,
	"interval_count" integer DEFAULT 1 NOT NULL,
	"stripe_price_id" text,
	"features" json,
	"max_sessions" integer DEFAULT -1,
	"max_resources" integer DEFAULT -1,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "melimou_tutor_message" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" integer NOT NULL,
	"content" text NOT NULL,
	"role" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "melimou_tutor_session" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"session_topic" text,
	"started_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"ended_at" timestamp,
	"status" text DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "melimou_user_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"lesson_id" integer NOT NULL,
	"status" text DEFAULT 'not_started' NOT NULL,
	"completed_at" timestamp,
	"score" integer,
	"time_spent" integer,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "melimou_user_subscription" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"plan_id" integer NOT NULL,
	"stripe_subscription_id" text,
	"status" text NOT NULL,
	"current_period_start" timestamp NOT NULL,
	"current_period_end" timestamp NOT NULL,
	"cancel_at_period_end" boolean DEFAULT false,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "melimou_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"email_verified" timestamp,
	"image" text,
	"password" text,
	"role" text DEFAULT 'student' NOT NULL,
	"formality_preference" text DEFAULT 'mixed',
	"age" integer,
	"gender" text,
	"date_of_birth" timestamp,
	"has_completed_onboarding" boolean DEFAULT false NOT NULL,
	"greek_level" text,
	"learning_goals" json,
	"study_time_per_week" integer,
	"previous_experience" text,
	"interests" json,
	"how_heard_about_us" text,
	"wants_practice_test" boolean DEFAULT false,
	"subscription_tier" text DEFAULT 'free' NOT NULL,
	"subscription_status" text DEFAULT 'active',
	"subscription_start_date" timestamp,
	"subscription_end_date" timestamp,
	"stripe_customer_id" text,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "melimou_verification_token" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "melimou_verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "melimou_account" ADD CONSTRAINT "melimou_account_user_id_melimou_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."melimou_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "melimou_alert" ADD CONSTRAINT "melimou_alert_target_user_id_melimou_user_id_fk" FOREIGN KEY ("target_user_id") REFERENCES "public"."melimou_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "melimou_cohort_member" ADD CONSTRAINT "melimou_cohort_member_cohort_id_melimou_cohort_id_fk" FOREIGN KEY ("cohort_id") REFERENCES "public"."melimou_cohort"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "melimou_cohort_member" ADD CONSTRAINT "melimou_cohort_member_user_id_melimou_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."melimou_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "melimou_lesson" ADD CONSTRAINT "melimou_lesson_module_id_melimou_module_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."melimou_module"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "melimou_message" ADD CONSTRAINT "melimou_message_user_id_melimou_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."melimou_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "melimou_module" ADD CONSTRAINT "melimou_module_learning_path_id_melimou_learning_path_id_fk" FOREIGN KEY ("learning_path_id") REFERENCES "public"."melimou_learning_path"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "melimou_onboarding_response" ADD CONSTRAINT "melimou_onboarding_response_user_id_melimou_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."melimou_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "melimou_post" ADD CONSTRAINT "melimou_post_created_by_melimou_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."melimou_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "melimou_resource" ADD CONSTRAINT "melimou_resource_uploaded_by_melimou_user_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."melimou_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "melimou_session" ADD CONSTRAINT "melimou_session_user_id_melimou_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."melimou_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "melimou_tutor_message" ADD CONSTRAINT "melimou_tutor_message_session_id_melimou_tutor_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."melimou_tutor_session"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "melimou_tutor_session" ADD CONSTRAINT "melimou_tutor_session_user_id_melimou_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."melimou_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "melimou_user_progress" ADD CONSTRAINT "melimou_user_progress_user_id_melimou_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."melimou_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "melimou_user_progress" ADD CONSTRAINT "melimou_user_progress_lesson_id_melimou_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."melimou_lesson"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "melimou_user_subscription" ADD CONSTRAINT "melimou_user_subscription_user_id_melimou_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."melimou_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "melimou_user_subscription" ADD CONSTRAINT "melimou_user_subscription_plan_id_melimou_subscription_plan_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."melimou_subscription_plan"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
