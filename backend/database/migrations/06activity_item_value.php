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
        Schema::create('activityItemValues', function (Blueprint $table) {
            $table->bigIncrements("id");
            $table->foreignId('activityItemId')->references("id")->on("activityItems");
            $table->foreignId('ActivityByLaboId')->references("id")->on("ActivityByLabo");
            $table->float('value');
            $table->date('year');
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
