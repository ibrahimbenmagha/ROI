<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Labo;
use App\Models\avtivitybylabo;

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

    public function GetAllLabos(){
        $labos = Labo::all();
        return response()->json($labos);
    }

    public function GetAllLaboInfos(Request $request){
        $LabosInfos= Labo::join('users', 'labo.userId', '=','users.id')
        ->select(
            'labo.Name','users.FirstName','users.LastName'
        )->get();
    return response()->json(['labos' => $LabosInfos], 200);
        
    }

    public function CreateActivityByLabo(Request $request){
        try{
            
        }
    }


}