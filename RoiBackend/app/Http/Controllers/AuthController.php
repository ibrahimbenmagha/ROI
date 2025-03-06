<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

class AuthController extends Controller
{

    public function __construct()
    {
        // $this->middleware('auth:api', ['except' => ['login']]);
    }


    public function login(){
        $credentials = request(['email', 'password']);

        if (!$token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Store the token in a cookie (e.g., 'token')
        $cookie = cookie('token', $token, 60 * 24); // Store token for 24 hours

        return response()->json([$token])
            ->withCookie($cookie); // Attach the cookie to the response
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