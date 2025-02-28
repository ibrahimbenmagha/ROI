<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ActivityItemValue;
use App\Models\ActivityByLabo;

class activity4 extends Controller
{
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

        $C = $A * $B;// Nombre de médecins exposés au message
        $E = $C * $D;// Nombre de médecins ayant une perception positive
        $G = $E * $F;// Nombre de médecins prescrivant à de nouveaux patients
        $I = ($G * $H) + $KOL;// Nombre de patients incrémentaux gagnés
        $K = $I * $J;// Ventes incrémentales générées
        $N = ($L * $A) + $M;// Coût total du programme

        //Vérification pour éviter division par zéro
        $ROI = ($N > 0) ? round($K / $N, 4) : 0;

        return response()->json([
            'ROI' => $ROI,
            'C' => $C,
            'E' => $E,
            'G' => $G,
            'I' => $I,
            'K' => $K,
            'N' => $N,
        ], 201);
    }

    public function insertIntoTable4(Request $request)
    {
        try {
            $validated = $request->validate([
                'A' => 'required|numeric|min:1', // Nombre de médecins participants à la conférence
                'B' => 'required|numeric|min:1|max:100', // Pourcentage de médecins ayant retenu le message
                'D' => 'required|numeric|min:1|max:100', // Pourcentage de médecins ayant une perception positive
                'F' => 'required|numeric|min:0|max:100', // Pourcentage de médecins qui prescrivent à de nouveaux patients
                'H' => 'required|numeric|min:1', // Nombre moyen de nouveaux patients prescrits par médecin
                'KOL' => 'required|numeric|min:1', // Ajustement lié à l’influence des leaders d’opinion
                'J' => 'required|numeric|min:1', // Valeur de revenu générée par patient incrémental
                'L' => 'required|numeric|min:1', // Coût variable par médecin
                'M' => 'required|numeric|min:1', // Coût fixe total du programme
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

            $C = $A * $B;// Nombre de médecins exposés au message
            $E = $C * $D;// Nombre de médecins ayant une perception positive
            $G = $E * $F;// Nombre de médecins prescrivant à de nouveaux patients
            $I = ($G * $H) + $KOL;// Nombre de patients incrémentaux gagnés
            $K = $I * $J;// Ventes incrémentales générées
            $N = ($L * $A) + $M;// Coût total du programme

            $ROI = ($N > 0) ? round($K / $N, 4) : 0;
            $activityByLaboId = $request['ActivityByLaboId'];
            if (ActivityItemValue::where('ActivityByLaboId', $activityByLaboId)->exists()) {
                return response()->json([
                    'message' => 'Duplicated values for 1 Activity are denied'
                ], 409);
            }
            if(ActivityByLabo::where('id', $activityByLaboId)->doesntExist()) {
                return response()->json([
                    'message' => 'You should add this activity to your profile first'
                ], 409);
            };

            $values = [
                ['activityItemId' => $request['id_A'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $A],
                ['activityItemId' => $request['id_B'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $B],
                ['activityItemId' => $request['id_D'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $D],
                ['activityItemId' => $request['id_F'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $F],
                ['activityItemId' => $request['id_H'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $H],
                ['activityItemId' => $request['id_KOL'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $KOL],
                ['activityItemId' => $request['id_J'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $J],
                ['activityItemId' => $request['id_L'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $L],
                ['activityItemId' => $request['id_M'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $M],
                ['activityItemId' => $request['id_ROI'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $ROI],
            ];
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

        $C = $A * $B;// Nombre de médecins exposés au message
        $E = $C * $D;// Nombre de médecins ayant une perception positive
        $G = $E * $F;// Nombre de médecins prescrivant à de nouveaux patients
        $I = ($G * $H) + $KOL;// Nombre de patients incrémentaux gagnés
        $K = $I * $J;// Ventes incrémentales générées
        $N = ($L * $A) + $M;// Coût total du programme
        $activityByLaboId = $request['ActivityByLaboId'];

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


}
