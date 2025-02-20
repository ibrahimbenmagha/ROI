<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ActivitiesList;

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


    
}
