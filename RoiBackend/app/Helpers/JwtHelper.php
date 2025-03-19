<?php


function get_token_user_data($token)
{
    try {
        // Add debug logging
        error_log("Token received: " . substr($token, 0, 20) . "...");
        
        // Decode the JWT token
        $tokenParts = explode('.', $token);
        if (count($tokenParts) != 3) {
            error_log("Token parts count incorrect: " . count($tokenParts));
            return null;
        }

        // Base64 decode the payload part
        $payload = base64_decode(str_replace(
            ['-', '_'],
            ['+', '/'],
            $tokenParts[1]
        ));
        
        $userData = json_decode($payload, true);
        
        // Debug the payload
        error_log("Decoded payload: " . json_encode($userData));
        
        // Check if labo_id exists
        if (!isset($userData['labo_id'])) {
            error_log("labo_id not found in token payload");
        }

        return $userData;
        
    } catch (\Exception $e) {
        error_log("Token parsing error: " . $e->getMessage());
        return null;
    }
}