<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{

    public function __construct()
    {
        // $this->middleware('auth:api', ['except' => ['login']]);
    }
    
    public function login()
    {
        $credentials = request(['email', 'password']);
    
        if (!$token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        } else {
            $user = Auth::user();
            if ($user->Role !== 'Laboratoire') {
                return response()->json(['error' => 'Unauthorized'], 401);
            }
            $laboratoire = DB::table('labo')->where('userId', $user->id)->first();
            $customToken = auth()->claims([
                'labo_id' => $laboratoire ? $laboratoire->id : null,
                'user.email' => $user->email,
                'user.first_name' => $user->FirstName,
                'user.last_name' => $user->LastName,
                'user.Role' => $user->Role,
                'labo.status' => $laboratoire->status,
                ])->refresh();

            return response()->json([
                'access_token' => $customToken,
                'user' => [
                    'id' => $user->id,
                    'Role' => $user->Role,
                    'FirstName' => $user->FirstName,
                    'LastName' => $user->LastName,
                    'laboratoire_id' => $laboratoire ? $laboratoire->id : null,
                ]
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


    public function logout()
    {
        auth()->logout();
        
        return response()->json(['message' => 'Successfully logged out'], 200)
            ->cookie('access_token', '', -1, '/', null, true, true); // Remove the cookie by setting an expired date
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
