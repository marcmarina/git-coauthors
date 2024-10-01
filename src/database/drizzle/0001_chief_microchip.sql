CREATE TABLE `authors_to_repositories` (
	`author_id` integer NOT NULL,
	`repository_id` integer NOT NULL,
	PRIMARY KEY(`author_id`, `repository_id`),
	FOREIGN KEY (`author_id`) REFERENCES `authors`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`repository_id`) REFERENCES `repositories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `repositories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `authors_to_repositories_author_id_unique` ON `authors_to_repositories` (`author_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `authors_to_repositories_repository_id_unique` ON `authors_to_repositories` (`repository_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `repositories_id_unique` ON `repositories` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `repositories_name_unique` ON `repositories` (`name`);