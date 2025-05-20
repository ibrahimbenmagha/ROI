<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use OpenAI;

class InterpretationController extends Controller
{
    public function generate(Request $request)
    {
        try {
            // Get the entire JSON payload as an array
            $data = $request->all();

            // Initialize prompt
            $prompt = "
                Vous êtes un expert en analyse de ROI pour des programmes médicaux. Voici les données fournies pour un programme médical :

            ";

            // Dynamically process all key-value pairs in the payload
            if (!empty($data)) {
                $prompt .= "\nDonnées fournies :\n";
                foreach ($data as $key => $value) {
                    // Skip nested arrays for simplicity; handle them separately if needed
                    if (!is_array($value)) {
                        // Convert key to human-readable format (e.g., numDoctors -> Nombre de médecins)
                        $label = ucwords(str_replace(['_', 'camel'], [' ', ''], $key));
                        // Append % for percentage fields
                        $suffix = (stripos($key, 'percent') !== false) ? '%' : '';
                        // Append MAD for monetary fields
                        $suffix = (stripos($key, 'cost') !== false || stripos($key, 'sales') !== false || stripos($key, 'value') !== false) ? ' MAD' : $suffix;
                        $prompt .= "- $label : $value$suffix\n";
                    }
                }

                // Handle nested arrays (e.g., metrics, inputs) if present
                foreach ($data as $key => $value) {
                    if (is_array($value)) {
                        $sectionLabel = ucwords(str_replace(['_', 'camel'], [' ', ''], $key));
                        $prompt .= "\n$sectionLabel :\n";
                        foreach ($value as $subKey => $subValue) {
                            $subLabel = ucwords(str_replace(['_', 'camel'], [' ', ''], $subKey));
                            $suffix = (stripos($subKey, 'percent') !== false) ? '%' : '';
                            $suffix = (stripos($subKey, 'cost') !== false || stripos($subKey, 'sales') !== false || stripos($subKey, 'value') !== false) ? ' MAD' : $suffix;
                            $prompt .= "- $subLabel : $subValue$suffix\n";
                        }
                    }
                }
            } else {
                $prompt .= "\nAucune donnée spécifique fournie.\n";
            }

            // Add instructions for interpretation
            $prompt .= "
            Fournissez une interprétation concise (250-300 mots) de ces données dans le cadre d'une analyse de ROI pour un programme médical. Votre réponse doit inclure :             
                1. Une analyse complete du resultat 
                2. Une évaluation claire de la performance globale (indiquant si le programme est performant ou nécessite des améliorations, selon les données fournies).
                3. Des recommandations précises, concrètes et chiffrées visant à optimiser les résultats. Par exemple, proposez des objectifs mesurables pour améliorer les indicateurs clés (coûts, volumes, taux de conversion, ventes, etc.) en précisant des seuils ou des réductions à viser, basés sur les données analysées. Soyez spécifique et opérationnel dans chaque conseil donné, en proposant des actions directement exploitables.
                4. Une conclusion motivante pour encourager l’optimisation continue des activités.
            Si certaines données importantes manquent, faites des hypothèses raisonnables et basées sur les informations disponibles. Utilisez un ton professionnel, accessible et clair, en français.
        ";



            // Initialize Open AI client
            $client = OpenAI::client(env('OPENAI_API_KEY'));

            // Make API call
            $response = $client->chat()->create([
                'model' => 'gpt-3.5-turbo',
                'messages' => [
                    ['role' => 'system', 'content' => 'Vous êtes un consultant expert en ROI.'],
                    ['role' => 'user', 'content' => $prompt],
                ],
                'max_tokens' => 250,
                'temperature' => 0.7,
            ]);

            return response()->json([
                'interpretation' => $response->choices[0]->message->content,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la génération de l\'interprétation.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
