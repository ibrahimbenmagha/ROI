<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ActivityItemValue;
use App\Models\ActivityByLabo;

class activity7 extends Controller
{
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

    public function insertIntoTable7(Request $request)
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

            $activityByLaboId = $request['ActivityByLaboId'];
            $values = [
                ['activityItemId' => $request['id_G'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $G],
                ['activityItemId' => $request['id_H'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $H],
                ['activityItemId' => $request['id_J'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $J],
                ['activityItemId' => $request['id_L'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $L],
                ['activityItemId' => $request['id_N'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $N],
                ['activityItemId' => $request['id_P'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $P],
                ['activityItemId' => $request['id_R1'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $R1],
                ['activityItemId' => $request['id_ROI'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $ROI],
                ['activityItemId' => $request['id_S'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $S],

            ];
            $verify = ActivityByLabo::where('id', $activityByLaboId)->value('ActivityId');
            if (!($verify === 7)) {
                return response()->json([
                    'message' => 'value/activity not match',
                    'id' => $verify
                ], 409);
            }
            $activityByLaboId = $request['ActivityByLaboId'];
            if (ActivityItemValue::where('ActivityByLaboId', $activityByLaboId)->exists()) {
                return response()->json([
                    'message' => 'Duplicated values for 1 Activity are denied'
                ], 409);
            }

            ActivityItemValue::insert($values);
            return response()->json([
                'message' => 'Values inserted successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                "message" => 'Failed to insert values',
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

}
