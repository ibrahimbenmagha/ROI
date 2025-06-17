<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    
    public function up(): void
    {
        Schema::create('activityItems', function (Blueprint $table) {
            $table->id();
            $table->string('Name');
            $table->string('symbole')->nullable();
            $table->enum('Type',["percentage", "number"])->default(null);
            $table->float("benchmark_min")->nullable();
            $table->float("benchmark_max")->nullable();

            $table->foreignId('ActivityId')->references("id")->on("activitieslist");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
