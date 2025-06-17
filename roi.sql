-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 18 juin 2025 à 00:46
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
  `benchmark_min` double DEFAULT NULL,
  `benchmark_max` double DEFAULT NULL,
  `ActivityId` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `activityitems`
--

INSERT INTO `activityitems` (`id`, `Name`, `symbole`, `Type`, `benchmark_min`, `benchmark_max`, `ActivityId`, `created_at`, `updated_at`) VALUES
(1, 'Nombre de médecins recevant des échantillons', 'A', 'number', NULL, NULL, 1, NULL, NULL),
(2, 'Nombre d’échantillons donnés à chaque médecin', 'B', 'number', NULL, NULL, 1, NULL, NULL),
(3, 'Pourcentage des échantillons réellement donnés aux patients', 'D', 'percentage', 0.4, 0.8, 1, NULL, NULL),
(4, 'Nombre moyen d’échantillons donnés par patient', 'E', 'number', 1, 4, 1, NULL, NULL),
(5, 'Pourcentage des patients ayant reçu une prescription après usage de l’échantillon', 'G', 'percentage', 0.4, 0.8, 1, NULL, NULL),
(6, 'Pourcentage des patients prescrits sans échantillon', 'I', 'percentage', 0.2, 0.6, 1, NULL, NULL),
(7, 'Valeur du revenu par patient incrémental en MAD', 'K', 'number', NULL, NULL, 1, NULL, NULL),
(8, 'Coût unitaire d’un échantillon', 'M', 'number', NULL, NULL, 1, NULL, NULL),
(9, 'Coûts fixes du programme', 'N', 'number', NULL, NULL, 1, NULL, NULL),
(10, 'Roi', 'ROI', 'number', 1, 5, 1, NULL, NULL),
(11, 'Nombre de médecins participant à l\'étude', 'A', 'number', NULL, NULL, 2, NULL, NULL),
(12, 'Nombre moyen de patients inscrits par médecin', 'B', 'number', 1, 15, 2, NULL, NULL),
(13, 'Pourcentage moyen de patients qui continuent le traitement après l\'étude', 'D', 'percentage', 0.3, 0.8, 2, NULL, NULL),
(14, 'Nombre de nouveaux patients traités par médecin grâce à l\'étude', 'F', 'number', 1, 10, 2, NULL, NULL),
(15, 'Valeur du revenu par patient incrémental en MAD', 'H', 'number', NULL, NULL, 2, NULL, NULL),
(16, 'Coût variable par médecin', 'J', 'number', NULL, NULL, 2, NULL, NULL),
(17, 'Coût fixe total de l’étude', 'K', 'number', NULL, NULL, 2, NULL, NULL),
(18, 'Roi', 'ROI', 'number', 0.5, 4.5, 2, NULL, NULL),
(19, 'Nombre total de médecins ciblés par l’email', 'A', 'number', NULL, NULL, 3, NULL, NULL),
(20, 'Pourcentage de médecins se rappelant avoir reçu l’email', 'C', 'percentage', NULL, NULL, 3, NULL, NULL),
(21, 'Pourcentage de médecins se rappelant de la marque et du message', 'E', 'percentage', 0.2, 0.6, 3, NULL, NULL),
(22, 'Pourcentage de médecins prescrivant Prexige à de nouveaux patients après réception du message', 'G', 'percentage', 0.2, 0.6, 3, NULL, NULL),
(23, 'Nombre moyen de nouveaux patients mis sous Prexige par médecin', 'I', 'number', 1, 15, 3, NULL, NULL),
(24, 'Valeur du revenu par patient incrémental en MAD', 'K', 'number', NULL, NULL, 3, NULL, NULL),
(25, 'Coût variable par email envoyé', 'M', 'number', NULL, NULL, 3, NULL, NULL),
(26, 'Nombre moyen d’emails envoyés par médecin', 'B', 'number', NULL, NULL, 3, NULL, NULL),
(27, 'Coût fixe total du programme', 'N', 'number', NULL, NULL, 3, NULL, NULL),
(28, 'Roi', 'ROI', 'number', 1, 5, 3, NULL, NULL),
(29, 'Nombre de médecins participants à la conférence', 'A', 'number', NULL, NULL, 4, NULL, NULL),
(30, 'Pourcentage de médecins ayant retenu le message', 'B', 'percentage', 0.5, 0.9, 4, NULL, NULL),
(31, 'Pourcentage de médecins ayant changé positivement leur perception après la conférence', 'D', 'percentage', 0.4, 0.8, 4, NULL, NULL),
(32, 'Pourcentage de ces médecins qui commencent à prescrire à de nouveaux patients', 'F', 'percentage', 0.3, 0.7, 4, NULL, NULL),
(33, 'Nombre moyen de nouveaux patients prescrits par médecin', 'H', 'number', 1, 10, 4, NULL, NULL),
(34, 'Valeur d’ajustement KOL', 'I', 'number', NULL, NULL, 4, NULL, NULL),
(35, 'Valeur du revenu par patient incrémental en MAD', 'J', 'number', NULL, NULL, 4, NULL, NULL),
(36, 'Coût variable par médecin', 'L', 'number', NULL, NULL, 4, NULL, NULL),
(37, 'Coût fixe du programme', 'M', 'number', NULL, NULL, 4, NULL, NULL),
(38, 'Roi', 'ROI', 'number', 0, 4, 4, NULL, NULL),
(39, 'Nombre total de médecins participant', 'A', 'number', NULL, NULL, 5, NULL, NULL),
(40, 'Nombre moyen de tables rondes assistées par médecin par an', 'B', 'number', NULL, NULL, 5, NULL, NULL),
(41, 'Nombre moyen de médecins par table ronde', 'D', 'number', NULL, NULL, 5, NULL, NULL),
(42, '% de médecins ayant changé positivement leur perception', 'F', 'percentage', 0.4, 0.8, 5, NULL, NULL),
(43, '% de médecins influencés qui vont prescrire', 'H', 'percentage', 0.3, 0.7, 5, NULL, NULL),
(44, 'Nombre moyen de nouveaux patients mis sous traitement par médecin', 'J', 'number', 1, 10, 5, NULL, NULL),
(45, 'Valeur du revenu par patient incrémental en MAD', 'L', 'number', NULL, NULL, 5, NULL, NULL),
(46, 'Coût variable par table ronde', 'N', 'number', NULL, NULL, 5, NULL, NULL),
(47, 'Coût fixe total du programme', 'O', 'number', NULL, NULL, 5, NULL, NULL),
(48, 'Roi', 'ROI', 'number', 0, 6, 5, NULL, NULL),
(49, 'Nombre total de médecins ciblés par le représentant', 'A', 'number', NULL, NULL, 6, NULL, NULL),
(50, 'Nombre moyen de visites (détails) par médecin', 'B', 'number', NULL, NULL, 6, NULL, NULL),
(51, '% de médecins se rappelant du message délivré lors de la visite', 'E', 'percentage', NULL, NULL, 6, NULL, NULL),
(52, '% de médecins prescrivant Prexige à de nouveaux patients après avoir reçu le message', 'G', 'percentage', NULL, NULL, 6, NULL, NULL),
(53, 'Nombre moyen de nouveaux patients mis sous Prexige par médecin', 'I', 'number', NULL, NULL, 6, NULL, NULL),
(54, 'Valeur du revenu par patient incrémental en MAD', 'K', 'number', NULL, NULL, 6, NULL, NULL),
(55, 'Coût variable par représentant', 'M1', 'number', NULL, NULL, 6, NULL, NULL),
(56, 'Nombre total de représentants', 'M2', 'number', NULL, NULL, 6, NULL, NULL),
(57, 'Roi', 'ROI', 'number', NULL, NULL, 6, NULL, NULL),
(58, 'Nombre de consommateurs cibles pour la campagne', 'G', 'number', NULL, NULL, 7, NULL, NULL),
(59, '% d\'audience cible atteinte par le plan média', 'H', 'percentage', 0.65, 0.95, 7, NULL, NULL),
(60, '% de consommateurs atteints se rappelant de la campagne (taux de mémorisation)', 'J', 'percentage', 0.3, 0.6, 7, NULL, NULL),
(61, '% de consommateurs se rappelant de la campagne DTC ayant consulté un médecin suite à l\'exposition', 'L', 'percentage', 0.1, 0.3, 7, NULL, NULL),
(62, '% de patients ayant consulté et recevant une prescription Prexige', 'N', 'percentage', 0.1, 0.55, 7, NULL, NULL),
(63, 'Valeur du revenu par patient incrémental en MAD', 'P', 'number', NULL, NULL, 7, NULL, NULL),
(64, 'Dépenses médias (en MAD k)', 'R1', 'number', NULL, NULL, 7, NULL, NULL),
(65, 'Coûts de production, frais d\'agence et autres (en MAD k)', 'S', 'number', NULL, NULL, 7, NULL, NULL),
(66, 'Roi', 'ROI', 'number', 1, 3, 7, NULL, NULL),
(67, 'Population totale', 'A', 'number', NULL, NULL, 8, NULL, NULL),
(68, 'Taux d\'incidence de la maladie dans la population', 'B', 'percentage', NULL, NULL, 8, NULL, NULL),
(69, '% de patients déjà traités et satisfaits', 'D', 'percentage', NULL, NULL, 8, NULL, NULL),
(70, '% de patients potentiels visés par la campagne en ligne', 'F', 'percentage', NULL, NULL, 8, NULL, NULL),
(71, 'Nombre total de visites uniques sur le site', 'H', 'number', NULL, NULL, 8, NULL, NULL),
(72, '% des visiteurs uniques qui passent un temps significatif sur le site', 'J', 'percentage', NULL, NULL, 8, NULL, NULL),
(73, '% des visiteurs uniques ayant consulté un médecin suite au message du site', 'L', 'percentage', NULL, NULL, 8, NULL, NULL),
(74, '% des patients ayant reçu une prescription Prexige', 'N', 'percentage', NULL, NULL, 8, NULL, NULL),
(75, 'Valeur du revenu par patient incrémental en MAD', 'P', 'number', NULL, NULL, 8, NULL, NULL),
(76, 'Coût total du programme e-campagne', 'R', 'number', NULL, NULL, 8, NULL, NULL),
(77, 'Roi', 'ROI', 'number', NULL, NULL, 8, NULL, NULL),
(78, 'Nombre de médecins ayant lu au moins une publication contenant une annonce produit', 'A', 'number', NULL, NULL, 9, NULL, NULL),
(79, 'Nombre total d\'insertions prévues sur l\'année', 'B', 'number', NULL, NULL, 9, NULL, NULL),
(80, 'Pourcentage des médecins lecteurs capables de se souvenir de la marque et du message après exposition', 'C', 'percentage', 0.1, 0.5, 9, NULL, NULL),
(81, 'Pourcentage des médecins ayant mémorisé la publicité qui commencent à prescrire le produit', 'E', 'percentage', 0.02, 0.15, 9, NULL, NULL),
(82, 'Nombre moyen de nouveaux patients mis sous traitement par chaque médecin prescripteur', 'G', 'number', 1, 10, 9, NULL, NULL),
(83, 'Valeur du revenu par patient incrémental en MAD', 'I', 'number', NULL, NULL, 9, NULL, NULL),
(84, 'Coûts d\'achat d\'espace publicitaire pour la campagne presse', 'K', 'number', NULL, NULL, 9, NULL, NULL),
(85, 'Frais de création et de gestion de la campagne', 'L', 'number', NULL, NULL, 9, NULL, NULL),
(86, 'Roi', 'ROI', 'number', 0, 2, 9, NULL, NULL),
(87, 'Nombre de médecins exposés à l\'activité', 'A', 'number', NULL, NULL, 10, NULL, NULL),
(88, 'Pourcentage des médecins capables de se souvenir de la marque et du message', 'B', 'percentage', NULL, NULL, 10, NULL, NULL),
(89, 'Pourcentage des médecins ayant amélioré leur perception du produit', 'D', 'percentage', NULL, NULL, 10, NULL, NULL),
(90, 'Pourcentage des médecins ayant changé de perception et prescrit à de nouveaux patients', 'F', 'percentage', NULL, NULL, 10, NULL, NULL),
(91, 'Nombre moyen de nouveaux patients traités par chaque médecin prescripteur', 'H', 'number', NULL, NULL, 10, NULL, NULL),
(92, 'Valeur du revenu par patient incrémental en MAD', 'J', 'number', NULL, NULL, 10, NULL, NULL),
(93, 'Coût global de l\'organisation et de la mise en œuvre de l\'activité', 'L', 'number', NULL, NULL, 10, NULL, NULL),
(94, 'Roi', 'ROI', 'number', NULL, NULL, 10, NULL, NULL),
(95, 'Nombre de consommateurs exposés à l\'activité', 'A', 'number', NULL, NULL, 11, NULL, NULL),
(96, 'Pourcentage des consommateurs capables de se souvenir du message', 'B', 'percentage', NULL, NULL, 11, NULL, NULL),
(97, 'Pourcentage des consommateurs ayant consulté un médecin', 'D', 'percentage', NULL, NULL, 11, NULL, NULL),
(98, 'Pourcentage des consultations aboutissant à une prescription', 'F', 'percentage', NULL, NULL, 11, NULL, NULL),
(99, 'Valeur du revenu par patient incrémental en MAD', 'H', 'number', NULL, NULL, 11, NULL, NULL),
(100, 'Coût global de l\'organisation et de la mise en œuvre de l\'activité', 'J', 'number', NULL, NULL, 11, NULL, NULL),
(101, 'Roi', 'ROI', 'number', NULL, NULL, 11, NULL, NULL),
(102, 'Nombre de médecins susceptibles de prescrire le produit', 'A', 'number', NULL, NULL, 12, NULL, NULL),
(103, 'Pourcentage des médecins utilisant internet pour des informations professionnelles', 'B', 'percentage', NULL, NULL, 12, NULL, NULL),
(104, 'Nombre total de visites uniques sur le site', 'D', 'number', NULL, NULL, 12, NULL, NULL),
(105, 'Pourcentage de visiteurs uniques ayant interagi davantage avec le contenu', 'F', 'percentage', NULL, NULL, 12, NULL, NULL),
(106, 'Pourcentage des médecins informés ayant changé positivement leur perception du produit', 'H', 'percentage', NULL, NULL, 12, NULL, NULL),
(107, 'Pourcentage des médecins ayant changé leur perception et qui sont susceptibles de prescrire le produit', 'J', 'percentage', NULL, NULL, 12, NULL, NULL),
(108, 'Nombre moyen de nouveaux patients par médecin ayant prescrit le produit', 'L', 'number', 1, 10, 12, NULL, NULL),
(109, 'Valeur du revenu par patient incrémental en MAD', 'N', 'number', NULL, NULL, 12, NULL, NULL),
(110, 'Coût total du programme e-digital', 'P', 'number', NULL, NULL, 12, NULL, NULL),
(111, 'Roi', 'ROI', 'number', NULL, NULL, 12, NULL, NULL);

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
  `formulat` text NOT NULL,
  `ActivityId` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `calculationformula`
