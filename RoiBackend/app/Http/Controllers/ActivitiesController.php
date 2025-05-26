<?php

namespace App\Http\Controllers;

use App\Models\CalculationFormulat;
use Illuminate\Http\Request;
use App\Helpers\JwtHelper;

use App\Models\ActivitiesList;
use App\Models\ActivityByLabo;
use App\Models\Labo;
use App\Models\ActivityItemValue;
use App\Models\ActivityItem;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Activity1_12;
use Illuminate\Contracts\Validation\Validator;

class  ActivitiesController extends Controller
{



    public function getAllActivity()
    {
        $Activities = ActivitiesList::all();
        return response()->json($Activities);
    }


    public function getAllActivityNotCustum()
    {
        // $Activities = ActivitiesList::where("is_custom","=",false);
        $activities = ActivitiesList::where('is_custom', false)->get();
        return response()->json($activities);
    }


    public function getActivityById($id)
    {
        $Activity = ActivitiesList::find($id);

        if (!$Activity) {
            return response()->json([
                'message' => 'Activity not found'
            ], 404);
        }

        return response()->json([
            'Activity' => $Activity
        ], 200);
    }


    public function getActivityByName(Request $request, $ActivityName)
    {
        $ActivityName = $request->Name;
        $Activity = ActivitiesList::where('Name', $ActivityName)->get();
        if (!$Activity) {
            return response()->json(['message' => 'Activity not found'], 404);
        } else {
            return response()->json(['activity' => $Activity], 200);
        }
    }


    public function getAllActivitiesByLabo()
    {
        $ActivityByLabo = ActivityByLabo::all();
        return response()->json($ActivityByLabo);
    }


    public function getAllActivitiesByLaboInfos()
    {
        $ActivitiesByLaboInfos = ActivityByLabo::join('activitieslist', 'activitybylabo.ActivityId', '=', 'activitieslist.id')
            ->join('labo', 'activitybylabo.laboId', '=', 'labo.id')
            ->join('users', 'labo.userId', '=', 'users.id')
            ->select(
                'activitieslist.id',
                'activitieslist.Name',
                'activitybylabo.id',
                'activitybylabo.laboId',
                'activitybylabo.ActivityId',
                'activitybylabo.year',
                'labo.Name as LaboName',
                'users.FirstName',
                'users.LastName'
            )->get();
        if (!$ActivitiesByLaboInfos) {
            return response()->json(['message' => 'No Activity Created By labo yet'], 401);
        }
        return response()->json($ActivitiesByLaboInfos, 200);
    }


    public function getActivitiesByLaboInfosById(Request $request, $id)
    {
        $id = $request['id'];
        $ActivitiesByLaboInfos = ActivityByLabo::where('activitybylabo.id', $id)
            ->join('activitieslist', 'activitybylabo.ActivityId', '=', 'activitieslist.id')
            ->join('labo', 'activitybylabo.laboId', '=', 'labo.id')
            ->join('users', 'labo.userId', '=', 'users.id')
            ->select(
                'activitieslist.id',
                'activitieslist.Name',
                'activitybylabo.id',
                'activitybylabo.laboId',
                'activitybylabo.ActivityId',
                'activitybylabo.year',
                'labo.Name as LaboName',
                'users.FirstName',
                'users.LastName'
            )->get();
        if ($ActivitiesByLaboInfos->isEmpty()) {
            return response()->json(['message' => 'No Activity Created By labo yet'], 401);
        }
        return response()->json($ActivitiesByLaboInfos, 200);
    }


