CREATE TABLE `melimou_account` (
	`user_id` text(255) NOT NULL,
	`type` text(255) NOT NULL,
	`provider` text(255) NOT NULL,
	`provider_account_id` text(255) NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text(255),
	`scope` text(255),
	`id_token` text,
	`session_state` text(255),
	PRIMARY KEY(`provider`, `provider_account_id`),
	FOREIGN KEY (`user_id`) REFERENCES `melimou_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `melimou_alert` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text(255) NOT NULL,
	`title` text(255) NOT NULL,
	`message` text NOT NULL,
	`alert_type` text NOT NULL,
	`is_read` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `melimou_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `melimou_cohort_member` (
	`cohort_id` integer NOT NULL,
	`user_id` text(255) NOT NULL,
	`joined_at` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`cohort_id`, `user_id`),
	FOREIGN KEY (`cohort_id`) REFERENCES `melimou_cohort`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `melimou_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `melimou_cohort` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(255) NOT NULL,
	`description` text,
	`learning_path_id` integer NOT NULL,
	`instructor_id` text(255) NOT NULL,
	`start_date` integer,
	`end_date` integer,
	`max_students` integer DEFAULT 30,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`learning_path_id`) REFERENCES `melimou_learning_path`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`instructor_id`) REFERENCES `melimou_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `melimou_learning_path` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(255) NOT NULL,
	`description` text,
	`difficulty` text NOT NULL,
	`is_public` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `melimou_lesson` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`module_id` integer NOT NULL,
	`name` text(255) NOT NULL,
	`description` text,
	`content` text,
	`order_index` integer NOT NULL,
	`estimated_duration` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`module_id`) REFERENCES `melimou_module`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `melimou_message` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`sender_id` text(255) NOT NULL,
	`content` text NOT NULL,
	`channel_id` text(255),
	`message_type` text DEFAULT 'text' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`sender_id`) REFERENCES `melimou_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `melimou_module` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`learning_path_id` integer NOT NULL,
	`name` text(255) NOT NULL,
	`description` text,
	`order_index` integer NOT NULL,
	`estimated_duration` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`learning_path_id`) REFERENCES `melimou_learning_path`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `melimou_post` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(256),
	`created_by` text(255) NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`created_by`) REFERENCES `melimou_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `melimou_resource` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text(255) NOT NULL,
	`description` text,
	`content` text,
	`resource_type` text(100) NOT NULL,
	`difficulty` text NOT NULL,
	`tags` text,
	`is_public` integer DEFAULT true NOT NULL,
	`created_by` text(255) NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`created_by`) REFERENCES `melimou_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `melimou_session` (
	`session_token` text(255) PRIMARY KEY NOT NULL,
	`user_id` text(255) NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `melimou_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `melimou_tutor_message` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session_id` integer NOT NULL,
	`content` text NOT NULL,
	`is_from_user` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `melimou_tutor_session`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `melimou_tutor_session` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text(255) NOT NULL,
	`topic` text(255),
	`formality_level` text DEFAULT 'mixed' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `melimou_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `melimou_user_progress` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text(255) NOT NULL,
	`lesson_id` integer NOT NULL,
	`is_completed` integer DEFAULT false NOT NULL,
	`score` integer,
	`time_spent` integer,
	`completed_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `melimou_user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`lesson_id`) REFERENCES `melimou_lesson`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `melimou_user` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`name` text(255),
	`email` text(255) NOT NULL,
	`email_verified` integer,
	`image` text(255),
	`role` text DEFAULT 'student' NOT NULL,
	`formality_preference` text DEFAULT 'mixed',
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `melimou_verification_token` (
	`identifier` text(255) NOT NULL,
	`token` text(255) NOT NULL,
	`expires` integer NOT NULL,
	PRIMARY KEY(`identifier`, `token`)
);
