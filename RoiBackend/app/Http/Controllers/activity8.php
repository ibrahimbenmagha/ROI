<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ActivityItemValue;
use App\Models\ActivityByLabo;

class activity8 extends Controller
{
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
            $H = $validated['H'];// Population totale
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

    public function insertIntoTable8(Request $request)
    {
        try {
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
            $R = $validated['R']; // Coût total de la campagne
            $H = $validated['H'];// Population totale

            $C = $A * $B;  // Nombre total de patients souffrant de la maladie
            $E = $C * (1 - $D);  // Nombre de patients non traités ou insatisfaits
            $G = $E * $F;  // Nombre de patients ciblés par la campagne digitale
            $I = $H / $G;  // Taux d’efficacité d’atteinte des patients ciblés
            $K = $H * $J;  // Nombre de visiteurs uniques intéressés et sensibilisés
            $M = $K * $L;  // Nombre de visiteurs uniques ayant consulté un médecin
            $O = $M * $N;  // Nombre de patients ayant obtenu une prescription Prexige
            $Q = $O * $P;  // Ventes incrémentales générées

            $ROI = ($R > 0) ? round($Q / $R, 4) : 0;  // ROI

            $activityByLaboId = $request->cookie('activityId');

            $values = [
                ['activityItemId' => $request['id_A'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $A],
                ['activityItemId' => $request['id_B'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $B],
                ['activityItemId' => $request['id_D'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $D],
                ['activityItemId' => $request['id_F'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $F],
                ['activityItemId' => $request['id_H'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $H],
                ['activityItemId' => $request['id_J'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $J],
                ['activityItemId' => $request['id_L'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $L],
                ['activityItemId' => $request['id_N'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $N],
                ['activityItemId' => $request['id_P'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $P],
                ['activityItemId' => $request['id_R'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $R],
                ['activityItemId' => $request['id_ROI'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $ROI],
            ];

            $verify = ActivityByLabo::where('id', $activityByLaboId)->value('ActivityId');
            if (!($verify === 8)) {
                return response()->json([
                    'message' => 'value/activity not match',
                    'id' => $verify
                ], 409);
            }

            if (ActivityItemValue::where('ActivityByLaboId', $activityByLaboId)->exists()) {
                return response()->json([
                    'message' => 'Duplicated values for 1 Activity are denied'
                ], 409);
            }

            ActivityItemValue::insert($values);
            $UPDATE = ActivityByLabo::where('id', $activityByLaboId)
            ->update(['is_calculated' => true]);
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
            $H=$validated['H']; // Coût total de la campagne

            // Intermediate Calculations
            $C = $A * $B;  // Nombre total de patients souffrant de la maladie
            $E = $C * (1 - $D);  // Nombre de patients non traités ou insatisfaits
            $G = $E * $F;  // Nombre de patients ciblés par la campagne digitale
            $I = $H / $G;  // Taux d’efficacité d’atteinte des patients ciblés
            $K = $H* $J;  // Nombre de visiteurs uniques intéressés et sensibilisés
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

}
