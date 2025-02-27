<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class activity2 extends Controller
{
    public function calculateROIAct2(Request $request)
    {
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
        $C = $A * $B;       // Nombre total de patients inscrits
        $E = $B * $D;       // Nombre de patients poursuivant le traitement après l'étude
        $G = $A * ($E + $F); // Patients incrémentaux obtenus grâce à l’étude
        $I = $G * $H;       // Ventes incrémentales
        $L = ($J * $A) + $K; // Coût total du programme
    
        // Vérification pour éviter la division par zéro
        $ROI = ($L > 0) ? round($I / $L, 4) : 0;
    
        return response()->json([
            'ROI' => $ROI,
            'C' => $C,
            'E' => $E,
            'G' => $G,
            'I' => $I,
            'L' => $L,
        ], 201);
    }
    
    // public function 
}
