<?php

    function get_token_user_data($token)
    {
        try {
            // Decode the JWT token
            $tokenParts = explode(',', $token);
            if (count($tokenParts) != 3) {
                return null;
            }
            
            $payload = base64_decode($tokenParts[1]);
            $userData = json_decode($payload, true);
            
            // Check if the token has the required data
            if (isset($userData['user_id']) && isset($userData['labo_id'])) {
                return $userData;
            }
            
            return null;
        } catch (\Exception $e) {
            return null;
        }
    
}