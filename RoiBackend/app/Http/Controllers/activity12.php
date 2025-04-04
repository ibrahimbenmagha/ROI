<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ActivityItemValue;
use App\Models\ActivityByLabo;

class activity12 extends Controller
{
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

    public function insertIntoTable12(Request $request)
    {
        try {
            $validated = $request->validate([
                'A' => 'required|numeric|min:0',
                'B' => 'required|numeric|min:0|max:100',
                'D' => 'required|numeric|min:0',
                'F' => 'required|numeric|min:0|max:100',
                'H' => 'required|numeric|min:0|max:100',
                'J' => 'required|numeric|min:0|max:100',
                'L' => 'required|numeric|min:0',
                'N' => 'required|numeric|min:0',
                'P' => 'required|numeric|min:0',
            ]);

            $activityByLaboId = $request->cookie('activityId');

            if (!$activityByLaboId) {
                return response()->json(['message' => 'Activity ID not found'], 400);
            }

            $verify = ActivityByLabo::where('id', $activityByLaboId)->value('ActivityId');
            if ($verify !== 12) {
                return response()->json(['message' => 'value/activity not match', 'id' => $verify], 409);
            }

            if (ActivityItemValue::where('ActivityByLaboId', $activityByLaboId)->exists()) {
                return response()->json(['message' => 'Duplicated values for 1 Activity are denied'], 409);
            }

            $values = [];
            foreach ($validated as $key => $value) {
                $values[] = ['activityItemId' => $request['id_' . $key], 'ActivityByLaboId' => $activityByLaboId, 'value' => $value];
            }

            ActivityItemValue::insert($values);
            $UPDATE = ActivityByLabo::where('id', $activityByLaboId)
            ->update(['is_calculated' => true]);543

            return response()->json(['message' => 'Values inserted successfully'], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to insert values', 'error' => $e->getMessage()], 500);
        }
    }
}
