<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ActivitiesList;
use App\Models\ActivityByLabo;

class ActivitiesController extends Controller
{
    public function getAllActivity(){
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


    
}
