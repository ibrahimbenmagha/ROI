<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Models\User;


class AuthController extends Controller
{

    public function __construct()
    {
        // $this->middleware('auth:api', ['except' => ['login']]);
    }



    // public function login()
    // {
    //     $credentials = request(['email', 'password']);
    //     if (!$token = auth()->attempt($credentials)) {
    //         return response()->json(['error' => 'Unauthorized'], 401);
    //     } else {
    //         $user = Auth::user();
    //         return response()->json([
    //             'access_token' => $token,
    //             'user' => [
    //                 'id' => $user->id,
    //                 'Role' => $user->Role,
    //             ]
    //         ], 200)
    //             ->cookie('access_token', $token, 60, '/', null, true, true);
    //     }
    // }


    public function login()
    {
        $credentials = request(['email', 'password']);

        // Attempt to authenticate the user
        if (!$token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        } else {
            // Get the authenticated user
            $user = Auth::user();

            // Check if the user's role is "Laboratoire"
            if ($user->Role !== 'Laboratoire') {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            return response()->json([
                'access_token' => $token,
                'user' => [
                    'id' => $user->id,
                    'Role' => $user->Role,
                    'FirstName' => $user->FirstName,
                    'LastName' => $user->LastName,
                ]
            ], 200)
                ->cookie('access_token', $token, 60, '/', null, true, true);
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


    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'Successfully logged out']);
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
