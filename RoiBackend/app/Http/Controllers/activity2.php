<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ActivityItemValue;
use App\Models\ActivityByLabo;
use App\Models\Labo;
use App\Models\ActivityItem;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class activity2 extends Controller
{


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




    public function insertIntoTable2(Request $request)
    {
        try {
            $validated = $request->validate([
                'A' => 'required|numeric|min:0', // Nombre de médecins participant à l'étude
                'B' => 'required|numeric|min:0', // Nombre moyen de patients inscrits par médecin
                'D' => 'required|numeric|min:0|max:100', // Pourcentage moyen de patients qui continuent le traitement
                'F' => 'required|numeric|min:0', // Nombre de nouveaux patients traités par médecin grâce à l'étude
                'H' => 'required|numeric|min:0', // Valeur du revenu par patient incrémental
                'J' => 'required|numeric|min:0', // Coût variable par médecin
                'K' => 'required|numeric|min:0', // Coût fixe total de l’étude
            ]);

            $id_A = $request['id_A']; // ID de Nombre de médecins participant à l'étude
            $id_B = $request['id_B'];
            $id_D = $request['id_D'];
            $id_F = $request['id_F'];
            $id_H = $request['id_H'];
            $id_J = $request['id_J'];
            $id_K = $request['id_K'];
            $id_ROI = $request['id_ROI'];

            $D = $validated['D'] / 100;

            $A = $validated['A'];
            $B = $validated['B'];
            $F = $validated['F'];
            $H = $validated['H'];
            $J = $validated['J'];
            $K = $validated['K'];


            // Calculs
            $C = $A * $B;       // Nombre total de patients inscrits
            $E = $B * $D;       // Nombre de patients poursuivant le traitement après l'étude
            $G = $A * ($E + $F); // Patients incrémentaux obtenus grâce à l’étude
            $I = $G * $H;       // Ventes incrémentales
            $L = ($J * $A) + $K; // Coût total du programme
            $ROI = ($L > 0) ? round($I / $L, 4) : 0;


            $ActByLabo = $request->cookie('activityId');
            $verify = ActivityByLabo::where('id', $ActByLabo)->value('ActivityId');
            if (!($verify === 2)) {
                return response()->json([
                    'message' => 'value/activity not match',
                    'id' => $verify
                ], 409);
            }
            if (ActivityItemValue::where('ActivityByLaboId', $ActByLabo)->exists()) {
                return response()->json([
                    'message' => 'Duplicated values for 1 Activity are denied'
                ], 409);
            }

            // Insertion des valeurs dans la table ActivityItemValue
            $values = [
                ['activityItemId' => $id_A, 'ActivityByLaboId' => $ActByLabo, 'value' => $A],
                ['activityItemId' => $id_B, 'ActivityByLaboId' => $ActByLabo, 'value' => $B],
                ['activityItemId' => $id_D, 'ActivityByLaboId' => $ActByLabo, 'value' => $D],
                ['activityItemId' => $id_F, 'ActivityByLaboId' => $ActByLabo, 'value' => $F],
                ['activityItemId' => $id_H, 'ActivityByLaboId' => $ActByLabo, 'value' => $H],
                ['activityItemId' => $id_J, 'ActivityByLaboId' => $ActByLabo, 'value' => $J],
                ['activityItemId' => $id_K, 'ActivityByLaboId' => $ActByLabo, 'value' => $K],
                ['activityItemId' => $id_ROI, 'ActivityByLaboId' => $ActByLabo, 'value' => $ROI],
            ];
            ActivityItemValue::insert($values);
            $UPDATE = ActivityByLabo::where('id', $ActByLabo)
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
}
