<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Helpers\JwtHelper;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response;

use App\Models\ActivitiesList;
use App\Models\ActivityByLabo;
use App\Models\Labo;
use App\Models\ActivityItemValue;
use App\Models\ActivityItem;
use App\Http\Controllers\Activity1_12;
use App\Models\CalculationFormulat;

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Protection;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Color;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Font;


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
            // Find the ActivityByLabo record
            $activityByLabo = ActivityByLabo::where('id', $ActivityByLaboId)->first();

            if (!$activityByLabo) {
                return response()->json([
                    'message' => 'Activité non trouvée'
                ], 404);
            }

            // Get the associated activity from activitieslist
            $activity = ActivitiesList::where('id', $activityByLabo->ActivityId)->first();

            if (!$activity) {
                return response()->json([
                    'message' => 'Activité associée non trouvée dans la liste des activités'
                ], 404);
            }

            // Start a transaction to ensure data integrity
            DB::beginTransaction();

            if ($activity->is_custom) {
                // Custom activity: delete the entire activity and its relations
                // Delete activity item values
                ActivityItemValue::where('ActivityByLaboId', $ActivityByLaboId)->delete();

                // Delete activity by labo
                ActivityByLabo::where('id', $ActivityByLaboId)->delete();

                // Delete activity items
                ActivityItem::where('ActivityId', $activity->id)->delete();

                // Delete calculation formula
                CalculationFormulat::where('ActivityId', $activity->id)->delete();

                // Delete the activity from activitieslist
                ActivitiesList::where('id', $activity->id)->delete();

                $message = 'Activité personnalisée et toutes ses relations supprimées avec succès';
            } else {
                // Non-custom activity: delete only activity item values and activity by labo
                ActivityItemValue::where('ActivityByLaboId', $ActivityByLaboId)->delete();
                ActivityByLabo::where('id', $ActivityByLaboId)->delete();

                $message = 'Valeurs de l\'activité supprimées avec succès';
            }

            DB::commit();

            return response()->json([
                'message' => $message
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Échec de la suppression',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function deleteLaboData(Request $request)
    {
        $laboId = JWTHelper::getLaboId($request) ?? $request["laboId"];
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

        // Récupérer tous les items associés à l'activité (y compris Roi)
        $activityItems = ActivityItem::where('ActivityId', $activityByLabo->ActivityId)
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

                    // Remplacer les symboles des items (valeurs en décimal pour calcul)
                    foreach ($activityItems as $symbol => $item) {
                        $value = $itemValues[$symbol] ?? 0;
                        // Utiliser la valeur en décimal pour les calculs (diviser par 100 pour percentage)
                        if ($item->Type === 'percentage') {
                            $value /= 100;
                        }
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
                'is_custom' => $activityByLabo->activity->is_custom, // Ajouter is_custom
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


    public function updateActivity(Request $request, $id)
    {
        // Manual validation
        $errors = [];

        // Check if activity exists
        $activity = ActivitiesList::find($id);
        if (!$activity) {
            return response()->json([
                'error' => 'Activity not found',
            ], 404);
        }

        // Check for required fields
        if (!$request->has('name') || empty($request->name) || !is_string($request->name) || strlen($request->name) > 255) {
            $errors['name'] = 'The name field is required, must be a string, and max 255 characters.';
        } elseif ($request->name !== $activity->Name && ActivitiesList::where('Name', $request->name)->exists()) {
            $errors['name'] = 'The name must be unique.';
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
                    $errors["items.$index.symbole"] = 'Item symbol must be unique within the activity.';
                } else {
                    $symbols[] = $item['symbole'];
                }
                if (!isset($item['Type']) || !in_array($item['Type'], ['number', 'percentage'])) {
                    $errors["items.$index.Type"] = 'Item Type is required and must be either "number" or "percentage".';
                }
            }
            // Ensure ROI symbol is not used in custom items
            if (in_array('ROI', $symbols)) {
                $errors['items'] = 'The symbol "ROI" is reserved for the default Roi item.';
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
            // Start a transaction
            DB::beginTransaction();

            // Update the activity
            $activity->update([
                'Name' => $request->name,
                'description' => $request->description ?? $activity->description,
                'is_custom' => false,
                'updated_at' => now(),
            ]);

            // Get existing items
            $existingItems = ActivityItem::where('ActivityId', $activity->id)->get()->keyBy('symbole');

            // Normalize and update/create items
            $items = [];
            $newSymbols = [];
            foreach ($request->items as $item) {
                // Normalize "Coût Total" (case-insensitive)
                $itemName = preg_match('/coût\s*total/i', $item['name']) ? 'Coût Total' : $item['name'];

                $newSymbols[] = $item['symbole'];

                // Check if item exists by symbol
                if (isset($existingItems[$item['symbole']])) {
                    // Update existing item
                    $activityItem = $existingItems[$item['symbole']];
                    $activityItem->update([
                        'Name' => $itemName,
                        'Type' => $item['Type'],
                        'updated_at' => now(),
                    ]);
                } else {
                    // Create new item
                    $activityItem = ActivityItem::create([
                        'ActivityId' => $activity->id,
                        'Name' => $itemName,
                        'symbole' => $item['symbole'],
                        'Type' => $item['Type'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
                $items[] = $activityItem;
            }

            // Ensure ROI item exists
            if (!isset($existingItems['ROI'])) {
                $roiItem = ActivityItem::create([
                    'ActivityId' => $activity->id,
                    'Name' => 'Roi',
                    'symbole' => 'ROI',
                    'Type' => 'number',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                $items[] = $roiItem;
            } else {
                $items[] = $existingItems['ROI'];
            }

            // Delete items that are no longer in the request
            $existingSymbols = $existingItems->pluck('symbole')->toArray();
            $symbolsToDelete = array_diff($existingSymbols, array_merge($newSymbols, ['ROI']));
            if (!empty($symbolsToDelete)) {
                ActivityItem::where('ActivityId', $activity->id)
                    ->whereIn('symbole', $symbolsToDelete)
                    ->delete();
            }

            // Normalize formula keys for "roi" (case-insensitive)
            $normalizedFormulat = [];
            foreach ($request->formula as $key => $value) {
                $normalizedKey = preg_match('/roi/i', $key) ? 'roi' : $key;
                $normalizedFormulat[$normalizedKey] = $value;
            }

            // Update or create calculation formula
            $formulat = CalculationFormulat::updateOrCreate(
                ['ActivityId' => $activity->id],
                [
                    'formulat' => json_encode($normalizedFormulat, JSON_UNESCAPED_UNICODE),
                    'updated_at' => now(),
                ]
            );

            // Commit the transaction
            DB::commit();

            // Prepare response
            return response()->json([
                'message' => 'Activity updated successfully',
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
            ], 200);
        } catch (\Exception $e) {
            // Rollback the transaction on error
            DB::rollBack();
            return response()->json([
                'error' => 'Failed to update activity',
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    public function exportActivityExcel(Request $request)
    {
        $activityByLaboId = $request->cookie('activityNumber') ?? $request->input('activityNumber');

        if (!$activityByLaboId) {
            return response()->json(['error' => 'Aucun ID d\'activité fourni'], 400);
        }

        $activityByLabo = ActivityByLabo::with(['activity', 'labo'])->find($activityByLaboId);
        if (!$activityByLabo) {
            return response()->json(['error' => 'Activité non trouvée'], 404);
        }

        $activityItems = ActivityItem::where('ActivityId', $activityByLabo->ActivityId)
            ->get()
            ->keyBy(fn($item) => $item->symbole ?? 'item_' . $item->id);

        $itemValues = ActivityItemValue::where('ActivityByLaboId', $activityByLaboId)
            ->with('activityItem')
            ->get()
            ->mapWithKeys(
                fn($itemValue) =>
                [$itemValue->activityItem->symbole ?? 'item_' . $itemValue->activityItem->id => $itemValue->value]
            )->toArray();

        $formula = CalculationFormulat::where('ActivityId', $activityByLabo->ActivityId)->first();
        $calculatedResults = [];

        if ($formula) {
            $formulaData = json_decode($formula->formulat, true);
            $intermediateResults = [];

            foreach ($formulaData as $key => $expression) {
                try {
                    $parsedExpression = $expression;

                    foreach ($activityItems as $symbol => $item) {
                        $value = $itemValues[$symbol] ?? 0;
                        if ($item->Type === 'percentage') $value /= 100;
                        $parsedExpression = str_replace($symbol, $value, $parsedExpression);
                    }

                    foreach ($intermediateResults as $k => $v) {
                        $parsedExpression = str_replace($k, $v, $parsedExpression);
                    }

                    if (preg_match('/\b[a-zA-Z_]+\b/', $parsedExpression)) {
                        $calculatedResults[$key] = 'Variable non définie';
                        continue;
                    }

                    $result = eval("return $parsedExpression;");
                    if (is_infinite($result) || is_nan($result)) {
                        $calculatedResults[$key] = 'Résultat invalide';
                        continue;
                    }

                    if ($key === 'roi') $result *= 100;
                    $calculatedResults[$key] = $result;
                    $intermediateResults[$key] = $result;
                } catch (\Throwable $e) {
                    $calculatedResults[$key] = 'Erreur';
                }
            }
        }

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // --- Infos hors tableau ---

        // Ligne 1 : Activity Name (gras, taille plus grande)
        $sheet->setCellValue('A1', 'Activity Name:');
        $sheet->setCellValue('B1', $activityByLabo->activity->Name);
        $sheet->getStyle('A1')->getFont()->setBold(true);
        $sheet->getStyle('B1')->getFont()->setBold(true)->setSize(14);

        // Ligne 2 : Activity By Labo ID (invisible)
        $sheet->setCellValue('A2', 'Activity By Labo ID:');
        $sheet->setCellValue('B2', $activityByLabo->id);
        $sheet->getRowDimension(2)->setVisible(false);

        // Ligne 3 : Labo ID (invisible)
        $sheet->setCellValue('A3', 'Labo ID:');
        $sheet->setCellValue('B3', $activityByLabo->LaboId ?? '');
        $sheet->getRowDimension(3)->setVisible(false);

        // Ajuste largeur colonnes A et B pour ces infos (optionnel)
        $sheet->getColumnDimension('A')->setWidth(20);
        $sheet->getColumnDimension('B')->setWidth(30);

        // --- Tableau encadré commence ligne 5 ---
        $row = 5;

        // En-têtes tableau
        $sheet->setCellValue("A{$row}", 'Section');
        $sheet->setCellValue("B{$row}", 'Clé');
        $sheet->setCellValue("C{$row}", 'Valeur');

        // Style en-tête (gras, fond bleu clair, centré)
        $headerStyle = [
            'font' => ['bold' => true],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => 'D9E1F2']
            ],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => '000000'],
                ],
            ],
        ];
        $sheet->getStyle("A{$row}:C{$row}")->applyFromArray($headerStyle);

        $row++;

        $applyCellStyle = function ($cellRange) use ($sheet) {
            $sheet->getStyle($cellRange)->applyFromArray([
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                        'color' => ['rgb' => '000000'],
                    ],
                ],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => 'FFFFFF'],
                ],
            ]);
        };

        // Remplissage activityByLabo (sans id, dates, ActivityId, LaboId)
        foreach ($activityByLabo->toArray() as $key => $value) {
            if (!in_array($key, ['id', 'created_at', 'updated_at', 'ActivityId', 'LaboId']) && is_scalar($value)) {
                $sheet->setCellValue("A{$row}", 'activityByLabo');
                $sheet->setCellValue("B{$row}", $key);
                $sheet->setCellValue("C{$row}", $value);
                $applyCellStyle("A{$row}:C{$row}");
                $row++;
            }
        }

        // Remplissage items
        foreach ($activityItems as $symbol => $item) {
            $sheet->setCellValue("A{$row}", 'items');
            $sheet->setCellValue("B{$row}", $item->Name);
            $sheet->setCellValue("C{$row}", $itemValues[$symbol] ?? '');
            $applyCellStyle("A{$row}:C{$row}");
            $row++;
        }

        // Remplissage calculated_results avec coloration roi
        foreach ($calculatedResults as $key => $value) {
            $sheet->setCellValue("A{$row}", 'calculated_results');
            $sheet->setCellValue("B{$row}", $key);
            $sheet->setCellValue("C{$row}", $value);
            $cellRange = "A{$row}:C{$row}";

            $sheet->getStyle($cellRange)->applyFromArray([
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                        'color' => ['rgb' => '000000'],
                    ],
                ],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => 'FFFFFF'],
                ],
            ]);

            if ($key === 'roi' && is_numeric($value)) {
                $roiValue = $value / 100;
                $roiValue = max(0, min(2, $roiValue));

                if ($roiValue >= 1) {
                    $redIntensity = intval(255 - (($roiValue - 1) * 255));
                    $redIntensity = max(0, $redIntensity);
                    $colorHex = sprintf("%02X%02X%02X", $redIntensity, 255, 0);
                } else {
                    $greenIntensity = intval(255 * $roiValue);
                    $colorHex = sprintf("FF%02X%02X", $greenIntensity, $greenIntensity);
                }

                $sheet->getStyle("C{$row}")->getFill()->setFillType(Fill::FILL_SOLID);
                $sheet->getStyle("C{$row}")->getFill()->getStartColor()->setRGB($colorHex);
            }

            $row++;
        }

        // Ajuster largeur colonnes A à C (pour le tableau)
        foreach (range('A', 'C') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        // Protection feuille
        $sheet->getProtection()->setSheet(true);
        $sheet->getProtection()->setPassword('secret');
        $sheet->getProtection()->setSort(false);
        $sheet->getProtection()->setInsertRows(false);
        $sheet->getProtection()->setFormatCells(false);
        $sheet->getProtection()->setDeleteRows(false);
        $sheet->getProtection()->setInsertColumns(false);
        $sheet->getProtection()->setDeleteColumns(false);
        $spreadsheet->getSecurity()->setLockWindows(true);   // facultatif : bloque déplacement fenêtres
        $spreadsheet->getSecurity()->setLockStructure(true); // bloque modification structure (ajout/suppression feuilles)
        $spreadsheet->getSecurity()->setWorkbookPassword('secret'); // mot de passe de protection
        $writer = new Xlsx($spreadsheet);

        $filename = 'export_activity_' . $activityByLaboId . '.xlsx';

        if (ob_get_length()) ob_end_clean();

        return response()->streamDownload(function () use ($writer) {
            $writer->save('php://output');
        }, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ]);
    }


    public function exportAllActivitiesExcel(Request $request)
    {
        $laboId = JWTHelper::getLaboId($request);
        if (!$laboId) {
            return response()->json(['message' => 'Information du laboratoire non trouvée.'], 401);
        }

        $labo = Labo::find($laboId);
        if (!$labo) {
            return response()->json(['message' => 'Laboratoire non trouvé.'], 404);
        }

        $activitiesByLabo = ActivityByLabo::with(['activity'])->where('laboId', $laboId)->get();
        if ($activitiesByLabo->isEmpty()) {
            return response()->json(['message' => 'Aucune activité trouvée.'], 404);
        }

        $spreadsheet = new Spreadsheet();
        $spreadsheet->removeSheetByIndex(0);

        $annualRois = [];

        foreach ($activitiesByLabo as $activityByLabo) {
            $activityName = $activityByLabo->activity->Name . ' ' . $activityByLabo->year;
            $baseSheetName = substr($activityName, 0, 31);
            $sheetName = $baseSheetName;
            $index = 1;
            while ($spreadsheet->getSheetByName($sheetName)) {
                $suffix = " ($index)";
                $maxLength = 31 - strlen($suffix);
                $sheetName = substr($baseSheetName, 0, $maxLength) . $suffix;
                $index++;
            }

            $sheet = new Worksheet($spreadsheet, $sheetName);
            $spreadsheet->addSheet($sheet);

            $rows = [];

            $title = "Activité : " . $activityByLabo->activity->Name;
            $rows[] = [$title, ''];
            $rows[] = ['Clé', 'Valeur'];
            $rows[] = ['Laboratoire', $labo->Name];
            $rows[] = ['Année', $activityByLabo->year];
            $rows[] = ['', ''];

            $activityItems = ActivityItem::where('ActivityId', $activityByLabo->ActivityId)->get()
                ->keyBy(fn($item) => $item->symbole ?? 'item_' . $item->id);

            $itemValues = ActivityItemValue::where('ActivityByLaboId', $activityByLabo->id)
                ->with('activityItem')
                ->get()
                ->mapWithKeys(
                    fn($itemValue) =>
                    [$itemValue->activityItem->symbole ?? 'item_' . $itemValue->activityItem->id => $itemValue->value]
                )->toArray();

            foreach ($activityItems as $symbol => $item) {
                if (strtolower($symbol) === 'roi') continue;
                $value = $itemValues[$symbol] ?? '';
                if ($item->Type === 'percentage' && is_numeric($value)) {
                    $value = $value . '%';
                }
                $rows[] = [$item->Name, $value];
            }

            $rows[] = ['', ''];

            $formula = CalculationFormulat::where('ActivityId', $activityByLabo->ActivityId)->first();
            $calculatedResults = [];

            if ($formula) {
                $formulaData = json_decode($formula->formulat, true);
                $intermediateResults = [];

                foreach ($formulaData as $key => $expression) {
                    try {
                        $parsedExpression = $expression;

                        foreach ($activityItems as $symbol => $item) {
                            $value = $itemValues[$symbol] ?? 0;
                            if ($item->Type === 'percentage') $value /= 100;
                            $parsedExpression = str_replace($symbol, $value, $parsedExpression);
                        }

                        foreach ($intermediateResults as $k => $v) {
                            $parsedExpression = str_replace($k, $v, $parsedExpression);
                        }

                        if (preg_match('/\b[a-zA-Z_]+\b/', $parsedExpression)) {
                            $calculatedResults[$key] = 'Variable non définie';
                            continue;
                        }

                        $result = eval("return $parsedExpression;");
                        if (is_infinite($result) || is_nan($result)) {
                            $calculatedResults[$key] = 'Résultat invalide';
                            continue;
                        }

                        if ($key === 'roi') $result *= 100;
                        $calculatedResults[$key] = $result;
                        $intermediateResults[$key] = $result;
                    } catch (\Throwable $e) {
                        $calculatedResults[$key] = 'Erreur';
                    }
                }
            }

            $year = $activityByLabo->year;
            if (!isset($annualRois[$year])) {
                $annualRois[$year] = [
                    'ventes_incrementales' => 0,
                    'cout_total' => 0,
                    'activities' => [],
                ];
            }

            $ventesKey = $activityByLabo->ActivityId == 13 ? 'Revenu Total' : 'ventes_incrementales';
            $coutKey = $activityByLabo->ActivityId == 13 ? 'cout total' : 'cout_total';

            $ventesValue = floatval($calculatedResults[$ventesKey] ?? 0);
            $coutValue = floatval($calculatedResults[$coutKey] ?? 0);

            $annualRois[$year]['ventes_incrementales'] += $ventesValue;
            $annualRois[$year]['cout_total'] += $coutValue;
            $annualRois[$year]['activities'][] = [
                'name' => $activityByLabo->activity->Name,
                'roi' => isset($calculatedResults['roi']) ? floatval($calculatedResults['roi']) : 0,
            ];

            foreach ($calculatedResults as $key => $value) {
                if ($key === 'roi' && is_numeric($value)) {
                    $value = $value . '%';
                }
                $rows[] = [$key, $value];
            }

            $sheet->fromArray($rows, null, 'A1');
            $sheet->mergeCells('A1:B1');
            $sheet->getStyle('A1')->applyFromArray([
                'font' => ['bold' => true, 'size' => 20],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            ]);

            $rowCount = count($rows);
            $sheet->getStyle("A2:B$rowCount")->applyFromArray([
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                        'color' => ['rgb' => '000000'],
                    ],
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER,
                    'vertical' => Alignment::VERTICAL_CENTER,
                ],
            ]);

            $sheet->getStyle('A2:B2')->applyFromArray([
                'font' => ['bold' => true],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => 'd9e1f2'],
                ],
            ]);

            $sheet->getColumnDimension('A')->setAutoSize(true);
            $sheet->getColumnDimension('B')->setAutoSize(true);

            foreach ($rows as $i => $row) {
                if (strtolower($row[0]) === 'roi' && is_numeric(str_replace('%', '', $row[1]))) {
                    $roi = floatval(str_replace('%', '', $row[1])) / 100;
                    $color = 'FFC7CE';
                    if ($roi > 1) $color = 'C6EFCE';
                    elseif ($roi > 0.75) $color = 'FF9999';
                    elseif ($roi > 0.5) $color = 'FF6666';
                    elseif ($roi > 0.25) $color = 'FF3333';

                    $cell = 'B' . ($i + 1);
                    $sheet->getStyle($cell)->applyFromArray([
                        'fill' => [
                            'fillType' => Fill::FILL_SOLID,
                            'startColor' => ['rgb' => $color],
                        ],
                    ]);
                }
            }

            $sheet->getProtection()->setSheet(true);
            $sheet->getProtection()->setSort(true);
            $sheet->getProtection()->setInsertRows(false);
            $sheet->getProtection()->setInsertColumns(false);
            $sheet->getProtection()->setFormatCells(false);
            $sheet->getProtection()->setPassword('secret');
        }

        foreach ($annualRois as $year => $data) {
            $sheet = new Worksheet($spreadsheet, "Synthèse $year");
            $spreadsheet->addSheet($sheet);

            $rows = [['Activité', 'ROI']];
            foreach ($data['activities'] as $entry) {
                $rows[] = [$entry['name'], $entry['roi'] . '%'];
            }

            $annualRoi = $data['cout_total'] != 0
                ? ($data['ventes_incrementales'] / $data['cout_total']) * 100
                : 0;

            $rows[] = ['ROI annuel', round($annualRoi, 2) . '%'];

            $sheet->fromArray($rows, null, 'A1');
            $rowCount = count($rows);
            $sheet->getStyle("A1:B$rowCount")->applyFromArray([
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                        'color' => ['rgb' => '000000'],
                    ],
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER,
                    'vertical' => Alignment::VERTICAL_CENTER,
                ],
            ]);

            $sheet->getStyle('A1:B1')->applyFromArray([
                'font' => ['bold' => true],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => 'd9e1f2'],
                ],
            ]);

            $sheet->getColumnDimension('A')->setAutoSize(true);
            $sheet->getColumnDimension('B')->setAutoSize(true);

            $roiCell = 'B' . count($rows);
            $roiValue = $annualRoi / 100;
            $color = 'FFC7CE';
            if ($roiValue > 1) $color = 'C6EFCE';
            elseif ($roiValue > 0.75) $color = 'FF9999';
            elseif ($roiValue > 0.5) $color = 'FF6666';
            elseif ($roiValue > 0.25) $color = 'FF3333';

            $sheet->getStyle($roiCell)->applyFromArray([
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => $color],
                ],
            ]);

            $sheet->getProtection()->setSheet(true);
            $sheet->getProtection()->setSort(true);
            $sheet->getProtection()->setInsertRows(false);
            $sheet->getProtection()->setInsertColumns(false);
            $sheet->getProtection()->setFormatCells(false);
            $sheet->getProtection()->setPassword('secret');
        }

        $spreadsheet->getSecurity()->setLockWindows(true);
        $spreadsheet->getSecurity()->setLockStructure(true);

        $writer = new Xlsx($spreadsheet);
        $fileName = 'export_activities_labo_' . $laboId . '.xlsx';
        $tempFile = tempnam(sys_get_temp_dir(), $fileName);
        $writer->save($tempFile);

        return response()->download($tempFile, $fileName)->deleteFileAfterSend(true);
    }


    public function exportActivityCsv(Request $request)
    {
        $activityByLaboId = $request->cookie('activityNumber') ?? $request->input('activityNumber');

        if (!$activityByLaboId) {
            return response()->json(['error' => 'Aucun ID d\'activité fourni'], 400);
        }

        $activityByLabo = ActivityByLabo::with(['activity', 'labo'])->find($activityByLaboId);
        if (!$activityByLabo) {
            return response()->json(['error' => 'Activité non trouvée'], 404);
        }

        $activityItems = ActivityItem::where('ActivityId', $activityByLabo->ActivityId)
            ->get()
            ->keyBy(fn($item) => $item->symbole ?? 'item_' . $item->id);

        $itemValues = ActivityItemValue::where('ActivityByLaboId', $activityByLaboId)
            ->with('activityItem')
            ->get()
            ->mapWithKeys(
                fn($itemValue) =>
                [$itemValue->activityItem->symbole ?? 'item_' . $itemValue->activityItem->id => $itemValue->value]
            )->toArray();

        $formula = CalculationFormulat::where('ActivityId', $activityByLabo->ActivityId)->first();
        $calculatedResults = [];

        if ($formula) {
            $formulaData = json_decode($formula->formulat, true);
            $intermediateResults = [];

            foreach ($formulaData as $key => $expression) {
                try {
                    $parsedExpression = $expression;

                    foreach ($activityItems as $symbol => $item) {
                        $value = $itemValues[$symbol] ?? 0;
                        if ($item->Type === 'percentage') $value /= 100;
                        $parsedExpression = str_replace($symbol, $value, $parsedExpression);
                    }

                    foreach ($intermediateResults as $k => $v) {
                        $parsedExpression = str_replace($k, $v, $parsedExpression);
                    }

                    if (preg_match('/\b[a-zA-Z_]+\b/', $parsedExpression)) {
                        $calculatedResults[$key] = 'Variable non définie';
                        continue;
                    }

                    $result = eval("return $parsedExpression;");
                    if (is_infinite($result) || is_nan($result)) {
                        $calculatedResults[$key] = 'Résultat invalide';
                        continue;
                    }

                    if ($key === 'roi') $result *= 100;
                    $calculatedResults[$key] = $result;
                    $intermediateResults[$key] = $result;
                } catch (\Throwable $e) {
                    $calculatedResults[$key] = 'Erreur';
                }
            }
        }

        // Construire les lignes du CSV
        $lines = [];
        $lines[] = ['Section', 'Clé', 'Valeur'];

        foreach ($activityByLabo->toArray() as $key => $value) {
            if (!in_array($key, ['id', 'created_at', 'updated_at', 'ActivityId', 'LaboId']) && is_scalar($value)) {
                $lines[] = ['activityByLabo', $key, $value];
            }
        }

        foreach ($activityItems as $symbol => $item) {
            $lines[] = ['items', $item->Name, $itemValues[$symbol] ?? ''];
        }

        foreach ($calculatedResults as $key => $value) {
            $lines[] = ['calculated_results', $key, $value];
        }

        // Écrire le CSV dans un flux mémoire
        $handle = fopen('php://temp', 'r+');

        // Ajouter BOM UTF-8 pour corriger les accents dans Excel
        fwrite($handle, "\xEF\xBB\xBF");

        foreach ($lines as $line) {
            fputcsv($handle, $line);
        }

        rewind($handle);
        $csv = stream_get_contents($handle);
        fclose($handle);

        return response($csv)
            ->header('Content-Type', 'text/csv; charset=UTF-8')
            ->header('Content-Disposition', 'attachment; filename="export_activity_' . $activityByLaboId . '.csv"');
    }


    public function exportAllActivitiesCsv(Request $request)
    {
        // Récupérer l'ID du laboratoire depuis le token JWT
        $laboId = JWTHelper::getLaboId($request);
        if (!$laboId) {
            return response()->json([
                'message' => 'Information du laboratoire non trouvée dans le token.'
            ], 401);
        }

        // Récupérer le laboratoire
        $labo = Labo::find($laboId);
        if (!$labo) {
            return response()->json(['error' => 'Laboratoire non trouvé'], 404);
        }

        // Récupérer toutes les activités associées au laboratoire
        $activitiesByLabo = ActivityByLabo::with(['activity', 'labo'])
            ->where('laboId', $laboId)
            ->get();

        if ($activitiesByLabo->isEmpty()) {
            return response()->json(['error' => 'Aucune activité trouvée pour ce laboratoire'], 404);
        }

        // Initialiser les lignes du CSV
        $lines = [];
        $lines[] = ['Laboratoire', 'Activité', 'Année', 'Clé', 'Valeur'];

        foreach ($activitiesByLabo as $activityByLabo) {
            // Récupérer les items de l'activité
            $activityItems = ActivityItem::where('ActivityId', $activityByLabo->ActivityId)
                ->get()
                ->keyBy(fn($item) => $item->symbole ?? 'item_' . $item->id);

            // Récupérer les valeurs des items pour cette activité
            $itemValues = ActivityItemValue::where('ActivityByLaboId', $activityByLabo->id)
                ->with('activityItem')
                ->get()
                ->mapWithKeys(
                    fn($itemValue) =>
                    [$itemValue->activityItem->symbole ?? 'item_' . $itemValue->activityItem->id => $itemValue->value]
                )->toArray();

            // Récupérer la formule de calcul
            $formula = CalculationFormulat::where('ActivityId', $activityByLabo->ActivityId)->first();
            $calculatedResults = [];

            if ($formula) {
                $formulaData = json_decode($formula->formulat, true);
                $intermediateResults = [];

                foreach ($formulaData as $key => $expression) {
                    try {
                        $parsedExpression = $expression;

                        foreach ($activityItems as $symbol => $item) {
                            $value = $itemValues[$symbol] ?? 0;
                            if ($item->Type === 'percentage') $value /= 100;
                            $parsedExpression = str_replace($symbol, $value, $parsedExpression);
                        }

                        foreach ($intermediateResults as $k => $v) {
                            $parsedExpression = str_replace($k, $v, $parsedExpression);
                        }

                        if (preg_match('/\b[a-zA-Z_]+\b/', $parsedExpression)) {
                            $calculatedResults[$key] = 'Variable non définie';
                            continue;
                        }

                        $result = eval("return $parsedExpression;");
                        if (is_infinite($result) || is_nan($result)) {
                            $calculatedResults[$key] = 'Résultat invalide';
                            continue;
                        }

                        if ($key === 'roi') $result *= 100;
                        $calculatedResults[$key] = $result;
                        $intermediateResults[$key] = $result;
                    } catch (\Throwable $e) {
                        $calculatedResults[$key] = 'Erreur';
                    }
                }
            }

            // Ajouter les informations de l'activité
            foreach ($activityByLabo->toArray() as $key => $value) {
                if (!in_array($key, ['id', 'created_at', 'updated_at', 'ActivityId', 'laboId']) && is_scalar($value)) {
                    $lines[] = [
                        $labo->Name,
                        $activityByLabo->activity->Name,
                        $activityByLabo->year,
                        $key,
                        $value
                    ];
                }
            }

            // Ajouter les items de l'activité
            foreach ($activityItems as $symbol => $item) {
                $lines[] = [
                    $labo->Name,
                    $activityByLabo->activity->Name,
                    $activityByLabo->year,
                    $item->Name,
                    $itemValues[$symbol] ?? ''
                ];
            }

            // Ajouter les résultats calculés
            foreach ($calculatedResults as $key => $value) {
                $lines[] = [
                    $labo->Name,
                    $activityByLabo->activity->Name,
                    $activityByLabo->year,
                    $key,
                    $value
                ];
            }
        }

        // Écrire le CSV dans un flux mémoire
        $handle = fopen('php://temp', 'r+');

        // Ajouter BOM UTF-8 pour corriger les accents dans Excel
        fwrite($handle, "\xEF\xBB\xBF");

        foreach ($lines as $line) {
            fputcsv($handle, $line);
        }

        rewind($handle);
        $csv = stream_get_contents($handle);
        fclose($handle);

        return response($csv)
            ->header('Content-Type', 'text/csv; charset=UTF-8')
            ->header('Content-Disposition', 'attachment; filename="export_activities_labo_' . $laboId . '.csv"');
    }


    public function getAllActivitiesInfo(Request $request)
    {
        try {
            // Récupérer toutes les activités
            $activities = ActivitiesList::select('id', 'Name', 'is_custom', 'created_at', 'updated_at')
                ->get();

            // Initialiser le tableau de résultats
            $result = [];

            foreach ($activities as $activity) {
                // Récupérer les items associés à l'activité
                $items = ActivityItem::where('ActivityId', $activity->id)
                    ->select('id', 'Name', 'symbole', 'Type', 'created_at', 'updated_at')
                    ->get()
                    ->toArray();

                // Récupérer la formule de calcul associée à l'activité
                $formula = CalculationFormulat::where('ActivityId', $activity->id)
                    ->select('id', 'formulat', 'created_at', 'updated_at')
                    ->first();

                // Décoder la formule JSON si elle existe
                $formulaData = $formula ? json_decode($formula->formulat, true) : null;

                // Ajouter les informations de l'activité au résultat
                $result[] = [
                    'activity' => [
                        'id' => $activity->id,
                        'name' => $activity->Name,
                        'is_custom' => $activity->is_custom,
                        'created_at' => $activity->created_at,
                        'updated_at' => $activity->updated_at,
                    ],
                    'items' => $items,
                    'formula' => $formula ? [
                        'id' => $formula->id,
                        'formulat' => $formulaData,
                        'created_at' => $formula->created_at,
                        'updated_at' => $formula->updated_at,
                    ] : null,
                ];
            }

            return response()->json([
                'success' => true,
                'data' => $result,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des informations des activités : ' . $e->getMessage(),
            ], 500);
        }
    }


}
