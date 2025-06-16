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
            ["Name" => "Valeur du revenu par patient incrémental en MAD", "type" => "number", "ActivityId" => 1, "symbole" => "K"],
            ["Name" => "Coût unitaire d’un échantillon", "type" => "number", "ActivityId" => 1, "symbole" => "M"],
            ["Name" => "Coûts fixes du programme", "type" => "number", "ActivityId" => 1, "symbole" => "N"],
            ["Name" => "Roi", "type" => "number", "ActivityId" => 1, "symbole" => "ROI"],
        ]);

        // Activité 2: Essai clinique
        DB::table('activityItems')->insert([
            ["Name" => "Nombre de médecins participant à l'étude", "type" => "number", "ActivityId" => 2, "symbole" => "A"],
            ["Name" => "Nombre moyen de patients inscrits par médecin", "type" => "number", "ActivityId" => 2, "symbole" => "B"],
            ["Name" => "Pourcentage moyen de patients qui continuent le traitement après l'étude", "type" => "percentage", "ActivityId" => 2, "symbole" => "D"],
            ["Name" => "Nombre de nouveaux patients traités par médecin grâce à l'étude", "type" => "number", "ActivityId" => 2, "symbole" => "F"],
            ["Name" => "Valeur du revenu par patient incrémental en MAD", "type" => "number", "ActivityId" => 2, "symbole" => "H"],
            ["Name" => "Coût variable par médecin", "type" => "number", "ActivityId" => 2, "symbole" => "J"],
            ["Name" => "Coût fixe total de l’étude", "type" => "number", "ActivityId" => 2, "symbole" => "K"],
            ["Name" => "Roi", "type" => "number", "ActivityId" => 2, "symbole" => "ROI"],
        ]);

        // Activité 3: Mailing
        DB::table('activityItems')->insert([
            ["Name" => "Nombre total de médecins ciblés par l’email", "type" => "number", "ActivityId" => 3, "symbole" => "A"],
            ["Name" => "Pourcentage de médecins se rappelant avoir reçu l’email", "type" => "percentage", "ActivityId" => 3, "symbole" => "C"],
            ["Name" => "Pourcentage de médecins se rappelant de la marque et du message", "type" => "percentage", "ActivityId" => 3, "symbole" => "E"],
            ["Name" => "Pourcentage de médecins prescrivant Prexige à de nouveaux patients après réception du message", "type" => "percentage", "ActivityId" => 3, "symbole" => "G"],
            ["Name" => "Nombre moyen de nouveaux patients mis sous Prexige par médecin", "type" => "number", "ActivityId" => 3, "symbole" => "I"],
            ["Name" => "Valeur du revenu par patient incrémental en MAD", "type" => "number", "ActivityId" => 3, "symbole" => "K"],
            ["Name" => "Coût variable par email envoyé", "type" => "number", "ActivityId" => 3, "symbole" => "M"],
            ["Name" => "Nombre moyen d’emails envoyés par médecin", "type" => "number", "ActivityId" => 3, "symbole" => "B"],
            ["Name" => "Coût fixe total du programme", "type" => "number", "ActivityId" => 3, "symbole" => "N"],
            ["Name" => "Roi", "type" => "number", "ActivityId" => 3, "symbole" => "ROI"],
        ]);

        // Activité 4: Conférences
        DB::table('activityItems')->insert([
            ["Name" => "Nombre de médecins participants à la conférence", "type" => "number", "ActivityId" => 4, "symbole" => "A"],
            ["Name" => "Pourcentage de médecins ayant retenu le message", "type" => "percentage", "ActivityId" => 4, "symbole" => "B"],
            ["Name" => "Pourcentage de médecins ayant changé positivement leur perception après la conférence", "type" => "percentage", "ActivityId" => 4, "symbole" => "D"],
            ["Name" => "Pourcentage de ces médecins qui commencent à prescrire à de nouveaux patients", "type" => "percentage", "ActivityId" => 4, "symbole" => "F"],
            ["Name" => "Nombre moyen de nouveaux patients prescrits par médecin", "type" => "number", "ActivityId" => 4, "symbole" => "H"],
            ["Name" => "Valeur d’ajustement KOL", "type" => "number", "ActivityId" => 4, "symbole" => "I"],
            ["Name" => "Valeur du revenu par patient incrémental en MAD", "type" => "number", "ActivityId" => 4, "symbole" => "J"],
            ["Name" => "Coût variable par médecin", "type" => "number", "ActivityId" => 4, "symbole" => "L"],
            ["Name" => "Coût fixe du programme", "type" => "number", "ActivityId" => 4, "symbole" => "M"],
            ["Name" => "Roi", "type" => "number", "ActivityId" => 4, "symbole" => "ROI"],
        ]);

        // Activité 5: Tables rondes
        DB::table('activityItems')->insert([
            ["Name" => "Nombre total de médecins participant", "type" => "number", "ActivityId" => 5, "symbole" => "A"],
            ["Name" => "Nombre moyen de tables rondes assistées par médecin par an", "type" => "number", "ActivityId" => 5, "symbole" => "B"],
            ["Name" => "Nombre moyen de médecins par table ronde", "type" => "number", "ActivityId" => 5, "symbole" => "D"],
            ["Name" => "% de médecins ayant changé positivement leur perception", "type" => "percentage", "ActivityId" => 5, "symbole" => "F"],
            ["Name" => "% de médecins influencés qui vont prescrire", "type" => "percentage", "ActivityId" => 5, "symbole" => "H"],
            ["Name" => "Nombre moyen de nouveaux patients mis sous traitement par médecin", "type" => "number", "ActivityId" => 5, "symbole" => "J"],
            ["Name" => "Valeur du revenu par patient incrémental en MAD", "type" => "number", "ActivityId" => 5, "symbole" => "L"],
            ["Name" => "Coût variable par table ronde", "type" => "number", "ActivityId" => 5, "symbole" => "N"],
            ["Name" => "Coût fixe total du programme", "type" => "number", "ActivityId" => 5, "symbole" => "O"],
            ["Name" => "Roi", "type" => "number", "ActivityId" => 5, "symbole" => "ROI"],
        ]);

        // Activité 6: Visites médicales
        DB::table('activityItems')->insert([
            ["Name" => "Nombre total de médecins ciblés par le représentant", "type" => "number", "ActivityId" => 6, "symbole" => "A"],
            ["Name" => "Nombre moyen de visites (détails) par médecin", "type" => "number", "ActivityId" => 6, "symbole" => "B"],
            ["Name" => "% de médecins se rappelant du message délivré lors de la visite", "type" => "percentage", "ActivityId" => 6, "symbole" => "E"],
            ["Name" => "% de médecins prescrivant Prexige à de nouveaux patients après avoir reçu le message", "type" => "percentage", "ActivityId" => 6, "symbole" => "G"],
            ["Name" => "Nombre moyen de nouveaux patients mis sous Prexige par médecin", "type" => "number", "ActivityId" => 6, "symbole" => "I"],
            ["Name" => "Valeur du revenu par patient incrémental en MAD", "type" => "number", "ActivityId" => 6, "symbole" => "K"],
            ["Name" => "Coût variable par représentant", "type" => "number", "ActivityId" => 6, "symbole" => "M1"],
            ["Name" => "Nombre total de représentants", "type" => "number", "ActivityId" => 6, "symbole" => "M2"],
            ["Name" => "Roi", "type" => "number", "ActivityId" => 6, "symbole" => "ROI"],
        ]);

        // Activité 7: Publicité directe au consommateur
        DB::table('activityItems')->insert([
            ["Name" => "Nombre de consommateurs cibles pour la campagne", "type" => "number", "ActivityId" => 7, "symbole" => "G"],
            ["Name" => "% d'audience cible atteinte par le plan média", "type" => "percentage", "ActivityId" => 7, "symbole" => "H"],
            ["Name" => "% de consommateurs atteints se rappelant de la campagne (taux de mémorisation)", "type" => "percentage", "ActivityId" => 7, "symbole" => "J"],
            ["Name" => "% de consommateurs se rappelant de la campagne DTC ayant consulté un médecin suite à l'exposition", "type" => "percentage", "ActivityId" => 7, "symbole" => "L"],
            ["Name" => "% de patients ayant consulté et recevant une prescription Prexige", "type" => "percentage", "ActivityId" => 7, "symbole" => "N"],
            ["Name" => "Valeur du revenu par patient incrémental en MAD", "type" => "number", "ActivityId" => 7, "symbole" => "P"],
            ["Name" => "Dépenses médias (en MAD k)", "type" => "number", "ActivityId" => 7, "symbole" => "R1"],
            ["Name" => "Coûts de production, frais d'agence et autres (en MAD k)", "type" => "number", "ActivityId" => 7, "symbole" => "S"],
            ["Name" => "Roi", "type" => "number", "ActivityId" => 7, "symbole" => "ROI"],
        ]);

        // Activité 8: Publicité directe au consommateur en ligne
        DB::table('activityItems')->insert([
            ["Name" => "Population totale", "type" => "number", "ActivityId" => 8, "symbole" => "A"],
            ["Name" => "Taux d'incidence de la maladie dans la population", "type" => "percentage", "ActivityId" => 8, "symbole" => "B"],
            ["Name" => "% de patients déjà traités et satisfaits", "type" => "percentage", "ActivityId" => 8, "symbole" => "D"],
            ["Name" => "% de patients potentiels visés par la campagne en ligne", "type" => "percentage", "ActivityId" => 8, "symbole" => "F"],
            ["Name" => "Nombre total de visites uniques sur le site", "type" => "number", "ActivityId" => 8, "symbole" => "H"],
            ["Name" => "% des visiteurs uniques qui passent un temps significatif sur le site", "type" => "percentage", "ActivityId" => 8, "symbole" => "J"],
            ["Name" => "% des visiteurs uniques ayant consulté un médecin suite au message du site", "type" => "percentage", "ActivityId" => 8, "symbole" => "L"],
            ["Name" => "% des patients ayant reçu une prescription Prexige", "type" => "percentage", "ActivityId" => 8, "symbole" => "N"],
            ["Name" => "Valeur du revenu par patient incrémental en MAD", "type" => "number", "ActivityId" => 8, "symbole" => "P"],
            ["Name" => "Coût total du programme e-campagne", "type" => "number", "ActivityId" => 8, "symbole" => "R"],
            ["Name" => "Roi", "type" => "number", "ActivityId" => 8, "symbole" => "ROI"],
        ]);

        // Activité 9: Publicité dans les revues
        DB::table('activityItems')->insert([
            ["Name" => "Nombre de médecins ayant lu au moins une publication contenant une annonce produit", "type" => "number", "ActivityId" => 9, "symbole" => "A"],
            ["Name" => "Nombre total d'insertions prévues sur l'année", "type" => "number", "ActivityId" => 9, "symbole" => "B"],
            ["Name" => "Pourcentage des médecins lecteurs capables de se souvenir de la marque et du message après exposition", "type" => "percentage", "ActivityId" => 9, "symbole" => "C"],
            ["Name" => "Pourcentage des médecins ayant mémorisé la publicité qui commencent à prescrire le produit", "type" => "percentage", "ActivityId" => 9, "symbole" => "E"],
            ["Name" => "Nombre moyen de nouveaux patients mis sous traitement par chaque médecin prescripteur", "type" => "number", "ActivityId" => 9, "symbole" => "G"],
            ["Name" => "Valeur du revenu par patient incrémental en MAD", "type" => "number", "ActivityId" => 9, "symbole" => "I"],
            ["Name" => "Coûts d'achat d'espace publicitaire pour la campagne presse", "type" => "number", "ActivityId" => 9, "symbole" => "K"],
            ["Name" => "Frais de création et de gestion de la campagne", "type" => "number", "ActivityId" => 9, "symbole" => "L"],
            ["Name" => "Roi", "type" => "number", "ActivityId" => 9, "symbole" => "ROI"],
        ]);

        // Activité 10: Générique (Médecins)
        DB::table('activityItems')->insert([
            ["Name" => "Nombre de médecins exposés à l'activité", "type" => "number", "ActivityId" => 10, "symbole" => "A"],
            ["Name" => "Pourcentage des médecins capables de se souvenir de la marque et du message", "type" => "percentage", "ActivityId" => 10, "symbole" => "B"],
            ["Name" => "Pourcentage des médecins ayant amélioré leur perception du produit", "type" => "percentage", "ActivityId" => 10, "symbole" => "D"],
            ["Name" => "Pourcentage des médecins ayant changé de perception et prescrit à de nouveaux patients", "type" => "percentage", "ActivityId" => 10, "symbole" => "F"],
            ["Name" => "Nombre moyen de nouveaux patients traités par chaque médecin prescripteur", "type" => "number", "ActivityId" => 10, "symbole" => "H"],
            ["Name" => "Valeur du revenu par patient incrémental en MAD", "type" => "number", "ActivityId" => 10, "symbole" => "J"],
            ["Name" => "Coût global de l'organisation et de la mise en œuvre de l'activité", "type" => "number", "ActivityId" => 10, "symbole" => "L"],
            ["Name" => "Roi", "type" => "number", "ActivityId" => 10, "symbole" => "ROI"],
        ]);

        // Activité 11: Générique (Patients)
        DB::table('activityItems')->insert([
            ["Name" => "Nombre de consommateurs exposés à l'activité", "type" => "number", "ActivityId" => 11, "symbole" => "A"],
            ["Name" => "Pourcentage des consommateurs capables de se souvenir du message", "type" => "percentage", "ActivityId" => 11, "symbole" => "B"],
            ["Name" => "Pourcentage des consommateurs ayant consulté un médecin", "type" => "percentage", "ActivityId" => 11, "symbole" => "D"],
            ["Name" => "Pourcentage des consultations aboutissant à une prescription", "type" => "percentage", "ActivityId" => 11, "symbole" => "F"],
            ["Name" => "Valeur du revenu par patient incrémental en MAD", "type" => "number", "ActivityId" => 11, "symbole" => "H"],
            ["Name" => "Coût global de l'organisation et de la mise en œuvre de l'activité", "type" => "number", "ActivityId" => 11, "symbole" => "J"],
            ["Name" => "Roi", "type" => "number", "ActivityId" => 11, "symbole" => "ROI"],
        ]);

        // Activité 12: Promotion numérique pour les médecins
        DB::table('activityItems')->insert([
            ["Name" => "Nombre de médecins susceptibles de prescrire le produit", "type" => "number", "ActivityId" => 12, "symbole" => "A"],
            ["Name" => "Pourcentage des médecins utilisant internet pour des informations professionnelles", "type" => "percentage", "ActivityId" => 12, "symbole" => "B"],
            ["Name" => "Nombre total de visites uniques sur le site", "type" => "number", "ActivityId" => 12, "symbole" => "D"],
            ["Name" => "Pourcentage de visiteurs uniques ayant interagi davantage avec le contenu", "type" => "percentage", "ActivityId" => 12, "symbole" => "F"],
            ["Name" => "Pourcentage des médecins informés ayant changé positivement leur perception du produit", "type" => "percentage", "ActivityId" => 12, "symbole" => "H"],
            ["Name" => "Pourcentage des médecins ayant changé leur perception et qui sont susceptibles de prescrire le produit", "type" => "percentage", "ActivityId" => 12, "symbole" => "J"],
            ["Name" => "Nombre moyen de nouveaux patients par médecin ayant prescrit le produit", "type" => "number", "ActivityId" => 12, "symbole" => "L"],
            ["Name" => "Valeur du revenu par patient incrémental en MAD", "type" => "number", "ActivityId" => 12, "symbole" => "N"],
            ["Name" => "Coût total du programme e-digital", "type" => "number", "ActivityId" => 12, "symbole" => "P"],
            ["Name" => "Roi", "type" => "number", "ActivityId" => 12, "symbole" => "ROI"],
        ]);



       
