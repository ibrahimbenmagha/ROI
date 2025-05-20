-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 19 mai 2025 à 15:56
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
  `is_custom` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `activitieslist`
--

INSERT INTO `activitieslist` (`id`, `Name`, `is_custom`, `created_at`, `updated_at`) VALUES
(1, 'Distribution des échantillons', 0, NULL, NULL),
(2, 'Essai clinique', 0, NULL, NULL),
(3, 'Mailing', 0, NULL, NULL),
(4, 'Conférences', 0, NULL, NULL),
(5, 'Tables rondes', 0, NULL, NULL),
(6, 'Visites médicales', 0, NULL, NULL),
(7, 'Publicité directe au consommateur', 0, NULL, NULL),
(8, 'Publicité directe au consommateur en ligne', 0, NULL, NULL),
(9, 'Publicité dans les revues', 0, NULL, NULL),
(10, 'Générique (Médecins)', 0, NULL, NULL),
(11, 'Générique (Patients)', 0, NULL, NULL),
(12, 'Promotion numérique pour les médecins', 0, NULL, NULL);

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
  `symbole` varchar(255) DEFAULT NULL,
  `Type` enum('percentage','number') NOT NULL,
  `ActivityId` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `activityitems`
--

INSERT INTO `activityitems` (`id`, `Name`, `symbole`, `Type`, `ActivityId`, `created_at`, `updated_at`) VALUES
(1, 'Nombre de médecins recevant des échantillons', 'A', 'number', 1, NULL, NULL),
(2, 'Nombre d’échantillons donnés à chaque médecin', 'B', 'number', 1, NULL, NULL),
(3, 'Pourcentage des échantillons réellement donnés aux patients', 'D', 'percentage', 1, NULL, NULL),
(4, 'Nombre moyen d’échantillons donnés par patient', 'E', 'number', 1, NULL, NULL),
(5, 'Pourcentage des patients ayant reçu une prescription après usage de l’échantillon', 'G', 'percentage', 1, NULL, NULL),
(6, 'Pourcentage des patients prescrits sans échantillon', 'I', 'percentage', 1, NULL, NULL),
(7, 'Valeur moyenne d’un patient incrémental en MAD', 'K', 'number', 1, NULL, NULL),
(8, 'Coût unitaire d’un échantillon', 'M', 'number', 1, NULL, NULL),
(9, 'Coûts fixes du programme', 'N', 'number', 1, NULL, NULL),
(10, 'Roi', NULL, 'number', 1, NULL, NULL),
(11, 'Nombre de médecins participant à l\'étude', 'A', 'number', 2, NULL, NULL),
(12, 'Nombre moyen de patients inscrits par médecin', 'B', 'number', 2, NULL, NULL),
(13, 'Pourcentage moyen de patients qui continuent le traitement après l\'étude', 'D', 'percentage', 2, NULL, NULL),
(14, 'Nombre de nouveaux patients traités par médecin grâce à l\'étude', 'F', 'number', 2, NULL, NULL),
(15, 'Valeur du revenu par patient incrémental', 'H', 'number', 2, NULL, NULL),
(16, 'Coût variable par médecin', 'J', 'number', 2, NULL, NULL),
(17, 'Coût fixe total de l’étude', 'K', 'number', 2, NULL, NULL),
(18, 'Roi', NULL, 'number', 2, NULL, NULL),
(19, 'Nombre total de médecins ciblés par l’email', 'A', 'number', 3, NULL, NULL),
(20, 'Pourcentage de médecins se rappelant avoir reçu l’email', 'C', 'percentage', 3, NULL, NULL),
(21, 'Pourcentage de médecins se rappelant de la marque et du message', 'E', 'percentage', 3, NULL, NULL),
(22, 'Pourcentage de médecins prescrivant Prexige à de nouveaux patients après réception du message', 'G', 'percentage', 3, NULL, NULL),
(23, 'Nombre moyen de nouveaux patients mis sous Prexige par médecin', 'I', 'number', 3, NULL, NULL),
(24, 'Valeur du revenu par patient incrémental', 'K', 'number', 3, NULL, NULL),
(25, 'Coût variable par email envoyé', 'M', 'number', 3, NULL, NULL),
(26, 'Nombre moyen d’emails envoyés par médecin', 'B', 'number', 3, NULL, NULL),
(27, 'Coût fixe total du programme', 'N', 'number', 3, NULL, NULL),
(28, 'Roi', NULL, 'number', 3, NULL, NULL),
(29, 'Nombre de médecins participants à la conférence', 'A', 'number', 4, NULL, NULL),
(30, 'Pourcentage de médecins ayant retenu le message', 'B', 'percentage', 4, NULL, NULL),
(31, 'Pourcentage de médecins ayant changé positivement leur perception après la conférence', 'D', 'percentage', 4, NULL, NULL),
(32, 'Pourcentage de ces médecins qui commencent à prescrire à de nouveaux patients', 'F', 'percentage', 4, NULL, NULL),
(33, 'Nombre moyen de nouveaux patients prescrits par médecin', 'H', 'number', 4, NULL, NULL),
(34, 'Valeur d’ajustement KOL', 'I', 'number', 4, NULL, NULL),
(35, 'Valeur de revenu générée par patient incrémental', 'J', 'number', 4, NULL, NULL),
(36, 'Coût variable par médecin', 'L', 'number', 4, NULL, NULL),
(37, 'Coût fixe du programme', 'M', 'number', 4, NULL, NULL),
(38, 'Roi', NULL, 'number', 4, NULL, NULL),
(39, 'Nombre total de médecins participant', 'A', 'number', 5, NULL, NULL),
(40, 'Nombre moyen de tables rondes assistées par médecin par an', 'B', 'number', 5, NULL, NULL),
(41, 'Nombre moyen de médecins par table ronde', 'D', 'number', 5, NULL, NULL),
(42, '% de médecins ayant changé positivement leur perception', 'F', 'percentage', 5, NULL, NULL),
(43, '% de médecins influencés qui vont prescrire', 'H', 'percentage', 5, NULL, NULL),
(44, 'Nombre moyen de nouveaux patients mis sous traitement par médecin', 'J', 'number', 5, NULL, NULL),
(45, 'Valeur du revenu par patient incrémental', 'L', 'number', 5, NULL, NULL),
(46, 'Coût variable par table ronde', 'N', 'number', 5, NULL, NULL),
(47, 'Coût fixe total du programme', 'O', 'number', 5, NULL, NULL),
(48, 'Roi', NULL, 'number', 5, NULL, NULL),
(49, 'Nombre total de médecins ciblés par le représentant', 'A', 'number', 6, NULL, NULL),
(50, 'Nombre moyen de visites (détails) par médecin', 'B', 'number', 6, NULL, NULL),
(51, '% de médecins se rappelant du message délivré lors de la visite', 'E', 'percentage', 6, NULL, NULL),
(52, '% de médecins prescrivant Prexige à de nouveaux patients après avoir reçu le message', 'G', 'percentage', 6, NULL, NULL),
(53, 'Nombre moyen de nouveaux patients mis sous Prexige par médecin', 'I', 'number', 6, NULL, NULL),
(54, 'Valeur du revenu par patient incrémental', 'K', 'number', 6, NULL, NULL),
(55, 'Coût variable par représentant', 'M1', 'number', 6, NULL, NULL),
(56, 'Nombre total de représentants', 'M2', 'number', 6, NULL, NULL),
(57, 'Roi', NULL, 'number', 6, NULL, NULL);

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
-- Structure de la table `admins`
--

