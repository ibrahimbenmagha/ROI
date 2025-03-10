<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivitiesList extends Model
{
    use HasFactory;

    protected $table = 'activitieslist'; // Nom de la table

    protected $fillable = [
        'Name',
        'is_custom'
    ];

    /**
     * Relation avec les éléments d'activité.
     */
    public function activityItems()
    {
        return $this->hasMany(ActivityItem::class, 'ActivityId');
    }

    /**
     * Relation avec les activités des labos.
     */
    public function activityByLabos()
    {
        return $this->hasMany(ActivityByLabo::class, 'ActivityId');
    }
}

