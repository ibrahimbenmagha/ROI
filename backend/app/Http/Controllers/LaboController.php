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

    public function GetAllLabosInfos(Request $request)
    {
        $LabosInfos = Labo::join('users', 'labo.userId', '=', 'users.id')
            ->select(
                'labo.Name',
                'users.FirstName',
                'users.LastName'
            )->get();
        return response()->json(['labos' => $LabosInfos], 200);

    }

    public function GetLaboInfosByLaboId(Request $request, $laboId)
    {
        $LaboInfo = Labo::join('users', 'labo.userId', '=', 'users.id')
            ->select(
                'labo.id',
                'labo.Name',
                'users.FirstName',
                'users.LastName'
            )
            ->where('labo.id', $laboId)
            ->first();

        if ($LaboInfo) {
            return response()->json(['labo' => $LaboInfo], 200);
        } else {
            return response()->json(['message' => 'Labo not found'], 404);
        }
    }

    public function GetAllLaboNames()
    {
        $LaboNames = Labo::select('Name')->select(
            'id',
            'Name',);
        return response()->json(['labNames' => $LaboNames], 200);
    }

    public function GetLaboInfoByLabName(Request $request, $Name)
    {
        $LaboInfo = Labo::join('users', 'labo.userId', '=', 'users.id')
            ->select(
                'labo.id',
                'labo.Name',
                'labo.status',
                'users.FirstName',
                'users.LastName'
            )
            ->where('labo.Name', $Name)
            ->first();

        if ($LaboInfo) {
            return response()->json(['labo' => $LaboInfo], 200);
        } else {
            return response()->json(['message' => 'Labo not '], 501);
        }

    }

    public function GetLaboByLabName(Request $request, $labName)
    {
        $LaboInfo = Labo::where('labo.Name', $labName)->get();
        if ($LaboInfo) {
            return response()->json(['labo' => $LaboInfo], 200);
        } else {
            return response()->json(['message' => 'Labo not found'], 404);
        }
    }



    





}