    public function getAllActivityByLaboInfosByLaboId(Request $request)
    {
        $laboId = JWTHelper::getLaboId($request);
        if (!$laboId) {
            return response()->json([
                'message' => 'Information du laboratoire non trouvée dans le token.'
            ], 401);
        }

        $Activities = ActivityByLabo::where('laboId', $laboId)
            // ->where('is_calculated', false)
            ->join('activitieslist', 'activitybylabo.ActivityId', '=', 'activitieslist.id')
            ->join('labo', 'activitybylabo.laboId', '=', 'labo.id')
            ->join('users', 'labo.userId', '=', 'users.id')
            ->select(
                'activitieslist.id',
                'activitieslist.Name',
                'activitybylabo.id',
                'activitybylabo.laboId',
                'activitybylabo.ActivityId',
                'activitybylabo.year',
                'labo.Name as LaboName',
                'users.FirstName',
                'users.LastName'
            )->orderBy('activitieslist.id')
            ->get();


        if ($Activities->isNotEmpty()) {
            return response()->json($Activities, 200);
        } else {
            return response()->json(['message' => 'No activities found for the given labo'], 404);
        }
    }


    public function getAllCalculatedActivityByLaboInfosByLaboId(Request $request)
    {
        $laboId = JWTHelper::getLaboId($request) ?? $request->cookie('laboId') ?? $request["laboId"];
        if (!$laboId) {
            return response()->json([
                'message' => 'Information du laboratoire non trouvée dans le token.'
            ], 401);
        }

        $Activities = ActivityByLabo::where('activitybylabo.laboId', $laboId)
            // ->where('activitybylabo.is_calculated', true)
            ->join('activitieslist', 'activitybylabo.ActivityId', '=', 'activitieslist.id')
            ->join('labo', 'activitybylabo.laboId', '=', 'labo.id')
            ->join('activityitems', function ($join) {
                $join->on('activitieslist.id', '=', 'activityitems.ActivityId')
                    ->where('activityitems.Name', '=', 'Roi'); // ✅ Filtrer ici
            })
            ->join('activityitemvalues', 'activitybylabo.id', '=', 'activityitemvalues.ActivityByLaboId')
            ->whereColumn('activityitems.id', 'activityitemvalues.ActivityItemId') // ✅ S'assurer qu'on lie les bons champs
            ->select(
                'activitybylabo.id',
                'activitybylabo.year',
                'activitieslist.Name as actName',           // ✅ Pour le frontend
                DB::raw("CONCAT('Roi: ', activityitemvalues.value) as details") // ✅ Seulement pour Roi
            )
            ->orderBy('activitieslist.id')
            ->get();

        if ($Activities->isNotEmpty()) {
            return response()->json($Activities, 200);
        } else {
            return response()->json(['message' => 'Aucune activité trouvée'], 204);
        }
    }


    public function calculateDynamicROI(Request $request)
    {
        try {
            // Récupère l'identifiant de l'activité depuis le cookie ou la requête
            $activityByLaboId = $request->cookie('activityNumber') ?? $request->input('activityNumber');

            if (!$activityByLaboId) {
                return response()->json(['message' => 'Activity ID is missing.'], 400);
            }

            // Cherche l'activité en base
            $activity = ActivityByLabo::find($activityByLaboId);
            if (!$activity) {
                return response()->json(['message' => 'Activity not found.'], 404);
            }

            // Récupère l'ID de l'activité
            $activityId = $activity->ActivityId;

            // Si l'activité dépasse 12, on utilise une méthode personnalisée
            if ($activityId > 12) {
                $activityId = "Costum";
            }

            $method = "calculateROIAct_" . $activityId;
            $controller = new Activity1_12();

            // Vérifie si la méthode existe
            if (!method_exists($controller, $method)) {
                return response()->json([
                    'message' => "No calculation method defined for activity ID $activityId ($method)."
                ], 500);
            }

            // Appelle dynamiquement la méthode correspondante
            return $controller->$method($request);
        } catch (\Exception $e) {
            return response()->json([
                'message'    => 'Erreur interne lors du calcul du ROI',
                'error'      => $e->getMessage(),
                'activityId' => $activityId ?? null, // éviter l'erreur si non défini
            ], 500);
        }
    }


    public function getAllActivityByLaboName(Request $request, $Name)
    {
        $LaboId = Labo::where('Name', $Name)->select('id')->get();
        $Activities = ActivityByLabo::where('laboId', $LaboId)
            ->select('id', 'laboId')
            ->get();
        if ($Activities->isNotEmpty()) {
            return response()->json(['Activities' => $Activities], 200);
        } else {
            return response()->json(['message' => 'No activities found for the given labo'], 404);
        }
    }