CREATE TABLE `admins` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `userId` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `calculationformula`
--

CREATE TABLE `calculationformula` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `fomulat` text NOT NULL,
  `ActivityId` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `calculationformula`
--

INSERT INTO `calculationformula` (`id`, `fomulat`, `ActivityId`, `created_at`, `updated_at`) VALUES
(1, '{\"total_samples_distributed\":\"A * B\",\"total_patients_received_samples\":\"total_samples_distributed * D \\/ E\",\"patients_prescribed_after_sample\":\"total_patients_received_samples * G\",\"patients_prescribed_without_sample\":\"patients_prescribed_after_sample * I\",\"incremental_patients\":\"patients_prescribed_after_sample * (1 - I)\",\"incremental_sales\":\"incremental_patients * K\",\"variable_cost\":\"M * total_samples_distributed\",\"total_cost\":\"variable_cost + N\",\"roi\":\"incremental_sales \\/ total_cost\"}', 1, NULL, NULL),
(2, '{\"total_patients_enrolled\":\"A * B\",\"patients_continuing_treatment\":\"B * D\",\"incremental_patients\":\"A * (patients_continuing_treatment + F)\",\"incremental_sales\":\"incremental_patients * H\",\"total_cost\":\"(J * A) + K\",\"roi\":\"incremental_sales \\/ total_cost\"}', 2, NULL, NULL),
(3, '{\"doctors_recalled_email\":\"A * C\",\"doctors_recalled_brand\":\"doctors_recalled_email * E\",\"doctors_prescribing\":\"doctors_recalled_brand * G\",\"incremental_patients\":\"doctors_prescribing * I\",\"incremental_sales\":\"incremental_patients * K\",\"total_cost\":\"(M * A * B) + N\",\"roi\":\"incremental_sales \\/ total_cost\"}', 3, NULL, NULL),
(4, '{\"doctors_retained_message\":\"A * B\",\"doctors_positive_perception\":\"doctors_retained_message * D\",\"doctors_prescribing\":\"doctors_positive_perception * F\",\"incremental_patients\":\"(doctors_prescribing * H) + I\",\"incremental_sales\":\"incremental_patients * J\",\"total_cost\":\"(L * A) + M\",\"roi\":\"incremental_sales \\/ total_cost\"}', 4, NULL, NULL),
(5, '{\"total_doctor_contacts\":\"A * B\",\"total_roundtables\":\"total_doctor_contacts \\/ D\",\"doctors_positive_perception\":\"A * F\",\"doctors_prescribing\":\"doctors_positive_perception * H\",\"incremental_patients\":\"doctors_prescribing * J\",\"incremental_sales\":\"incremental_patients * L\",\"total_cost\":\"(N * total_roundtables) + O\",\"roi\":\"incremental_sales \\/ total_cost\"}', 5, NULL, NULL),
(6, '{\"total_visits\":\"A * B\",\"doctors_recalled_message\":\"A * E\",\"doctors_prescribing\":\"doctors_recalled_message * G\",\"incremental_patients\":\"doctors_prescribing * I\",\"incremental_sales\":\"incremental_patients * K\",\"total_cost\":\"M1 * M2\",\"roi\":\"incremental_sales \\/ total_cost\"}', 6, NULL, NULL),
(7, '{\"consumers_reached\":\"G * H\",\"consumers_recalled_campaign\":\"consumers_reached * J\",\"consumers_consulted_doctor\":\"consumers_recalled_campaign * L\",\"incremental_patients\":\"consumers_consulted_doctor * N\",\"incremental_sales\":\"incremental_patients * P\",\"total_cost\":\"R1 + S\",\"roi\":\"incremental_sales \\/ total_cost\"}', 7, NULL, NULL),
(8, '{\"total_patients_affected\":\"A * B\",\"potential_patients\":\"total_patients_affected * (1 - D)\",\"targeted_patients\":\"potential_patients * F\",\"reach_efficiency\":\"H \\/ targeted_patients\",\"interested_visitors\":\"H * J\",\"visitors_consulted_doctor\":\"interested_visitors * L\",\"incremental_patients\":\"visitors_consulted_doctor * N\",\"incremental_sales\":\"incremental_patients * P\",\"total_cost\":\"R\",\"roi\":\"incremental_sales \\/ total_cost\"}', 8, NULL, NULL),
(9, '{\"doctors_recalled_ad\":\"A * C\",\"doctors_prescribing\":\"doctors_recalled_ad * E\",\"incremental_patients\":\"doctors_prescribing * G\",\"incremental_sales\":\"incremental_patients * I\",\"total_cost\":\"K + L\",\"roi\":\"incremental_sales \\/ total_cost\"}', 9, NULL, NULL),
(10, '{\"doctors_recalled_message\":\"A * B\",\"doctors_positive_perception\":\"doctors_recalled_message * D\",\"doctors_prescribing\":\"doctors_positive_perception * F\",\"incremental_patients\":\"doctors_prescribing * H\",\"incremental_sales\":\"incremental_patients * J\",\"total_cost\":\"L\",\"roi\":\"incremental_sales \\/ total_cost\"}', 10, NULL, NULL),
(11, '{\"consumers_recalled_message\":\"A * B\",\"consumers_consulted_doctor\":\"consumers_recalled_message * D\",\"incremental_patients\":\"consumers_consulted_doctor * F\",\"incremental_sales\":\"incremental_patients * H\",\"total_cost\":\"J\",\"roi\":\"incremental_sales \\/ total_cost\"}', 11, NULL, NULL),
(12, '{\"doctors_reachable_online\":\"A * B\",\"reach_efficiency\":\"D \\/ doctors_reachable_online\",\"doctors_engaged\":\"D * F\",\"doctors_positive_perception\":\"doctors_engaged * H\",\"doctors_prescribing\":\"doctors_positive_perception * J\",\"incremental_patients\":\"doctors_prescribing * L\",\"incremental_sales\":\"incremental_patients * N\",\"total_cost\":\"P\",\"roi\":\"incremental_sales \\/ total_cost\"}', 12, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
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

--
-- Déchargement des données de la table `labo`
--

INSERT INTO `labo` (`id`, `Name`, `userId`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Labo Exemple 1', 5, 'Activated', '2025-05-19 12:55:45', '2025-05-19 12:55:45'),
(2, 'Labo Example 2', 6, 'Activated', '2025-05-19 12:55:45', '2025-05-19 12:55:45');

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
(2, '01_labo', 1),
(3, '02_activities_list', 1),
(4, '03_activity_items', 1),
(5, '04_activity_by_labo', 1),
(6, '05_activity_item_value', 1),
(7, '06_rapport_ROI', 1),
(8, '07_admins', 1),
(9, '08_calculatiuon_formula', 1),
(10, '09_create_cache_table', 1),
(11, '10_create_jobs_table', 1),
(12, '11_add_two_factor_columns_to_users_table', 1),
(13, '12_create_personal_access_tokens_table', 1);

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
-- Structure de la table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
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
  `two_factor_secret` text DEFAULT NULL,
  `two_factor_recovery_codes` text DEFAULT NULL,
  `two_factor_confirmed_at` timestamp NULL DEFAULT NULL,
  `Role` varchar(20) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `FirstName`, `LastName`, `email`, `password`, `two_factor_secret`, `two_factor_recovery_codes`, `two_factor_confirmed_at`, `Role`, `email_verified_at`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Ibrahim', 'Benmagha', 'benmagha@gmail.com', '$2y$12$tB7E1UJWdZC4yMpNAEDH7.7CXY34D9M8vxlscPH.sY.iAwKEUdoNW', NULL, NULL, NULL, 'Admin', NULL, NULL, NULL, NULL),
(2, 'said', 'taghmaoui', 'said@gmail.com', '$2y$12$W4TRR1QNkJQMe8zYRihdRuq7V5wmiuLW73Enw34N0YV08MmGn3KPC', NULL, NULL, NULL, 'Admin', NULL, NULL, NULL, NULL),
(3, 'Rachid', 'katorza', 'Rachid@gmail.com', '$2y$12$MQxo9LtOIV4XIk6uPBnR.ubxCpOLTlfyovPHnwAK1rOmVUTOz3iTi', NULL, NULL, NULL, 'Admin', NULL, NULL, NULL, NULL),
(4, 'Yasser', 'Eddaoussari', 'Yasser@gmail.com', '$2y$12$4pc5KrUhZxbCxCRcgWMsnu6h4Owfj1.Gw7AWQaZk9hxGEHtONBjTu', NULL, NULL, NULL, 'Admin', NULL, NULL, NULL, NULL),
(5, 'Mark', 'Lermon', 'Mark.Lermon@gmail.com', '$2y$12$NrhnY8KUE0.i4wZF1GrND.5gpoijD6VzuwFqxFtUkHvqLJ66v0O7O', NULL, NULL, NULL, 'Laboratoire', NULL, NULL, '2025-05-19 12:55:45', '2025-05-19 12:55:45'),
(6, 'John', 'Doe', 'john.doe@example.com', '$2y$12$n1iRE0YxuJSEje8lklUiVuRwIhmQv1ccjkhgR4qUnyX28Yz6yUkZG', NULL, NULL, NULL, 'Laboratoire', NULL, NULL, '2025-05-19 12:55:45', '2025-05-19 12:55:45');

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
-- Index pour la table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD KEY `admins_userid_foreign` (`userId`);

--
-- Index pour la table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Index pour la table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Index pour la table `calculationformula`
--
ALTER TABLE `calculationformula`
  ADD PRIMARY KEY (`id`),
  ADD KEY `calculationformula_activityid_foreign` (`ActivityId`);

--
-- Index pour la table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Index pour la table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Index pour la table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

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
-- Index pour la table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT pour la table `activityitemvalues`
--
ALTER TABLE `activityitemvalues`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `calculationformula`
--
ALTER TABLE `calculationformula`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `labo`
--
ALTER TABLE `labo`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT pour la table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `reportroi`
--
ALTER TABLE `reportroi`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

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
-- Contraintes pour la table `admins`
--
ALTER TABLE `admins`
  ADD CONSTRAINT `admins_userid_foreign` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `calculationformula`
--
ALTER TABLE `calculationformula`
  ADD CONSTRAINT `calculationformula_activityid_foreign` FOREIGN KEY (`ActivityId`) REFERENCES `activitieslist` (`id`);

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
