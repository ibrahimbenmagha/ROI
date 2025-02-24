<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ActivityItemValue;

class Activity1 extends Controller
{
    public function calculateROI(Request $request)
    {
        // Validation des entrées
        $validated = $request->validate([
            $request['A'] => 'required|numeric|min:0', // Nombre de médecins recevant des échantillons
            $request['B'] => 'required|numeric|min:0', // Nombre d’échantillons donnés à chaque médecin
            $request['D'] => 'required|numeric|min:0|max:100', // Pourcentage des échantillons réellement donnés aux patients
            $request['E'] => 'required|numeric|min:0.1', // Nombre moyen d’échantillons donnés par patient (éviter division par zéro)
            $request['G'] => 'required|numeric|min:0|max:100', // Pourcentage des patients ayant reçu une prescription après usage
            $request['I'] => 'required|numeric|min:0|max:100', // Pourcentage des patients prescrits sans échantillon
            $request['K'] => 'required|numeric|min:0', // Valeur moyenne d’un patient incrémental
            $request['M'] => 'required|numeric|min:0', // Coût unitaire d’un échantillon
            $request['N'] => 'required|numeric|min:0', // Coûts fixes du programme
            $request['Y'] => 'required|Year'
        ]);

        $id_A = $request['id_A'];
        $id_B = $request['id_B'];
        $id_D = $request['id_D'];
        $id_E = $request['id_E'];
        $id_G = $request['id_G'];
        $id_I = $request['id_I'];
        $id_K = $request['id_K'];
        $id_M = $request['id_M'];
        $id_N = $request['id_N'];
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


        $ActivityByLaboId = $request['ActivityByLaboId '];
        $laboId = $request['laboId'];
        // Calculs  
        $C = $A * $B; // Nombre total d’échantillons distribués
        $F = ($C * $D) / $E; // Nombre total de patients ayant reçu un échantillon
        $H = $F * $G; // Nombre total de patients obtenant une prescription
        $J = $H * (1 - $I); // Nombre total de patients incrémentaux gagnés grâce aux échantillons
        $L = $J * $K; // Revenus supplémentaires générés
        $O = ($M * $C) + $N; // Coût total du programme

        // Vérifier pour éviter la division par zéro
        $ROI = ($O > 0) ? round($L / $O, 4) : 0;

        
        //     if(
        //         ActivityItemValue::where([
        //             ['']
        //         ])
        //     )
        // }


        return response()->json(['ROI' => $ROI], 200);
    }
}