DB::table('calculationformula')->insert([
    // Activité 1: Distribution des échantillons
    [
        "ActivityId" => 1,
        "formulat" => json_encode([
            "nombre_total_echantillons_distribues" => "A * B",
            "nombre_total_patients_recu_echantillon" => "nombre_total_echantillons_distribues * D / E",
            "patients_ordonnes_apres_echantillon" => "nombre_total_patients_recu_echantillon * G",
            "patients_ordonnes_sans_echantillon" => "patients_ordonnes_apres_echantillon * I",
            "patients_incrementaux" => "patients_ordonnes_apres_echantillon * (1 - I)",
            "ventes_incrementales" => "patients_incrementaux * K",
            "cout_variable" => "M * nombre_total_echantillons_distribues",
            "cout_total" => "cout_variable + N",
            "roi" => "ventes_incrementales / cout_total"
        ]),
    ],
    // Activité 2: Essai clinique
    [
        "ActivityId" => 2,
        "formulat" => json_encode([
            "nombre_total_patients_inscrits" => "A * B",
            "patients_continuant_traitement" => "B * D",
            "patients_incrementaux" => "A * (patients_continuant_traitement + F)",
            "ventes_incrementales" => "patients_incrementaux * H",
            "cout_total" => "(J * A) + K",
            "roi" => "ventes_incrementales / cout_total"
        ]),
    ],
    // Activité 3: Mailing
    [
        "ActivityId" => 3,
        "formulat" => json_encode([
            "medecins_rappeles_email" => "A * C",
            "medecins_rappeles_marque" => "medecins_rappeles_email * E",
            "medecins_prescrivant" => "medecins_rappeles_marque * G",
            "patients_incrementaux" => "medecins_prescrivant * I",
            "ventes_incrementales" => "patients_incrementaux * K",
            "cout_total" => "(M * A * B) + N",
            "roi" => "ventes_incrementales / cout_total"
        ]),
    ],
    // Activité 4: Conférences
    [
        "ActivityId" => 4,
        "formulat" => json_encode([
            "medecins_rappeles_message" => "A * B",
            "medecins_perception_positive" => "medecins_rappeles_message * D",
            "medecins_prescrivant" => "medecins_perception_positive * F",
            "patients_incrementaux" => "(medecins_prescrivant * H) + I",
            "ventes_incrementales" => "patients_incrementaux * J",
            "cout_total" => "(L * A) + M",
            "roi" => "ventes_incrementales / cout_total"
        ]),
    ],
    // Activité 5: Tables rondes
    [
        "ActivityId" => 5,
        "formulat" => json_encode([
            "nombre_total_contacts_medecins" => "A * B",
            "nombre_total_tables_rondes" => "nombre_total_contacts_medecins / D",
            "medecins_perception_positive" => "A * F",
            "medecins_prescrivant" => "medecins_perception_positive * H",
            "patients_incrementaux" => "medecins_prescrivant * J",
            "ventes_incrementales" => "patients_incrementaux * L",
            "cout_total" => "(N * nombre_total_tables_rondes) + O",
            "roi" => "ventes_incrementales / cout_total"
        ]),
    ],
    // Activité 6: Visites médicales
    [
        "ActivityId" => 6,
        "formulat" => json_encode([
            "nombre_total_visites" => "A * B",
            "medecins_rappeles_message" => "A * E",
            "medecins_prescrivant" => "medecins_rappeles_message * G",
            "patients_incrementaux" => "medecins_prescrivant * I",
            "ventes_incrementales" => "patients_incrementaux * K",
            "cout_total" => "M1 * M2",
            "roi" => "ventes_incrementales / cout_total"
        ]),
    ],
    // Activité 7: Publicité directe au consommateur
    [
        "ActivityId" => 7,
        "formulat" => json_encode([
            "consommateurs_atteints" => "G * H",
            "consommateurs_rappeles_campagne" => "consommateurs_atteints * J",
            "consommateurs_consulte_medecin" => "consommateurs_rappeles_campagne * L",
            "patients_incrementaux" => "consommateurs_consulte_medecin * N",
            "ventes_incrementales" => "patients_incrementaux * P",
            "cout_total" => "R1 + S",
            "roi" => "ventes_incrementales / cout_total"
        ]),
    ],
    // Activité 8: Publicité directe au consommateur en ligne
    [
        "ActivityId" => 8,
        "formulat" => json_encode([
            "nombre_total_patients_maladie" => "A * B",
            "patients_potentiels" => "nombre_total_patients_maladie * (1 - D)",
            "patients_cibles" => "patients_potentiels * F",
            "efficacite_atteinte" => "H / patients_cibles",
            "visiteurs_interesses" => "H * J",
            "visiteurs_consulte_medecin" => "visiteurs_interesses * L",
            "patients_incrementaux" => "visiteurs_consulte_medecin * N",
            "ventes_incrementales" => "patients_incrementaux * P",
            "cout_total" => "R",
            "roi" => "ventes_incrementales / cout_total"
        ]),
    ],
    // Activité 9: Publicité dans les revues
    [
        "ActivityId" => 9,
        "formulat" => json_encode([
            "medecins_rappeles_annonce" => "A * C",
            "medecins_prescrivant" => "medecins_rappeles_annonce * E",
            "patients_incrementaux" => "medecins_prescrivant * G",
            "ventes_incrementales" => "patients_incrementaux * I",
            "cout_total" => "K + L",
            "roi" => "ventes_incrementales / cout_total"
        ]),
    ],
    // Activité 10: Générique (Médecins)
    [
        "ActivityId" => 10,
        "formulat" => json_encode([
            "medecins_rappeles_message" => "A * B",
            "medecins_perception_positive" => "medecins_rappeles_message * D",
            "medecins_prescrivant" => "medecins_perception_positive * F",
            "patients_incrementaux" => "medecins_prescrivant * H",
            "ventes_incrementales" => "patients_incrementaux * J",
            "cout_total" => "L",
            "roi" => "ventes_incrementales / cout_total"
        ]),
    ],
    // Activité 11: Générique (Patients)
    [
        "ActivityId" => 11,
        "formulat" => json_encode([
            "consommateurs_rappeles_message" => "A * B",
            "consommateurs_consulte_medecin" => "consommateurs_rappeles_message * D",
            "patients_incrementaux" => "consommateurs_consulte_medecin * F",
            "ventes_incrementales" => "patients_incrementaux * H",
            "cout_total" => "J",
            "roi" => "ventes_incrementales / cout_total"
        ]),
    ],
    // Activité 12: Promotion numérique pour les médecins
    [
        "ActivityId" => 12,
        "formulat" => json_encode([
            "medecins_joignables_en_ligne" => "A * B",
            "efficacite_atteinte" => "D / medecins_joignables_en_ligne",
            "medecins_engages" => "D * F",
            "medecins_perception_positive" => "medecins_engages * H",
            "medecins_prescrivant" => "medecins_perception_positive * J",
            "patients_incrementaux" => "medecins_prescrivant * L",
            "ventes_incrementales" => "patients_incrementaux * N",
            "cout_total" => "P",
            "roi" => "ventes_incrementales / cout_total"
        ]),
    ],
]);



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
//{"medecins_joignables_en_ligne":"A * B",
//"efficacite_atteinte":"D \/ medecins_joignables_en_ligne",
//"medecins_engages":"D * F",
//"medecins_perception_positive":"medecins_engages * H",
//"medecins_prescrivant":"medecins_perception_positive * J",
//"patients_incrementaux":"medecins_prescrivant * L",
//"ventes_incrementales":"patients_incrementaux * N",
//"cout_total":"P",
//"roi":"ventes_incrementales \/ cout_total"}

//{"Revenu_Total":"A + B",
//"Cout_Total":"C + D",
//"roi":"Revenu_Total \/ Cout_Total"}