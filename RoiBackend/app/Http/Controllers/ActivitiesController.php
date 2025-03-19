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



class ActivitiesController extends Controller
{

    // public function CreateActivityByLabo(Request $request) //works
    // {
    //     try {

    //         if (ActivityByLabo::where([
    //             ['ActivityId', $request->ActivityId],
    //             ['laboId', $request->laboId],
    //             ['year', $request->year]
    //         ])->exists()) {
    //             return response()->json([
    //                 'message' => 'Vous avez déjà comptabilisé cette activité pour cette année.'
    //             ], 409);
    //         }
    //         $validated = $request->validate([
    //             'year' => 'required|integer',
    //             'laboId' => 'required|integer',
    //             'ActivityId' => 'required|string',
    //             'otherActivity' => 'nullable|string'
    //         ]);
    //         $activityId = $validated['ActivityId'];

    //         if ($activityId === "Autre activité" && !empty($validated['otherActivity'])) {
    //             $newActivity = Activitieslist::create([
    //                 'Name' => $validated['otherActivity'],
    //                 'is_custom' => true,
    //             ]);
    //             $activityId = $newActivity->id;
    //             $item = ActivityItem::create([
    //                 'Name' => "ROI",
    //                 'ActivityId' => $activityId,
    //             ]);
    //         }

    //         $activity = ActivityByLabo::create([
    //             'year' => $validated['year'],
    //             'laboId' => $request['laboId'],
    //             // 'laboId' => $laboId,

    //             'ActivityId' => $activityId,
    //         ]);
    //         return response()->json([
    //             'message' => "Activité créée avec succès.",
    //             'activity' => $activity
    //         ], 201);
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'message' => 'Échec de la création de l\'activité.',
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }


    public function CreateActivityByLabo(Request $request) {
        try {
            // $token = $request->bearerToken();
            $token = $request->cookie('access_token');

            
            $tokenData = get_token_user_data($token);
            
            if (!$tokenData || !isset($tokenData['labo_id'])) {
                return response()->json([
                    'message' => 'Information du laboratoire non trouvée dans le token.',$token
                ], 401);
            }
            
            // Retrieve laboId from the token data
            $laboId = $tokenData['labo_id'];
            
            // Check if the activity already exists for the laboId and year
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
        $id=$request['id']; 
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
        return response()->json( $ActivitiesByLaboInfos, 200);
    }

    public function getAllActivityByLaboInfosByLaboId(Request $request, $laboId)
    {
        $Activities = ActivityByLabo::where('laboId', $laboId)
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

        if ($Activities->isNotEmpty()) {
            return response()->json($Activities, 200);
        } else {
            return response()->json(['message' => 'No activities found for the given labo'], 404);
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
        $ActivityByLaboId = $request["ActivityByLaboId"];
        try {
            // Suppression des valeurs liées à l'activité
            ActivityItemValue::where('ActivityByLaboId', $ActivityByLaboId)->delete();

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
