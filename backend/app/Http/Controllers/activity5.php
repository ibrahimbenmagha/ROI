<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ActivityItemValue;
use App\Models\ActivityByLabo;

class activity5 extends Controller
{
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


        $C = $A * $B;//Nombre total de contacts médecins (C)
        $E = $C / $D; //Nombre total de tables rondes requises (E)
        $G = $A * $F;//Nombre de médecins ayant changé positivement leur perception (G)
        $I = $G * $H;//Nombre de médecins prescrivant (I)
        $K = $I * $J;//Nombre de patients incrémentaux gagnés (K) 
        $M = $K * $L;//Ventes incrémentales (M)
        $P = ($N * $E) + $O;//Coût total du programme (P)
        $Q = $P / $C;//Coût par contact médecin (Q)

        $ROI = ($P > 0) ? round($M / $P, 4) : 0;

        return response()->json([
            'ROI' => $ROI,
            'C' => $C,
            'E' => $E,
            'G' => $G,
            'I' => $I,
            'K' => $K,
            'M' => $M,
            'P' => $P,
            'Q' => $Q,
        ], 201);
    }

    public function insertIntoTable5(Request $request)
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

            $C = $A * $B;//Nombre total de contacts médecins (C)
            $E = $C / $D; //Nombre total de tables rondes requises (E)
            $G = $A * $F;//Nombre de médecins ayant changé positivement leur perception (G)
            $I = $G * $H;//Nombre de médecins prescrivant (I)
            $K = $I * $J;//Nombre de patients incrémentaux gagnés (K) 
            $M = $K * $L;//Ventes incrémentales (M)
            $P = ($N * $E) + $O;//Coût total du programme (P)
            $Q = $P / $C;//Coût par contact médecin (Q)

            $ROI = ($P > 0) ? round($M / $P, 4) : 0;
            $activityByLaboId = $request['ActivityByLaboId'];
            $values = [
                ['activityItemId' => $request['id_A'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $A],
                ['activityItemId' => $request['id_B'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $B],
                ['activityItemId' => $request['id_D'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $D],
                ['activityItemId' => $request['id_F'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $F],
                ['activityItemId' => $request['id_H'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $H],
                ['activityItemId' => $request['id_J'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $J],
                ['activityItemId' => $request['id_L'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $L],
                ['activityItemId' => $request['id_N'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $N],
                ['activityItemId' => $request['id_O'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $O],
                ['activityItemId' => $request['id_ROI'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $ROI],

            ];
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
