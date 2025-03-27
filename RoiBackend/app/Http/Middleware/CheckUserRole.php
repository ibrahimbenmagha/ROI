<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Helpers\JwtHelper; 
class CheckUserRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        // Récupérer les données utilisateur via le JWTHelper
        $userData = JwtHelper::getTokenUserData($request);
    
        // Si pas de données utilisateur, refuser l'accès
        if (!$userData) {
            return response()->json([
                'error' => 'Authentification requise',
                'authenticated' => false
            ], 401);
        }
    
        // Récupérer le rôle de l'utilisateur
        $userRole = JwtHelper::getUserRole($request);
    
        // Vérifier si le rôle est autorisé
        if (!$userRole || !in_array($userRole, $roles)) {
            return response()->json([
                'error' => 'Accès non autorisé',
                'authenticated' => false,
                'role' => $userRole,
                'roles' => $roles
            ], 403);
        }
    
        // Ajouter les données utilisateur à la requête
        $request->merge(['userData' => $userData]);
    
        return $next($request);
    }
    
}