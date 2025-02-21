-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : ven. 21 fév. 2025 à 15:12
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `roi`
--

-- --------------------------------------------------------

--
-- Structure de la table `activitieslist`
--

CREATE TABLE `activitieslist` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `Name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `activitieslist`
--

INSERT INTO `activitieslist` (`id`, `Name`, `created_at`, `updated_at`) VALUES
(1, 'Distribution des échantillons', NULL, NULL),
(2, 'Essai clinique', NULL, NULL),
(3, 'Mailing', NULL, NULL),
(4, 'Conférences', NULL, NULL),
(5, 'Tables rondes', NULL, NULL),
(6, 'Visites médicales', NULL, NULL),
(7, 'Publicité directe au consommateur', NULL, NULL),
(8, 'Publicité directe au consommateur en ligne', NULL, NULL),
(9, 'Publicité dans les revues', NULL, NULL),
(10, 'Générique (Médecins)', NULL, NULL),
(11, 'Générique (Patients)', NULL, NULL),
(12, 'Promotion numérique pour les médecins', NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `activitybylabo`
--

CREATE TABLE `activitybylabo` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `laboId` bigint(20) UNSIGNED NOT NULL,
  `ActivityId` bigint(20) UNSIGNED NOT NULL,
  `year` year(4) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `activityitems`
--

CREATE TABLE `activityitems` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `Name` varchar(255) NOT NULL,
  `ActivityId` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `activityitemvalues`
--

CREATE TABLE `activityitemvalues` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `activityItemId` bigint(20) UNSIGNED NOT NULL,
  `ActivityByLaboId` bigint(20) UNSIGNED NOT NULL,
  `value` double NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `labo`
--

CREATE TABLE `labo` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `Name` varchar(255) NOT NULL,
  `userId` bigint(20) UNSIGNED NOT NULL,
  `status` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '00_users', 1),
(2, '02_labo', 1),
(3, '03activities_list', 1),
(4, '04activity_items', 1),
(5, '05activity_by_labo', 1),
(6, '06activity_item_value', 1),
(7, '07rapport_ROI', 1);

-- --------------------------------------------------------

--
-- Structure de la table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `reportroi`
--

CREATE TABLE `reportroi` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `laboId` bigint(20) UNSIGNED NOT NULL,
  `value` double NOT NULL,
  `year` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `FirstName` varchar(20) NOT NULL,
  `LastName` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `Role` varchar(20) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `activitieslist`
--
ALTER TABLE `activitieslist`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `activitieslist_name_unique` (`Name`);

--
-- Index pour la table `activitybylabo`
--
ALTER TABLE `activitybylabo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `activitybylabo_laboid_foreign` (`laboId`),
  ADD KEY `activitybylabo_activityid_foreign` (`ActivityId`);

--
-- Index pour la table `activityitems`
--
ALTER TABLE `activityitems`
  ADD PRIMARY KEY (`id`),
  ADD KEY `activityitems_activityid_foreign` (`ActivityId`);

--
-- Index pour la table `activityitemvalues`
--
ALTER TABLE `activityitemvalues`
  ADD PRIMARY KEY (`id`),
  ADD KEY `activityitemvalues_activityitemid_foreign` (`activityItemId`),
  ADD KEY `activityitemvalues_activitybylaboid_foreign` (`ActivityByLaboId`);

--
-- Index pour la table `labo`
--
ALTER TABLE `labo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `labo_userid_foreign` (`userId`);

--
-- Index pour la table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Index pour la table `reportroi`
--
ALTER TABLE `reportroi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reportroi_laboid_foreign` (`laboId`);

--
-- Index pour la table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `activitieslist`
--
ALTER TABLE `activitieslist`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `activitybylabo`
--
ALTER TABLE `activitybylabo`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `activityitems`
--
ALTER TABLE `activityitems`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `activityitemvalues`
--
ALTER TABLE `activityitemvalues`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `labo`
--
ALTER TABLE `labo`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `reportroi`
--
ALTER TABLE `reportroi`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `activitybylabo`
--
ALTER TABLE `activitybylabo`
  ADD CONSTRAINT `activitybylabo_activityid_foreign` FOREIGN KEY (`ActivityId`) REFERENCES `activitieslist` (`id`),
  ADD CONSTRAINT `activitybylabo_laboid_foreign` FOREIGN KEY (`laboId`) REFERENCES `labo` (`id`);

--
-- Contraintes pour la table `activityitems`
--
ALTER TABLE `activityitems`
  ADD CONSTRAINT `activityitems_activityid_foreign` FOREIGN KEY (`ActivityId`) REFERENCES `activitieslist` (`id`);

--
-- Contraintes pour la table `activityitemvalues`
--
ALTER TABLE `activityitemvalues`
  ADD CONSTRAINT `activityitemvalues_activitybylaboid_foreign` FOREIGN KEY (`ActivityByLaboId`) REFERENCES `activitybylabo` (`id`),
  ADD CONSTRAINT `activityitemvalues_activityitemid_foreign` FOREIGN KEY (`activityItemId`) REFERENCES `activityitems` (`id`);

--
-- Contraintes pour la table `labo`
--
ALTER TABLE `labo`
  ADD CONSTRAINT `labo_userid_foreign` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `reportroi`
--
ALTER TABLE `reportroi`
  ADD CONSTRAINT `reportroi_laboid_foreign` FOREIGN KEY (`laboId`) REFERENCES `labo` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
