<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReportROI extends Model
{
    use HasFactory;

    protected $table = 'ReportROI'; // Nom de la table

    protected $fillable = [
        'laboId',
        'value',
        'year',
    ];

    /**
     * Relation avec la table Labo (Un rapport ROI appartient à un labo).
     */
    public function labo()
    {
        return $this->belongsTo(Labo::class, 'laboId');
    }
}
