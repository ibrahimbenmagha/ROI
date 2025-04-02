<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ActivityByLabo;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Helpers\JwtHelper; // Adjust the namespace as needed


class AuthController extends Controller
{

    public function __construct()
    {
        // $this->middleware('auth:api', ['except' => ['login']]);
    }

    public function checkActivity(Request $request)
    {
        $laboId = JWTHelper::getLaboId($request);
        $ActByLabo = $request->cookie('activityId');
        $activityNumber = $request->cookie('activityNumber');

        $activity = ActivityByLabo::find($ActByLabo);

        // Vérification des conditions selon votre logique
        if (!$activity || $activity->id != $ActByLabo || $activity->ActivityId != $activityNumber || $activity->laboId != $laboId) {
            return response()->json([
                'authorised' => false,
                "activity" =>  $activity->id,
                'ActByLabo' => $ActByLabo,
                "activityId" => $activity->activityId,
                "activityNumber"=> $activityNumber,
                "laboId_DB"=> $activity->laboId,
                "laboId"=> $laboId,
            ]);
        } else {
            return response()->json([
                'authorised' => true,
                'activityNumber' => $activityNumber,
                "a7a" => $activity
            ]);
        }
    }


    public function checkAuth(Request $request)
    {
        try {
            // Ton helper JWT vérifie déjà l'authentification
            $userData = JWTHelper::getTokenUserData($request);

            if (!$userData) {
                return response()->json([
                    'authenticated' => false,
                    'role' => null
                ]);
            }

            return response()->json([
                'authenticated' => true,
                'role' => $userData['user.Role'] ?? null,
                'laboId' => $userData['labo_id'] ?? null,
                // Ajoute d'autres informations si nécessaire
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'authenticated' => false,
                'role' => null,
                'error' => $e->getMessage()
            ]);
        }
    }

    public function login()
    {
        $credentials = request(['email', 'password']);

        if (!$token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        } else {
            $user = Auth::user();
            if ($user->Role == 'Laboratoire') {
                $laboratoire = DB::table('labo')->where('userId', $user->id)->first();
                $customToken = auth()->claims([
                    'labo_id' => $laboratoire ? $laboratoire->id : null,
                    'user.email' => $user->email,
                    'user.first_name' => $user->FirstName,
                    'user.last_name' => $user->LastName,
                    'user.Role' => $user->Role,
                    'labo.status' => $laboratoire->status,
                ])->refresh();
            } else if ($user->Role == 'Admin') {
                $customToken = auth()->claims([
                    'user.email' => $user->email,
                    'user.first_name' => $user->FirstName,
                    'user.last_name' => $user->LastName,
                    'user.Role' => $user->Role,
                ])->refresh();
            }
            return response()->json([
                'access_token' => $customToken,
                // 'role' => $user->Role,
            ], 200)
                ->cookie('access_token', $customToken, 60, '/', null, true, true);
        }
    }


    public function loginadmin()
    {
        $credentials = request(['email', 'password']);
        if (!$token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        } else {
            $user = Auth::user();
            if ($user->Role !== 'Admin') {
                return response()->json(['error' => 'Unauthorized'], 401);
            }
            return response()->json([
                'access_token' => $token,
                'user' => [
                    'id' => $user->id,
                    'Role' => $user->Role,
                ]
            ], 200)
                ->cookie('access_token', $token, 60, '/', null, true, true);
        }
    }



    public function me()
    {
        return response()->json(auth()->user());
    }


    public function logout(Request $request)
    {
        try {
            // Invalide le token actuel
            auth()->logout();
            $token = $request->cookie('access_token');
            JWTAuth::removeToken($token);
            return response()->json(['message' => 'Successfully logged out'], 200);
            //    ->cookie('access_token', '', -1, '/', null, true, true); // Supprime le cookie
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to logout, please try again. Error: ' . $e->getMessage()], 500);
        }
    }


    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }


    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60
        ]);
    }
}
