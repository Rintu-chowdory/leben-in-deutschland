CREATE TABLE `anmeldungOffices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`city` varchar(100) NOT NULL,
	`state` varchar(100) NOT NULL,
	`address` text NOT NULL,
	`phone` varchar(20),
	`website` varchar(500),
	`hours` text,
	`latitude` decimal(10,8),
	`longitude` decimal(11,8),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `anmeldungOffices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bankRecommendations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('online','traditional','neo-bank') NOT NULL,
	`monthlyFee` decimal(8,2),
	`accountOpeningBonus` varchar(255),
	`englishSupport` boolean DEFAULT false,
	`features` json DEFAULT ('[]'),
	`affiliateLink` varchar(500),
	`rating` decimal(3,1),
	`reviewCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bankRecommendations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `healthInsuranceProviders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('gkv','pkv') NOT NULL,
	`monthlyContribution` decimal(8,2),
	`deductible` decimal(10,2),
	`englishSupport` boolean DEFAULT false,
	`features` json DEFAULT ('[]'),
	`website` varchar(500),
	`rating` decimal(3,1),
	`reviewCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `healthInsuranceProviders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `integrationCourses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`provider` varchar(255) NOT NULL,
	`city` varchar(100) NOT NULL,
	`state` varchar(100) NOT NULL,
	`courseType` enum('language','culture','civic','combined') NOT NULL,
	`startDate` timestamp,
	`duration` varchar(100),
	`price` decimal(10,2),
	`bamfLink` varchar(500),
	`website` varchar(500),
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `integrationCourses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `moduleProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`moduleName` varchar(100) NOT NULL,
	`completionPercentage` int NOT NULL DEFAULT 0,
	`checklistItems` json DEFAULT ('[]'),
	`savedResources` json DEFAULT ('[]'),
	`personalNotes` text,
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`lastUpdated` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `moduleProgress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`tier` enum('free','premium') NOT NULL DEFAULT 'free',
	`stripeCustomerId` varchar(255),
	`stripeSubscriptionId` varchar(255),
	`status` enum('active','inactive','canceled') NOT NULL DEFAULT 'active',
	`renewalDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `visaPermitTypes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`code` varchar(50) NOT NULL,
	`description` text,
	`eligibilityCriteria` json DEFAULT ('[]'),
	`requiredDocuments` json DEFAULT ('[]'),
	`processingTime` varchar(100),
	`validityPeriod` varchar(100),
	`applicationSteps` json DEFAULT ('[]'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `visaPermitTypes_id` PRIMARY KEY(`id`),
	CONSTRAINT `visaPermitTypes_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE INDEX `anmeldungOffices_city_idx` ON `anmeldungOffices` (`city`);--> statement-breakpoint
CREATE INDEX `integrationCourses_city_idx` ON `integrationCourses` (`city`);--> statement-breakpoint
CREATE INDEX `integrationCourses_courseType_idx` ON `integrationCourses` (`courseType`);--> statement-breakpoint
CREATE INDEX `moduleProgress_userId_idx` ON `moduleProgress` (`userId`);--> statement-breakpoint
CREATE INDEX `moduleProgress_userId_moduleName_idx` ON `moduleProgress` (`userId`,`moduleName`);--> statement-breakpoint
CREATE INDEX `subscriptions_userId_idx` ON `subscriptions` (`userId`);