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
                Fournissez une interprétation concise (150-200 mots) de ces données dans le contexte d'une analyse de ROI pour un programme médical. Incluez :
                1. Une remarque sur la performance globale (succès ou besoin d'amélioration, basé sur les données disponibles, en supposant un ROI ou des ventes élevées comme indicateur positif).
                2. Des conseils spécifiques pour améliorer les résultats, en tenant compte des données fournies (par exemple, augmenter les métriques positives, réduire les coûts).
                3. Une conclusion encourageante ou motivante pour optimiser les futures activités.

                Répondez en français et utilisez un ton professionnel mais accessible. Si des données clés (comme le ROI) sont absentes, faites une analyse générale basée sur les informations disponibles.
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