--

INSERT INTO `calculationformula` (`id`, `formulat`, `ActivityId`, `created_at`, `updated_at`) VALUES
(1, '{\"nombre_total_echantillons_distribues\":\"A * B\",\"nombre_total_patients_recu_echantillon\":\"nombre_total_echantillons_distribues * D \\/ E\",\"patients_ordonnes_apres_echantillon\":\"nombre_total_patients_recu_echantillon * G\",\"patients_ordonnes_sans_echantillon\":\"patients_ordonnes_apres_echantillon * I\",\"patients_incrementaux\":\"patients_ordonnes_apres_echantillon * (1 - I)\",\"ventes_incrementales\":\"patients_incrementaux * K\",\"cout_variable\":\"M * nombre_total_echantillons_distribues\",\"cout_total\":\"cout_variable + N\",\"roi\":\"ventes_incrementales \\/ cout_total\"}', 1, NULL, NULL),
(2, '{\"nombre_total_patients_inscrits\":\"A * B\",\"patients_continuant_traitement\":\"B * D\",\"patients_incrementaux\":\"A * (patients_continuant_traitement + F)\",\"ventes_incrementales\":\"patients_incrementaux * H\",\"cout_total\":\"(J * A) + K\",\"roi\":\"ventes_incrementales \\/ cout_total\"}', 2, NULL, NULL),
(3, '{\"medecins_rappeles_email\":\"A * C\",\"medecins_rappeles_marque\":\"medecins_rappeles_email * E\",\"medecins_prescrivant\":\"medecins_rappeles_marque * G\",\"patients_incrementaux\":\"medecins_prescrivant * I\",\"ventes_incrementales\":\"patients_incrementaux * K\",\"cout_total\":\"(M * A * B) + N\",\"roi\":\"ventes_incrementales \\/ cout_total\"}', 3, NULL, NULL),
(4, '{\"medecins_rappeles_message\":\"A * B\",\"medecins_perception_positive\":\"medecins_rappeles_message * D\",\"medecins_prescrivant\":\"medecins_perception_positive * F\",\"patients_incrementaux\":\"(medecins_prescrivant * H) + I\",\"ventes_incrementales\":\"patients_incrementaux * J\",\"cout_total\":\"(L * A) + M\",\"roi\":\"ventes_incrementales \\/ cout_total\"}', 4, NULL, NULL),
(5, '{\"nombre_total_contacts_medecins\":\"A * B\",\"nombre_total_tables_rondes\":\"nombre_total_contacts_medecins \\/ D\",\"medecins_perception_positive\":\"A * F\",\"medecins_prescrivant\":\"medecins_perception_positive * H\",\"patients_incrementaux\":\"medecins_prescrivant * J\",\"ventes_incrementales\":\"patients_incrementaux * L\",\"cout_total\":\"(N * nombre_total_tables_rondes) + O\",\"roi\":\"ventes_incrementales \\/ cout_total\"}', 5, NULL, NULL),
(6, '{\"nombre_total_visites\":\"A * B\",\"medecins_rappeles_message\":\"A * E\",\"medecins_prescrivant\":\"medecins_rappeles_message * G\",\"patients_incrementaux\":\"medecins_prescrivant * I\",\"ventes_incrementales\":\"patients_incrementaux * K\",\"cout_total\":\"M1 * M2\",\"roi\":\"ventes_incrementales \\/ cout_total\"}', 6, NULL, NULL),
(7, '{\"consommateurs_atteints\":\"G * H\",\"consommateurs_rappeles_campagne\":\"consommateurs_atteints * J\",\"consommateurs_consulte_medecin\":\"consommateurs_rappeles_campagne * L\",\"patients_incrementaux\":\"consommateurs_consulte_medecin * N\",\"ventes_incrementales\":\"patients_incrementaux * P\",\"cout_total\":\"R1 + S\",\"roi\":\"ventes_incrementales \\/ cout_total\"}', 7, NULL, NULL),
(8, '{\"nombre_total_patients_maladie\":\"A * B\",\"patients_potentiels\":\"nombre_total_patients_maladie * (1 - D)\",\"patients_cibles\":\"patients_potentiels * F\",\"efficacite_atteinte\":\"H \\/ patients_cibles\",\"visiteurs_interesses\":\"H * J\",\"visiteurs_consulte_medecin\":\"visiteurs_interesses * L\",\"patients_incrementaux\":\"visiteurs_consulte_medecin * N\",\"ventes_incrementales\":\"patients_incrementaux * P\",\"cout_total\":\"R\",\"roi\":\"ventes_incrementales \\/ cout_total\"}', 8, NULL, NULL),
(9, '{\"medecins_rappeles_annonce\":\"A * C\",\"medecins_prescrivant\":\"medecins_rappeles_annonce * E\",\"patients_incrementaux\":\"medecins_prescrivant * G\",\"ventes_incrementales\":\"patients_incrementaux * I\",\"cout_total\":\"K + L\",\"roi\":\"ventes_incrementales \\/ cout_total\"}', 9, NULL, NULL),
(10, '{\"medecins_rappeles_message\":\"A * B\",\"medecins_perception_positive\":\"medecins_rappeles_message * D\",\"medecins_prescrivant\":\"medecins_perception_positive * F\",\"patients_incrementaux\":\"medecins_prescrivant * H\",\"ventes_incrementales\":\"patients_incrementaux * J\",\"cout_total\":\"L\",\"roi\":\"ventes_incrementales \\/ cout_total\"}', 10, NULL, NULL),
(11, '{\"consommateurs_rappeles_message\":\"A * B\",\"consommateurs_consulte_medecin\":\"consommateurs_rappeles_message * D\",\"patients_incrementaux\":\"consommateurs_consulte_medecin * F\",\"ventes_incrementales\":\"patients_incrementaux * H\",\"cout_total\":\"J\",\"roi\":\"ventes_incrementales \\/ cout_total\"}', 11, NULL, NULL),
(12, '{\"medecins_joignables_en_ligne\":\"A * B\",\"efficacite_atteinte\":\"D \\/ medecins_joignables_en_ligne\",\"medecins_engages\":\"D * F\",\"medecins_perception_positive\":\"medecins_engages * H\",\"medecins_prescrivant\":\"medecins_perception_positive * J\",\"patients_incrementaux\":\"medecins_prescrivant * L\",\"ventes_incrementales\":\"patients_incrementaux * N\",\"cout_total\":\"P\",\"roi\":\"ventes_incrementales \\/ cout_total\"}', 12, NULL, NULL);

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
  `valeur_patient_incremente` double DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `labo`
