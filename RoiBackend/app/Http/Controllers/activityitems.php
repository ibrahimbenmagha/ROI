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


    public function getActivityItemsByActivityIdall(Request $request)
    {
        $activityId = $request->cookie('activityNumber') ?? $request["activityNumber"];

        if (empty($activityId) || $activityId === "undefined") {
            return response()->json(['error' => 'Activity ID not found'], 400);
        }

        $activityItems = ActivityItem::where('activityitems.ActivityId', $activityId)
            ->join('activitieslist', 'activityitems.ActivityId', '=', 'activitieslist.id')
            ->select(
                'activityitems.id',
                'activityitems.Name as itemName',
                'activityitems.symbole',
                'activityitems.Type',
                'activityitems.ActivityId',
                'activitieslist.Name as activityName',
                'activityitems.created_at',
                'activityitems.updated_at'
            )
            ->get();

        if ($activityItems->isEmpty()) {
            return response()->json(['error' => 'Les items n\'existent pas'], 404);
        }

        return response()->json([
            'items' => $activityItems,
            'activityName' => $activityItems->isNotEmpty() ? $activityItems->first()->activityName : null
        ]);
    }



}
