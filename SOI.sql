CREATE TABLE `users` (
  `id` integer PRIMARY KEY,
  `FirstName` varchar(255),
  `LastName` varchar(255),
  `role` varchar(255),
  `Email` email,
  `PSW` pasword,
  `created_at` timestamp
);

CREATE TABLE `Labo` (
  `id` integer PRIMARY KEY,
  `userId` integer,
  `Status` boolean,
  `Name` varchar(255),
  `created_at` timestamp
);

CREATE TABLE `admins` (
  `id` integer PRIMARY KEY,
  `userId` integer
);

CREATE TABLE `ActivitiesList` (
  `id` integer PRIMARY KEY,
  `Name` varchar(255)
);

CREATE TABLE `ActivityByLabo` (
  `id` integer PRIMARY KEY,
  `laboId` integer,
  `ActivityId` integer
);

CREATE TABLE `ActivityItems` (
  `id` integer PRIMARY KEY,
  `Name` varchar(255),
  `ActivityId` integer
);

CREATE TABLE `ActivityItemsValue` (
  `id` integer PRIMARY KEY,
  `ActivityItemId` integer,
  `ActyvityByLaboId` integer,
  `value` float,
  `year` date
);

CREATE TABLE `ReturnOfInvestisment` (
  `id` integer PRIMARY KEY,
  `LaboId` integer,
  `value` float,
  `year` date
);

ALTER TABLE `Labo` ADD FOREIGN KEY (`userId`) REFERENCES `users` (`id`);

ALTER TABLE `ActivityByLabo` ADD FOREIGN KEY (`ActivityId`) REFERENCES `ActivitiesList` (`id`);

ALTER TABLE `ActivityByLabo` ADD FOREIGN KEY (`ActivityId`) REFERENCES `Labo` (`id`);

ALTER TABLE `ActivityItems` ADD FOREIGN KEY (`ActivityId`) REFERENCES `ActivitiesList` (`id`);

ALTER TABLE `ActivityItemsValue` ADD FOREIGN KEY (`ActivityItemId`) REFERENCES `ActivityItems` (`id`);

ALTER TABLE `ActivityItemsValue` ADD FOREIGN KEY (`ActyvityByLaboId`) REFERENCES `ActivityByLabo` (`id`);

ALTER TABLE `ReturnOfInvestisment` ADD FOREIGN KEY (`LaboId`) REFERENCES `Labo` (`id`);
