<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ActivitiesList;
use App\Models\ActivityByLabo;

class ActivitiesController extends Controller
{

    public function CreateActivityByLabo(Request $request)
    {
        try {

            if (
                ActivityByLabo::where([
                    ['ActivityId', $request->ActivityId],
                    ['laboId', $request->laboId],
                    ['year', $request->year]
                ])->exists()
            ) {
                return response()->json([
                    'message' => 'You alreaddy counted the return of that activity'
                ], 409);
            }
            $validated = $request->validate([
                "year" => 'required',

            ]);
            $avtivitybylabo = ActivityByLabo::create([
                "year" => $validated["year"],
                "laboId" => $request->laboId,
                "ActivityId" => $request->ActivityId,
            ]);
            return response()->json([
                "message" => "You creatd"
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                "message" => 'Failed to create activity',
                "error" => $e->getMessage()
            ], 500);
        }
    }
    public function getAllActivity()
    {
        $Activities = ActivitiesList::all();
        return response()->json($Activities);
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
        return response()->json(['ActivitiesByLaboInfos' => $ActivitiesByLaboInfos], 200);
    }

    public function getActivitiesByLaboInfosById(Request $request, $id)
    {
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
        return response()->json(['ActivitiesByLaboInfos' => $ActivitiesByLaboInfos], 200);
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
            return response()->json(['activities' => $Activities], 200);
        } else {
            return response()->json(['message' => 'No activities found for the given labo'], 404);
        }
    }




}
