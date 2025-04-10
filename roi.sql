-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 02 avr. 2025 à 17:46
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
  `is_calculated` tinyint(1) NOT NULL DEFAULT 0,
  `year` year(4) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `activitybylabo`
--

INSERT INTO `activitybylabo` (`id`, `laboId`, `ActivityId`, `is_calculated`, `year`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 0, '2026', NULL, NULL),
(2, 1, 2, 0, '2026', NULL, NULL),
(3, 1, 3, 0, '2026', NULL, NULL),
(4, 1, 4, 0, '2026', NULL, NULL),
(5, 1, 5, 0, '2026', NULL, NULL),
(6, 1, 6, 0, '2026', NULL, NULL),
(7, 1, 7, 0, '2026', NULL, NULL),
(8, 1, 8, 0, '2026', NULL, NULL),
(9, 1, 9, 0, '2026', NULL, NULL),
(10, 1, 10, 0, '2026', NULL, NULL),
(11, 1, 11, 0, '2026', NULL, NULL),
(12, 1, 12, 0, '2026', NULL, NULL),
(13, 2, 1, 0, '2026', NULL, NULL),
(14, 2, 2, 0, '2026', NULL, NULL),
(15, 2, 3, 0, '2026', NULL, NULL),
(16, 2, 4, 0, '2026', NULL, NULL),
(17, 2, 5, 0, '2026', NULL, NULL),
(18, 2, 6, 0, '2026', NULL, NULL),
(19, 2, 7, 0, '2026', NULL, NULL),
(20, 2, 8, 0, '2026', NULL, NULL),
(21, 2, 9, 0, '2026', NULL, NULL),
(22, 2, 10, 0, '2026', NULL, NULL),
(23, 2, 11, 0, '2026', NULL, NULL),
(24, 2, 12, 0, '2026', NULL, NULL),
(25, 1, 1, 0, '2027', NULL, NULL),
(26, 1, 2, 0, '2027', NULL, NULL),
(27, 1, 3, 0, '2027', NULL, NULL),
(28, 1, 4, 0, '2027', NULL, NULL),
(29, 1, 5, 0, '2027', NULL, NULL),
(30, 1, 6, 0, '2027', NULL, NULL),
(31, 1, 7, 0, '2027', NULL, NULL),
(32, 1, 8, 0, '2027', NULL, NULL),
(33, 1, 9, 0, '2027', NULL, NULL),
(34, 1, 10, 0, '2027', NULL, NULL),
(35, 1, 11, 0, '2027', NULL, NULL),
(36, 1, 12, 0, '2027', NULL, NULL),
(37, 2, 1, 0, '2027', NULL, NULL),
(38, 2, 2, 0, '2027', NULL, NULL),
(39, 2, 3, 0, '2027', NULL, NULL),
(40, 2, 4, 0, '2027', NULL, NULL),
(41, 2, 5, 0, '2027', NULL, NULL),
(42, 2, 6, 0, '2027', NULL, NULL),
(43, 2, 7, 0, '2027', NULL, NULL),
(44, 2, 8, 0, '2027', NULL, NULL),
(45, 2, 9, 0, '2027', NULL, NULL),
(46, 2, 10, 0, '2027', NULL, NULL),
(47, 2, 11, 0, '2027', NULL, NULL),
(48, 2, 12, 0, '2027', NULL, NULL);

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

--
-- Déchargement des données de la table `activityitems`
--

