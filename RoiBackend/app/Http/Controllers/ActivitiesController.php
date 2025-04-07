<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Helpers\JwtHelper; // Adjust the namespace as needed
use App\Models\ActivitiesList;
use App\Models\ActivityByLabo;
use App\Models\Labo;
use App\Models\ActivityItemValue;
use App\Models\ActivityItem;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Activity1_12;



class ActivitiesController extends Controller
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

            if (ActivityByLabo::where([
                ['ActivityId', $request->ActivityId],
                ['laboId', $laboId],
                ['year', $request->year]
            ])->exists()) {
                return response()->json([
                    'message' => 'Vous avez déjà comptabilisé cette activité pour cette année.'
                ], 409);
            }

            // Validate the request data
            $validated = $request->validate([
                'year' => 'required|integer',
                'ActivityId' => 'required|string',
                'otherActivity' => 'nullable|string'
            ]);

            // Get the ActivityId from the validated data
            $activityId = $validated['ActivityId'];

            // Handle the case where the activity is custom
            if ($activityId === "Autre activité" && !empty($validated['otherActivity'])) {
                $newActivity = Activitieslist::create([
                    'Name' => $validated['otherActivity'],
                    'is_custom' => true,
                ]);
                $activityId = $newActivity->id;

                // Create a new item for the custom activity
                $item = ActivityItem::create([
                    'Name' => "ROI",
                    'ActivityId' => $activityId,
                ]);
            }

            // Create the activity record
            $activity = ActivityByLabo::create([
                'year' => $validated['year'],
                'laboId' => $laboId,  // Use laboId from token
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
            ->where('is_calculated', false)
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
        $laboId = JWTHelper::getLaboId($request);
        if (!$laboId) {
            return response()->json([
                'message' => 'Information du laboratoire non trouvée dans le token.'
            ], 401);
        }

        $Activities = ActivityByLabo::where('laboId', $laboId)
            ->where('is_calculated', true)
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

    public function calculateDynamicROI(Request $request)
    {
        try {
            // Récupérer l'identifiant de l'activité par labo
            $activityByLaboId = $request->cookie('activityId');
    
            if (!$activityByLaboId) {
                return response()->json(['message' => 'Activity ID is missing.'], 400);
            }
    
            // Vérifier à quelle activité il correspond
            $activity = ActivityByLabo::find($activityByLaboId);
            if (!$activity) {
                return response()->json(['message' => 'Activity not found.'], 404);
            }
    
            $activityId = $activity->ActivityId; // ID dans activitylist (1 à 12)
    
            // Générer dynamiquement le nom de la méthode à appeler
            $method = "calculateROIAct_" . $activityId;
            $controller = new Activity1_12();

            // Vérifier que la méthode existe bien dans ce contrôleur
            if (!method_exists($controller, $method)) {
                return response()->json(['message' => "No calculation method defined for activity ID $activityId $method ."], 500);
            }
    
            // Appeler dynamiquement la bonne fonction
            return $controller->$method($request);
    
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur interne lors du calcul du ROI',
                'error' => $e->getMessage(),
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
        // $ActivityByLaboId = $request->cookie('activityId');
        $ActivityByLaboId = $request->cookie('activityId');

        try {
            // Suppression des valeurs liées à l'activité
            ActivityItemValue::where('id', $ActivityByLaboId)->delete();
            $UPDATE = ActivityByLabo::where('id', $ActivityByLaboId)
            ->update(['is_calculated' => false]);

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
        // $laboId = $request["laboId"];
        if (!$laboId) {
            return response()->json(['error' => 'Labo ID not found'], 400);
        }

        try {
            // DB:statement();
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
            $UPDATE = ActivityByLabo::where('laboId', $laboId)
                ->update(['is_calculated' => false]);
    
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
    
}
