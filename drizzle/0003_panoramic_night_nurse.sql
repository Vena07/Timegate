CREATE TABLE `news` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title_cz` text NOT NULL,
	`title_en` text NOT NULL,
	`description_cz` text NOT NULL,
	`description_en` text NOT NULL,
	`photo_url` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
