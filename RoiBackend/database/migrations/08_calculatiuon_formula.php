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
        Schema::create('calculationFormula', function (Blueprint $table) {
            $table->bigIncrements("id");
            $table->foreignId('ActivityId')->references("id")->on("activitieslist");
            // $table->string("Name");
            $table->text("fomulat");  // Add this line for the 'mode' column
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('calculationFormula');
    }
};
