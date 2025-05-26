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
    //Activite 1


    //Activite Costum 
    public function insertCustomActivity(Request $request)
    {
        try {
            $laboId = JWTHelper::getLaboId($request);
            if (!$laboId) {
                return response()->json(['message' => 'Token invalide'], 401);
            }

            $validated = $request->validate([
                'activityName' => 'required|string|max:255',
                'year' => 'required|string',
                'roi' => 'required|numeric|min:0',
            ]);

            // 1. Créer d'abord une activité personnalisée dans ActivitiesList
            $newActivity = ActivitiesList::create([
                'Name' => $validated['activityName'],
                'is_custom' => true
            ]);

            // Récupérer l'ID de l'activité nouvellement créée
            $activityId = $newActivity->id;

            // 2. Créer un élément ROI dans ActivityItem
            $roiItem = ActivityItem::create([
                'Name' => 'ROI',
                'ActivityId' => $activityId
            ]);

            // 3. Créer l'entrée dans ActivityByLabo
            $activityByLabo = ActivityByLabo::create([
                'ActivityId' => $activityId,
                'laboId' => $laboId,
                'year' => $validated['year'],
                // 'is_calculated' => true
            ]);

            // 4. Insérer la valeur du ROI
            ActivityItemValue::create([
                'activityItemId' => $roiItem->id,
                'ActivityByLaboId' => $activityByLabo->id,
                'value' => $validated['roi']
            ]);

            return response()->json([
                'message' => 'Activité personnalisée créée avec succès.',
                'activityId' => $activityId,
                'roiItemId' => $roiItem->id,
                'roi' => $validated['roi']
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur côté serveur.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function insertCustomActivity1(Request $request)
    {
        try {
            $laboId = JWTHelper::getLaboId($request);
            if (!$laboId) {
                return response()->json(['message' => 'Token invalide'], 401);
            }

            // Validate the request
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'year' => 'required|integer',
                'items' => 'required|array|min:1',
                'items.*.name' => 'required|string',
                'items.*.value' => 'required|numeric',
                'items.*.type' => 'required|in:number,percentage',
                'calculatedItems' => 'required|array|min:1',
                'calculatedItems.*.name' => 'required|string',
                'calculatedItems.*.value' => 'required|numeric',
            ]);

            $activityNameLower = strtolower($validated['name']);

            // Check if the activity already exists
            $existingActivity = ActivitiesList::whereRaw('LOWER(Name) = ?', [$activityNameLower])
                ->where('is_custom', true)
                ->first();

            if ($existingActivity) {
                // Check if the activity exists for the given lab and year
                $existingByLabo = ActivityByLabo::where('ActivityId', $existingActivity->id)
                    ->where('laboId', $laboId)
                    ->where('year', $validated['year'])
                    ->first();

                if ($existingByLabo) {
                    return response()->json([
                        'message' => 'Cette activité personnalisée existe déjà pour cette année.'
                    ], 409);
                }

                // Create a new ActivityByLabo entry for the existing activity
                $activityByLabo = ActivityByLabo::create([
                    'ActivityId' => $existingActivity->id,
                    'laboId' => $laboId,
                    'year' => $validated['year'],
                ]);

                // Get existing activity items
                $baseItems = ActivityItem::where('ActivityId', $existingActivity->id)->get();

                // Prepare values for insertion
                $baseValues = [];
                foreach ($validated['items'] as $item) {
                    $matchingItem = $baseItems->firstWhere('Name', $item['name']);
                    if ($matchingItem) {
                        $value = ($item['type'] === 'percentage') ? $item['value'] / 100 : $item['value'];
                        $baseValues[] = [
                            'activityItemId' => $matchingItem->id,
                            'ActivityByLaboId' => $activityByLabo->id,
                            'value' => $value,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }
                }

                // Handle ROI from calculatedItems
                $roiItemData = collect($validated['calculatedItems'])->firstWhere('name', 'ROI');
                if ($roiItemData) {
                    $roiItem = $baseItems->firstWhere('Name', 'ROI');
                    if ($roiItem) {
                        $baseValues[] = [
                            'activityItemId' => $roiItem->id,
                            'ActivityByLaboId' => $activityByLabo->id,
                            'value' => $roiItemData['value'],
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    } else {
                        // Create ROI item if it doesn't exist
                        $roiItem = ActivityItem::create([
                            'ActivityId' => $existingActivity->id,
                            'Name' => 'ROI',
                            'Type' => 'calculated',
                            'is_custom' => true,
                            'calculation_expression' => null,
                        ]);
                        $baseValues[] = [
                            'activityItemId' => $roiItem->id,
                            'ActivityByLaboId' => $activityByLabo->id,
                            'value' => $roiItemData['value'],
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }
                }

                // Insert values into activityitemvalues
                ActivityItemValue::insert($baseValues);

                return response()->json([
                    'message' => 'Activité existante, mais ajoutée pour une nouvelle année.',
                    'activityId' => $activityByLabo->id,
                    'activityName' => $validated['name'],
                    'year' => $validated['year'],
                    'ROI' => $roiItemData['value'] ?? null,
                ], 201);
            }

            // Create a new custom activity
            $customActivity = ActivitiesList::create([
                'Name' => $validated['name'],
                'is_custom' => true,
                'created_by' => $laboId,
            ]);

            // Create base items
            $baseItems = [];
            foreach ($validated['items'] as $item) {
                $baseItems[] = ActivityItem::create([
                    'ActivityId' => $customActivity->id,
                    'Name' => $item['name'],
                    'Type' => $item['type'],
                    'is_custom' => true,
                ]);
            }

            // Always create an ROI item
            $roiItemData = collect($validated['calculatedItems'])->firstWhere('name', 'ROI');
            $roiItem = ActivityItem::create([
                'ActivityId' => $customActivity->id,
                'Name' => 'ROI',
                'Type' => 'calculated',
                'is_custom' => true,
                'calculation_expression' => null,
            ]);

            // Create ActivityByLabo entry
            $activityByLabo = ActivityByLabo::create([
                'ActivityId' => $customActivity->id,
                'laboId' => $laboId,
                'year' => $validated['year'],
            ]);

            // Prepare values for insertion
            $baseValues = [];
            foreach ($validated['items'] as $index => $item) {
                $value = ($item['type'] === 'percentage') ? $item['value'] / 100 : $item['value'];
                $baseValues[] = [
                    'activityItemId' => $baseItems[$index]->id,
                    'ActivityByLaboId' => $activityByLabo->id,
                    'value' => $value,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            // Add ROI value
            if ($roiItemData && isset($roiItemData['value'])) {
                $baseValues[] = [
                    'activityItemId' => $roiItem->id,
                    'ActivityByLaboId' => $activityByLabo->id,
                    'value' => $roiItemData['value'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            } else {
                // Default ROI value if not provided
                $baseValues[] = [
                    'activityItemId' => $roiItem->id,
                    'ActivityByLaboId' => $activityByLabo->id,
                    'value' => 0, // Default value
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            // Insert values into activityitemvalues
            ActivityItemValue::insert($baseValues);

            return response()->json([
                'message' => 'Activité personnalisée créée avec succès',
                'activityId' => $activityByLabo->id,
                'ROI' => $roiItemData['value'] ?? 0,
                'activityName' => $validated['name'],
                'year' => $validated['year'],
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la création de l\'activité personnalisée',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function calculateROIAct_Costum(Request $request)
    {
        try {
            // Retrieve the activity ID from the cookie
            $activityByLaboId = $request->cookie('activityId');

            if (!$activityByLaboId) {
                return response()->json(['message' => 'ID d\'activité non trouvé'], 400);
            }

            // Fetch the activity by labo
            $activityByLabo = ActivityByLabo::find($activityByLaboId);
            if (!$activityByLabo) {
                return response()->json(['message' => 'Activité non trouvée'], 404);
            }

            // Verify that the activity is custom
            $activity = ActivitiesList::find($activityByLabo->ActivityId);
            if (!$activity || !$activity->is_custom) {
                return response()->json(['message' => 'Cette activité n\'est pas une activité personnalisée'], 400);
            }

            // Fetch all items for the activity
            $items = ActivityItem::where('ActivityId', $activity->id)
                ->get();

            if ($items->isEmpty()) {
                return response()->json(['message' => 'Aucun élément trouvé pour cette activité'], 404);
            }

            // Fetch values for all items
            $itemValues = ActivityItemValue::where('ActivityByLaboId', $activityByLaboId)
                ->whereIn('activityItemId', $items->pluck('id'))
                ->get()
                ->keyBy('activityItemId');

            // Build a flat object with item names as keys and values as values
            $data = [];
            foreach ($items as $item) {
                $value = isset($itemValues[$item->id]) ? $itemValues[$item->id]->value : null;
                if ($value !== null) {
                    $data[$item->Name] = $value;
                }
            }

            // Ensure ROI is included, even if null
            if (!isset($data['ROI'])) {
                return response()->json(['message' => 'Élément ROI non trouvé pour cette activité'], 404);
            }

            // Return the response as a flat object
            return response()->json($data, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors du calcul du ROI pour l\'activité personnalisée.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }



    
    //Insertion de toutes le activities (Dynamique) 
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





}
