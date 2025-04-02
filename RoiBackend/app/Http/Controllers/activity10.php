<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ActivityItemValue;
use App\Models\ActivityByLabo;

class activity10 extends Controller
{
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

    public function insertIntoTable10(Request $request)
    {
        try {
            // Validation des données
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

            $activityByLaboId = $request->cookie('activityId');

            $values = [
                ['activityItemId' => $request['id_A'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $A],
                ['activityItemId' => $request['id_B'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $B],
                ['activityItemId' => $request['id_D'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $D],
                ['activityItemId' => $request['id_F'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $F],
                ['activityItemId' => $request['id_H'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $H],
                ['activityItemId' => $request['id_J'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $J],
                ['activityItemId' => $request['id_L'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $L],
                ['activityItemId' => $request['id_ROI'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $ROI],
            ];

            $verify = ActivityByLabo::where('id', $activityByLaboId)->value('ActivityId');
            if ($verify !== 10) {
                return response()->json([
                    'message' => 'value/activity not match',
                    'id' => $verify
                ], 409);
            }

            // Vérification de la duplication des données
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
            // Gestion des erreurs
            return response()->json([
                "message" => 'Failed to insert values',
                "error" => $e->getMessage()
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

}
