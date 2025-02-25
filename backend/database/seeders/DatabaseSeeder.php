<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\ActivitiesList;
use Illuminate\Support\Facades\DB;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        //
        DB::table('activitieslist')->insert([
            ["Name" => "Distribution des échantillons" ],
            ["Name" => "Essai clinique"],
            ["Name" => "Mailing"],
            ["Name" => "Conférences"],
            ["Name" => "Tables rondes"],
            ["Name" => "Visites médicales"],
            ["Name" => "Publicité directe au consommateur"],
            ["Name" => "Publicité directe au consommateur en ligne"],
            ["Name" => "Publicité dans les revues"],
            ["Name" => "Générique (Médecins)"],
            ["Name" => "Générique (Patients)"],
            ["Name" => "Promotion numérique pour les médecins"],
        ]);

        //Activité 1: Distribution des échantillons
        DB::table('activityItems')->insert([
            ["Name" => "Nombre de médecins recevant des échantillons", "ActivityId" => 1],
            ["Name" => "Nombre d’échantillons donnés à chaque médecin", "ActivityId" => 1],
            ["Name" => "Pourcentage des échantillons réellement donnés aux patients", "ActivityId" => 1],
            ["Name" => "Nombre moyen d’échantillons donnés par patient", "ActivityId" => 1],
            ["Name" => "Pourcentage des patients ayant reçu une prescription après usage de l’échantillon", "ActivityId" => 1],
            ["Name" => "Pourcentage des patients prescrits sans échantillon", "ActivityId" => 1],
            ["Name" => "Valeur moyenne d’un patient incrémental en MAD", "ActivityId" => 1],
            ["Name" => "Coût unitaire d’un échantillon", "ActivityId" => 1],
            ["Name" => "Coûts fixes du programme", "ActivityId" => 1],
            ["Name" => "Roi de de l'activite 1", "ActivityId" => 1],
        ]);

        //Activité 2: Essai clinique
        DB::table('activityItems')->insert([
            ["Name" => "Nombre de médecins participant à l'étude", "ActivityId" => 2],
            ["Name" => "Nombre moyen de patients inscrits par médecin", "ActivityId" => 2],
            ["Name" => "Pourcentage moyen de patients qui continuent le traitement après l'étude", "ActivityId" => 2],
            ["Name" => "Nombre de nouveaux patients traités par médecin grâce à l'étude", "ActivityId" => 2],
            ["Name" => "Valeur du revenu par patient incrémental", "ActivityId" => 2],
            ["Name" => "Coût variable par médecin", "ActivityId" => 2],
            ["Name" => "Coût fixe total de l’étude", "ActivityId" => 2],
            ["Name" => "Roi de de l'activite 2", "ActivityId" => 2],

        ]);

        //Activité 3: Mailing
        DB::table('activityItems')->insert([
            ["Name" => "Nombre total de médecins ciblés par l’email", "ActivityId" => 3],
            ["Name" => "Pourcentage de médecins se rappelant avoir reçu l’email", "ActivityId" => 3],
            ["Name" => "Pourcentage de médecins se rappelant de la marque et du message", "ActivityId" => 3],
            ["Name" => "Pourcentage de médecins prescrivant Prexige à de nouveaux patients après réception du message", "ActivityId" => 3],
            ["Name" => "Nombre moyen de nouveaux patients mis sous Prexige par médecin", "ActivityId" => 3],
            ["Name" => "Valeur du revenu par patient incrémental", "ActivityId" => 3],
            ["Name" => "Coût variable par email envoyé", "ActivityId" => 3],
            ["Name" => "Nombre moyen d’emails envoyés par médecin", "ActivityId" => 3],
            ["Name" => "Coût fixe total du programme", "ActivityId" => 3],
            ["Name" => "Roi de de l'activite 3", "ActivityId" => 3],

        ]);

        // Activité 4: Conférences
        DB::table('activityItems')->insert([
            ["Name" => "Nombre de médecins participants à la conférence", "ActivityId" => 4],
            ["Name" => "Pourcentage de médecins ayant retenu le message", "ActivityId" => 4],
            ["Name" => "Pourcentage de médecins ayant changé positivement leur perception après la conférence", "ActivityId" => 4],
            ["Name" => "Pourcentage de ces médecins qui commencent à prescrire à de nouveaux patients", "ActivityId" => 4],
            ["Name" => "Nombre moyen de nouveaux patients prescrits par médecin", "ActivityId" => 4],
            ["Name" => "Valeur d’ajustement KOL", "ActivityId" => 4],
            ["Name" => "Valeur de revenu générée par patient incrémental", "ActivityId" => 4],
            ["Name" => "Coût variable par médecin", "ActivityId" => 4],
            ["Name" => "Coût fixe du programme", "ActivityId" => 4],
            ["Name" => "Roi de de l'activite 4", "ActivityId" => 4],

        ]);
        // Activité 5: Tables rondes
        DB::table('activityItems')->insert([
            ["Name" => "Nombre total de médecins participant", "ActivityId" => 5],
            ["Name" => "Nombre moyen de tables rondes assistées par médecin par an", "ActivityId" => 5],
            ["Name" => "Nombre moyen de médecins par table ronde", "ActivityId" => 5],
            ["Name" => "% de médecins ayant changé positivement leur perception", "ActivityId" => 5],
            ["Name" => "% de médecins influencés qui vont prescrire", "ActivityId" => 5],
            ["Name" => "Nombre moyen de nouveaux patients mis sous traitement par médecin", "ActivityId" => 5],
            ["Name" => "Valeur du revenu par patient incrémental", "ActivityId" => 5],
            ["Name" => "Coût variable par table ronde", "ActivityId" => 5],
            ["Name" => "Coût fixe total du programme", "ActivityId" => 5],
            ["Name" => "Roi de de l'activite 5", "ActivityId" => 5],

        ]);


        // Activité 6: Visites médicales
        DB::table('activityItems')->insert([
            ["Name" => "Nombre total de médecins ciblés par le représentant", "ActivityId" => 6],
            ["Name" => "Nombre moyen de visites (détails) par médecin", "ActivityId" => 6],
            ["Name" => "% de médecins se rappelant du message délivré lors de la visite", "ActivityId" => 6],
            ["Name" => "% de médecins prescrivant Prexige à de nouveaux patients après avoir reçu le message", "ActivityId" => 6],
            ["Name" => "Nombre moyen de nouveaux patients mis sous Prexige par médecin", "ActivityId" => 6],
            ["Name" => "Valeur du revenu par patient incrémental", "ActivityId" => 6],
            ["Name" => "Coût variable par représentant", "ActivityId" => 6],
            ["Name" => "Nombre total de représentants", "ActivityId" => 6],
            ["Name" => "Roi de de l'activite 6", "ActivityId" => 6],

        ]);
        // Activité 7: Publicité directe au consommateur
        DB::table('activityItems')->insert([
            ["Name" => "Nombre de consommateurs cibles pour la campagne", "ActivityId" => 7],
            ["Name" => "% d’audience cible atteinte par le plan média", "ActivityId" => 7],
            ["Name" => "% de consommateurs atteints se rappelant de la campagne (taux de mémorisation)", "ActivityId" => 7],
            ["Name" => "% de consommateurs se rappelant de la campagne DTC ayant consulté un médecin suite à l’exposition", "ActivityId" => 7],
            ["Name" => "% de patients ayant consulté et recevant une prescription Prexige", "ActivityId" => 7],
            ["Name" => "Valeur du revenu par patient incrémental", "ActivityId" => 7],
            ["Name" => "Dépenses médias (en MAD k)", "ActivityId" => 7],
            ["Name" => "Coûts de production, frais d’agence et autres (en MAD k)", "ActivityId" => 7],
            ["Name" => "Roi de de l'activite 7", "ActivityId" => 7],

        ]);

        // Activité 8: Publicité directe au consommateur en ligne
        DB::table('activityItems')->insert([
            ["Name" => "Population totale", "ActivityId" => 8],
            ["Name" => "Taux d’incidence de la maladie dans la population", "ActivityId" => 8],
            ["Name" => "% de patients déjà traités et satisfaits", "ActivityId" => 8],
            ["Name" => "% de patients potentiels visés par la campagne en ligne", "ActivityId" => 8],
            ["Name" => "Nombre total de visites uniques sur le site", "ActivityId" => 8],
            ["Name" => "% des visiteurs uniques qui passent un temps significatif sur le site", "ActivityId" => 8],
            ["Name" => "% des visiteurs uniques ayant consulté un médecin suite au message du site", "ActivityId" => 8],
            ["Name" => "% des patients ayant reçu une prescription Prexige", "ActivityId" => 8],
            ["Name" => "Valeur du revenu généré par patient incrémental", "ActivityId" => 8],
            ["Name" => "Coût total du programme e-campagne", "ActivityId" => 8],
            ["Name" => "Roi de de l'activite 8", "ActivityId" => 8],

        ]);

        // Activité 9: Publicité dans les revues
        DB::table('activityItems')->insert([
            ["Name" => "Nombre de médecins ayant lu au moins une publication contenant une annonce produit", "ActivityId" => 9],
            ["Name" => "Nombre total d’insertions prévues sur l’année", "ActivityId" => 9],
            ["Name" => "Pourcentage des médecins lecteurs capables de se souvenir de la marque et du message après exposition", "ActivityId" => 9],
            ["Name" => "Pourcentage des médecins ayant mémorisé la publicité qui commencent à prescrire le produit", "ActivityId" => 9],
            ["Name" => "Nombre moyen de nouveaux patients mis sous traitement par chaque médecin prescripteur", "ActivityId" => 9],
            ["Name" => "Revenu moyen généré par chaque nouveau patient traité", "ActivityId" => 9],
            ["Name" => "Coûts d’achat d’espace publicitaire pour la campagne presse", "ActivityId" => 9],
            ["Name" => "Frais de création et de gestion de la campagne", "ActivityId" => 9],
            ["Name" => "Roi de de l'activite 9", "ActivityId" => 9],

        ]);

        // Activité 10: Générique (Médecins)
        DB::table('activityItems')->insert([
            ["Name" => "Nombre de médecins exposés à l’activité", "ActivityId" => 10],
            ["Name" => "Pourcentage des médecins capables de se souvenir de la marque et du message", "ActivityId" => 10],
            ["Name" => "Pourcentage des médecins ayant amélioré leur perception du produit", "ActivityId" => 10],
            ["Name" => "Pourcentage des médecins ayant changé de perception et prescrit à de nouveaux patients", "ActivityId" => 10],
            ["Name" => "Nombre moyen de nouveaux patients traités par chaque médecin prescripteur", "ActivityId" => 10],
            ["Name" => "Revenu moyen généré par chaque nouveau patient traité", "ActivityId" => 10],
            ["Name" => "Coût global de l’organisation et de la mise en oeuvre de l’activité", "ActivityId" => 10],
            ["Name" => "Roi de de l'activite 10", "ActivityId" => 10],

        ]);

        // Activité 11: Générique (Patients)
        DB::table('activityItems')->insert([
            ["Name" => "Nombre de consommateurs exposés à l’activité", "ActivityId" => 11],
            ["Name" => "Pourcentage des consommateurs capables de se souvenir du message", "ActivityId" => 11],
            ["Name" => "Pourcentage des consommateurs ayant consulté un médecin", "ActivityId" => 11],
            ["Name" => "Pourcentage des consultations aboutissant à une prescription", "ActivityId" => 11],
            ["Name" => "Revenu moyen généré par chaque nouveau patient", "ActivityId" => 11],
            ["Name" => "Coût global de l’organisation et de la mise en oeuvre de l’activité", "ActivityId" => 11],
            ["Name" => "Roi de de l'activite 11", "ActivityId" => 11],

        ]);

        // Activité 12: Promotion numérique pour les médecins
        DB::table('activityItems')->insert([
            ["Name" => "Nombre de médecins susceptibles de prescrire le produit", "ActivityId" => 12],
            ["Name" => "Pourcentage des médecins utilisant internet pour des informations professionnelles", "ActivityId" => 12],
            ["Name" => "Nombre total de visites uniques sur le site", "ActivityId" => 12],
            ["Name" => "Pourcentage de visiteurs uniques ayant interagi davantage avec le contenu", "ActivityId" => 12],
            ["Name" => "Pourcentage des médecins informés ayant changé positivement leur perception du produit", "ActivityId" => 12],
            ["Name" => "Pourcentage des médecins ayant changé leur perception et qui sont susceptibles de prescrire le produit", "ActivityId" => 12],
            ["Name" => "Nombre moyen de nouveaux patients par médecin ayant prescrit le produit", "ActivityId" => 12],
            ["Name" => "Valeur moyenne de revenu par patient incrémental", "ActivityId" => 12],
            ["Name" => "Coût total du programme e-digital", "ActivityId" => 12],
            ["Name" => "Roi de de l'activite", "ActivityId" => 12],

        ]);

    }
}
