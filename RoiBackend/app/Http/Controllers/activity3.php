<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ActivityItemValue;
use App\Models\ActivityByLabo;
use App\Models\Labo;
use App\Models\ActivityItem;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class activity3 extends Controller
{


    public function calculateROIAct3(Request $request)
    {
        // Validation des données entrantes
        $validated = $request->validate([
            'A' => 'required|numeric|min:0', // Nombre total de médecins ciblés par l’email
            'B' => 'required|numeric|min:0', // Nombre moyen d’emails envoyés par médecin
            'C' => 'required|numeric|min:0|max:100', // Pourcentage de médecins se rappelant avoir reçu l’email
            'E' => 'required|numeric|min:0|max:100', // Pourcentage de médecins se rappelant de la marque et du message
            'G' => 'required|numeric|min:0|max:100', // Pourcentage de médecins prescrivant Prexige à de nouveaux patients après réception du message
            'I' => 'required|numeric|min:0', // Nombre moyen de nouveaux patients mis sous Prexige par médecin
            'K' => 'required|numeric|min:0', // Valeur du revenu par patient incrémental
            'M' => 'required|numeric|min:0', // Coût variable par email envoyé
            'N' => 'required|numeric|min:0', // Coût fixe total du programme
        ]);

        // Conversion des pourcentages
        $C = $validated['C'] / 100;
        $E = $validated['E'] / 100;
        $G = $validated['G'] / 100;

        // Variables
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

        // Retourner les données avec les mêmes clés que dans la requête, y compris les calculs
        return response()->json([
            'nombre_total_de_médecins_ciblés_par_email' => $validated['A'],
            'nombre_moyen_d_emails_envoyés_par_médecin' => $validated['B'],
            'pourcentage_de_médecins_se_rappelant_avoir_reçu_email' => $validated['C'],
            'pourcentage_de_médecins_se_rappelant_marque_message' => $validated['E'],
            'pourcentage_de_médecins_prescrivant_prexige_nouveaux_patients' => $validated['G'],
            'nombre_moyen_de_nouveaux_patients_mis_sous_prexige_par_médecin' => $validated['I'],
            'valeur_du_revenu_par_patient_incremental' => $validated['K'],
            'cout_variable_par_email_envoye' => $validated['M'],
            'cout_fixe_total_du_programme' => $validated['N'],
            'nombre_de_médecins_ayant_reçu_et_rappelé_email' => $D,
            'nombre_de_médecins_se_rappelant_du_produit_message' => $F,
            'nombre_de_médecins_prescrivant_prexige_email' => $H,
            'nombre_de_patients_incrementaux_generes_par_email' => $J,
            'ventes_incrementales_generées' => $L,
            'cout_total_du_programme' => $O,
            'ROI' => $ROI,
        ], 201);
    }


    public function insertIntoTable3(Request $request)
    {
        try {
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


            $activityByLaboId = $request->cookie('activityId');
            $verify = ActivityByLabo::where('id', $activityByLaboId)->value('ActivityId');
            if (!($verify == 3)) {
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
            // Insertion des valeurs dans la table
            $values = [
                ['activityItemId' => $request['id_A'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $A],
                ['activityItemId' => $request['id_B'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $B],
                ['activityItemId' => $request['id_C'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $C],
                ['activityItemId' => $request['id_E'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $E],
                ['activityItemId' => $request['id_G'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $G],
                ['activityItemId' => $request['id_I'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $I],
                ['activityItemId' => $request['id_K'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $K],
                ['activityItemId' => $request['id_M'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $M],
                ['activityItemId' => $request['id_N'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $N],
                ['activityItemId' => $request['id_ROI'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $ROI],
            ];



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
}
