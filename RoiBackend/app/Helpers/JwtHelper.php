<?php


// function get_token_user_data($token)
// {
//     try {
//         // Add debug logging
//         error_log("Token received: " . substr($token, 0, 20) . "...");
        
//         // Decode the JWT token
//         $tokenParts = explode('.', $token);
//         if (count($tokenParts) != 3) {
//             error_log("Token parts count incorrect: " . count($tokenParts));
//             return null;
//         }

//         // Base64 decode the payload part
//         $payload = base64_decode(str_replace(
//             ['-', '_'],
//             ['+', '/'],
//             $tokenParts[1]
//         ));
        
//         $userData = json_decode($payload, true);
        
//         // Debug the payload
//         error_log("Decoded payload: " . json_encode($userData));
        
//         // Check if labo_id exists
//         if (!isset($userData['labo_id'])) {
//             error_log("labo_id not found in token payload");
//         }

//         return $userData;
        
//     } catch (\Exception $e) {
//         error_log("Token parsing error: " . $e->getMessage());
//         return null;
//     }
// }



namespace App\Helpers;

use Illuminate\Http\Request;

class JWTHelper
{
    public static function getLaboId(Request $request)
    {
        try {
            $userData = self::getTokenUserData($request);
            return $userData['labo_id'] ?? null;
        } catch (\Exception $e) {
            return null;
        }
    }
    public static function getTokenUserData(Request $request)
    {
        try {
            if ($request === null) {
                $request = request();
            }

            $token = $request->cookie('access_token') ?? $request->bearerToken();
            if (!$token) {
                return null;
            }
            return self::parseToken($token);
        } catch (\Exception $e) {
            return null;
        }
    }

    private static function parseToken($token)
    {
        $tokenParts = explode('.', $token);
        if (count($tokenParts) != 3) {
            return null;
        }
        $payload = base64_decode(str_replace(
            ['-', '_'],
            ['+', '/'],
            $tokenParts[1]
        ));
        return json_decode($payload, true);
    }

    public static function getUserRole(Request $request)
    {
        try {
            $userData = self::getTokenUserData($request);
            return $userData['user.Role'] ?? null;
        } catch (\Exception $e) {
            return null;
        }
    }

    public static function getUserEmail(Request $request)
    {
        try {
            $userData = self::getTokenUserData($request);
            return $userData['user.email'] ?? null;
        } catch (\Exception $e) {
            return null;
        }
    }

    public static function getUserFullName(Request $request)
    {
        try {
            $userData = self::getTokenUserData($request);
            $firstName = $userData['user.first_name'] ?? '';
            $lastName = $userData['user.last_name'] ?? '';
            if ($firstName || $lastName) {
                return trim($firstName . ' ' . $lastName);
            }
            return null;
        } catch (\Exception $e) {
            return null;
        }
    }

    public static function isLaboActivated(Request $request)
    {
        try {
            $userData = self::getTokenUserData($request);
            return ($userData['labo.status'] ?? '') === 'Activated';
        } catch (\Exception $e) {
            return false;
        }
    }
}