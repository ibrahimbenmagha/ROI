<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\ActivitiesList;
use App\Models\Labo;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Insertion des activités
        DB::table('activitieslist')->insert([
            ["Name" => "Distribution des échantillons", "is_custom" => false],
            ["Name" => "Essai clinique", "is_custom" => false],
            ["Name" => "Mailing", "is_custom" => false],
            ["Name" => "Conférences", "is_custom" => false],
            ["Name" => "Tables rondes", "is_custom" => false],
            ["Name" => "Visites médicales", "is_custom" => false],
            ["Name" => "Publicité directe au consommateur", "is_custom" => false],
            ["Name" => "Publicité directe au consommateur en ligne", "is_custom" => false],
            ["Name" => "Publicité dans les revues", "is_custom" => false],
            ["Name" => "Générique (Médecins)", "is_custom" => false],
            ["Name" => "Générique (Patients)", "is_custom" => false],
            ["Name" => "Promotion numérique pour les médecins", "is_custom" => false],
        ]);

        // Activité 1: Distribution des échantillons
        DB::table('activityItems')->insert([
            ["Name" => "Nombre de médecins recevant des échantillons", "type" => "number", "ActivityId" => 1, "symbole" => "A"],
            ["Name" => "Nombre d’échantillons donnés à chaque médecin", "type" => "number", "ActivityId" => 1, "symbole" => "B"],
            ["Name" => "Pourcentage des échantillons réellement donnés aux patients", "type" => "percentage", "ActivityId" => 1, "symbole" => "D"],
            ["Name" => "Nombre moyen d’échantillons donnés par patient", "type" => "number", "ActivityId" => 1, "symbole" => "E"],
            ["Name" => "Pourcentage des patients ayant reçu une prescription après usage de l’échantillon", "type" => "percentage", "ActivityId" => 1, "symbole" => "G"],
            ["Name" => "Pourcentage des patients prescrits sans échantillon", "type" => "percentage", "ActivityId" => 1, "symbole" => "I"],
            ["Name" => "Valeur moyenne d’un patient incrémental en MAD", "type" => "number", "ActivityId" => 1, "symbole" => "K"],
            ["Name" => "Coût unitaire d’un échantillon", "type" => "number", "ActivityId" => 1, "symbole" => "M"],
            ["Name" => "Coûts fixes du programme", "type" => "number", "ActivityId" => 1, "symbole" => "N"],
            ["Name" => "Roi", "type" => "number", "ActivityId" => 1, "symbole" => null],
        ]);

        // Activité 2: Essai clinique
        DB::table('activityItems')->insert([
            ["Name" => "Nombre de médecins participant à l'étude", "type" => "number", "ActivityId" => 2, "symbole" => "A"],
            ["Name" => "Nombre moyen de patients inscrits par médecin", "type" => "number", "ActivityId" => 2, "symbole" => "B"],
            ["Name" => "Pourcentage moyen de patients qui continuent le traitement après l'étude", "type" => "percentage", "ActivityId" => 2, "symbole" => "D"],
            ["Name" => "Nombre de nouveaux patients traités par médecin grâce à l'étude", "type" => "number", "ActivityId" => 2, "symbole" => "F"],
            ["Name" => "Valeur du revenu par patient incrémental", "type" => "number", "ActivityId" => 2, "symbole" => "H"],
            ["Name" => "Coût variable par médecin", "type" => "number", "ActivityId" => 2, "symbole" => "J"],
            ["Name" => "Coût fixe total de l’étude", "type" => "number", "ActivityId" => 2, "symbole" => "K"],
            ["Name" => "Roi", "type" => "number", "ActivityId" => 2, "symbole" => null],
        ]);

        // Activité 3: Mailing
        DB::table('activityItems')->insert([
            ["Name" => "Nombre total de médecins ciblés par l’email", "type" => "number", "ActivityId" => 3, "symbole" => "A"],
            ["Name" => "Pourcentage de médecins se rappelant avoir reçu l’email", "type" => "percentage", "ActivityId" => 3, "symbole" => "C"],
            ["Name" => "Pourcentage de médecins se rappelant de la marque et du message", "type" => "percentage", "ActivityId" => 3, "symbole" => "E"],
            ["Name" => "Pourcentage de médecins prescrivant Prexige à de nouveaux patients après réception du message", "type" => "percentage", "ActivityId" => 3, "symbole" => "G"],
            ["Name" => "Nombre moyen de nouveaux patients mis sous Prexige par médecin", "type" => "number", "ActivityId" => 3, "symbole" => "I"],
            ["Name" => "Valeur du revenu par patient incrémental", "type" => "number", "ActivityId" => 3, "symbole" => "K"],
            ["Name" => "Coût variable par email envoyé", "type" => "number", "ActivityId" => 3, "symbole" => "M"],
            ["Name" => "Nombre moyen d’emails envoyés par médecin", "type" => "number", "ActivityId" => 3, "symbole" => "B"],
            ["Name" => "Coût fixe total du programme", "type" => "number", "ActivityId" => 3, "symbole" => "N"],
            ["Name" => "Roi", "type" => "number", "ActivityId" => 3, "symbole" => null],
        ]);

        // Activité 4: Conférences
        DB::table('activityItems')->insert([
            ["Name" => "Nombre de médecins participants à la conférence", "type" => "number", "ActivityId" => 4, "symbole" => "A"],
            ["Name" => "Pourcentage de médecins ayant retenu le message", "type" => "percentage", "ActivityId" => 4, "symbole" => "B"],
            ["Name" => "Pourcentage de médecins ayant changé positivement leur perception après la conférence", "type" => "percentage", "ActivityId" => 4, "symbole" => "D"],
            ["Name" => "Pourcentage de ces médecins qui commencent à prescrire à de nouveaux patients", "type" => "percentage", "ActivityId" => 4, "symbole" => "F"],
            ["Name" => "Nombre moyen de nouveaux patients prescrits par médecin", "type" => "number", "ActivityId" => 4, "symbole" => "H"],
            ["Name" => "Valeur d’ajustement KOL", "type" => "number", "ActivityId" => 4, "symbole" => "I"],
            ["Name" => "Valeur de revenu générée par patient incrémental", "type" => "number", "ActivityId" => 4, "symbole" => "J"],
            ["Name" => "Coût variable par médecin", "type" => "number", "ActivityId" => 4, "symbole" => "L"],
            ["Name" => "Coût fixe du programme", "type" => "number", "ActivityId" => 4, "symbole" => "M"],
            ["Name" => "Roi", "type" => "number", "ActivityId" => 4, "symbole" => null],
        ]);

        // Activité 5: Tables rondes
        DB::table('activityItems')->insert([
            ["Name" => "Nombre total de médecins participant", "type" => "number", "ActivityId" => 5, "symbole" => "A"],
            ["Name" => "Nombre moyen de tables rondes assistées par médecin par an", "type" => "number", "ActivityId" => 5, "symbole" => "B"],
            ["Name" => "Nombre moyen de médecins par table ronde", "type" => "number", "ActivityId" => 5, "symbole" => "D"],
            ["Name" => "% de médecins ayant changé positivement leur perception", "type" => "percentage", "ActivityId" => 5, "symbole" => "F"],
            ["Name" => "% de médecins influencés qui vont prescrire", "type" => "percentage", "ActivityId" => 5, "symbole" => "H"],
            ["Name" => "Nombre moyen de nouveaux patients mis sous traitement par médecin", "type" => "number", "ActivityId" => 5, "symbole" => "J"],
            ["Name" => "Valeur du revenu par patient incrémental", "type" => "number", "ActivityId" => 5, "symbole" => "L"],
            ["Name" => "Coût variable par table ronde", "type" => "number", "ActivityId" => 5, "symbole" => "N"],
            ["Name" => "Coût fixe total du programme", "type" => "number", "ActivityId" => 5, "symbole" => "O"],
            ["Name" => "Roi", "type" => "number", "ActivityId" => 5, "symbole" => null],
        ]);

        // Activité 6: Visites médicales
        DB::table('activityItems')->insert([
            ["Name" => "Nombre total de médecins ciblés par le représentant", "type" => "number", "ActivityId" => 6, "symbole" => "A"],
            ["Name" => "Nombre moyen de visites (détails) par médecin", "type" => "number", "ActivityId" => 6, "symbole" => "B"],
            ["Name" => "% de médecins se rappelant du message délivré lors de la visite", "type" => "percentage", "ActivityId" => 6, "symbole" => "E"],
            ["Name" => "% de médecins prescrivant Prexige à de nouveaux patients après avoir reçu le message", "type" => "percentage", "ActivityId" => 6, "symbole" => "G"],
            ["Name" => "Nombre moyen de nouveaux patients mis sous Prexige par médecin", "type" => "number", "ActivityId" => 6, "symbole" => "I"],
            ["Name" => "Valeur du revenu par patient incrémental", "type" => "number", "ActivityId" => 6, "symbole" => "K"],
            ["Name" => "Coût variable par représentant", "type" => "number", "ActivityId" => 6, "symbole" => "M1"],
            ["Name" => "Nombre total de représentants", "type" => "number", "ActivityId" => 6, "symbole" => "M2"],
            ["Name" => "Roi", "type" => "number", "ActivityId" => 6, "symbole" => null],
        ]);


        

        // // Activité 1: Distribution des échantillons
        // DB::table('activityItems')->insert([
        //     ["Name" => "Nombre de médecins recevant des échantillons", "type" => "number", "ActivityId" => 1],
        //     ["Name" => "Nombre d'échantillons donnés à chaque médecin", "type" => "number", "ActivityId" => 1],
        //     ["Name" => "Pourcentage des échantillons réellement donnés aux patients", "type" => "percentage", "ActivityId" => 1],
        //     ["Name" => "Nombre moyen d'échantillons donnés par patient", "type" => "number", "ActivityId" => 1],
        //     ["Name" => "Pourcentage des patients ayant reçu une prescription après usage de l'échantillon", "type" => "percentage", "ActivityId" => 1],
        //     ["Name" => "Pourcentage des patients prescrits sans échantillon", "type" => "percentage", "ActivityId" => 1],
        //     ["Name" => "Valeur moyenne d'un patient incrémental en MAD", "type" => "number", "ActivityId" => 1],
        //     ["Name" => "Coût unitaire d'un échantillon", "type" => "number", "ActivityId" => 1],
        //     ["Name" => "Coûts fixes du programme", "type" => "number", "ActivityId" => 1],
        //     ["Name" => "Roi", "type" => "number", "ActivityId" => 1],
        // ]);

        // // Activité 2: Essai clinique
        // DB::table('activityItems')->insert([
        //     ["Name" => "Nombre de médecins participant à l'étude", "type" => "number", "ActivityId" => 2],
        //     ["Name" => "Nombre moyen de patients inscrits par médecin", "type" => "number", "ActivityId" => 2],
        //     ["Name" => "Pourcentage moyen de patients qui continuent le traitement après l'étude", "type" => "percentage", "ActivityId" => 2],
        //     ["Name" => "Nombre de nouveaux patients traités par médecin grâce à l'étude", "type" => "number", "ActivityId" => 2],
        //     ["Name" => "Valeur du revenu par patient incrémental", "type" => "number", "ActivityId" => 2],
        //     ["Name" => "Coût variable par médecin", "type" => "number", "ActivityId" => 2],
        //     ["Name" => "Coût fixe total de l'étude", "type" => "number", "ActivityId" => 2],
        //     ["Name" => "Roi", "type" => "number", "ActivityId" => 2],
        // ]);

        // // Activité 3: Mailing
        // DB::table('activityItems')->insert([
        //     ["Name" => "Nombre total de médecins ciblés par l'email", "type" => "number", "ActivityId" => 3],
        //     ["Name" => "Pourcentage de médecins se rappelant avoir reçu l'email", "type" => "percentage", "ActivityId" => 3],
        //     ["Name" => "Pourcentage de médecins se rappelant de la marque et du message", "type" => "percentage", "ActivityId" => 3],
        //     ["Name" => "Pourcentage de médecins prescrivant Prexige à de nouveaux patients après réception du message", "type" => "percentage", "ActivityId" => 3],
        //     ["Name" => "Nombre moyen de nouveaux patients mis sous Prexige par médecin", "type" => "number", "ActivityId" => 3],
        //     ["Name" => "Valeur du revenu par patient incrémental", "type" => "number", "ActivityId" => 3],
        //     ["Name" => "Coût variable par email envoyé", "type" => "number", "ActivityId" => 3],
        //     ["Name" => "Nombre moyen d'emails envoyés par médecin", "type" => "number", "ActivityId" => 3],
        //     ["Name" => "Coût fixe total du programme", "type" => "number", "ActivityId" => 3],
        //     ["Name" => "Roi", "type" => "number", "ActivityId" => 3],
        // ]);

        // // Activité 4: Conférences
        // DB::table('activityItems')->insert([
        //     ["Name" => "Nombre de médecins participants à la conférence", "type" => "number", "ActivityId" => 4],
        //     ["Name" => "Pourcentage de médecins ayant retenu le message", "type" => "percentage", "ActivityId" => 4],
        //     ["Name" => "Pourcentage de médecins ayant changé positivement leur perception après la conférence", "type" => "percentage", "ActivityId" => 4],
        //     ["Name" => "Pourcentage de ces médecins qui commencent à prescrire à de nouveaux patients", "type" => "percentage", "ActivityId" => 4],
        //     ["Name" => "Nombre moyen de nouveaux patients prescrits par médecin", "type" => "number", "ActivityId" => 4],
        //     ["Name" => "Valeur d'ajustement KOL", "type" => "number", "ActivityId" => 4],
        //     ["Name" => "Valeur de revenu générée par patient incrémental", "type" => "number", "ActivityId" => 4],
        //     ["Name" => "Coût variable par médecin", "type" => "number", "ActivityId" => 4],
        //     ["Name" => "Coût fixe du programme", "type" => "number", "ActivityId" => 4],
        //     ["Name" => "Roi", "type" => "number", "ActivityId" => 4],
        // ]);

        // // Activité 5: Tables rondes
        // DB::table('activityItems')->insert([
        //     ["Name" => "Nombre total de médecins participant", "type" => "number", "ActivityId" => 5],
        //     ["Name" => "Nombre moyen de tables rondes assistées par médecin par an", "type" => "number", "ActivityId" => 5],
        //     ["Name" => "Nombre moyen de médecins par table ronde", "type" => "number", "ActivityId" => 5],
        //     ["Name" => "% de médecins ayant changé positivement leur perception", "type" => "percentage", "ActivityId" => 5],
        //     ["Name" => "% de médecins influencés qui vont prescrire", "type" => "percentage", "ActivityId" => 5],
        //     ["Name" => "Nombre moyen de nouveaux patients mis sous traitement par médecin", "type" => "number", "ActivityId" => 5],
        //     ["Name" => "Valeur du revenu par patient incrémental", "type" => "number", "ActivityId" => 5],
        //     ["Name" => "Coût variable par table ronde", "type" => "number", "ActivityId" => 5],
        //     ["Name" => "Coût fixe total du programme", "type" => "number", "ActivityId" => 5],
        //     ["Name" => "Roi", "type" => "number", "ActivityId" => 5],
        // ]);

        // // Activité 6: Visites médicales
        // DB::table('activityItems')->insert([
        //     ["Name" => "Nombre total de médecins ciblés par le représentant", "type" => "number", "ActivityId" => 6],
        //     ["Name" => "Nombre moyen de visites (détails) par médecin", "type" => "number", "ActivityId" => 6],
        //     ["Name" => "% de médecins se rappelant du message délivré lors de la visite", "type" => "percentage", "ActivityId" => 6],
        //     ["Name" => "% de médecins prescrivant Prexige à de nouveaux patients après avoir reçu le message", "type" => "percentage", "ActivityId" => 6],
        //     ["Name" => "Nombre moyen de nouveaux patients mis sous Prexige par médecin", "type" => "number", "ActivityId" => 6],
        //     ["Name" => "Valeur du revenu par patient incrémental", "type" => "number", "ActivityId" => 6],
        //     ["Name" => "Coût variable par représentant", "type" => "number", "ActivityId" => 6],
        //     ["Name" => "Nombre total de représentants", "type" => "number", "ActivityId" => 6],
        //     ["Name" => "Roi", "type" => "number", "ActivityId" => 6],
        // ]);

        // // Activité 7: Publicité directe au consommateur
        // DB::table('activityItems')->insert([
        //     ["Name" => "Nombre de consommateurs cibles pour la campagne", "type" => "number", "ActivityId" => 7],
        //     ["Name" => "% d'audience cible atteinte par le plan média", "type" => "percentage", "ActivityId" => 7],
        //     ["Name" => "% de consommateurs atteints se rappelant de la campagne (taux de mémorisation)", "type" => "percentage", "ActivityId" => 7],
        //     ["Name" => "% de consommateurs se rappelant de la campagne DTC ayant consulté un médecin suite à l'exposition", "type" => "percentage", "ActivityId" => 7],
        //     ["Name" => "% de patients ayant consulté et recevant une prescription Prexige", "type" => "percentage", "ActivityId" => 7],
        //     ["Name" => "Valeur du revenu par patient incrémental", "type" => "number", "ActivityId" => 7],
        //     ["Name" => "Dépenses médias (en MAD k)", "type" => "number", "ActivityId" => 7],
        //     ["Name" => "Coûts de production, frais d'agence et autres (en MAD k)", "type" => "number", "ActivityId" => 7],
        //     ["Name" => "Roi", "type" => "number", "ActivityId" => 7],
        // ]);

        // // Activité 8: Publicité directe au consommateur en ligne
        // DB::table('activityItems')->insert([
        //     ["Name" => "Population totale", "type" => "number", "ActivityId" => 8],
        //     ["Name" => "Taux d'incidence de la maladie dans la population", "type" => "percentage", "ActivityId" => 8],
        //     ["Name" => "% de patients déjà traités et satisfaits", "type" => "percentage", "ActivityId" => 8],
        //     ["Name" => "% de patients potentiels visés par la campagne en ligne", "type" => "percentage", "ActivityId" => 8],
        //     ["Name" => "Nombre total de visites uniques sur le site", "type" => "number", "ActivityId" => 8],
        //     ["Name" => "% des visiteurs uniques qui passent un temps significatif sur le site", "type" => "percentage", "ActivityId" => 8],
        //     ["Name" => "% des visiteurs uniques ayant consulté un médecin suite au message du site", "type" => "percentage", "ActivityId" => 8],
        //     ["Name" => "% des patients ayant reçu une prescription Prexige", "type" => "percentage", "ActivityId" => 8],
        //     ["Name" => "Valeur du revenu généré par patient incrémental", "type" => "number", "ActivityId" => 8],
        //     ["Name" => "Coût total du programme e-campagne", "type" => "number", "ActivityId" => 8],
        //     ["Name" => "Roi", "type" => "number", "ActivityId" => 8],
        // ]);

        // // Activité 9: Publicité dans les revues
        // DB::table('activityItems')->insert([
        //     ["Name" => "Nombre de médecins ayant lu au moins une publication contenant une annonce produit", "type" => "number", "ActivityId" => 9],
        //     ["Name" => "Nombre total d'insertions prévues sur l'année", "type" => "number", "ActivityId" => 9],
        //     ["Name" => "Pourcentage des médecins lecteurs capables de se souvenir de la marque et du message après exposition", "type" => "percentage", "ActivityId" => 9],
        //     ["Name" => "Pourcentage des médecins ayant mémorisé la publicité qui commencent à prescrire le produit", "type" => "percentage", "ActivityId" => 9],
        //     ["Name" => "Nombre moyen de nouveaux patients mis sous traitement par chaque médecin prescripteur", "type" => "number", "ActivityId" => 9],
        //     ["Name" => "Revenu moyen généré par chaque nouveau patient traité", "type" => "number", "ActivityId" => 9],
        //     ["Name" => "Coûts d'achat d'espace publicitaire pour la campagne presse", "type" => "number", "ActivityId" => 9],
        //     ["Name" => "Frais de création et de gestion de la campagne", "type" => "number", "ActivityId" => 9],
        //     ["Name" => "Roi", "type" => "number", "ActivityId" => 9],
        // ]);

        // // Activité 10: Générique (Médecins)
        // DB::table('activityItems')->insert([
        //     ["Name" => "Nombre de médecins exposés à l'activité", "type" => "number", "ActivityId" => 10],
        //     ["Name" => "Pourcentage des médecins capables de se souvenir de la marque et du message", "type" => "percentage", "ActivityId" => 10],
        //     ["Name" => "Pourcentage des médecins ayant amélioré leur perception du produit", "type" => "percentage", "ActivityId" => 10],
        //     ["Name" => "Pourcentage des médecins ayant changé de perception et prescrit à de nouveaux patients", "type" => "percentage", "ActivityId" => 10],
        //     ["Name" => "Nombre moyen de nouveaux patients traités par chaque médecin prescripteur", "type" => "number", "ActivityId" => 10],
        //     ["Name" => "Revenu moyen généré par chaque nouveau patient traité", "type" => "number", "ActivityId" => 10],
        //     ["Name" => "Coût global de l'organisation et de la mise en œuvre de l'activité", "type" => "number", "ActivityId" => 10],
        //     ["Name" => "Roi", "type" => "number", "ActivityId" => 10],
        // ]);

        // // Activité 11: Générique (Patients)
        // DB::table('activityItems')->insert([
        //     ["Name" => "Nombre de consommateurs exposés à l'activité", "type" => "number", "ActivityId" => 11],
        //     ["Name" => "Pourcentage des consommateurs capables de se souvenir du message", "type" => "percentage", "ActivityId" => 11],
        //     ["Name" => "Pourcentage des consommateurs ayant consulté un médecin", "type" => "percentage", "ActivityId" => 11],
        //     ["Name" => "Pourcentage des consultations aboutissant à une prescription", "type" => "percentage", "ActivityId" => 11],
        //     ["Name" => "Revenu moyen généré par chaque nouveau patient", "type" => "number", "ActivityId" => 11],
        //     ["Name" => "Coût global de l'organisation et de la mise en œuvre de l'activité", "type" => "number", "ActivityId" => 11],
        //     ["Name" => "Roi", "type" => "number", "ActivityId" => 11],
        // ]);

        // // Activité 12: Promotion numérique pour les médecins
        // DB::table('activityItems')->insert([
        //     ["Name" => "Nombre de médecins susceptibles de prescrire le produit", "type" => "number", "ActivityId" => 12],
        //     ["Name" => "Pourcentage des médecins utilisant internet pour des informations professionnelles", "type" => "percentage", "ActivityId" => 12],
        //     ["Name" => "Nombre total de visites uniques sur le site", "type" => "number", "ActivityId" => 12],
        //     ["Name" => "Pourcentage de visiteurs uniques ayant interagi davantage avec le contenu", "type" => "percentage", "ActivityId" => 12],
        //     ["Name" => "Pourcentage des médecins informés ayant changé positivement leur perception du produit", "type" => "percentage", "ActivityId" => 12],
        //     ["Name" => "Pourcentage des médecins ayant changé leur perception et qui sont susceptibles de prescrire le produit", "type" => "percentage", "ActivityId" => 12],
        //     ["Name" => "Nombre moyen de nouveaux patients par médecin ayant prescrit le produit", "type" => "number", "ActivityId" => 12],
        //     ["Name" => "Valeur moyenne de revenu par patient incrémental", "type" => "number", "ActivityId" => 12],
        //     ["Name" => "Coût total du programme e-digital", "type" => "number", "ActivityId" => 12],
        //     ["Name" => "Roi", "type" => "number", "ActivityId" => 12],
        // ]);


     DB::table('calculationformula')->insert([
            // Activité 1: Distribution des échantillons
            [
                "ActivityId" => 1,
                "fomulat" => json_encode([
                    "total_samples_distributed" => "A * B",
                    "total_patients_received_samples" => "total_samples_distributed * D / E",
                    "patients_prescribed_after_sample" => "total_patients_received_samples * G",
                    "patients_prescribed_without_sample" => "patients_prescribed_after_sample * I",
                    "incremental_patients" => "patients_prescribed_after_sample * (1 - I)",
                    "incremental_sales" => "incremental_patients * K",
                    "variable_cost" => "M * total_samples_distributed",
                    "total_cost" => "variable_cost + N",
                    "roi" => "incremental_sales / total_cost"
                ]),
            ],
            // Activité 2: Essai clinique
            [
                "ActivityId" => 2,
                "fomulat" => json_encode([
                    "total_patients_enrolled" => "A * B",
                    "patients_continuing_treatment" => "B * D",
                    "incremental_patients" => "A * (patients_continuing_treatment + F)",
                    "incremental_sales" => "incremental_patients * H",
                    "total_cost" => "(J * A) + K",
                    "roi" => "incremental_sales / total_cost"
                ]),
            ],
            // Activité 3: Mailing
            [
                "ActivityId" => 3,
                "fomulat" => json_encode([
                    "doctors_recalled_email" => "A * C",
                    "doctors_recalled_brand" => "doctors_recalled_email * E",
                    "doctors_prescribing" => "doctors_recalled_brand * G",
                    "incremental_patients" => "doctors_prescribing * I",
                    "incremental_sales" => "incremental_patients * K",
                    "total_cost" => "(M * A * B) + N",
                    "roi" => "incremental_sales / total_cost"
                ]),
            ],
            // Activité 4: Conférences
            [
                "ActivityId" => 4,
                "fomulat" => json_encode([
                    "doctors_retained_message" => "A * B",
                    "doctors_positive_perception" => "doctors_retained_message * D",
                    "doctors_prescribing" => "doctors_positive_perception * F",
                    "incremental_patients" => "(doctors_prescribing * H) + I",
                    "incremental_sales" => "incremental_patients * J",
                    "total_cost" => "(L * A) + M",
                    "roi" => "incremental_sales / total_cost"
                ]),
            ],
            // Activité 5: Tables rondes
            [
                "ActivityId" => 5,
                "fomulat" => json_encode([
                    "total_doctor_contacts" => "A * B",
                    "total_roundtables" => "total_doctor_contacts / D",
                    "doctors_positive_perception" => "A * F",
                    "doctors_prescribing" => "doctors_positive_perception * H",
                    "incremental_patients" => "doctors_prescribing * J",
                    "incremental_sales" => "incremental_patients * L",
                    "total_cost" => "(N * total_roundtables) + O",
                    "roi" => "incremental_sales / total_cost"
                ]),
            ],
            // Activité 6: Visites médicales
            [
                "ActivityId" => 6,
                "fomulat" => json_encode([
                    "total_visits" => "A * B",
                    "doctors_recalled_message" => "A * E",
                    "doctors_prescribing" => "doctors_recalled_message * G",
                    "incremental_patients" => "doctors_prescribing * I",
                    "incremental_sales" => "incremental_patients * K",
                    "total_cost" => "M1 * M2",
                    "roi" => "incremental_sales / total_cost"
                ]),
            ],
            // Activité 7: Publicité directe au consommateur
            [
                "ActivityId" => 7,
                "fomulat" => json_encode([
                    "consumers_reached" => "G * H",
                    "consumers_recalled_campaign" => "consumers_reached * J",
                    "consumers_consulted_doctor" => "consumers_recalled_campaign * L",
                    "incremental_patients" => "consumers_consulted_doctor * N",
                    "incremental_sales" => "incremental_patients * P",
                    "total_cost" => "R1 + S",
                    "roi" => "incremental_sales / total_cost"
                ]),
            ],
            // Activité 8: Publicité directe au consommateur en ligne
            [
                "ActivityId" => 8,
                "fomulat" => json_encode([
                    "total_patients_affected" => "A * B",
                    "potential_patients" => "total_patients_affected * (1 - D)",
                    "targeted_patients" => "potential_patients * F",
                    "reach_efficiency" => "H / targeted_patients",
                    "interested_visitors" => "H * J",
                    "visitors_consulted_doctor" => "interested_visitors * L",
                    "incremental_patients" => "visitors_consulted_doctor * N",
                    "incremental_sales" => "incremental_patients * P",
                    "total_cost" => "R",
                    "roi" => "incremental_sales / total_cost"
                ]),
            ],
            // Activité 9: Publicité dans les revues
            [
                "ActivityId" => 9,
                "fomulat" => json_encode([
                    "doctors_recalled_ad" => "A * C",
                    "doctors_prescribing" => "doctors_recalled_ad * E",
                    "incremental_patients" => "doctors_prescribing * G",
                    "incremental_sales" => "incremental_patients * I",
                    "total_cost" => "K + L",
                    "roi" => "incremental_sales / total_cost"
                ]),
            ],
            // Activité 10: Générique (Médecins)
            [
                "ActivityId" => 10,
                "fomulat" => json_encode([
                    "doctors_recalled_message" => "A * B",
                    "doctors_positive_perception" => "doctors_recalled_message * D",
                    "doctors_prescribing" => "doctors_positive_perception * F",
                    "incremental_patients" => "doctors_prescribing * H",
                    "incremental_sales" => "incremental_patients * J",
                    "total_cost" => "L",
                    "roi" => "incremental_sales / total_cost"
                ]),
            ],
            // Activité 11: Générique (Patients)
            [
                "ActivityId" => 11,
                "fomulat" => json_encode([
                    "consumers_recalled_message" => "A * B",
                    "consumers_consulted_doctor" => "consumers_recalled_message * D",
                    "incremental_patients" => "consumers_consulted_doctor * F",
                    "incremental_sales" => "incremental_patients * H",
                    "total_cost" => "J",
                    "roi" => "incremental_sales / total_cost"
                ]),
            ],
            // Activité 12: Promotion numérique pour les médecins
            [
                "ActivityId" => 12,
                "fomulat" => json_encode([
                    "doctors_reachable_online" => "A * B",
                    "reach_efficiency" => "D / doctors_reachable_online",
                    "doctors_engaged" => "D * F",
                    "doctors_positive_perception" => "doctors_engaged * H",
                    "doctors_prescribing" => "doctors_positive_perception * J",
                    "incremental_patients" => "doctors_prescribing * L",
                    "incremental_sales" => "incremental_patients * N",
                    "total_cost" => "P",
                    "roi" => "incremental_sales / total_cost"
                ]),
            ],
        ]);

        
        // DB::table('calculationformula')->insert([
        //     // Activité 1: Distribution des échantillons
        //     [
        //         "ActivityId" => 1,
        //         "fomulat" => json_encode([
        //             "Nombre total d’échantillons distribués" => "Nombre de médecins recevant des échantillons * Nombre d’échantillons donnés à chaque médecin",
        //             "Nombre total de patients ayant reçu un échantillon" => "Nombre total d’échantillons distribués * Pourcentage des échantillons réellement donnés aux patients / Nombre moyen d’échantillons donnés par patient",
        //             "Nombre total de patients obtenant une prescription" => "Nombre total de patients ayant reçu un échantillon * Pourcentage des patients ayant reçu une prescription après usage de l’échantillon",
        //             "Nombre de patients qui auraient obtenu une ordonnance même sans échantillon" => "Pourcentage des patients prescrits sans échantillon * Nombre total de patients obtenant une prescription",
        //             "Nombre total de patients incrémentaux gagnés" => "Nombre total de patients obtenant une prescription * (1 - Pourcentage des patients prescrits sans échantillon)",
        //             "Ventes incrémentales générées" => "Nombre total de patients incrémentaux gagnés * Valeur moyenne d’un patient incrémental",
        //             "Coût variable total" => "Coût unitaire d’un échantillon * Nombre total d’échantillons distribués",
        //             "Coût total du programme" => "Coût variable total + Coûts fixes du programme",
        //             "ROI" => "Ventes incrémentales générées / Coût total du programme"
        //         ],JSON_UNESCAPED_UNICODE),
        //     ],

        //     // Activité 2: Essai clinique
        //     [
        //         "ActivityId" => 2,
        //         "fomulat" => json_encode([
        //             "Nombre total de patients inscrits" => "Nombre de médecins participant à l’étude * Nombre moyen de patients inscrits par médecin",
        //             "Nombre de patients poursuivant le traitement après l’étude" => "Nombre moyen de patients inscrits par médecin * Pourcentage moyen de patients qui continuent le traitement",
        //             "Nombre de patients incrémentaux" => "Nombre de médecins participant à l’étude * (Nombre de patients poursuivant le traitement après l’étude + Nombre de nouveaux patients traités par médecin grâce à l’étude)",
        //             "Ventes incrémentales générées" => "Nombre de patients incrémentaux * Valeur du revenu par patient incrémental",
        //             "Coût total du programme" => "Coût variable par médecin * Nombre de médecins participant à l’étude + Coût fixe total de l’étude",
        //             "ROI" => "Ventes incrémentales générées / Coût total du programme"
        //         ],JSON_UNESCAPED_UNICODE),
        //     ],

        //     // Activité 3: Mailing
        //     [
        //         "ActivityId" => 3,
        //         "fomulat" => json_encode([
        //             "Nombre de médecins rappelant l’email" => "Nombre total de médecins ciblés par l’email * Pourcentage de médecins se rappelant avoir reçu l’email",
        //             "Nombre de médecins se rappelant de la marque" => "Nombre de médecins rappelant l’email * Pourcentage se rappelant de la marque",
        //             "Nombre de médecins prescrivant après l’email" => "Nombre de médecins se rappelant de la marque * Pourcentage prescrivant à la suite de l’email",
        //             "Nombre de patients incrémentaux" => "Nombre de médecins prescrivant après l’email * Nombre moyen de nouveaux patients par médecin",
        //             "Ventes incrémentales générées" => "Nombre de patients incrémentaux * Valeur du revenu par patient incrémental",
        //             "Coût total du programme" => "Coût variable par email * Nombre total de médecins * Nombre moyen d’emails envoyés par médecin + Coût fixe total du programme",
        //             "ROI" => "Ventes incrémentales générées / Coût total du programme"
        //         ],JSON_UNESCAPED_UNICODE),
        //     ],

        //     // Activité 4: Conférences
        //     [
        //         "ActivityId" => 4,
        //         "fomulat" => json_encode([
        //             "Nombre de médecins exposés au message" => "Nombre de médecins participants à la conférence * Pourcentage ayant retenu le message",
        //             "Nombre de médecins avec perception positive" => "Nombre de médecins exposés au message * Pourcentage ayant changé positivement leur perception",
        //             "Nombre de médecins prescrivant" => "Nombre de médecins avec perception positive * Pourcentage prescrivant",
        //             "Nombre de patients incrémentaux" => "Nombre de médecins prescrivant * Nombre moyen de patients prescrits + Valeur d’ajustement KOL",
        //             "Ventes incrémentales générées" => "Nombre de patients incrémentaux * Valeur du revenu par patient",
        //             "Coût total du programme" => "Coût variable par médecin * Nombre de médecins participants + Coût fixe du programme",
        //             "ROI" => "Ventes incrémentales générées / Coût total du programme"
        //         ],JSON_UNESCAPED_UNICODE),
        //     ],

        //     // Activité 5: Tables rondes
        //     [
        //         "ActivityId" => 5,
        //         "fomulat" => json_encode([
        //             "Nombre total de contacts médecins" => "Nombre total de médecins participant * Nombre moyen de tables rondes assistées par médecin",
        //             "Nombre total de tables rondes" => "Nombre total de contacts médecins / Nombre moyen de médecins par table ronde",
        //             "Nombre de médecins avec perception positive" => "Nombre total de médecins participant * Pourcentage avec perception positive",
        //             "Nombre de médecins prescrivant" => "Nombre de médecins avec perception positive * Pourcentage prescrivant",
        //             "Nombre de patients incrémentaux" => "Nombre de médecins prescrivant * Nombre moyen de patients par médecin",
        //             "Ventes incrémentales générées" => "Nombre de patients incrémentaux * Valeur du revenu par patient",
        //             "Coût total du programme" => "Coût variable par table ronde * Nombre total de tables rondes + Coût fixe",
        //             "ROI" => "Ventes incrémentales générées / Coût total du programme"
        //         ],JSON_UNESCAPED_UNICODE),
        //     ],

        //     // Activité 6: Visites médicales
        //     [
        //         "ActivityId" => 6,
        //         "fomulat" => json_encode([
        //             "Nombre total de visites" => "Nombre de médecins ciblés * Nombre moyen de visites par médecin",
        //             "Nombre de médecins rappelant le message" => "Nombre de médecins ciblés * Pourcentage rappelant le message",
        //             "Nombre de médecins prescrivant" => "Nombre de médecins rappelant le message * Pourcentage prescrivant",
        //             "Nombre de patients incrémentaux" => "Nombre de médecins prescrivant * Nombre moyen de nouveaux patients",
        //             "Ventes incrémentales générées" => "Nombre de patients incrémentaux * Valeur du revenu par patient",
        //             "Coût total du programme" => "Coût variable par représentant * Nombre total de représentants",
        //             "ROI" => "Ventes incrémentales générées / Coût total du programme"
        //         ],JSON_UNESCAPED_UNICODE),
        //     ],

        //     // Activité 7: Publicité directe au consommateur
        //     [
        //         "ActivityId" => 7,
        //         "fomulat" => json_encode([
        //             "Nombre de consommateurs atteints" => "Nombre de consommateurs cibles * Pourcentage atteints",
        //             "Nombre de consommateurs rappelant la campagne" => "Nombre de consommateurs atteints * Taux de mémorisation",
        //             "Nombre de consommateurs consultant un médecin" => "Nombre de consommateurs rappelant la campagne * Pourcentage consultant un médecin",
        //             "Nombre de patients incrémentaux" => "Nombre de consommateurs consultant un médecin * Pourcentage obtenant une prescription",
        //             "Ventes incrémentales générées" => "Nombre de patients incrémentaux * Valeur du revenu par patient",
        //             "Coût total du programme" => "Dépenses médias + Coûts de production et frais d’agence",
        //             "ROI" => "Ventes incrémentales générées / Coût total du programme"
        //         ],JSON_UNESCAPED_UNICODE),
        //     ],

        //     // Activité 8: Publicité en ligne pour les patients
        //     [
        //         "ActivityId" => 8,
        //         "fomulat" => json_encode([
        //             "Nombre total de patients atteints" => "Population totale * Taux d’incidence",
        //             "Patients potentiels non traités" => "Nombre total de patients atteints * (1 - Pourcentage de patients déjà traités)",
        //             "Patients ciblés" => "Patients potentiels non traités * Pourcentage visé par la campagne",
        //             "Efficacité d’atteinte" => "Nombre de visites uniques / Patients ciblés",
        //             "Visiteurs intéressés" => "Nombre de visites uniques * Pourcentage engagés",
        //             "Visiteurs ayant consulté un médecin" => "Visiteurs intéressés * Pourcentage ayant consulté",
        //             "Patients incrémentaux" => "Visiteurs ayant consulté un médecin * Pourcentage obtenant une prescription",
        //             "Ventes incrémentales générées" => "Patients incrémentaux * Valeur du revenu par patient",
        //             "Coût total du programme" => "Coût total de la campagne digitale",
        //             "ROI" => "Ventes incrémentales générées / Coût total du programme"
        //         ],JSON_UNESCAPED_UNICODE),
        //     ],

        //     // Activité 9: Publicité dans les revues
        //     [
        //         "ActivityId" => 9,
        //         "fomulat" => json_encode([
        //             "Médecins rappelant la publicité" => "Nombre de médecins lecteurs * Pourcentage mémorisant",
        //             "Médecins prescrivant" => "Médecins rappelant la publicité * Pourcentage prescrivant",
        //             "Patients incrémentaux" => "Médecins prescrivant * Nombre moyen de nouveaux patients",
        //             "Ventes incrémentales générées" => "Patients incrémentaux * Valeur du revenu par patient",
        //             "Coût total du programme" => "Coûts d’achat média + Coûts de production et frais d’agence",
        //             "ROI" => "Ventes incrémentales générées / Coût total du programme"
        //         ],JSON_UNESCAPED_UNICODE),
        //     ],

        //     // Activité 10: Générique (Médecins)
        //     [
        //         "ActivityId" => 10,
        //         "fomulat" => json_encode([
        //             "Médecins rappelant le message" => "Nombre de médecins exposés * Pourcentage mémorisant",
        //             "Médecins avec perception positive" => "Médecins rappelant le message * Pourcentage perception positive",
        //             "Médecins prescrivant" => "Médecins avec perception positive * Pourcentage prescrivant",
        //             "Patients incrémentaux" => "Médecins prescrivant * Nombre moyen de patients",
        //             "Ventes incrémentales générées" => "Patients incrémentaux * Valeur du revenu par patient",
        //             "Coût total du programme" => "Coût global de l’activité",
        //             "ROI" => "Ventes incrémentales générées / Coût total du programme"
        //         ],JSON_UNESCAPED_UNICODE),
        //     ],

        //     // Activité 11: Générique (Patients)
        //     [
        //         "ActivityId" => 11,
        //         "fomulat" => json_encode([
        //             "Consommateurs rappelant le message" => "Nombre de consommateurs exposés * Pourcentage mémorisant",
        //             "Consommateurs consultant un médecin" => "Consommateurs rappelant le message * Pourcentage consultant",
        //             "Patients incrémentaux" => "Consommateurs consultant un médecin * Pourcentage obtenant une prescription",
        //             "Ventes incrémentales générées" => "Patients incrémentaux * Valeur du revenu par patient",
        //             "Coût total du programme" => "Coût global de l’activité",
        //             "ROI" => "Ventes incrémentales générées / Coût total du programme"
        //         ],s),
        //     ],

        //     // Activité 12: Promotion numérique pour les médecins
        //     [
        //         "ActivityId" => 12,
        //         "fomulat" => json_encode([
        //             "Médecins atteints en ligne" => "Nombre de médecins susceptibles de prescrire * Pourcentage utilisant internet",
        //             "Efficacité de la campagne" => "Nombre total de visites uniques / Médecins atteints en ligne",
        //             "Médecins engagés" => "Nombre total de visites uniques * Pourcentage ayant interagi",
        //             "Médecins avec perception positive" => "Médecins engagés * Pourcentage perception positive",
        //             "Médecins prescrivant" => "Médecins avec perception positive * Pourcentage prescrivant",
        //             "Patients incrémentaux" => "Médecins prescrivant * Nombre moyen de patients",
        //             "Ventes incrémentales générées" => "Patients incrémentaux * Valeur du revenu par patient",
        //             "Coût total du programme" => "Coût total de la campagne digitale",
        //             "ROI" => "Ventes incrémentales générées / Coût total du programme"
        //         ]),
        //     ]
        // ]);



        // Insertion des utilisateurs
        DB::table('users')->insert([
            ["FirstName" => "Ibrahim", "LastName" => "Benmagha", "password" => Hash::make('120501@Casahm'), "email" => "benmagha@gmail.com", "Role" => "Admin"],
            ["FirstName" => "said", "LastName" => "taghmaoui", "password" => Hash::make('120501@Casahm'), "email" => "said@gmail.com", "Role" => "Admin"],
            ["FirstName" => "Rachid", "LastName" => "katorza", "password" => Hash::make('120501@Casahm'), "email" => "Rachid@gmail.com", "Role" => "Admin"],
            ["FirstName" => "Yasser", "LastName" => "Eddaoussari", "password" => Hash::make('120501@Casahm'), "email" => "Yasser@gmail.com", "Role" => "Admin"],
        ]);

        // Insertion des laboratoires
        $labos = [
            [
                'FirstName' => 'Mark',
                'LastName' => 'Lermon',
                'email' => 'Mark.Lermon@gmail.com',
                'password' => Hash::make('120501@Casahm'),
                'Name' => 'Labo Exemple 1'
            ],
            [
                'FirstName' => 'John',
                'LastName' => 'Doe',
                'email' => 'john.doe@example.com',
                'password' => Hash::make('password123'),
                'Name' => 'Labo Example 2'
            ]
        ];

        foreach ($labos as $laboData) {
            $user = User::create([
                'FirstName' => $laboData['FirstName'],
                'LastName' => $laboData['LastName'],
                'email' => $laboData['email'],
                'password' => $laboData['password'],
                'Role' => 'Laboratoire',
            ]);

            Labo::create([
                'status' => "Activated",
                'userId' => $user->id,
                'Name' => $laboData['Name'],
            ]);
        }
    }

    
}
