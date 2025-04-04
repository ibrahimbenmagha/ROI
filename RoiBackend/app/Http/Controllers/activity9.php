<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ActivityItemValue;
use App\Models\ActivityByLabo;
class activity9 extends Controller
{
    public function calculateROIAct9(Request $request)
    {
        try {

            $validated = $request->validate([
                'A' => 'required|numeric|min:0',  // Number of doctors who read the publications
                'B' => 'required|numeric|min:0|', //Nombre d’insertions publicitaires prévues dans l’ensemble des publications ciblées
                'C' => 'required|numeric|min:0|max:100', // Percentage of doctors who remember the brand
                'E' => 'required|numeric|min:0|max:100', // Percentage of doctors prescribing after exposure
                'G' => 'required|numeric|min:0', // Average number of new patients per prescriber
                'I' => 'required|numeric|min:0', // Revenue per new patient
                'K' => 'required|numeric|min:0', // Media purchase costs
                'L' => 'required|numeric|min:0', // Campaign creation and management costs
            ]);

            $C = $validated['C'] / 100;  // Percentage of doctors who remember the brand
            $E = $validated['E'] / 100;  // Percentage of doctors prescribing after exposure

            // Retrieve the request variables
            $A = $validated['A']; // Number of doctors who read the publications
            $B = $validated['B']; // Number of insertions publicitaires prévues dans l’ensemble des publications ciblées
            $G = $validated['G']; // Average number of new patients per prescriber
            $I = $validated['I']; // Revenue per new patient
            $K = $validated['K']; // Media purchase costs
            $L = $validated['L']; // Campaign creation and management costs

            $D = $A * $C;  // Number of doctors who remember the brand and message
            $F = $D * $E;  // Number of doctors who start prescribing after the exposure
            $H = $F * $G;  // Number of incremental patients gained
            $J = $H * $I;  // Incremental sales generated
            $M = $K + $L;  // Total campaign cost

            // ROI calculation
            $ROI = ($M > 0) ? round($J / $M, 4) : 0;  // Return on investment (ROI)

            // Return the result in a response
            return response()->json([
                'D' => $D,// Number of doctors who remember the brand and message
                'F' => $F,// Number of doctors who start prescribing
                'H' => $H,// Number of incremental patients gained
                'J' => $J,// Incremental sales generated
                'M' => $M,// Total campaign cost
                'ROI' => $ROI// Return on investment (ROI)
            ], 200);

        } catch (\Exception $e) {
            // Handle any errors
            return response()->json([
                'message' => 'Failed to calculate ROI',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function insertIntoTable9(Request $request)
    {
        try {

            $validated = $request->validate([
                'A' => 'required|numeric|min:0',  //Nombre de médecins ayant lu au moins une des publications contenant une annonce produit
                'B' => 'required|numeric|min:0|', //Nombre d’insertions publicitaires prévues dans l’ensemble des publications ciblées
                'C' => 'required|numeric|min:0|max:100', // Pourcentage des médecins lecteurs capables de se souvenir de la marque et du message après exposition aux annonces
                'E' => 'required|numeric|min:0|max:100', // Pourcentage des médecins ayant mémorisé la publicité qui commencent à prescrire le produit à de nouveaux patients
                'G' => 'required|numeric|min:0', // Nombre moyen de nouveaux patients mis sous traitement par chaque médecin prescripteur
                'I' => 'required|numeric|min:0', // Revenu moyen généré par chaque nouveau patient traité
                'K' => 'required|numeric|min:0', // Coûts d’achat média pour la campagne presse (MAD)
                'L' => 'required|numeric|min:0', // Coûts de production et frais d’agence associés à la campagne (MAD)
            ]);

            $C = $validated['C'] / 100;  // Percentage of doctors who remember the brand
            $E = $validated['E'] / 100;  // Percentage of doctors prescribing after exposure

            // Retrieve the request variables
            $A = $validated['A'];
            $B = $validated['B'];
            $G = $validated['G'];
            $I = $validated['I'];
            $K = $validated['K'];
            $L = $validated['L'];

            $D = $A * $C;  // Nombre de médecins ayant correctement identifié le produit et son message via la campagne presse
            $F = $D * $E;  // Nombre de médecins ayant commencé à prescrire le produit après avoir vu la campagne.
            $H = $F * $G;  //Nombre de nouveaux patients obtenus directement grâce aux prescriptions issues de la campagne.
            $J = $H * $I;  // Montant des ventes additionnelles en MAD généré par la campagne
            $M = $K + $L;  // Coût global de la campagne presse en MAD.

            // ROI calculation
            $ROI = ($M > 0) ? round($J / $M, 4) : 0;  // Return on investment (ROI)

            $activityByLaboId = $request->cookie('activityId');

            $values = [
                ['activityItemId' => $request['id_A'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $A],
                ['activityItemId' => $request['id_B'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $B],
                ['activityItemId' => $request['id_C'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $C],
                ['activityItemId' => $request['id_E'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $E],
                ['activityItemId' => $request['id_G'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $G],
                ['activityItemId' => $request['id_I'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $I],
                ['activityItemId' => $request['id_K'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $K],
                ['activityItemId' => $request['id_L'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $L],
                ['activityItemId' => $request['id_ROI'], 'ActivityByLaboId' => $activityByLaboId, 'value' => $ROI],
            ];
            $verify = ActivityByLabo::where('id', $activityByLaboId)->value('ActivityId');
            if (!($verify === 9)) {
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


}
