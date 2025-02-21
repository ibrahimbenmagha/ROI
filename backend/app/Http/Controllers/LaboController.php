<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Labo;
use App\Models\ActivityByLabo;

use Illuminate\Support\Facades\Hash;

class LaboController extends Controller
{
    public function CreateLabo(Request $request)
    {
        try {
            if (User::where('email', $request->email)->exists()) {
                return response()->json([
                    'message' => 'The email already exists'
                ], 409);
            }
            $validated = $request->validate([
                'FirstName' => 'required|string|max:20',
                'LastName' => 'required|string|max:20',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:6',
                'Name' => 'required|string|max:255',

            ]);
            $user = User::create([
                'FirstName' => $validated['FirstName'],
                'LastName' => $validated['LastName'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']), // Hash password before saving
                'Role' => 'Laboratoire',
            ]);
            $labo = Labo::create([
                'status' => "Activated",
                'userId' => $user->id,
                'Name' => $validated['Name'],
            ]);
            return response()->json([
                'message' => 'Labo user has been created successfully',
                'user' => $user
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function GetAllLabos()
    {
        $labos = Labo::all();
        return response()->json($labos);
    }

    public function GetAllLaboInfos(Request $request)
    {
        $LabosInfos = Labo::join('users', 'labo.userId', '=', 'users.id')
            ->select(
                'labo.Name',
                'users.FirstName',
                'users.LastName'
            )->get();
        return response()->json(['labos' => $LabosInfos], 200);

    }

    public function CreateActivityByLabo(Request $request)
    {
        try {
            // if (
            //     ActivityByLabo::where('ActivityId', $request->ActivityId &&
            //         'laboId', $request->laboId &&
            //         'year', $request->year)->exists()
            // ) {
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


    //     public function CreateActivityByLabo(Request $request)
// {
//     try {
//         // Validate input
//         $validated = $request->validate([
//             "year" => 'required|',
//             "laboId" => 'required|exists:labo,id',
//             "ActivityId" => 'required|exists:activitieslist,id',
//         ]);

    //         // Check if the activity already exists for the labo in the same year
//         if (ActivityByLabo::where('ActivityId', $request->ActivityId)
//             ->where('laboId', $request->laboId)
//             ->whereYear('year', date('Y', strtotime($validated['year'])))
//             ->exists()
//         ) {
//             return response()->json([
//                 'message' => 'You already counted the return of that activity for this year'
//             ], 409);
//         }

    //         // Create ActivityByLabo
//         $activityByLabo = ActivityByLabo::create([
//             "year" => $validated["year"],
//             "laboId" => $validated["laboId"],
//             "ActivityId" => $validated["ActivityId"],
//         ]);

    //         return response()->json([
//             "message" => "Activity created successfully",
//             "activity" => $activityByLabo
//         ], 201);
//     } catch (\Exception $e) {
//         return response()->json([
//             "message" => 'Failed to create activity',
//             "error" => $e->getMessage()
//         ], 500);
//     }
// }


}