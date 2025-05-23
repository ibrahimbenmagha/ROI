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



    public function CreateActivityByLabo(Request $request)
    {
        try {
            $laboId = JWTHelper::getLaboId($request);
            if (!$laboId) {
                return response()->json([
                    'message' => 'Information du laboratoire non trouvée dans le token.'
                ], 401);
            }
            $validated = $request->validate([
                'year' => 'required|integer',
                'ActivityId' => 'required|string',
                'otherActivity' => 'nullable|string'
            ]);

            $activityId = $validated['ActivityId'];
            $year = $validated['year'];

            if ($activityId === "Autre activité" && !empty($validated['otherActivity'])) {
                $customName = trim($validated['otherActivity']);
                $existingCustom = Activitieslist::where('Name', $customName)
                    ->where('is_custom', true)
                    ->first();
                if ($existingCustom) {
                    $existingActivityId = $existingCustom->id;
                    $alreadyInserted = ActivityByLabo::where([
                        ['ActivityId', $existingActivityId],
                        ['laboId', $laboId],
                        ['year', $year]
                    ])->exists();
                    if ($alreadyInserted) {
                        return response()->json([
                            'message' => 'Cette activité personnalisée existe déjà pour cette année.'
                        ], 409);
                    }
                    $activity = ActivityByLabo::create([
                        'year' => $year,
                        'laboId' => $laboId,
                        'ActivityId' => $existingActivityId,
                    ]);

                    return response()->json([
                        'message' => 'Activité existante ajoutée pour une nouvelle année.',
                        'activity' => $activity
                    ], 201);
                }

                $newActivity = Activitieslist::create([
                    'Name' => $customName,
                    'is_custom' => true,
                ]);

                ActivityItem::create([
                    'Name' => "ROI",
                    'ActivityId' => $newActivity->id,
                ]);

                $activity = ActivityByLabo::create([
                    'year' => $year,
                    'laboId' => $laboId,
                    'ActivityId' => $newActivity->id,
                ]);

                return response()->json([
                    'message' => "Vous avez créé une nouvelle activité personnalisée.",
                    'activity' => $activity
                ], 201);
            }

            if (ActivityByLabo::where([['ActivityId', $activityId], ['laboId', $laboId], ['year', $year]])->exists()) {
                return response()->json([
                    'message' => 'Vous avez déjà comptabilisé cette activité pour cette année.'
                ], 409);
            }

            $activity = ActivityByLabo::create([
                'year' => $year,
                'laboId' => $laboId,
                'ActivityId' => $activityId,
            ]);

            return response()->json([
                'message' => "Activité créée avec succès.",
                'activity' => $activity
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Échec de la création de l\'activité.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    public function createActivity(Request $request)
    {
        try {
            if (ActivitiesList::where('Name', $request->name)->exists()) {
                return response()->json([
                    'message' => 'This activity already exists'
                ], 409);
            }
            $validated = $request->validate([
                'Name' => 'required|string|max:255|unique:activitieslist,Name',
            ]);
            $activity = ActivitiesList::create([
                'Name' => $validated['Name'],
                'is_custom' => true,
            ]);

            return response()->json([
                'message' => 'Activity created successfully',
                'activity' => $activity,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create activity',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


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


    // public function createActivity2(Request $request)
    // {
    //     // Manual validation
    //     $errors = [];

    //     // Check for required fields
    //     if (!$request->has('name') || empty($request->name) || !is_string($request->name) || strlen($request->name) > 255) {
    //         $errors['name'] = 'The name field is required, must be a string, and max 255 characters.';
    //     }

    //     // Description is optional, but must be a string if provided
    //     if ($request->has('description') && (!is_string($request->description) || strlen($request->description) > 65535)) {
    //         $errors['description'] = 'The description must be a string and not exceed 65535 characters.';
    //     }

    //     // Check items
    //     if (!$request->has('items') || !is_array($request->items) || empty($request->items)) {
    //         $errors['items'] = 'The items field is required and must be a non-empty array.';
    //     } else {
    //         $symbols = [];
    //         foreach ($request->items as $index => $item) {
    //             if (!isset($item['name']) || empty($item['name']) || !is_string($item['name']) || strlen($item['name']) > 255) {
    //                 $errors["items.$index.name"] = 'Item name is required, must be a string, and max 255 characters.';
    //             }
    //             if (!isset($item['symbole']) || empty($item['symbole']) || !is_string($item['symbole']) || strlen($item['symbole']) > 10) {
    //                 $errors["items.$index.symbole"] = 'Item symbol is required, must be a string, and max 10 characters.';
    //             } elseif (in_array($item['symbole'], $symbols)) {
    //                 $errors["items.$index.symbole"] = 'Item symbol must be unique.';
    //             } else {
    //                 $symbols[] = $item['symbole'];
    //             }
    //             if (!isset($item['Type']) || !in_array($item['Type'], ['number', 'percentage'])) {
    //                 $errors["items.$index.Type"] = 'Item Type is required and must be either "number" or "percentage".';
    //             }
    //         }
    //     }

    //     // Check formulat
    //     if (!$request->has('formulat') || empty($request->formulat) || !is_string($request->formulat)) {
    //         $errors['formulat'] = 'The formulat field is required and must be a string.';
    //     }

    //     // Return errors if any
    //     if (!empty($errors)) {
    //         return response()->json([
    //             'error' => 'Validation failed',
    //             'messages' => $errors
    //         ], 422);
    //     }

    //     try {
    //         // Create the activity
    //         $activity = ActivitiesList::create([
    //             'Name' => $request->name,
    //             'is_custom' => false,
    //         ]);

    //         // Create activity items
    //         $items = [];
    //         foreach ($request->items as $item) {
    //             $activityItem = ActivityItem::create([
    //                 'ActivityId' => $activity->id,
    //                 'Name' => $item['name'],
    //                 'symbole' => $item['symbole'],
    //                 'Type' => $item['Type'],
    //             ]);
    //             $items[] = $activityItem;
    //         }

    //         // Create calculation formulat
    //         $formulat = CalculationFormulat::create([
    //             'ActivityId' => $activity->id,
    //             'formulat' => $request->formulat,
    //         ]);

    //         // Prepare response
    //         return response()->json([
    //             'message' => 'Activity created successfully',
    //             'activity' => [
    //                 'id' => $activity->id,
    //                 'name' => $activity->Name,
    //                 'description' => $activity->description,
    //                 'items' => array_map(function ($item) {
    //                     return [
    //                         'id' => $item->id,
    //                         'name' => $item->Name,
    //                         'symbole' => $item->symbole,
    //                         'Type' => $item->Type,
    //                     ];
    //                 }, $items),
    //                 'formulat' => $formulat->Formulat,
    //             ],
    //         ], 201);
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'error' => 'Failed to create activity',
    //             'message' => $e->getMessage(),
    //         ], 500);
    //     }
    // }


    /** */


    public function createActivity2(Request $request)
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

        // Check formulat
        if (!$request->has('formulat') || empty($request->formulat) || !is_array($request->formulat)) {
            $errors['formulat'] = 'The formulat field is required and must be a valid JSON object.';
        } else {
            foreach ($request->formulat as $key => $value) {
                if (!is_string($key) || !is_string($value)) {
                    $errors["formulat.$key"] = 'Each formulat key and value must be a string.';
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

            // Create activity items
            $items = [];
            foreach ($request->items as $item) {
                $activityItem = ActivityItem::create([
                    'ActivityId' => $activity->id,
                    'Name' => $item['name'],
                    'symbole' => $item['symbole'],
                    'Type' => $item['Type'],
                ]);
                $items[] = $activityItem;
            }

            // Create calculation formulat
            $formulat = CalculationFormulat::create([
                'ActivityId' => $activity->id,
                'formulat' => json_encode($request->formulat), // Convertir l'objet en chaîne JSON
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
                    'formulat' => json_decode($formulat->formulat), // Décode pour la réponse
                ],
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to create activity',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    // public function getActivitiesWithItemsAndFormulas(Request $request)
    // {
    //     try {
    //         $activities = ActivitiesList::join('activityItems', 'activitieslist.id', '=', 'activityItems.ActivityId')
    //             ->join('calculationFormula', 'activitieslist.id', '=', 'calculationFormula.ActivityId')
    //             ->select(
    //                 'activitieslist.id',
    //                 'activitieslist.Name as actName',
    //                 'activitieslist.is_custom as is_custom',
    //                 'activityItems.id',
    //                 'activityItems.Name as ItemName',
    //                 'activityItems.Type as ItemType',
    //                 'activityItems.symbole as ItemSymbole',
    //                 'calculationFormula.id',
    //                 'calculationFormula.formulat',
    //             )
    //             ->get();

    //         // Transformer les résultats dans le format souhaité
    //         $formattedData = $activities->map(function ($activity) {
    //             return [
    //                 'activity_id' => $activity->activity_id,
    //                 'activity_name' => $activity->activity_name,
    //                 'is_custom' => $activity->is_custom,
    //                 'items' => json_decode($activity->items, true) ?? [], // Décoder les items, renvoyer un tableau vide si null
    //                 'formulat' => $activity->formulat ? json_decode($activity->formulat, true) : null // Décoder la formule JSON
    //             ];
    //         });

    //         if ($formattedData->isEmpty()) {
    //             return response()->json(['message' => 'No activities found'], 404);
    //         }

    //         return response()->json([
    //             'message' => 'Activities retrieved successfully',
    //             'data' => array_values($formattedData->toArray()) // Convertir en tableau indexé
    //         ], 200);
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'error' => 'Failed to retrieve activities',
    //             'message' => $e->getMessage(),
    //         ], 500);
    //     }
    // }



    public function getActivitiesWithItemsAndFormulas(Request $request)
    {
        try {
            // Requête avec jointures
            $activities = ActivitiesList::join('activityItems', 'activitieslist.id', '=', 'activityItems.ActivityId')
                ->join('calculationFormula', 'activitieslist.id', '=', 'calculationFormula.ActivityId')
                ->select(
                    'activitieslist.id',
                    'activitieslist.Name as actName',
                    'activitieslist.is_custom as is_custom',
                    'activityItems.id as item_id',
                    'activityItems.Name as ItemName',
                    'activityItems.Type as ItemType',
                    'activityItems.symbole as ItemSymbole',
                    'calculationFormula.id as formula_id',
                    'calculationFormula.formulat'
                )
                ->get();

            // Regrouper les résultats par activité
            $groupedData = [];
            foreach ($activities as $row) {
                $activityId = $row->id;

                // Initialiser l'activité si elle n'existe pas encore
                if (!isset($groupedData[$activityId])) {
                    $groupedData[$activityId] = [
                        'activity_id' => $activityId,
                        'activity_name' => $row->actName,
                        'is_custom' => $row->is_custom,
                        'items' => [],
                        'formulat' => $row->formulat ? json_decode($row->formulat, true) : null,
                    ];
                }

                // Ajouter l'item à l'activité
                $groupedData[$activityId]['items'][] = [
                    'item_id' => $row->item_id,
                    'item_name' => $row->ItemName,
                    'symbole' => $row->ItemSymbole,
                    'type' => $row->ItemType,
                ];
            }

            // Convertir en tableau indexé
            $formattedData = array_values($groupedData);

            if (empty($formattedData)) {
                return response()->json(['message' => 'No activities found'], 404);
            }

            return response()->json([
                'message' => 'Activities retrieved successfully',
                'data' => $formattedData
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to retrieve activities',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