    public function getActivityRepport()
    {
        // Récupérer toutes les données nécessaires
        $AllInfos = ActivityByLabo::join("labo", "ActivityByLabo.laboId", "=", "labo.id")
            ->join("users", "labo.userId", "=", "users.id")
            ->join("activityItemValues", "ActivityByLabo.id", "=", "activityItemValues.ActivityByLaboId")
            ->join("activityItems", "activityItemValues.activityItemId", "=", "activityItems.id")
            ->join("activitieslist", "ActivityByLabo.ActivityId", "=", "activitieslist.id")
            ->select(
                "labo.id as LaboId",
                "labo.Name as LaboName",
                "users.FirstName as FirstName",
                "users.LastName as LastName",
                "activitieslist.name as ActivityName",
                "activityItems.name as ItemName",
                "activityItemValues.value as ItemValue",
                "ActivityByLabo.year"
            )
            ->get();

        if ($AllInfos->isEmpty()) {
            return response()->json(['message' => 'No records found for this activity'], 404);
        }

        // Transformer les résultats dans le format souhaité
        $formattedData = [];

        foreach ($AllInfos as $info) {
            $laboKey = $info->LaboName; // Clé pour le labo

            if (!isset($formattedData[$laboKey])) {
                $formattedData[$laboKey] = [];
            }

            $activityKey = $info->ActivityName;

            // Vérifier si l'activité existe pour ce labo
            $existingIndex = null;
            foreach ($formattedData[$laboKey] as $index => $entry) {
                if ($entry['Activity name'] === $activityKey) {
                    $existingIndex = $index;
                    break;
                }
            }

            if ($existingIndex === null) {
                // Ajouter une nouvelle activité
                $formattedData[$laboKey][] = [
                    "Labo name" => $info->LaboName,
                    "First name" => $info->FirstName,
                    "Last name" => $info->LastName,
                    "year" => $info->year,
                    "Activity name" => $activityKey,
                    "Items" => []
                ];
                $existingIndex = count($formattedData[$laboKey]) - 1;
            }

            // Ajouter l'item à l'activité
            $formattedData[$laboKey][$existingIndex]["Items"][] = [
                "Item name" => $info->ItemName,
                "Item Value" => $info->ItemValue
            ];
        }

        return response()->json(['data' => $formattedData], 200);
    }

    public function getActivityRepportBYActivityId(Request $request, $activityListId)
    {
        if (!$activityListId) {
            return response()->json(['error' => 'activityListId is required'], 400);
        }

        // Récupérer toutes les données nécessaires
        $AllInfos = ActivityByLabo::join("labo", "ActivityByLabo.laboId", "=", "labo.id")
            ->join("users", "labo.userId", "=", "users.id")
            ->join("activityItemValues", "ActivityByLabo.id", "=", "activityItemValues.ActivityByLaboId")
            ->join("activityItems", "activityItemValues.activityItemId", "=", "activityItems.id")
            ->join("activitieslist", "ActivityByLabo.ActivityId", "=", "activitieslist.id")
            ->where("ActivityByLabo.ActivityId", $activityListId)
            ->select(
                "labo.id as LaboId",
                "labo.Name as LaboName",
                "users.FirstName as FirstName",
                "users.LastName as LastName",
                "activitieslist.name as ActivityName",
                "activityItems.name as ItemName",
                "activityItemValues.value as ItemValue",
                "ActivityByLabo.year"
            )
            ->get();

        if ($AllInfos->isEmpty()) {
            return response()->json(['message' => 'No records found for this activity'], 404);
        }

        // Transformer les résultats dans le format souhaité
        $formattedData = [];

        foreach ($AllInfos as $info) {
            $laboKey = $info->LaboName; // Clé pour le labo

            if (!isset($formattedData[$laboKey])) {
                $formattedData[$laboKey] = [];
            }

            $activityKey = $info->ActivityName;

            // Vérifier si l'activité existe pour ce labo
            $existingIndex = null;
            foreach ($formattedData[$laboKey] as $index => $entry) {
                if ($entry['Activity name'] === $activityKey) {
                    $existingIndex = $index;
                    break;
                }
            }

            if ($existingIndex === null) {
                // Ajouter une nouvelle activité
                $formattedData[$laboKey][] = [
                    "Labo name" => $info->LaboName,
                    "First name" => $info->FirstName,
                    "Last name" => $info->LastName,
                    "year" => $info->year,
                    "Activity name" => $activityKey,
                    "Items" => []
                ];
                $existingIndex = count($formattedData[$laboKey]) - 1;
            }

            // Ajouter l'item à l'activité
            $formattedData[$laboKey][$existingIndex]["Items"][] = [
                "Item name" => $info->ItemName,
                "Item Value" => $info->ItemValue
            ];
        }

        return response()->json(['data' => $formattedData], 200);
    }

