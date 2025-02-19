<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    use HasFactory;

    protected $table = 'admins'; // Nom de la table

    protected $fillable = [
        'userId',
    ];

    /**
     * Relation avec l'utilisateur (un admin est un utilisateur).
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'userId');
    }
}