--

INSERT INTO `labo` (`id`, `Name`, `userId`, `valeur_patient_incremente`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Labo Exemple 1', 5, NULL, 'Activated', '2025-06-17 21:44:59', '2025-06-17 21:44:59'),
(2, 'Labo Example 2', 6, NULL, 'Activated', '2025-06-17 21:44:59', '2025-06-17 21:44:59');

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
(1, 'Ibrahim', 'Benmagha', 'benmagha@gmail.com', '$2y$12$4JqjJhrq6f3V.hdUue1rIuPE757ZJbwlAQEsp.SjCatCZJ0mrukx.', NULL, NULL, NULL, 'Admin', NULL, NULL, NULL, NULL),
(2, 'said', 'taghmaoui', 'said@gmail.com', '$2y$12$Z/WDZiL17BmjMq6Xl1VvV.2.Yie7W2xYC9EJx8FcbioVfbXIv8kYK', NULL, NULL, NULL, 'Admin', NULL, NULL, NULL, NULL),
(3, 'Rachid', 'katorza', 'Rachid@gmail.com', '$2y$12$ZX7DCpZfx4QzkJJ3agC8MefEca/tTo7v/26txket7pDI7t/fvqSZG', NULL, NULL, NULL, 'Admin', NULL, NULL, NULL, NULL),
(4, 'Yasser', 'Eddaoussari', 'Yasser@gmail.com', '$2y$12$CwKQlqYwtqOJMWKcFGAKYerdGqMVUHaCPg6GFW6wR6cfILzPr.wzO', NULL, NULL, NULL, 'Admin', NULL, NULL, NULL, NULL),
(5, 'Mark', 'Lermon', 'Mark.Lermon@gmail.com', '$2y$12$eU38PlH0Ujx4RAUf9fjY8uBSvuDD7QM9pwHCOlhVgrx7Mp3AQ1.0y', NULL, NULL, NULL, 'Laboratoire', NULL, NULL, '2025-06-17 21:44:59', '2025-06-17 21:44:59'),
(6, 'John', 'Doe', 'john.doe@example.com', '$2y$12$U3skOK7Kz8z1Ci8KiqYZ2ul1LutoApE4s9t.CPxF/SxbKmAf5Y7Je', NULL, NULL, NULL, 'Laboratoire', NULL, NULL, '2025-06-17 21:44:59', '2025-06-17 21:44:59');

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=112;

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
