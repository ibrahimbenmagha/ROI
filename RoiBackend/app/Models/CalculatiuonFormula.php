<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CalculationFormula extends Model
{
    use HasFactory;

    // Specify the table name (optional, if it differs from the default)
    protected $table = 'calculationFormula';

    // Define the fillable attributes (fields that can be mass assigned)
    protected $fillable = [
        'ActivityId',
        'formulat',
        ];

    // Define any relationships if needed (e.g., Activity model relationship)
    public function activity()
    {
        return $this->belongsTo(ActivitiesList::class, 'ActivityId');
    }

    // If you want to handle timestamps manually, you can disable auto timestamps (optional)
    public $timestamps = true;
}
