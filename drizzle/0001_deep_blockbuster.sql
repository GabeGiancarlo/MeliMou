CREATE TABLE `melimou_onboarding_response` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text(255) NOT NULL,
	`question_key` text(100) NOT NULL,
	`response` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `melimou_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `melimou_subscription_plan` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(100) NOT NULL,
	`description` text,
	`price` integer NOT NULL,
	`currency` text(3) DEFAULT 'USD' NOT NULL,
	`interval_type` text NOT NULL,
	`interval_count` integer DEFAULT 1 NOT NULL,
	`stripe_price_id` text(255),
	`features` text,
	`max_sessions` integer DEFAULT -1,
	`max_resources` integer DEFAULT -1,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `melimou_user_subscription` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text(255) NOT NULL,
	`plan_id` integer NOT NULL,
	`stripe_subscription_id` text(255),
	`status` text NOT NULL,
	`current_period_start` integer NOT NULL,
	`current_period_end` integer NOT NULL,
	`cancel_at_period_end` integer DEFAULT false,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `melimou_user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`plan_id`) REFERENCES `melimou_subscription_plan`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `melimou_cohort` ADD `required_subscription_tier` text DEFAULT 'pro';--> statement-breakpoint
ALTER TABLE `melimou_learning_path` ADD `required_subscription_tier` text DEFAULT 'free';--> statement-breakpoint
ALTER TABLE `melimou_lesson` ADD `required_subscription_tier` text DEFAULT 'free';--> statement-breakpoint
ALTER TABLE `melimou_resource` ADD `required_subscription_tier` text DEFAULT 'free';--> statement-breakpoint
ALTER TABLE `melimou_tutor_session` ADD `sessions_used_this_month` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `melimou_user` ADD `has_completed_onboarding` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `melimou_user` ADD `greek_level` text;--> statement-breakpoint
ALTER TABLE `melimou_user` ADD `learning_goals` text;--> statement-breakpoint
ALTER TABLE `melimou_user` ADD `study_time_per_week` integer;--> statement-breakpoint
ALTER TABLE `melimou_user` ADD `previous_experience` text;--> statement-breakpoint
ALTER TABLE `melimou_user` ADD `interests` text;--> statement-breakpoint
ALTER TABLE `melimou_user` ADD `how_heard_about_us` text;--> statement-breakpoint
ALTER TABLE `melimou_user` ADD `wants_practice_test` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `melimou_user` ADD `subscription_tier` text DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE `melimou_user` ADD `subscription_status` text DEFAULT 'active';--> statement-breakpoint
ALTER TABLE `melimou_user` ADD `subscription_start_date` integer;--> statement-breakpoint
ALTER TABLE `melimou_user` ADD `subscription_end_date` integer;--> statement-breakpoint
ALTER TABLE `melimou_user` ADD `stripe_customer_id` text(255);