INSERT INTO `activityitems` (`id`, `Name`, `ActivityId`, `created_at`, `updated_at`) VALUES
(1, 'Nombre de médecins recevant des échantillons', 1, NULL, NULL),
(2, 'Nombre d’échantillons donnés à chaque médecin', 1, NULL, NULL),
(3, 'Pourcentage des échantillons réellement donnés aux patients', 1, NULL, NULL),
(4, 'Nombre moyen d’échantillons donnés par patient', 1, NULL, NULL),
(5, 'Pourcentage des patients ayant reçu une prescription après usage de l’échantillon', 1, NULL, NULL),
(6, 'Pourcentage des patients prescrits sans échantillon', 1, NULL, NULL),
(7, 'Valeur moyenne d’un patient incrémental en MAD', 1, NULL, NULL),
(8, 'Coût unitaire d’un échantillon', 1, NULL, NULL),
(9, 'Coûts fixes du programme', 1, NULL, NULL),
(10, 'Roi de de l\'activite 1', 1, NULL, NULL),
(11, 'Nombre de médecins participant à l\'étude', 2, NULL, NULL),
(12, 'Nombre moyen de patients inscrits par médecin', 2, NULL, NULL),
(13, 'Pourcentage moyen de patients qui continuent le traitement après l\'étude', 2, NULL, NULL),
(14, 'Nombre de nouveaux patients traités par médecin grâce à l\'étude', 2, NULL, NULL),
(15, 'Valeur du revenu par patient incrémental', 2, NULL, NULL),
(16, 'Coût variable par médecin', 2, NULL, NULL),
(17, 'Coût fixe total de l’étude', 2, NULL, NULL),
(18, 'Roi de de l\'activite 2', 2, NULL, NULL),
(19, 'Nombre total de médecins ciblés par l’email', 3, NULL, NULL),
(20, 'Pourcentage de médecins se rappelant avoir reçu l’email', 3, NULL, NULL),
(21, 'Pourcentage de médecins se rappelant de la marque et du message', 3, NULL, NULL),
(22, 'Pourcentage de médecins prescrivant Prexige à de nouveaux patients après réception du message', 3, NULL, NULL),
(23, 'Nombre moyen de nouveaux patients mis sous Prexige par médecin', 3, NULL, NULL),
(24, 'Valeur du revenu par patient incrémental', 3, NULL, NULL),
(25, 'Coût variable par email envoyé', 3, NULL, NULL),
(26, 'Nombre moyen d’emails envoyés par médecin', 3, NULL, NULL),
(27, 'Coût fixe total du programme', 3, NULL, NULL),
(28, 'Roi de de l\'activite 3', 3, NULL, NULL),
(29, 'Nombre de médecins participants à la conférence', 4, NULL, NULL),
(30, 'Pourcentage de médecins ayant retenu le message', 4, NULL, NULL),
(31, 'Pourcentage de médecins ayant changé positivement leur perception après la conférence', 4, NULL, NULL),
(32, 'Pourcentage de ces médecins qui commencent à prescrire à de nouveaux patients', 4, NULL, NULL),
(33, 'Nombre moyen de nouveaux patients prescrits par médecin', 4, NULL, NULL),
(34, 'Valeur d’ajustement KOL', 4, NULL, NULL),
(35, 'Valeur de revenu générée par patient incrémental', 4, NULL, NULL),
(36, 'Coût variable par médecin', 4, NULL, NULL),
(37, 'Coût fixe du programme', 4, NULL, NULL),
(38, 'Roi de de l\'activite 4', 4, NULL, NULL),
(39, 'Nombre total de médecins participant', 5, NULL, NULL),
(40, 'Nombre moyen de tables rondes assistées par médecin par an', 5, NULL, NULL),
(41, 'Nombre moyen de médecins par table ronde', 5, NULL, NULL),
(42, '% de médecins ayant changé positivement leur perception', 5, NULL, NULL),
(43, '% de médecins influencés qui vont prescrire', 5, NULL, NULL),
(44, 'Nombre moyen de nouveaux patients mis sous traitement par médecin', 5, NULL, NULL),
(45, 'Valeur du revenu par patient incrémental', 5, NULL, NULL),
(46, 'Coût variable par table ronde', 5, NULL, NULL),
(47, 'Coût fixe total du programme', 5, NULL, NULL),
(48, 'Roi de de l\'activite 5', 5, NULL, NULL),
(49, 'Nombre total de médecins ciblés par le représentant', 6, NULL, NULL),
(50, 'Nombre moyen de visites (détails) par médecin', 6, NULL, NULL),
(51, '% de médecins se rappelant du message délivré lors de la visite', 6, NULL, NULL),
(52, '% de médecins prescrivant Prexige à de nouveaux patients après avoir reçu le message', 6, NULL, NULL),
(53, 'Nombre moyen de nouveaux patients mis sous Prexige par médecin', 6, NULL, NULL),
(54, 'Valeur du revenu par patient incrémental', 6, NULL, NULL),
(55, 'Coût variable par représentant', 6, NULL, NULL),
(56, 'Nombre total de représentants', 6, NULL, NULL),
(57, 'Roi de de l\'activite 6', 6, NULL, NULL),
(58, 'Nombre de consommateurs cibles pour la campagne', 7, NULL, NULL),
(59, '% d’audience cible atteinte par le plan média', 7, NULL, NULL),
(60, '% de consommateurs atteints se rappelant de la campagne (taux de mémorisation)', 7, NULL, NULL),
(61, '% de consommateurs se rappelant de la campagne DTC ayant consulté un médecin suite à l’exposition', 7, NULL, NULL),
(62, '% de patients ayant consulté et recevant une prescription Prexige', 7, NULL, NULL),
(63, 'Valeur du revenu par patient incrémental', 7, NULL, NULL),
(64, 'Dépenses médias (en MAD k)', 7, NULL, NULL),
(65, 'Coûts de production, frais d’agence et autres (en MAD k)', 7, NULL, NULL),
(66, 'Roi de de l\'activite 7', 7, NULL, NULL),
(67, 'Population totale', 8, NULL, NULL),
(68, 'Taux d’incidence de la maladie dans la population', 8, NULL, NULL),
(69, '% de patients déjà traités et satisfaits', 8, NULL, NULL),
(70, '% de patients potentiels visés par la campagne en ligne', 8, NULL, NULL),
(71, 'Nombre total de visites uniques sur le site', 8, NULL, NULL),
(72, '% des visiteurs uniques qui passent un temps significatif sur le site', 8, NULL, NULL),
(73, '% des visiteurs uniques ayant consulté un médecin suite au message du site', 8, NULL, NULL),
(74, '% des patients ayant reçu une prescription Prexige', 8, NULL, NULL),
(75, 'Valeur du revenu généré par patient incrémental', 8, NULL, NULL),
(76, 'Coût total du programme e-campagne', 8, NULL, NULL),
(77, 'Roi de de l\'activite 8', 8, NULL, NULL),
(78, 'Nombre de médecins ayant lu au moins une publication contenant une annonce produit', 9, NULL, NULL),
(79, 'Nombre total d’insertions prévues sur l’année', 9, NULL, NULL),
(80, 'Pourcentage des médecins lecteurs capables de se souvenir de la marque et du message après exposition', 9, NULL, NULL),
(81, 'Pourcentage des médecins ayant mémorisé la publicité qui commencent à prescrire le produit', 9, NULL, NULL),
(82, 'Nombre moyen de nouveaux patients mis sous traitement par chaque médecin prescripteur', 9, NULL, NULL),
(83, 'Revenu moyen généré par chaque nouveau patient traité', 9, NULL, NULL),
(84, 'Coûts d’achat d’espace publicitaire pour la campagne presse', 9, NULL, NULL),
(85, 'Frais de création et de gestion de la campagne', 9, NULL, NULL),
(86, 'Roi de de l\'activite 9', 9, NULL, NULL),
(87, 'Nombre de médecins exposés à l’activité', 10, NULL, NULL),
(88, 'Pourcentage des médecins capables de se souvenir de la marque et du message', 10, NULL, NULL),
(89, 'Pourcentage des médecins ayant amélioré leur perception du produit', 10, NULL, NULL),
(90, 'Pourcentage des médecins ayant changé de perception et prescrit à de nouveaux patients', 10, NULL, NULL),
(91, 'Nombre moyen de nouveaux patients traités par chaque médecin prescripteur', 10, NULL, NULL),
(92, 'Revenu moyen généré par chaque nouveau patient traité', 10, NULL, NULL),
(93, 'Coût global de l’organisation et de la mise en oeuvre de l’activité', 10, NULL, NULL),
(94, 'Roi de de l\'activite 10', 10, NULL, NULL),
(95, 'Nombre de consommateurs exposés à l’activité', 11, NULL, NULL),
(96, 'Pourcentage des consommateurs capables de se souvenir du message', 11, NULL, NULL),
(97, 'Pourcentage des consommateurs ayant consulté un médecin', 11, NULL, NULL),
(98, 'Pourcentage des consultations aboutissant à une prescription', 11, NULL, NULL),
(99, 'Revenu moyen généré par chaque nouveau patient', 11, NULL, NULL),
(100, 'Coût global de l’organisation et de la mise en oeuvre de l’activité', 11, NULL, NULL),
(101, 'Roi de de l\'activite 11', 11, NULL, NULL),
(102, 'Nombre de médecins susceptibles de prescrire le produit', 12, NULL, NULL),
(103, 'Pourcentage des médecins utilisant internet pour des informations professionnelles', 12, NULL, NULL),
(104, 'Nombre total de visites uniques sur le site', 12, NULL, NULL),
(105, 'Pourcentage de visiteurs uniques ayant interagi davantage avec le contenu', 12, NULL, NULL),
(106, 'Pourcentage des médecins informés ayant changé positivement leur perception du produit', 12, NULL, NULL),
(107, 'Pourcentage des médecins ayant changé leur perception et qui sont susceptibles de prescrire le produit', 12, NULL, NULL),
(108, 'Nombre moyen de nouveaux patients par médecin ayant prescrit le produit', 12, NULL, NULL),
(109, 'Valeur moyenne de revenu par patient incrémental', 12, NULL, NULL),
(110, 'Coût total du programme e-digital', 12, NULL, NULL),
(111, 'Roi de de l\'activite', 12, NULL, NULL);

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

