<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityItemValue extends Model
{
    use HasFactory;

    protected $table = 'activityItemValues'; // Nom de la table

    protected $fillable = [
        'activityItemId',
        'ActivityByLaboId',
        'value',
        'year',
    ];

    /**
     * Relation avec la table ActivityItems (Un item appartient à une activité spécifique).
     */
    public function activityItem()
    {
        return $this->belongsTo(ActivityItem::class, 'activityItemId');
    }

    /**
     * Relation avec ActivityByLabo (Une valeur appartient à une activité spécifique d'un labo).
     */
    public function activityByLabo()
    {
        return $this->belongsTo(ActivityByLabo::class, 'ActivityByLaboId');
    }
}
