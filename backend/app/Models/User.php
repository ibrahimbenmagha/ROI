<?php

namespace App\Models;

use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, Notifiable;

    protected $table = 'users';

    protected $fillable = [
        'FirstName',
        'LastName',
        'email',
        'password',
        'Role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Relation avec la table Labo (Un utilisateur peut avoir un labo).
     */
    public function labo()
    {
        return $this->hasOne(Labo::class, 'userId');
    }

    /**
     * Relation avec la table Admins (Un utilisateur peut être un admin).
     */
    public function admin()
    {
        return $this->hasOne(Admin::class, 'userId');
    }

    /**
     * Get the identifier that will be stored in the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey(); // Returning the primary key of the user
    }

    /**
     * Return the custom claims that should be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [
            'role' => $this->Role,  // Adding the role as a custom claim
        ];
    }
}
