<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityItem extends Model
{
    use HasFactory;

    protected $table = 'activityItems'; // Nom de la table

    protected $fillable = [
        'Name',
        'ActivityId',
    ];

    /**
     * Relation avec la table ActivitiesList (une activité contient plusieurs items).
     */
    public function activity()
    {
        return $this->belongsTo(ActivitiesList::class, 'ActivityId');
    }

    /**
     * Relation avec ActivityItemsValue (chaque item peut avoir plusieurs valeurs).
     */
    public function itemValues()
    {
        return $this->hasMany(ActivityItemValue::class, 'ActivityItemId');
    }
}
