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
        Schema::create('ActivityByLabo', function (Blueprint $table) {
            $table->id();
            $table->foreignId('laboId')->references("id")->on("labo");
            $table->foreignId('ActivityId')->references("id")->on("activitieslist");
            $table->year('year');

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
