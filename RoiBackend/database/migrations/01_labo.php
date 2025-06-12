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
        Schema::create('labo', function (Blueprint $table) {
            $table->id("id");
            $table->string('Name');
            $table->foreignId('userId')->references("id")->on("users");
            $table->float("valeur_patient_incremente")->nullable(true);
            $table->string("status");
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
