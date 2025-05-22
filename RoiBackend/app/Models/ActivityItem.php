<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityItem extends Model
{
    use HasFactory;
    protected $table = 'activityItems';

    protected $fillable = [
        'Name',
        'ActivityId',
        'Type',
        'symbole'
    ];

    public function activity()
    {
        return $this->belongsTo(ActivitiesList::class, 'ActivityId');
    }

    public function itemValues()
    {
        return $this->hasMany(ActivityItemValue::class, 'ActivityItemId');
    }
}
