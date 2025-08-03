CREATE TABLE `artist` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`photo_url` text NOT NULL,
	`bio_cz` text NOT NULL,
	`bio_en` text NOT NULL,
	`instagram_url` text
);
--> statement-breakpoint
CREATE TABLE `event` (
	`id` integer PRIMARY KEY NOT NULL,
	`title_cz` text NOT NULL,
	`title_en` text,
	`date` text NOT NULL,
	`location` text NOT NULL,
	`poster_url` text,
	`description_cz` text,
	`description_en` text,
	`ticket_url` text
);
--> statement-breakpoint
CREATE TABLE `lineup` (
	`id` integer PRIMARY KEY NOT NULL,
	`event_id` integer NOT NULL,
	`artist_name` text NOT NULL,
	`stage` text,
	`time_range` text,
	`note` text
);
--> statement-breakpoint
CREATE TABLE `sound_track` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`soundcloud_url` text NOT NULL
);
