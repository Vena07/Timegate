CREATE TABLE `sections` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title_cz` text NOT NULL,
	`title_en` text NOT NULL
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_gallery` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`image_url` text NOT NULL,
	`section_id` integer NOT NULL,
	FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_gallery`("id", "image_url", "section_id") SELECT "id", "image_url", "section_id" FROM `gallery`;--> statement-breakpoint
DROP TABLE `gallery`;--> statement-breakpoint
ALTER TABLE `__new_gallery` RENAME TO `gallery`;--> statement-breakpoint
PRAGMA foreign_keys=ON;