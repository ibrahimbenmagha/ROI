<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Labo extends Model
{
    use HasFactory;

    protected $table = 'labo'; // Nom de la table

    protected $fillable = [
        'Name',
        'userId',
        'status',
        'valeur_patient_incremente'
    ];

    /**
     * Relation avec l'utilisateur (un labo appartient à un utilisateur).
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'userId');
    }
}
