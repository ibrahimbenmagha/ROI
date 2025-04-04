<?php


namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ActivityItemValue;
use App\Models\ActivityByLabo;


class activity11 extends Controller
{
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

    public function insertIntoTable11(Request $request)
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

            // Récupérer l'ID de l'activité depuis le cookie
            $activityByLaboId = $request->cookie('activityId');

            // Préparer les valeurs à insérer
            $values = [
                ['activityItemId' => $request['id_A'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $A],
                ['activityItemId' => $request['id_B'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $B],
                ['activityItemId' => $request['id_D'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $D],
                ['activityItemId' => $request['id_F'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $F],
                ['activityItemId' => $request['id_H'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $H],
                ['activityItemId' => $request['id_J'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $J],
                ['activityItemId' => $request['id_ROI'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $ROI],
            ];

            // Vérifier si l'ID de l'activité est bien 11
            $verify = ActivityByLabo::where('id', $activityByLaboId)->value('ActivityId');
            if ($verify !== 11) {
                return response()->json([
                    'message' => 'value/activity not match',
                    'id' => $verify
                ], 409);
            }

            // Vérifier la duplication des données
            if (ActivityItemValue::where('ActivityByLaboId', $activityByLaboId)->exists()) {
                return response()->json([
                    'message' => 'Duplicated values for 1 Activity are denied'
                ], 409);
            }

            // Insérer les valeurs dans la base de données
            ActivityItemValue::insert($values);
            $UPDATE = ActivityByLabo::where('id', $activityByLaboId)
            ->update(['is_calculated' => true]);
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
}