    public function deleteActivityValues(Request $request)
    {
        $ActivityByLaboId = $request->cookie('activityId');
        try {
            ActivityItemValue::where('ActivityByLaboId', $ActivityByLaboId)->delete();
            ActivityByLabo::where('id', $ActivityByLaboId)->delete();
            return response()->json([
                'message' => 'Values deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete values',
                'error' => $e->getMessage()
            ], 500);
        };
    }


    public function deleteLaboData(Request $request)
    {
        $laboId = JWTHelper::getLaboId($request);
        if (!$laboId) {
            return response()->json(['error' => 'Labo ID not found'], 400);
        }

        try {
            ActivityItemValue::whereHas('activityByLabo', function ($query) use ($laboId) {
                $query->where('laboId', $laboId);
            })->delete();
            ActivityByLabo::where('laboId', $laboId)->delete();
            return response()->json(['success' => 'Labo data deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }


    public function deletelabovalues(Request $request)
    {
        $laboId = JWTHelper::getLaboId($request);
        if (empty($laboId)) {
            return response()->json([
                'message' => 'Labo ID is required and must be valid.',
            ], 400); // Code 400 : Bad Request
        }
        try {
            $activityByLaboIds = ActivityByLabo::where('laboId', $laboId)->pluck('id')->toArray();

            // Suppression des valeurs dans activityItemValues qui ont ActivityByLaboId correspondant
            ActivityItemValue::whereIn('ActivityByLaboId', $activityByLaboIds)->delete();

            // Mise à jour du champ is_calculated à false pour toutes les entrées liées au laboId
            $UPDATE = ActivityByLabo::where('laboId', $laboId);
            // ->update(['is_calculated' => false]);

            return response()->json([
                'message' => 'Values deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete values',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function deleteLaboNotCalculatedById(Request $request)
    {
        $activityByLaboId = $request->cookie('activityId');

        if (empty($activityByLaboId)) {
            return response()->json([
                'message' => 'Activity ID is required and must be valid.',
            ], 400);
        }
        try {
            $activity = ActivityByLabo::find($activityByLaboId);

            if (!$activity) {
                return response()->json([
                    'message' => 'Activity not found.',
                ], 404);
            }

            // if ($activity->is_calculated) {
            //     return response()->json([
            //         'message' => 'Activity has values and cannot be deleted.',
            //     ], 403); // 403 Forbidden
            // }
            $activity->delete();
            return response()->json(["message" => "Activity deleted successfully."], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete activity.',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    private function findOrCreateActivityByLabo($laboId, $activityName, $year, $otherActivity = null)
    {
        if ($activityName === "Autre activité" && !empty($otherActivity)) {
            $customName = trim($otherActivity);

            $existingCustom = Activitieslist::where('Name', $customName)
                ->where('is_custom', true)
                ->first();

            if ($existingCustom) {
                $exists = ActivityByLabo::where([
                    ['ActivityId', $existingCustom->id],
                    ['laboId', $laboId],
                    ['year', $year]
                ])->first();

                if ($exists) return $exists;

                return ActivityByLabo::create([
                    'year' => $year,
                    'laboId' => $laboId,
                    'ActivityId' => $existingCustom->id,
                ]);
            }

            // Create new custom activity
            $newActivity = Activitieslist::create([
                'Name' => $customName,
                'is_custom' => true,
            ]);

            ActivityItem::create([
                'Name' => "ROI",
                'ActivityId' => $newActivity->id,
            ]);

            return ActivityByLabo::create([
                'year' => $year,
                'laboId' => $laboId,
                'ActivityId' => $newActivity->id,
            ]);
        }

        // Cas standard
        $existing = Activitieslist::where('Name', $activityName)->firstOrFail();

        $exists = ActivityByLabo::where([
            ['ActivityId', $existing->id],
            ['laboId', $laboId],
            ['year' => $year]
        ])->first();

        if ($exists) return $exists;

        return ActivityByLabo::create([
            'year' => $year,
            'laboId' => $laboId,
            'ActivityId' => $existing->id,
        ]);
    }


    public function getLaboWithActivities(Request $request)
    {
        // Récupérer laboId depuis JWT ou la requête
        $laboId = JWTHelper::getLaboId($request) ?? $request->input('laboId');

        if (!$laboId) {
            return response()->json([
                'message' => 'Information du laboratoire non trouvée dans le token ou la requête.'
            ], 401);
        }

        // Tester l'existence du laboratoire
        if (!Labo::where('id', $laboId)->exists()) {
            return response()->json([
                'message' => 'Laboratoire non trouvé'
            ], 404);
        }

        // Récupérer les informations du laboratoire avec les détails de l'utilisateur
        $labo = DB::table('labo')
            ->join('users', 'labo.userId', '=', 'users.id')
            ->select(
                'labo.Name as LaboName',
                'users.FirstName as firstName',
                'users.LastName as lastName'
            )
            ->where('labo.id', $laboId)
            ->first();

        // Récupérer les activités associées au laboratoire avec les détails de activitieslist
        $activities = ActivityByLabo::where('laboId', $laboId)
            ->with(['activity' => function ($query) {
                $query->select('id', 'Name as activityName', 'is_custom');
            }])
            ->select(
                'id as activityByLaboId',
                'laboId',
                'ActivityId as activityId',
                'year'
            )
            ->orderBy('ActivityId')
            ->get();

        // Débogage temporaire : retourner les activités chargées
        return response()->json([
            'laboId' => $laboId,
            'rawActivities' => $activities->toArray(),
            'LaboName' => $labo->LaboName,
            'firstName' => $labo->firstName,
            'lastName' => $labo->lastName,
            'Activity' => []
        ]);

        // Si aucune activité n'est trouvée, retourner un message approprié
        if ($activities->isEmpty()) {
            return response()->json([
                'message' => 'Aucune activité trouvée pour le laboratoire'
            ], 404);
        }

        // Construire la réponse au format demandé
        $result = [
            'LaboName' => $labo->LaboName,
            'firstName' => $labo->firstName,
            'lastName' => $labo->lastName,
            'Activity' => []
        ];

        foreach ($activities as $activity) {
            // Gérer les cas où la relation activity est null
            if (!$activity->activity) {
                continue; // Ignorer cette activité si la relation est null
            }

            // Récupérer les valeurs des items pour l'activité courante
            $items = ActivityItemValue::where('ActivityByLaboId', $activity->activityByLaboId)
                ->join('activityitems', 'activityitemvalues.activityItemId', '=', 'activityitems.id')
                ->select(
                    'activityitems.Name as itemName',
                    'activityitemvalues.value'
                )
                ->get();

            // Formater les items comme paires itemName: value
            $itemData = [];
            foreach ($items as $item) {
                $itemData[$item->itemName] = $item->value;
            }

            // Ajouter l'activité au tableau Activity
            $result['Activity'][] = [
                $activity->activity->activityName => $itemData
            ];
        }

        return response()->json($result, 200);
    }

    public function getActivityByLaboData(Request $request)
    {
        // Récupérer l'activityByLaboId depuis le cookie ou la requête
        $activityByLaboId = $request->cookie('activityNumber') ?? $request->input('activityNumber');

        if (!$activityByLaboId) {
            return response()->json(['error' => 'Aucun ID d\'activité fourni'], 400);
        }

        // Récupérer les données de l'activité par laboratoire
        $activityByLabo = ActivityByLabo::with(['activity', 'labo'])->find($activityByLaboId);

        if (!$activityByLabo) {
            return response()->json(['error' => 'Activité non trouvée'], 404);
        }

        // Récupérer les items associés à l'activité, sauf le ROI
        $activityItems = ActivityItem::where('ActivityId', $activityByLabo->ActivityId)
            ->where('Name', '!=', 'Roi') // Exclure l'item ROI
            ->get()
            ->keyBy(function ($item) {
                return $item->symbole ?? 'item_' . $item->id; // Fallback pour symboles NULL
            });

        // Récupérer les valeurs des items
        $itemValues = ActivityItemValue::where('ActivityByLaboId', $activityByLaboId)
            ->with('activityItem')
            ->get()
            ->mapWithKeys(function ($itemValue) {
                $value = $itemValue->value;
                // Convertir les pourcentages en décimal si nécessaire pour les calculs
                if ($itemValue->activityItem->Type === 'percentage' && $itemValue->value > 1) {
                    $value = $itemValue->value / 100;
                }
                return [$itemValue->activityItem->symbole ?? 'item_' . $itemValue->activityItem->id => $value];
            })->toArray();

        // Récupérer la formule de calcul
        $formula = CalculationFormulat::where('ActivityId', $activityByLabo->ActivityId)->first();
        $calculatedResults = [];

        if ($formula) {
            $formulaData = json_decode($formula->formulat, true);
            $intermediateResults = [];

            foreach ($formulaData as $key => $expression) {
                try {
                    $parsedExpression = $expression;

                    // Remplacer les symboles des items
                    foreach ($itemValues as $symbol => $value) {
                        if ($symbol) {
                            $parsedExpression = str_replace($symbol, $value, $parsedExpression);
                        }
                    }

                    // Remplacer les résultats intermédiaires
                    foreach ($intermediateResults as $resultKey => $resultValue) {
                        $parsedExpression = str_replace($resultKey, $resultValue, $parsedExpression);
                    }

                    // Vérifier les variables non résolues
                    if (preg_match('/\b[a-zA-Z_]+\b/', $parsedExpression, $matches)) {
                        $calculatedResults[$key] = "Erreur : variable non définie '$matches[0]'";
                        continue;
                    }

                    // Évaluer l'expression
                    $result = eval("return $parsedExpression;");

                    // Vérifier les résultats invalides
                    if (is_infinite($result) || is_nan($result)) {
                        $calculatedResults[$key] = 'Erreur : résultat invalide (division par zéro ou NaN)';
                        continue;
                    }

                    // Convertir le ROI en pourcentage
                    if ($key === 'roi') {
                        $result *= 100; // Convertir en pourcentage
                    }

                    $calculatedResults[$key] = $result;
                    $intermediateResults[$key] = $result; // Stocker pour les calculs suivants
                } catch (\Exception $e) {
                    $calculatedResults[$key] = 'Erreur de calcul : ' . $e->getMessage();
                }
            }
        } else {
            $calculatedResults['error'] = 'Aucune formule définie pour cette activité';
        }

        // Préparer la réponse
        $response = [
            'activityByLabo' => [
                'id' => $activityByLabo->id,
                'labo' => $activityByLabo->labo->Name,
                'activity' => $activityByLabo->activity->Name,
                'year' => $activityByLabo->year,
            ],
            'items' => $activityItems->map(function ($item) use ($itemValues) {
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

        return response()->json($response);
    }
    
    public function createActivity(Request $request)
    {
        // Manual validation
        $errors = [];

        // Check for required fields
        if (!$request->has('name') || empty($request->name) || !is_string($request->name) || strlen($request->name) > 255) {
            $errors['name'] = 'The name field is required, must be a string, and max 255 characters.';
        }

        // Description is optional, but must be a string if provided
        if ($request->has('description') && (!is_string($request->description) || strlen($request->description) > 65535)) {
            $errors['description'] = 'The description must be a string and not exceed 65535 characters.';
        }

        // Check items
        if (!$request->has('items') || !is_array($request->items) || empty($request->items)) {
            $errors['items'] = 'The items field is required and must be a non-empty array.';
        } else {
            $symbols = [];
            foreach ($request->items as $index => $item) {
                if (!isset($item['name']) || empty($item['name']) || !is_string($item['name']) || strlen($item['name']) > 255) {
                    $errors["items.$index.name"] = 'Item name is required, must be a string, and max 255 characters.';
                }
                if (!isset($item['symbole']) || empty($item['symbole']) || !is_string($item['symbole']) || strlen($item['symbole']) > 10) {
                    $errors["items.$index.symbole"] = 'Item symbol is required, must be a string, and max 10 characters.';
                } elseif (in_array($item['symbole'], $symbols)) {
                    $errors["items.$index.symbole"] = 'Item symbol must be unique.';
                } else {
                    $symbols[] = $item['symbole'];
                }
                if (!isset($item['Type']) || !in_array($item['Type'], ['number', 'percentage'])) {
                    $errors["items.$index.Type"] = 'Item Type is required and must be either "number" or "percentage".';
                }
            }
        }

        // Check formula
        if (!$request->has('formula') || empty($request->formula) || !is_array($request->formula)) {
            $errors['formula'] = 'The formula field is required and must be a valid JSON object.';
        } else {
            foreach ($request->formula as $key => $value) {
                if (!is_string($key) || !is_string($value)) {
                    $errors["formula.$key"] = 'Each formula key and value must be a string.';
                }
            }
        }

        // Return errors if any
        if (!empty($errors)) {
            return response()->json([
                'error' => 'Validation failed',
                'messages' => $errors
            ], 422);
        }

        try {
            // Create the activity
            $activity = ActivitiesList::create([
                'Name' => $request->name,
                'is_custom' => false,
            ]);

            // Normalize item names and create activity items
            $items = [];
            foreach ($request->items as $item) {
                // Normalize "Coût Total" (case-insensitive)
                $itemName = preg_match('/coût\s*total/i', $item['name']) ? 'Coût Total' : $item['name'];

                $activityItem = ActivityItem::create([
                    'ActivityId' => $activity->id,
                    'Name' => $itemName,
                    'symbole' => $item['symbole'],
                    'Type' => $item['Type'],
                ]);
                $items[] = $activityItem;
            }

            // Add default "Roi" item
            $roiItem = ActivityItem::create([
                'ActivityId' => $activity->id,
                'Name' => 'Roi',
                'symbole' => 'ROI',
                'Type' => 'number',
            ]);
            $items[] = $roiItem;

            // Normalize formula keys for "roi" (case-insensitive)
            $normalizedFormulat = [];
            foreach ($request->formula as $key => $value) {
                $normalizedKey = preg_match('/roi/i', $key) ? 'roi' : $key;
                $normalizedFormulat[$normalizedKey] = $value;
            }

            // Create calculation formula
            $formulat = CalculationFormulat::create([
                'ActivityId' => $activity->id,
                'formulat' => json_encode($normalizedFormulat, JSON_UNESCAPED_UNICODE),
            ]);

            // Prepare response
            return response()->json([
                'message' => 'Activity created successfully',
                'activity' => [
                    'id' => $activity->id,
                    'name' => $activity->Name,
                    'description' => $activity->description,
                    'items' => array_map(function ($item) {
                        return [
                            'id' => $item->id,
                            'name' => $item->Name,
                            'symbole' => $item->symbole,
                            'Type' => $item->Type,
                        ];
                    }, $items),
                    'formulat' => json_decode($formulat->formulat, true),
                ],
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to create activity',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
