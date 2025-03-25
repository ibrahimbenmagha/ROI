<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ActivityItemValue;
use App\Models\ActivityByLabo;
use App\Models\Labo;
use App\Models\ActivityItem;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class Activity1 extends Controller
{
    public function calculateROIAct1(Request $request)
    {
        $validated = $request->validate([
            'A' => 'required|numeric|min:0', // input de Nombre de médecins recevant des échantillons
            'B' => 'required|numeric|min:0', // input de Nombre d’échantillons donnés à chaque médecin
            'D' => 'required|numeric|min:0|max:100', // input de Pourcentage des échantillons réellement donnés aux patients
            'E' => 'required|numeric|min:0.1', // input de Nombre moyen d’échantillons donnés par patient (éviter division par zéro)
            'G' => 'required|numeric|min:0|max:100', // input de Pourcentage des patients ayant reçu une prescription après usage
            'I' => 'required|numeric|min:0|max:100', // input de Pourcentage des patients prescrits sans échantillon
            'K' => 'required|numeric|min:0', // input de Valeur moyenne d’un patient incrémental
            'M' => 'required|numeric|min:0', // input de Coût unitaire d’un échantillon
            'N' => 'required|numeric|min:0', // input de Coûts fixes du programme
            // 'Y' => 'required|integer|min:2026'// inout de l'anne
        ]);
        // Conversion des pourcentages
        $D = $validated['D'] / 100;
        $G = $validated['G'] / 100;
        $I = $validated['I'] / 100;

        $A = $validated['A'];
        $B = $validated['B'];
        $E = $validated['E'];
        $K = $validated['K'];
        $M = $validated['M'];
        $N = $validated['N'];
        // Calculs  
        $C = $A * $B; // Nombre total d’échantillons distribués
        $F = ($C * $D) / $E; // Nombre total de patients ayant reçu un échantillon
        $H = $F * $G; // Nombre total de patients obtenant une prescription
        $J = $H * (1 - $I); // Nombre total de patients incrémentaux gagnés grâce aux échantillons
        $L = $J * $K; // Revenus supplémentaires généré
        $P = $M * $C;
        $O = $P + $N; // Coût total du programme

        // Vérifier pour éviter la division par zéro
        $ROI = ($O > 0) ? round($L / $O, 4) : 0;

        return response()->json([
            'ROI' => $ROI,
            'C' => $C,
            'F' => $F,
            'H' => $H,
            'J' => $J,
            'L' => $L,
            'O' => $O,
            'P' => $P,
        ], 201);
    }

    public function insetrIntoTable1(Request $request)
    {
        $validated = $request->validate([
            'A' => 'required|numeric|min:0', // input de Nombre de médecins recevant des échantillons
            'B' => 'required|numeric|min:0', // input de Nombre d’échantillons donnés à chaque médecin
            'D' => 'required|numeric|min:0|max:100', // input de Pourcentage des échantillons réellement donnés aux patients
            'E' => 'required|numeric|min:0.1', // input de Nombre moyen d’échantillons donnés par patient (éviter division par zéro)
            'G' => 'required|numeric|min:0|max:100', // input de Pourcentage des patients ayant reçu une prescription après usage
            'I' => 'required|numeric|min:0|max:100', // input de Pourcentage des patients prescrits sans échantillon
            'K' => 'required|numeric|min:0', // input de Valeur moyenne d’un patient incrémental
            'M' => 'required|numeric|min:0', // input de Coût unitaire d’un échantillon
            'N' => 'required|numeric|min:0', // input de Coûts fixes du programme

        ]);
        $id_A = $request['id_A'];//id de de Nombre de médecins recevant des échantillons dans la table activityItems
        $id_B = $request['id_B'];
        $id_D = $request['id_D'];
        $id_E = $request['id_E'];
        $id_G = $request['id_G'];
        $id_I = $request['id_I'];
        $id_K = $request['id_K'];
        $id_M = $request['id_M'];
        $id_N = $request['id_N'];
        $id_ROI = $request['id_ROI'];

        // Conversion des pourcentages
        $D = $validated['D'] / 100;
        $G = $validated['G'] / 100;
        $I = $validated['I'] / 100;

        $A = $validated['A'];
        $B = $validated['B'];
        $E = $validated['E'];
        $K = $validated['K'];
        $M = $validated['M'];
        $N = $validated['N'];


        $C = $A * $B;
        $F = ($C * $D) / $E;
        $H = $F * $G;
        $J = $H * (1 - $I);
        $L = $J * $K;
        $O = ($M * $C) + $N;
        $ROI = ($O > 0) ? round($L / $O, 4) : 0;
        $ActByLabo = $request->cookie('activityId');
        // $ActByLabo = $request['ActByLabo'];
        $verify = ActivityByLabo::where('id', $ActByLabo)->value('ActivityId');


        if(!($verify===1)){
            return response()->json([
                'message' => 'value/activity not match',
                'id' =>$verify
            ], 409);
        }

        if (ActivityItemValue::where('ActivityByLaboId', $request['ActByLabo'])->exists()) {
            return response()->json([
                'message' => 'Duplicated values for 1 Activity are dineided',
                
            ], 409);
        }
       
        $values = ActivityItemValue::insert(
            values: [
                ['activityItemId' => $id_A, 'ActivityByLaboId' => $ActByLabo, 'value' => $A],
                ['activityItemId' => $id_B, 'ActivityByLaboId' => $ActByLabo, 'value' => $B],
                ['activityItemId' => $id_D, 'ActivityByLaboId' => $ActByLabo, 'value' => $D],
                ['activityItemId' => $id_E, 'ActivityByLaboId' => $ActByLabo, 'value' => $E],
                ['activityItemId' => $id_K, 'ActivityByLaboId' => $ActByLabo, 'value' => $K],
                ['activityItemId' => $id_M, 'ActivityByLaboId' => $ActByLabo, 'value' => $M],
                ['activityItemId' => $id_N, 'ActivityByLaboId' => $ActByLabo, 'value' => $N],
                ['activityItemId' => $id_G, 'ActivityByLaboId' => $ActByLabo, 'value' => $G],
                ['activityItemId' => $id_I, 'ActivityByLaboId' => $ActByLabo, 'value' => $I],
                ['activityItemId' => $id_ROI, 'ActivityByLaboId' => $ActByLabo, 'value' => $ROI],
            ]
        );
        return response()->json([
            'message' => 'Good request',
            // 'data' => $values
        ], 201);
    }

    public function updateActivity1Values(Request $request)
    {
        $validated = $request->validate([
            'A' => 'required|numeric|min:0',
            'B' => 'required|numeric|min:0',
            'D' => 'required|numeric|min:0|max:100',
            'E' => 'required|numeric|min:0.1',
            'G' => 'required|numeric|min:0|max:100',
            'I' => 'required|numeric|min:0|max:100',
            'K' => 'required|numeric|min:0',
            'M' => 'required|numeric|min:0',
            'N' => 'required|numeric|min:0',
        ]);

        $D = $validated['D'] / 100;
        $G = $validated['G'] / 100;
        $I = $validated['I'] / 100;

        $A = $validated['A'];
        $B = $validated['B'];
        $E = $validated['E'];
        $K = $validated['K'];
        $M = $validated['M'];
        $N = $validated['N'];

        $id_A = $request['id_A'];
        $id_B = $request['id_B'];
        $id_D = $request['id_D'];
        $id_E = $request['id_E'];
        $id_G = $request['id_G'];
        $id_I = $request['id_I'];
        $id_K = $request['id_K'];
        $id_M = $request['id_M'];
        $id_N = $request['id_N'];
        $id_ROI = $request['id_ROI'];

        $activityByLaboId = $request['ActivityByLaboId'];

        $C = $A * $B;
        $F = ($C * $D) / $E;
        $H = $F * $G;
        $J = $H * (1 - $I);
        $L = $J * $K;
        $P = $M * $C;
        $O = $P + $N;
        $ROI = ($O > 0) ? round($L / $O, 4) : 0;
        //     ['value' => $A],
        //     ['value' => $B],
        //     ['value' => $D],
        //     ['value' => $E],
        //     ['value' => $K],
        //     ['value' => $M],
        //     ['value' => $N],
        //     ['value' => $G],
        //     ['value' => $I],
        //     ['value' => $ROI],
        // ];


        $values = [
            ['activityItemId' => $id_A, 'value' => $A],
            ['activityItemId' => $id_B, 'value' => $B],
            ['activityItemId' => $id_D, 'value' => $D],
            ['activityItemId' => $id_E, 'value' => $E],
            ['activityItemId' => $id_K, 'value' => $K],
            ['activityItemId' => $id_M, 'value' => $M],
            ['activityItemId' => $id_N, 'value' => $N],
            ['activityItemId' => $id_G, 'value' => $G],
            ['activityItemId' => $id_I, 'value' => $I],
            ['activityItemId' => $id_ROI, 'value' => $ROI],
        ];
        $verify = ActivityByLabo::where('id', $activityByLaboId)->value('ActivityId');
        if(!($verify===1)){
            return response()->json([
                'message' => 'value/activity not match',
                'id' =>$verify
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
