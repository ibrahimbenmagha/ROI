<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ActivityItemValue;
use App\Models\ActivityByLabo;
use App\Models\ActivitiesList;
use App\Helpers\JwtHelper; // Adjust the namespace as needed

use App\Models\ActivityItem;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use App\Models\Labo;

class Activity1_12 extends Controller
{
    //Activite 1

    public function insetrIntoTable1(Request $request)
    {
        try {
            $laboId = JWTHelper::getLaboId($request);
            if (!$laboId) {
                return response()->json(['message' => 'Token invalide'], 401);
            }

            $validated = $request->validate([
                'year' => 'required|integer',
                'A' => 'required|numeric|min:0',
                'B' => 'required|numeric|min:0',
                'D' => 'required|numeric|min:0|max:100',
                'E' => 'required|numeric|min:0.1',
                'G' => 'required|numeric|min:0|max:100',
                'I' => 'required|numeric|min:0|max:100',
                'K' => 'required|numeric|min:0',
                'M' => 'required|numeric|min:0',
                'N' => 'required|numeric|min:0',

                // IDs des activity items
                'id_A' => 'required|integer',
                'id_B' => 'required|integer',
                'id_D' => 'required|integer',
                'id_E' => 'required|integer',
                'id_G' => 'required|integer',
                'id_I' => 'required|integer',
                'id_K' => 'required|integer',
                'id_M' => 'required|integer',
                'id_N' => 'required|integer',
                'id_ROI' => 'required|integer',
            ]);
            $activityNumber = 1;

            if (!$activityNumber) {
                return response()->json(['message' => 'Numéro d’activité manquant.'], 400);
            }

            $activityByLabo = ActivityByLabo::Create([
                'ActivityId' => $activityNumber,
                'laboId' => $laboId,
                'year' => $validated['year'],
            ]);


            // Conversion des pourcentages
            $D = $validated['D'] / 100;
            $G = $validated['G'] / 100;
            $I = $validated['I'] / 100;

            // Calcul
            $A = $validated['A'];
            $B = $validated['B'];
            $E = $validated['E'];
            $K = $validated['K'];
            $M = $validated['M'];
            $N = $validated['N'];

            $C = $A * $B;
            $F = ($C * $D) / $E;
            $H = $F * $G;
            $J = $H * (1 - $I);
            $L = $J * $K;
            $O = ($M * $C) + $N;
            $ROI = ($O > 0) ? round($L / $O, 4) : 0;

            // Insertion des valeurs
            $values = [
                ['activityItemId' => $validated['id_A'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $A],
                ['activityItemId' => $validated['id_B'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $B],
                ['activityItemId' => $validated['id_D'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $D],
                ['activityItemId' => $validated['id_E'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $E],
                ['activityItemId' => $validated['id_G'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $G],
                ['activityItemId' => $validated['id_I'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $I],
                ['activityItemId' => $validated['id_K'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $K],
                ['activityItemId' => $validated['id_M'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $M],
                ['activityItemId' => $validated['id_N'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $N],
                ['activityItemId' => $validated['id_ROI'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $ROI],
            ];

            ActivityItemValue::insert($values);

            return response()->json([
                'message' => 'Activité créée et calculée avec succès.',
                'ROI' => $ROI,
                'C'=>$C,
                'F'=>$F,
                'J'=>$J,
                'L' => $L,
                'O' => $O,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur côté serveur.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    

    public function calculateROIAct1(Request $request)
    {
        // Validation des données entrantes
        $validated = $request->validate([
            'A' => 'required|numeric|min:0', // Nombre de médecins recevant des échantillons
            'B' => 'required|numeric|min:0', // Nombre d’échantillons donnés à chaque médecin
            'D' => 'required|numeric|min:0|max:100', // Pourcentage des échantillons réellement donnés aux patients
            'E' => 'required|numeric|min:0.1', // Nombre moyen d’échantillons donnés par patient (éviter division par zéro)
            'G' => 'required|numeric|min:0|max:100', // Pourcentage des patients ayant reçu une prescription après usage
            'I' => 'required|numeric|min:0|max:100', // Pourcentage des patients prescrits sans échantillon
            'K' => 'required|numeric|min:0', // Valeur moyenne d’un patient incrémental
            'M' => 'required|numeric|min:0', // Coût unitaire d’un échantillon
            'N' => 'required|numeric|min:0', // Coûts fixes du programme
        ]);

        // Conversion des pourcentages
        $D = $validated['D'] / 100;
        $G = $validated['G'] / 100;
        $I = $validated['I'] / 100;

        $A = $validated['A'];
        $B = $validated['B'];
        $E = $validated['E'];
        $K = $validated['K'];
        $M = $validated['M'];
        $N = $validated['N'];

        // Calculs  
        $C = $A * $B; // Nombre total d’échantillons distribués
        $F = $C * $D / $E; // Nombre total de patients ayant reçu un échantillon
        $H = $F * $G; // Nombre total de patients obtenant une prescription
        $J = $H * (1 - $I); // Nombre total de patients incrémentaux gagnés grâce aux échantillons
        $L = $J * $K; // Revenus supplémentaires générés
        $P = $M * $C; // Coût total des échantillons distribués
        $O = $P + $N; // Coût total du programme

        // Vérifier pour éviter la division par zéro
        $ROI = ($O > 0) ? round($L / $O, 4) : 0;

        // Retourner la réponse avec les données d'entrée et les données calculées
        return response()->json([
            'nombre_medecins_recevant_echantillons' => $A,
            'nombre_echantillons_par_medecin' => $B,
            'pourcentage_echantillons_reellement_donnes' => $validated['D'],
            'nombre_moyen_echantillons_par_patient' => $E,
            'pourcentage_patients_ayant_prescription' => $validated['G'],
            'pourcentage_patients_prescrits_sans_echantillon' => $validated['I'],
            'valeur_moyenne_patient_incremental' => $K,
            'cout_unitaire_echantillon' => $M,
            'couts_fixes_programme' => $N,
            'nombre_total_echantillons_distribues' => $C,
            'nombre_total_patients_ayant_recu_un_echantillon' => $F,
            'nombre_total_patients_ayant_recu_une_prescription' => $H,
            'nombre_total_patients_incrementaux_gagnes' => $J,
            'revenus_supplémentaires' => $L,
            'cout_total_programme' => $O,
            'cout_total_echantillons' => $P,
            'ROI' => $ROI,

        ], 200);
    }

    public function updateActivity1Values(Request $request)
    {
        $validated = $request->validate([
            'A' => 'required|numeric|min:0',
            'B' => 'required|numeric|min:0',
            'D' => 'required|numeric|min:0|max:100',
            'E' => 'required|numeric|min:0.1',
            'G' => 'required|numeric|min:0|max:100',
            'I' => 'required|numeric|min:0|max:100',
            'K' => 'required|numeric|min:0',
            'M' => 'required|numeric|min:0',
            'N' => 'required|numeric|min:0',
        ]);

        $D = $validated['D'] / 100;
        $G = $validated['G'] / 100;
        $I = $validated['I'] / 100;

        $A = $validated['A'];
        $B = $validated['B'];
        $E = $validated['E'];
        $K = $validated['K'];
        $M = $validated['M'];
        $N = $validated['N'];

        $id_A = $request['id_A'];
        $id_B = $request['id_B'];
        $id_D = $request['id_D'];
        $id_E = $request['id_E'];
        $id_G = $request['id_G'];
        $id_I = $request['id_I'];
        $id_K = $request['id_K'];
        $id_M = $request['id_M'];
        $id_N = $request['id_N'];
        $id_ROI = $request['id_ROI'];

        $activityByLaboId = $request['ActivityByLaboId'];

        $C = $A * $B;
        $F = ($C * $D) / $E;
        $H = $F * $G;
        $J = $H * (1 - $I);
        $L = $J * $K;
        $P = $M * $C;
        $O = $P + $N;
        $ROI = ($O > 0) ? round($L / $O, 4) : 0;


        $values = [
            ['activityItemId' => $id_A, 'value' => $A],
            ['activityItemId' => $id_B, 'value' => $B],
            ['activityItemId' => $id_D, 'value' => $D],
            ['activityItemId' => $id_E, 'value' => $E],
            ['activityItemId' => $id_G, 'value' => $G],
            ['activityItemId' => $id_I, 'value' => $I],
            ['activityItemId' => $id_K, 'value' => $K],
            ['activityItemId' => $id_M, 'value' => $M],
            ['activityItemId' => $id_N, 'value' => $N],

            ['activityItemId' => $id_ROI, 'value' => $ROI],
        ];
        $verify = ActivityByLabo::where('id', $activityByLaboId)->value('ActivityId');
        if (!($verify === 1)) {
            return response()->json([
                'message' => 'value/activity not match',
                'id' => $verify
            ], 409);
        }
        try {
            foreach ($values as $value) {
                ActivityItemValue::where([
                    ['activityItemId', $value['activityItemId']],
                    ['ActivityByLaboId', $activityByLaboId]
                ])->update(['value' => $value['value']]);
            }

            return response()->json([
                'message' => 'Values updated successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                "message" => 'Failed to update',
                "error" => $e->getMessage()
            ], 500);
        }
    }

    public function calculateROIAct_1(Request $request)
    {
        // $activityByLaboId = $request['activityId'];
        $activityByLaboId = $request->cookie('activityId');
        $values = ActivityItemValue::where("ActivityByLaboId", $activityByLaboId)->select("value")->get();

        $A = $values[0]->value;  // 1st value
        $B = $values[1]->value;  // 2nd value
        $D = $values[2]->value;  // 3rd value
        $E = $values[3]->value;  // 4th value
        $G = $values[4]->value;  // 5th value
        $I = $values[5]->value;  // 6th value
        $K = $values[6]->value;  // 7th value
        $M = $values[7]->value;  // 8th value
        $N = $values[8]->value;  // 9th value

        // Calculs  
        $C = $A * $B; // Nombre total d’échantillons distribués
        $F = ($C * $D) / $E; // Nombre total de patients ayant reçu un échantillon
        $H = $F * $G; // Nombre total de patients obtenant une prescription
        $J = $H * (1 - $I); // Nombre total de patients incrémentaux gagnés grâce aux échantillons
        $L = $J * $K; // Revenus supplémentaires générés
        $P = $M * $C; // Coût total des échantillons distribués
        $O = $P + $N; // Coût total du programme

        // Vérifier pour éviter la division par zéro
        $ROI = ($O > 0) ? round($L / $O, 4) : 0;

        // Retourner la réponse avec les données d'entrée et les données calculées
        return response()->json([
            'nombre_medecins_recevant_echantillons' => $A,
            'nombre_echantillons_par_medecin' => $B,
            'pourcentage_echantillons_reellement_donnes' => $D,
            'nombre_moyen_echantillons_par_patient' => $E,
            'pourcentage_patients_ayant_prescription' => $G,
            'pourcentage_patients_prescrits_sans_echantillon' => $I,
            'valeur_moyenne_patient_incremental' => $K,
            'cout_unitaire_echantillon' => $M,
            'couts_fixes_programme' => $N,
            'nombre_total_echantillons_distribues' => $C,
            'nombre_total_patients_ayant_recu_un_echantillon' => $F,
            'nombre_total_patients_ayant_recu_une_prescription' => $H,
            'nombre_total_patients_incrementaux_gagnes' => $J,
            'revenus_supplémentaires' => $L,
            'cout_total_programme' => $O,
            'cout_total_echantillons' => $P,
            'ROI' => $ROI,
            // "was" =>$values

        ], 200);
    }



    //Activite 2 
    public function insertIntoTable2(Request $request)
    {
        try {
            $laboId = JWTHelper::getLaboId($request);
            if (!$laboId) {
                return response()->json(['message' => 'Token invalide'], 401);
            }

            $validated = $request->validate([
                'year' => 'required|integer',
                'activityId' => 'required|integer',

                'A' => 'required|numeric|min:0',
                'B' => 'required|numeric|min:0',
                'D' => 'required|numeric|min:0|max:100',
                'F' => 'required|numeric|min:0',
                'H' => 'required|numeric|min:0',
                'J' => 'required|numeric|min:0',
                'K' => 'required|numeric|min:0',

                'id_A' => 'required|integer',
                'id_B' => 'required|integer',
                'id_D' => 'required|integer',
                'id_F' => 'required|integer',
                'id_H' => 'required|integer',
                'id_J' => 'required|integer',
                'id_K' => 'required|integer',
                'id_ROI' => 'required|integer',
            ]);

            // 🔁 Récupérer ou créer ActivityByLabo
            $activityByLabo = ActivityByLabo::Create([
                'ActivityId' => $validated['activityId'],
                'laboId' => $laboId,
                'year' => $validated['year'],
            ]);

     

            // Calculs
            $D = $validated['D'] / 100;
            $A = $validated['A'];
            $B = $validated['B'];
            $F = $validated['F'];
            $H = $validated['H'];
            $J = $validated['J'];
            $K = $validated['K'];

            $C = $A * $B;
            $E = $C * $D;
            $G = $A * ($E + $F);
            $I = $G * $H;
            $L = ($J * $A) + $K;
            $ROI = ($L > 0) ? round($I / $L, 4) : 0;

            // Insertion des valeurs
            $values = [
                ['activityItemId' => $validated['id_A'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $A],
                ['activityItemId' => $validated['id_B'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $B],
                ['activityItemId' => $validated['id_D'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $D],
                ['activityItemId' => $validated['id_F'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $F],
                ['activityItemId' => $validated['id_H'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $H],
                ['activityItemId' => $validated['id_J'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $J],
                ['activityItemId' => $validated['id_K'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $K],
                ['activityItemId' => $validated['id_ROI'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $ROI],
            ];

            ActivityItemValue::insert($values);

            //$activityByLabo->update(['is_calculated' => true]);

            return response()->json([
                'message' => 'Activité 2 calculée et enregistrée avec succès.',
                'ROI' => $ROI,
                'I' => $I,
                'L' => $L,
                'G' => $G,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de l\'insertion.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function calculateROIAct2(Request $request)
    {
        // Validation des données entrantes
        $validated = $request->validate([
            'A' => 'required|numeric|min:0', // Nombre de médecins participant à l'étude
            'B' => 'required|numeric|min:0', // Nombre moyen de patients inscrits par médecin
            'D' => 'required|numeric|min:0|max:100', // Pourcentage moyen de patients qui continuent le traitement
            'F' => 'required|numeric|min:0', // Nombre de nouveaux patients traités par médecin grâce à l'étude
            'H' => 'required|numeric|min:0', // Valeur du revenu par patient incrémental
            'J' => 'required|numeric|min:0', // Coût variable par médecin
            'K' => 'required|numeric|min:0', // Coût fixe total de l’étude
        ]);

        // Conversion du pourcentage
        $D = $validated['D'] / 100;

        // Variables
        $A = $validated['A'];
        $B = $validated['B'];
        $F = $validated['F'];
        $H = $validated['H'];
        $J = $validated['J'];
        $K = $validated['K'];

        // Calculs
        $C = $A * $B; // Nombre total de patients inscrits
        $E = $C * $D; // Nombre de patients poursuivant le traitement après l'étude
        $G = $A * ($E + $F); // Patients incrémentaux obtenus grâce à l’étude
        $I = $G * $H; // Ventes incrémentales
        $L = ($J * $A) + $K; // Coût total du programme

        // Vérification pour éviter la division par zéro
        $ROI = ($L > 0) ? round($I / $L, 4) : 0;

        // Retourner la réponse avec les données d'entrée et les résultats calculés
        return response()->json([
            'nombre_medecins_participant_etude' => $A,
            'nombre_moyen_patients_inscrits_par_medecin' => $B,
            'pourcentage_patients_continuant_traitement' => $validated['D'],
            'nombre_nouveaux_patients_traite_par_medecin' => $F,
            'revenu_par_patient_incremental' => $H,
            'cout_variable_par_medecin' => $J,
            'cout_fixe_total_etude' => $K,
            'nombre_total_patients_inscrits' => $C,
            'nombre_patients_poursuivant_traitement' => $E,
            'nombre_patients_incrementaux_obtenus' => $G,
            'ventes_incrementales' => $I,
            'cout_total_programme' => $L,
            'ROI' => $ROI,
        ], 200);
    }

    public function updateActivity2Values(Request $request)
    {
        $validated = $request->validate([
            'A' => 'required|numeric|min:0',
            'B' => 'required|numeric|min:0',
            'D' => 'required|numeric|min:0|max:100',
            'F' => 'required|numeric|min:0',
            'H' => 'required|numeric|min:0',
            'J' => 'required|numeric|min:0',
            'K' => 'required|numeric|min:0',
        ]);

        // Conversion des pourcentages
        $D = $validated['D'] / 100;

        $A = $validated['A'];
        $B = $validated['B'];
        $F = $validated['F'];
        $H = $validated['H'];
        $J = $validated['J'];
        $K = $validated['K'];

        // Calculs
        $C = $A * $B; // Nombre total de patients inscrits
        $E = $B * $D; // Nombre de patients poursuivant le traitement après l'étude
        $G = $A * ($E + $F); // Patients incrémentaux obtenus grâce à l’étude
        $I = $G * $H; // Ventes incrémentales
        $L = ($J * $A) + $K; // Coût total du programme
        $ROI = ($L > 0) ? round($I / $L, 4) : 0; // Retour sur investissement (ROI)

        $values = [
            ['activityItemId' => $request['id_A'], 'value' => $A],
            ['activityItemId' => $request['id_B'], 'value' => $B],
            ['activityItemId' => $request['id_D'], 'value' => $D],
            ['activityItemId' => $request['id_F'], 'value' => $F],
            ['activityItemId' => $request['id_H'], 'value' => $H],
            ['activityItemId' => $request['id_J'], 'value' => $J],
            ['activityItemId' => $request['id_K'], 'value' => $K],
            ['activityItemId' => $request['id_ROI'], 'value' => $ROI],
        ];
        $activityByLaboId = $request['ActivityByLaboId'];
        $verify = ActivityByLabo::where('id', $activityByLaboId)->value('ActivityId');
        if (!($verify === 2)) {
            return response()->json([
                'message' => 'value/activity not match',
                'id' => $verify
            ], 409);
        }

        try {
            foreach ($values as $value) {
                ActivityItemValue::where([
                    ['activityItemId', $value['activityItemId']],
                    ['ActivityByLaboId', $activityByLaboId]
                ])->update(['value' => $value['value']]);
            }

            return response()->json([
                'message' => 'Values updated successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                "message" => 'Failed to update',
                "error" => $e->getMessage()
            ], 500);
        }
    }

    public function calculateROIAct_2(Request $request)
    {
        $activityByLaboId = $request->cookie('activityId');
        $values = ActivityItemValue::where("ActivityByLaboId", $activityByLaboId)->select("value")->get();
        $A = $values[0]->value;  // 1st value
        $B = $values[1]->value;  // 2nd value
        $D = $values[2]->value;  // 3rd value
        $F = $values[3]->value;  // 4th value
        $H = $values[4]->value;  // 5th value
        $J = $values[5]->value;  // 6th value
        $K = $values[6]->value;  // 7th value


        $C = $A * $B;       // Nombre total de patients inscrits
        $E = $C * $D;       // Nombre de patients poursuivant le traitement après l'étude
        $G = $A * ($E + $F); // Patients incrémentaux obtenus grâce à l’étude
        $I = $G * $H;       // Ventes incrémentales
        $L = ($J * $A) + $K; // Coût total du programme
        $ROI = ($L > 0) ? round($I / $L, 4) : 0;

        return response()->json([
            " Nombre de médecins participant à l'étude" => $A,
            "Nombre moyen de patients inscrits par médecin" => $B,
            "Nombre total de patients inscrits" => $C,
            "Pourcentage moyen de patients qui continuent le traitement" => $D,
            "Nombre de patients poursuivant le traitement après l'étude" => $E,
            "Nombre de nouveaux patients traités par médecin grâce à l'étude" => $F,
            "Patients incrémentaux obtenus grâce à l’étude" => $G,
            "Valeur du revenu par patient incrémental" => $H,
            "Ventes incrémentales" => $I,
            "Coût variable par médecin" => $J,
            "Coût fixe total de l’étude" => $K,
            "Coût total du programme" => $L,
            "Retour sur investissement (ROI)" => $ROI
        ], 200);
    }



    //Activite 3 
    public function insertIntoTable3(Request $request)
    {
        try {
            $laboId = JWTHelper::getLaboId($request);
            if (!$laboId) {
                return response()->json(['message' => 'Token invalide'], 401);
            }

            $validated = $request->validate([
                'year' => 'required|integer',
                'activityId' => 'required|integer',

                'A' => 'required|numeric|min:0',
                'B' => 'required|numeric|min:0',
                'C' => 'required|numeric|min:0|max:100',
                'E' => 'required|numeric|min:0|max:100',
                'G' => 'required|numeric|min:0|max:100',
                'I' => 'required|numeric|min:0',
                'K' => 'required|numeric|min:0',
                'M' => 'required|numeric|min:0',
                'N' => 'required|numeric|min:0',

                'id_A' => 'required|integer',
                'id_B' => 'required|integer',
                'id_C' => 'required|integer',
                'id_E' => 'required|integer',
                'id_G' => 'required|integer',
                'id_I' => 'required|integer',
                'id_K' => 'required|integer',
                'id_M' => 'required|integer',
                'id_N' => 'required|integer',
                'id_ROI' => 'required|integer',
            ]);

            // Création ou récupération d’ActivityByLabo
            $activityByLabo = ActivityByLabo::Create([
                'ActivityId' => $validated['activityId'],
                'laboId' => $laboId,
                'year' => $validated['year'],
            ]);

            // Conversion des pourcentages
            $C = $validated['C'] / 100;
            $E = $validated['E'] / 100;
            $G = $validated['G'] / 100;

            $A = $validated['A'];
            $B = $validated['B'];
            $I = $validated['I'];
            $K = $validated['K'];
            $M = $validated['M'];
            $N = $validated['N'];

            // Calculs
            $D = $A * $C;
            $F = $D * $E;
            $H = $F * $G;
            $J = $H * $I;
            $L = $J * $K;
            $O = ($M * $A * $B) + $N;
            $ROI = ($O > 0) ? round($L / $O, 4) : 0;

            $values = [
                ['activityItemId' => $validated['id_A'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $A],
                ['activityItemId' => $validated['id_B'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $B],
                ['activityItemId' => $validated['id_C'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $C],
                ['activityItemId' => $validated['id_E'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $E],
                ['activityItemId' => $validated['id_G'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $G],
                ['activityItemId' => $validated['id_I'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $I],
                ['activityItemId' => $validated['id_K'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $K],
                ['activityItemId' => $validated['id_M'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $M],
                ['activityItemId' => $validated['id_N'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $N],
                ['activityItemId' => $validated['id_ROI'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $ROI],
            ];

            ActivityItemValue::insert($values);
            //$activityByLabo->update(['is_calculated' => true]);

            return response()->json([
                'message' => 'Activité créée et calculée avec succès.',
                'ROI' => $ROI,
                'L' => $L,
                'O' => $O,
                'J' => $J,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                "message" => 'Erreur côté serveur.',
                "error" => $e->getMessage()
            ], 500);
        }
    }

    public function calculateROIAct3(Request $request)
    {
        $validated = $request->validate([
            'A' => 'required|numeric|min:0', // Nombre total de médecins ciblés par l’email
            'B' => 'required|numeric|min:0', // Nombre moyen d’emails envoyés par médecin
            'C' => 'required|numeric|min:0|max:100', // Pourcentage de médecins se rappelant avoir reçu l’email
            'E' => 'required|numeric|min:0|max:100', // Pourcentage de médecins se rappelant de la marque et du message
            'G' => 'required|numeric|min:0|max:100', // Pourcentage de médecins prescrivant Prexige à de nouveaux patients après réception du message
            'I' => 'required|numeric|min:0', // Nombre moyen de nouveaux patients mis sous Prexige par médecin
            'K' => 'required|numeric|min:0', // Valeur du revenu par patient incrémental
            'M' => 'required|numeric|min:0', // Coût variable par email envoyé
            'N' => 'required|numeric|min:0', // Coût fixe total du programme
        ]);

        // Conversion des pourcentages
        $C = $validated['C'] / 100;
        $E = $validated['E'] / 100;
        $G = $validated['G'] / 100;

        // Variables
        $A = $validated['A'];
        $I = $validated['I'];
        $K = $validated['K'];
        $M = $validated['M'];
        $B = $validated['B'];
        $N = $validated['N'];

        // Calculs
        $D = $A * $C; // Nombre de médecins ayant reçu et rappelé l’email
        $F = $D * $E; // Nombre de médecins se rappelant du produit et du message
        $H = $F * $G; // Nombre de médecins prescrivant Prexige à la suite de l’email
        $J = $H * $I; // Nombre de patients incrémentaux générés par l’email
        $L = $J * $K; // Ventes incrémentales générées
        $O = ($M * $A * $B) + $N; // Coût total du programme
        $ROI = ($O > 0) ? round($L / $O, 4) : 0; // Retour sur investissement (ROI)

        // Retourner les données avec les mêmes clés que dans la requête, y compris les calculs
        return response()->json([
            'nombre_total_de_médecins_ciblés_par_email' => $validated['A'],
            'nombre_moyen_d_emails_envoyés_par_médecin' => $validated['B'],
            'pourcentage_de_médecins_se_rappelant_avoir_reçu_email' => $validated['C'],
            'pourcentage_de_médecins_se_rappelant_marque_message' => $validated['E'],
            'pourcentage_de_médecins_prescrivant_prexige_nouveaux_patients' => $validated['G'],
            'nombre_moyen_de_nouveaux_patients_mis_sous_prexige_par_médecin' => $validated['I'],
            'valeur_du_revenu_par_patient_incremental' => $validated['K'],
            'cout_variable_par_email_envoye' => $validated['M'],
            'cout_fixe_total_du_programme' => $validated['N'],
            'nombre_de_médecins_ayant_reçu_et_rappelé_email' => $D,
            'nombre_de_médecins_se_rappelant_du_produit_message' => $F,
            'nombre_de_médecins_prescrivant_prexige_email' => $H,
            'nombre_de_patients_incrementaux_generes_par_email' => $J,
            'ventes_incrementales_generées' => $L,
            'cout_total_du_programme' => $O,
            'ROI' => $ROI,
        ], 201);
    }

    public function updateActivity3Values(Request $request)
    {
        $validated = $request->validate([
            'A' => 'required|numeric|min:0', // Nombre total de médecins ciblés par l’email
            'C' => 'required|numeric|min:0|max:100', // Pourcentage de médecins se rappelant avoir reçu l’email
            'E' => 'required|numeric|min:0|max:100', // Pourcentage de médecins se rappelant de la marque et du message
            'G' => 'required|numeric|min:0|max:100', // Pourcentage de médecins prescrivant Prexige à de nouveaux patients après réception du message
            'I' => 'required|numeric|min:0', // Nombre moyen de nouveaux patients mis sous Prexige par médecin
            'K' => 'required|numeric|min:0', // Valeur du revenu par patient incrémental
            'M' => 'required|numeric|min:0', // Coût variable par email envoyé
            'B' => 'required|numeric|min:0', // Nombre moyen d’emails envoyés par médecin
            'N' => 'required|numeric|min:0', // Coût fixe total du programme
        ]);

        // Conversion des pourcentages
        $C = $validated['C'] / 100;
        $E = $validated['E'] / 100;
        $G = $validated['G'] / 100;

        $A = $validated['A'];
        $I = $validated['I'];
        $K = $validated['K'];
        $M = $validated['M'];
        $B = $validated['B'];
        $N = $validated['N'];

        // Calculs
        $D = $A * $C; // Nombre de médecins ayant reçu et rappelé l’email
        $F = $D * $E; // Nombre de médecins se rappelant du produit et du message
        $H = $F * $G; // Nombre de médecins prescrivant Prexige à la suite de l’email
        $J = $H * $I; // Nombre de patients incrémentaux générés par l’email
        $L = $J * $K; // Ventes incrémentales générées
        $O = ($M * $A * $B) + $N; // Coût total du programme
        $ROI = ($O > 0) ? round($L / $O, 4) : 0; // Retour sur investissement (ROI)

        $values = [
            ['activityItemId' => $request['id_A'], 'value' => $A],
            ['activityItemId' => $request['id_C'], 'value' => $C],
            ['activityItemId' => $request['id_E'], 'value' => $E],
            ['activityItemId' => $request['id_G'], 'value' => $G],
            ['activityItemId' => $request['id_I'], 'value' => $I],
            ['activityItemId' => $request['id_K'], 'value' => $K],
            ['activityItemId' => $request['id_M'], 'value' => $M],
            ['activityItemId' => $request['id_B'], 'value' => $B],
            ['activityItemId' => $request['id_N'], 'value' => $N],
            ['activityItemId' => $request['id_ROI'], 'value' => $ROI],
        ];
        $activityByLaboId = $request['ActivityByLaboId'];
        $verify = ActivityByLabo::where('id', $activityByLaboId)->value('ActivityId');
        if (!($verify === 3)) {
            return response()->json([
                'message' => 'value/activity not match',
                'id' => $verify
            ], 409);
        }

        try {
            foreach ($values as $value) {
                ActivityItemValue::where([
                    ['activityItemId', $value['activityItemId']],
                    ['ActivityByLaboId', $activityByLaboId]
                ])->update(['value' => $value['value']]);
            }

            return response()->json([
                'message' => 'Values updated successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                "message" => 'Failed to update',
                "error" => $e->getMessage()
            ], 500);
        }
    }

    public function calculateROIAct_3(Request $request)
    {
        $activityByLaboId = $request->cookie('activityId');
        // $activityByLaboId = $request['activityId'];

        $values = ActivityItemValue::where("ActivityByLaboId", $activityByLaboId)->select("value")->get();
        $A = $values[0]->value;
        $C = $values[1]->value;
        $E = $values[2]->value;
        $G = $values[3]->value;
        $I = $values[4]->value;
        $K = $values[5]->value;
        $M = $values[6]->value;
        $B = $values[7]->value;
        $N = $values[8]->value;

        $D = $A * $C; // Nombre de médecins ayant reçu et rappelé l'email
        $F = $D * $E; // Nombre de médecins se rappelant du produit et du message
        $H = $F * $G; // Nombre de médecins prescrivant Prexige à la suite de l'email
        $J = $H * $I; // Nombre de patients incrémentaux générés par l'email
        $L = $J * $K; // Ventes incrémentales générées
        $O = ($M * $A * $B) + $N; // Coût total du programme
        $ROI = ($O > 0) ? round($L / $O, 4) : 0; // Retour sur investissement (ROI)

        // Retourner les données avec les mêmes clés que dans la requête, y compris les calculs
        return response()->json([
            'nombre_total_de_médecins_ciblés_par_email' => $A,
            'nombre_moyen_d_emails_envoyés_par_médecin' => $B,
            'pourcentage_de_médecins_se_rappelant_avoir_reçu_email' => $C,
            'nombre_de_médecins_ayant_reçu_et_rappelé_email' => $D,
            'pourcentage_de_médecins_se_rappelant_marque_message' => $E,
            'pourcentage_de_médecins_prescrivant_prexige_nouveaux_patients' => $G,
            'nombre_de_médecins_se_rappelant_du_produit_message' => $F,
            'nombre_de_médecins_prescrivant_prexige_email' => $H,
            'nombre_moyen_de_nouveaux_patients_mis_sous_prexige_par_médecin' => $I,
            'nombre_de_patients_incrementaux_generes_par_email' => $J,
            'valeur_du_revenu_par_patient_incremental' => $K,
            'ventes_incrementales_generées' => $L,
            'cout_variable_par_email_envoye' => $M,
            'cout_fixe_total_du_programme' => $N,
            'cout_total_du_programme' => $O,
            'Retour sur investissement (ROI)' => $ROI, // Modifier la clé pour correspondre aux autres fonctions
        ], 200); // Changer le code de statut à 200
    }



    //Activite 4
    public function insertIntoTable4(Request $request)
    {
        try {
            $laboId = JWTHelper::getLaboId($request);
            if (!$laboId) {
                return response()->json(['message' => 'Token invalide'], 401);
            }

            $validated = $request->validate([
                'year' => 'required|integer',
                'A' => 'required|numeric|min:1',
                'B' => 'required|numeric|min:1|max:100',
                'D' => 'required|numeric|min:1|max:100',
                'F' => 'required|numeric|min:0|max:100',
                'H' => 'required|numeric|min:1',
                'KOL' => 'required|numeric|min:1',
                'J' => 'required|numeric|min:1',
                'L' => 'required|numeric|min:1',
                'M' => 'required|numeric|min:1',

                // IDs des activity items
                'id_A' => 'required|integer',
                'id_B' => 'required|integer',
                'id_D' => 'required|integer',
                'id_F' => 'required|integer',
                'id_H' => 'required|integer',
                'id_KOL' => 'required|integer',
                'id_J' => 'required|integer',
                'id_L' => 'required|integer',
                'id_M' => 'required|integer',
                'id_ROI' => 'required|integer',
            ]);

            $activityNumber = 4;

            // Création ou récupération d’ActivityByLabo
            $activityByLabo = ActivityByLabo::Create([
                'ActivityId' => $activityNumber,
                'laboId' => $laboId,
                'year' => $validated['year'],
            ]);



            // Conversion des pourcentages
            $B = $validated['B'] / 100;
            $D = $validated['D'] / 100;
            $F = $validated['F'] / 100;

            // Calculs
            $A = $validated['A'];
            $H = $validated['H'];
            $KOL = $validated['KOL'];
            $J = $validated['J'];
            $L = $validated['L'];
            $M = $validated['M'];

            $C = $A * $B;
            $E = $C * $D;
            $G = $E * $F;
            $I = ($G * $H) + $KOL;
            $K = $I * $J;
            $N = ($L * $A) + $M;
            $ROI = ($N > 0) ? round($K / $N, 4) : 0;

            // Insertion des valeurs
            $values = [
                ['activityItemId' => $validated['id_A'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $A],
                ['activityItemId' => $validated['id_B'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $B],
                ['activityItemId' => $validated['id_D'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $D],
                ['activityItemId' => $validated['id_F'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $F],
                ['activityItemId' => $validated['id_H'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $H],
                ['activityItemId' => $validated['id_KOL'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $KOL],
                ['activityItemId' => $validated['id_J'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $J],
                ['activityItemId' => $validated['id_L'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $L],
                ['activityItemId' => $validated['id_M'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $M],
                ['activityItemId' => $validated['id_ROI'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $ROI],
            ];

            ActivityItemValue::insert($values);
            //$activityByLabo->update(['is_calculated' => true]);

            return response()->json([
                'message' => 'Activité 4 enregistrée et calculée avec succès.',
                'ROI' => $ROI,
                'K' => $K,
                'N' => $N,
                'I' => $I,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur serveur.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function calculateROIAct4(Request $request)
    {
        $validated = $request->validate([
            'A' => 'required|numeric|min:0', // Nombre de médecins participants à la conférence
            'B' => 'required|numeric|min:0|max:100', // Pourcentage de médecins ayant retenu le message
            'D' => 'required|numeric|min:0|max:100', // Pourcentage de médecins ayant une perception positive
            'F' => 'required|numeric|min:0|max:100', // Pourcentage de médecins qui prescrivent à de nouveaux patients
            'H' => 'required|numeric|min:0', // Nombre moyen de nouveaux patients prescrits par médecin
            'KOL' => 'required|numeric|min:0', // Ajustement lié à l’influence des leaders d’opinion
            'J' => 'required|numeric|min:0', // Valeur de revenu générée par patient incrémental
            'L' => 'required|numeric|min:0', // Coût variable par médecin
            'M' => 'required|numeric|min:0', // Coût fixe total du programme
        ]);

        $B = $validated['B'] / 100;
        $D = $validated['D'] / 100;
        $F = $validated['F'] / 100;

        $A = $validated['A'];
        $H = $validated['H'];
        $KOL = $validated['KOL'];
        $J = $validated['J'];
        $L = $validated['L'];
        $M = $validated['M'];

        $C = $A * $B; // Nombre de médecins exposés au message
        $E = $C * $D; // Nombre de médecins ayant une perception positive
        $G = $E * $F; // Nombre de médecins prescrivant à de nouveaux patients
        $I = ($G * $H) + $KOL; // Nombre de patients incrémentaux gagnés
        $K = $I * $J; // Ventes incrémentales générées
        $N = ($L * $A) + $M; // Coût total du programme

        //Vérification pour éviter division par zéro
        $ROI = ($N > 0) ? round($K / $N, 4) : 0;

        return response()->json([
            'nombre_medecins_participants_conférence' => $A,
            'pourcentage_medecins_retention_message' => $validated['B'],
            'pourcentage_medecins_perception_positive' => $validated['D'],
            'pourcentage_medecins_prescription_nouveaux_patients' => $validated['F'],
            'nombre_moyen_nouveaux_patients_prescrits_par_medecin' => $H,
            'ajustement_influence_KOL' => $KOL,
            'revenu_par_patient_incremental' => $J,
            'cout_variable_par_medecin' => $L,
            'cout_fixe_total_programme' => $M,
            'nombre_medecins_exposes_message' => $C,
            'nombre_medecins_perception_positive' => $E,
            'nombre_medecins_prescrivant_nouveaux_patients' => $G,
            'nombre_patients_incrementaux_gagnes' => $I,
            'ventes_incrementales' => $K,
            'cout_total_programme' => $N,
            'ROI' => $ROI,
        ], 200);
    }

    public function updateActivity4Values(Request $request)
    {
        try {
            $validated = $request->validate([
                'A' => 'required|numeric|min:0', // Nombre de médecins participants à la conférence
                'B' => 'required|numeric|min:0|max:100', // Pourcentage de médecins ayant retenu le message
                'D' => 'required|numeric|min:0|max:100', // Pourcentage de médecins ayant une perception positive
                'F' => 'required|numeric|min:0|max:100', // Pourcentage de médecins qui prescrivent à de nouveaux patients
                'H' => 'required|numeric|min:0', // Nombre moyen de nouveaux patients prescrits par médecin
                'KOL' => 'required|numeric|min:0', // Ajustement lié à l’influence des leaders d’opinion
                'J' => 'required|numeric|min:0', // Valeur de revenu générée par patient incrémental
                'L' => 'required|numeric|min:0', // Coût variable par médecin
                'M' => 'required|numeric|min:0', // Coût fixe total du programme
            ]);
            $B = $validated['B'] / 100;
            $D = $validated['D'] / 100;
            $F = $validated['F'] / 100;

            $A = $validated['A'];
            $H = $validated['H'];
            $KOL = $validated['KOL'];
            $J = $validated['J'];
            $L = $validated['L'];
            $M = $validated['M'];

            $C = $A * $B; // Nombre de médecins exposés au message
            $E = $C * $D; // Nombre de médecins ayant une perception positive
            $G = $E * $F; // Nombre de médecins prescrivant à de nouveaux patients
            $I = ($G * $H) + $KOL; // Nombre de patients incrémentaux gagnés
            $K = $I * $J; // Ventes incrémentales générées
            $N = ($L * $A) + $M; // Coût total du programme
            // $activityByLaboId = $request['ActivityByLaboId'];


            //Vérification pour éviter division par zéro
            $ROI = ($N > 0) ? round($K / $N, 4) : 0;
            $values = [
                ['activityItemId' => $request['id_A'], 'value' => $A],
                ['activityItemId' => $request['id_B'], 'value' => $B],
                ['activityItemId' => $request['id_D'], 'value' => $D],
                ['activityItemId' => $request['id_F'], 'value' => $F],
                ['activityItemId' => $request['id_H'], 'value' => $H],
                ['activityItemId' => $request['id_KOL'], 'value' => $KOL],
                ['activityItemId' => $request['id_J'], 'value' => $J],
                ['activityItemId' => $request['id_L'], 'value' => $L],
                ['activityItemId' => $request['id_M'], 'value' => $M],
                ['activityItemId' => $request['id_ROI'], 'value' => $ROI],
            ];
            $activityByLaboId = $request->cookie('activityId');

            $verify = ActivityByLabo::where('id', $activityByLaboId)->select('ActivityId');
            if (!($verify === 4)) {
                return response()->json([
                    'message' => 'value/activity not match',
                    'activityId' => $activityByLaboId,
                    'id' => $verify
                ], 409);
            }

            foreach ($values as $value) {
                ActivityItemValue::where([
                    ['activityItemId', $value['activityItemId']],
                    ['ActivityByLaboId', $activityByLaboId]
                ])->update(['value' => $value['value']]);
            }

            return response()->json([
                'message' => 'Values updated successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                "message" => 'Failed to update',
                "error" => $e->getMessage()
            ], 500);
        }
    }

    public function calculateROIAct_4(Request $request)
    {
        $activityByLaboId = $request->cookie('activityId');
        $values = ActivityItemValue::where("ActivityByLaboId", $activityByLaboId)->select("value")->get();

        $A = $values[0]->value;  // Nombre de médecins participants à la conférence
        $B = $values[1]->value;  // Pourcentage de médecins ayant retenu le message
        $D = $values[2]->value;  // Pourcentage de médecins ayant une perception positive
        $F = $values[3]->value;  // Pourcentage de médecins qui prescrivent à de nouveaux patients
        $H = $values[4]->value;  // Nombre moyen de nouveaux patients prescrits par médecin
        $KOL = $values[5]->value; // Ajustement lié à l'influence des leaders d'opinion
        $J = $values[6]->value;  // Valeur de revenu générée par patient incrémental
        $L = $values[7]->value;  // Coût variable par médecin
        $M = $values[8]->value;  // Coût fixe total du programme

        // Calculs
        $C = $A * $B;           // Nombre de médecins exposés au message
        $E = $C * $D;           // Nombre de médecins ayant une perception positive
        $G = $E * $F;           // Nombre de médecins prescrivant à de nouveaux patients
        $I = ($G * $H) + $KOL;  // Nombre de patients incrémentaux gagnés
        $K = $I * $J;           // Ventes incrémentales générées
        $N = ($L * $A) + $M;    // Coût total du programme
        $ROI = ($N > 0) ? round($K / $N, 4) : 0;  // Retour sur investissement (ROI)

        // Retourner la réponse avec les données d'entrée et les données calculées
        return response()->json([
            'nombre_de_médecins_participants_à_la_conférence' => $A,
            'pourcentage_de_médecins_ayant_retenu_le_message' => $B,
            'nombre_de_médecins_exposés_au_message' => $C,
            'pourcentage_de_médecins_ayant_une_perception_positive' => $D,
            'nombre_de_médecins_ayant_une_perception_positive' => $E,
            'pourcentage_de_médecins_qui_prescrivent_à_de_nouveaux_patients' => $F,
            'nombre_de_médecins_prescrivant_à_de_nouveaux_patients' => $G,
            'nombre_moyen_de_nouveaux_patients_prescrits_par_médecin' => $H,
            'nombre_de_patients_incrémentaux_gagnés' => $I,
            'valeur_de_revenu_générée_par_patient_incrémental' => $J,
            'ventes_incrémentales_générées' => $K,
            'coût_variable_par_médecin' => $L,
            'coût_fixe_total_du_programme' => $M,
            'coût_total_du_programme' => $N,
            'ajustement_lié_à_influence_des_leaders_opinion' => $KOL,
            'ROI' => $ROI,
        ], 200);
    }




    //Activite 5
    public function insertIntoTable5(Request $request)
    {
        try {
            $laboId = JWTHelper::getLaboId($request);
            if (!$laboId) {
                return response()->json(['message' => 'Token invalide'], 401);
            }

            $validated = $request->validate([
                'year' => 'required|integer',
                'A' => 'required|numeric|min:0',  // Nombre de médecins
                'B' => 'required|numeric|min:0|max:100',  // Tables rondes par médecin
                'D' => 'required|numeric|min:0',  // Médecins par table ronde
                'F' => 'required|numeric|min:0|max:100',  // % perception changée
                'H' => 'required|numeric|min:0|max:100',  // % prescrivant
                'J' => 'required|numeric|min:0',  // Patients par médecin
                'L' => 'required|numeric|min:0',  // Valeur par patient
                'N' => 'required|numeric|min:0',  // Coût variable
                'O' => 'required|numeric|min:0',  // Coût fixe

                // IDs des champs
                'id_A' => 'required|integer',
                'id_B' => 'required|integer',
                'id_D' => 'required|integer',
                'id_F' => 'required|integer',
                'id_H' => 'required|integer',
                'id_J' => 'required|integer',
                'id_L' => 'required|integer',
                'id_N' => 'required|integer',
                'id_O' => 'required|integer',
                'id_ROI' => 'required|integer',
            ]);

            $activityNumber = 5;

            // Création ou récupération de l'activité pour ce labo et cette année
            $activityByLabo = ActivityByLabo::Create([
                'ActivityId' => $activityNumber,
                'laboId' => $laboId,
                'year' => $validated['year'],
            ]);



            // Conversion des %
            $B = $validated['B'];
            $F = $validated['F'] / 100;
            $H = $validated['H'] / 100;

            // Variables
            $A = $validated['A'];
            $D = $validated['D'];
            $J = $validated['J'];
            $L = $validated['L'];
            $N = $validated['N'];
            $O = $validated['O'];

            // Calculs
            $C = $A * $B;
            $E = $C / $D;
            $G = $A * $F;
            $I = $G * $H;
            $K = $I * $J;
            $M = $K * $L;
            $P = ($N * $E) + $O;
            $Q = ($C > 0) ? $P / $C : 0;
            $ROI = ($P > 0) ? round($M / $P, 4) : 0;

            // Insertion dans la table ActivityItemValue
            $values = [
                ['activityItemId' => $validated['id_A'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $A],
                ['activityItemId' => $validated['id_B'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $B],
                ['activityItemId' => $validated['id_D'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $D],
                ['activityItemId' => $validated['id_F'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $F],
                ['activityItemId' => $validated['id_H'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $H],
                ['activityItemId' => $validated['id_J'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $J],
                ['activityItemId' => $validated['id_L'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $L],
                ['activityItemId' => $validated['id_N'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $N],
                ['activityItemId' => $validated['id_O'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $O],
                ['activityItemId' => $validated['id_ROI'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $ROI],
            ];

            ActivityItemValue::insert($values);

            //$activityByLabo->update(['is_calculated' => true]);

            return response()->json([
                'message' => 'Activité 5 enregistrée et calculée avec succès.',
                'ROI' => $ROI,
                'M' => $M,
                'P' => $P,
                'K' => $K,
                'Q' => $Q,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                "message" => "Échec de l'insertion",
                "error" => $e->getMessage(),
            ], 500);
        }
    }

    public function calculateROIAct5(Request $request)
    {
        $validated = $request->validate([
            'A' => 'required|numeric|min:0', // Nombre de médecins participant aux tables rondes
            'B' => 'required|numeric|min:0|max:100', // Nombre moyen de tables rondes assistées par médecin par an
            'D' => 'required|numeric|min:0', // Nombre moyen de médecins par table ronde
            'F' => 'required|numeric|min:0|max:100', // Pourcentage de médecins ayant changé positivement leur perception
            'H' => 'required|numeric|min:0|max:100', // Pourcentage de médecins influencés qui vont prescrire
            'J' => 'required|numeric|min:0', // Nombre moyen de nouveaux patients mis sous traitement par médecin
            'L' => 'required|numeric|min:0', // Valeur du revenu par patient incrémental
            'N' => 'required|numeric|min:0', // Coût variable par table ronde
            'O' => 'required|numeric|min:0', // Coût fixe total du programme
        ]);

        $F = $validated['F'] / 100;
        $H = $validated['H'] / 100;

        $A = $validated['A']; // Nombre de médecins
        $B = $validated['B']; // Nombre moyen de tables rondes par médecin
        $D = $validated['D']; // Nombre moyen de médecins par table ronde
        $J = $validated['J']; // Nombre moyen de nouveaux patients par médecin
        $L = $validated['L']; // Valeur du revenu par patient
        $N = $validated['N']; // Coût variable par table ronde
        $O = $validated['O']; // Coût fixe total du programme


        $C = $A * $B; //Nombre total de contacts médecins (C)
        $E = $C / $D; //Nombre total de tables rondes requises (E)
        $G = $A * $F; //Nombre de médecins ayant changé positivement leur perception (G)
        $I = $G * $H; //Nombre de médecins prescrivant (I)
        $K = $I * $J; //Nombre de patients incrémentaux gagnés (K) 
        $M = $K * $L; //Ventes incrémentales (M)
        $P = ($N * $E) + $O; //Coût total du programme (P)
        $Q = $P / $C; //Coût par contact médecin (Q)

        $ROI = ($P > 0) ? round($M / $P, 4) : 0;

        return response()->json([
            'nombre_medecins_participants_tables_rondes' => $A,
            'nombre_moyen_tables_rondes_assistees_par_medecin' => $B,
            'nombre_moyen_medecins_par_table_ronde' => $D,
            'pourcentage_medecins_ayant_change_perception' => $validated['F'],
            'pourcentage_medecins_influences_vont_prescrire' => $validated['H'],
            'nombre_moyen_nouveaux_patients_par_medecin' => $J,
            'valeur_revenu_par_patient_incremental' => $L,
            'cout_variable_par_table_ronde' => $N,
            'cout_fixe_total_programme' => $O,
            'nombre_total_contacts_medecins' => $C,
            'nombre_total_tables_rondes_requises' => $E,
            'nombre_medecins_ayant_change_perception' => $G,
            'nombre_medecins_prescrivant' => $I,
            'nombre_patients_incrementaux_gagnes' => $K,
            'ventes_incrementales' => $M,
            'cout_total_programme' => $P,
            'cout_par_contact_medecin' => $Q,
            'ROI' => $ROI,
        ], 200);
    }

    public function updateActivity5Values(Request $request)
    {
        try {
            $validated = $request->validate([
                'A' => 'required|numeric|min:0', // Nombre de médecins participant aux tables rondes
                'B' => 'required|numeric|min:0|max:100', // Nombre moyen de tables rondes assistées par médecin par an
                'D' => 'required|numeric|min:0', // Nombre moyen de médecins par table ronde
                'F' => 'required|numeric|min:0|max:100', // Pourcentage de médecins ayant changé positivement leur perception
                'H' => 'required|numeric|min:0|max:100', // Pourcentage de médecins influencés qui vont prescrire
                'J' => 'required|numeric|min:0', // Nombre moyen de nouveaux patients mis sous traitement par médecin
                'L' => 'required|numeric|min:0', // Valeur du revenu par patient incrémental
                'N' => 'required|numeric|min:0', // Coût variable par table ronde
                'O' => 'required|numeric|min:0', // Coût fixe total du programme
            ]);

            $A = $validated['A']; // Nombre de médecins
            $B = $validated['B']; // Nombre moyen de tables rondes par médecin
            $D = $validated['D']; // Nombre moyen de médecins par table ronde
            $F = $validated['F'] / 100;
            $H = $validated['H'] / 100;
            $J = $validated['J']; // Nombre moyen de nouveaux patients par médecin
            $L = $validated['L']; // Valeur du revenu par patient
            $N = $validated['N']; // Coût variable par table ronde
            $O = $validated['O']; // Coût fixe total du programme

            $C = $A * $B; // Nombre total de contacts médecins (C)
            $E = $C / $D; // Nombre total de tables rondes requises (E)
            $G = $A * $F; // Nombre de médecins ayant changé positivement leur perception (G)
            $I = $G * $H; // Nombre de médecins prescrivant (I)
            $K = $I * $J; // Nombre de patients incrémentaux gagnés (K)
            $M = $K * $L; // Ventes incrémentales (M)
            $P = ($N * $E) + $O; // Coût total du programme (P)
            $Q = $P / $C; // Coût par contact médecin (Q)

            $ROI = ($P > 0) ? round($M / $P, 4) : 0;
            $activityByLaboId = $request['ActivityByLaboId'];

            $values = [
                ['activityItemId' => $request['id_A'], 'value' => $A],
                ['activityItemId' => $request['id_B'], 'value' => $B],
                ['activityItemId' => $request['id_D'], 'value' => $D],
                ['activityItemId' => $request['id_F'], 'value' => $F],
                ['activityItemId' => $request['id_H'], 'value' => $H],
                ['activityItemId' => $request['id_J'], 'value' => $J],
                ['activityItemId' => $request['id_L'], 'value' => $L],
                ['activityItemId' => $request['id_N'], 'value' => $N],
                ['activityItemId' => $request['id_O'], 'value' => $O],
                ['activityItemId' => $request['id_ROI'], 'value' => $ROI],
            ];
            $verify = ActivityByLabo::where('id', $activityByLaboId)->value('ActivityId');
            if (!($verify === 5)) {
                return response()->json([
                    'message' => 'value/activity not match',
                    'id' => $verify
                ], 409);
            }
            foreach ($values as $value) {
                ActivityItemValue::where([
                    ['activityItemId', $value['activityItemId']],
                    ['ActivityByLaboId', $activityByLaboId]
                ])->update(['value' => $value['value']]);
            }

            return response()->json([
                'message' => 'Values updated successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update values',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function calculateROIAct_5(Request $request)
    {
        $activityByLaboId = $request->cookie('activityId');
        $values = ActivityItemValue::where("ActivityByLaboId", $activityByLaboId)->select("value")->get();
        $A = $values[0]->value;  // Nombre de médecins participant aux tables rondes
        $B = $values[1]->value;  // Nombre moyen de tables rondes assistées par médecin par an
        $D = $values[2]->value;  // Nombre moyen de médecins par table ronde
        $F = $values[3]->value;  // Pourcentage de médecins ayant changé positivement leur perception
        $H = $values[4]->value;  // Pourcentage de médecins influencés qui vont prescrire
        $J = $values[5]->value;  // Nombre moyen de nouveaux patients mis sous traitement par médecin
        $L = $values[6]->value;  // Valeur du revenu par patient incrémental
        $N = $values[7]->value;  // Coût variable par table ronde
        $O = $values[8]->value;  // Coût fixe total du programme

        $C = $A * $B;           // Nombre total de contacts médecins
        $E = $C / $D;           // Nombre total de tables rondes requises
        $G = $A * $F;           // Nombre de médecins ayant changé positivement leur perception
        $I = $G * $H;           // Nombre de médecins prescrivant
        $K = $I * $J;           // Nombre de patients incrémentaux gagnés
        $M = $K * $L;           // Ventes incrémentales
        $P = ($N * $E) + $O;    // Coût total du programme
        $Q = $P / $C;           // Coût par contact médecin

        $ROI = ($P > 0) ? round($M / $P, 4) : 0;

        return response()->json([
            'nombre_de_médecins_participant_aux_tables_rondes' => $A,
            'nombre_moyen_de_tables_rondes_par_médecin' => $B,
            'nombre_total_de_contacts_médecins' => $C,
            'nombre_moyen_de_médecins_par_table_ronde' => $D,
            'nombre_total_de_tables_rondes_requises' => $E,
            'pourcentage_de_médecins_ayant_changé_positivement_perception' => $F,
            'nombre_de_médecins_ayant_changé_positivement_perception' => $G,
            'pourcentage_de_médecins_influencés_qui_vont_prescrire' => $H,
            'nombre_de_médecins_prescrivant' => $I,
            'nombre_moyen_de_nouveaux_patients_par_médecin' => $J,
            'nombre_de_patients_incrémentaux_gagnés' => $K,
            'valeur_du_revenu_par_patient_incrémental' => $L,
            'ventes_incrémentales' => $M,
            'coût_variable_par_table_ronde' => $N,
            'coût_fixe_total_du_programme' => $O,
            'coût_total_du_programme' => $P,
            'coût_par_contact_médecin' => $Q,
            'ROI' => $ROI,
        ], 200);
    }




    //Activite 6 
    public function insertIntoTable6(Request $request)
    {
        try {
            $laboId = JWTHelper::getLaboId($request);
            if (!$laboId) {
                return response()->json(['message' => 'Token invalide'], 401);
            }

            $validated = $request->validate([
                'year' => 'required|integer',
                'A' => 'required|numeric|min:0',     // Nombre de médecins ciblés
                'B' => 'required|numeric|min:0',     // Visites par médecin
                'E' => 'required|numeric|min:0|max:100', // % de médecins se rappelant du message
                'G' => 'required|numeric|min:0|max:100', // % de médecins prescrivant après visite
                'I' => 'required|numeric|min:0',     // Nouveaux patients par médecin
                'K' => 'required|numeric|min:0',     // Revenu par patient
                'M1' => 'required|numeric|min:0',    // Coût variable par représentant
                'M2' => 'required|numeric|min:0',    // Nombre total de représentants

                // IDs des activity items
                'id_A' => 'required|integer',
                'id_B' => 'required|integer',
                'id_E' => 'required|integer',
                'id_G' => 'required|integer',
                'id_I' => 'required|integer',
                'id_K' => 'required|integer',
                'id_M1' => 'required|integer',
                'id_M2' => 'required|integer',
                'id_ROI' => 'required|integer',
            ]);

            $activityNumber = 6;
            $activityByLabo = ActivityByLabo::Create([
                'ActivityId' => $activityNumber,
                'laboId' => $laboId,
                'year' => $validated['year'],
            ]);



            $E = $validated['E'] / 100;
            $G = $validated['G'] / 100;

            // Variables
            $A = $validated['A'];
            $B = $validated['B'];
            $I = $validated['I'];
            $K = $validated['K'];
            $M1 = $validated['M1'];
            $M2 = $validated['M2'];

            $C = $A * $B;      // Total des visites
            $F = $A * $E;      // Médecins se rappelant du message
            $H = $F * $G;      // Médecins qui prescrivent
            $J = $H * $I;      // Patients incrémentaux
            $L = $J * $K;      // Ventes incrémentales
            $M = $M1 * $M2;    // Coût total
            $ROI = ($M > 0) ? round($L / $M, 4) : 0;

            $values = [
                ['activityItemId' => $validated['id_A'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $A],
                ['activityItemId' => $validated['id_B'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $B],
                ['activityItemId' => $validated['id_E'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $E],
                ['activityItemId' => $validated['id_G'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $G],
                ['activityItemId' => $validated['id_I'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $I],
                ['activityItemId' => $validated['id_K'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $K],
                ['activityItemId' => $validated['id_M1'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $M1],
                ['activityItemId' => $validated['id_M2'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $M2],
                ['activityItemId' => $validated['id_ROI'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $ROI],
            ];

            ActivityItemValue::insert($values);

            //$activityByLabo->update(['is_calculated' => true]);

            return response()->json([
                'message' => 'Activité 6 enregistrée et calculée avec succès.',
                'ROI' => $ROI,
                'L' => $L,
                'M' => $M,
                'J' => $J,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                "message" => "Erreur lors de l'enregistrement",
                "error" => $e->getMessage()
            ], 500);
        }
    }

    public function calculateROIAct6(Request $request)
    {
        $validated = $request->validate([
            'A' => 'required|numeric|min:0', // Nombre total de médecins ciblés par le représentant
            'B' => 'required|numeric|min:0', // Nombre moyen de visites par médecin
            'E' => 'required|numeric|min:0|max:100', // Pourcentage de médecins se rappelant du message
            'G' => 'required|numeric|min:0|max:100', // Pourcentage de médecins prescrivant Prexige après visite
            'I' => 'required|numeric|min:0', // Nombre moyen de nouveaux patients mis sous Prexige par médecin
            'K' => 'required|numeric|min:0', // Valeur du revenu par patient incrémental
            'M1' => 'required|numeric|min:0', // Coût variable par représentant
            'M2' => 'required|numeric|min:0', // Nombre total de représentants
        ]);

        $E = $validated['E'] / 100;
        $G = $validated['G'] / 100;

        $A = $validated['A']; // Nombre total de médecins ciblés
        $B = $validated['B']; // Nombre moyen de visites par médecin
        $I = $validated['I']; // Nombre moyen de nouveaux patients par médecin
        $K = $validated['K']; // Valeur du revenu par patient
        $M1 = $validated['M1']; // Coût variable par représentant
        $M2 = $validated['M2']; // Nombre total de représentants

        $C = $A * $B; // Nombre total de visites (détails)
        $F = $A * $E; // Nombre de médecins se rappelant du message
        $H = $F * $G; // Nombre de médecins prescrivant Prexige
        $J = $H * $I; // Nombre de patients incrémentaux
        $L = $J * $K; // Ventes incrémentales
        $M = $M1 * $M2; // Coût total du programme

        $ROI = ($M > 0) ? round($L / $M, 4) : 0; // ROI, évite la division par zéro

        return response()->json([
            'nombre_medecins_cibles_par_representant' => $A,
            'nombre_moyen_visites_par_medecin' => $B,
            'pourcentage_medecins_se_rappelant_message' => $validated['E'],
            'pourcentage_medecins_prescrivant_praxige' => $validated['G'],
            'nombre_moyen_nouveaux_patients_par_medecin' => $I,
            'valeur_revenu_par_patient_incremental' => $K,
            'cout_variable_par_representant' => $M1,
            'nombre_total_representants' => $M2,
            'nombre_total_visites' => $C,
            'nombre_medecins_se_rappelant_du_message' => $F,
            'nombre_medecins_prescrivant_praxige' => $H,
            'nombre_patients_incrementaux' => $J,
            'ventes_incrementales' => $L,
            'cout_total_programme' => $M,
            'ROI' => $ROI,
        ], 200);
    }

    public function updateActivity6Values(Request $request)
    {
        try {
            $validated = $request->validate([
                'A' => 'required|numeric|min:0', // Nombre total de médecins ciblés par le représentant
                'B' => 'required|numeric|min:0', // Nombre moyen de visites par médecin
                'E' => 'required|numeric|min:0|max:100', // Pourcentage de médecins se rappelant du message
                'G' => 'required|numeric|min:0|max:100', // Pourcentage de médecins prescrivant Prexige après visite
                'I' => 'required|numeric|min:0', // Nombre moyen de nouveaux patients mis sous Prexige par médecin
                'K' => 'required|numeric|min:0', // Valeur du revenu par patient incrémental
                'M1' => 'required|numeric|min:0', // Coût variable par représentant
                'M2' => 'required|numeric|min:0', // Nombre total de représentants
            ]);

            $E = $validated['E'] / 100;
            $G = $validated['G'] / 100;

            // Récupération des variables de la requête
            $A = $validated['A']; // Nombre total de médecins ciblés
            $B = $validated['B']; // Nombre moyen de visites par médecin
            $I = $validated['I']; // Nombre moyen de nouveaux patients par médecin
            $K = $validated['K']; // Valeur du revenu par patient
            $M1 = $validated['M1']; // Coût variable par représentant
            $M2 = $validated['M2']; // Nombre total de représentants


            $C = $A * $B; // Nombre total de visites (détails)
            $F = $A * $E; // Nombre de médecins se rappelant du message
            $H = $F * $G; // Nombre de médecins prescrivant Prexige
            $J = $H * $I; // Nombre de patients incrémentaux
            $L = $J * $K; // Ventes incrémentales
            $M = $M1 * $M2; // Coût total du programme

            // Calcul du ROI
            $ROI = ($M > 0) ? round($L / $M, 4) : 0; // ROI, évite la division par zéro
            $activityByLaboId = $request['ActivityByLaboId'];
            $values = [
                ['activityItemId' => $request['id_A'], 'value' => $A],
                ['activityItemId' => $request['id_B'], 'value' => $B],
                ['activityItemId' => $request['id_E'], 'value' => $E],
                ['activityItemId' => $request['id_G'], 'value' => $G],
                ['activityItemId' => $request['id_I'], 'value' => $I],
                ['activityItemId' => $request['id_K'], 'value' => $K],
                ['activityItemId' => $request['id_M1'], 'value' => $M1],
                ['activityItemId' => $request['id_M2'], 'value' => $M1],
                ['activityItemId' => $request['id_ROI'], 'value' => $ROI],

            ];
            $verify = ActivityByLabo::where('id', $activityByLaboId)->value('ActivityId');
            if (!($verify === 6)) {
                return response()->json([
                    'message' => 'value/activity not match',
                    'id' => $verify
                ], 409);
            }
            foreach ($values as $value) {
                ActivityItemValue::where([
                    ['activityItemId', $value['activityItemId']],
                    ['ActivityByLaboId', $activityByLaboId]
                ])->update(['value' => $value['value']]);
            }

            return response()->json([
                'message' => 'Values updated successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update values',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function calculateROIAct_6(Request $request)
    {
        $activityByLaboId = $request->cookie('activityId');
        $values = ActivityItemValue::where("ActivityByLaboId", $activityByLaboId)->select("value")->get();

        $A = $values[0]->value;  // Nombre total de médecins ciblés par le représentant
        $B = $values[1]->value;  // Nombre moyen de visites par médecin
        $E = $values[2]->value;  // Pourcentage de médecins se rappelant du message
        $G = $values[3]->value;  // Pourcentage de médecins prescrivant Prexige après visite
        $I = $values[4]->value;  // Nombre moyen de nouveaux patients mis sous Prexige par médecin
        $K = $values[5]->value;  // Valeur du revenu par patient incrémental
        $M1 = $values[6]->value; // Coût variable par représentant
        $M2 = $values[7]->value; // Nombre total de représentants

        // Calculs
        $C = $A * $B;       // Nombre total de visites (détails)
        $F = $A * $E;       // Nombre de médecins se rappelant du message
        $H = $F * $G;       // Nombre de médecins prescrivant Prexige
        $J = $H * $I;       // Nombre de patients incrémentaux
        $L = $J * $K;       // Ventes incrémentales
        $M = $M1 * $M2;     // Coût total du programme

        $ROI = ($M > 0) ? round($L / $M, 4) : 0;

        // Retourner la réponse avec les données d'entrée et les données calculées
        return response()->json([
            'nombre_total_de_médecins_ciblés' => $A,
            'nombre_moyen_de_visites_par_médecin' => $B,
            'nombre_total_de_visites' => $C,
            'pourcentage_de_médecins_se_rappelant_du_message' => $E,
            'nombre_de_médecins_se_rappelant_du_message' => $F,
            'pourcentage_de_médecins_prescrivant_prexige' => $G,
            'nombre_de_médecins_prescrivant_prexige' => $H,
            'nombre_moyen_de_nouveaux_patients_par_médecin' => $I,
            'nombre_de_patients_incrémentaux' => $J,
            'valeur_du_revenu_par_patient_incrémental' => $K,
            'ventes_incrémentales' => $L,
            'coût_variable_par_représentant' => $M1,
            'nombre_total_de_représentants' => $M2,
            'coût_total_du_programme' => $M,
            'ROI' => $ROI,
        ], 200);
    }



    //Activity 7
    public function insertIntoTable7(Request $request)
    {
        try {
            $laboId = JWTHelper::getLaboId($request);
            if (!$laboId) {
                return response()->json(['message' => 'Token invalide'], 401);
            }

            $validated = $request->validate([
                'year' => 'required|integer',
                'G' => 'required|numeric|min:0',         // Consommateurs cibles
                'H' => 'required|numeric|min:0|max:100', // % audience atteinte
                'J' => 'required|numeric|min:0|max:100', // % se rappelant la campagne
                'L' => 'required|numeric|min:0|max:100', // % ayant consulté un médecin
                'N' => 'required|numeric|min:0|max:100', // % recevant une prescription
                'P' => 'required|numeric|min:0',         // Revenu/patient
                'R1' => 'required|numeric|min:0',        // Dépenses médias
                'S' => 'required|numeric|min:0',         // Frais agence/production

                // IDs des champs
                'id_G' => 'required|integer',
                'id_H' => 'required|integer',
                'id_J' => 'required|integer',
                'id_L' => 'required|integer',
                'id_N' => 'required|integer',
                'id_P' => 'required|integer',
                'id_R1' => 'required|integer',
                'id_S' => 'required|integer',
                'id_ROI' => 'required|integer',
            ]);

            $activityNumber = 7;

            // Création ou récupération d’ActivityByLabo
            $activityByLabo = ActivityByLabo::Create([
                'ActivityId' => $activityNumber,
                'laboId' => $laboId,
                'year' => $validated['year'],
            ]);



            // Conversion des pourcentages
            $H = $validated['H'] / 100;
            $J = $validated['J'] / 100;
            $L = $validated['L'] / 100;
            $N = $validated['N'] / 100;

            // Variables
            $G = $validated['G'];
            $P = $validated['P'];
            $R1 = $validated['R1'];
            $S = $validated['S'];

            // Calculs
            $I = $G * $H;     // Consommateurs atteints
            $K = $I * $J;     // Consommateurs se rappelant
            $M = $K * $L;     // Consultations
            $O = $M * $N;     // Patients incrémentaux
            $Q = $O * $P;     // Revenus générés
            $T = $R1 + $S;    // Coûts totaux
            $ROI = ($T > 0) ? round($Q / $T, 4) : 0;

            // Insertion des valeurs
            $values = [
                ['activityItemId' => $validated['id_G'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $G],
                ['activityItemId' => $validated['id_H'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $H],
                ['activityItemId' => $validated['id_J'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $J],
                ['activityItemId' => $validated['id_L'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $L],
                ['activityItemId' => $validated['id_N'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $N],
                ['activityItemId' => $validated['id_P'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $P],
                ['activityItemId' => $validated['id_R1'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $R1],
                ['activityItemId' => $validated['id_S'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $S],
                ['activityItemId' => $validated['id_ROI'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $ROI],
            ];

            ActivityItemValue::insert($values);

            //$activityByLabo->update(['is_calculated' => true]);

            return response()->json([
                'message' => 'Activité 7 enregistrée et calculée avec succès.',
                'ROI' => $ROI,
                'Q' => $Q,
                'T' => $T,
                'O' => $O,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Erreur serveur lors de l'enregistrement",
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function calculateROIAct7(Request $request)
    {
        try {
            $validated = $request->validate([
                'G' => 'required|numeric|min:0', // Nombre de consommateurs cibles pour la campagne
                'H' => 'required|numeric|min:0|max:100', // Pourcentage d’audience cible atteinte par le plan média
                'J' => 'required|numeric|min:0|max:100', // Pourcentage de consommateurs se rappelant de la campagne
                'L' => 'required|numeric|min:0|max:100', // Pourcentage de consommateurs ayant consulté un médecin suite à l’exposition
                'N' => 'required|numeric|min:0|max:100', // Pourcentage de patients ayant consulté et recevant une prescription Prexige
                'P' => 'required|numeric|min:0', // Valeur du revenu par patient incrémental
                'R1' => 'required|numeric|min:0', // Dépenses médias (en MAD k)
                'S' => 'required|numeric|min:0', // Coûts de production, frais d’agence et autres (en MAD k)
            ]);

            // Conversion des pourcentages en valeurs décimales
            $H = $validated['H'] / 100;
            $J = $validated['J'] / 100;
            $L = $validated['L'] / 100;
            $N = $validated['N'] / 100;

            // Récupération des variables de la requête
            $G = $validated['G']; // Nombre de consommateurs cibles
            $P = $validated['P']; // Valeur du revenu par patient
            $R1 = $validated['R1']; // Dépenses médias
            $S = $validated['S']; // Coûts de production, frais d’agence

            // Calculs
            $I = $G * $H; // Nombre de consommateurs atteints par la campagne
            $K = $I * $J; // Nombre de consommateurs se rappelant de la campagne
            $M = $K * $L; // Nombre de consommateurs consultant un médecin
            $O = $M * $N; // Nombre de patients incrémentaux obtenus
            $Q = $O * $P; // Ventes incrémentales générées
            $T = $R1 + $S; // Coûts totaux du programme

            // Calcul du ROI
            $ROI = ($T > 0) ? round($Q / $T, 4) : 0; // ROI, évite la division par zéro

            return response()->json([
                'ROI' => $ROI,
                'I' => $I,
                'K' => $K,
                'M' => $M,
                'O' => $O,
                'Q' => $Q,
                'T' => $T
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                "message" => 'Failed to calculate ROI',
                "error" => $e->getMessage()
            ], 500);
        }
    }

    public function updateActivity7Values(Request $request)
    {
        try {
            $validated = $request->validate([
                'G' => 'required|numeric|min:0', // Nombre de consommateurs cibles pour la campagne
                'H' => 'required|numeric|min:0|max:100', // Pourcentage d’audience cible atteinte par le plan média
                'J' => 'required|numeric|min:0|max:100', // Pourcentage de consommateurs se rappelant de la campagne
                'L' => 'required|numeric|min:0|max:100', // Pourcentage de consommateurs ayant consulté un médecin suite à l’exposition
                'N' => 'required|numeric|min:0|max:100', // Pourcentage de patients ayant consulté et recevant une prescription Prexige
                'P' => 'required|numeric|min:0', // Valeur du revenu par patient incrémental
                'R1' => 'required|numeric|min:0', // Dépenses médias (en MAD k)
                'S' => 'required|numeric|min:0', // Coûts de production, frais d’agence et autres (en MAD k)
            ]);

            // Conversion des pourcentages en valeurs décimales
            $H = $validated['H'] / 100;
            $J = $validated['J'] / 100;
            $L = $validated['L'] / 100;
            $N = $validated['N'] / 100;

            // Récupération des variables de la requête
            $G = $validated['G']; // Nombre de consommateurs cibles
            $P = $validated['P']; // Valeur du revenu par patient
            $R1 = $validated['R1']; // Dépenses médias
            $S = $validated['S']; // Coûts de production, frais d’agence

            // Calculs
            $I = $G * $H; // Nombre de consommateurs atteints par la campagne
            $K = $I * $J; // Nombre de consommateurs se rappelant de la campagne
            $M = $K * $L; // Nombre de consommateurs consultant un médecin
            $O = $M * $N; // Nombre de patients incrémentaux obtenus
            $Q = $O * $P; // Ventes incrémentales générées
            $T = $R1 + $S; // Coûts totaux du programme

            // Calcul du ROI
            $ROI = ($T > 0) ? round($Q / $T, 4) : 0; // ROI, évite la division par zéro
            $values = [
                ['activityItemId' => $request['id_G'], 'value' => $G],
                ['activityItemId' => $request['id_H'], 'value' => $H],
                ['activityItemId' => $request['id_J'], 'value' => $J],
                ['activityItemId' => $request['id_L'], 'value' => $L],
                ['activityItemId' => $request['id_N'], 'value' => $N],
                ['activityItemId' => $request['id_P'], 'value' => $P],
                ['activityItemId' => $request['id_R1'], 'value' => $R1],
                ['activityItemId' => $request['id_ROI'], 'value' => $ROI],
                ['activityItemId' => $request['id_S'], 'value' => $S],
            ];
            $activityByLaboId = $request['ActivityByLaboId'];
            $verify = ActivityByLabo::where('id', $activityByLaboId)->value('ActivityId');
            if (!($verify === 7)) {
                return response()->json([
                    'message' => 'value/activity not match',
                    'id' => $verify
                ], 409);
            }
            foreach ($values as $value) {
                ActivityItemValue::where([
                    ['activityItemId', $value['activityItemId']],
                    ['ActivityByLaboId', $activityByLaboId]
                ])->update(['value' => $value['value']]);
            }

            return response()->json([
                'message' => 'Values updated successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update values',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function calculateROIAct_7(Request $request)
    {
        $activityByLaboId = $request->cookie('activityId');
        $values = ActivityItemValue::where("ActivityByLaboId", $activityByLaboId)->select("value")->get();

        $G = $values[0]->value;  // Nombre de consommateurs cibles pour la campagne
        $H = $values[1]->value;  // Pourcentage d'audience cible atteinte par le plan média
        $J = $values[2]->value;  // Pourcentage de consommateurs se rappelant de la campagne
        $L = $values[3]->value;  // Pourcentage de consommateurs ayant consulté un médecin suite à l'exposition
        $N = $values[4]->value;  // Pourcentage de patients ayant consulté et recevant une prescription
        $P = $values[5]->value;  // Valeur du revenu par patient incrémental
        $R1 = $values[6]->value; // Dépenses médias (en MAD k)
        $S = $values[7]->value;  // Coûts de production, frais d'agence et autres (en MAD k)

        $I = $G * $H;            // Nombre de consommateurs atteints par la campagne
        $K = $I * $J;            // Nombre de consommateurs se rappelant de la campagne
        $M = $K * $L;            // Nombre de consommateurs consultant un médecin
        $O = $M * $N;            // Nombre de patients incrémentaux obtenus
        $Q = $O * $P;            // Ventes incrémentales générées
        $T = $R1 + $S;           // Coûts totaux du programme

        // Calcul du ROI
        $ROI = ($T > 0) ? round($Q / $T, 4) : 0; // ROI, évite la division par zéro

        // Retourner la réponse avec les données d'entrée et les données calculées
        return response()->json([
            'nombre_de_consommateurs_cibles' => $G,
            'pourcentage_audience_cible_atteinte' => $H,
            'nombre_de_consommateurs_atteints' => $I,
            'pourcentage_consommateurs_se_rappelant' => $J,
            'nombre_de_consommateurs_se_rappelant' => $K,
            'pourcentage_consommateurs_consultant_medecin' => $L,
            'nombre_de_consommateurs_consultant_medecin' => $M,
            'pourcentage_patients_recevant_prescription' => $N,
            'nombre_de_patients_incrementaux' => $O,
            'valeur_revenu_par_patient' => $P,
            'ventes_incrementales' => $Q,
            'depenses_medias' => $R1,
            'couts_production_et_agence' => $S,
            'couts_totaux_programme' => $T,
            'ROI' => $ROI,
        ], 200);
    }



    //Activite 8
    public function insertIntoTable8(Request $request)
    {
        try {
            $laboId = JWTHelper::getLaboId($request);
            if (!$laboId) {
                return response()->json(['message' => 'Token invalide'], 401);
            }

            $validated = $request->validate([
                'year' => 'required|integer',
                'A' => 'required|numeric|min:0',  // Population totale
                'B' => 'required|numeric|min:0|max:100', // Taux d’incidence
                'D' => 'required|numeric|min:0|max:100', // % déjà traités
                'F' => 'required|numeric|min:0|max:100', // % visés par campagne
                'H' => 'required|numeric|min:0', // Visites uniques
                'J' => 'required|numeric|min:0|max:100', // % intéressés
                'L' => 'required|numeric|min:0|max:100', // % consulté médecin
                'N' => 'required|numeric|min:0|max:100', // % avec prescription
                'P' => 'required|numeric|min:0', // Revenu par patient
                'R' => 'required|numeric|min:0', // Coût total de la campagne

                // IDs des champs
                'id_A' => 'required|integer',
                'id_B' => 'required|integer',
                'id_D' => 'required|integer',
                'id_F' => 'required|integer',
                'id_H' => 'required|integer',
                'id_J' => 'required|integer',
                'id_L' => 'required|integer',
                'id_N' => 'required|integer',
                'id_P' => 'required|integer',
                'id_R' => 'required|integer',
                'id_ROI' => 'required|integer',
            ]);

            $activityNumber = 8;

            $activityByLabo = ActivityByLabo::Create([
                'ActivityId' => $activityNumber,
                'laboId' => $laboId,
                'year' => $validated['year'],
            ]);



            $B = $validated['B'] / 100;
            $D = $validated['D'] / 100;
            $F = $validated['F'] / 100;
            $J = $validated['J'] / 100;
            $L = $validated['L'] / 100;
            $N = $validated['N'] / 100;

            // Variables
            $A = $validated['A'];
            $H = $validated['H'];
            $P = $validated['P'];
            $R = $validated['R'];

            // Calculs
            $C = $A * $B;
            $E = $C * (1 - $D);
            $G = $E * $F;
            $I = ($G > 0) ? $H / $G : 0;  // Taux d’efficacité (non utilisé en base, mais utile pour analyse)
            $K = $H * $J;
            $M = $K * $L;
            $O = $M * $N;
            $Q = $O * $P;
            $ROI = ($R > 0) ? round($Q / $R, 4) : 0;

            // Insertion des valeurs
            $values = [
                ['activityItemId' => $validated['id_A'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $A],
                ['activityItemId' => $validated['id_B'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $B],
                ['activityItemId' => $validated['id_D'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $D],
                ['activityItemId' => $validated['id_F'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $F],
                ['activityItemId' => $validated['id_H'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $H],
                ['activityItemId' => $validated['id_J'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $J],
                ['activityItemId' => $validated['id_L'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $L],
                ['activityItemId' => $validated['id_N'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $N],
                ['activityItemId' => $validated['id_P'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $P],
                ['activityItemId' => $validated['id_R'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $R],
                ['activityItemId' => $validated['id_ROI'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $ROI],
            ];

            ActivityItemValue::insert($values);

            //$activityByLabo->update(['is_calculated' => true]);

            return response()->json([
                'message' => 'Activité 8 enregistrée et calculée avec succès.',
                'ROI' => $ROI,
                'Q' => $Q,
                'O' => $O,
                'R' => $R,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Échec de l’insertion',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function calculateROIAct8(Request $request)
    {
        try {
            // Validation des données de la requête
            $validated = $request->validate([
                'A' => 'required|numeric|min:0',  // Population totale
                'B' => 'required|numeric|min:0|max:100', // Taux d’incidence de la maladie
                'D' => 'required|numeric|min:0|max:100', // Pourcentage des patients déjà traités et satisfaits
                'F' => 'required|numeric|min:0|max:100', // Pourcentage des patients visés par la campagne en ligne
                'H' => 'required|numeric|min:0', // Nombre total de visites uniques sur le site
                'J' => 'required|numeric|min:0|max:100', // Pourcentage des visiteurs intéressés
                'L' => 'required|numeric|min:0|max:100', // Pourcentage des visiteurs ayant consulté un médecin
                'N' => 'required|numeric|min:0|max:100', // Pourcentage des patients ayant reçu une prescription Prexige
                'P' => 'required|numeric|min:0', // Valeur du revenu généré par patient incrémental
                'R' => 'required|numeric|min:0', // Coût total de la campagne digitale
            ]);

            // Conversion des pourcentages en valeurs décimales
            $B = $validated['B'] / 100;  // Taux d’incidence de la maladie
            $D = $validated['D'] / 100;  // Pourcentage des patients déjà traités et satisfaits
            $F = $validated['F'] / 100;  // Pourcentage des patients visés par la campagne en ligne
            $J = $validated['J'] / 100;  // Pourcentage des visiteurs intéressés
            $L = $validated['L'] / 100;  // Pourcentage des visiteurs ayant consulté un médecin
            $N = $validated['N'] / 100;  // Pourcentage des patients ayant reçu une prescription Prexige

            // Récupération des variables de la requête
            $A = $validated['A'];
            $H = $validated['H']; // Population totale
            $P = $validated['P']; // Valeur du revenu par patient incrémental
            $R = $validated['R']; // Coût total de la campagne

            // Calculs intermédiaires
            $C = $A * $B;  // Nombre total de patients souffrant de la maladie
            $E = $C * (1 - $D);  // Nombre de patients non traités ou insatisfaits
            $G = $E * $F;  // Nombre de patients ciblés par la campagne digitale
            $I = $H / $G;  // Taux d’efficacité d’atteinte des patients ciblés
            $K = $H * $J;  // Nombre de visiteurs uniques intéressés et sensibilisés
            $M = $K * $L;  // Nombre de visiteurs uniques ayant consulté un médecin
            $O = $M * $N;  // Nombre de patients ayant obtenu une prescription Prexige
            $Q = $O * $P;  // Ventes incrémentales générées

            // Calcul du ROI de la campagne digitale
            $ROI = ($R > 0) ? round($Q / $R, 4) : 0;  // ROI

            return response()->json([
                'ROI' => $ROI,
                'Q' => $Q,
                'C' => $C,
                'E' => $E,
                'G' => $G,
                'I' => $I,
                'K' => $K,
                'M' => $M,
                'O' => $O,
                'message' => 'ROI calculated successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to calculate ROI',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateActivity8Values(Request $request)
    {
        try {
            // Validate the request parameters
            $validated = $request->validate([
                'A' => 'required|numeric|min:0',  // Population totale
                'B' => 'required|numeric|min:0|max:100', // Taux d’incidence de la maladie
                'D' => 'required|numeric|min:0|max:100', // Pourcentage des patients déjà traités et satisfaits
                'F' => 'required|numeric|min:0|max:100', // Pourcentage des patients visés par la campagne en ligne
                'H' => 'required|numeric|min:0', // Nombre total de visites uniques sur le site
                'J' => 'required|numeric|min:0|max:100', // Pourcentage des visiteurs intéressés
                'L' => 'required|numeric|min:0|max:100', // Pourcentage des visiteurs ayant consulté un médecin
                'N' => 'required|numeric|min:0|max:100', // Pourcentage des patients ayant reçu une prescription Prexige
                'P' => 'required|numeric|min:0', // Valeur du revenu généré par patient incrémental
                'R' => 'required|numeric|min:0', // Coût total de la campagne digitale
            ]);

            $B = $validated['B'] / 100;  // Taux d’incidence de la maladie
            $D = $validated['D'] / 100;  // Pourcentage des patients déjà traités et satisfaits
            $F = $validated['F'] / 100;  // Pourcentage des patients visés par la campagne en ligne
            $J = $validated['J'] / 100;  // Pourcentage des visiteurs intéressés
            $L = $validated['L'] / 100;  // Pourcentage des visiteurs ayant consulté un médecin
            $N = $validated['N'] / 100;  // Pourcentage des patients ayant reçu une prescription Prexige

            $A = $validated['A']; // Population totale
            $P = $validated['P']; // Valeur du revenu par patient incrémental
            $R = $validated['R'];
            $H = $validated['H']; // Coût total de la campagne

            // Intermediate Calculations
            $C = $A * $B;  // Nombre total de patients souffrant de la maladie
            $E = $C * (1 - $D);  // Nombre de patients non traités ou insatisfaits
            $G = $E * $F;  // Nombre de patients ciblés par la campagne digitale
            $I = $H / $G;  // Taux d’efficacité d’atteinte des patients ciblés
            $K = $H * $J;  // Nombre de visiteurs uniques intéressés et sensibilisés
            $M = $K * $L;  // Nombre de visiteurs uniques ayant consulté un médecin
            $O = $M * $N;  // Nombre de patients ayant obtenu une prescription Prexige
            $Q = $O * $P;  // Ventes incrémentales générées

            $ROI = ($R > 0) ? round($Q / $R, 4) : 0;  // ROI

            $values = [
                ['activityItemId' => $request['id_A'], 'value' => $A],
                ['activityItemId' => $request['id_B'], 'value' => $B],
                ['activityItemId' => $request['id_D'], 'value' => $D],
                ['activityItemId' => $request['id_F'], 'value' => $F],
                ['activityItemId' => $request['id_H'], 'value' => $H],
                ['activityItemId' => $request['id_J'], 'value' => $J],
                ['activityItemId' => $request['id_L'], 'value' => $L],
                ['activityItemId' => $request['id_N'], 'value' => $N],
                ['activityItemId' => $request['id_P'], 'value' => $P],
                ['activityItemId' => $request['id_R'], 'value' => $R],
                ['activityItemId' => $request['id_ROI'], 'value' => $ROI],
            ];

            // Retrieve the ActivityByLaboId to ensure the correct activity is being updated
            $activityByLaboId = $request['ActivityByLaboId'];
            $verify = ActivityByLabo::where('id', $activityByLaboId)->value('ActivityId');

            if (!($verify === 8)) {
                return response()->json([
                    'message' => 'value/activity not match',
                    'id' => $verify
                ], 409);
            }

            foreach ($values as $value) {
                ActivityItemValue::where([
                    ['activityItemId', $value['activityItemId']],
                    ['ActivityByLaboId', $activityByLaboId]
                ])->update(['value' => $value['value']]);
            }

            return response()->json([
                'message' => 'Values updated successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update values',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function calculateROIAct_8(Request $request)
    {
        $activityByLaboId = $request->cookie('activityId');
        $values = ActivityItemValue::where("ActivityByLaboId", $activityByLaboId)->select("value")->get();

        $A = $values[0]->value;  // Population totale
        $B = $values[1]->value;  // Taux d'incidence de la maladie
        $D = $values[2]->value;  // Pourcentage des patients déjà traités et satisfaits
        $F = $values[3]->value;  // Pourcentage des patients visés par la campagne en ligne
        $H = $values[4]->value;  // Nombre total de visites uniques sur le site
        $J = $values[5]->value;  // Pourcentage des visiteurs intéressés
        $L = $values[6]->value;  // Pourcentage des visiteurs ayant consulté un médecin
        $N = $values[7]->value;  // Pourcentage des patients ayant reçu une prescription
        $P = $values[8]->value;  // Valeur du revenu généré par patient incrémental
        $R = $values[9]->value;  // Coût total de la campagne digitale

        // Calculs
        $C = $A * $B;            // Nombre total de patients souffrant de la maladie
        $E = $C * (1 - $D);      // Nombre de patients non traités ou insatisfaits
        $G = $E * $F;            // Nombre de patients ciblés par la campagne digitale
        $I = $H / $G;            // Taux d'efficacité d'atteinte des patients ciblés
        $K = $H * $J;            // Nombre de visiteurs uniques intéressés et sensibilisés
        $M = $K * $L;            // Nombre de visiteurs uniques ayant consulté un médecin
        $O = $M * $N;            // Nombre de patients ayant obtenu une prescription
        $Q = $O * $P;            // Ventes incrémentales générées

        // Calcul du ROI
        $ROI = ($R > 0) ? round($Q / $R, 4) : 0;  // ROI, évite la division par zéro

        // Retourner la réponse avec les données d'entrée et les données calculées
        return response()->json([
            'population_totale' => $A,
            'taux_incidence_maladie' => $B,
            'nombre_patients_souffrant_maladie' => $C,
            'pourcentage_patients_traites_satisfaits' => $D,
            'nombre_patients_non_traites_insatisfaits' => $E,
            'pourcentage_patients_vises_campagne' => $F,
            'nombre_patients_cibles_campagne' => $G,
            'nombre_visites_uniques_site' => $H,
            'taux_efficacite_atteinte_patients' => $I,
            'pourcentage_visiteurs_interesses' => $J,
            'nombre_visiteurs_interesses_sensibilises' => $K,
            'pourcentage_visiteurs_consultant_medecin' => $L,
            'nombre_visiteurs_consultant_medecin' => $M,
            'pourcentage_patients_recevant_prescription' => $N,
            'nombre_patients_avec_prescription' => $O,
            'valeur_revenu_par_patient' => $P,
            'ventes_incrementales' => $Q,
            'cout_total_campagne' => $R,
            'ROI' => $ROI,
        ], 200);
    }



    //Activite 9
    public function insertIntoTable9(Request $request)
    {
        try {
            $laboId = JWTHelper::getLaboId($request);
            if (!$laboId) {
                return response()->json(['message' => 'Token invalide'], 401);
            }

            $validated = $request->validate([
                'year' => 'required|integer',
                'A' => 'required|numeric|min:0',  // Médecins lecteurs
                'B' => 'required|numeric|min:0',  // Nombre d’insertions
                'C' => 'required|numeric|min:0|max:100', // % se souvenant du message
                'E' => 'required|numeric|min:0|max:100', // % qui commencent à prescrire
                'G' => 'required|numeric|min:0',  // Nouveaux patients par médecin
                'I' => 'required|numeric|min:0',  // Revenu/patient
                'K' => 'required|numeric|min:0',  // Coût média
                'L' => 'required|numeric|min:0',  // Coût production

                // IDs
                'id_A' => 'required|integer',
                'id_B' => 'required|integer',
                'id_C' => 'required|integer',
                'id_E' => 'required|integer',
                'id_G' => 'required|integer',
                'id_I' => 'required|integer',
                'id_K' => 'required|integer',
                'id_L' => 'required|integer',
                'id_ROI' => 'required|integer',
            ]);

            $activityNumber = 9;
            $activityByLabo = ActivityByLabo::Create([
                'ActivityId' => $activityNumber,
                'laboId' => $laboId,
                'year' => $validated['year'],
            ]);


            $C = $validated['C'] / 100;
            $E = $validated['E'] / 100;

            // Variables
            $A = $validated['A'];
            $B = $validated['B'];
            $G = $validated['G'];
            $I = $validated['I'];
            $K = $validated['K'];
            $L = $validated['L'];

            // Calculs
            $D = $A * $C;
            $F = $D * $E;
            $H = $F * $G;
            $J = $H * $I;
            $M = $K + $L;
            $ROI = ($M > 0) ? round($J / $M, 4) : 0;

            // Insertion des valeurs
            $values = [
                ['activityItemId' => $validated['id_A'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $A],
                ['activityItemId' => $validated['id_B'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $B],
                ['activityItemId' => $validated['id_C'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $C],
                ['activityItemId' => $validated['id_E'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $E],
                ['activityItemId' => $validated['id_G'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $G],
                ['activityItemId' => $validated['id_I'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $I],
                ['activityItemId' => $validated['id_K'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $K],
                ['activityItemId' => $validated['id_L'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $L],
                ['activityItemId' => $validated['id_ROI'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $ROI],
            ];

            ActivityItemValue::insert($values);

            //$activityByLabo->update(['is_calculated' => true]);

            return response()->json([
                'message' => 'Activité 9 enregistrée et calculée avec succès.',
                'ROI' => $ROI,
                'J' => $J,
                'M' => $M,
                'H' => $H,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur serveur lors de l’insertion',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function calculateROIAct9(Request $request)
    {
        try {

            $validated = $request->validate([
                'A' => 'required|numeric|min:0',  // Number of doctors who read the publications
                'B' => 'required|numeric|min:0|', //Nombre d’insertions publicitaires prévues dans l’ensemble des publications ciblées
                'C' => 'required|numeric|min:0|max:100', // Percentage of doctors who remember the brand
                'E' => 'required|numeric|min:0|max:100', // Percentage of doctors prescribing after exposure
                'G' => 'required|numeric|min:0', // Average number of new patients per prescriber
                'I' => 'required|numeric|min:0', // Revenue per new patient
                'K' => 'required|numeric|min:0', // Media purchase costs
                'L' => 'required|numeric|min:0', // Campaign creation and management costs
            ]);

            $C = $validated['C'] / 100;  // Percentage of doctors who remember the brand
            $E = $validated['E'] / 100;  // Percentage of doctors prescribing after exposure

            // Retrieve the request variables
            $A = $validated['A']; // Number of doctors who read the publications
            $B = $validated['B']; // Number of insertions publicitaires prévues dans l’ensemble des publications ciblées
            $G = $validated['G']; // Average number of new patients per prescriber
            $I = $validated['I']; // Revenue per new patient
            $K = $validated['K']; // Media purchase costs
            $L = $validated['L']; // Campaign creation and management costs

            $D = $A * $C;  // Number of doctors who remember the brand and message
            $F = $D * $E;  // Number of doctors who start prescribing after the exposure
            $H = $F * $G;  // Number of incremental patients gained
            $J = $H * $I;  // Incremental sales generated
            $M = $K + $L;  // Total campaign cost

            // ROI calculation
            $ROI = ($M > 0) ? round($J / $M, 4) : 0;  // Return on investment (ROI)

            // Return the result in a response
            return response()->json([
                'D' => $D, // Number of doctors who remember the brand and message
                'F' => $F, // Number of doctors who start prescribing
                'H' => $H, // Number of incremental patients gained
                'J' => $J, // Incremental sales generated
                'M' => $M, // Total campaign cost
                'ROI' => $ROI // Return on investment (ROI)
            ], 200);
        } catch (\Exception $e) {
            // Handle any errors
            return response()->json([
                'message' => 'Failed to calculate ROI',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function calculateROIAct_9(Request $request)

    {
        $activityByLaboId = $request->cookie('activityId');
        $values = ActivityItemValue::where("ActivityByLaboId", $activityByLaboId)->select("value")->get();

        $A = $values[0]->value;  // Nombre de médecins ayant lu au moins une des publications contenant une annonce produit
        $B = $values[1]->value;  // Nombre d'insertions publicitaires prévues dans l'ensemble des publications ciblées
        $C = $values[2]->value;  // Pourcentage des médecins lecteurs capables de se souvenir de la marque et du message
        $E = $values[3]->value;  // Pourcentage des médecins ayant mémorisé la publicité qui commencent à prescrire
        $G = $values[4]->value;  // Nombre moyen de nouveaux patients mis sous traitement par chaque médecin prescripteur
        $I = $values[5]->value;  // Revenu moyen généré par chaque nouveau patient traité
        $K = $values[6]->value;  // Coûts d'achat média pour la campagne presse (MAD)
        $L = $values[7]->value;  // Coûts de production et frais d'agence associés à la campagne (MAD)

        // Calculs
        $D = $A * $C;           // Nombre de médecins ayant correctement identifié le produit et son message
        $F = $D * $E;           // Nombre de médecins ayant commencé à prescrire le produit après avoir vu la campagne
        $H = $F * $G;           // Nombre de nouveaux patients obtenus directement grâce aux prescriptions
        $J = $H * $I;           // Montant des ventes additionnelles en MAD généré par la campagne
        $M = $K + $L;           // Coût global de la campagne presse en MAD

        // Calcul du ROI
        $ROI = ($M > 0) ? round($J / $M, 4) : 0;  // Return on investment (ROI)

        // Retourner la réponse avec les données d'entrée et les données calculées
        return response()->json([
            'nombre_medecins_lecteurs' => $A,
            'nombre_insertions_publicitaires' => $B,
            'pourcentage_medecins_memoire_marque' => $C,
            'nombre_medecins_identifie_produit' => $D,
            'pourcentage_medecins_commencant_prescription' => $E,
            'nombre_medecins_prescripteurs' => $F,
            'nombre_moyen_patients_par_medecin' => $G,
            'nombre_total_nouveaux_patients' => $H,
            'revenu_moyen_par_patient' => $I,
            'ventes_additionnelles' => $J,
            'couts_achat_media' => $K,
            'couts_production_agence' => $L,
            'cout_global_campagne' => $M,
            'ROI' => $ROI,
        ], 200);
    }



    //Activite 10
    public function insertIntoTable10(Request $request)
    {
        try {
            $laboId = JWTHelper::getLaboId($request);
            if (!$laboId) {
                return response()->json(['message' => 'Token invalide'], 401);
            }

            $validated = $request->validate([
                'year' => 'required|integer',
                'A' => 'required|numeric|min:0',  // Nombre de médecins exposés
                'B' => 'required|numeric|min:0|max:100', // % se souvenant du message
                'D' => 'required|numeric|min:0|max:100', // % ayant amélioré leur perception
                'F' => 'required|numeric|min:0|max:100', // % devenus prescripteurs
                'H' => 'required|numeric|min:0',  // Nouveaux patients par prescripteur
                'J' => 'required|numeric|min:0',  // Revenu par patient
                'L' => 'required|numeric|min:0',  // Coût total de l’activité

                // IDs des champs
                'id_A' => 'required|integer',
                'id_B' => 'required|integer',
                'id_D' => 'required|integer',
                'id_F' => 'required|integer',
                'id_H' => 'required|integer',
                'id_J' => 'required|integer',
                'id_L' => 'required|integer',
                'id_ROI' => 'required|integer',
            ]);

            $activityNumber = 10;

            // Création ou récupération d’ActivityByLabo
            $activityByLabo = ActivityByLabo::Create([
                'ActivityId' => $activityNumber,
                'laboId' => $laboId,
                'year' => $validated['year'],
            ]);



            // Conversion pourcentages
            $B = $validated['B'] / 100;
            $D = $validated['D'] / 100;
            $F = $validated['F'] / 100;

            // Variables
            $A = $validated['A'];
            $H = $validated['H'];
            $J = $validated['J'];
            $L = $validated['L'];

            // Calculs
            $C = $A * $B;
            $E = $C * $D;
            $G = $E * $F;
            $I = $G * $H;
            $K = $I * $J;
            $ROI = ($L > 0) ? round($K / $L, 4) : 0;

            // Insertion des données
            $values = [
                ['activityItemId' => $validated['id_A'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $A],
                ['activityItemId' => $validated['id_B'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $B],
                ['activityItemId' => $validated['id_D'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $D],
                ['activityItemId' => $validated['id_F'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $F],
                ['activityItemId' => $validated['id_H'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $H],
                ['activityItemId' => $validated['id_J'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $J],
                ['activityItemId' => $validated['id_L'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $L],
                ['activityItemId' => $validated['id_ROI'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $ROI],
            ];

            ActivityItemValue::insert($values);

            //$activityByLabo->update(['is_calculated' => true]);

            return response()->json([
                'message' => 'Activité 10 enregistrée et calculée avec succès.',
                'ROI' => $ROI,
                'K' => $K,
                'L' => $L,
                'I' => $I,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur serveur lors de l’insertion',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function calculateROIAct10(Request $request)
    {
        try {
            $validated = $request->validate([
                'A' => 'required|numeric|min:0',  // Nombre de médecins exposés à l’activité
                'B' => 'required|numeric|min:0|max:100', // Pourcentage de médecins se souvenant du message
                'D' => 'required|numeric|min:0|max:100', // Pourcentage ayant amélioré leur perception
                'F' => 'required|numeric|min:0|max:100', // Pourcentage des prescripteurs ayant changé leur perception
                'H' => 'required|numeric|min:0', // Nombre moyen de nouveaux patients par prescripteur
                'J' => 'required|numeric|min:0', // Valeur moyenne du revenu par patient
                'L' => 'required|numeric|min:0', // Coût fixe total de l'activité
            ]);

            // Conversion des pourcentages
            $B = $validated['B'] / 100;  // Pourcentage de médecins se souvenant du message
            $D = $validated['D'] / 100;  // Pourcentage ayant amélioré leur perception
            $F = $validated['F'] / 100;  // Pourcentage des prescripteurs ayant changé leur perception

            // Variables issues de la requête
            $A = $validated['A']; // Nombre de médecins exposés
            $H = $validated['H']; // Nombre moyen de nouveaux patients par prescripteur
            $J = $validated['J']; // Valeur moyenne du revenu par patient
            $L = $validated['L']; // Coût fixe total de l'activité

            // Calculs des métriques
            $C = $A * $B;       // Nombre de médecins ayant retenu le message
            $E = $C * $D;       // Nombre de médecins ayant amélioré leur perception
            $G = $E * $F;       // Nombre de prescripteurs supplémentaires
            $I = $G * $H;       // Nombre de patients incrémentaux
            $K = $I * $J;       // Ventes incrémentales générées
            $ROI = ($L > 0) ? round($K / $L, 4) : 0; // Calcul du retour sur investissement

            // Retourner les résultats dans une réponse JSON
            return response()->json([
                'C' => $C, // Nombre de médecins ayant retenu le message
                'E' => $E, // Nombre de médecins ayant amélioré leur perception
                'G' => $G, // Nombre de prescripteurs supplémentaires
                'I' => $I, // Nombre de patients incrémentaux
                'K' => $K, // Ventes incrémentales générées
                'L' => $L, // Coût fixe total de l'activité
                'ROI' => $ROI // Retour sur investissement
            ], 200);
        } catch (\Exception $e) {
            // Gestion des erreurs
            return response()->json([
                'message' => 'Failed to calculate ROI',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateActivity10Values(Request $request)
    {
        try {
            $validated = $request->validate([
                'A' => 'required|numeric|min:0',  // Nombre de médecins exposés à l’activité
                'B' => 'required|numeric|min:0|max:100', // Pourcentage de médecins se souvenant du message
                'D' => 'required|numeric|min:0|max:100', // Pourcentage ayant amélioré leur perception
                'F' => 'required|numeric|min:0|max:100', // Pourcentage des prescripteurs ayant changé leur perception
                'H' => 'required|numeric|min:0', // Nombre moyen de nouveaux patients par prescripteur
                'J' => 'required|numeric|min:0', // Valeur moyenne du revenu par patient
                'L' => 'required|numeric|min:0', // Coût fixe total de l'activité
            ]);

            // Conversion des pourcentages
            $B = $validated['B'] / 100;  // Pourcentage de médecins se souvenant du message
            $D = $validated['D'] / 100;  // Pourcentage ayant amélioré leur perception
            $F = $validated['F'] / 100;  // Pourcentage des prescripteurs ayant changé leur perception

            // Variables issues de la requête
            $A = $validated['A']; // Nombre de médecins exposés
            $H = $validated['H']; // Nombre moyen de nouveaux patients par prescripteur
            $J = $validated['J']; // Valeur moyenne du revenu par patient
            $L = $validated['L']; // Coût fixe total de l'activité

            // Calculs des métriques
            $C = $A * $B;       // Nombre de médecins ayant retenu le message
            $E = $C * $D;       // Nombre de médecins ayant amélioré leur perception
            $G = $E * $F;       // Nombre de prescripteurs supplémentaires
            $I = $G * $H;       // Nombre de patients incrémentaux
            $K = $I * $J;       // Ventes incrémentales générées
            $ROI = ($L > 0) ? round($K / $L, 4) : 0; // Calcul du retour sur investissement

            $activityByLaboId = $request['ActivityByLaboId'];
            $verify = ActivityByLabo::where('id', $activityByLaboId)->value('ActivityId');

            $values = [
                ['activityItemId' => $request['id_A'], 'value' => $A],
                ['activityItemId' => $request['id_B'], 'value' => $B],
                ['activityItemId' => $request['id_D'], 'value' => $D],
                ['activityItemId' => $request['id_F'], 'value' => $F],
                ['activityItemId' => $request['id_H'], 'value' => $H],
                ['activityItemId' => $request['id_J'], 'value' => $J],
                ['activityItemId' => $request['id_L'], 'value' => $L],
                ['activityItemId' => $request['id_ROI'], 'value' => $ROI],
            ];

            $activityByLaboId = $request['ActivityByLaboId'];
            $verify = ActivityByLabo::where('id', $activityByLaboId)->value('ActivityId');
            if (!($verify === 10)) {
                return response()->json([
                    'message' => 'value/activity not match',
                    'id' => $verify
                ], 409);
            }

            foreach ($values as $value) {
                ActivityItemValue::where([
                    ['activityItemId', $value['activityItemId']],
                    ['ActivityByLaboId', $activityByLaboId]
                ])->update(['value' => $value['value']]);
            }

            return response()->json([
                'message' => 'Values updated successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update values',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function calculateROIAct_10(Request $request)
    {
        $activityByLaboId = $request->cookie('activityId');
        $values = ActivityItemValue::where("ActivityByLaboId", $activityByLaboId)->select("value")->get();

        $A = $values[0]->value;  // Nombre de médecins exposés à l'activité
        $B = $values[1]->value;  // Pourcentage de médecins se souvenant du message
        $D = $values[2]->value;  // Pourcentage ayant amélioré leur perception
        $F = $values[3]->value;  // Pourcentage des prescripteurs ayant changé leur perception
        $H = $values[4]->value;  // Nombre moyen de nouveaux patients par prescripteur
        $J = $values[5]->value;  // Valeur moyenne du revenu par patient
        $L = $values[6]->value;  // Coût fixe total de l'activité

        // Calculs
        $C = $A * $B;           // Nombre de médecins ayant retenu le message
        $E = $C * $D;           // Nombre de médecins ayant amélioré leur perception
        $G = $E * $F;           // Nombre de prescripteurs supplémentaires
        $I = $G * $H;           // Nombre de patients incrémentaux
        $K = $I * $J;           // Ventes incrémentales générées

        // Calcul du ROI
        $ROI = ($L > 0) ? round($K / $L, 4) : 0;  // Retour sur investissement

        // Retourner la réponse avec les données d'entrée et les données calculées
        return response()->json([
            'nombre_medecins_exposes' => $A,
            'pourcentage_medecins_souvenant_message' => $B,
            'nombre_medecins_retenu_message' => $C,
            'pourcentage_medecins_ameliore_perception' => $D,
            'nombre_medecins_ameliore_perception' => $E,
            'pourcentage_prescripteurs_change_perception' => $F,
            'nombre_prescripteurs_supplementaires' => $G,
            'nombre_moyen_patients_par_prescripteur' => $H,
            'nombre_patients_incrementaux' => $I,
            'valeur_moyenne_revenu_par_patient' => $J,
            'ventes_incrementales' => $K,
            'cout_fixe_total_activite' => $L,
            'ROI' => $ROI,
        ], 200);
    }


    //Activite 11
    public function insertIntoTable11(Request $request)
    {
        try {
            $laboId = JWTHelper::getLaboId($request);
            if (!$laboId) {
                return response()->json(['message' => 'Token invalide'], 401);
            }

            $validated = $request->validate([
                'year' => 'required|integer',
                'A' => 'required|numeric|min:0',  // Nombre de consommateurs exposés
                'B' => 'required|numeric|min:0|max:100', // % mémorisant le message
                'D' => 'required|numeric|min:0|max:100', // % ayant consulté un médecin
                'F' => 'required|numeric|min:0|max:100', // % avec prescription
                'H' => 'required|numeric|min:0',         // Revenu moyen par patient
                'J' => 'required|numeric|min:0',         // Coût total de l’activité

                // IDs des champs
                'id_A' => 'required|integer',
                'id_B' => 'required|integer',
                'id_D' => 'required|integer',
                'id_F' => 'required|integer',
                'id_H' => 'required|integer',
                'id_J' => 'required|integer',
                'id_ROI' => 'required|integer',
            ]);

            $activityNumber = 11;

            $activityByLabo = ActivityByLabo::Create([
                'ActivityId' => $activityNumber,
                'laboId' => $laboId,
                'year' => $validated['year'],
            ]);



            // Conversion pourcentages
            $B = $validated['B'] / 100;
            $D = $validated['D'] / 100;
            $F = $validated['F'] / 100;

            // Variables
            $A = $validated['A'];
            $H = $validated['H'];
            $J = $validated['J'];

            // Calculs
            $C = $A * $B;
            $E = $C * $D;
            $G = $E * $F;
            $I = $G * $H;
            $ROI = ($J > 0) ? round($I / $J, 4) : 0;

            $values = [
                ['activityItemId' => $validated['id_A'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $A],
                ['activityItemId' => $validated['id_B'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $B],
                ['activityItemId' => $validated['id_D'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $D],
                ['activityItemId' => $validated['id_F'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $F],
                ['activityItemId' => $validated['id_H'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $H],
                ['activityItemId' => $validated['id_J'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $J],
                ['activityItemId' => $validated['id_ROI'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $ROI],
            ];

            ActivityItemValue::insert($values);
            //$activityByLabo->update(['is_calculated' => true]);

            return response()->json([
                'message' => 'Activité 11 enregistrée et calculée avec succès.',
                'ROI' => $ROI,
                'I' => $I,
                'J' => $J,
                'G' => $G,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur serveur lors de l’insertion',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function calculateROIAct11(Request $request)
    {
        try {
            $validated = $request->validate([
                'A' => 'required|numeric|min:0',  // Nombre de consommateurs exposés à l’activité
                'B' => 'required|numeric|min:0|max:100', // % de consommateurs mémorisant le message
                'D' => 'required|numeric|min:0|max:100', // % de consommateurs ayant consulté après l'exposition
                'F' => 'required|numeric|min:0|max:100', // % des consultations aboutissant à une prescription
                'H' => 'required|numeric|min:0', // Revenu moyen généré par patient
                'J' => 'required|numeric|min:0', // Coût fixe total de l’activité
            ]);

            // Conversion des pourcentages
            $B = $validated['B'] / 100;
            $D = $validated['D'] / 100;
            $F = $validated['F'] / 100;

            // Variables issues de la requête
            $A = $validated['A']; // Nombre de consommateurs exposés
            $H = $validated['H']; // Revenu moyen par patient
            $J = $validated['J']; // Coût total de l’activité

            // Calculs des métriques
            $C = $A * $B;       // Nombre de consommateurs ayant mémorisé le message
            $E = $C * $D;       // Nombre de consultations générées
            $G = $E * $F;       // Nombre total de patients incrémentaux
            $I = $G * $H;       // Ventes incrémentales générées
            $ROI = ($J > 0) ? round($I / $J, 4) : 0; // Calcul du ROI

            // Retourner les résultats dans une réponse JSON
            return response()->json([
                'C' => $C, // Nombre de consommateurs ayant mémorisé le message
                'E' => $E, // Nombre de consultations générées
                'G' => $G, // Nombre total de patients incrémentaux
                'I' => $I, // Ventes incrémentales générées
                'J' => $J, // Coût total de l’activité
                'ROI' => $ROI // Retour sur investissement
            ], 200);
        } catch (\Exception $e) {
            // Gestion des erreurs
            return response()->json([
                'message' => 'Failed to calculate ROI',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateActivity11Values(Request $request)
    {
        try {
            // Validation des données
            $validated = $request->validate([
                'A' => 'required|numeric|min:0',  // Nombre de consommateurs exposés à l’activité
                'B' => 'required|numeric|min:0|max:100', // % de consommateurs mémorisant le message
                'D' => 'required|numeric|min:0|max:100', // % de consommateurs ayant consulté après l'exposition
                'F' => 'required|numeric|min:0|max:100', // % des consultations aboutissant à une prescription
                'H' => 'required|numeric|min:0', // Revenu moyen par patient
                'J' => 'required|numeric|min:0', // Coût fixe total de l’activité
            ]);

            // Conversion des pourcentages
            $B = $validated['B'] / 100;
            $D = $validated['D'] / 100;
            $F = $validated['F'] / 100;

            // Variables issues de la requête
            $A = $validated['A']; // Nombre de consommateurs exposés
            $H = $validated['H']; // Revenu moyen par patient
            $J = $validated['J']; // Coût total de l’activité

            // Calculs des métriques
            $C = $A * $B;       // Nombre de consommateurs ayant mémorisé le message
            $E = $C * $D;       // Nombre de consultations générées
            $G = $E * $F;       // Nombre total de patients incrémentaux
            $I = $G * $H;       // Ventes incrémentales générées
            $ROI = ($J > 0) ? round($I / $J, 4) : 0; // Calcul du ROI

            // Récupérer l'ID de l'activité
            $activityByLaboId = $validated['ActivityByLaboId'];

            // Vérifier si l'ID de l'activité est bien 11
            $verify = ActivityByLabo::where('id', $activityByLaboId)->value('ActivityId');
            if ($verify !== 11) {
                return response()->json([
                    'message' => 'value/activity not match',
                    'id' => $verify
                ], 409);
            }

            // Préparer les valeurs à mettre à jour
            $values = [
                ['activityItemId' => $request['id_A'], 'value' => $A],
                ['activityItemId' => $request['id_B'], 'value' => $B],
                ['activityItemId' => $request['id_D'], 'value' => $D],
                ['activityItemId' => $request['id_F'], 'value' => $F],
                ['activityItemId' => $request['id_H'], 'value' => $H],
                ['activityItemId' => $request['id_J'], 'value' => $J],
                ['activityItemId' => $request['id_ROI'], 'value' => $ROI],
            ];

            // Mise à jour des valeurs dans la base de données
            foreach ($values as $value) {
                ActivityItemValue::where([
                    ['activityItemId', $value['activityItemId']],
                    ['ActivityByLaboId', $activityByLaboId]
                ])->update(['value' => $value['value']]);
            }

            return response()->json([
                'message' => 'Values updated successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update values',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function calculateROIAct_11(Request $request)
    {
        $activityByLaboId = $request->cookie('activityId');
        $values = ActivityItemValue::where("ActivityByLaboId", $activityByLaboId)->select("value")->get();

        $A = $values[0]->value;  // Nombre de consommateurs exposés à l'activité
        $B = $values[1]->value;  // % de consommateurs mémorisant le message
        $D = $values[2]->value;  // % de consommateurs ayant consulté après l'exposition
        $F = $values[3]->value;  // % des consultations aboutissant à une prescription
        $H = $values[4]->value;  // Revenu moyen par patient
        $J = $values[5]->value;  // Coût fixe total de l'activité

        // Calculs
        $C = $A * $B;           // Nombre de consommateurs ayant mémorisé le message
        $E = $C * $D;           // Nombre de consultations générées
        $G = $E * $F;           // Nombre total de patients incrémentaux
        $I = $G * $H;           // Ventes incrémentales générées

        // Calcul du ROI
        $ROI = ($J > 0) ? round($I / $J, 4) : 0;  // Retour sur investissement

        // Retourner la réponse avec les données d'entrée et les données calculées
        return response()->json([
            'nombre_consommateurs_exposes' => $A,
            'pourcentage_consommateurs_memorisant_message' => $B,
            'nombre_consommateurs_memorisant_message' => $C,
            'pourcentage_consommateurs_consultant_apres_exposition' => $D,
            'nombre_consultations_generees' => $E,
            'pourcentage_consultations_aboutissant_prescription' => $F,
            'nombre_patients_incrementaux' => $G,
            'revenu_moyen_par_patient' => $H,
            'ventes_incrementales' => $I,
            'cout_fixe_total_activite' => $J,
            'ROI' => $ROI,
        ], 200);
    }

    //Activite 12
    public function insertIntoTable12(Request $request)
    {
        try {
            $laboId = JWTHelper::getLaboId($request);
            if (!$laboId) {
                return response()->json(['message' => 'Token invalide'], 401);
            }

            // Validation des données
            $validated = $request->validate([
                'year' => 'required|integer',
                'A' => 'required|numeric|min:0',
                'B' => 'required|numeric|min:0|max:100',
                'D' => 'required|numeric|min:0',
                'F' => 'required|numeric|min:0|max:100',
                'H' => 'required|numeric|min:0|max:100',
                'J' => 'required|numeric|min:0|max:100',
                'L' => 'required|numeric|min:0',
                'N' => 'required|numeric|min:0',
                'P' => 'required|numeric|min:0',

                'id_A' => 'required|integer',
                'id_B' => 'required|integer',
                'id_D' => 'required|integer',
                'id_F' => 'required|integer',
                'id_H' => 'required|integer',
                'id_J' => 'required|integer',
                'id_L' => 'required|integer',
                'id_N' => 'required|integer',
                'id_P' => 'required|integer',
                'id_ROI' => 'required|integer',
            ]);

            $activityNumber = 12;

            $activityByLabo = ActivityByLabo::Create([
                'ActivityId' => $activityNumber,
                'laboId' => $laboId,
                'year' => $validated['year'],
            ]);



            // Conversion des pourcentages
            $B = $validated['B'] / 100;
            $F = $validated['F'] / 100;
            $H = $validated['H'] / 100;
            $J = $validated['J'] / 100;

            // Variables
            $A = $validated['A'];
            $D = $validated['D'];
            $L = $validated['L'];
            $N = $validated['N'];
            $P = $validated['P'];

            // Calculs
            $C = $A * $B;
            $E = $C > 0 ? $D / $C : 0;
            $G = $E * $F;
            $I = $G * $H;
            $K = $I * $J;
            $M = $K * $L;
            $O = $M * $N;

            $ROI = ($P > 0) ? round($O / $P, 4) : 0;

            // Insertion
            $values = [
                ['activityItemId' => $validated['id_A'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $A],
                ['activityItemId' => $validated['id_B'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $B],
                ['activityItemId' => $validated['id_D'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $D],
                ['activityItemId' => $validated['id_F'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $F],
                ['activityItemId' => $validated['id_H'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $H],
                ['activityItemId' => $validated['id_J'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $J],
                ['activityItemId' => $validated['id_L'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $L],
                ['activityItemId' => $validated['id_N'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $N],
                ['activityItemId' => $validated['id_P'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $P],
                ['activityItemId' => $validated['id_ROI'], 'ActivityByLaboId' => $activityByLabo->id, 'value' => $ROI],
            ];

            ActivityItemValue::insert($values);
            //$activityByLabo->update(['is_calculated' => true]);

            return response()->json([
                'message' => 'Activité 12 enregistrée et calculée avec succès.',
                'ROI' => $ROI,
                'O' => $O,
                'K' => $K,
                'G' => $G,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                "message" => 'Failed to insert values',
                "error" => $e->getMessage()
            ], 500);
        }
    }

    public function calculateROIAct12(Request $request)
    {
        try {
            $validated = $request->validate([
                'A' => 'required|numeric|min:0',  // Nombre de médecins susceptibles de prescrire
                'B' => 'required|numeric|min:0|max:100', // % des médecins utilisant internet
                'D' => 'required|numeric|min:0',  // Nombre total de visites uniques
                'F' => 'required|numeric|min:0|max:100', // % des visiteurs ayant interagi
                'H' => 'required|numeric|min:0|max:100', // % des médecins ayant changé de perception
                'J' => 'required|numeric|min:0|max:100', // % des médecins susceptibles de prescrire
                'L' => 'required|numeric|min:0',  // Nombre moyen de nouveaux patients par médecin
                'N' => 'required|numeric|min:0',  // Valeur moyenne de revenu par patient
                'P' => 'required|numeric|min:0',  // Coût total du programme e-digital
            ]);

            // Conversion des pourcentages
            $B = $validated['B'] / 100;
            $F = $validated['F'] / 100;
            $H = $validated['H'] / 100;
            $J = $validated['J'] / 100;

            // Variables issues de la requête
            $A = $validated['A'];
            $D = $validated['D'];
            $L = $validated['L'];
            $N = $validated['N'];
            $P = $validated['P'];

            // Calculs des métriques
            $C = $A * $B;  // Taille de l’audience digitale potentielle
            $E = $D / $C;  // Taux d’efficacité sur les médecins cibles
            $G = $D * $F;  // Médecins ayant démontré un intérêt qualifié
            $I = $G * $H;  // Médecins ayant changé positivement leur perception
            $K = $I * $J;  // Médecins prescrivant le produit
            $M = $K * $L;  // Nombre total de patients incrémentaux
            $O = $M * $N;  // Ventes incrémentales générées
            $ROI = ($P > 0) ? round($O / $P, 4) : 0; // Calcul du ROI

            return response()->json([
                'C' => $C, // Audience digitale potentielle
                'E' => $E, // Taux d’efficacité sur les médecins cibles
                'G' => $G, // Médecins ayant démontré un intérêt
                'I' => $I, // Médecins ayant changé positivement leur perception
                'K' => $K, // Médecins prescrivant le produit
                'M' => $M, // Nombre total de patients incrémentaux
                'O' => $O, // Ventes incrémentales générées
                'P' => $P, // Coût total du programme e-digital
                'ROI' => $ROI // Retour sur investissement
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to calculate ROI',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function calculateROIAct_12(Request $request)

    {
        $activityByLaboId = $request->cookie('activityId');
        $values = ActivityItemValue::where("ActivityByLaboId", $activityByLaboId)->select("value")->get();

        // Récupération des valeurs d'entrée
        $A = $values[0]->value;
        $B = $values[1]->value;
        $D = $values[2]->value;
        $F = $values[3]->value;
        $H = $values[4]->value;
        $J = $values[5]->value;
        $L = $values[6]->value;
        $N = $values[7]->value;
        $P = $values[8]->value;

        // Calculs probables (basés sur les schémas des autres fonctions)
        $C = $A * ($B / 100);     // Probabilité de calcul basé sur le pourcentage B
        $E = $C * $D;           // Calcul intermédiaire
        $G = $E * ($F / 100);     // Calcul avec pourcentage F
        $I = $G * ($H / 100);     // Calcul avec pourcentage H
        $K = $I * ($J / 100);     // Calcul avec pourcentage J
        $M = $K * $L;           // Calcul de valeur financière potentielle
        $O = $M - $N;           // Différence (peut-être profit net)
        $Q = $P + $N;           // Somme des coûts

        // Calcul du ROI (hypothétique basé sur les patterns précédents)
        $ROI = ($Q > 0) ? round($M / $Q, 4) : 0;

        // Retourner la réponse avec les données d'entrée et les données calculées
        return response()->json([
            'Nombre de médecins susceptibles de prescrire le produit' => $A,
            'Pourcentage des médecins utilisant internet pour des informations professionnelles' => $B,
            'Nombre de médecins cibles pouvant être atteints via internet' => $C,
            'Nombre total de visites uniques sur le site' => $D,
            'Taux d’efficacité sur les médecins cibles' => $E,
            'Pourcentage de visiteurs uniques ayant interagi davantage avec le contenu du produit ou complété un programme e-detailing' => $F,
            'Nombre de médecins ayant passé suffisamment de temps sur le site pour être informés' => $G,
            'Pourcentage des médecins informés ayant changé positivement leur perception du produit' => $H,
            'Nombre de médecins ayant changé positivement leur perception' => $I,
            'Pourcentage des médecins ayant changé leur perception et qui sont susceptibles de prescrire le produit' => $J,
            'Nombre total de médecins prescrivant le produit suite à l’activité' => $K,
            'Nombre moyen de nouveaux patients par médecin ayant prescrit le produit' => $L,
            'Nombre total de patients incrémentaux gagnés via le site' => $M,
            'Valeur moyenne de revenu par patient incrémental (MAD k)' => $N,
            'valeur_O' => $O,
            'valeur_P' => $P,
            'valeur_Q' => $Q,
            'ROI' => $ROI,
        ], 200);
    }

    //Activite Costum 
    public function insertCustomActivity(Request $request)
    {
        try {
            $laboId = JWTHelper::getLaboId($request);
            if (!$laboId) {
                return response()->json(['message' => 'Token invalide'], 401);
            }

            $validated = $request->validate([
                'activityName' => 'required|string|max:255',
                'year' => 'required|string',
                'roi' => 'required|numeric|min:0',
            ]);

            // 1. Créer d'abord une activité personnalisée dans ActivitiesList
            $newActivity = ActivitiesList::create([
                'Name' => $validated['activityName'],
                'is_custom' => true
            ]);

            // Récupérer l'ID de l'activité nouvellement créée
            $activityId = $newActivity->id;

            // 2. Créer un élément ROI dans ActivityItem
            $roiItem = ActivityItem::create([
                'Name' => 'ROI',
                'ActivityId' => $activityId
            ]);

            // 3. Créer l'entrée dans ActivityByLabo
            $activityByLabo = ActivityByLabo::create([
                'ActivityId' => $activityId,
                'laboId' => $laboId,
                'year' => $validated['year'],
                // 'is_calculated' => true
            ]);

            // 4. Insérer la valeur du ROI
            ActivityItemValue::create([
                'activityItemId' => $roiItem->id,
                'ActivityByLaboId' => $activityByLabo->id,
                'value' => $validated['roi']
            ]);

            return response()->json([
                'message' => 'Activité personnalisée créée avec succès.',
                'activityId' => $activityId,
                'roiItemId' => $roiItem->id,
                'roi' => $validated['roi']
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur côté serveur.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function calculateROIAct_Costum(Request $request)
    {
        try {
            // Récupérer l'ID de l'activité depuis le cookie
            $activityByLaboId = $request->cookie('activityId');

            if (!$activityByLaboId) {
                return response()->json(['message' => 'ID d\'activité non trouvé'], 400);
            }

            // Récupérer l'activité pour vérifier s'il s'agit d'une activité personnalisée
            $activityByLabo = ActivityByLabo::find($activityByLaboId);
            if (!$activityByLabo) {
                return response()->json(['message' => 'Activité non trouvée'], 404);
            }

            // Vérifier si l'activité est une activité personnalisée
            $activity = ActivitiesList::find($activityByLabo->ActivityId);
            if (!$activity || !$activity->is_custom) {
                return response()->json(['message' => 'Cette activité n\'est pas une activité personnalisée'], 400);
            }

            // Récupérer l'élément ROI pour cette activité
            $roiItem = ActivityItem::where('ActivityId', $activity->id)
                ->where('Name', 'ROI')
                ->first();

            if (!$roiItem) {
                return response()->json(['message' => 'Élément ROI non trouvé pour cette activité'], 404);
            }

            // Récupérer la valeur du ROI
            $roiValue = ActivityItemValue::where('ActivityByLaboId', $activityByLaboId)
                ->where('activityItemId', $roiItem->id)
                ->first();

            if (!$roiValue) {
                return response()->json(['message' => 'Valeur ROI non trouvée'], 404);
            }

            // Retourner la réponse avec les données pertinentes
            return response()->json([
                'activite_nom' => $activity->Name,
                'activite_annee' => $activityByLabo->year,
                'ROI' => $roiValue->value,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors du calcul du ROI pour l\'activité personnalisée.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // public function insertCustomActivity1(Request $request)
    // {
    //     try {
    //         $laboId = JWTHelper::getLaboId($request);
    //         if (!$laboId) {
    //             return response()->json(['message' => 'Token invalide'], 401);
    //         }

    //         $validated = $request->validate([
    //             'name' => 'required|string|max:255',
    //             'year' => 'required|integer',
    //             'items' => 'required|array|min:1',
    //             'items.*.name' => 'required|string',
    //             'items.*.value' => 'required|numeric',
    //             'items.*.type' => 'required|in:number,percentage',
    //             'calculatedItems' => 'required|array|min:1',
    //             'calculatedItems.*.name' => 'required|string',
    //             'calculatedItems.*.value' => 'required|numeric',
    //         ]);

    //         $activityNameLower = strtolower($validated['name']);

    //         $existingActivity = ActivitiesList::whereRaw('LOWER(Name) = ?', [$activityNameLower])
    //             ->where('is_custom', true)
    //             ->first();

    //         if ($existingActivity) {
    //             $existingByLabo = ActivityByLabo::where('ActivityId', $existingActivity->id)
    //                 ->where('laboId', $laboId)
    //                 ->where('year', $validated['year'])
    //                 ->first();

    //             if ($existingByLabo) {
    //                 return response()->json([
    //                     'message' => 'Cette activité personnalisée existe déjà pour cette année.'
    //                 ], 409);
    //             }

    //             // On insère uniquement le lien avec une nouvelle année
    //             $activityByLabo = ActivityByLabo::create([
    //                 'ActivityId' => $existingActivity->id,
    //                 'laboId' => $laboId,
    //                 'year' => $validated['year'],
    //                 // 'is_calculated' => false
    //             ]);

    //             $baseItems = ActivityItem::where('ActivityId', $existingActivity->id)->get();

    //             $baseValues = [];
    //             foreach ($validated['items'] as $item) {
    //                 $matchingItem = $baseItems->firstWhere('Name', $item['name']);
    //                 if ($matchingItem) {
    //                     $value = ($item['type'] === 'percentage') ? $item['value'] / 100 : $item['value'];
    //                     $baseValues[] = [
    //                         'activityItemId' => $matchingItem->id,
    //                         'ActivityByLaboId' => $activityByLabo->id,
    //                         'value' => $value
    //                     ];
    //                 }
    //             }

    //             // Ajouter ROI si présent
    //             $roiItemData = null;
    //             if (isset($validated['calculatedItems']) && is_array($validated['calculatedItems'])) {
    //                 $roiItemData = collect($validated['calculatedItems'])->firstWhere('name', 'ROI');
    //             }

    //             if ($roiItemData) {
    //                 $roiItem = $baseItems->firstWhere('Name', 'ROI');
    //                 if ($roiItem) {
    //                     $baseValues[] = [
    //                         'activityItemId' => $roiItem->id,
    //                         'ActivityByLaboId' => $activityByLabo->id,
    //                         'value' => $roiItemData['value']
    //                     ];
    //                 }
    //             }

    //             ActivityItemValue::insert($baseValues);

    //             return response()->json([
    //                 'message' => 'Activité existante, mais ajoutée pour une nouvelle année.',
    //                 'activityId' => $activityByLabo->id,
    //                 'activityName' => $validated['name'],
    //                 'year' => $validated['year']
    //             ], 201);
    //         }

    //         // Sinon, créer une nouvelle activité complète
    //         $customActivity = ActivitiesList::create([
    //             'Name' => $validated['name'],
    //             'is_custom' => true,
    //             'created_by' => $laboId
    //         ]);

    //         $baseItems = [];
    //         foreach ($validated['items'] as $item) {
    //             $baseItems[] = ActivityItem::create([
    //                 'ActivityId' => $customActivity->id,
    //                 'Name' => $item['name'],
    //                 'Type' => $item['type'],
    //                 'is_custom' => true
    //             ]);
    //         }

    //         $roiItemData = null;
    //         if (isset($validated['calculatedItems']) && is_array($validated['calculatedItems'])) {
    //             $roiItemData = collect($validated['calculatedItems'])->firstWhere('name', 'ROI');
    //         }

    //         $roiItem = null;
    //         if ($roiItemData) {
    //             $roiItem = ActivityItem::create([
    //                 'ActivityId' => $customActivity->id,
    //                 'Name' => 'ROI',
    //                 'Type' => 'calculated',
    //                 'is_custom' => true,
    //                 'calculation_expression' => null
    //             ]);
    //         }

    //         $activityByLabo = ActivityByLabo::create([
    //             'ActivityId' => $customActivity->id,
    //             'laboId' => $laboId,
    //             'year' => $validated['year'],
    //             // 'is_calculated' => false
    //         ]);

    //         $baseValues = [];
    //         foreach ($validated['items'] as $index => $item) {
    //             $value = ($item['type'] === 'percentage') ? $item['value'] / 100 : $item['value'];
    //             $baseValues[] = [
    //                 'activityItemId' => $baseItems[$index]->id,
    //                 'ActivityByLaboId' => $activityByLabo->id,
    //                 'value' => $value
    //             ];
    //         }

    //         if ($roiItem && isset($roiItemData['value'])) {
    //             $baseValues[] = [
    //                 'activityItemId' => $roiItem->id,
    //                 'ActivityByLaboId' => $activityByLabo->id,
    //                 'value' => $roiItemData['value']
    //             ];
    //         }

    //         ActivityItemValue::insert($baseValues);

    //         return response()->json([
    //             'message' => 'Activité personnalisée créée avec succès',
    //             'activityId' => $activityByLabo->id,
    //             'ROI' => $roiItemData['value'] ?? null,
    //             'activityName' => $validated['name'],
    //             'year' => $validated['year']
    //         ], 201);
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'message' => 'Erreur lors de la création de l\'activité personnalisée',
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }


    public function insertCustomActivity1(Request $request)
    {
        try {
            $laboId = JWTHelper::getLaboId($request);
            if (!$laboId) {
                return response()->json(['message' => 'Token invalide'], 401);
            }

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'year' => 'required|integer',
                'items' => 'required|array|min:1',
                'items.*.name' => 'required|string',
                'items.*.value' => 'required|numeric',
                'items.*.type' => 'required|in:number,percentage',
                'calculatedItems' => 'required|array|min:1',
                'calculatedItems.*.name' => 'required|string',
                'calculatedItems.*.value' => 'required|numeric',
            ]);

            $activityNameLower = strtolower($validated['name']);

            $existingActivity = ActivitiesList::whereRaw('LOWER(Name) = ?', [$activityNameLower])
                ->where('is_custom', true)
                ->first();

            if ($existingActivity) {
                $existingByLabo = ActivityByLabo::where('ActivityId', $existingActivity->id)
                    ->where('laboId', $laboId)
                    ->where('year', $validated['year'])
                    ->first();

                if ($existingByLabo) {
                    return response()->json([
                        'message' => 'Cette activité personnalisée existe déjà pour cette année.'
                    ], 409);
                }

                // On insère uniquement le lien avec une nouvelle année
                $activityByLabo = ActivityByLabo::create([
                    'ActivityId' => $existingActivity->id,
                    'laboId' => $laboId,
                    'year' => $validated['year'],
                    // 'is_calculated' => false
                ]);

                $baseItems = ActivityItem::where('ActivityId', $existingActivity->id)->get();

                $baseValues = [];
                foreach ($validated['items'] as $item) {
                    $matchingItem = $baseItems->firstWhere('Name', $item['name']);
                    if ($matchingItem) {
                        $value = ($item['type'] === 'percentage') ? $item['value'] / 100 : $item['value'];
                        $baseValues[] = [
                            'activityItemId' => $matchingItem->id,
                            'ActivityByLaboId' => $activityByLabo->id,
                            'value' => $value
                        ];
                    }
                }

                // Ajouter ROI si présent
                $roiItemData = null;
                if (isset($validated['calculatedItems']) && is_array($validated['calculatedItems'])) {
                    $roiItemData = collect($validated['calculatedItems'])->firstWhere('name', 'ROI');
                }

                if ($roiItemData) {
                    $roiItem = $baseItems->firstWhere('Name', 'ROI');
                    if ($roiItem) {
                        $baseValues[] = [
                            'activityItemId' => $roiItem->id,
                            'ActivityByLaboId' => $activityByLabo->id,
                            'value' => $roiItemData['value']
                        ];
                    }
                }

                ActivityItemValue::insert($baseValues);

                return response()->json([
                    'message' => 'Activité existante, mais ajoutée pour une nouvelle année.',
                    'activityId' => $activityByLabo->id,
                    'activityName' => $validated['name'],
                    'year' => $validated['year']
                ], 201);
            }

            // Sinon, créer une nouvelle activité complète
            $customActivity = ActivitiesList::create([
                'Name' => $validated['name'],
                'is_custom' => true,
                'created_by' => $laboId
            ]);

            $baseItems = [];
            foreach ($validated['items'] as $item) {
                $baseItems[] = ActivityItem::create([
                    'ActivityId' => $customActivity->id,
                    'Name' => $item['name'],
                    'Type' => $item['type'],
                    'is_custom' => true
                ]);
            }

            $roiItemData = null;
            if (isset($validated['calculatedItems']) && is_array($validated['calculatedItems'])) {
                $roiItemData = collect($validated['calculatedItems'])->firstWhere('name', 'ROI');
            }

            $roiItem = null;
            if ($roiItemData) {
                $roiItem = ActivityItem::create([
                    'ActivityId' => $customActivity->id,
                    'Name' => 'ROI',
                    'Type' => 'calculated',
                    'is_custom' => true,
                    'calculation_expression' => null
                ]);
            }

            $activityByLabo = ActivityByLabo::create([
                'ActivityId' => $customActivity->id,
                'laboId' => $laboId,
                'year' => $validated['year'],

            ]);

            $baseValues = [];
            foreach ($validated['items'] as $index => $item) {
                $value = ($item['type'] === 'percentage') ? $item['value'] / 100 : $item['value'];
                $baseValues[] = [
                    'activityItemId' => $baseItems[$index]->id,
                    'ActivityByLaboId' => $activityByLabo->id,
                    'value' => $value
                ];
            }

            if ($roiItem && isset($roiItemData['value'])) {
                $baseValues[] = [
                    'activityItemId' => $roiItem->id,
                    'ActivityByLaboId' => $activityByLabo->id,
                    'value' => $roiItemData['value']
                ];
            }

            ActivityItemValue::insert($baseValues);

            return response()->json([
                'message' => 'Activité personnalisée créée avec succès',
                'activityId' => $activityByLabo->id,
                'ROI' => $roiItemData['value'] ?? null,
                'activityName' => $validated['name'],
                'year' => $validated['year']
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la création de l\'activité personnalisée',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
