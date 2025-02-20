<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityByLabo extends Model
{
    use HasFactory;

    protected $table = 'ActivityByLabo'; // Nom de la table

    protected $fillable = [
        'laboId',
        'ActivityId',
        'year',
    ];

    /**
     * Relation avec la table Labo (Un labo peut avoir plusieurs activités).
     */
    public function labo()
    {
        return $this->belongsTo(Labo::class, 'laboId');
    }

    /**
     * Relation avec la table ActivitiesList (Une activité peut être assignée à plusieurs labos).
     */
    public function activity()
    {
        return $this->belongsTo(ActivitiesList::class, 'ActivityId');
    }

    /**
     * Relation avec ActivityItemsValue (Un ActivityByLabo peut avoir plusieurs valeurs d'items).
     */
    public function itemValues()
    {
        return $this->hasMany(ActivityItemValue::class, 'ActyvityByLaboId');
    }
}
