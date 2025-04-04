<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ActivityItemValue;
use App\Models\ActivityByLabo;
class activity6 extends Controller
{
    public function calculateROIAct6(Request $request)
    {
        // Validation des entrées
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

        // Conversion des pourcentages en valeurs décimales
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

        // Retour de la réponse avec les résultats
        return response()->json([
            'ROI' => $ROI,
            'C' => $C, // Nombre total de visites
            'F' => $F, // Nombre de médecins se rappelant du message
            'H' => $H, // Nombre de médecins prescrivant Prexige
            'J' => $J, // Nombre de patients incrémentaux
            'L' => $L, // Ventes incrémentales
            'M' => $M, // Coût total du programme
        ], 201);
    }

    public function insertIntoTable6(Request $request)
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
            $activityByLaboId = $request->cookie('activityId');
            $values = [
                ['activityItemId' => $request['id_A'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $A],
                ['activityItemId' => $request['id_B'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $B],
                ['activityItemId' => $request['id_E'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $E],
                ['activityItemId' => $request['id_G'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $G],
                ['activityItemId' => $request['id_I'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $I],
                ['activityItemId' => $request['id_K'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $K],
                ['activityItemId' => $request['id_M1'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $M1],
                ['activityItemId' => $request['id_M2'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $M2],
                ['activityItemId' => $request['id_ROI'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $ROI],

            ];

            $verify = ActivityByLabo::where('id', $activityByLaboId)->value('ActivityId');
            if (!($verify === 6)) {
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

}
