<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\ActivitiesList;
use Illuminate\Support\Facades\DB;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        DB::table('activitieslist')->insert([
            
                ['Name' => 'Distribution des échantillons'],
                ['Name' => 'Essai clinique'],
                ['Name' => 'Mailing'],
                ['Name' => 'Conférences'],
                ['Name' => 'Tables rondes'],
                ['Name' => 'Visites médicales'],
                ['Name' => 'Publicité directe au consommateur'],
                ['Name' => 'Publicité directe au consommateur en ligne'],
                ['Name' => 'Publicité dans les revues'],
                ['Name' => 'Générique (Médecins)'],
                ['Name' => 'Générique (Patients)'],
                ['Name' => 'Promotion numérique pour les médecins'],
            
        ]);
    }
}
