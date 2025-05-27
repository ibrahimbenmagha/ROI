<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Helpers\JwtHelper; // Adjust the namespace as needed
use Mossadal\MathParser\MathParser;

use App\Models\CalculationFormulat;
use App\Models\ActivityItemValue;
use App\Models\ActivityByLabo;
use App\Models\ActivitiesList;
use App\Models\ActivityItem;
use App\Models\User;
use App\Models\Labo;

class Activity1_12 extends Controller
{

    //Insertion d'une activite costume (Roi manuellement definie)
    public function insertCustomActivity(Request $request)
    {
        try {
            // Validate input
            $validated = $request->validate([
                'activityName' => 'required|string|max:255',
                'year' => 'required|integer|min:1900|max:9999',
                'roi' => 'required|numeric|min:0',
            ]);

            // Get laboId from JWT
            $laboId = JWTHelper::getLaboId($request) ?? $request->input('laboId');
            if (!$laboId) {
                return response()->json(['message' => 'Token invalide'], 401);
            }

            // Check if activity exists
            $activity = ActivitiesList::where('Name', $validated['activityName'])->first();

            if (!$activity) {
                // Create new activity with is_custom = true
                $activity = ActivitiesList::create([
                    'Name' => $validated['activityName'],
                    'is_custom' => true,
                ]);

                // Create default Roi item
                $roiItem = ActivityItem::create([
                    'ActivityId' => $activity->id,
                    'Name' => 'Roi',
                    'symbole' => 'ROI',
                    'Type' => 'number',
                ]);

                // Create a simple formula for the activity
                $formula = CalculationFormulat::create([
                    'ActivityId' => $activity->id,
                    'formulat' => json_encode(['roi' => 'ROI'], JSON_UNESCAPED_UNICODE),
                ]);
            }

            // Create entry in activitybylabo
            $activityByLabo = ActivityByLabo::create([
                'ActivityId' => $activity->id,
                'laboId' => $laboId,
                'year' => $validated['year'],
            ]);

            // Find the Roi item for the activity
            $roiItem = ActivityItem::where('ActivityId', $activity->id)
                ->where('Name', 'Roi')
                ->first();

            if ($roiItem) {
                // Insert ROI value
                ActivityItemValue::create([
                    'activityItemId' => $roiItem->id,
                    'ActivityByLaboId' => $activityByLabo->id,
                    'value' => $validated['roi'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } else {
                // This should not happen if activity creation includes Roi item
                return response()->json([
                    'message' => 'Erreur : Item ROI non trouvé pour cette activité',
                ], 500);
            }

            return response()->json([
                'message' => 'Activité personnalisée créée avec succès',
                'activity' => [
                    'id' => $activity->id,
                    'name' => $activity->Name,
                    'year' => $activityByLabo->year,
                    'roi' => $validated['roi'],
                ],
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la création de l\'activité',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    //Insertuion de toutes le activities (Dynamique) 
    public function insertActivityData(Request $request)
    {
        try {
            // Récupération de l'ID du labo depuis le token JWT
            $laboId = JWTHelper::getLaboId($request) ?? $request->input('laboId');
            if (!$laboId) {
                return response()->json(['message' => 'Token invalide'], 401);
            }

            // Récupération de l'ID de l'activité depuis le cookie
            $activityId = $request->cookie('activityNumber') ?? $request->input('activitynumber');
            if (!$activityId) {
                return response()->json(['message' => 'Activité non spécifiée'], 400);
            }

            // Récupération de la formule de calcul
            $formula = CalculationFormulat::where('ActivityId', $activityId)->first();
            if (!$formula) {
                return response()->json(['message' => 'Formule de calcul non trouvée pour cette activité'], 404);
            }

            // Récupération des items de l'activité
            $activityItems = ActivityItem::where('ActivityId', $activityId)
                ->where('Name', '!=', 'Roi') // Note: 'ROI' is 'Roi' in activityitems
                ->get();

            // Validation des données
            $validationRules = ['year' => 'required|integer'];
            $itemIds = [];

            foreach ($activityItems as $item) {
                $rule = 'required|numeric|min:0';
                if ($item->Type === 'percentage') {
                    $rule .= '|max:100';
                } elseif ($item->symbole === 'E' && $item->ActivityId == 1) {
                    $rule .= '|min:0.1'; // Specific validation for 'E' in Activity ID 1
                }
                $validationRules[$item->symbole] = $rule;
                $validationRules['id_' . $item->symbole] = 'required|integer';
                $itemIds[$item->symbole] = $item->id;
            }

            // Validation pour l'item ROI
            $roiItem = ActivityItem::where('ActivityId', $activityId)
                ->where('Name', 'Roi')
                ->first();
            if ($roiItem && $request->has('id_ROI')) {
                $validationRules['id_ROI'] = 'required|integer';
            }

            $validated = $request->validate($validationRules);

            // Création de l'entrée ActivityByLabo
            $activityByLabo = ActivityByLabo::create([
                'ActivityId' => $activityId,
                'laboId' => $laboId,
                'year' => $validated['year'],
            ]);

            // Préparation des valeurs à insérer et des valeurs pour calcul
            $values = [];
            $calculatedValues = [];

            // Stocker les valeurs originales et préparer les valeurs pour calcul
            foreach ($activityItems as $item) {
                $originalValue = $validated[$item->symbole];
                $calcValue = $originalValue;

                // Convertir les pourcentages en décimal pour les calculs uniquement
                if ($item->Type === 'percentage') {
                    $calcValue = $originalValue / 100;
                }

                $calculatedValues[$item->symbole] = $calcValue;
                $values[] = [
                    'activityItemId' => $validated['id_' . $item->symbole],
                    'ActivityByLaboId' => $activityByLabo->id,
                    'value' => $originalValue, // Stocker la valeur originale
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            // Décodage de la formule JSON
            $formulaSteps = json_decode($formula->formulat, true);
            $results = [];
            $intermediateResults = [];

            // Exécution des calculs étape par étape
            foreach ($formulaSteps as $key => $expression) {
                if ($key === 'roi') continue; // Traiter le ROI à part

                try {
                    $expressionToEval = $expression;

                    // Remplacer les variables des items
                    foreach ($calculatedValues as $var => $val) {
                        $expressionToEval = str_replace($var, $val, $expressionToEval);
                    }

                    // Remplacer les résultats intermédiaires
                    foreach ($intermediateResults as $resultKey => $resultValue) {
                        $expressionToEval = str_replace($resultKey, $resultValue, $expressionToEval);
                    }

                    // Vérifier les variables non résolues
                    if (preg_match('/\b[a-zA-Z_]+\b/', $expressionToEval, $matches)) {
                        $results[$key] = "Erreur : variable non définie '$matches[0]'";
                        continue;
                    }

                    // Calculer l'expression
                    $result = eval("return $expressionToEval;");
                    if (is_infinite($result) || is_nan($result)) {
                        $results[$key] = 'Erreur : résultat invalide (division par zéro ou NaN)';
                        continue;
                    }

                    $results[$key] = $result;
                    $intermediateResults[$key] = $result;
                } catch (\Exception $e) {
                    $results[$key] = 'Erreur de calcul : ' . $e->getMessage();
                }
            }

            // Calcul final du ROI
            if (isset($formulaSteps['roi'])) {
                try {
                    $roiExpression = $formulaSteps['roi'];
                    foreach ($calculatedValues as $var => $val) {
                        $roiExpression = str_replace($var, $val, $roiExpression);
                    }
                    foreach ($intermediateResults as $resultKey => $resultValue) {
                        $roiExpression = str_replace($resultKey, $resultValue, $roiExpression);
                    }

                    if (preg_match('/\b[a-zA-Z_]+\b/', $roiExpression, $matches)) {
                        $results['ROI'] = "Erreur : variable non définie '$matches[0]'";
                    } else {
                        $roi = eval("return $roiExpression;");
                        if (is_infinite($roi) || is_nan($roi)) {
                            $results['ROI'] = 'Erreur : résultat invalide (division par zéro ou NaN)';
                        } else {
                            $results['ROI'] = $roi;

                            // Ajout du ROI aux valeurs à insérer
                            if ($roiItem) {
                                $values[] = [
                                    'activityItemId' => $roiItem->id,
                                    'ActivityByLaboId' => $activityByLabo->id,
                                    'value' => $roi,
                                    'created_at' => now(),
                                    'updated_at' => now(),
                                ];
                            }
                        }
                    }
                } catch (\Exception $e) {
                    $results['ROI'] = 'Erreur de calcul : ' . $e->getMessage();
                }
            }

            // Insertion des valeurs en base
            ActivityItemValue::insert($values);

            return response()->json([
                'message' => 'Activité créée et calculée avec succès',
                'results' => $results,
                'ROI' => $results['ROI'] ?? null,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors du traitement',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    //Calcule de toutes le activities (Dynamique) 
    public function calculateRoi(Request $request)
    {
        try {
            // Récupération de l'ID de l'activité
            $activityId = $request->cookie('activityNumber') ??  $request->input('activityId');
            if (!$activityId) {
                return response()->json(['message' => 'Activité non spécifiée'], 400);
            }

            // Récupération de la formule de calcul
            $formula = CalculationFormulat::where('ActivityId', $activityId)->first();
            if (!$formula) {
                return response()->json(['message' => 'Formule de calcul non trouvée'], 404);
            }

            // Récupération des items de l'activité (sauf ROI)
            $activityItems = ActivityItem::where('ActivityId', $activityId)
                ->where('Name', '!=', 'ROI')
                ->get();

            // Validation des données
            $validationRules = ['year' => 'required|integer'];
            $itemIds = [];

            foreach ($activityItems as $item) {
                $rule = 'required|numeric|min:0';
                if ($item->Type === 'percentage') {
                    $rule .= '|max:100';
                }
                $validationRules[$item->symbole] = $rule;
                $validationRules['id_' . $item->symbole] = 'required|integer';
                $itemIds[$item->symbole] = $item->id;
            }

            $validated = $request->validate($validationRules);

            // Décodage de la formule JSON
            $formulaSteps = json_decode($formula->formulat, true);
            $calculatedValues = [];
            $results = [];

            // Conversion des pourcentages et stockage des valeurs
            foreach ($activityItems as $item) {
                $value = $validated[$item->symbole];
                if ($item->Type === 'percentage') {
                    $value = $value / 100;
                }
                $calculatedValues[$item->symbole] = $value;
            }

            // Exécution des calculs étape par étape
            foreach ($formulaSteps as $key => $expression) {
                if ($key === 'roi') continue; // On traitera le ROI à part

                // Remplacement des variables dans l'expression
                $expressionToEval = $expression;
                foreach ($calculatedValues as $var => $val) {
                    $expressionToEval = str_replace($var, $val, $expressionToEval);
                }

                // Calcul de l'expression
                $result = eval("return $expressionToEval;");
                $calculatedValues[$key] = $result;
                $results[$key] = $result;
            }

            // Calcul final du ROI
            $roi = null;
            if (isset($formulaSteps['roi'])) {
                $roiExpression = $formulaSteps['roi'];
                foreach ($calculatedValues as $var => $val) {
                    $roiExpression = str_replace($var, $val, $roiExpression);
                }
                $roi = eval("return $roiExpression;");
                $results['ROI'] = $roi;
            }

            return response()->json([
                'message' => 'Calcul du ROI effectué avec succès',
                'formulas' => $formulaSteps,
                'results' => $results,
                'ROI' => $roi
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors du calcul du ROI',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    //Modification de toutes kes activites (Dynamique)
    public function updateActivityByLaboData(Request $request)
    {
        try {
            // Validate input
            $validated = $request->validate([
                'year' => 'required|integer|min:1900|max:9999',
                'items' => 'required|array|min:1',
                'items.*.activityItemId' => 'required|integer|exists:activityitems,id',
                'items.*.value' => 'required|numeric|min:0',
            ]);

            // Get laboId from JWT
            $laboId = JWTHelper::getLaboId($request) ?? $request->input('laboId');
            if (!$laboId) {
                return response()->json(['error' => 'Token invalide'], 401);
            }

            $activityByLaboId = $request->cookie('activityId');
            // Find the activityByLabo record
            $activityByLabo = ActivityByLabo::where('id', $activityByLaboId)
                ->where('laboId', $laboId)
                ->first();

            if (!$activityByLabo) {
                return response()->json(['error' => 'Activité non trouvée ou accès non autorisé'], 404);
            }

            // Update year in activitybylabo
            $activityByLabo->update([
                'year' => $validated['year'],
                'updated_at' => now(),
            ]);

            // Update or create item values
            foreach ($validated['items'] as $item) {
                $activityItem = ActivityItem::where('id', $item['activityItemId'])
                    ->where('ActivityId', $activityByLabo->ActivityId)
                    ->first();

                if (!$activityItem) {
                    return response()->json([
                        'error' => "Item {$item['activityItemId']} non trouvé pour cette activité",
                    ], 404);
                }

                // Adjust value for percentage type if necessary
                $value = $item['value'];
                if ($activityItem->Type === 'percentage' && $value > 1) {
                    $value = $value / 100; // Convert percentage to decimal for storage
                }

                ActivityItemValue::updateOrCreate(
                    [
                        'activityItemId' => $item['activityItemId'],
                        'ActivityByLaboId' => $activityByLaboId,
                    ],
                    [
                        'value' => $value,
                        'updated_at' => now(),
                        'created_at' => now(), // Ensure created_at is set for new records
                    ]
                );
            }

            // Recalculate results based on updated values
            $itemValues = ActivityItemValue::where('ActivityByLaboId', $activityByLaboId)
                ->with('activityItem')
                ->get()
                ->mapWithKeys(function ($itemValue) {
                    $value = $itemValue->value;
                    if ($itemValue->activityItem->Type === 'percentage' && $value > 1) {
                        $value = $itemValue->value / 100;
                    }
                    return [$itemValue->activityItem->symbole ?? 'item_' . $itemValue->activityItem->id => $value];
                })->toArray();

            $formula = CalculationFormulat::where('ActivityId', $activityByLabo->ActivityId)->first();
            $calculatedResults = [];

            if ($formula) {
                $formulaData = json_decode($formula->formulat, true);
                $intermediateResults = [];

                foreach ($formulaData as $key => $expression) {
                    try {
                        $parsedExpression = $expression;

                        // Replace item symbols
                        foreach ($itemValues as $symbol => $value) {
                            if ($symbol) {
                                $parsedExpression = str_replace($symbol, $value, $parsedExpression);
                            }
                        }

                        // Replace intermediate results
                        foreach ($intermediateResults as $resultKey => $resultValue) {
                            $parsedExpression = str_replace($resultKey, $resultValue, $parsedExpression);
                        }

                        // Check for unresolved variables
                        if (preg_match('/\b[a-zA-Z_]+\b/', $parsedExpression, $matches)) {
                            $calculatedResults[$key] = "Erreur : variable non définie '$matches[0]'";
                            continue;
                        }

                        // Evaluate expression
                        $result = eval("return $parsedExpression;");

                        // Check for invalid results
                        if (is_infinite($result) || is_nan($result)) {
                            $calculatedResults[$key] = 'Erreur : résultat invalide (division par zéro ou NaN)';
                            continue;
                        }

                        // Convert ROI to percentage
                        if ($key === 'roi') {
                            $result *= 100; // Convert to percentage
                        }

                        $calculatedResults[$key] = $result;
                        $intermediateResults[$key] = $result;
                    } catch (\Exception $e) {
                        $calculatedResults[$key] = 'Erreur de calcul : ' . $e->getMessage();
                    }
                }
            } else {
                $calculatedResults['error'] = 'Aucune formule définie pour cette activité';
            }

            // Prepare response
            $response = [
                'activityByLabo' => [
                    'id' => $activityByLabo->id,
                    'labo' => $activityByLabo->labo->Name,
                    'activity' => $activityByLabo->activity->Name,
                    'year' => $activityByLabo->year,
                ],
                'items' => ActivityItem::where('ActivityId', $activityByLabo->ActivityId)
                    ->get()
                    ->map(function ($item) use ($itemValues) {
                        return [
                            'id' => $item->id,
                            'name' => $item->Name,
                            'symbole' => $item->symbole,
                            'type' => $item->Type,
                            'value' => $itemValues[$item->symbole ?? 'item_' . $item->id] ?? null,
                        ];
                    })->values()->toArray(),
                'calculated_results' => $calculatedResults,
            ];

            return response()->json([
                'message' => 'Données modifiées avec succès',
                'data' => $response,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la modification des données',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
