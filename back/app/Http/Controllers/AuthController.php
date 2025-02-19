<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{

    // public function __construct()
    // {
    //     // Middleware to protect routes with authentication, excluding login and register routes
    //     $this->middleware('auth:api', ['except' => ['login', 'register']]);
    // }



    public function Create_Admin(Request $request)
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
        'PSW' => 'required|string|min:6',
    ]);
    $user = User::create([
        'FirstName' => $validated['FirstName'],
        'LastName' => $validated['LastName'],
        'email' => $validated['email'],
        'PSW' => hash::make($validated['PSW']),
        'Role' => 'admin', 
    ]);
    
            return response()->json([
                'message' => 'User created successfully',
                'user' => $user
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create user',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    // public function login(Request $request)
    // {
    //     $credentials = $request->only(['email', 'PSW']);

    //     // Attempt to authenticate the user
    //     if (!$token = JWTAuth::attempt($credentials)) {
    //         return response()->json(['error' => 'Unauthorized'], 401);
    //     }

    //     return $this->respondWithToken($token);
    // }
    
    public function login()
    {
        $credentials = request(['email', 'PSW']);

        if (!$token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $this->respondWithToken($token);
    }

    public function me()
    {
        // Get authenticated user details
        return response()->json(auth()->user());
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout(); // Invalidate the token
        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        // Refresh and return new token
        return $this->respondWithToken(auth()->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        // Respond with token and its expiry time
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60
        ]);
    }
}
