<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Helpers\JwtHelper; // Adjust the namespace as needed

use App\Models\CalculationFormulat;
use App\Models\ActivityItemValue;
use App\Models\ActivityByLabo;
use App\Models\ActivitiesList;
use App\Models\ActivityItem;
use App\Models\User;
use App\Models\Labo;

class Activity1_12 extends Controller
{
    //Activite 1
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
        $activityByLaboId = $request->cookie('activityId') ?? $request['activityId'];

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
            // 'activitybylaboId'=>,
            'Nombre de médecins recevant des échantillons' => $A,
            'Nombre d’échantillons donnés à chaque médecin' => $B,
            'Pourcentage des échantillons réellement donnés aux patients' => $D,
            'Nombre moyen d’échantillons donnés par patient (éviter division par zéro)' => $E,
            'Pourcentage des patients ayant reçu une prescription après usage' => $G,
            'Pourcentage des patients prescrits sans échantillon' => $I,
            'Valeur moyenne d’un patient incrémental' => $K,
            'Coût unitaire d’un échantillon' => $M,
            'Coûts fixes du programme' => $N,
            'Nombre total d’échantillons distribués' => $C,
            'Nombre total de patients ayant reçu un échantillon' => $F,
            'Nombre total de patients obtenant une prescription' => $H,
            'Nombre total de patients incrémentaux gagnés grâce aux échantillons' => $J,
            ' Revenus supplémentaires générés' => $L,
            'Coût total du programme' => $O,
            'Coût total des échantillons distribués' => $P,
            'ROI' => $ROI,
            // "was" =>$values

        ], 200);
    }

    //Activite 2
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
            'Nombre total de médecins ciblés par email' => $A,
            'Nombre moyen d\'emails envoyés par médecin' => $B,
            'Pourcentage de médecins se rappelant avoir reçu email' => $C,
            'Nombre de médecins ayant reçu et rappelé email' => $D,
            'Pourcentage de médecins se rappelant marque message' => $E,
            'Pourcentage de médecins prescrivant Prexige nouveaux patients' => $G,
            'Nombre de médecins se rappelant du produit message' => $F,
            'Nombre de médecins prescrivant Prexige email' => $H,
            'Nombre moyen de nouveaux patients mis sous Prexige par médecin' => $I,
            'Nombre de patients incrémentaux générés par email' => $J,
            'Valeur du revenu par patient incrémental' => $K,
            'Ventes incrémentales générées' => $L,
            'Coût variable par email envoyé' => $M,
            'Coût fixe total du programme' => $N,
            'Coût total du programme' => $O,
            'Retour sur investissement (ROI)' => $ROI,
        ], 200);
    }

    //Activite 4
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
            'Nombre de médecins participants à la conférence' => $A,
            'Pourcentage de médecins ayant retenu le message' => $B,
            'Nombre de médecins exposés au message' => $C,
            'Pourcentage de médecins ayant une perception positive' => $D,
            'Nombre de médecins ayant une perception positive' => $E,
            'Pourcentage de médecins qui prescrivent à de nouveaux patients' => $F,
            'Nombre de médecins prescrivant à de nouveaux patients' => $G,
            'Nombre moyen de nouveaux patients prescrits par médecin' => $H,
            'Nombre de patients incrémentaux gagnés' => $I,
            'Valeur de revenu générée par patient incrémental' => $J,
            'Ventes incrémentales générées' => $K,
            'Coût variable par médecin' => $L,
            'Coût fixe total du programme' => $M,
            'Coût total du programme' => $N,
            'Ajustement lié à l\'influence des leaders d\'opinion' => $KOL,
            'Retour sur investissement (ROI)' => $ROI,
        ], 200);
    }



    //Activite 5
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
            'Nombre de médecins participant aux tables rondes' => $A,
            'Nombre moyen de tables rondes par médecin' => $B,
            'Nombre total de contacts médecins' => $C,
            'Nombre moyen de médecins par table ronde' => $D,
            'Nombre total de tables rondes requises' => $E,
            'Pourcentage de médecins ayant changé positivement leur perception' => $F,
            'Nombre de médecins ayant changé positivement leur perception' => $G,
            'Pourcentage de médecins influencés qui vont prescrire' => $H,
            'Nombre de médecins prescrivant' => $I,
            'Nombre moyen de nouveaux patients par médecin' => $J,
            'Nombre de patients incrémentaux gagnés' => $K,
            'Valeur du revenu par patient incrémental' => $L,
            'Ventes incrémentales' => $M,
            'Coût variable par table ronde' => $N,
            'Coût fixe total du programme' => $O,
            'Coût total du programme' => $P,
            'Coût par contact médecin' => $Q,
            'Retour sur investissement (ROI)' => $ROI,
        ], 200);
    }

    //Activite 6 
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
            'Nombre total de médecins ciblés' => $A,
            'Nombre moyen de visites par médecin' => $B,
            'Nombre total de visites' => $C,
            'Pourcentage de médecins se rappelant du message' => $E,
            'Nombre de médecins se rappelant du message' => $F,
            'Pourcentage de médecins prescrivant Prexige' => $G,
            'Nombre de médecins prescrivant Prexige' => $H,
            'Nombre moyen de nouveaux patients par médecin' => $I,
            'Nombre de patients incrémentaux' => $J,
            'Valeur du revenu par patient incrémental' => $K,
            'Ventes incrémentales' => $L,
            'Coût variable par représentant' => $M1,
            'Nombre total de représentants' => $M2,
            'Coût total du programme' => $M,
            'Retour sur investissement (ROI)' => $ROI,
        ], 200);
    }

    //Activity 7
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
            'nombre de consommateurs cibles' => $G,
            'pourcentage audience cible atteinte' => $H,
            'nombre de consommateurs atteints' => $I,
            'pourcentage consommateurs se rappelant' => $J,
            'nombre de consommateurs se rappelant' => $K,
            'pourcentage consommateurs consultant medecin' => $L,
            'nombre de consommateurs consultant medecin' => $M,
            'pourcentage patients recevant prescription' => $N,
            'nombre de_patients_incrementaux' => $O,
            'valeur_revenu_par_patient' => $P,
            'ventes_incrementales' => $Q,
            'depenses_medias' => $R1,
            'couts_production_et_agence' => $S,
            'couts_totaux_programme' => $T,
            'ROI' => $ROI,
        ], 200);
    }


    //Activite 8
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
            'Population totale' => $A,
            'Taux incidence maladie' => $B,
            'Nombre patients souffrant maladie' => $C,
            'Pourcentage patients traités satisfaits' => $D,
            'Nombre patients non traités insatisfaits' => $E,
            'Pourcentage patients visés campagne' => $F,
            'Nombre patients ciblés campagne' => $G,
            'Nombre visites uniques site' => $H,
            'Taux efficacité atteinte patients' => $I,
            'Pourcentage visiteurs intéressés' => $J,
            'Nombre visiteurs intéressés sensibilisés' => $K,
            'Pourcentage visiteurs consultant médecin' => $L,
            'Nombre visiteurs consultant médecin' => $M,
            'Pourcentage patients recevant prescription' => $N,
            'Nombre patients avec prescription' => $O,
            'Valeur revenu par patient incrémental' => $P,
            'Ventes incrémentales' => $Q,
            'Coût total campagne' => $R,
            'Retour sur investissement (ROI)' => $ROI,
        ], 200);
    }


    //Activite 9
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
            'Nombre médecins lecteurs' => $A,
            'Nombre insertions publicitaires' => $B,
            'Pourcentage médecins mémoire marque' => $C,
            'Nombre médecins identifié produit' => $D,
            'Pourcentage médecins commençant prescription' => $E,
            'Nombre médecins prescripteurs' => $F,
            'Nombre moyen patients par médecin' => $G,
            'Nombre total nouveaux patients' => $H,
            'Revenu moyen par patient' => $I,
            'Ventes additionnelles' => $J,
            'Coûts achat média' => $K,
            'Coûts production agence' => $L,
            'Coût global campagne' => $M,
            'Retour sur investissement (ROI)' => $ROI,
        ], 200);
    }


    //Activite 10
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
            'Nombre médecins exposés' => $A,
            'Pourcentage médecins souvenant message' => $B,
            'Nombre médecins retenu message' => $C,
            'Pourcentage médecins amélioré perception' => $D,
            'Nombre médecins amélioré perception' => $E,
            'Pourcentage prescripteurs changé perception' => $F,
            'Nombre prescripteurs supplémentaires' => $G,
            'Nombre moyen patients par prescripteur' => $H,
            'Nombre patients incrémentaux' => $I,
            'Valeur moyenne revenu par patient' => $J,
            'Ventes incrémentales' => $K,
            'Coût fixe total activité' => $L,
            'Retour sur investissement (ROI)' => $ROI,
        ], 200);
    }


    //Activite 11
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
            'Nombre consommateurs exposés' => $A,
            'Pourcentage consommateurs mémorisant message' => $B,
            'Nombre consommateurs mémorisant message' => $C,
            'Pourcentage consommateurs consultant après exposition' => $D,
            'Nombre consultations générées' => $E,
            'Pourcentage consultations aboutissant prescription' => $F,
            'Nombre patients incrémentaux' => $G,
            'Revenu moyen par patient' => $H,
            'Ventes incrémentales' => $I,
            'Coût fixe total activité' => $J,
            'Retour sur investissement (ROI)' => $ROI,
        ], 200);
    }


    //Activite 12
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
            'Nombre médecins susceptibles de prescrire le produit' => $A,
            'Pourcentage médecins utilisant internet pour informations professionnelles' => $B,
            'Nombre médecins cibles pouvant être atteints via internet' => $C,
            'Nombre total de visites uniques sur le site' => $D,
            'Taux efficacité sur médecins cibles' => $E,
            'Pourcentage visiteurs uniques ayant interagi davantage avec contenu produit ou complété programme e-detailing' => $F,
            'Nombre médecins ayant passé suffisamment de temps sur site pour être informés' => $G,
            'Pourcentage médecins informés ayant changé positivement perception produit' => $H,
            'Nombre médecins ayant changé positivement perception' => $I,
            'Pourcentage médecins ayant changé perception et susceptibles de prescrire produit' => $J,
            'Nombre total médecins prescrivant produit suite à activité' => $K,
            'Nombre moyen nouveaux patients par médecin ayant prescrit produit' => $L,
            'Nombre total patients incrémentaux gagnés via site' => $M,
            'Valeur moyenne revenu par patient incrémental (MAD k)' => $N,
            'Profit net estimé' => $O,
            'Coût fixe campagne digitale (MAD k)' => $P,
            'Coût total programme' => $Q,
            'Retour sur investissement (ROI)' => $ROI,
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

    public function insertCustomActivity1(Request $request)
    {
        try {
            $laboId = JWTHelper::getLaboId($request);
            if (!$laboId) {
                return response()->json(['message' => 'Token invalide'], 401);
            }

            // Validate the request
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

            // Check if the activity already exists
            $existingActivity = ActivitiesList::whereRaw('LOWER(Name) = ?', [$activityNameLower])
                ->where('is_custom', true)
                ->first();

            if ($existingActivity) {
                // Check if the activity exists for the given lab and year
                $existingByLabo = ActivityByLabo::where('ActivityId', $existingActivity->id)
                    ->where('laboId', $laboId)
                    ->where('year', $validated['year'])
                    ->first();

                if ($existingByLabo) {
                    return response()->json([
                        'message' => 'Cette activité personnalisée existe déjà pour cette année.'
                    ], 409);
                }

                // Create a new ActivityByLabo entry for the existing activity
                $activityByLabo = ActivityByLabo::create([
                    'ActivityId' => $existingActivity->id,
                    'laboId' => $laboId,
                    'year' => $validated['year'],
                ]);

                // Get existing activity items
                $baseItems = ActivityItem::where('ActivityId', $existingActivity->id)->get();

                // Prepare values for insertion
                $baseValues = [];
                foreach ($validated['items'] as $item) {
                    $matchingItem = $baseItems->firstWhere('Name', $item['name']);
                    if ($matchingItem) {
                        $value = ($item['type'] === 'percentage') ? $item['value'] / 100 : $item['value'];
                        $baseValues[] = [
                            'activityItemId' => $matchingItem->id,
                            'ActivityByLaboId' => $activityByLabo->id,
                            'value' => $value,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }
                }

                // Handle ROI from calculatedItems
                $roiItemData = collect($validated['calculatedItems'])->firstWhere('name', 'ROI');
                if ($roiItemData) {
                    $roiItem = $baseItems->firstWhere('Name', 'ROI');
                    if ($roiItem) {
                        $baseValues[] = [
                            'activityItemId' => $roiItem->id,
                            'ActivityByLaboId' => $activityByLabo->id,
                            'value' => $roiItemData['value'],
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    } else {
                        // Create ROI item if it doesn't exist
                        $roiItem = ActivityItem::create([
                            'ActivityId' => $existingActivity->id,
                            'Name' => 'ROI',
                            'Type' => 'calculated',
                            'is_custom' => true,
                            'calculation_expression' => null,
                        ]);
                        $baseValues[] = [
                            'activityItemId' => $roiItem->id,
                            'ActivityByLaboId' => $activityByLabo->id,
                            'value' => $roiItemData['value'],
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }
                }

                // Insert values into activityitemvalues
                ActivityItemValue::insert($baseValues);

                return response()->json([
                    'message' => 'Activité existante, mais ajoutée pour une nouvelle année.',
                    'activityId' => $activityByLabo->id,
                    'activityName' => $validated['name'],
                    'year' => $validated['year'],
                    'ROI' => $roiItemData['value'] ?? null,
                ], 201);
            }

            // Create a new custom activity
            $customActivity = ActivitiesList::create([
                'Name' => $validated['name'],
                'is_custom' => true,
                'created_by' => $laboId,
            ]);

            // Create base items
            $baseItems = [];
            foreach ($validated['items'] as $item) {
                $baseItems[] = ActivityItem::create([
                    'ActivityId' => $customActivity->id,
                    'Name' => $item['name'],
                    'Type' => $item['type'],
                    'is_custom' => true,
                ]);
            }

            // Always create an ROI item
            $roiItemData = collect($validated['calculatedItems'])->firstWhere('name', 'ROI');
            $roiItem = ActivityItem::create([
                'ActivityId' => $customActivity->id,
                'Name' => 'ROI',
                'Type' => 'calculated',
                'is_custom' => true,
                'calculation_expression' => null,
            ]);

            // Create ActivityByLabo entry
            $activityByLabo = ActivityByLabo::create([
                'ActivityId' => $customActivity->id,
                'laboId' => $laboId,
                'year' => $validated['year'],
            ]);

            // Prepare values for insertion
            $baseValues = [];
            foreach ($validated['items'] as $index => $item) {
                $value = ($item['type'] === 'percentage') ? $item['value'] / 100 : $item['value'];
                $baseValues[] = [
                    'activityItemId' => $baseItems[$index]->id,
                    'ActivityByLaboId' => $activityByLabo->id,
                    'value' => $value,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            // Add ROI value
            if ($roiItemData && isset($roiItemData['value'])) {
                $baseValues[] = [
                    'activityItemId' => $roiItem->id,
                    'ActivityByLaboId' => $activityByLabo->id,
                    'value' => $roiItemData['value'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            } else {
                // Default ROI value if not provided
                $baseValues[] = [
                    'activityItemId' => $roiItem->id,
                    'ActivityByLaboId' => $activityByLabo->id,
                    'value' => 0, // Default value
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            // Insert values into activityitemvalues
            ActivityItemValue::insert($baseValues);

            return response()->json([
                'message' => 'Activité personnalisée créée avec succès',
                'activityId' => $activityByLabo->id,
                'ROI' => $roiItemData['value'] ?? 0,
                'activityName' => $validated['name'],
                'year' => $validated['year'],
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la création de l\'activité personnalisée',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function calculateROIAct_Costum(Request $request)
    {
        try {
            // Retrieve the activity ID from the cookie
            $activityByLaboId = $request->cookie('activityId');

            if (!$activityByLaboId) {
                return response()->json(['message' => 'ID d\'activité non trouvé'], 400);
            }

            // Fetch the activity by labo
            $activityByLabo = ActivityByLabo::find($activityByLaboId);
            if (!$activityByLabo) {
                return response()->json(['message' => 'Activité non trouvée'], 404);
            }

            // Verify that the activity is custom
            $activity = ActivitiesList::find($activityByLabo->ActivityId);
            if (!$activity || !$activity->is_custom) {
                return response()->json(['message' => 'Cette activité n\'est pas une activité personnalisée'], 400);
            }

            // Fetch all items for the activity
            $items = ActivityItem::where('ActivityId', $activity->id)
                ->get();

            if ($items->isEmpty()) {
                return response()->json(['message' => 'Aucun élément trouvé pour cette activité'], 404);
            }

            // Fetch values for all items
            $itemValues = ActivityItemValue::where('ActivityByLaboId', $activityByLaboId)
                ->whereIn('activityItemId', $items->pluck('id'))
                ->get()
                ->keyBy('activityItemId');

            // Build a flat object with item names as keys and values as values
            $data = [];
            foreach ($items as $item) {
                $value = isset($itemValues[$item->id]) ? $itemValues[$item->id]->value : null;
                if ($value !== null) {
                    $data[$item->Name] = $value;
                }
            }

            // Ensure ROI is included, even if null
            if (!isset($data['ROI'])) {
                return response()->json(['message' => 'Élément ROI non trouvé pour cette activité'], 404);
            }

            // Return the response as a flat object
            return response()->json($data, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors du calcul du ROI pour l\'activité personnalisée.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    //insertion de toutes le activities (Dynamique)
    public function insertActivityData(Request $request)
    {
        try {
            // Récupération de l'ID du labo depuis le token JWT
            $laboId = JWTHelper::getLaboId($request) ?? $request["laboId"];
            if (!$laboId) {
                return response()->json(['message' => 'Token invalide'], 401);
            }

            // Récupération de l'ID de l'activité depuis le cookie
            $activityId = $request->cookie('activityNumber') ?? $request["activitynumber"];
            if (!$activityId) {
                return response()->json(['message' => 'Activité non spécifiée'], 400);
            }

            // Récupération de la formule de calcul depuis la base de données
            $formula = CalculationFormulat::where('ActivityId', $activityId)->first();
            if (!$formula) {
                return response()->json(['message' => 'Formule de calcul non trouvée pour cette activité'], 404);
            }

            // Récupération des items de l'activité
            $activityItems = ActivityItem::where('ActivityId', $activityId)
                ->where('Name', '!=', 'ROI')
                ->get();

            // Validation des données
            $validationRules = ['year' => 'required|integer'];
            $itemIds = [];

            foreach ($activityItems as $item) {
                $rule = 'required|numeric|min:0';
                if ($item->Type === 'percentage') {
                    $rule .= '|max:100';
                }
                $validationRules[$item->symbole] = $rule;
                $validationRules['id_' . $item->symbole] = 'required|integer';
                $itemIds[$item->symbole] = $item->id;
            }

            $validated = $request->validate($validationRules);

            // Création de l'entrée ActivityByLabo
            $activityByLabo = ActivityByLabo::create([
                'ActivityId' => $activityId,
                'laboId' => $laboId,
                'year' => $validated['year'],
            ]);

            // Préparation des valeurs à insérer
            $values = [];
            $calculatedValues = [];

            // Conversion des pourcentages et stockage des valeurs
            foreach ($activityItems as $item) {
                $value = $validated[$item->symbole];
                if ($item->Type === 'percentage') {
                    $value = $value / 100;
                }
                $calculatedValues[$item->symbole] = $value;

                $values[] = [
                    'activityItemId' => $validated['id_' . $item->symbole],
                    'ActivityByLaboId' => $activityByLabo->id,
                    'value' => $value
                ];
            }

            // Décodage de la formule JSON
            $formulaSteps = json_decode($formula->formulat, true);
            $results = [];

            // Exécution des calculs étape par étape
            foreach ($formulaSteps as $key => $expression) {
                if ($key === 'roi') continue; // On traitera le ROI à part

                // Remplacement des variables dans l'expression
                $expressionToEval = $expression;
                foreach ($calculatedValues as $var => $val) {
                    $expressionToEval = str_replace($var, $val, $expressionToEval);
                }

                // Calcul de l'expression
                $result = eval("return $expressionToEval;");
                $calculatedValues[$key] = $result;
                $results[$key] = $result;
            }

            // Calcul final du ROI
            if (isset($formulaSteps['roi'])) {
                $roiExpression = $formulaSteps['roi'];
                foreach ($calculatedValues as $var => $val) {
                    $roiExpression = str_replace($var, $val, $roiExpression);
                }
                $roi = eval("return $roiExpression;");
                $results['ROI'] = $roi;

                // Ajout du ROI aux valeurs à insérer
                $roiItem = ActivityItem::where('ActivityId', $activityId)
                    ->where('Name', 'ROI')
                    ->first();

                if ($roiItem) {
                    $values[] = [
                        'activityItemId' => $roiItem->id,
                        'ActivityByLaboId' => $activityByLabo->id,
                        'value' => $roi
                    ];
                }
            }

            // Insertion des valeurs en base
            ActivityItemValue::insert($values);

            return response()->json([
                'message' => 'Activité créée et calculée avec succès',
                'results' => $results,
                'ROI' => $results['ROI'] ?? null
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors du traitement',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    //Calcule de toutes le activities (Dynamique) 
    public function calculateRoi(Request $request)
    {
        try {
            // Récupération de l'ID de l'activité
            $activityId = $request->cookie('activityNumber') ??  $request->input('activityId');
            if (!$activityId) {
                return response()->json(['message' => 'Activité non spécifiée'], 400);
            }

            // Récupération de la formule de calcul
            $formula = CalculationFormulat::where('ActivityId', $activityId)->first();
            if (!$formula) {
                return response()->json(['message' => 'Formule de calcul non trouvée'], 404);
            }

            // Récupération des items de l'activité (sauf ROI)
            $activityItems = ActivityItem::where('ActivityId', $activityId)
                ->where('Name', '!=', 'ROI')
                ->get();

            // Validation des données
            $validationRules = ['year' => 'required|integer'];
            $itemIds = [];

            foreach ($activityItems as $item) {
                $rule = 'required|numeric|min:0';
                if ($item->Type === 'percentage') {
                    $rule .= '|max:100';
                }
                $validationRules[$item->symbole] = $rule;
                $validationRules['id_' . $item->symbole] = 'required|integer';
                $itemIds[$item->symbole] = $item->id;
            }

            $validated = $request->validate($validationRules);

            // Décodage de la formule JSON
            $formulaSteps = json_decode($formula->formulat, true);
            $calculatedValues = [];
            $results = [];

            // Conversion des pourcentages et stockage des valeurs
            foreach ($activityItems as $item) {
                $value = $validated[$item->symbole];
                if ($item->Type === 'percentage') {
                    $value = $value / 100;
                }
                $calculatedValues[$item->symbole] = $value;
            }

            // Exécution des calculs étape par étape
            foreach ($formulaSteps as $key => $expression) {
                if ($key === 'roi') continue; // On traitera le ROI à part

                // Remplacement des variables dans l'expression
                $expressionToEval = $expression;
                foreach ($calculatedValues as $var => $val) {
                    $expressionToEval = str_replace($var, $val, $expressionToEval);
                }

                // Calcul de l'expression
                $result = eval("return $expressionToEval;");
                $calculatedValues[$key] = $result;
                $results[$key] = $result;
            }

            // Calcul final du ROI
            $roi = null;
            if (isset($formulaSteps['roi'])) {
                $roiExpression = $formulaSteps['roi'];
                foreach ($calculatedValues as $var => $val) {
                    $roiExpression = str_replace($var, $val, $roiExpression);
                }
                $roi = eval("return $roiExpression;");
                $results['ROI'] = $roi;
            }

            return response()->json([
                'message' => 'Calcul du ROI effectué avec succès',
                'formulas' => $formulaSteps,
                'results' => $results,
                'ROI' => $roi
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors du calcul du ROI',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
