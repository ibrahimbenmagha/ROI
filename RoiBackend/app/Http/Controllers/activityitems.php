<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Models\activitieslist;
use App\Models\ActivityItem;

class activityitems extends Controller
{
    public function getActivityItems()
    {
        $activityItems = ActivityItem::all();
        return response()->json($activityItems);
    }

    public function getActivityItemById($id)
    {
        $activityItem = ActivityItem::find($id);
        if (!$activityItem) {
            return response()->json(['error' => 'L\'item n\'exist pas'], 404);
        }
        return response()->json($activityItem);
    }

    public function getActivityItemsByActivityId($activityId)
    {
        $activityItem = ActivityItem::where('ActivityId', $activityId)
            ->select('id')
            ->get();
        if (!$activityItem) {
            return response()->json(['error' => 'L\'item n\'exist pas'], 404);
        }
        return response()->json($activityItem);
    }



    

    public function getActivityItemsByActivityIdall($activityId)
    {
        $activityItem = ActivityItem::where('ActivityId', $activityId)->get();
        if (!$activityItem) {
            return response()->json(['error' => 'L\'item n\'exist pas'], 404);
        }
        return response()->json($activityItem);
    }
}