--
-- Déclencheurs `activityitemvalues`
--
DELIMITER $$
CREATE TRIGGER `update_activitybylabo` AFTER INSERT ON `activityitemvalues` FOR EACH ROW BEGIN
                UPDATE activitybylabo
                SET is_calculated = TRUE
                WHERE id = NEW.ActivityByLaboId;
            END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `update_activitybylabo_after_delete` AFTER DELETE ON `activityitemvalues` FOR EACH ROW BEGIN
                UPDATE activitybylabo
                SET is_calculated = FALSE
                WHERE id = OLD.ActivityByLaboId;
            END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('2cyWNovySMZmjPLv', 'a:1:{s:11:\"valid_until\";i:1743174186;}', 1744383846),
('2uvrbarKH7cRBxGV', 'a:1:{s:11:\"valid_until\";i:1743164768;}', 1744374428),
('4GyZaQQf2sEEoTtn', 'a:1:{s:11:\"valid_until\";i:1743170835;}', 1744380496),
('6SxzfGJsn8DaMGlf', 'a:1:{s:11:\"valid_until\";i:1743607926;}', 1744817586),
('7AEwLFevbezeVBPh', 'a:1:{s:11:\"valid_until\";i:1743604045;}', 1744813705),
('8cJQZBNQYamEzw9X', 'a:1:{s:11:\"valid_until\";i:1743437117;}', 1744646777),
('aBGLgximN9SxGC5Q', 'a:1:{s:11:\"valid_until\";i:1743080020;}', 1744289680),
('aguZpqudwlh5OlQK', 'a:1:{s:11:\"valid_until\";i:1743242564;}', 1744452224),
('ajBQpUZFh99bDykR', 'a:1:{s:11:\"valid_until\";i:1743170141;}', 1744379801),
('C2N7YymhG5GYLRxM', 'a:1:{s:11:\"valid_until\";i:1743443522;}', 1744653182),
('dtPeZh64Pydriwyn', 'a:1:{s:11:\"valid_until\";i:1743590361;}', 1744800022),
('EbzzZhIM44GW6kje', 'a:1:{s:11:\"valid_until\";i:1743255670;}', 1744465331),
('FifK38UqRkrp6Ltd', 'a:1:{s:11:\"valid_until\";i:1743246820;}', 1744456480),
('N9d8iq63yEcnIXxG', 'a:1:{s:11:\"valid_until\";i:1743158984;}', 1744368644),
('P2Rpd66XbyC6jzc7', 'a:1:{s:11:\"valid_until\";i:1743260197;}', 1744469857),
('PKAn0gpHxtOs89wX', 'a:1:{s:11:\"valid_until\";i:1743153672;}', 1744363332),
('QWk5YWeWKAReVpZA', 'a:1:{s:11:\"valid_until\";i:1743174287;}', 1744383947),
('R53BfDuAkR3c3ax4', 'a:1:{s:11:\"valid_until\";i:1743084098;}', 1744293758),
('scghNC1kWFpFHdU8', 'a:1:{s:11:\"valid_until\";i:1743156353;}', 1744366013),
('T1YtyZS3VISjOqK8', 'a:1:{s:11:\"valid_until\";i:1743594013;}', 1744803673),
('vZwmYb70SNBKzBmG', 'a:1:{s:11:\"valid_until\";i:1743430615;}', 1744640275),
('WacLCrfFCgGhgSKS', 'a:1:{s:11:\"valid_until\";i:1743586645;}', 1744796305),
('wommIT9H5sLimcrJ', 'a:1:{s:11:\"valid_until\";i:1743176240;}', 1744385900),
('wrswh2koStnuSBpM', 'a:1:{s:11:\"valid_until\";i:1743160602;}', 1744370263),
('YCjt3bdDx1n4A0kd', 'a:1:{s:11:\"valid_until\";i:1743085884;}', 1744295544);

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
(1, 'labo 5wewe0', 5, 'Activated', '2025-03-27 12:43:17', '2025-03-27 12:43:17'),
(2, 'Labo Example', 6, 'Activated', '2025-03-27 12:43:17', '2025-03-27 12:43:17');

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
(1, '0001_01_01_000001_create_cache_table', 1),
(2, '0001_01_01_000002_create_jobs_table', 1),
(3, '00_users', 1),
(4, '02_labo', 1),
(5, '03activities_list', 1),
(6, '04activity_items', 1),
(7, '05activity_by_labo', 1),
(8, '06activity_item_value', 1),
(9, '07rapport_ROI', 1),
(10, '09add_trigger_update_activitybylabo', 1),
(11, '10add_trigger_update2_activitybylabo', 1),
(12, '2025_03_06_100742_add_two_factor_columns_to_users_table', 1),
(13, '2025_03_06_100816_create_personal_access_tokens_table', 1);

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
(1, 'Ibrahim', 'Benmagha', 'benmagha@gmail.com', '$2y$12$JinGsO3WqnnzCENFBN5GtOQfySy3OmFEeVr.0ZQf8l500wSRDvE.G', NULL, NULL, NULL, 'Admin', NULL, NULL, NULL, NULL),
(2, 'said', 'taghmaoui', 'said@gmail.com', '$2y$12$DxjUVjjPtvKHBU.cy0Ay.OwldALEThi3VaEXf3w/.a.I8JwZrQ3Fa', NULL, NULL, NULL, 'Admin', NULL, NULL, NULL, NULL),
(3, 'Rachid', 'katorza', 'Rachid@gmail.com', '$2y$12$szgMga.b93ml/GCIpOYrs.Eol8hPWkS0D935kiJvklkN1Ks7BlnMS', NULL, NULL, NULL, 'Admin', NULL, NULL, NULL, NULL),
(4, 'Yasser', 'Eddaoussari', 'Yasser@gmail.com', '$2y$12$vYPypsnvkGD/or1faUusBu0OQrtLoPHMEA.17byqUbgCREuhqgdGK', NULL, NULL, NULL, 'Admin', NULL, NULL, NULL, NULL),
(5, 'haasra', 'letshlift', 'wasw50@gmail.com', '$2y$12$qr5RPBOQKhOCj7JCpsSZI.dTGOEOJJznFacxerGVOPZ8CPNML.VZm', NULL, NULL, NULL, 'Laboratoire', NULL, NULL, '2025-03-27 12:43:17', '2025-03-27 12:43:17'),
(6, 'John', 'Doe', 'john.doe@example.com', '$2y$12$N4q0rfoc/ZaQi/7LE6Qp6uic3moXebBHflsV6svXmf6fB.76PLQAu', NULL, NULL, NULL, 'Laboratoire', NULL, NULL, '2025-03-27 12:43:17', '2025-03-27 12:43:17');

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT pour la table `activityitems`
--
ALTER TABLE `activityitems`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=112;

--
-- AUTO_INCREMENT pour la table `activityitemvalues`
--
ALTER TABLE `activityitemvalues`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=178;

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
